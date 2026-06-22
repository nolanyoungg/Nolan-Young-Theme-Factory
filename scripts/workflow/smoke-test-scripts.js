#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { root, scriptPath } = require('../shared/repo-root');
const { runCommand, classifyCommandFailure } = require('../shared/command-runner');
const { COMMAND_FAILURE_CODES } = require('../shared/constants');
const {
  validateCodexModel,
  validateCodexReasoning,
  validateKnownCodexReasoningCombination,
  validateOllamaModel
} = require('../shared/model-config');
const { parseOllamaModels } = require('../shared/model-access');
const { artifactPlan, existingArtifacts, safeRelativePath } = require('../shared/theme-utils');

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
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function assertThrowsMessage(fn, pattern) {
  let thrown = null;
  try {
    fn();
  } catch (error) {
    thrown = error;
  }
  assert(thrown, 'Expected function to throw');
  assert(pattern.test(thrown.message), `Expected "${thrown.message}" to match ${pattern}`);
}

function assertNoArtifacts(slug) {
  const found = existingArtifacts(slug, {
    themes: 'wp-content/themes',
    previews: 'docs/Preview-Themes-Github',
    zips: 'dist/zipped-themes',
    run_reports: 'reports/runs'
  });
  assert.deepStrictEqual(found, [], `Dry run created artifacts: ${found.join(', ')}`);
}

JSON.parse(fs.readFileSync(path.join(root, 'config', 'workflow-modes.json'), 'utf8'));
JSON.parse(fs.readFileSync(path.join(root, 'config', 'theme-factory.defaults.json'), 'utf8'));
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

for (const [name, command] of Object.entries(packageJson.scripts || {})) {
  assert(!/\.sh\b|bash\b|theme-factory\.sh/.test(command), `npm script ${name} references a shell script`);
  const match = command.match(/^node\s+([^\s]+)/);
  if (match) assert(fs.existsSync(path.join(root, match[1])), `npm script ${name} points to missing file ${match[1]}`);
}

for (const file of walk(path.join(root, 'scripts')).filter((item) => item.endsWith('.js'))) {
  mustRun('node', ['--check', file]);
}

const staleSearchFiles = [
  ...walk(path.join(root, 'scripts')),
  path.join(root, 'README.md'),
  path.join(root, 'docs', 'AI-WORKFLOW.md'),
  path.join(root, 'package.json')
].filter((file) => fs.existsSync(file) && /\.(js|json|md)$/.test(file) && path.relative(root, file).replace(/\\/g, '/') !== 'scripts/workflow/smoke-test-scripts.js');
const staleNames = [
  ['run', 'ollama', 'theme', 'pass.sh'].join('-'),
  ['run', 'ollama', 'quality', 'repair', 'pass.sh'].join('-'),
  ['prepare', 'theme', 'from', 'template.sh'].join('-'),
  ['build', 'theme', 'assets.sh'].join('-'),
  ['package', 'theme.sh'].join('-'),
  ['validate', 'theme', 'from', 'template.sh'].join('-'),
  ['theme', 'factory.sh'].join('-'),
  ['#!', '/usr/bin/env ', 'bash'].join('')
];
const stalePattern = new RegExp(staleNames.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'));
for (const file of staleSearchFiles) {
  assert(!stalePattern.test(fs.readFileSync(file, 'utf8')), `Stale Bash reference found in ${path.relative(root, file)}`);
}

assert.strictEqual(validateCodexModel('gpt-5.5'), 'gpt-5.5');
assert.strictEqual(validateCodexReasoning('HIGH'), 'high');
assert.deepStrictEqual(validateKnownCodexReasoningCombination('gpt-5.5', 'high'), { model: 'gpt-5.5', reasoning: 'high', known: true });
assert.deepStrictEqual(validateKnownCodexReasoningCombination('gpt-5.5', 'xhigh'), { model: 'gpt-5.5', reasoning: 'xhigh', known: true });
assert.deepStrictEqual(validateKnownCodexReasoningCombination('gpt-5.4-mini', 'low'), { model: 'gpt-5.4-mini', reasoning: 'low', known: false });
assert.deepStrictEqual(validateKnownCodexReasoningCombination('gpt-6-preview', 'medium'), { model: 'gpt-6-preview', reasoning: 'medium', known: false });
assert.strictEqual(validateOllamaModel('qwen2.5:7b'), 'qwen2.5:7b');
assert.strictEqual(validateOllamaModel('qwen2.5-coder:7b'), 'qwen2.5-coder:7b');
assert.strictEqual(validateOllamaModel('qwen2.5-coder:14b'), 'qwen2.5-coder:14b');
assertThrowsMessage(() => validateCodexModel('5.5'), /gpt-5\.5/);
assertThrowsMessage(() => validateCodexReasoning('extra-high'), /Invalid Codex reasoning/);
assertThrowsMessage(() => validateKnownCodexReasoningCombination('gpt-5.3-codex', 'none'), /does not support/);
assertThrowsMessage(() => validateOllamaModel('qwen coder 14b'), /qwen2\.5-coder:14b/);

const installed = parseOllamaModels('NAME ID SIZE\nqwen2.5-coder:7b abc 4.7 GB\nqwen2.5-coder:14b def 9.0 GB\n');
assert(installed.includes('qwen2.5-coder:7b'));
assert(installed.includes('qwen2.5-coder:14b'));
assert(!installed.includes('qwen2.5:7b'));

assert.strictEqual(classifyCommandFailure({ status: 1, stdout: '', stderr: 'command not found', errorCode: 'ENOENT' }), COMMAND_FAILURE_CODES.COMMAND_NOT_FOUND);
assert.strictEqual(classifyCommandFailure({ status: 1, stdout: '', stderr: 'model is not installed', errorCode: '' }), COMMAND_FAILURE_CODES.MODEL_NOT_INSTALLED);
assert.strictEqual(classifyCommandFailure({ status: 1, stdout: '', stderr: 'authentication expired', errorCode: '' }), COMMAND_FAILURE_CODES.AUTHENTICATION_REQUIRED);
assert.strictEqual(classifyCommandFailure({ status: 1, stdout: '', stderr: 'quota exceeded', errorCode: '' }), COMMAND_FAILURE_CODES.QUOTA_EXCEEDED);
assert.strictEqual(classifyCommandFailure({ status: 1, stdout: '', stderr: 'unsupported reasoning level', errorCode: '' }), COMMAND_FAILURE_CODES.REASONING_LEVEL_UNSUPPORTED);
assert.strictEqual(classifyCommandFailure({ status: 1, stdout: '', stderr: 'connection refused', errorCode: '' }), COMMAND_FAILURE_CODES.OLLAMA_SERVICE_UNAVAILABLE);
assert.strictEqual(classifyCommandFailure({ status: 1, stdout: '', stderr: '', timedOut: true, errorCode: '' }), COMMAND_FAILURE_CODES.PROCESS_TIMEOUT);
assert.strictEqual(classifyCommandFailure({ status: 1, stdout: '', stderr: 'generic failure', errorCode: '' }), COMMAND_FAILURE_CODES.NONZERO_EXIT);

const missingExecutable = runCommand('theme-factory-definitely-missing-command', ['--version'], { echo: false, timeoutMs: 1000 });
assert.strictEqual(missingExecutable.status, 1);
assert.strictEqual(missingExecutable.classification, COMMAND_FAILURE_CODES.COMMAND_NOT_FOUND);

assert.strictEqual(safeRelativePath('prompts/pending/MASTER-TEMPLATE-PROMPT-filler-template (1).md', 'prompt'), 'prompts/pending/MASTER-TEMPLATE-PROMPT-filler-template (1).md');
assert.strictEqual(safeRelativePath('prompts\\pending\\000-testing.md', 'prompt'), 'prompts/pending/000-testing.md');

const tempManifest = path.join(os.tmpdir(), `theme-factory-manifest-${Date.now()}.json`);
mustRun('node', [scriptPath('template-theme-copy', 'create-template-manifest.js'), 'NOLAN-YOUNG-theme-000', tempManifest]);
if (!fs.existsSync(tempManifest) || fs.statSync(tempManifest).size === 0) fail('Template manifest was not created.');
fs.rmSync(tempManifest, { force: true });

mustRun('node', [scriptPath('run-theme-workflow.js'), '--help']);

const drySlug = '999_nolan_young_theme_dry_run_check';
assertNoArtifacts(drySlug);
const dryPrompt = 'prompts/pending/MASTER-TEMPLATE-PROMPT-filler-template (1).md';
for (const mode of ['ollama-only', 'codex-only', 'hybrid']) {
  const dryArgs = [
    scriptPath('run-theme-workflow.js'),
    '--mode', mode,
    '--prompt', dryPrompt,
    '--template', 'NOLAN-YOUNG-theme-000',
    '--theme-slug', drySlug,
    '--dry-run'
  ];
  if (mode !== 'codex-only') dryArgs.push('--ollama-model', 'qwen2.5-coder:14b');
  if (mode !== 'ollama-only') dryArgs.push('--codex-model', mode === 'codex-only' ? 'gpt-5.4-mini' : 'gpt-5.5', '--codex-reasoning', mode === 'codex-only' ? 'low' : 'high');
  const result = mustRun('node', dryArgs);
  const parsed = JSON.parse(result.stdout);
  assert.strictEqual(parsed.theme_slug, drySlug);
  assert.strictEqual(parsed.requested.prompt, dryPrompt);
  assert(parsed.expected_invocations);
  assertNoArtifacts(drySlug);
}

const previewEnv = mustRun('node', [scriptPath('environment', 'check-environment.js'), '--mode', 'preview', '--model-check']);
const previewEnvReport = JSON.parse(previewEnv.stdout);
assert.strictEqual(previewEnvReport.provider_checks.ollama, null);
assert.strictEqual(previewEnvReport.provider_checks.codex, null);

for (const planned of artifactPlan(drySlug, {
  themes: 'wp-content/themes',
  previews: 'docs/Preview-Themes-Github',
  zips: 'dist/zipped-themes',
  run_reports: 'reports/runs'
})) {
  assert(!fs.existsSync(path.join(root, planned)), `Dry-run artifact exists: ${planned}`);
}

console.log('Smoke test passed.');
