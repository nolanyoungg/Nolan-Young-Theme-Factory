#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const [themeSlug] = process.argv.slice(2);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', shell: process.platform === 'win32' });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) console.error(result.error.message);
  return result.status ?? 1;
}

if (!themeSlug || !/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(themeSlug)) {
  fail('Usage: node scripts/build-theme-assets.js <theme-slug>');
}

const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
if (!fs.existsSync(themeDir)) fail(`Theme directory missing: wp-content/themes/${themeSlug}`);
if (!fs.existsSync(path.join(themeDir, 'package.json'))) fail('package.json missing; cannot build assets.');

if (!fs.existsSync(path.join(themeDir, 'node_modules'))) {
  const installStatus = run('npm', ['install'], themeDir);
  if (installStatus !== 0) process.exit(installStatus);
}
const buildStatus = run('npm', ['run', 'build'], themeDir);
if (buildStatus !== 0) process.exit(buildStatus);

console.log(`Built assets for ${themeSlug}`);
