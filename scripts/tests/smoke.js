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
const { applyModelOutput, validateAssetManifest } = require('../lib/model-output');
const { BATCHES, SHARED_GLOBAL_REQUIREMENTS, validateStagePlan } = require('../lib/ollama-batches');
const { assertCoverage, buildCoverage, parsePromptContract, promptSizeManifest, selectPromptSections } = require('../lib/prompt-contract');
const { codexExecArgs } = require('../lib/model-access');
const { createBrief, repoSnapshot, snapshotDiff } = require('../providers/codex');
const { batchPromptParts } = require('../providers/ollama');
const { verifyFrozenSource } = require('../run-theme-workflow');

const slug = '999_nolan_young_theme_architecture_smoke';
const prompt = 'prompts/templates/NOLAN-YOUNG-PROMPT-6-19-2026.md';
const template = 'NOLAN-YOUNG-theme-000';
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
  assert(!/npm['"],\s*\['run',\s*'dev'/.test(runner), 'Workflow starts npm run dev');
  assert(!/package\.json[\s\S]{0,120}writeFileSync/.test(runner), 'Workflow rewrites generated package.json');
  assert(!/validation\.draft|validationPath/.test(runner), 'Hybrid workflow passes draft validation to Codex');

  const modelOutputText = fs.readFileSync(path.join(root, 'scripts', 'lib', 'model-output.js'), 'utf8');
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
  for (const batch of BATCHES) {
    assert(Array.isArray(batch.files), `${batch.name} missing writable file allowlist`);
    assert(batch.files.length > 0 || (batch.optionalFiles || []).length > 0 || (batch.allowedPatterns || []).length > 0, `${batch.name} missing writable file allowlist`);
    assert('readonly' in batch || 'readonlyDirectories' in batch, `${batch.name} missing read-only context declaration`);
    assert(Array.isArray(batch.promptSections) && batch.promptSections.length > 0, `${batch.name} missing prompt section ownership`);
  }
  assert.doesNotThrow(() => validateStagePlan(BATCHES), 'Valid stage plan failed validation');
  assert(!BATCHES.find((batch) => batch.name === 'page-interaction-javascript').readonly.includes('src/js/main.js'), 'page-interaction-javascript has writable/read-only conflict');
  assertThrowsMessage(() => validateStagePlan([{ name: 'bad', files: ['a.php'], optionalFiles: ['a.php'], readonly: [] }]), /required file is also optional/, 'Required/optional conflict validation');
  assertThrowsMessage(() => validateStagePlan([{ name: 'bad', files: ['a.php'], readonly: ['a.php'] }]), /required file is also read-only/, 'Writable/read-only conflict validation');
  const productionPrompt = path.join(root, prompt);
  const contract = parsePromptContract(productionPrompt);
  assert.deepStrictEqual(contract.sections.map((section) => section.number), ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'], 'Production prompt sections 01-15 were not discovered');
  assert(contract.sections.every((section) => section.text.includes(`## ${section.number}.`)), 'Prompt section exact text was trimmed');
  const coverage = buildCoverage(contract, BATCHES);
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
  assert(BATCHES.findIndex((batch) => batch.name === 'homepage-assembly') > BATCHES.findIndex((batch) => batch.name === 'homepage-content-proof-interaction'), 'Homepage assembly is not after homepage parts');
  assert(BATCHES.some((batch) => batch.name === 'standard-template-parts' && batch.files.includes('template-parts/content-page.php')), 'Standard template parts have no writable owner');
  assert(BATCHES.findIndex((batch) => batch.name === 'forms-system') !== BATCHES.findIndex((batch) => batch.name === 'newsletter-system'), 'Forms and newsletter are not separate stages');
  assert(BATCHES.findIndex((batch) => batch.name === 'blog-contact-policy-templates') > BATCHES.findIndex((batch) => batch.name === 'newsletter-system'), 'Contact templates do not run after newsletter');
  assert(BATCHES.some((batch) => batch.name === 'theme-documentation' && batch.promptSections.includes('14')), 'Documentation requirements are unassigned');
  assert(BATCHES.some((batch) => batch.promptSections.includes('13')), 'Image requirements are unassigned');
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
    const ollamaStages = BATCHES.map((batch) => `ollama-${batch.name}`);
    if (mode === 'ollama-only') assert.deepStrictEqual(aiStages, ollamaStages);
    if (mode === 'codex-only') assert.deepStrictEqual(aiStages, ['codex-generation']);
    if (mode === 'hybrid') assert.deepStrictEqual(aiStages, [...ollamaStages, 'codex-finish']);
    if (mode === 'ollama-only') {
      assert.strictEqual(parsed.expected_invocations.ollama_provider_invocations, BATCHES.length);
      assert.strictEqual(parsed.expected_invocations.codex_provider_invocations, 0);
    }
    if (mode === 'codex-only') {
      assert.strictEqual(parsed.expected_invocations.ollama_provider_invocations, 0);
      assert.strictEqual(parsed.expected_invocations.codex_provider_invocations, 1);
    }
    if (mode === 'hybrid') {
      assert.strictEqual(parsed.expected_invocations.ollama_provider_invocations, BATCHES.length);
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
  assert.strictEqual(preparedHeader, templateHeader, 'Preparation rewrote header content');
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
  const headerBatch = BATCHES.find((batch) => batch.name === 'header-markup');
  const headerPromptParts = batchPromptParts(slug, themeDir, contract, headerBatch);
  assert(headerPromptParts.finalPrompt.includes(selectPromptSections(contract, ['07'])), 'Assigned stage did not receive exact selected section text');
  assert(!headerPromptParts.finalPrompt.includes('## 08. Footer'), 'Ollama stage prompt contains unrelated numbered section');
  assert(headerPromptParts.finalPrompt.includes(SHARED_GLOBAL_REQUIREMENTS), 'Shared global requirements are not included explicitly');
  assert(headerPromptParts.finalPrompt.includes('## Required Writable Files'), 'Required writable files section missing');
  assert(headerPromptParts.finalPrompt.includes('## Optional Writable Files'), 'Optional writable files section missing');
  assert(headerPromptParts.finalPrompt.includes('## Allowed New-File Patterns'), 'Allowed patterns section missing');
  const assetPromptParts = batchPromptParts(slug, themeDir, contract, BATCHES.find((batch) => batch.name === 'brand-local-assets'));
  assert(assetPromptParts.finalPrompt.includes('No exact files are mandatory for this stage.'), 'Zero-required stage prompt does not say no exact files are mandatory');
  const assetManifestForPrompt = promptSizeManifest(assetPromptParts, 999999);
  assert.strictEqual(assetManifestForPrompt.total_prompt_characters, assetPromptParts.finalPrompt.length, 'Stage-size manifest does not match actual prompt length');
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
  const patternRaw = path.join(rawDir, 'pattern.md');
  fs.writeFileSync(patternRaw, '---FILE: assets/icons/pattern-icon.svg---\n<svg xmlns="http://www.w3.org/2000/svg"></svg>\n---END FILE---\n', 'utf8');
  applyModelOutput({ sourceFile: patternRaw, themeDir, stage: 'pattern-test', requiredFiles: [], optionalFiles: [], allowedPatterns: ['^assets/icons/[a-z0-9-]+\\.svg$'] });
  assert(fs.existsSync(path.join(themeDir, 'assets/icons/pattern-icon.svg')), 'Pattern-matched optional file was not applied');
  const noChangeRaw = path.join(rawDir, 'no-change.md');
  fs.writeFileSync(noChangeRaw, '---NO CHANGES---\n', 'utf8');
  assertThrowsMessage(() => applyModelOutput({ sourceFile: noChangeRaw, themeDir, stage: 'no-change-disallowed', requiredFiles: [], optionalFiles: ['OPTIONAL2.md'] }), /No documented file blocks|outside documented file blocks/, 'No-change result without explicit support');
  applyModelOutput({ sourceFile: noChangeRaw, themeDir, stage: 'no-change-allowed', requiredFiles: [], optionalFiles: ['OPTIONAL2.md'], allowNoChange: true });
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
  const scssPath = path.join(themeDir, 'src/scss/main.scss');
  const scssBefore = fs.readFileSync(scssPath, 'utf8');
  fs.writeFileSync(scssPath, `${scssBefore}\n// forbidden drift\n`, 'utf8');
  assertThrowsMessage(() => verifyFrozenSource(slug, path.join(root, 'reports', 'runs', slug)), /Frozen generated source drift/, 'Forbidden SCSS drift');
  fs.writeFileSync(scssPath, scssBefore, 'utf8');
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
