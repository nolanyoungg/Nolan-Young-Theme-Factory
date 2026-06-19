#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { root, scriptPath } = require('../shared/repo-root');
const { runCommand } = require('../shared/command-runner');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function mustRun(command, args, options = {}) {
  const result = runCommand(command, args, { echo: false, ...options });
  if (result.status !== 0) {
    process.stdout.write(result.stdout || '');
    process.stderr.write(result.stderr || result.error || '');
    fail(`${command} ${args.join(' ')} failed.`);
  }
  return result;
}

JSON.parse(fs.readFileSync(path.join(root, 'config', 'workflow-modes.json'), 'utf8'));
JSON.parse(fs.readFileSync(path.join(root, 'config', 'theme-factory.defaults.json'), 'utf8'));
JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const tempManifest = path.join(os.tmpdir(), `theme-factory-manifest-${Date.now()}.json`);
mustRun('node', [scriptPath('template-theme-copy', 'create-template-manifest.js'), 'NOLAN-YOUNG-theme-000', tempManifest]);
if (!fs.existsSync(tempManifest) || fs.statSync(tempManifest).size === 0) fail('Template manifest was not created.');
fs.rmSync(tempManifest, { force: true });

mustRun('node', [scriptPath('run-theme-workflow.js'), '--help']);
mustRun('node', [scriptPath('run-theme-workflow.js'), '--mode', 'hybrid', '--prompt', 'prompts/pending/000-testing.md', '--template', 'NOLAN-YOUNG-theme-000', '--dry-run']);
mustRun('node', [scriptPath('environment', 'check-environment.js')]);

console.log('Smoke test passed.');
