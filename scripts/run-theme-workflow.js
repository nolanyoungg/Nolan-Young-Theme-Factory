#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root, scriptPath } = require('./shared/repo-root');
const { parseArgs, arg, flag } = require('./shared/args');
const { runCommand } = require('./shared/command-runner');
const { validateKnownCodexReasoningCombination, validateOllamaModel } = require('./shared/model-config');
const { checkCodexAccess, checkOllamaAccess, codexExecArgs } = require('./shared/model-access');
const {
  artifactPlan,
  assertTemplateName,
  assertThemeSlug,
  existingArtifacts,
  removeThemeArtifacts,
  safeRelativePath,
  themeSlugForPrompt
} = require('./shared/theme-utils');

const defaults = JSON.parse(fs.readFileSync(path.join(root, 'config', 'theme-factory.defaults.json'), 'utf8'));
const modeConfig = JSON.parse(fs.readFileSync(path.join(root, 'config', 'workflow-modes.json'), 'utf8'));

const scripts = {
  applyThemeFileBlocks: scriptPath('ai-output', 'apply-theme-file-blocks.js'),
  buildThemeAssets: scriptPath('build', 'build-theme-assets.js'),
  createCodexThemeBrief: scriptPath('modes', 'codex-only', 'create-codex-theme-brief.js'),
  createTemplateManifest: scriptPath('template-theme-copy', 'create-template-manifest.js'),
  createThemeGenerationBrief: scriptPath('briefs', 'create-theme-generation-brief.js'),
  generateStaticPreview: scriptPath('theme-preview', 'generate-static-preview.js'),
  packageTheme: scriptPath('theme-zipping', 'zip-theme.js'),
  prepareThemeFromTemplate: scriptPath('template-theme-copy', 'prepare-theme-from-template.js'),
  rebuildPreviewGallery: scriptPath('theme-preview', 'rebuild-preview-gallery.js'),
  runOllamaQualityRepairPass: scriptPath('modes', 'ollama-only', 'repair-theme.js'),
  runOllamaThemePass: scriptPath('modes', 'ollama-only', 'generate-theme.js'),
  themeQualityCheck: scriptPath('validation', 'theme-quality-check.js'),
  validatePreviewGallery: scriptPath('theme-preview', 'validate-preview-gallery.js'),
  validateThemeFromTemplate: scriptPath('validation', 'validate-theme-from-template.js'),
  writeThemeValidationReport: scriptPath('validation', 'write-theme-validation-report.js')
};

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function safePath(input, label) {
  return safeRelativePath(input, label);
}

function run(cmd, args, options = {}) {
  return runCommand(cmd, args, { cwd: root, ...options });
}

function help() {
  console.log(`Usage:
  node scripts/run-theme-workflow.js --mode <ollama-only|codex-only|hybrid> --prompt <file> [--template <template>] [--theme-slug <slug>] [--ollama-model <model>] [--codex-model <model>] [--codex-reasoning <level>] [--dry-run]
  node scripts/run-theme-workflow.js --resume --theme-slug <theme-slug>
`);
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
  const result = run('node', [scripts.buildThemeAssets, '--theme-slug', themeSlug, '--command-timeout-ms', String(defaults.validation.command_timeout_ms || 120000)]);
  fs.writeFileSync(path.join(reportDir, 'build.output.txt'), `${result.stdout || ''}${result.stderr || ''}`, 'utf8');
  return result.status === 0;
}

function checkModelAccess(provider, timeoutMs, reportDir, state) {
  try {
    const debugDir = path.join(reportDir, 'debug');
    const report = provider === 'ollama'
      ? checkOllamaAccess({ model: state.resolved.ollama_model, timeoutMs, live: true, debugDir, mode: state.mode, themeSlug: state.theme_slug })
      : checkCodexAccess({ model: state.resolved.codex_model, reasoning: state.resolved.codex_reasoning, timeoutMs, live: true, debugDir, mode: state.mode, themeSlug: state.theme_slug });
    fs.writeFileSync(path.join(reportDir, `model-check.${provider}.json`), `${JSON.stringify({ passed: true, ...report }, null, 2)}\n`, 'utf8');
    state.model_checks[provider] = {
      passed: true,
      executable: report.executable,
      version: report.version,
      live_capability_check: report.live_capability_check
    };
    if (provider === 'ollama') {
      console.log(`Ollama:
  Executable: ${report.executable}
  Version: ${report.version}
  Requested model: ${report.requested_model}
  Exact model installed: ${report.exact_model_installed ? 'yes' : 'no'}
  Model details check: ${report.model_details_check}
  Model access check: ${report.live_capability_check ? 'passed' : 'skipped'}`);
    } else {
      console.log(`Codex:
  Executable: ${report.executable}
  Version: ${report.version}
  Requested model: ${report.requested_model}
  Requested reasoning: ${report.requested_reasoning}
  CLI option check: ${report.cli_option_check}
  Model access check: ${report.live_capability_check ? 'passed' : 'skipped'}`);
    }
    writeState(reportDir, state);
  } catch (error) {
    const report = error.report || {};
    fs.writeFileSync(path.join(reportDir, `model-check.${provider}.json`), `${JSON.stringify({
      passed: false,
      classification: error.classification || 'UNKNOWN_PROVIDER_FAILURE',
      error: error.message,
      ...report
    }, null, 2)}\n`, 'utf8');
    failRun(reportDir, state, `${provider} model access check failed: ${error.message}`);
  }
}

function validateRequestedModels(stages, ollamaModel, codexModel, codexReasoning) {
  try {
    if (stages.ollama_generation_pass === 'ollama') validateOllamaModel(ollamaModel);
    if (stages.codex_generation_pass === 'codex' || stages.codex_finish_pass === 'codex') {
      return validateKnownCodexReasoningCombination(codexModel, codexReasoning);
    }
  } catch (error) {
    fail(error.message);
  }
  return null;
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
  fs.writeFileSync(path.join(reportDir, 'workflow.summary.md'), `# Workflow Summary

Status: completed
Mode: ${state.mode}
Theme slug: ${themeSlug}
Ollama model: ${state.resolved.ollama_model || 'not used'}
Codex model: ${state.resolved.codex_model || 'not used'}
Codex reasoning: ${state.resolved.codex_reasoning || 'not used'}

## Invocation Counts

- Provider capability checks: ${state.invocations.provider_capability_checks}
- Ollama generation invocations: ${state.invocations.ollama_generation}
- Codex generation invocations: ${state.invocations.codex_generation}
- Codex finish invocations: ${state.invocations.codex_finish}
- Targeted repair invocations: ${state.invocations.targeted_repairs}
- Command retries: ${state.invocations.command_retries}
- Failed invocations: ${state.invocations.failed_invocations}

No model fallback or provider substitution was performed.
`, 'utf8');
  state.status = 'completed';
  writeState(reportDir, state);
}

function runCodexBrief(mode, reportDir, state) {
  const briefName = state.status === 'codex-repair-pending'
    ? 'codex.repair-brief.md'
    : state.status === 'codex-build-pending' || mode === 'codex-only' ? 'codex.build-brief.md' : 'codex.finish-brief.md';
  const codexBrief = path.join(reportDir, briefName);
  if (!fs.existsSync(codexBrief)) failRun(reportDir, state, `Missing Codex brief: ${path.relative(root, codexBrief)}`);
  const codexBriefText = fs.readFileSync(codexBrief, 'utf8');
  const stage = briefName.includes('build') ? 'codex-build' : briefName.includes('repair') ? 'codex-repair' : 'codex-finish';
  const codexResult = run(process.platform === 'win32' ? 'codex.cmd' : 'codex', codexExecArgs(state.resolved.codex_model, state.resolved.codex_reasoning), {
    debugDir: path.join(reportDir, 'debug'),
    echoSummary: true,
    input: codexBriefText,
    mode,
    model: state.resolved.codex_model,
    provider: 'Codex',
    reasoning: state.resolved.codex_reasoning,
    stage,
    themeSlug: state.theme_slug,
    timeoutMs: state.timeouts.codex_timeout_ms
  });
  const outputName = briefName.replace('-brief.md', '.output.txt');
  fs.writeFileSync(path.join(reportDir, outputName), `${codexResult.stdout || ''}${codexResult.stderr || ''}`, 'utf8');
  if (stage === 'codex-build') state.invocations.codex_generation += 1;
  if (stage === 'codex-finish') state.invocations.codex_finish += 1;
  if (codexResult.status !== 0) {
    state.invocations.failed_invocations += 1;
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
  const resumeSlug = args.resume === true ? arg(args, 'theme-slug', args._[0] || '') : args.resume;
  const themeSlug = safePath(resumeSlug, 'resume slug');
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

function sourceFor(key, configured, fallback) {
  if (args[key] !== undefined && args[key] !== true) return 'command-line';
  if (configured !== undefined && configured !== fallback) return 'repository-config';
  return 'repository-default';
}

function positiveInteger(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) fail(`Invalid ${label}: ${value}`);
  return number;
}

const mode = arg(args, 'mode', defaults.default_mode);
const promptFile = arg(args, 'prompt') ? safePath(arg(args, 'prompt'), 'prompt file') : '';
const templateName = arg(args, 'template', defaults.default_template);
const ollamaModel = arg(args, 'ollama-model', defaults.ollama.model);
const codexModel = arg(args, 'codex-model', defaults.codex.model);
const codexReasoningInput = arg(args, 'codex-reasoning', defaults.codex.reasoning);
const dryRun = flag(args, 'dry-run');
const explicitThemeSlug = arg(args, 'theme-slug') ? assertThemeSlug(arg(args, 'theme-slug')) : '';
const replaceExistingTheme = flag(args, 'replace-existing-theme');
const timeouts = {
  model_check_timeout_ms: positiveInteger(arg(args, 'model-check-timeout-ms', defaults.validation.model_check_timeout_ms || 120000), '--model-check-timeout-ms'),
  ollama_timeout_ms: positiveInteger(arg(args, 'ollama-timeout-ms', defaults.validation.ollama_timeout_ms || 180000), '--ollama-timeout-ms'),
  codex_timeout_ms: positiveInteger(arg(args, 'codex-timeout-ms', defaults.validation.codex_timeout_ms || 180000), '--codex-timeout-ms'),
  command_timeout_ms: positiveInteger(arg(args, 'command-timeout-ms', defaults.validation.command_timeout_ms || 120000), '--command-timeout-ms')
};

if (!modeConfig[mode]) fail(`Unsupported mode: ${mode}`);
if (!promptFile) fail('Missing --prompt');
if (!templateName) fail('Missing --template');
assertTemplateName(templateName);
if (promptFile.includes('..')) fail('Prompt path traversal is not allowed.');
if (!fs.existsSync(path.join(root, promptFile))) fail(`Prompt file not found: ${promptFile}`);
if (!fs.existsSync(path.join(root, defaults.paths.templates, templateName))) fail(`Template not found: ${templateName}`);

const stages = stagePlan(mode);
const codexCombination = validateRequestedModels(stages, ollamaModel, codexModel, codexReasoningInput);
const codexReasoning = codexCombination ? codexCombination.reasoning : codexReasoningInput;
const planned = Object.entries(stages).map(([stage, owner]) => ({ stage, owner }));
let themeSlug = explicitThemeSlug || themeSlugForPrompt(promptFile, defaults.paths, { createDirs: !dryRun });
let reportDir = path.join(root, defaults.paths.run_reports, themeSlug);
let themeDir = path.join(root, defaults.paths.themes, themeSlug);
const artifacts = artifactPlan(themeSlug, defaults.paths);
const foundExistingArtifacts = existingArtifacts(themeSlug, defaults.paths);
const expectedInvocations = {
  provider_capability_checks: (stages.ollama_generation_pass === 'ollama' ? 1 : 0) + ((stages.codex_generation_pass === 'codex' || stages.codex_finish_pass === 'codex') ? 1 : 0),
  ollama_generation: stages.ollama_generation_pass === 'ollama' ? 5 : 0,
  codex_generation: stages.codex_generation_pass === 'codex' ? 1 : 0,
  codex_finish: stages.codex_finish_pass === 'codex' ? 1 : 0,
  max_targeted_repairs: mode === 'ollama-only' ? 1 : 0
};

if (dryRun) {
  console.log(JSON.stringify({
    theme_slug: themeSlug,
    report_dir: path.relative(root, reportDir).replace(/\\/g, '/'),
    theme_dir: path.relative(root, themeDir).replace(/\\/g, '/'),
    requested: {
      mode,
      prompt: promptFile,
      template: templateName,
      ollama_model: ollamaModel,
      codex_model: codexModel,
      codex_reasoning: codexReasoning,
      timeouts
    },
    configuration_sources: {
      ollama_model: sourceFor('ollama-model', defaults.ollama.model, 'qwen2.5-coder:14b'),
      codex_model: sourceFor('codex-model', defaults.codex.model, 'gpt-5.4'),
      codex_reasoning: sourceFor('codex-reasoning', defaults.codex.reasoning, 'medium')
    },
    replacement: {
      requested: replaceExistingTheme,
      existing_artifacts: foundExistingArtifacts
    },
    stages: planned,
    expected_invocations: expectedInvocations
  }, null, 2));
  process.exit(0);
}

if (explicitThemeSlug && foundExistingArtifacts.length > 0 && !replaceExistingTheme) {
  fail(`Theme slug already has artifacts. Re-run with --replace-existing-theme after reviewing: ${foundExistingArtifacts.join(', ')}`);
}
if (explicitThemeSlug && replaceExistingTheme) {
  console.log(`Replacing exact theme slug: ${themeSlug}`);
  console.log(`Deleting only these artifacts if present:\n- ${artifacts.join('\n- ')}`);
  removeThemeArtifacts(themeSlug, defaults.paths);
}

const state = {
  mode,
  status: 'preflight',
  theme_slug: themeSlug,
  template_name: templateName,
  prompt_file: promptFile,
  requested: {
    ollama_model: ollamaModel,
    codex_model: codexModel,
    codex_reasoning: codexReasoningInput
  },
  resolved: {
    ollama_model: stages.ollama_generation_pass === 'ollama' ? ollamaModel : '',
    codex_model: (stages.codex_generation_pass === 'codex' || stages.codex_finish_pass === 'codex') ? codexModel : '',
    codex_reasoning: (stages.codex_generation_pass === 'codex' || stages.codex_finish_pass === 'codex') ? codexReasoning : ''
  },
  configuration_sources: {
    ollama_model: sourceFor('ollama-model', defaults.ollama.model, 'qwen2.5-coder:14b'),
    codex_model: sourceFor('codex-model', defaults.codex.model, 'gpt-5.4'),
    codex_reasoning: sourceFor('codex-reasoning', defaults.codex.reasoning, 'medium')
  },
  replacement: {
    requested: replaceExistingTheme,
    artifacts
  },
  timeouts,
  invocations: {
    provider_capability_checks: 0,
    ollama_generation: 0,
    codex_generation: 0,
    codex_finish: 0,
    command_retries: 0,
    targeted_repairs: 0,
    failed_invocations: 0
  },
  model_checks: {}
};
writeRunConfig(reportDir, state);
writeState(reportDir, state);
console.log(`AI configuration validation
---------------------------
Mode: ${mode}

Ollama model: ${state.resolved.ollama_model || 'not used'}
Codex model: ${state.resolved.codex_model || 'not used'}
Codex reasoning: ${state.resolved.codex_reasoning || 'not used'}
Configuration source:
  Ollama model: ${state.configuration_sources.ollama_model}
  Codex model: ${state.configuration_sources.codex_model}
  Codex reasoning: ${state.configuration_sources.codex_reasoning}
Timeouts:
  Model check: ${timeouts.model_check_timeout_ms}
  Ollama: ${timeouts.ollama_timeout_ms}
  Codex: ${timeouts.codex_timeout_ms}
  Command: ${timeouts.command_timeout_ms}
`);
if (stages.ollama_generation_pass === 'ollama') {
  checkModelAccess('ollama', timeouts.model_check_timeout_ms, reportDir, state);
  state.invocations.provider_capability_checks += 1;
}
if (stages.codex_generation_pass === 'codex' || stages.codex_finish_pass === 'codex') {
  checkModelAccess('codex', timeouts.model_check_timeout_ms, reportDir, state);
  state.invocations.provider_capability_checks += 1;
}

const prep = run('node', [scripts.prepareThemeFromTemplate, '--prompt', promptFile, '--template', templateName, '--theme-slug', themeSlug], { timeoutMs: timeouts.command_timeout_ms });
if (prep.status !== 0) fail('Theme preparation failed.');
themeSlug = parsePreparedSlug(`${prep.stdout}${prep.stderr}`);
if (themeSlug !== state.theme_slug) fail(`Prepared slug mismatch. Expected ${state.theme_slug}, got ${themeSlug}.`);
reportDir = path.join(root, defaults.paths.run_reports, themeSlug);
themeDir = path.join(root, defaults.paths.themes, themeSlug);

state.status = 'prepared';
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
  const ollama = run('node', [scripts.runOllamaThemePass, '--theme-slug', themeSlug, '--prompt', promptFile, '--ollama-model', state.resolved.ollama_model, '--ollama-timeout-ms', String(timeouts.ollama_timeout_ms)], { timeoutMs: timeouts.ollama_timeout_ms * 6 });
  fs.writeFileSync(path.join(reportDir, 'ollama.pass.output.txt'), `${ollama.stdout}${ollama.stderr}`, 'utf8');
  state.invocations.ollama_generation += 5;
  if (ollama.status !== 0) {
    state.invocations.failed_invocations += 1;
    fail('Ollama generation failed.');
  }
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
  const repair = run('node', [scripts.runOllamaQualityRepairPass, '--theme-slug', themeSlug, '--prompt', promptFile, '--ollama-model', state.resolved.ollama_model, '--ollama-timeout-ms', String(timeouts.ollama_timeout_ms)], { timeoutMs: timeouts.ollama_timeout_ms * 2 });
  fs.writeFileSync(path.join(reportDir, 'ollama.quality-repair.output.txt'), `${repair.stdout}${repair.stderr}`, 'utf8');
  state.invocations.targeted_repairs += 1;
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
  run('node', [scripts.createCodexThemeBrief, mode, themeSlug, templateName, promptFile, path.join(reportDir, 'generation-brief.path.txt'), path.join(reportDir, 'template.manifest.json'), validationBeforePath, state.resolved.codex_model, state.resolved.codex_reasoning, codexBrief], { timeoutMs: timeouts.command_timeout_ms });
}

if (mode !== 'codex-only') {
  run('node', [scripts.createCodexThemeBrief, mode, themeSlug, templateName, promptFile, path.join(reportDir, 'generation-brief.path.txt'), path.join(reportDir, 'template.manifest.json'), path.join(reportDir, 'validation.before-finish.json'), state.resolved.codex_model, state.resolved.codex_reasoning, codexBrief], { timeoutMs: timeouts.command_timeout_ms });
}
if (!runCodexBrief(mode, reportDir, state)) process.exit(2);
state.status = 'ready-for-finalization';
writeState(reportDir, state);
finalizeTheme(themeSlug, templateName, reportDir, state, validationFinalPath);
console.log(`Workflow completed for ${themeSlug}`);
