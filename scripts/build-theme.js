#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('./lib/repo-root');
const { parseArgs, arg } = require('./lib/args');
const { runCommand } = require('./lib/command-runner');
const { REQUIRED_BUNDLES } = require('./lib/constants');
const { assertThemeSlug } = require('./lib/theme-utils');

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

function snapshotFiles(themeDir) {
  const files = new Map();
  for (const file of walkFiles(themeDir)) {
    const stat = fs.statSync(file);
    files.set(path.relative(themeDir, file).replace(/\\/g, '/'), `${stat.size}:${Math.round(stat.mtimeMs)}`);
  }
  return files;
}

function diffSnapshots(before, after) {
  const created = [];
  const modified = [];
  for (const [file, value] of after.entries()) {
    if (!before.has(file)) created.push(file);
    else if (before.get(file) !== value) modified.push(file);
  }
  return { created, modified };
}

async function buildTheme(options = {}) {
  const selectedSlug = assertThemeSlug(options.themeSlug || themeSlug);
  const selectedTimeoutMs = Number(options.timeoutMs || timeoutMs);
  if (!Number.isInteger(selectedTimeoutMs) || selectedTimeoutMs <= 0) fail(`Invalid --command-timeout-ms: ${selectedTimeoutMs}`);

  const themeDir = path.join(root, 'wp-content', 'themes', selectedSlug);
  if (!fs.existsSync(themeDir)) fail(`Theme directory missing: wp-content/themes/${selectedSlug}`);
  if (!fs.existsSync(path.join(themeDir, 'package.json'))) fail('package.json missing; cannot build assets.');

  const before = snapshotFiles(themeDir);
  const installArgs = fs.existsSync(path.join(themeDir, 'package-lock.json'))
    ? ['ci', '--ignore-scripts', '--no-audit', '--no-fund']
    : ['install', '--ignore-scripts', '--no-audit', '--no-fund'];
  const install = runCommand('npm', installArgs, { cwd: themeDir, timeoutMs: selectedTimeoutMs, echo: options.echo !== false });
  const build = install.status === 0
    ? runCommand('npm', ['run', 'build'], { cwd: themeDir, timeoutMs: selectedTimeoutMs, echo: options.echo !== false })
    : { status: install.status, stdout: '', stderr: 'Skipped build because dependency install failed.' };
  const after = snapshotFiles(themeDir);
  const changes = diffSnapshots(before, after);

  for (const bundle of REQUIRED_BUNDLES) {
    const bundlePath = path.join(themeDir, bundle);
    if (build.status === 0 && !fs.existsSync(bundlePath)) fail(`Build did not create ${bundle}`);
  }

  const report = {
    theme_slug: selectedSlug,
    install_command: `npm ${installArgs.join(' ')}`,
    install_exit_code: install.status,
    build_command: 'npm run build',
    build_exit_code: build.status,
    created_files: changes.created,
    modified_files: changes.modified,
    output: `${install.stdout || ''}${install.stderr || ''}${build.stdout || ''}${build.stderr || ''}`
  };
  if (options.reportPath) {
    fs.mkdirSync(path.dirname(options.reportPath), { recursive: true });
    fs.writeFileSync(options.reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }
  if (install.status !== 0) return { passed: false, status: install.status, report };
  if (build.status !== 0) return { passed: false, status: build.status, report };
  console.log(`Built assets for ${selectedSlug}`);
  return { passed: true, status: 0, report };
}

if (require.main === module) {
if (!themeSlug) fail('Usage: node scripts/build-theme.js --theme-slug <theme-slug>');
assertThemeSlug(themeSlug);
if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) fail(`Invalid --command-timeout-ms: ${timeoutMs}`);
buildTheme({ themeSlug, timeoutMs }).then((result) => {
  process.exit(result.status);
}).catch((error) => {
  fail(error.message);
});
}

module.exports = { buildTheme };
