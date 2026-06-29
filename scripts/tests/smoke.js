#!/usr/bin/env node
const assert = require('assert');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const yauzl = require('yauzl');
const { root } = require('../lib/repo-root');
const { runCommand } = require('../lib/command-runner');
const { existingArtifacts } = require('../lib/theme-utils');
const { applyModelOutput, parseExactFileBlocks, validateAssetManifest } = require('../lib/model-output');
const { ollamaStageSequence, resolveOllamaBatchesForDirectory, SHARED_GLOBAL_REQUIREMENTS, TEMPLATE_OWNED_PROMPT_SECTIONS, validateStagePlan } = require('../lib/ollama-batches');
const { assertCoverage, buildCoverage, expandStageRequirementIds, parsePromptContract, promptSizeManifest, selectPromptRequirements, selectPromptSections } = require('../lib/prompt-contract');
const { codexExecArgs } = require('../lib/model-access');
const { createBrief, repoSnapshot, snapshotDiff } = require('../providers/codex');
const { batchPromptParts } = require('../providers/ollama');
const { buildTimingSummary, formatDuration, verifyFrozenSource } = require('../run-theme-workflow');

const slug = '999_nolan_young_theme_architecture_smoke';
const prompt = 'prompts/templates/NOLAN-YOUNG-PROMPT-6-19-2026.md';
const template = 'nolan-young-theme-template-01';
const removedFolders = [
  'scripts/ai-output/',
  'scripts/briefs/',
  'scripts/build/',
  'scripts/environment/',
  'scripts/modes/',
  'scripts/template-theme-copy/',
  'scripts/theme-cleanup/',
  'scripts/theme-preview/',
  'scripts/theme-zipping/',
  'scripts/validation/',
  'scripts/workflow/'
];

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function mustRun(command, args, options = {}) {
  const result = runCommand(command, args, { echo: false, ...options });
  if (result.status !== 0) {
    process.stdout.write(result.stdout || '');
    process.stderr.write(result.stderr || result.error || '');
    fail(`${command} ${args.join(' ')} failed.`);
  }
  return result;
}

function mustRunJson(command, args) {
  const temp = path.join(os.tmpdir(), `theme-factory-dry-run-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
  fs.mkdirSync(path.dirname(temp), { recursive: true });
  execFileSync('bash', ['-lc', `${[command, ...args].map((item) => `'${String(item).replace(/'/g, "'\\''")}'`).join(' ')} > '${temp}'`], { cwd: root, stdio: 'pipe' });
  const parsed = JSON.parse(fs.readFileSync(temp, 'utf8'));
  fs.rmSync(temp, { force: true });
  return parsed;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function cleanup() {
  runCommand('node', [path.join(root, 'scripts', 'delete-theme.js'), '--theme-slug', slug, '--yes', '--skip-gallery'], { echo: false });
}

function snapshot(dir) {
  const map = new Map();
  for (const file of walk(dir)) {
    const stat = fs.statSync(file);
    map.set(path.relative(dir, file).replace(/\\/g, '/'), `${stat.size}:${Math.round(stat.mtimeMs)}`);
  }
  return map;
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function assertSameSnapshot(before, after, label) {
  assert.deepStrictEqual([...after.entries()].sort(), [...before.entries()].sort(), `${label} modified theme source`);
}

function assertThrowsMessage(fn, pattern, label) {
  let thrown = null;
  try {
    fn();
  } catch (error) {
    thrown = error;
  }
  assert(thrown, `${label} did not throw`);
  assert(pattern.test(thrown.message), `${label} threw "${thrown.message}"`);
}

function zipEntries(zipPath) {
  return new Promise((resolve, reject) => {
    const entries = [];
    yauzl.open(zipPath, { lazyEntries: true }, (error, zipfile) => {
      if (error) return reject(error);
      zipfile.readEntry();
      zipfile.on('entry', (entry) => {
        entries.push(entry.fileName.replace(/\\/g, '/'));
        zipfile.readEntry();
      });
      zipfile.on('end', () => resolve(entries));
      zipfile.on('error', reject);
    });
  });
}

async function main() {
  cleanup();
  const templateDir = path.join(root, 'wordpress-themplate-themes', template);
  const batches = resolveOllamaBatchesForDirectory(templateDir);
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const expectedCommands = ['theme:run', 'theme:resume', 'theme:prepare', 'theme:validate', 'theme:build', 'theme:preview', 'theme:preview:index', 'theme:zip', 'theme:delete', 'theme:env', 'theme:model-check', 'test:scripts'];
  for (const command of expectedCommands) {
    assert(packageJson.scripts[command], `Missing npm script ${command}`);
    const match = packageJson.scripts[command].match(/^node\s+([^\s]+)/);
    assert(match, `${command} must use node`);
    assert(fs.existsSync(path.join(root, match[1])), `${command} points to missing ${match[1]}`);
  }

  const jsFiles = walk(path.join(root, 'scripts')).filter((file) => file.endsWith('.js'));
  for (const file of jsFiles) mustRun('node', ['--check', file]);

  const activeTextFiles = [
    ...walk(path.join(root, 'scripts')),
    path.join(root, 'package.json'),
    path.join(root, 'README.md'),
    path.join(root, 'scripts', 'README.md'),
    path.join(root, 'docs', 'AI-WORKFLOW.md'),
    path.join(root, 'AGENTS.md')
  ].filter((file) => fs.existsSync(file) && /\.(js|json|md)$/.test(file));
  for (const file of activeTextFiles) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    if (rel === 'scripts/tests/smoke.js') continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const folder of removedFolders) assert(!text.includes(folder), `${rel} references removed folder ${folder}`);
    assert(!/codex\.repair-brief\.md|codex-repair|repair_attempt|max_repair|targeted repair|automatic repair/i.test(text), `${rel} references removed repair behavior`);
    assert(!/codex-repair-pending|repair-pending|targeted_repairs/.test(text), `${rel} references repair state`);
  }
  const runner = fs.readFileSync(path.join(root, 'scripts', 'run-theme-workflow.js'), 'utf8');
  const prepareText = fs.readFileSync(path.join(root, 'scripts', 'prepare-theme.js'), 'utf8');
  const previewText = fs.readFileSync(path.join(root, 'scripts', 'preview-theme.js'), 'utf8');
  assert(!/npm['"],\s*\['run',\s*'dev'/.test(runner), 'Workflow starts npm run dev');
  assert(!/package\.json[\s\S]{0,120}writeFileSync/.test(runner), 'Workflow rewrites generated package.json');
  assert(!/validation\.draft|validationPath/.test(runner), 'Hybrid workflow passes draft validation to Codex');
  assert(prepareText.includes('WALK_IGNORED_DIRECTORIES') && /fs\.cpSync[\s\S]+filter/.test(prepareText), 'Template preparation does not filter ignored directories during copy');
  assert(previewText.includes('retryPreviewFs') && previewText.includes('EPERM'), 'Preview replacement lacks Windows-safe retry handling');
  assert(runner.includes("'run-timing'") && runner.includes('`${prefix}.json`'), 'Workflow does not write reusable run timing JSON');
  assert(runner.includes('`${prefix}.md`'), 'Workflow does not write readable run timing log');
  assert(runner.includes("'resume-timing'"), 'Resume timing output is not separated from generation timing');
  assert.strictEqual(formatDuration(184000), '3m 4s', 'Duration formatter produced an unexpected label');
  const timingProbe = buildTimingSummary({
    mode: 'ollama-only',
    status: 'completed',
    theme_slug: slug,
    template_name: template,
    template_source_path: '',
    prompt_file: prompt,
    started_at: '2026-06-27T07:04:59.000Z',
    ended_at: '2026-06-27T07:08:03.000Z',
    requested: { ollama_model: 'qwen2.5-coder:14b', codex_model: 'gpt-5.4', codex_reasoning: 'medium' },
    resolved: { ollama_model: 'qwen2.5-coder:14b', codex_model: '', codex_reasoning: '' },
    steps: [{ name: 'ollama-generation', status: 'passed', started_at: '2026-06-27T07:05:02.000Z', ended_at: '2026-06-27T07:05:30.000Z', duration_ms: 28000 }]
  });
  assert.strictEqual(timingProbe.total_duration, '3m 4s', 'Run timing summary total duration is wrong');
  assert.strictEqual(timingProbe.steps[0].model, 'qwen2.5-coder:14b', 'Run timing summary does not carry the Ollama model onto generation steps');

  const modelOutputText = fs.readFileSync(path.join(root, 'scripts', 'lib', 'model-output.js'), 'utf8');
  const ollamaProviderText = fs.readFileSync(path.join(root, 'scripts', 'providers', 'ollama.js'), 'utf8');
  assert(ollamaProviderText.includes('ollama-stage-timing.json'), 'Ollama provider does not write per-stage timing output');
  assert(!/requiredFiles:\s*\[\s*\.\.\.new Set\(\[\s*\.\.\.\(batch\.files/.test(ollamaProviderText), 'Ollama provider promotes optional files into required files');
  assert(/optionalFiles:\s*batch\.optionalFiles\s*\|\|\s*\[\]/.test(ollamaProviderText), 'Ollama provider does not pass optional files through to applyModelOutput');
  for (const forbidden of [
    /sanitizeRemoteReferences/,
    /sanitizeScaffoldOnlyCopy/,
    /scssFallbackValue/,
    /completion styles/i,
    /ensureUniquePhpFunctionNames/,
    /salvage/,
    /kept existing template file/,
    /phpSyntaxIsValid/,
    /normalizePhpTemplateContent/
  ]) {
    assert(!forbidden.test(modelOutputText), `model-output.js contains prohibited behavior: ${forbidden}`);
  }
  for (const batch of batches) {
    assert(Array.isArray(batch.files), `${batch.name} missing writable file allowlist`);
    assert(batch.files.length > 0 || (batch.optionalFiles || []).length > 0 || (batch.allowedPatterns || []).length > 0, `${batch.name} missing writable file allowlist`);
    assert('readonly' in batch || 'readonlyDirectories' in batch, `${batch.name} missing read-only context declaration`);
    assert(Array.isArray(batch.promptSections) && batch.promptSections.length > 0, `${batch.name} missing prompt section ownership`);
  }
  assert.doesNotThrow(() => validateStagePlan(batches), 'Valid stage plan failed validation');
  const interactiveBatch = batches.find((batch) => batch.name === 'interactive-assets');
  if (interactiveBatch) assert(!interactiveBatch.readonly.some((file) => interactiveBatch.files.includes(file)), 'interactive-assets has writable/read-only conflict');
  assertThrowsMessage(() => validateStagePlan([{ name: 'bad', files: ['a.php'], optionalFiles: ['a.php'], readonly: [] }]), /required file is also optional/, 'Required/optional conflict validation');
  assertThrowsMessage(() => validateStagePlan([{ name: 'bad', files: ['a.php'], readonly: ['a.php'] }]), /required file is also read-only/, 'Writable/read-only conflict validation');
  const productionPrompt = path.join(root, prompt);
  const contract = parsePromptContract(productionPrompt);
  assert.deepStrictEqual(contract.sections.map((section) => section.number), ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'], 'Production prompt sections 01-15 were not discovered');
  assert(contract.sections.every((section) => section.text.includes(`## ${section.number}.`)), 'Prompt section exact text was trimmed');
  const templateOwnedRequirements = expandStageRequirementIds(contract, { name: 'template-owned', promptSections: TEMPLATE_OWNED_PROMPT_SECTIONS });
  const coverage = buildCoverage(contract, batches, templateOwnedRequirements);
  assert(coverage.passed, `Prompt coverage failed: ${JSON.stringify(coverage.uncovered_requirements)}`);
  assertCoverage(coverage);
  assert(coverage.all_features.length > 0, 'Prompt features were not parsed');
  assertThrowsMessage(() => assertCoverage(buildCoverage(contract, [{ name: 'bad', files: ['a.php'], readonly: [], promptRequirements: ['07-not-real'] }])), /nonexistent prompt requirement/, 'Nonexistent requirement coverage');
  assertThrowsMessage(() => assertCoverage(buildCoverage(contract, [])), /01-business-name|12-homepage-section-01/, 'Subsection/feature coverage enforcement');
  assert(coverage.all_subsections.length > 0, 'Prompt subsections were not parsed');
  const selected07 = selectPromptSections(contract, ['07']);
  assert(selected07.startsWith('## 07.'), 'Selected section did not preserve exact section heading');
  assert(!selected07.includes('## 08.'), 'Selected prompt section includes unrelated numbered section');
  assertThrowsMessage(() => selectPromptSections(contract, ['07', '07']), /Duplicate prompt section/, 'Duplicate section selection');
  const ollamaWritableFiles = batches.flatMap((batch) => batch.files).sort();
  const expectedVisibleOllamaFiles = [
    'footer.php',
    'front-page.php',
    'header.php',
    'page-templates/template-about-us.php',
    'page-templates/template-blog-landing.php',
    'page-templates/template-blog.php',
    'page-templates/template-contact.php',
    'page-templates/template-service-detail.php',
    'page-templates/template-services.php',
    'page-templates/template-single-service.php',
    'page-templates/template-work.php',
    'searchform.php',
    'template-parts/footer/footer-widgets.php',
    'template-parts/front-page/content-all-services.php',
    'template-parts/front-page/content-blog-preview.php',
    'template-parts/front-page/content-featured-work.php',
    'template-parts/front-page/content-process.php',
    'template-parts/front-page/content-service-highlight.php',
    'template-parts/front-page/content-single-service-highlight.php',
    'template-parts/front-page/content-style-pillars.php',
    'template-parts/front-page/content-testimonials.php',
    'template-parts/global/content-brand-statement.php',
    'template-parts/global/content-cta-banner.php',
    'template-parts/global/content-hero.php',
    'template-parts/header/mobile-navigation.php',
    'template-parts/header/primary-navigation.php',
    'template-parts/header/site-branding.php'
  ].sort();
  assert(batches.some((batch) => batch.name === 'front-page-assembly' && batch.files.includes('front-page.php')), 'Homepage assembly must be Ollama-owned');
  assert.deepStrictEqual(ollamaWritableFiles, expectedVisibleOllamaFiles, 'Ollama-only stage plan must own the visible theme surface');
  assert(!batches.some((batch) => /^wordpress-templates(?:-|$)/.test(batch.name)), 'WordPress templates should remain template-owned');
  assert(batches.some((batch) => /^page-templates(?:-|$)/.test(batch.name)), 'Page templates should be Ollama-owned');
  assert(
    batches.filter((batch) => /^foundation-core(?:-|$)/.test(batch.name)).every((batch) => batch.files.length <= 1),
    'Foundation stages were not reduced to the default file cap'
  );
  assert(
    batches.every((batch) => !batch.files.some((file) => file === 'functions.php' || file === 'style.css' || file === 'webpack.config.js' || file.startsWith('build/') || /^package(?:-lock)?\.json$/.test(file))),
    'Deterministic support/build files should not be AI-owned writable files'
  );
  assert(
    batches.every((batch) => !batch.files.some((file) => /^assets\/css\/[^/]+\.css$/i.test(file))),
    'Compiled CSS bundle outputs should not be AI-owned writable files'
  );
  assert(
    batches.every((batch) => !batch.files.some((file) => /^assets\//.test(file) || /\.(css|scss|sass|js|mjs|cjs|ts|tsx)$/i.test(file))),
    'Prepared assets, styles, and scripts should remain template/build-owned'
  );
  assert(
    batches.every((batch) => !/^foundation-core/.test(batch.name)),
    'Foundation core should remain template-owned'
  );
  assert(
    batches.every((batch) => !batch.files.some((file) => /ny_service|service_category/.test(file) && /^[^/]+\.php$/.test(file))),
    'Service top-level wrappers should remain template-owned'
  );
  assert(!batches.some((batch) => batch.files.some((file) => file.startsWith('template-parts/content/'))), 'Content template parts should remain template-owned');
  assert(
    ['header.php', 'footer.php', 'front-page.php'].every((file) => ollamaWritableFiles.includes(file)),
    'Header, footer, and front-page wrappers should be Ollama-owned'
  );
  assert(
    batches.every((batch) => !batch.files.includes('inc/navigation.php') && !batch.files.some((file) => /^template-parts\/header\/mega-menu-/.test(file))),
    'Complex navigation scaffold should remain template-owned, not Ollama-owned'
  );
  assert(
    ['template-parts/global/content-brand-statement.php', 'template-parts/front-page/content-featured-work.php'].every((file) => ollamaWritableFiles.includes(file)),
    'Known structural homepage sections should be Ollama-owned'
  );
  assert(
    expectedVisibleOllamaFiles.filter((file) => file.startsWith('page-templates/')).every((file) => ollamaWritableFiles.includes(file)),
    'Required visible page templates should be Ollama-owned'
  );
  assert(templateOwnedRequirements.some((requirement) => String(requirement).startsWith('14')), 'Documentation requirements are not template-owned');
  assert(templateOwnedRequirements.some((requirement) => String(requirement).startsWith('13')), 'Image requirements are not template-owned');
  const oversized = promptSizeManifest({ creativeText: 'x'.repeat(200), sharedText: '', requiredWritableFiles: [], optionalWritableFiles: [], readonlyFiles: [], protocolText: '', finalPrompt: 'x'.repeat(200) }, 100);
  assert.strictEqual(oversized.within_budget, false, 'Oversized prompt budget did not fail preflight calculation');
  const promptText = fs.readFileSync(productionPrompt, 'utf8');
  for (const pattern of [/x1\b/, /x2\b/, /x3\b/, /x4\b/, /x5\b/, /x6\b/, /FILL IN HERE/, /ADD OTHER IS NEEDED/, /theme \.\.\.\?\?\?/, /example\.com\/nolan-young-theme/, /content-careers-/, /Shibey/, /Latin sample copy/]) {
    assert(!pattern.test(promptText), `Production prompt contains prohibited active placeholder: ${pattern}`);
  }
  assert(!/Local photo/.test(promptText), 'Production prompt contains unsupported Local photo requirement');

  for (const mode of ['ollama-only', 'codex-only', 'hybrid']) {
    const parsed = mustRunJson('node', [path.join(root, 'scripts', 'run-theme-workflow.js'), '--mode', mode, '--prompt', prompt, '--template', template, '--theme-slug', slug, '--dry-run', '--ollama-model', 'qwen2.5-coder:14b', '--codex-model', 'gpt-5.5', '--codex-reasoning', 'high']);
    const aiStages = parsed.stages.filter((stage) => stage.owner === 'ollama' || stage.owner === 'codex').map((stage) => stage.stage);
    const ollamaStages = ollamaStageSequence(batches).map((stage) => `ollama-${stage}`);
    if (mode === 'ollama-only') assert.deepStrictEqual(aiStages, ollamaStages);
    if (mode === 'codex-only') assert.deepStrictEqual(aiStages, ['codex-generation']);
    if (mode === 'hybrid') assert.deepStrictEqual(aiStages, [...ollamaStages, 'codex-finish']);
    if (mode === 'ollama-only') {
      assert.strictEqual(parsed.expected_invocations.ollama_provider_invocations, ollamaStages.length);
      assert.strictEqual(parsed.expected_invocations.codex_provider_invocations, 0);
    }
    if (mode === 'codex-only') {
      assert.strictEqual(parsed.expected_invocations.ollama_provider_invocations, 0);
      assert.strictEqual(parsed.expected_invocations.codex_provider_invocations, 1);
    }
    if (mode === 'hybrid') {
      assert.strictEqual(parsed.expected_invocations.ollama_provider_invocations, ollamaStages.length);
      assert.strictEqual(parsed.expected_invocations.codex_provider_invocations, 1);
    }
    assert(!('total_ai_passes' in parsed.expected_invocations), 'Dry run reports ambiguous total_ai_passes');
    assert(parsed.prompt_coverage.passed, 'Dry run prompt coverage failed');
  }
  assert.deepStrictEqual(existingArtifacts(slug), [], 'Dry run created artifacts');
  const codexArgs = codexExecArgs('gpt-5.5', 'high', [], { cd: path.join(root, 'wp-content', 'themes', slug), sandbox: 'workspace-write' });
  assert(codexArgs.includes('--cd'), 'Codex args omit --cd');
  assert(codexArgs.includes('--sandbox') && codexArgs.includes('workspace-write'), 'Codex args omit writable sandbox');
  assert(codexArgs.includes('--ephemeral'), 'Codex args omit --ephemeral');
  assert(!codexArgs.includes('--ignore-rules'), 'Codex args include --ignore-rules');
  const snapshotProbe = path.join(root, 'reports', 'runs', slug, 'snapshot-probe.txt');
  fs.mkdirSync(path.dirname(snapshotProbe), { recursive: true });
  fs.writeFileSync(snapshotProbe, 'aaaa\n', 'utf8');
  const beforeBoundary = repoSnapshot();
  fs.writeFileSync(snapshotProbe, 'bbbb\n', 'utf8');
  const sameSizeDiff = snapshotDiff(beforeBoundary, repoSnapshot(), []);
  assert(sameSizeDiff.modified.some((entry) => entry.after.path === 'reports/runs/999_nolan_young_theme_architecture_smoke/snapshot-probe.txt'), 'Codex boundary snapshot missed same-size content change');
  fs.rmSync(snapshotProbe, { force: true });

  mustRun('node', [path.join(root, 'scripts', 'prepare-theme.js'), '--prompt', prompt, '--template', template, '--theme-slug', slug]);
  const themeDir = path.join(root, 'wp-content', 'themes', slug);
  const preparedHeader = fs.readFileSync(path.join(themeDir, 'header.php'), 'utf8');
  const templateHeader = fs.readFileSync(path.join(root, 'wordpress-themplate-themes', template, 'header.php'), 'utf8');
  assert.strictEqual(preparedHeader, templateHeader.replace(/\r\n/g, '\n').replace(/\r/g, '\n'), 'Preparation rewrote header content beyond line-ending normalization');
  const preparedJsFiles = walk(path.join(themeDir, 'src', 'js')).filter((file) => file.endsWith('.js'));
  for (const file of [...preparedJsFiles, path.join(themeDir, 'webpack.config.js')].filter((item) => fs.existsSync(item))) {
    assert(!fs.readFileSync(file, 'utf8').includes('\r\n'), `${path.relative(themeDir, file).replace(/\\/g, '/')} kept CRLF after preparation`);
  }
  const preparedHashes = JSON.parse(fs.readFileSync(path.join(themeDir, '.generation', 'prepared-theme-hashes.json'), 'utf8'));
  assert(preparedHashes.files.some((entry) => entry.path === '.theme-template-source'), 'Prepared hashes omit final metadata');
  assert(preparedHashes.files.every((entry) => entry.path !== '.generation/prepared-theme-hashes.json'), 'Prepared hashes are self-referential');
  const codexBrief = createBrief({ mode: 'codex-only', themeSlug: slug, promptFile: prompt, templateName: template, model: 'gpt-5.5', reasoning: 'high' }, 'build');
  assert(!codexBrief.includes('## Current File:'), 'Codex brief inlines full current file context');
  assert(!/validation\.final\.json|validation\.source\.json|validation\.artifacts\.json/.test(codexBrief), 'Codex brief includes validation report file context');
  assert(codexBrief.includes('Preserve and extend the selected template scaffold.'), 'Codex brief does not enforce scaffold preservation');
  assert(codexBrief.includes('Keep the prepared header/navigation system intact.'), 'Codex brief does not enforce header scaffold preservation');
  assert(codexBrief.includes('Keep the prepared front-page section inventory intact.'), 'Codex brief does not enforce front-page scaffold preservation');
  assert(codexBrief.includes('## Required Scaffold To Preserve'), 'Codex brief does not enumerate preserved scaffold requirements');
  assert(codexBrief.includes('## Scaffold Reference Files'), 'Codex brief does not include scaffold reference file context');
  const headerBatch = batches.find((batch) => /^navigation-header(?:-|$)/.test(batch.name));
  assert(headerBatch && headerBatch.files.includes('header.php'), 'Header shell should have an Ollama writable owner');
  assert(!batches.some((batch) => batch.files.includes('inc/navigation.php')), 'Navigation logic should remain template-owned');
  const promptProbeBatch = batches.find((batch) => batch.files.some((file) => file.endsWith('.php')));
  assert(promptProbeBatch, 'No PHP-owned batch available for prompt generation checks');
  const phpPromptParts = batchPromptParts(slug, themeDir, contract, promptProbeBatch);
  assert(phpPromptParts.finalPrompt.includes(selectPromptRequirements(contract, promptProbeBatch.promptRequirements)), 'Assigned stage did not receive exact selected requirement text');
  assert(phpPromptParts.finalPrompt.includes(SHARED_GLOBAL_REQUIREMENTS), 'Shared global requirements are not included explicitly');
  assert(phpPromptParts.finalPrompt.includes('## Required Writable Files'), 'Required writable files section missing');
  assert(phpPromptParts.finalPrompt.includes('## Optional Writable Files'), 'Optional writable files section missing');
  assert(phpPromptParts.finalPrompt.includes('## Allowed New-File Patterns'), 'Allowed patterns section missing');
  assert(phpPromptParts.finalPrompt.includes('## Existing PHP Function Names'), 'Existing function inventory is missing from Ollama stage prompt');
  assert(phpPromptParts.finalPrompt.includes('Use brace-style PHP control structures only'), 'PHP brace-style control rule is missing from Ollama stage prompt');
  const documentationBatch = batches.find((batch) => batch.name === 'theme-documentation' || /^theme-documentation-/.test(batch.name));
  assert(!documentationBatch, 'Theme documentation should remain template-owned');
  const foundationFunctionBatch = batches.find((batch) => batch.files.includes('functions.php'));
  assert(!foundationFunctionBatch, 'functions.php should remain deterministic template source, not an AI-owned stage');
  const foundationPromptBatch = batches.find((batch) => /^foundation-core(?:-|$)/.test(batch.name));
  assert(!foundationPromptBatch, 'Foundation stage should remain template-owned');
  assert(!/planner|review-|fix-/.test(JSON.stringify(ollamaStageSequence(batches))), 'Ollama stage sequence still includes removed multi-pass stages');
  fs.writeFileSync(path.join(themeDir, 'extra-smoke-file.txt'), 'extra files are allowed\n', 'utf8');

  const rawDir = path.join(root, 'reports', 'runs', slug, 'model-output-tests');
  fs.mkdirSync(rawDir, { recursive: true });
  const validRaw = path.join(rawDir, 'valid.md');
  fs.writeFileSync(validRaw, '---FILE: README.md---\nStrict output test\n---END FILE---\n', 'utf8');
  applyModelOutput({ sourceFile: validRaw, themeDir, stage: 'strict-test', allowedFiles: ['README.md'], requiredFiles: ['README.md'], manifestPath: path.join(rawDir, 'valid.json') });
  assert.strictEqual(fs.readFileSync(path.join(themeDir, 'README.md'), 'utf8'), 'Strict output test\n');
  const badRemote = path.join(rawDir, 'remote.md');
  fs.writeFileSync(badRemote, '---FILE: README.md---\nhttps://example.com\n---END FILE---\n', 'utf8');
  applyModelOutput({ sourceFile: badRemote, themeDir, stage: 'strict-test', allowedFiles: ['README.md'], requiredFiles: ['README.md'] });
  assert.strictEqual(fs.readFileSync(path.join(themeDir, 'README.md'), 'utf8'), 'https://example.com\n', 'Remote URL was rewritten');
  const optionalRaw = path.join(rawDir, 'optional.md');
  fs.writeFileSync(optionalRaw, '---FILE: OPTIONAL.md---\nOptional content\n---END FILE---\n', 'utf8');
  applyModelOutput({ sourceFile: optionalRaw, themeDir, stage: 'optional-test', requiredFiles: [], optionalFiles: ['OPTIONAL.md'] });
  assert.strictEqual(fs.readFileSync(path.join(themeDir, 'OPTIONAL.md'), 'utf8'), 'Optional content\n');
  assert.deepStrictEqual(parseExactFileBlocks('---FILE: OPTIONAL2.md\nHello\n---END FILE---\n', slug), [{ relativePath: 'OPTIONAL2.md', content: 'Hello\n' }], 'Parser did not accept Ollama header variant without trailing dashes');
  const patternRaw = path.join(rawDir, 'pattern.md');
  fs.writeFileSync(patternRaw, '---FILE: assets/icons/pattern-icon.svg---\n<svg xmlns="http://www.w3.org/2000/svg"></svg>\n---END FILE---\n', 'utf8');
  applyModelOutput({ sourceFile: patternRaw, themeDir, stage: 'pattern-test', requiredFiles: [], optionalFiles: [], allowedPatterns: ['^assets/icons/[a-z0-9-]+\\.svg$'] });
  assert(fs.existsSync(path.join(themeDir, 'assets/icons/pattern-icon.svg')), 'Pattern-matched optional file was not applied');
  const noChangeRaw = path.join(rawDir, 'no-change.md');
  fs.writeFileSync(noChangeRaw, '---NO CHANGES---\n', 'utf8');
  assertThrowsMessage(() => applyModelOutput({ sourceFile: noChangeRaw, themeDir, stage: 'no-change-disallowed', requiredFiles: [], optionalFiles: ['OPTIONAL2.md'] }), /No documented file blocks|outside documented file blocks/, 'No-change result without explicit support');
  applyModelOutput({ sourceFile: noChangeRaw, themeDir, stage: 'no-change-allowed', requiredFiles: [], optionalFiles: ['OPTIONAL2.md'], allowNoChange: true });
  assert.deepStrictEqual(parseExactFileBlocks('---NO CHANGES---\n\u001b[?25lnoise', slug, { allowNoChange: true }), [], 'No-change parser did not ignore transport noise');
  assert.deepStrictEqual(parseExactFileBlocks('```text\n---NO CHANGES---\n```\n', slug, { allowNoChange: true }), [], 'No-change parser did not unwrap fenced no-change output');
  assert.deepStrictEqual(
    parseExactFileBlocks("I will not proceed with that request.\nPlease let me know if you need anything else.\n", slug, { allowNoChange: true, allowDeclineAsNoChange: true }),
    [],
    'Review/fix decline output was not treated as a no-op'
  );
  assert.deepStrictEqual(
    parseExactFileBlocks('```FILE: OPTIONAL3.md\nHello from fenced file block\n```\n', slug),
    [{ relativePath: 'OPTIONAL3.md', content: 'Hello from fenced file block\n' }],
    'Parser did not accept fenced FILE blocks'
  );
  assert.deepStrictEqual(
    parseExactFileBlocks('--FILE: README.md--\nTwo hyphen header variant\n---END FILE---\n', slug),
    [{ relativePath: 'README.md', content: 'Two hyphen header variant\n' }],
    'Parser did not accept recurring Ollama two-hyphen FILE header variant'
  );
  assert.deepStrictEqual(
    parseExactFileBlocks("---FILE: template-parts/header/mobile-navigation.php------\n<?php\n---END FILE---\n", slug),
    [{ relativePath: 'template-parts/header/mobile-navigation.php', content: "<?php\n" }],
    'Parser did not normalize overlong trailing FILE header delimiter'
  );
  assert.deepStrictEqual(
    parseExactFileBlocks("---FILE: spinner.php---\n<?php\nget_header();\n⠙ ⠹ ⠸\n---END FILE---\n", slug),
    [{ relativePath: 'spinner.php', content: "<?php\nget_header();\n" }],
    'Parser did not strip pure Ollama spinner lines before applying file content'
  );
  assert.deepStrictEqual(
    parseExactFileBlocks("---FILE: build/clean.js---\n```javascript\n'use strict';\nconsole.log(`Removed ${relativePath}`);\n---END FILE---\n", slug),
    [{ relativePath: 'build/clean.js', content: "'use strict';\nconsole.log(`Removed ${relativePath}`);\n" }],
    'Parser did not strip an unclosed leading code fence inside a code FILE block'
  );
  assert.deepStrictEqual(
    parseExactFileBlocks("---FILE: single.php---\n<?php\nget_footer();\n---\n---END FILE---\n", slug),
    [{ relativePath: 'single.php', content: "<?php\nget_footer();\n" }],
    'Parser did not strip trailing lone delimiter from code FILE block content'
  );
  assert.deepStrictEqual(
    parseExactFileBlocks("```php\n<?php\nget_header();\nget_footer();\n```\n", slug, { requiredFiles: ['privacy-policy.php'], optionalFiles: [], allowedPatterns: [] }),
    [{ relativePath: 'privacy-policy.php', content: "<?php\nget_header();\nget_footer();\n" }],
    'Parser did not neutralize fenced raw PHP for an exact one-file Ollama stage'
  );
  assertThrowsMessage(
    () => parseExactFileBlocks("```php\n<?php\nget_header();\n```\n", slug, { requiredFiles: ['one.php', 'two.php'], optionalFiles: [], allowedPatterns: [] }),
    /No documented file blocks/,
    'Fenced raw PHP must not be accepted for ambiguous multi-file stages'
  );
  const badPartial = path.join(rawDir, 'partial.md');
  fs.writeFileSync(badPartial, '---FILE: README.md---\nPartial\n---END FILE---\n---FILE: unassigned.php---\n<?php\n---END FILE---\n', 'utf8');
  const beforeUnassignedFailure = snapshot(themeDir);
  assertThrowsMessage(() => applyModelOutput({ sourceFile: badPartial, themeDir, stage: 'strict-test', allowedFiles: ['README.md'], requiredFiles: ['README.md'] }), /not in this stage allowlist/, 'Unassigned file rejection');
  assertSameSnapshot(beforeUnassignedFailure, snapshot(themeDir), 'Strict failed output');
  const missingRequired = path.join(rawDir, 'missing.md');
  fs.writeFileSync(missingRequired, '---FILE: README.md---\nOnly one\n---END FILE---\n', 'utf8');
  assertThrowsMessage(() => applyModelOutput({ sourceFile: missingRequired, themeDir, stage: 'strict-test', allowedFiles: ['README.md', 'CHANGELOG.md'], requiredFiles: ['README.md', 'CHANGELOG.md'] }), /omitted required/, 'Missing required file rejection');
  assert.strictEqual(fs.readFileSync(path.join(themeDir, 'README.md'), 'utf8'), 'https://example.com\n', 'Failed required-file stage changed live theme');
  const badPhp = path.join(rawDir, 'bad-php.md');
  fs.writeFileSync(badPhp, '---FILE: broken.php---\n<?php function broken_stage( {\n---END FILE---\n', 'utf8');
  const beforeBadPhp = snapshot(themeDir);
  assertThrowsMessage(() => applyModelOutput({ sourceFile: badPhp, themeDir, stage: 'php-check-test', allowedFiles: ['broken.php'], requiredFiles: ['broken.php'], candidateEvidenceDir: path.join(rawDir, 'bad-php-evidence') }), /Stage checks failed/, 'Stage check failure');
  assertSameSnapshot(beforeBadPhp, snapshot(themeDir), 'Stage-check failed output');
  assert(fs.existsSync(path.join(rawDir, 'bad-php-evidence', 'stage-checks.json')), 'Failed candidate checks were not preserved');
  const noisyPhp = path.join(rawDir, 'noisy-php.md');
  fs.writeFileSync(noisyPhp, '---FILE: noisy.php---\n<?php\n// Ollama spinner leak ⠙\n---END FILE---\n', 'utf8');
  assertThrowsMessage(() => applyModelOutput({ sourceFile: noisyPhp, themeDir, stage: 'noisy-php-test', requiredFiles: ['noisy.php'] }), /no-transport-noise/, 'Transport noise inside generated source was not rejected');
  fs.appendFileSync(path.join(themeDir, 'functions.php'), "\nfunction smoke_duplicate_guard() { return 'one'; }\n", 'utf8');
  const duplicatePhp = path.join(rawDir, 'duplicate-php.md');
  fs.writeFileSync(duplicatePhp, "---FILE: inc/duplicate.php---\n<?php function smoke_duplicate_guard() { return 'two'; }\n---END FILE---\n", 'utf8');
  const beforeDuplicatePhp = snapshot(themeDir);
  assertThrowsMessage(() => applyModelOutput({ sourceFile: duplicatePhp, themeDir, stage: 'duplicate-php-test', requiredFiles: ['inc/duplicate.php'] }), /duplicate-functions/, 'Candidate-wide duplicate function rejection');
  assertSameSnapshot(beforeDuplicatePhp, snapshot(themeDir), 'Duplicate-function failed output');
  const malformed = path.join(rawDir, 'malformed.md');
  fs.writeFileSync(malformed, '## FILE: README.md\n```text\nNo salvage\n```\n', 'utf8');
  assertThrowsMessage(() => applyModelOutput({ sourceFile: malformed, themeDir, stage: 'strict-test', allowedFiles: ['README.md'], requiredFiles: ['README.md'] }), /No documented file blocks|outside documented file blocks/, 'Malformed output rejection');
  assert(validateAssetManifest(themeDir).every((check) => check.passed), 'Starter asset manifest is invalid');
  const manifestPath = path.join(themeDir, 'assets/images/asset-manifest.json');
  const manifestBackup = fs.readFileSync(manifestPath, 'utf8');
  const starterManifest = JSON.parse(manifestBackup);
  for (const asset of starterManifest.assets) {
    assert(fs.existsSync(path.join(themeDir, 'assets/images', asset.file)), `Starter manifest entry missing: ${asset.file}`);
  }
  fs.rmSync(manifestPath, { force: true });
  assert(validateAssetManifest(themeDir).some((check) => check.passed === false), 'Missing asset manifest did not fail');
  fs.writeFileSync(manifestPath, JSON.stringify({ manifest_version: 1, assets: [{ file: '../escape.svg', kind: 'photo', source_url: '', creator: '', license: '', downloaded_at: '' }] }), 'utf8');
  const invalidAssetChecks = validateAssetManifest(themeDir);
  assert(invalidAssetChecks.some((check) => check.type === 'asset-path-safe' && check.passed === false), 'Invalid asset path did not fail');
  assert(invalidAssetChecks.some((check) => check.type === 'asset-third-party-provenance' && check.passed === false), 'Incomplete third-party provenance did not fail');
  const originalIllustrationPath = path.join(themeDir, 'assets/images/hero/brand-illustration.svg');
  fs.writeFileSync(originalIllustrationPath, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>', 'utf8');
  fs.writeFileSync(manifestPath, JSON.stringify({ manifest_version: 1, assets: [{ file: 'hero/brand-illustration.svg', kind: 'original-illustration', source_url: null, creator: 'Generated specifically for this theme', license: 'Project asset', approved_uses: ['hero'] }] }), 'utf8');
  assert(validateAssetManifest(themeDir).every((check) => check.passed), 'Original illustration incorrectly requires external provenance');
  fs.writeFileSync(manifestPath, manifestBackup, 'utf8');
  const extraReport = path.join(root, 'reports', 'runs', slug, 'extra-validation.json');
  runCommand('node', [path.join(root, 'scripts', 'validate-theme.js'), '--theme-slug', slug, '--template', template, '--phase', 'source', '--output', extraReport], { echo: false });
  const extraParsed = JSON.parse(fs.readFileSync(extraReport, 'utf8'));
  assert.strictEqual(extraParsed.checks.find((check) => check.name === 'selected_template_file_structure').status, 'passed', 'Template-aware validation rejected extra files');
  assert.strictEqual(extraParsed.checks.find((check) => check.name === 'template_part_references_resolve').status, 'passed', 'Source validation rejected valid template-part references');
  assert.strictEqual(extraParsed.checks.find((check) => check.name === 'header_scaffold_inventory_preserved').status, 'passed', 'Source validation rejected valid header scaffold inventory');
  assert.strictEqual(extraParsed.checks.find((check) => check.name === 'header_scaffold_behavior_preserved').status, 'passed', 'Source validation rejected valid header behavior markers');
  assert.strictEqual(extraParsed.checks.find((check) => check.name === 'front_page_section_inventory_preserved').status, 'passed', 'Source validation rejected valid front-page section inventory');
  assert.strictEqual(extraParsed.checks.find((check) => check.name === 'front_page_section_sequence_preserved').status, 'passed', 'Source validation rejected valid front-page section sequence');
  assert.strictEqual(extraParsed.checks.find((check) => check.name === 'front_page_section_density_preserved').status, 'passed', 'Source validation rejected valid front-page section density');
  assert.strictEqual(extraParsed.checks.find((check) => check.name === 'navigation_scaffold_inventory_preserved').status, 'passed', 'Source validation rejected valid navigation scaffold inventory');
  assert(!extraParsed.checks.some((check) => check.name === 'preview_exists' || check.name === 'zip_exists'), 'Source validation required preview or ZIP');

  const requiredFile = path.join(themeDir, 'index.php');
  const removed = `${requiredFile}.smoke`;
  fs.renameSync(requiredFile, removed);
  const missing = runCommand('node', [path.join(root, 'scripts', 'validate-theme.js'), '--theme-slug', slug, '--template', template], { echo: false });
  assert.notStrictEqual(missing.status, 0, 'Validation passed despite missing template file');
  fs.renameSync(removed, requiredFile);

  const beforePreview = snapshot(themeDir);
  const docsIndex = path.join(root, 'docs', 'index.html');
  const docsIndexBefore = fs.existsSync(docsIndex) ? fs.readFileSync(docsIndex, 'utf8') : null;
  mustRun('node', [path.join(root, 'scripts', 'preview-theme.js'), '--theme-slug', slug, '--rebuild-index']);
  assertSameSnapshot(beforePreview, snapshot(themeDir), 'Preview generation');

  const beforePackage = snapshot(themeDir);
  mustRun('node', [path.join(root, 'scripts', 'package-theme.js'), '--theme-slug', slug]);
  assertSameSnapshot(beforePackage, snapshot(themeDir), 'Packaging');
  const entries = await zipEntries(path.join(root, 'dist', 'zipped-themes', `${slug}.zip`));
  assert(entries.includes(`${slug}/style.css`), 'ZIP is missing top-level theme/style.css');
  assert(entries.every((entry) => entry.startsWith(`${slug}/`)), 'ZIP has more than one top-level folder');
  const artifactReport = path.join(root, 'reports', 'runs', slug, 'artifact-validation.json');
  mustRun('node', [path.join(root, 'scripts', 'validate-theme.js'), '--theme-slug', slug, '--template', template, '--phase', 'artifacts', '--output', artifactReport]);
  const artifactParsed = JSON.parse(fs.readFileSync(artifactReport, 'utf8'));
  assert(artifactParsed.checks.some((check) => check.name === 'preview_exists'), 'Artifact validation did not check preview');
  assert(artifactParsed.checks.some((check) => check.name === 'zip_structure'), 'Artifact validation did not check ZIP');
  const frozenReport = path.join(root, 'reports', 'runs', slug, 'generated-theme-hashes.json');
  const frozenFiles = walk(themeDir).map((file) => ({ path: path.relative(themeDir, file).replace(/\\/g, '/'), sha256: sha256File(file) })).sort((a, b) => a.path.localeCompare(b.path));
  fs.writeFileSync(frozenReport, `${JSON.stringify({ created_at: new Date().toISOString(), files: frozenFiles }, null, 2)}\n`, 'utf8');
  assert.doesNotThrow(() => verifyFrozenSource(slug, path.join(root, 'reports', 'runs', slug)), 'Unchanged frozen source failed resume verification');
  const bundlePath = path.join(themeDir, 'assets/css/bundle.css');
  const bundleBefore = fs.readFileSync(bundlePath, 'utf8');
  fs.writeFileSync(bundlePath, `${bundleBefore}\n/* allowed resume drift */\n`, 'utf8');
  assert.doesNotThrow(() => verifyFrozenSource(slug, path.join(root, 'reports', 'runs', slug)), 'Allowed build-output drift failed resume verification');
  fs.writeFileSync(bundlePath, bundleBefore, 'utf8');
  const functionsPath = path.join(themeDir, 'functions.php');
  const functionsBefore = fs.readFileSync(functionsPath, 'utf8');
  fs.writeFileSync(functionsPath, `${functionsBefore}\n// forbidden drift\n`, 'utf8');
  assertThrowsMessage(() => verifyFrozenSource(slug, path.join(root, 'reports', 'runs', slug)), /Frozen generated source drift/, 'Forbidden PHP drift');
  fs.writeFileSync(functionsPath, functionsBefore, 'utf8');
  const templatePartPath = path.join(themeDir, 'template-parts', 'global', 'content-hero.php');
  const templatePartBefore = fs.readFileSync(templatePartPath, 'utf8');
  fs.writeFileSync(templatePartPath, `${templatePartBefore}\n<!-- forbidden drift -->\n`, 'utf8');
  assertThrowsMessage(() => verifyFrozenSource(slug, path.join(root, 'reports', 'runs', slug)), /Frozen generated source drift/, 'Forbidden template-part drift');
  fs.writeFileSync(templatePartPath, templatePartBefore, 'utf8');
  const readmePath = path.join(themeDir, 'README.md');
  const readmeBefore = fs.readFileSync(readmePath, 'utf8');
  fs.rmSync(readmePath);
  assertThrowsMessage(() => verifyFrozenSource(slug, path.join(root, 'reports', 'runs', slug)), /Frozen generated source drift/, 'Missing frozen file');
  fs.writeFileSync(readmePath, readmeBefore, 'utf8');
  fs.writeFileSync(path.join(themeDir, 'new-source.php'), '<?php\n', 'utf8');
  assertThrowsMessage(() => verifyFrozenSource(slug, path.join(root, 'reports', 'runs', slug)), /Frozen generated source drift/, 'Added source file');
  fs.rmSync(path.join(themeDir, 'new-source.php'), { force: true });

  mustRun('node', [path.join(root, 'scripts', 'delete-theme.js'), '--theme-slug', slug, '--yes', '--skip-gallery']);
  if (docsIndexBefore === null) fs.rmSync(docsIndex, { force: true });
  else fs.writeFileSync(docsIndex, docsIndexBefore, 'utf8');
  assert.deepStrictEqual(existingArtifacts(slug), [], 'Cleanup left disposable artifacts behind');
  console.log('Smoke test passed.');
}

main().catch((error) => {
  cleanup();
  fail(error.stack || error.message);
});
