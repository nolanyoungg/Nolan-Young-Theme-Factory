#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');
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
const { TEMPLATE_OWNED_PROMPT_SECTIONS, ollamaStageSequence, resolveOllamaBatchesForDirectory, validateStagePlan } = require('./lib/ollama-batches');
const { buildCoverage, expandStageRequirementIds, parsePromptContract } = require('./lib/prompt-contract');

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

function modePlan(mode, batches) {
  const ollamaStages = ollamaStageSequence(batches).map((stage) => `ollama-${stage}`);
  switch (mode) {
    case 'ollama-only':
      return ollamaStages;
    case 'codex-only':
      return ['codex-generation'];
    case 'hybrid':
      return [...ollamaStages, 'codex-finish'];
    default:
      fail(`Unsupported mode: ${mode}`);
  }
}

function expectedInvocations(mode, batches) {
  const ollamaInvocationCount = ollamaStageSequence(batches).length;
  return {
    planned_generation_operations: mode === 'hybrid' ? 2 : 1,
    ollama_provider_invocations: mode === 'ollama-only' || mode === 'hybrid' ? ollamaInvocationCount : 0,
    codex_provider_invocations: mode === 'codex-only' || mode === 'hybrid' ? 1 : 0
  };
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.round(Number(milliseconds || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

function providerForStep(state, name) {
  if (/^ollama/.test(name)) {
    return {
      provider: 'ollama',
      model: state.resolved?.ollama_model || state.requested?.ollama_model || '',
      reasoning: ''
    };
  }
  if (/^codex/.test(name)) {
    return {
      provider: 'codex',
      model: state.resolved?.codex_model || state.requested?.codex_model || '',
      reasoning: state.resolved?.codex_reasoning || state.requested?.codex_reasoning || ''
    };
  }
  return { provider: 'script', model: '', reasoning: '' };
}

function buildTimingSummary(state, now = new Date()) {
  const startedAt = state.started_at || state.steps?.[0]?.started_at || now.toISOString();
  const endedAt = state.ended_at || now.toISOString();
  const totalDurationMs = Math.max(0, Date.parse(endedAt) - Date.parse(startedAt));
  return {
    schema_version: 'run-timing/v1',
    theme_slug: state.theme_slug || '',
    mode: state.mode || '',
    status: state.status || '',
    template_name: state.template_name || '',
    template_source_path: state.template_source_path || '',
    prompt_file: state.prompt_file || '',
    started_at: startedAt,
    ended_at: state.ended_at || '',
    total_duration_ms: totalDurationMs,
    total_duration: formatDuration(totalDurationMs),
    live_model_check: Boolean(state.live_model_check),
    requested: {
      ollama_model: state.requested?.ollama_model || '',
      codex_model: state.requested?.codex_model || '',
      codex_reasoning: state.requested?.codex_reasoning || ''
    },
    resolved: {
      ollama_model: state.resolved?.ollama_model || '',
      codex_model: state.resolved?.codex_model || '',
      codex_reasoning: state.resolved?.codex_reasoning || ''
    },
    steps: (state.steps || []).map((step) => ({
      name: step.name,
      provider: step.provider || providerForStep(state, step.name).provider,
      model: step.model || providerForStep(state, step.name).model,
      reasoning: step.reasoning || providerForStep(state, step.name).reasoning,
      status: step.status,
      started_at: step.started_at || '',
      ended_at: step.ended_at || '',
      duration_ms: Number(step.duration_ms || 0),
      duration: formatDuration(step.duration_ms || 0),
      details: step.details || ''
    }))
  };
}

function timingMarkdown(summary) {
  const modelLines = [
    `- Mode: \`${summary.mode}\``,
    `- Status: \`${summary.status}\``,
    `- Theme: \`${summary.theme_slug}\``,
    `- Prompt: \`${summary.prompt_file}\``,
    `- Template: \`${summary.template_name}\`${summary.template_source_path ? ` from \`${summary.template_source_path}\`` : ''}`,
    `- Ollama model: \`${summary.resolved.ollama_model || 'not used'}\``,
    `- Codex model: \`${summary.resolved.codex_model || 'not used'}\``,
    `- Codex reasoning: \`${summary.resolved.codex_reasoning || 'not used'}\``,
    `- Total duration: \`${summary.total_duration}\` (${summary.total_duration_ms} ms)`
  ];
  const rows = summary.steps.map((step) => `| ${step.name} | ${step.provider} | ${step.model || '-'} | ${step.reasoning || '-'} | ${step.status} | ${step.duration} | ${step.duration_ms} |`);
  return [
    `# Run Timing: ${summary.theme_slug}`,
    '',
    ...modelLines,
    '',
    '| Step | Provider | Model | Reasoning | Status | Duration | Duration ms |',
    '| --- | --- | --- | --- | --- | --- | ---: |',
    ...rows,
    ''
  ].join('\n');
}

function writeTimingReports(state) {
  if (!state.report_dir) return;
  const summary = buildTimingSummary(state);
  const prefix = state.workflow_state_file === 'workflow.resume.state.json' || state.mode === 'resume-finalization' ? 'resume-timing' : 'run-timing';
  writeJson(path.join(state.report_dir, `${prefix}.json`), summary);
  fs.writeFileSync(path.join(state.report_dir, `${prefix}.md`), timingMarkdown(summary), 'utf8');
}

function writeWorkflowState(state, filename = '') {
  const stateFile = filename || state.workflow_state_file || 'workflow.state.json';
  writeJson(path.join(state.report_dir, stateFile), state);
  writeTimingReports(state);
}

function finishWorkflow(state, filename = '') {
  state.ended_at = new Date().toISOString();
  writeWorkflowState(state, filename);
  writeJson(path.join(state.report_dir, 'workflow.summary.json'), state);
}

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

function themeHashes(themeSlug) {
  const themeDir = path.join(root, defaults.paths.themes, themeSlug);
  return walkFiles(themeDir).map((file) => ({
    path: path.relative(themeDir, file).replace(/\\/g, '/'),
    sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  })).sort((a, b) => a.path.localeCompare(b.path));
}

const RESUME_ALLOWED_MUTABLE_OUTPUTS = new Set([
  'assets/css/bundle-rtl.css',
  'assets/css/bundle.asset.php',
  'assets/css/bundle.css',
  'assets/css/editor-rtl.css',
  'assets/css/editor.asset.php',
  'assets/css/editor.css',
  'assets/js/bundle.asset.php',
  'assets/js/bundle.js',
  'package-lock.json'
]);

function verifyFrozenSource(themeSlug, reportDir) {
  const frozenPath = path.join(reportDir, 'generated-theme-hashes.json');
  if (!fs.existsSync(frozenPath)) throw new Error(`Frozen generated source hash report not found: ${path.relative(root, frozenPath).replace(/\\/g, '/')}`);
  const frozen = JSON.parse(fs.readFileSync(frozenPath, 'utf8')).files || [];
  const current = themeHashes(themeSlug);
  const expected = new Map(frozen.map((entry) => [entry.path, entry.sha256]));
  const actual = new Map(current.map((entry) => [entry.path, entry.sha256]));
  const drift = { changed_files: [], added_files: [], missing_files: [], allowed_mutable_files: [] };
  for (const [file, expectedHash] of expected.entries()) {
    const currentHash = actual.get(file);
    if (!currentHash) drift.missing_files.push({ path: file, expected_hash: expectedHash, current_hash: '' });
    else if (currentHash !== expectedHash) {
      const item = { path: file, expected_hash: expectedHash, current_hash: currentHash };
      if (RESUME_ALLOWED_MUTABLE_OUTPUTS.has(file)) drift.allowed_mutable_files.push(item);
      else drift.changed_files.push(item);
    }
  }
  for (const [file, currentHash] of actual.entries()) {
    if (!expected.has(file) && !RESUME_ALLOWED_MUTABLE_OUTPUTS.has(file)) drift.added_files.push({ path: file, expected_hash: '', current_hash: currentHash });
  }
  const passed = drift.changed_files.length === 0 && drift.added_files.length === 0 && drift.missing_files.length === 0;
  writeJson(path.join(reportDir, 'resume-source-drift.json'), { checked_at: new Date().toISOString(), allowed_mutable_outputs: [...RESUME_ALLOWED_MUTABLE_OUTPUTS], passed, ...drift });
  if (!passed) throw new Error(`Frozen generated source drift detected. See ${path.relative(root, path.join(reportDir, 'resume-source-drift.json')).replace(/\\/g, '/')}`);
  return { passed: true, drift };
}

function resultFailed(result) {
  if (!result) return false;
  if (result.passed === false || result.ok === false) return true;
  if (Number.isInteger(result.status) && result.status !== 0) return true;
  return false;
}

function recordStep(state, name, status, details = '', timing = {}) {
  const provider = providerForStep(state, name);
  state.steps.push({
    name,
    status,
    provider: provider.provider,
    model: provider.model,
    reasoning: provider.reasoning,
    details,
    started_at: timing.startedAt || '',
    ended_at: timing.endedAt || new Date().toISOString(),
    duration_ms: Number(timing.durationMs || 0)
  });
  delete state.current_step;
  writeWorkflowState(state);
}

async function runSafe(state, name, fn, options = {}) {
  state.status = options.state || state.status;
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  state.current_step = { name, started_at: startedAt };
  writeWorkflowState(state);
  try {
    const result = await fn();
    const timing = { startedAt, endedAt: new Date().toISOString(), durationMs: Date.now() - startedMs };
    if (resultFailed(result)) {
      if (options.blocking) state.status = 'blocked';
      else state.status = 'completed-with-failures';
      recordStep(state, name, 'failed', JSON.stringify(result), timing);
      return { ok: false, result };
    }
    recordStep(state, name, 'passed', '', timing);
    return { ok: true, result };
  } catch (error) {
    if (options.blocking) state.status = 'blocked';
    else state.status = 'completed-with-failures';
    recordStep(state, name, 'failed', error.message, { startedAt, endedAt: new Date().toISOString(), durationMs: Date.now() - startedMs });
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
  const templateSourcePath = arg(args, 'template-source-path', defaults.paths.template_source_path || '');
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

  if (!promptFile) fail('Missing --prompt');
  if (!fs.existsSync(path.join(root, promptFile))) fail(`Prompt file not found: ${promptFile}`);
  const templateDir = templateSourcePath
    ? path.isAbsolute(templateSourcePath)
      ? templateSourcePath
      : path.join(root, templateSourcePath)
    : path.join(root, defaults.paths.templates, templateName);
  if (!fs.existsSync(templateDir)) fail(`Template not found: ${path.relative(root, templateDir).replace(/\\/g, '/')}`);
  const batches = resolveOllamaBatchesForDirectory(templateDir);
  validateStagePlan(batches);
  const plan = modePlan(mode, batches);
  const usesOllama = plan.some((stage) => stage.startsWith('ollama-'));
  if (usesOllama) validateOllamaModel(ollamaModel);
  const codexCombination = plan.some((stage) => stage.startsWith('codex'))
    ? validateKnownCodexReasoningCombination(codexModel, codexReasoningInput)
    : null;
  const codexReasoning = codexCombination ? codexCombination.reasoning : codexReasoningInput;
  const themeSlug = explicitThemeSlug || themeSlugForPrompt(promptFile, defaults.paths, { createDirs: !dryRun });
  const reportDir = path.join(root, defaults.paths.run_reports, themeSlug);
  const foundExistingArtifacts = existingArtifacts(themeSlug, defaults.paths);
  const promptContract = parsePromptContract(path.join(root, promptFile));
  const promptCoverage = buildCoverage(promptContract, batches, expandStageRequirementIds(promptContract, { name: 'template-owned', promptSections: TEMPLATE_OWNED_PROMPT_SECTIONS }));

  if (dryRun) {
    console.log(JSON.stringify({
      theme_slug: themeSlug,
      report_dir: path.relative(root, reportDir).replace(/\\/g, '/'),
      theme_dir: `${defaults.paths.themes}/${themeSlug}`,
      requested: { mode, prompt: promptFile, template: templateName, template_source_path: templateSourcePath, ollama_model: usesOllama ? ollamaModel : '', codex_model: codexCombination ? codexModel : '', codex_reasoning: codexCombination ? codexReasoning : '', timeouts },
      prompt_contract: {
        sections: promptContract.sections.map((section) => section.number),
        section_count: promptContract.sections.length,
        total_characters: promptContract.total_characters,
        estimated_tokens: promptContract.estimated_tokens
      },
      prompt_coverage: promptCoverage,
      stages: [
        { stage: 'prepare_theme', owner: 'script' },
        ...plan.map((stage) => ({ stage, owner: stage.startsWith('ollama') ? 'ollama' : 'codex' })),
        { stage: 'build_theme_assets', owner: 'script' },
        { stage: 'validate_theme_source', owner: 'script' },
        { stage: 'generate_preview', owner: 'script' },
        { stage: 'rebuild_preview_gallery', owner: 'script' },
        { stage: 'package_theme', owner: 'script' },
        { stage: 'validate_theme_artifacts', owner: 'script' },
        { stage: 'write_run_summary', owner: 'script' }
      ],
      expected_invocations: expectedInvocations(mode, batches),
      replacement: { requested: replaceExistingTheme, existing_artifacts: foundExistingArtifacts }
    }, null, 2));
    return 0;
  }

  if (explicitThemeSlug && foundExistingArtifacts.length > 0 && !replaceExistingTheme) {
    fail(`Theme slug already has artifacts. Use a new unique slug or the explicit cleanup command first: ${foundExistingArtifacts.join(', ')}`);
  }
  if (replaceExistingTheme) fail('--replace-existing-theme is disabled for generation runs. Use npm run theme:delete for exact-slug cleanup.');

  const state = {
    mode,
    status: 'preflight',
    theme_slug: themeSlug,
    template_name: templateName,
    template_source_path: templateSourcePath,
    prompt_file: promptFile,
    report_dir: reportDir,
    live_model_check: liveModelCheck,
    requested: { ollama_model: ollamaModel, codex_model: codexModel, codex_reasoning: codexReasoningInput },
    resolved: { ollama_model: usesOllama ? ollamaModel : '', codex_model: codexCombination ? codexModel : '', codex_reasoning: codexCombination ? codexReasoning : '' },
    timeouts,
    started_at: new Date().toISOString(),
    ended_at: '',
    steps: []
  };
  writeWorkflowState(state);
  writeJson(path.join(reportDir, 'run.config.json'), state);
  writeJson(path.join(reportDir, 'prompt-coverage.json'), promptCoverage);

  await runSafe(state, 'model-check', () => {
    if (usesOllama) checkOllamaAccess({ model: ollamaModel, live: liveModelCheck, timeoutMs: timeouts.model_check_timeout_ms });
    if (codexCombination) checkCodexAccess({ model: codexModel, reasoning: codexReasoning, live: liveModelCheck, timeoutMs: timeouts.model_check_timeout_ms });
  }, { blocking: true, state: 'preflight' });
  if (state.status === 'blocked') {
    finishWorkflow(state);
    return 2;
  }

  await runSafe(state, 'prepare-theme', () => prepareTheme({ promptFile, templateName, themeSlug, templateSourcePath }), { blocking: true, state: 'prepared' });
  if (state.status === 'blocked') {
    finishWorkflow(state);
    return 2;
  }

  state.status = 'generating';
  if (mode === 'ollama-only') {
    await runSafe(state, 'ollama-generation', () => runOllamaGeneration({ mode, themeSlug, promptFile, model: ollamaModel, timeoutMs: timeouts.ollama_timeout_ms, reportDir }), { blocking: true });
  } else if (mode === 'codex-only') {
    await runSafe(state, 'codex-generation', () => runCodexGeneration({ mode, themeSlug, promptFile, templateName, model: codexModel, reasoning: codexReasoning, timeoutMs: timeouts.codex_timeout_ms, reportDir }), { blocking: true });
  } else if (mode === 'hybrid') {
    await runSafe(state, 'ollama-generation', () => runOllamaGeneration({ mode, themeSlug, promptFile, model: ollamaModel, timeoutMs: timeouts.ollama_timeout_ms, reportDir }), { blocking: true });
    if (state.status !== 'blocked') {
      await runSafe(state, 'codex-finish', () => runCodexFinish({ mode, themeSlug, promptFile, templateName, model: codexModel, reasoning: codexReasoning, timeoutMs: timeouts.codex_timeout_ms, reportDir }), { blocking: true });
    }
  }
  if (state.status === 'blocked') {
    finishWorkflow(state);
    return 2;
  }

  writeJson(path.join(reportDir, 'generated-theme-hashes.json'), { created_at: new Date().toISOString(), files: themeHashes(themeSlug) });
  writeJson(path.join(reportDir, 'generated-theme-manifest.json'), { theme_slug: themeSlug, files: themeHashes(themeSlug).map((entry) => entry.path) });

  state.status = 'building';
  await runSafe(state, 'build-theme', () => buildTheme({ themeSlug, timeoutMs: timeouts.command_timeout_ms, reportPath: path.join(reportDir, 'build.report.json') }), { blocking: true });
  if (state.status === 'blocked') {
    finishWorkflow(state);
    return 2;
  }
  state.status = 'finalizing';
  await runSafe(state, 'validate-theme-source', () => validateTheme({ themeSlug, template: templateName, phase: 'source', output: path.join(reportDir, 'validation.source.json') }), { blocking: true });
  if (state.status === 'blocked') {
    finishWorkflow(state);
    return 2;
  }
  await runSafe(state, 'preview-theme', () => previewTheme({ themeSlug, rebuildIndex: true }), { blocking: true });
  if (state.status === 'blocked') {
    finishWorkflow(state);
    return 2;
  }
  await runSafe(state, 'package-theme', () => packageTheme({ themeSlug }), { blocking: true });
  if (state.status === 'blocked') {
    finishWorkflow(state);
    return 2;
  }
  await runSafe(state, 'validate-theme-artifacts', () => validateTheme({ themeSlug, template: templateName, phase: 'artifacts', output: path.join(reportDir, 'validation.artifacts.json') }), { blocking: true });
  if (state.status === 'blocked') {
    finishWorkflow(state);
    return 2;
  }
  await runSafe(state, 'validate-theme-final', () => validateTheme({ themeSlug, template: templateName, phase: 'final', output: path.join(reportDir, 'validation.final.json') }), { blocking: true });
  if (state.status === 'blocked') {
    finishWorkflow(state);
    return 2;
  }
  state.status = state.steps.some((step) => step.status === 'failed') ? 'completed-with-failures' : 'completed';
  finishWorkflow(state);
  console.log(`Workflow ${state.status} for ${themeSlug}`);
  return state.status === 'completed' ? 0 : 1;
}

if (args.resume) {
  (async () => {
    const themeSlug = assertThemeSlug(arg(args, 'theme-slug', ''));
    const templateName = arg(args, 'template', '');
    const templateSourcePath = arg(args, 'template-source-path', defaults.paths.template_source_path || '');
    const reportDir = path.join(root, defaults.paths.run_reports, themeSlug);
    const commandTimeoutMs = positiveInteger(arg(args, 'command-timeout-ms', defaults.validation.command_timeout_ms || 120000), '--command-timeout-ms');
    const state = {
      mode: 'resume-finalization',
      status: 'finalizing',
      theme_slug: themeSlug,
      report_dir: reportDir,
      workflow_state_file: 'workflow.resume.state.json',
      ai_invocations: { ollama_provider_invocations: 0, codex_provider_invocations: 0 },
      requested: { ollama_model: '', codex_model: '', codex_reasoning: '' },
      resolved: { ollama_model: '', codex_model: '', codex_reasoning: '' },
      started_at: new Date().toISOString(),
      ended_at: '',
      steps: []
    };
    writeWorkflowState(state, 'workflow.resume.state.json');
    await runSafe(state, 'verify-frozen-source', () => verifyFrozenSource(themeSlug, reportDir), { blocking: true });
    if (state.status === 'blocked') process.exit(2);
    await runSafe(state, 'build-theme', () => buildTheme({ themeSlug, timeoutMs: commandTimeoutMs, reportPath: path.join(reportDir, 'build.resume.report.json') }));
    await runSafe(state, 'validate-theme-source', () => validateTheme({ themeSlug, template: templateName, phase: 'source', output: path.join(reportDir, 'validation.source.json') }));
    await runSafe(state, 'preview-theme', () => previewTheme({ themeSlug, rebuildIndex: true }));
    await runSafe(state, 'package-theme', () => packageTheme({ themeSlug }));
    await runSafe(state, 'validate-theme-artifacts', () => validateTheme({ themeSlug, template: templateName, phase: 'artifacts', output: path.join(reportDir, 'validation.artifacts.json') }));
    await runSafe(state, 'validate-theme-final', () => validateTheme({ themeSlug, template: templateName, phase: 'final', output: path.join(reportDir, 'validation.final.json') }));
    state.status = state.steps.some((step) => step.status === 'failed') ? 'completed-with-failures' : 'completed';
    state.ended_at = new Date().toISOString();
    writeJson(path.join(reportDir, 'workflow.resume.state.json'), state);
    writeTimingReports(state);
    console.log(`Resume ${state.status} for ${themeSlug}`);
    process.exit(state.status === 'completed' ? 0 : 1);
  })().catch((error) => fail(error.message));
} else if (require.main === module) {
  runWorkflow().then((code) => process.exit(code)).catch((error) => fail(error.message));
}

module.exports = { buildTimingSummary, formatDuration, modePlan, runWorkflow, timingMarkdown, verifyFrozenSource };
