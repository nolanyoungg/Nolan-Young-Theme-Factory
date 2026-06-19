#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('../shared/repo-root');
const { parseArgs, arg } = require('../shared/args');
const { runCommand } = require('../shared/command-runner');
const { REQUIRED_BUNDLES } = require('../shared/constants');
const { assertThemeSlug } = require('../shared/theme-utils');

const args = parseArgs(process.argv.slice(2));
const [positionalThemeSlug] = args._;
const themeSlug = arg(args, 'theme-slug', positionalThemeSlug || '');
const timeoutMs = Number(arg(args, 'command-timeout-ms', '120000'));

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!themeSlug) fail('Usage: node scripts/build/build-theme-assets.js --theme-slug <theme-slug>');
assertThemeSlug(themeSlug);
if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) fail(`Invalid --command-timeout-ms: ${timeoutMs}`);

const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
if (!fs.existsSync(themeDir)) fail(`Theme directory missing: wp-content/themes/${themeSlug}`);
if (!fs.existsSync(path.join(themeDir, 'package.json'))) fail('package.json missing; cannot build assets.');

if (!fs.existsSync(path.join(themeDir, 'node_modules'))) {
  const install = runCommand('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: themeDir, timeoutMs });
  if (install.status !== 0) process.exit(install.status);
}
const build = runCommand('npm', ['run', 'build'], { cwd: themeDir, timeoutMs });
if (build.status !== 0) process.exit(build.status);

const scssEntry = path.join(themeDir, 'src', 'scss', 'main.scss');
if (fs.existsSync(scssEntry)) {
  const sass = runCommand('npx', ['sass', '--no-source-map', 'src/scss/main.scss', 'assets/css/bundle.css', '--style=compressed'], {
    cwd: themeDir,
    timeoutMs
  });
  if (sass.status !== 0) process.exit(sass.status);
}

const now = new Date();
for (const bundle of REQUIRED_BUNDLES) {
  const bundlePath = path.join(themeDir, bundle);
  if (!fs.existsSync(bundlePath)) fail(`Build did not create ${bundle}`);
  fs.utimesSync(bundlePath, now, now);
}

console.log(`Built assets for ${themeSlug}`);
