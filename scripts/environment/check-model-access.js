#!/usr/bin/env node
const { parseArgs, arg, flag } = require('../shared/args');
const { fail } = require('../shared/theme-utils');
const { hasCommand, runCommand, resolveCommand } = require('../shared/command-runner');
const { validateCodexModel, validateCodexReasoning, validateOllamaModel } = require('../shared/model-config');

function codexArgs(model, reasoning) {
  const args = ['exec'];
  if (model) args.push('-m', model);
  if (reasoning) args.push('-c', `model_reasoning_effort=${reasoning}`);
  args.push('-');
  return args;
}

function checkOllama(model, timeoutMs) {
  if (!model) fail('Missing --ollama-model for Ollama model check.');
  try {
    validateOllamaModel(model);
  } catch (error) {
    fail(error.message);
  }
  if (!hasCommand('ollama')) fail('ollama command is unavailable.');
  const version = runCommand('ollama', ['--version'], { echo: false, timeoutMs });
  const list = runCommand('ollama', ['list'], { echo: false, timeoutMs });
  if (list.status !== 0) fail('ollama list failed.');
  const installed = list.stdout.split(/\r?\n/).slice(1).map((line) => line.trim().split(/\s+/)[0]).filter(Boolean);
  const matched = installed.includes(model);
  const report = {
    provider: 'ollama',
    requested_model: model,
    resolved_model: matched ? model : '',
    command: resolveCommand('ollama'),
    version: `${version.stdout}${version.stderr}`.trim().split(/\r?\n/)[0] || '',
    live_capability_check: matched,
    installed_models: installed
  };
  console.log(JSON.stringify(report, null, 2));
  if (!matched) process.exit(1);
  return report;
}

function checkCodex(model, reasoning, timeoutMs, live) {
  if (!model) fail('Missing --codex-model for Codex model check.');
  if (!reasoning) fail('Missing --codex-reasoning for Codex model check.');
  try {
    validateCodexModel(model);
    validateCodexReasoning(reasoning);
  } catch (error) {
    fail(error.message);
  }
  const command = process.platform === 'win32' ? 'codex.cmd' : 'codex';
  if (!hasCommand(command)) fail('codex command is unavailable.');
  const version = runCommand(command, ['--version'], { echo: false, timeoutMs });
  let liveResult = { status: null, stdout: '', stderr: '', args: [] };
  if (live) {
    liveResult = runCommand(command, codexArgs(model, reasoning), {
      echo: false,
      input: 'Reply with MODEL_CHECK_OK only.',
      timeoutMs
    });
  }
  const report = {
    provider: 'codex',
    requested_model: model,
    resolved_model: model,
    requested_reasoning: reasoning,
    resolved_reasoning: reasoning,
    command: resolveCommand(command),
    version: `${version.stdout}${version.stderr}`.trim().split(/\r?\n/)[0] || '',
    live_capability_check: live ? liveResult.status === 0 : null,
    live_check_status: liveResult.status,
    live_check_args: liveResult.args
  };
  console.log(JSON.stringify(report, null, 2));
  if (live && liveResult.status !== 0) process.exit(1);
  return report;
}

const args = parseArgs(process.argv.slice(2));
const provider = arg(args, 'provider');
const timeoutMs = Number(arg(args, 'model-check-timeout-ms', '120000'));
const live = !flag(args, 'dry-run') && !flag(args, 'skip-live');

if (provider === 'ollama') {
  checkOllama(arg(args, 'ollama-model'), timeoutMs);
} else if (provider === 'codex') {
  checkCodex(arg(args, 'codex-model'), arg(args, 'codex-reasoning'), timeoutMs, live);
} else {
  fail('Usage: node scripts/environment/check-model-access.js --provider <ollama|codex> [--ollama-model <model>] [--codex-model <model> --codex-reasoning <level>]');
}
