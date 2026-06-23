#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const yauzl = require('yauzl');
const { root } = require('../lib/repo-root');
const { runCommand } = require('../lib/command-runner');
const { existingArtifacts } = require('../lib/theme-utils');
const { applyModelOutput } = require('../lib/model-output');
const { BATCHES } = require('../lib/ollama-batches');
const { buildCoverage, parsePromptContract, promptSizeManifest } = require('../lib/prompt-contract');
const { codexExecArgs } = require('../lib/model-access');
const { createBrief } = require('../providers/codex');

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
  const productionPrompt = path.join(root, prompt);
  const contract = parsePromptContract(productionPrompt);
  assert.deepStrictEqual(contract.sections.map((section) => section.number), ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'], 'Production prompt sections 01-15 were not discovered');
  assert(contract.sections.every((section) => section.text.includes(`## ${section.number}.`)), 'Prompt section exact text was trimmed');
  const coverage = buildCoverage(contract, BATCHES);
  assert(coverage.passed, `Prompt coverage failed: ${JSON.stringify(coverage.uncovered_requirements)}`);
  assert(coverage.all_subsections.length > 0, 'Prompt subsections were not parsed');
  assert(BATCHES.findIndex((batch) => batch.name === 'homepage-assembly') > BATCHES.findIndex((batch) => batch.name === 'homepage-content-proof-interaction'), 'Homepage assembly is not after homepage parts');
  assert(BATCHES.some((batch) => batch.name === 'standard-template-parts' && batch.files.includes('template-parts/content-page.php')), 'Standard template parts have no writable owner');
  assert(BATCHES.findIndex((batch) => batch.name === 'forms-system') !== BATCHES.findIndex((batch) => batch.name === 'newsletter-system'), 'Forms and newsletter are not separate stages');
  assert(BATCHES.findIndex((batch) => batch.name === 'blog-contact-policy-templates') > BATCHES.findIndex((batch) => batch.name === 'newsletter-system'), 'Contact templates do not run after newsletter');
  assert(BATCHES.some((batch) => batch.name === 'theme-documentation' && batch.promptSections.includes('14')), 'Documentation requirements are unassigned');
  assert(BATCHES.some((batch) => batch.promptSections.includes('13')), 'Image requirements are unassigned');
  const oversized = promptSizeManifest('x'.repeat(200), [], [], 100);
  assert.strictEqual(oversized.within_budget, false, 'Oversized prompt budget did not fail preflight calculation');
  const promptText = fs.readFileSync(productionPrompt, 'utf8');
  for (const pattern of [/x1\b/, /x2\b/, /x3\b/, /x4\b/, /x5\b/, /x6\b/, /FILL IN HERE/, /ADD OTHER IS NEEDED/, /theme \.\.\.\?\?\?/, /example\.com\/nolan-young-theme/, /content-careers-/, /Shibey/, /Latin sample copy/]) {
    assert(!pattern.test(promptText), `Production prompt contains prohibited active placeholder: ${pattern}`);
  }

  for (const mode of ['ollama-only', 'codex-only', 'hybrid']) {
    const result = mustRun('node', [path.join(root, 'scripts', 'run-theme-workflow.js'), '--mode', mode, '--prompt', prompt, '--template', template, '--theme-slug', slug, '--dry-run', '--ollama-model', 'qwen2.5-coder:14b', '--codex-model', 'gpt-5.5', '--codex-reasoning', 'high']);
    const parsed = JSON.parse(result.stdout);
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
  const malformed = path.join(rawDir, 'malformed.md');
  fs.writeFileSync(malformed, '## FILE: README.md\n```text\nNo salvage\n```\n', 'utf8');
  assertThrowsMessage(() => applyModelOutput({ sourceFile: malformed, themeDir, stage: 'strict-test', allowedFiles: ['README.md'], requiredFiles: ['README.md'] }), /No documented file blocks|outside documented file blocks/, 'Malformed output rejection');
  const extraReport = path.join(root, 'reports', 'runs', slug, 'extra-validation.json');
  runCommand('node', [path.join(root, 'scripts', 'validate-theme.js'), '--theme-slug', slug, '--template', template, '--phase', 'source', '--output', extraReport], { echo: false });
  const extraParsed = JSON.parse(fs.readFileSync(extraReport, 'utf8'));
  assert.strictEqual(extraParsed.checks.find((check) => check.name === 'selected_template_file_structure').status, 'passed', 'Template-aware validation rejected extra files');
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
