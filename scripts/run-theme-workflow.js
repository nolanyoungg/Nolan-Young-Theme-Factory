#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const defaults = JSON.parse(fs.readFileSync(path.join(root, 'config', 'theme-factory.defaults.json'), 'utf8'));
const modeConfig = JSON.parse(fs.readFileSync(path.join(root, 'config', 'workflow-modes.json'), 'utf8'));

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
}

function safePath(input, label) {
  if (!input || input.includes('..') || path.isAbsolute(input)) fail(`Unsafe ${label}: ${input}`);
  return path.normalize(input).replace(/\\/g, '/');
}

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: 'pipe', ...options });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  return result;
}

function hasCommand(command) {
  const probe = spawnSync(command, ['--help'], { cwd: root, encoding: 'utf8', stdio: 'ignore' });
  return probe.status === 0 || probe.status === 1;
}

function runCommandLine(commandLine, args = []) {
  if (!commandLine) return { status: 1, stdout: '', stderr: 'Missing command line.' };
  if (commandLine === 'codex') return run(commandLine, args);
  if (process.platform === 'win32') {
    return spawnSync('cmd.exe', ['/d', '/s', '/c', `${commandLine} ${args.map((arg) => JSON.stringify(String(arg))).join(' ')}`], { cwd: root, encoding: 'utf8' });
  }
  return spawnSync('/bin/sh', ['-lc', `${commandLine} ${args.map((arg) => `'${String(arg).replace(/'/g, `'\\''`)}'`).join(' ')}`], { cwd: root, encoding: 'utf8' });
}

function help() {
  console.log(`Usage:
  node scripts/run-theme-workflow.js --mode <ollama-only|codex-only|hybrid> --prompt <file> --template <template> [--ollama-model <model>] [--codex-model <model>] [--codex-reasoning <level>] [--dry-run]
  node scripts/run-theme-workflow.js --resume <theme-slug>
`);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--help' || item === '-h') args.help = true;
    else if (item === '--dry-run') args.dryRun = true;
    else if (item === '--resume') args.resume = argv[++i];
    else if (item.startsWith('--')) {
      args[item.slice(2)] = argv[++i];
    } else {
      args._.push(item);
    }
  }
  return args;
}

function readTemplateSource(themeSlug) {
  const file = path.join(root, defaults.paths.themes, themeSlug, '.theme-template-source');
  if (!fs.existsSync(file)) return 'template=NOLAN-YOUNG-theme-000';
  return fs.readFileSync(file, 'utf8').trim();
}

function themeSlugForPrompt(promptFile) {
  const base = path.basename(promptFile).replace(/\.[^.]+$/, '');
  const slugBase = base.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'generated';
  const existing = fs.readdirSync(path.join(root, defaults.paths.themes), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => /^([0-9]{3})_nolan_young_theme_/.test(name))
    .sort();
  const next = existing.reduce((max, name) => Math.max(max, Number(name.slice(0, 3))), -1) + 1;
  return `${String(next).padStart(3, '0')}_nolan_young_theme_${slugBase}`;
}

function stagePlan(mode) {
  const map = modeConfig[mode];
  if (!map) fail(`Unsupported mode: ${mode}`);
  return map;
}

function writeRunConfig(reportDir, config) {
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'run.config.json'), `${JSON.stringify(config, null, 2)}\n`);
}

function writeState(reportDir, state) {
  fs.writeFileSync(path.join(reportDir, 'workflow.state.json'), `${JSON.stringify(state, null, 2)}\n`);
}

function ensureTemplateManifest(templateName, reportDir) {
  const output = path.join(reportDir, 'template.manifest.json');
  const result = run('node', ['scripts/create-template-manifest.js', templateName, output]);
  if (result.status !== 0) fail('Template manifest generation failed.');
  return output;
}

function ensureGenerationBrief(themeSlug, promptFile, mode, reportDir) {
  const output = path.join(reportDir, 'ollama-generation', 'theme-generation-brief.md');
  const result = run('node', ['scripts/create-theme-generation-brief.js', themeSlug, promptFile, mode]);
  if (result.status !== 0) fail('Generation brief creation failed.');
  return path.join('reports', 'runs', themeSlug, 'ollama-generation', 'theme-generation-brief.md');
}

function validateTemplate(themeSlug, templateName, reportDir, phase) {
  const result = run('node', ['scripts/write-theme-validation-report.js', themeSlug, templateName, path.join(reportDir, phase === 'final' ? 'validation.final.json' : 'validation.before-finish.json'), phase]);
  if (result.status !== 0) return false;
  return true;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  help();
  process.exit(0);
}

if (args.resume) {
  const themeSlug = safePath(args.resume, 'resume slug');
  const reportDir = path.join(root, defaults.paths.run_reports, themeSlug);
  const stateFile = path.join(reportDir, 'workflow.state.json');
  if (!fs.existsSync(stateFile)) fail(`State file not found: ${stateFile}`);
  const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  if (state.status === 'codex-build-pending' || state.status === 'codex-finish-pending' || state.status === 'codex-repair-pending') {
    console.log(`Resuming ${themeSlug} in state ${state.status}`);
    state.status = 'ready-for-finalization';
    writeState(reportDir, state);
    run('node', ['scripts/rebuild-preview-gallery.js']);
    run('node', ['scripts/validate-preview-gallery.js']);
    validateTemplate(themeSlug, state.template_name, reportDir, 'final');
    state.status = 'completed';
    writeState(reportDir, state);
    process.exit(0);
  }
  fail(`Nothing resumable for ${themeSlug}: ${state.status}`);
}

const mode = args.mode || defaults.default_mode;
const promptFile = args.prompt ? safePath(args.prompt, 'prompt file') : '';
const templateName = args.template || defaults.default_template;
const ollamaModel = args['ollama-model'] || defaults.ollama.model;
const codexModel = args['codex-model'] || defaults.codex.model;
const codexReasoning = args['codex-reasoning'] || defaults.codex.reasoning;
const dryRun = Boolean(args.dryRun);

if (!modeConfig[mode]) fail(`Unsupported mode: ${mode}`);
if (!promptFile) fail('Missing --prompt');
if (!templateName) fail('Missing --template');
if (promptFile.includes('..')) fail('Prompt path traversal is not allowed.');
if (!fs.existsSync(path.join(root, promptFile))) fail(`Prompt file not found: ${promptFile}`);
if (!fs.existsSync(path.join(root, defaults.paths.templates, templateName))) fail(`Template not found: ${templateName}`);

const themeSlug = themeSlugForPrompt(promptFile);
const reportDir = path.join(root, defaults.paths.run_reports, themeSlug);
const themeDir = path.join(root, defaults.paths.themes, themeSlug);
const stages = stagePlan(mode);
const planned = Object.entries(stages).map(([stage, owner]) => ({ stage, owner }));

if (dryRun) {
  console.log(JSON.stringify({ theme_slug: themeSlug, report_dir: path.relative(root, reportDir), theme_dir: path.relative(root, themeDir), stages: planned }, null, 2));
  process.exit(0);
}

const state = { mode, status: 'prepared', theme_slug: themeSlug, template_name: templateName, prompt_file: promptFile, ollama_model: ollamaModel, codex_model: codexModel, codex_reasoning: codexReasoning };
writeRunConfig(reportDir, state);
writeState(reportDir, state);

const prep = run('bash', ['scripts/prepare-theme-from-template.sh', promptFile, templateName]);
if (prep.status !== 0) fail('Theme preparation failed.');
fs.writeFileSync(path.join(reportDir, 'prepare.output.txt'), `${prep.stdout}${prep.stderr}`, 'utf8');
fs.writeFileSync(path.join(reportDir, 'generation-brief.path.txt'), ensureGenerationBrief(themeSlug, promptFile, mode, reportDir), 'utf8');
const manifestPath = ensureTemplateManifest(templateName, reportDir);
const validationBeforePath = path.join(reportDir, 'validation.before-finish.json');
const validationFinalPath = path.join(reportDir, 'validation.final.json');

state.status = mode === 'ollama-only' ? 'ollama-complete' : 'prepared';
writeState(reportDir, state);

if (stages.ollama_generation_pass === 'ollama') {
  const ollama = run('bash', ['scripts/run-ollama-theme-pass.sh', themeSlug, promptFile, ollamaModel]);
  fs.writeFileSync(path.join(reportDir, 'ollama.pass.output.txt'), `${ollama.stdout}${ollama.stderr}`, 'utf8');
  if (ollama.status !== 0) fail('Ollama generation failed.');
}

const preFinish = run('node', ['scripts/write-theme-validation-report.js', themeSlug, templateName, validationBeforePath, 'pre-finish']);
if (preFinish.status !== 0) fail('Pre-finish validation report failed.');
run('bash', ['scripts/validate-theme-from-template.sh', themeSlug, templateName]);
run('bash', ['scripts/theme-quality-check.sh', themeSlug]);

if (mode === 'ollama-only') {
  run('node', ['scripts/generate-static-preview.js', themeSlug]);
  run('node', ['scripts/rebuild-preview-gallery.js']);
  run('node', ['scripts/validate-preview-gallery.js']);
  run('bash', ['scripts/package-theme.sh', themeSlug]);
  run('node', ['scripts/write-theme-validation-report.js', themeSlug, templateName, validationFinalPath, 'final']);
  fs.writeFileSync(path.join(reportDir, 'workflow.summary.md'), `Completed Ollama-only run for ${themeSlug}\n`, 'utf8');
  state.status = 'completed';
  writeState(reportDir, state);
  process.exit(0);
}

if (mode === 'codex-only') {
  const buildBrief = path.join(reportDir, 'codex.build-brief.md');
  run('node', ['scripts/create-codex-theme-brief.js', mode, themeSlug, templateName, promptFile, path.join(reportDir, 'generation-brief.path.txt'), path.join(reportDir, 'template.manifest.json'), validationBeforePath, codexModel, codexReasoning, buildBrief]);
}

const codexBrief = path.join(reportDir, 'codex.finish-brief.md');
run('node', ['scripts/create-codex-theme-brief.js', mode, themeSlug, templateName, promptFile, path.join(reportDir, 'generation-brief.path.txt'), path.join(reportDir, 'template.manifest.json'), path.join(reportDir, 'validation.before-finish.json'), codexModel, codexReasoning, codexBrief]);
if (!process.env.CODEX_COMMAND && !hasCommand('codex')) {
  state.status = mode === 'hybrid' ? 'codex-finish-pending' : 'codex-build-pending';
  writeState(reportDir, state);
  fs.writeFileSync(path.join(reportDir, 'workflow.summary.md'), `Codex pending for ${themeSlug}\n`, 'utf8');
  console.log(`Codex pending for ${themeSlug}. Resume after finishing the Codex pass.`);
  process.exit(2);
}

const codexResult = process.env.CODEX_COMMAND ? runCommandLine(process.env.CODEX_COMMAND, ['exec', codexBrief]) : run('codex', ['exec', codexBrief]);
if (codexResult.status !== 0) fail('Codex execution failed or is unavailable.');

run('node', ['scripts/generate-static-preview.js', themeSlug]);
run('node', ['scripts/rebuild-preview-gallery.js']);
run('node', ['scripts/validate-preview-gallery.js']);
run('bash', ['scripts/package-theme.sh', themeSlug]);
run('node', ['scripts/write-theme-validation-report.js', themeSlug, templateName, validationFinalPath, 'final']);
fs.writeFileSync(path.join(reportDir, 'workflow.summary.md'), `Completed ${mode} run for ${themeSlug}\n`, 'utf8');
state.status = 'completed';
writeState(reportDir, state);
console.log(`Workflow completed for ${themeSlug}`);
