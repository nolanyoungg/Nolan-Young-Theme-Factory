#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const yauzl = require('yauzl');
const { root } = require('../lib/repo-root');
const { runCommand } = require('../lib/command-runner');
const { existingArtifacts } = require('../lib/theme-utils');

const slug = '999_nolan_young_theme_architecture_smoke';
const prompt = 'prompts/pending/MASTER-TEMPLATE-PROMPT-filler-template (1).md';
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

  for (const mode of ['ollama-only', 'codex-only', 'hybrid']) {
    const result = mustRun('node', [path.join(root, 'scripts', 'run-theme-workflow.js'), '--mode', mode, '--prompt', prompt, '--template', template, '--theme-slug', slug, '--dry-run', '--ollama-model', 'qwen2.5-coder:14b', '--codex-model', 'gpt-5.5', '--codex-reasoning', 'high']);
    const parsed = JSON.parse(result.stdout);
    const aiStages = parsed.stages.filter((stage) => stage.owner === 'ollama' || stage.owner === 'codex').map((stage) => stage.stage);
    if (mode === 'ollama-only') assert.deepStrictEqual(aiStages, ['ollama-generation']);
    if (mode === 'codex-only') assert.deepStrictEqual(aiStages, ['codex-generation']);
    if (mode === 'hybrid') assert.deepStrictEqual(aiStages, ['ollama-generation', 'codex-finish']);
    assert(parsed.expected_invocations.total_ai_passes <= 2, 'Dry run plans a third AI pass');
  }
  assert.deepStrictEqual(existingArtifacts(slug), [], 'Dry run created artifacts');

  mustRun('node', [path.join(root, 'scripts', 'prepare-theme.js'), '--prompt', prompt, '--template', template, '--theme-slug', slug]);
  const themeDir = path.join(root, 'wp-content', 'themes', slug);
  fs.writeFileSync(path.join(themeDir, 'extra-smoke-file.txt'), 'extra files are allowed\n', 'utf8');
  const extraReport = path.join(root, 'reports', 'runs', slug, 'extra-validation.json');
  runCommand('node', [path.join(root, 'scripts', 'validate-theme.js'), '--theme-slug', slug, '--template', template, '--output', extraReport], { echo: false });
  const extraParsed = JSON.parse(fs.readFileSync(extraReport, 'utf8'));
  assert.strictEqual(extraParsed.checks.find((check) => check.name === 'selected_template_file_structure').status, 'passed', 'Template-aware validation rejected extra files');

  const requiredFile = path.join(themeDir, 'index.php');
  const removed = `${requiredFile}.smoke`;
  fs.renameSync(requiredFile, removed);
  const missing = runCommand('node', [path.join(root, 'scripts', 'validate-theme.js'), '--theme-slug', slug, '--template', template], { echo: false });
  assert.notStrictEqual(missing.status, 0, 'Validation passed despite missing template file');
  fs.renameSync(removed, requiredFile);

  const beforePreview = snapshot(themeDir);
  mustRun('node', [path.join(root, 'scripts', 'preview-theme.js'), '--theme-slug', slug]);
  assertSameSnapshot(beforePreview, snapshot(themeDir), 'Preview generation');

  const beforePackage = snapshot(themeDir);
  mustRun('node', [path.join(root, 'scripts', 'package-theme.js'), '--theme-slug', slug]);
  assertSameSnapshot(beforePackage, snapshot(themeDir), 'Packaging');
  const entries = await zipEntries(path.join(root, 'dist', 'zipped-themes', `${slug}.zip`));
  assert(entries.includes(`${slug}/style.css`), 'ZIP is missing top-level theme/style.css');
  assert(entries.every((entry) => entry.startsWith(`${slug}/`)), 'ZIP has more than one top-level folder');

  mustRun('node', [path.join(root, 'scripts', 'delete-theme.js'), '--theme-slug', slug, '--yes', '--skip-gallery']);
  assert.deepStrictEqual(existingArtifacts(slug), [], 'Cleanup left disposable artifacts behind');
  console.log('Smoke test passed.');
}

main().catch((error) => {
  cleanup();
  fail(error.stack || error.message);
});
