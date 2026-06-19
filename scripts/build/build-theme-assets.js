#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('../shared/repo-root');
const { parseArgs, arg } = require('../shared/args');
const { runCommand } = require('../shared/command-runner');

const args = parseArgs(process.argv.slice(2));
const [positionalThemeSlug] = args._;
const themeSlug = arg(args, 'theme-slug', positionalThemeSlug || '');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!themeSlug || !/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(themeSlug)) {
  fail('Usage: node scripts/build/build-theme-assets.js --theme-slug <theme-slug>');
}

const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
if (!fs.existsSync(themeDir)) fail(`Theme directory missing: wp-content/themes/${themeSlug}`);
if (!fs.existsSync(path.join(themeDir, 'package.json'))) fail('package.json missing; cannot build assets.');

if (!fs.existsSync(path.join(themeDir, 'node_modules'))) {
  const install = runCommand('npm', ['install'], { cwd: themeDir });
  if (install.status !== 0) process.exit(install.status);
}
const build = runCommand('npm', ['run', 'build'], { cwd: themeDir });
if (build.status !== 0) process.exit(build.status);

const now = new Date();
for (const bundle of ['assets/css/bundle.css', 'assets/js/bundle.js']) {
  const bundlePath = path.join(themeDir, bundle);
  if (fs.existsSync(bundlePath)) fs.utimesSync(bundlePath, now, now);
}

console.log(`Built assets for ${themeSlug}`);
