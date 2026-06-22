#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('../shared/repo-root');
const { parseArgs, arg, flag } = require('../shared/args');
const { hasCommand, resolveCommand, runCommand } = require('../shared/command-runner');
const {
  checkCodexAccess,
  checkOllamaAccess,
  codexCommandName,
  parseOllamaModels
} = require('../shared/model-access');

const defaults = JSON.parse(fs.readFileSync(path.join(root, 'config', 'theme-factory.defaults.json'), 'utf8'));

const args = parseArgs(process.argv.slice(2));
const mode = arg(args, 'mode', 'all');
const runModelCheck = flag(args, 'model-check');
const liveModelCheck = flag(args, 'live-model-check');
const modelCheckTimeoutMs = Number(arg(args, 'model-check-timeout-ms', defaults.validation?.model_check_timeout_ms || 120000));

function providerNeeded(provider) {
  if (provider === 'ollama') return ['all', 'ollama-only', 'hybrid'].includes(mode);
  if (provider === 'codex') return ['all', 'codex-only', 'hybrid'].includes(mode);
  return false;
}

function requiredFor(checkName) {
  if (['node', 'npm', 'git'].includes(checkName)) return true;
  if (checkName === 'php') return ['all', 'preview', 'build', 'ollama-only', 'codex-only', 'hybrid'].includes(mode);
  if (checkName === 'ollama') return providerNeeded('ollama');
  if (checkName === 'codex') return providerNeeded('codex');
  return false;
}

function commandCheck(name, command, versionArgs) {
  const available = hasCommand(command);
  const version = available ? runCommand(command, versionArgs, { echo: false, timeoutMs: 15000 }) : null;
  return {
    name,
    required: requiredFor(name),
    available,
    executable: available ? resolveCommand(command) : '',
    status: available && (!version || version.status === 0) ? 'ok' : requiredFor(name) ? 'failed' : 'missing',
    version: version ? `${version.stdout}${version.stderr}`.trim().split(/\r?\n/)[0] || '' : ''
  };
}

const codexCommand = codexCommandName();
const results = [
  commandCheck('node', 'node', ['--version']),
  commandCheck('npm', 'npm', ['--version']),
  commandCheck('git', 'git', ['--version']),
  commandCheck('php', 'php', ['-v']),
  commandCheck('ollama', 'ollama', ['--version']),
  commandCheck('codex', codexCommand, ['--version'])
];

let installedOllamaModels = [];
if (results.find((entry) => entry.name === 'ollama')?.available) {
  const list = runCommand('ollama', ['list'], { echo: false, timeoutMs: 15000 });
  if (list.status === 0) installedOllamaModels = parseOllamaModels(list.stdout);
}

function optionalProviderCheck(provider, checkFn, options) {
  if (!runModelCheck || !providerNeeded(provider)) return null;
  try {
    return {
      passed: true,
      ...checkFn({
        live: liveModelCheck,
        timeoutMs: modelCheckTimeoutMs,
        ...options
      })
    };
  } catch (error) {
    return {
      passed: false,
      classification: error.classification || 'UNKNOWN_PROVIDER_FAILURE',
      error: error.message,
      ...(error.report || {})
    };
  }
}

const providerChecks = {
  ollama: optionalProviderCheck('ollama', checkOllamaAccess, {
    model: arg(args, 'ollama-model', defaults.ollama?.model || '')
  }),
  codex: optionalProviderCheck('codex', checkCodexAccess, {
    model: arg(args, 'codex-model', defaults.codex?.model || ''),
    reasoning: arg(args, 'codex-reasoning', defaults.codex?.reasoning || '')
  })
};

const report = {
  repository_root: root,
  platform: process.platform,
  node_version: process.version,
  mode,
  package_json: fs.existsSync(path.join(root, 'package.json')),
  configured_paths: {
    templates: 'wordpress-themplate-themes',
    themes: 'wp-content/themes',
    previews: 'docs/Preview-Themes-Github',
    zips: 'dist/zipped-themes',
    reports: 'reports/runs'
  },
  installed_ollama_models: installedOllamaModels,
  provider_checks: providerChecks,
  results
};

console.log(JSON.stringify(report, null, 2));
if (
  results.some((entry) => entry.required && entry.status !== 'ok') ||
  Object.values(providerChecks).some((entry) => entry && entry.passed === false)
) process.exit(1);
