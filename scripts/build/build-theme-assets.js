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

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.generation'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

function normalizeScssAtRules(themeDir) {
  const scssDir = path.join(themeDir, 'src', 'scss');
  let changed = 0;
  for (const file of walkFiles(scssDir).filter((item) => item.endsWith('.scss'))) {
    const original = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const lines = original.split('\n');
    const moduleRules = [];
    const body = [];
    for (const line of lines) {
      if (/^\s*@(use|forward)\b/.test(line)) moduleRules.push(line.trimEnd());
      else body.push(line);
    }
    if (moduleRules.length === 0) continue;
    let seenBodyRule = false;
    let needsNormalization = false;
    for (const line of lines) {
      if (/^\s*@(use|forward)\b/.test(line)) {
        if (seenBodyRule) needsNormalization = true;
        continue;
      }
      if (line.trim() && !/^\s*\/[/*]/.test(line)) seenBodyRule = true;
    }
    if (!needsNormalization) continue;
    const normalizedBody = body.join('\n').replace(/^\n+/, '');
    const normalized = `${moduleRules.join('\n')}\n${normalizedBody ? `\n${normalizedBody}` : ''}`.replace(/\n?$/, '\n');
    if (normalized !== original) {
      fs.writeFileSync(file, normalized, 'utf8');
      changed += 1;
    }
  }
  if (changed > 0) console.error(`Normalized Sass module at-rule order in ${changed} file(s).`);
}

if (!themeSlug) fail('Usage: node scripts/build/build-theme-assets.js --theme-slug <theme-slug>');
assertThemeSlug(themeSlug);
if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) fail(`Invalid --command-timeout-ms: ${timeoutMs}`);

const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
if (!fs.existsSync(themeDir)) fail(`Theme directory missing: wp-content/themes/${themeSlug}`);
if (!fs.existsSync(path.join(themeDir, 'package.json'))) fail('package.json missing; cannot build assets.');

normalizeScssAtRules(themeDir);

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
