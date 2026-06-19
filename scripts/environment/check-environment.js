#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('../shared/repo-root');
const { parseArgs, arg } = require('../shared/args');
const { hasCommand, resolveCommand, runCommand } = require('../shared/command-runner');
const { parseOllamaModels } = require('../shared/model-access');

const args = parseArgs(process.argv.slice(2));
const mode = arg(args, 'mode', 'all');

function requiredFor(checkName) {
  if (['node', 'npm', 'git'].includes(checkName)) return true;
  if (checkName === 'php') return ['all', 'preview', 'build', 'ollama-only', 'codex-only', 'hybrid'].includes(mode);
  if (checkName === 'ollama') return ['all', 'ollama-only', 'hybrid'].includes(mode);
  if (checkName === 'codex') return ['all', 'codex-only', 'hybrid'].includes(mode);
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

const codexCommand = process.platform === 'win32' ? 'codex.cmd' : 'codex';
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
  results
};

console.log(JSON.stringify(report, null, 2));
if (results.some((entry) => entry.required && entry.status !== 'ok')) process.exit(1);
