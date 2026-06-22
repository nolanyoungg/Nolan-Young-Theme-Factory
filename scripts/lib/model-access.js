const fs = require('fs');
const os = require('os');
const path = require('path');
const { root } = require('./repo-root');
const { COMMAND_FAILURE_CODES } = require('./constants');
const { hasCommand, resolveCommand, runCommand } = require('./command-runner');
const {
  validateKnownCodexReasoningCombination,
  validateOllamaModel
} = require('./model-config');

const liveProbeCache = new Map();

function firstLine(result) {
  return `${result.stdout || ''}${result.stderr || ''}`.trim().split(/\r?\n/)[0] || '';
}

function providerDebugDir(provider) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return path.join(root, 'reports', 'model-checks', `${stamp}-${provider}`);
}

function codexCommandName() {
  return process.platform === 'win32' ? 'codex.cmd' : 'codex';
}

function codexExecArgs(model, reasoning, extra = []) {
  return [
    'exec',
    '-m',
    model,
    '-c',
    `model_reasoning_effort="${reasoning}"`,
    ...extra,
    '-'
  ];
}

function assertCodexHelpSupports(helpText) {
  const required = [
    { label: 'non-interactive exec', pattern: /Run Codex non-interactively|Usage:\s+codex exec/i },
    { label: 'model option', pattern: /-m,\s+--model\s+<MODEL>|--model\s+<MODEL>/i },
    { label: 'config override option', pattern: /-c,\s+--config\s+<key=value>|--config\s+<key=value>/i },
    { label: 'read-only sandbox option', pattern: /--sandbox\s+<SANDBOX_MODE>|read-only/i },
    { label: 'working directory option', pattern: /--cd\s+<DIR>|-C,\s+--cd\s+<DIR>/i },
    { label: 'skip git repository check option', pattern: /--skip-git-repo-check/i },
    { label: 'ephemeral option', pattern: /--ephemeral/i }
  ];
  return required
    .filter((item) => !item.pattern.test(helpText))
    .map((item) => item.label);
}

function checkCodexAccess({ model, reasoning, timeoutMs = 300000, live = false, debugDir = '', mode = '', themeSlug = '', stage = 'codex-model-check' }) {
  let combination;
  try {
    combination = validateKnownCodexReasoningCombination(model, reasoning);
  } catch (error) {
    error.classification = /does not support/.test(error.message)
      ? COMMAND_FAILURE_CODES.INVALID_MODEL_REASONING_COMBINATION
      : /reasoning/i.test(error.message)
        ? COMMAND_FAILURE_CODES.REASONING_LEVEL_UNSUPPORTED
        : COMMAND_FAILURE_CODES.MODEL_NOT_FOUND;
    throw error;
  }
  const command = codexCommandName();
  if (!hasCommand(command)) {
    const error = new Error('codex command is unavailable.');
    error.classification = COMMAND_FAILURE_CODES.COMMAND_NOT_FOUND;
    throw error;
  }

  const version = runCommand(command, ['--version'], { echo: false, timeoutMs });
  if (version.status !== 0) {
    const error = new Error(`codex --version failed: ${version.stderr || version.error || version.stdout}`);
    error.classification = version.classification || COMMAND_FAILURE_CODES.CLI_VERSION_UNSUPPORTED;
    throw error;
  }

  const help = runCommand(command, ['exec', '--help'], { echo: false, timeoutMs });
  if (help.status !== 0) {
    const error = new Error(`codex exec --help failed: ${help.stderr || help.error || help.stdout}`);
    error.classification = help.classification || COMMAND_FAILURE_CODES.CLI_VERSION_UNSUPPORTED;
    throw error;
  }

  const missingHelp = assertCodexHelpSupports(`${help.stdout}\n${help.stderr}`);
  if (missingHelp.length > 0) {
    const error = new Error(`Installed Codex CLI is missing required option support: ${missingHelp.join(', ')}`);
    error.classification = COMMAND_FAILURE_CODES.CLI_VERSION_UNSUPPORTED;
    throw error;
  }

  let liveResult = null;
  const cacheKey = `codex:${combination.model}:${combination.reasoning}`;
  if (live && liveProbeCache.has(cacheKey)) {
    liveResult = liveProbeCache.get(cacheKey);
  } else if (live) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-factory-codex-check-'));
    try {
      liveResult = runCommand(command, codexExecArgs(combination.model, combination.reasoning, [
        '--sandbox',
        'read-only',
        '--skip-git-repo-check',
        '--cd',
        tempDir,
        '--ephemeral',
        '--ignore-rules'
      ]), {
        cwd: tempDir,
        debugDir: debugDir || providerDebugDir('codex'),
        echo: false,
        echoSummary: true,
        expectedOutput: 'MODEL_ACCESS_OK',
        input: 'Reply exactly MODEL_ACCESS_OK. Do not inspect, create, modify, or delete files.',
        mode,
        model: combination.model,
        provider: 'Codex',
        reasoning: combination.reasoning,
        stage,
        themeSlug,
        timeoutMs
      });
      liveProbeCache.set(cacheKey, liveResult);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  const report = {
    provider: 'codex',
    executable: resolveCommand(command),
    version: firstLine(version),
    requested_model: model,
    resolved_model: combination.model,
    requested_reasoning: reasoning,
    resolved_reasoning: combination.reasoning,
    known_capability_map_entry: combination.known,
    cli_option_check: 'passed',
    live_capability_check: live ? liveResult.status === 0 : null,
    live_check_status: live ? liveResult.status : null,
    live_check_classification: live ? liveResult.classification : null,
    live_check_args: codexExecArgs(combination.model, combination.reasoning),
    debug_report: live ? liveResult.debugReport || '' : ''
  };

  if (live && liveResult.status !== 0) {
    const error = new Error(`Codex model access check failed for ${combination.model} with reasoning ${combination.reasoning}. ${liveResult.stderr || liveResult.stdout || liveResult.error}`);
    error.classification = liveResult.classification || COMMAND_FAILURE_CODES.UNKNOWN_PROVIDER_FAILURE;
    error.report = report;
    throw error;
  }

  return report;
}

function parseOllamaModels(output) {
  return String(output || '')
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function checkOllamaAccess({ model, timeoutMs = 300000, live = false, debugDir = '', mode = '', themeSlug = '', stage = 'ollama-model-check' }) {
  const requestedModel = validateOllamaModel(model);
  if (!hasCommand('ollama')) {
    const error = new Error('ollama command is unavailable.');
    error.classification = COMMAND_FAILURE_CODES.COMMAND_NOT_FOUND;
    throw error;
  }

  const version = runCommand('ollama', ['--version'], { echo: false, timeoutMs });
  if (version.status !== 0) {
    const error = new Error(`ollama --version failed: ${version.stderr || version.error || version.stdout}`);
    error.classification = version.classification || COMMAND_FAILURE_CODES.OLLAMA_SERVICE_UNAVAILABLE;
    throw error;
  }

  const list = runCommand('ollama', ['list'], { echo: false, timeoutMs });
  if (list.status !== 0) {
    const error = new Error(`ollama list failed: ${list.stderr || list.error || list.stdout}`);
    error.classification = list.classification || COMMAND_FAILURE_CODES.OLLAMA_SERVICE_UNAVAILABLE;
    throw error;
  }

  const installedModels = parseOllamaModels(list.stdout);
  const installed = installedModels.includes(requestedModel);
  if (!installed) {
    const error = new Error(`Ollama model is not installed: ${requestedModel}\n\nInstall it with:\nollama pull ${requestedModel}`);
    error.classification = COMMAND_FAILURE_CODES.MODEL_NOT_INSTALLED;
    error.report = {
      provider: 'ollama',
      executable: resolveCommand('ollama'),
      version: firstLine(version),
      requested_model: requestedModel,
      resolved_model: '',
      exact_model_installed: false,
      installed_models: installedModels
    };
    throw error;
  }

  const show = runCommand('ollama', ['show', requestedModel], { echo: false, timeoutMs });
  if (show.status !== 0) {
    const error = new Error(`ollama show failed for ${requestedModel}: ${show.stderr || show.error || show.stdout}`);
    error.classification = show.classification || COMMAND_FAILURE_CODES.MODEL_LOAD_FAILED;
    throw error;
  }

  let liveResult = null;
  const cacheKey = `ollama:${requestedModel}`;
  if (live && liveProbeCache.has(cacheKey)) {
    liveResult = liveProbeCache.get(cacheKey);
  } else if (live) {
    liveResult = runCommand('ollama', ['run', requestedModel], {
      debugDir: debugDir || providerDebugDir('ollama'),
      echo: false,
      echoSummary: true,
      env: { OLLAMA_NOHISTORY: '1' },
      expectedOutput: 'MODEL_ACCESS_OK',
      input: 'Reply exactly MODEL_ACCESS_OK.',
      mode,
      model: requestedModel,
      provider: 'Ollama',
      stage,
      themeSlug,
      timeoutMs
    });
    liveProbeCache.set(cacheKey, liveResult);
  }

  const report = {
    provider: 'ollama',
    executable: resolveCommand('ollama'),
    version: firstLine(version),
    requested_model: requestedModel,
    resolved_model: requestedModel,
    exact_model_installed: true,
    installed_models: installedModels,
    model_details_check: 'passed',
    model_details_preview: show.stdout.trim().split(/\r?\n/).slice(0, 20).join('\n'),
    live_capability_check: live ? liveResult.status === 0 : null,
    live_check_status: live ? liveResult.status : null,
    live_check_classification: live ? liveResult.classification : null,
    debug_report: live ? liveResult.debugReport || '' : ''
  };

  if (live && liveResult.status !== 0) {
    const error = new Error(`Ollama runtime capability check failed for ${requestedModel}. ${liveResult.stderr || liveResult.stdout || liveResult.error}`);
    error.classification = liveResult.classification || COMMAND_FAILURE_CODES.UNKNOWN_PROVIDER_FAILURE;
    error.report = report;
    throw error;
  }

  return report;
}

function checkProviderAccess(options) {
  if (options.provider === 'codex') return checkCodexAccess(options);
  if (options.provider === 'ollama') return checkOllamaAccess(options);
  if (options.provider === 'hybrid') {
    return {
      provider: 'hybrid',
      ollama: checkOllamaAccess({ ...options, model: options.ollamaModel || options.model }),
      codex: checkCodexAccess({ ...options, model: options.codexModel || options.model, reasoning: options.codexReasoning || options.reasoning })
    };
  }
  throw new Error(`Unsupported provider: ${options.provider}`);
}

module.exports = {
  checkCodexAccess,
  checkOllamaAccess,
  checkProviderAccess,
  codexCommandName,
  codexExecArgs,
  liveProbeCache,
  parseOllamaModels
};
