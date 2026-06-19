#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { root, scriptPath } = require('../lib/repo-root');

const defaults = JSON.parse(fs.readFileSync(path.join(root, 'config', 'theme-factory.defaults.json'), 'utf8'));
const modeConfig = JSON.parse(fs.readFileSync(path.join(root, 'config', 'workflow-modes.json'), 'utf8'));

const scripts = {
  applyThemeFileBlocks: scriptPath('ai-output', 'apply-theme-file-blocks.js'),
  buildThemeAssets: scriptPath('build', 'build-theme-assets.js'),
  createCodexThemeBrief: scriptPath('modes', 'codex-only', 'create-codex-theme-brief.js'),
  createTemplateManifest: scriptPath('templates', 'create-template-manifest.js'),
  createThemeGenerationBrief: scriptPath('briefs', 'create-theme-generation-brief.js'),
  generateStaticPreview: scriptPath('preview', 'generate-static-preview.js'),
  packageTheme: scriptPath('packaging', 'package-theme.js'),
  prepareThemeFromTemplate: scriptPath('templates', 'prepare-theme-from-template.js'),
  rebuildPreviewGallery: scriptPath('preview', 'rebuild-preview-gallery.js'),
  runOllamaQualityRepairPass: scriptPath('modes', 'ollama-only', 'run-ollama-quality-repair-pass.js'),
  runOllamaThemePass: scriptPath('modes', 'ollama-only', 'run-ollama-theme-pass.js'),
  themeQualityCheck: scriptPath('validation', 'theme-quality-check.js'),
  validatePreviewGallery: scriptPath('preview', 'validate-preview-gallery.js'),
  validateThemeFromTemplate: scriptPath('validation', 'validate-theme-from-template.js'),
  writeThemeValidationReport: scriptPath('validation', 'write-theme-validation-report.js')
};

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function safePath(input, label) {
  if (!input || input.includes('..') || path.isAbsolute(input)) fail(`Unsafe ${label}: ${input}`);
  return path.normalize(input).replace(/\\/g, '/');
}

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: 'pipe', ...options });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) console.error(result.error.message);
  return result;
}

function hasCommand(command) {
  if (process.platform === 'win32') {
    const probe = spawnSync('where.exe', [command], { cwd: root, encoding: 'utf8', stdio: 'ignore' });
    return probe.status === 0;
  }
  const probe = spawnSync(command, ['--help'], { cwd: root, encoding: 'utf8', stdio: 'ignore' });
  return probe.status === 0 || probe.status === 1;
}

function resolveCommand(command) {
  if (process.platform !== 'win32') return command;
  const probe = spawnSync('where.exe', [command], { cwd: root, encoding: 'utf8' });
  if (probe.status !== 0) return command;
  return (probe.stdout || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean)[0] || command;
}

function runCommandLine(commandLine, args = [], input = '') {
  if (!commandLine) return { status: 1, stdout: '', stderr: 'Missing command line.' };
  let result;
  if (process.platform === 'win32') {
    const quote = (value) => {
      const text = String(value);
      if (/^[A-Za-z0-9_:=./\\-]+$/.test(text)) return text;
      return `"${text.replace(/"/g, '\\"')}"`;
    };
    result = spawnSync('cmd.exe', ['/d', '/c', `${quote(commandLine)} ${args.map(quote).join(' ')}`], { cwd: root, encoding: 'utf8', input });
  } else {
    result = spawnSync('/bin/sh', ['-lc', `${commandLine} ${args.map((arg) => `'${String(arg).replace(/'/g, `'\\''`)}'`).join(' ')}`], { cwd: root, encoding: 'utf8', input });
  }
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  return result;
}

function codexArgs(model, reasoning, includeExec = true) {
  const args = includeExec ? ['exec'] : [];
  if (model) args.push('-m', model);
  if (reasoning) args.push('-c', `model_reasoning_effort=${reasoning}`);
  args.push('-');
  return args;
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

function themeSlugForPrompt(promptFile) {
  const base = path.basename(promptFile).replace(/\.[^.]+$/, '');
  const slugBase = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')
    .replace(/^[0-9]+_/, '')
    .replace(/^nolan_young_theme_/, '') || 'generated_theme';
  const existing = [];
  const collectDirs = (dir) => {
    const full = path.join(root, dir);
    if (!fs.existsSync(full)) return;
    fs.readdirSync(full, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .forEach((e) => existing.push(e.name));
  };
  collectDirs(defaults.paths.themes);
  collectDirs(defaults.paths.previews);
  collectDirs(defaults.paths.run_reports);
  const zipDir = path.join(root, defaults.paths.zips);
  if (fs.existsSync(zipDir)) {
    fs.readdirSync(zipDir, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith('.zip'))
      .forEach((e) => existing.push(e.name.replace(/\.zip$/, '')));
  }
  const next = existing
    .filter((name) => /^([0-9]{3})_nolan_young_theme_/.test(name))
    .reduce((max, name) => Math.max(max, Number(name.slice(0, 3))), -1) + 1;
  return `${String(next).padStart(3, '0')}_nolan_young_theme_${slugBase}`;
}

function parsePreparedSlug(output) {
  const match = output.match(/^Prepared theme folder: wp-content\/themes\/([^\r\n]+)$/m);
  if (!match) fail('Could not determine prepared theme slug from preparation output.');
  const slug = match[1].trim();
  if (!/^([0-9]{3})_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(slug)) fail(`Prepared theme slug is invalid: ${slug}`);
  return slug;
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
  const result = run('node', [scripts.createTemplateManifest, templateName, output]);
  if (result.status !== 0) fail('Template manifest generation failed.');
  return output;
}

function ensureGenerationBrief(themeSlug, promptFile, mode, reportDir) {
  const output = path.join(reportDir, 'ollama-generation', 'theme-generation-brief.md');
  const result = run('node', [scripts.createThemeGenerationBrief, themeSlug, promptFile, mode]);
  if (result.status !== 0) fail('Generation brief creation failed.');
  return path.join('reports', 'runs', themeSlug, 'ollama-generation', 'theme-generation-brief.md');
}

function validationReportPassed(reportPath) {
  if (!fs.existsSync(reportPath)) return false;
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  return report.passed === true;
}

function failRun(reportDir, state, message) {
  state.status = 'failed';
  writeState(reportDir, state);
  fail(message);
}

function buildThemeAssets(themeSlug, reportDir) {
  const result = run('node', [scripts.buildThemeAssets, themeSlug]);
  fs.writeFileSync(path.join(reportDir, 'build.output.txt'), `${result.stdout || ''}${result.stderr || ''}`, 'utf8');
  return result.status === 0;
}

function finalizeTheme(themeSlug, templateName, reportDir, state, validationFinalPath) {
  if (!buildThemeAssets(themeSlug, reportDir)) failRun(reportDir, state, 'Theme asset build failed.');
  const preview = run('node', [scripts.generateStaticPreview, themeSlug]);
  fs.writeFileSync(path.join(reportDir, 'preview.output.txt'), `${preview.stdout || ''}${preview.stderr || ''}`, 'utf8');
  if (preview.status !== 0) failRun(reportDir, state, 'Preview generation failed.');
  const gallery = run('node', [scripts.rebuildPreviewGallery]);
  fs.appendFileSync(path.join(reportDir, 'preview.output.txt'), `${gallery.stdout || ''}${gallery.stderr || ''}`, 'utf8');
  if (gallery.status !== 0) failRun(reportDir, state, 'Preview gallery rebuild failed.');
  const galleryValidation = run('node', [scripts.validatePreviewGallery]);
  fs.appendFileSync(path.join(reportDir, 'preview.output.txt'), `${galleryValidation.stdout || ''}${galleryValidation.stderr || ''}`, 'utf8');
  if (galleryValidation.status !== 0) failRun(reportDir, state, 'Preview gallery validation failed.');
  const pack = run('node', [scripts.packageTheme, themeSlug]);
  fs.writeFileSync(path.join(reportDir, 'package.output.txt'), `${pack.stdout || ''}${pack.stderr || ''}`, 'utf8');
  if (pack.status !== 0) failRun(reportDir, state, 'Theme packaging failed.');
  const finalReport = run('node', [scripts.writeThemeValidationReport, themeSlug, templateName, validationFinalPath, 'final']);
  if (finalReport.status !== 0 || !validationReportPassed(validationFinalPath)) failRun(reportDir, state, `Final validation failed for ${state.mode} run.`);
  fs.writeFileSync(path.join(reportDir, 'workflow.summary.md'), `Completed ${state.mode} run for ${themeSlug}\n`, 'utf8');
  state.status = 'completed';
  writeState(reportDir, state);
}

function runCodexBrief(mode, reportDir, state) {
  const briefName = state.status === 'codex-repair-pending'
    ? 'codex.repair-brief.md'
    : state.status === 'codex-build-pending' || mode === 'codex-only' ? 'codex.build-brief.md' : 'codex.finish-brief.md';
  const codexBrief = path.join(reportDir, briefName);
  if (!fs.existsSync(codexBrief)) failRun(reportDir, state, `Missing Codex brief: ${path.relative(root, codexBrief)}`);
  if (!process.env.CODEX_COMMAND && !hasCommand('codex')) {
    state.status = mode === 'hybrid' ? 'codex-finish-pending' : 'codex-build-pending';
    writeState(reportDir, state);
    fs.writeFileSync(path.join(reportDir, 'workflow.summary.md'), `Codex pending for ${state.theme_slug}\n`, 'utf8');
    console.log(`Codex pending for ${state.theme_slug}. Resume after finishing the Codex pass.`);
    return false;
  }
  const codexCommand = process.env.CODEX_COMMAND || '';
  const commandAlreadyIncludesExec = /\bexec\b/.test(codexCommand);
  const codexBriefText = fs.readFileSync(codexBrief, 'utf8');
  const codexResult = codexCommand
    ? runCommandLine(codexCommand, codexArgs(state.codex_model, state.codex_reasoning, !commandAlreadyIncludesExec), codexBriefText)
    : runCommandLine(resolveCommand(process.platform === 'win32' ? 'codex.cmd' : 'codex'), codexArgs(state.codex_model, state.codex_reasoning), codexBriefText);
  const outputName = briefName.replace('-brief.md', '.output.txt');
  fs.writeFileSync(path.join(reportDir, outputName), `${codexResult.stdout || ''}${codexResult.stderr || ''}`, 'utf8');
  if (codexResult.status !== 0) {
    const codexOutput = `${codexResult.stdout || ''}\n${codexResult.stderr || ''}`;
    if (/out of credits|quota|billing|usage limit/i.test(codexOutput)) {
      state.status = mode === 'hybrid' ? 'codex-finish-pending' : 'codex-build-pending';
      state.codex_pending_reason = 'Codex execution is blocked by workspace credits, quota, billing, or usage limits.';
      writeState(reportDir, state);
      fs.writeFileSync(path.join(reportDir, 'workflow.summary.md'), `Codex pending for ${state.theme_slug}: ${state.codex_pending_reason}\n`, 'utf8');
      console.error(state.codex_pending_reason);
      process.exit(2);
    }
    failRun(reportDir, state, 'Codex execution failed or is unavailable.');
  }
  delete state.codex_pending_reason;
  writeState(reportDir, state);
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
  const validationFinalPath = path.join(reportDir, 'validation.final.json');
  if (state.status === 'codex-build-pending' || state.status === 'codex-finish-pending' || state.status === 'codex-repair-pending') {
    console.log(`Resuming ${themeSlug} in state ${state.status}`);
    if (!runCodexBrief(state.mode, reportDir, state)) process.exit(2);
    state.status = 'ready-for-finalization';
    writeState(reportDir, state);
    finalizeTheme(themeSlug, state.template_name, reportDir, state, validationFinalPath);
    console.log(`Workflow completed for ${themeSlug}`);
    process.exit(0);
  }
  if (state.status === 'ready-for-finalization') {
    finalizeTheme(themeSlug, state.template_name, reportDir, state, validationFinalPath);
    console.log(`Workflow completed for ${themeSlug}`);
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

const stages = stagePlan(mode);
const planned = Object.entries(stages).map(([stage, owner]) => ({ stage, owner }));
let themeSlug = themeSlugForPrompt(promptFile);
let reportDir = path.join(root, defaults.paths.run_reports, themeSlug);
let themeDir = path.join(root, defaults.paths.themes, themeSlug);

if (dryRun) {
  console.log(JSON.stringify({ theme_slug: themeSlug, report_dir: path.relative(root, reportDir), theme_dir: path.relative(root, themeDir), stages: planned }, null, 2));
  process.exit(0);
}

const prep = run('node', [scripts.prepareThemeFromTemplate, promptFile, templateName]);
if (prep.status !== 0) fail('Theme preparation failed.');
themeSlug = parsePreparedSlug(`${prep.stdout}${prep.stderr}`);
reportDir = path.join(root, defaults.paths.run_reports, themeSlug);
themeDir = path.join(root, defaults.paths.themes, themeSlug);

const state = { mode, status: 'prepared', theme_slug: themeSlug, template_name: templateName, prompt_file: promptFile, ollama_model: ollamaModel, codex_model: codexModel, codex_reasoning: codexReasoning };
writeRunConfig(reportDir, state);
writeState(reportDir, state);
fs.writeFileSync(path.join(reportDir, 'prepare.output.txt'), `${prep.stdout}${prep.stderr}`, 'utf8');
fs.writeFileSync(path.join(reportDir, 'generation-brief.path.txt'), ensureGenerationBrief(themeSlug, promptFile, mode, reportDir), 'utf8');
const manifestPath = ensureTemplateManifest(templateName, reportDir);
const validationBeforePath = path.join(reportDir, 'validation.before-finish.json');
const validationFinalPath = path.join(reportDir, 'validation.final.json');

state.status = mode === 'ollama-only' ? 'ollama-complete' : 'prepared';
writeState(reportDir, state);

if (stages.ollama_generation_pass === 'ollama') {
  const ollama = run('node', [scripts.runOllamaThemePass, themeSlug, promptFile, ollamaModel]);
  fs.writeFileSync(path.join(reportDir, 'ollama.pass.output.txt'), `${ollama.stdout}${ollama.stderr}`, 'utf8');
  if (ollama.status !== 0) fail('Ollama generation failed.');
  if (stages.build_theme_assets === 'script' && !buildThemeAssets(themeSlug, reportDir)) {
    failRun(reportDir, state, 'Theme asset build failed after Ollama generation.');
  }
}

const preFinish = run('node', [scripts.writeThemeValidationReport, themeSlug, templateName, validationBeforePath, 'pre-finish']);
if (preFinish.status !== 0) failRun(reportDir, state, 'Pre-finish validation report failed.');
const templateCheck = run('node', [scripts.validateThemeFromTemplate, themeSlug, templateName]);
if (templateCheck.status !== 0) failRun(reportDir, state, 'Template-aware validation failed.');
let qualityCheck = run('node', [scripts.themeQualityCheck, themeSlug]);
if (qualityCheck.status !== 0 && mode === 'ollama-only') {
  const repair = run('node', [scripts.runOllamaQualityRepairPass, themeSlug, promptFile, ollamaModel]);
  fs.writeFileSync(path.join(reportDir, 'ollama.quality-repair.output.txt'), `${repair.stdout}${repair.stderr}`, 'utf8');
  if (repair.status !== 0) failRun(reportDir, state, 'Ollama quality repair failed.');
  if (!buildThemeAssets(themeSlug, reportDir)) failRun(reportDir, state, 'Theme asset build failed after Ollama quality repair.');
  qualityCheck = run('node', [scripts.themeQualityCheck, themeSlug]);
}
if (qualityCheck.status !== 0 && mode === 'ollama-only') failRun(reportDir, state, 'Theme quality check failed after Ollama generation.');

if (mode === 'ollama-only') {
  finalizeTheme(themeSlug, templateName, reportDir, state, validationFinalPath);
  process.exit(0);
}

let codexBrief = path.join(reportDir, 'codex.finish-brief.md');
if (mode === 'codex-only') {
  codexBrief = path.join(reportDir, 'codex.build-brief.md');
  run('node', [scripts.createCodexThemeBrief, mode, themeSlug, templateName, promptFile, path.join(reportDir, 'generation-brief.path.txt'), path.join(reportDir, 'template.manifest.json'), validationBeforePath, codexModel, codexReasoning, codexBrief]);
}

if (mode !== 'codex-only') {
  run('node', [scripts.createCodexThemeBrief, mode, themeSlug, templateName, promptFile, path.join(reportDir, 'generation-brief.path.txt'), path.join(reportDir, 'template.manifest.json'), path.join(reportDir, 'validation.before-finish.json'), codexModel, codexReasoning, codexBrief]);
}
if (!runCodexBrief(mode, reportDir, state)) process.exit(2);
state.status = 'ready-for-finalization';
writeState(reportDir, state);
finalizeTheme(themeSlug, templateName, reportDir, state, validationFinalPath);
console.log(`Workflow completed for ${themeSlug}`);
