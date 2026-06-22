#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('./lib/repo-root');
const { parseArgs, arg, flag } = require('./lib/args');
const { artifactPlan, assertTemplateName, assertThemeSlug, existingArtifacts, removeThemeArtifacts, safeRelativePath, themeSlugForPrompt } = require('./lib/theme-utils');
const { validateOllamaModel, validateKnownCodexReasoningCombination } = require('./lib/model-config');
const { checkOllamaAccess, checkCodexAccess } = require('./lib/model-access');
const { prepareTheme } = require('./prepare-theme');
const { buildTheme } = require('./build-theme');
const { validateTheme } = require('./validate-theme');
const { previewTheme } = require('./preview-theme');
const { packageTheme } = require('./package-theme');
const { runOllamaGeneration } = require('./providers/ollama');
const { runCodexGeneration, runCodexFinish } = require('./providers/codex');

const defaults = JSON.parse(fs.readFileSync(path.join(root, 'config', 'theme-factory.defaults.json'), 'utf8'));
const args = parseArgs(process.argv.slice(2));

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function help() {
  console.log(`Usage:
  node scripts/run-theme-workflow.js --mode <ollama-only|codex-only|hybrid> --prompt <file> [--template <template>] [--theme-slug <slug>] [--dry-run]
  node scripts/run-theme-workflow.js --resume --theme-slug <theme-slug>
`);
}

function positiveInteger(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) fail(`Invalid ${label}: ${value}`);
  return number;
}

function modePlan(mode) {
  switch (mode) {
    case 'ollama-only':
      return ['ollama-generation'];
    case 'codex-only':
      return ['codex-generation'];
    case 'hybrid':
      return ['ollama-generation', 'codex-finish'];
    default:
      fail(`Unsupported mode: ${mode}`);
  }
}

function expectedInvocations(mode) {
  return {
    ollama_generation: mode === 'ollama-only' || mode === 'hybrid' ? 5 : 0,
    codex_generation: mode === 'codex-only' ? 1 : 0,
    codex_finish: mode === 'hybrid' ? 1 : 0,
    total_ai_passes: mode === 'hybrid' ? 2 : 1
  };
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function recordStep(state, name, status, details = '') {
  state.steps.push({ name, status, details, ended_at: new Date().toISOString() });
  state.status = status === 'failed' && state.status !== 'blocked' ? 'completed-with-failures' : state.status;
  writeJson(path.join(state.report_dir, 'workflow.state.json'), state);
}

async function runSafe(state, name, fn, options = {}) {
  state.status = options.state || state.status;
  writeJson(path.join(state.report_dir, 'workflow.state.json'), state);
  try {
    const result = await fn();
    recordStep(state, name, 'passed');
    return { ok: true, result };
  } catch (error) {
    recordStep(state, name, 'failed', error.message);
    if (options.blocking) state.status = 'blocked';
    return { ok: false, error };
  }
}

async function runWorkflow() {
  if (args.help) {
    help();
    return 0;
  }

  const mode = arg(args, 'mode', defaults.default_mode);
  const promptFile = arg(args, 'prompt') ? safeRelativePath(arg(args, 'prompt'), 'prompt file') : '';
  const templateName = assertTemplateName(arg(args, 'template', defaults.default_template));
  const ollamaModel = arg(args, 'ollama-model', defaults.ollama.model);
  const codexModel = arg(args, 'codex-model', defaults.codex.model);
  const codexReasoningInput = arg(args, 'codex-reasoning', defaults.codex.reasoning);
  const dryRun = flag(args, 'dry-run');
  const explicitThemeSlug = arg(args, 'theme-slug') ? assertThemeSlug(arg(args, 'theme-slug')) : '';
  const replaceExistingTheme = flag(args, 'replace-existing-theme');
  const liveModelCheck = flag(args, 'live-model-check');
  const timeouts = {
    model_check_timeout_ms: positiveInteger(arg(args, 'model-check-timeout-ms', defaults.validation.model_check_timeout_ms || 300000), '--model-check-timeout-ms'),
    ollama_timeout_ms: positiveInteger(arg(args, 'ollama-timeout-ms', defaults.validation.ollama_timeout_ms || 2700000), '--ollama-timeout-ms'),
    codex_timeout_ms: positiveInteger(arg(args, 'codex-timeout-ms', defaults.validation.codex_timeout_ms || 600000), '--codex-timeout-ms'),
    command_timeout_ms: positiveInteger(arg(args, 'command-timeout-ms', defaults.validation.command_timeout_ms || 120000), '--command-timeout-ms')
  };

  const plan = modePlan(mode);
  if (!promptFile) fail('Missing --prompt');
  if (!fs.existsSync(path.join(root, promptFile))) fail(`Prompt file not found: ${promptFile}`);
  if (!fs.existsSync(path.join(root, defaults.paths.templates, templateName))) fail(`Template not found: ${templateName}`);
  if (plan.includes('ollama-generation')) validateOllamaModel(ollamaModel);
  const codexCombination = plan.some((stage) => stage.startsWith('codex'))
    ? validateKnownCodexReasoningCombination(codexModel, codexReasoningInput)
    : null;
  const codexReasoning = codexCombination ? codexCombination.reasoning : codexReasoningInput;
  const themeSlug = explicitThemeSlug || themeSlugForPrompt(promptFile, defaults.paths, { createDirs: !dryRun });
  const reportDir = path.join(root, defaults.paths.run_reports, themeSlug);
  const foundExistingArtifacts = existingArtifacts(themeSlug, defaults.paths);

  if (dryRun) {
    console.log(JSON.stringify({
      theme_slug: themeSlug,
      report_dir: path.relative(root, reportDir).replace(/\\/g, '/'),
      theme_dir: `${defaults.paths.themes}/${themeSlug}`,
      requested: { mode, prompt: promptFile, template: templateName, ollama_model: plan.includes('ollama-generation') ? ollamaModel : '', codex_model: codexCombination ? codexModel : '', codex_reasoning: codexCombination ? codexReasoning : '', timeouts },
      stages: [
        { stage: 'prepare_theme', owner: 'script' },
        ...plan.map((stage) => ({ stage, owner: stage.startsWith('ollama') ? 'ollama' : 'codex' })),
        { stage: 'build_theme_assets', owner: 'script' },
        { stage: 'validate_theme', owner: 'script' },
        { stage: 'generate_preview', owner: 'script' },
        { stage: 'rebuild_preview_gallery', owner: 'script' },
        { stage: 'package_theme', owner: 'script' },
        { stage: 'write_run_summary', owner: 'script' }
      ],
      expected_invocations: expectedInvocations(mode),
      replacement: { requested: replaceExistingTheme, existing_artifacts: foundExistingArtifacts }
    }, null, 2));
    return 0;
  }

  if (explicitThemeSlug && foundExistingArtifacts.length > 0 && !replaceExistingTheme) {
    fail(`Theme slug already has artifacts. Re-run with --replace-existing-theme after reviewing: ${foundExistingArtifacts.join(', ')}`);
  }
  if (explicitThemeSlug && replaceExistingTheme) removeThemeArtifacts(themeSlug, defaults.paths);

  const state = {
    mode,
    status: 'preflight',
    theme_slug: themeSlug,
    template_name: templateName,
    prompt_file: promptFile,
    report_dir: reportDir,
    live_model_check: liveModelCheck,
    requested: { ollama_model: ollamaModel, codex_model: codexModel, codex_reasoning: codexReasoningInput },
    resolved: { ollama_model: plan.includes('ollama-generation') ? ollamaModel : '', codex_model: codexCombination ? codexModel : '', codex_reasoning: codexCombination ? codexReasoning : '' },
    timeouts,
    steps: []
  };
  writeJson(path.join(reportDir, 'workflow.state.json'), state);
  writeJson(path.join(reportDir, 'run.config.json'), state);

  await runSafe(state, 'model-check', () => {
    if (plan.includes('ollama-generation')) checkOllamaAccess({ model: ollamaModel, live: liveModelCheck, timeoutMs: timeouts.model_check_timeout_ms });
    if (codexCombination) checkCodexAccess({ model: codexModel, reasoning: codexReasoning, live: liveModelCheck, timeoutMs: timeouts.model_check_timeout_ms });
  }, { blocking: true, state: 'preflight' });
  if (state.status === 'blocked') return 2;

  await runSafe(state, 'prepare-theme', () => prepareTheme({ promptFile, templateName, themeSlug }), { blocking: true, state: 'prepared' });
  if (state.status === 'blocked') return 2;

  state.status = 'generating';
  if (mode === 'ollama-only') {
    await runSafe(state, 'ollama-generation', () => runOllamaGeneration({ mode, themeSlug, promptFile, model: ollamaModel, timeoutMs: timeouts.ollama_timeout_ms, reportDir }), { blocking: true });
  } else if (mode === 'codex-only') {
    await runSafe(state, 'codex-generation', () => runCodexGeneration({ mode, themeSlug, promptFile, templateName, model: codexModel, reasoning: codexReasoning, timeoutMs: timeouts.codex_timeout_ms, reportDir }), { blocking: true });
  } else if (mode === 'hybrid') {
    await runSafe(state, 'ollama-generation', () => runOllamaGeneration({ mode, themeSlug, promptFile, model: ollamaModel, timeoutMs: timeouts.ollama_timeout_ms, reportDir }), { blocking: true });
    if (state.status !== 'blocked') {
      const draftValidation = path.join(reportDir, 'validation.draft.json');
      await validateTheme({ themeSlug, template: templateName, output: draftValidation }).catch(() => {});
      await runSafe(state, 'codex-finish', () => runCodexFinish({ mode, themeSlug, promptFile, templateName, model: codexModel, reasoning: codexReasoning, timeoutMs: timeouts.codex_timeout_ms, reportDir, validationPath: draftValidation }), { blocking: true });
    }
  }
  if (state.status === 'blocked') return 2;

  state.status = 'building';
  await runSafe(state, 'build-theme', () => buildTheme({ themeSlug, timeoutMs: timeouts.command_timeout_ms, reportPath: path.join(reportDir, 'build.report.json') }));
  state.status = 'finalizing';
  await runSafe(state, 'validate-theme', () => validateTheme({ themeSlug, template: templateName, output: path.join(reportDir, 'validation.final.json') }));
  await runSafe(state, 'preview-theme', () => previewTheme({ themeSlug, rebuildIndex: true }));
  await runSafe(state, 'package-theme', () => packageTheme({ themeSlug }));
  state.status = state.steps.some((step) => step.status === 'failed') ? 'completed-with-failures' : 'completed';
  writeJson(path.join(reportDir, 'workflow.state.json'), state);
  writeJson(path.join(reportDir, 'workflow.summary.json'), state);
  console.log(`Workflow ${state.status} for ${themeSlug}`);
  return state.status === 'completed' ? 0 : 1;
}

if (args.resume) {
  fail('Resume is limited to safe finalization in the simplified runner; rerun the workflow with the original arguments if generation never started.');
}

if (require.main === module) {
  runWorkflow().then((code) => process.exit(code)).catch((error) => fail(error.message));
}

module.exports = { modePlan, runWorkflow };
