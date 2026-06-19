#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('../shared/repo-root');
const { hasCommand, runCommand } = require('../shared/command-runner');

const checks = [
  { name: 'node', required: true, command: 'node', args: ['--version'] },
  { name: 'npm', required: true, command: 'npm', args: ['--version'] },
  { name: 'git', required: true, command: 'git', args: ['--version'] },
  { name: 'php', required: false, command: 'php', args: ['-v'] },
  { name: 'ollama', required: false, command: 'ollama', args: ['--version'] },
  { name: 'codex', required: false, command: process.platform === 'win32' ? 'codex.cmd' : 'codex', args: ['--version'] }
];

const results = checks.map((check) => {
  const available = hasCommand(check.command);
  const version = available ? runCommand(check.command, check.args, { echo: false, timeoutMs: 15000 }) : null;
  return {
    name: check.name,
    required: check.required,
    available,
    status: available && (!version || version.status === 0) ? 'ok' : check.required ? 'failed' : 'missing',
    version: version ? `${version.stdout}${version.stderr}`.trim().split(/\r?\n/)[0] || '' : ''
  };
});

const requiredFailed = results.filter((entry) => entry.required && entry.status !== 'ok');
const report = {
  repository_root: root,
  platform: process.platform,
  package_json: fs.existsSync(path.join(root, 'package.json')),
  results
};

console.log(JSON.stringify(report, null, 2));
if (requiredFailed.length > 0) process.exit(1);
