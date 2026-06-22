#!/usr/bin/env node
const { parseArgs, arg, flag } = require('./lib/args');
const { fail } = require('./lib/theme-utils');
const { checkCodexAccess, checkOllamaAccess } = require('./lib/model-access');

function positiveInteger(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) fail(`Invalid ${label}: ${value}`);
  return number;
}

function printJson(report) {
  console.log(JSON.stringify(report, null, 2));
}

function runCheck(fn, options) {
  try {
    return fn(options);
  } catch (error) {
    const report = error.report || {};
    printJson({
      ...report,
      passed: false,
      classification: error.classification || 'UNKNOWN_PROVIDER_FAILURE',
      error: error.message
    });
    process.exit(1);
  }
}

const args = parseArgs(process.argv.slice(2));
const provider = arg(args, 'provider');
const timeoutMs = positiveInteger(arg(args, 'model-check-timeout-ms', '300000'), '--model-check-timeout-ms');
const live = flag(args, 'live-model-check');

if (provider === 'ollama') {
  printJson({
    passed: true,
    ...runCheck(checkOllamaAccess, {
      live,
      model: arg(args, 'ollama-model'),
      timeoutMs
    })
  });
} else if (provider === 'codex') {
  printJson({
    passed: true,
    ...runCheck(checkCodexAccess, {
      live,
      model: arg(args, 'codex-model'),
      reasoning: arg(args, 'codex-reasoning'),
      timeoutMs
    })
  });
} else if (provider === 'hybrid') {
  const ollama = runCheck(checkOllamaAccess, {
    live,
    model: arg(args, 'ollama-model'),
    timeoutMs
  });
  const codex = runCheck(checkCodexAccess, {
    live,
    model: arg(args, 'codex-model'),
    reasoning: arg(args, 'codex-reasoning'),
    timeoutMs
  });
  printJson({
    passed: true,
    provider: 'hybrid',
    ollama,
    codex
  });
} else {
  fail('Usage: node scripts/check-model.js --provider <ollama|codex|hybrid> [--ollama-model <model>] [--codex-model <model> --codex-reasoning <level>]');
}
