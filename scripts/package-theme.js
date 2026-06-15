#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const [themeSlug] = process.argv.slice(2);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function removeExcluded(dir) {
  for (const name of ['node_modules', '.git', '.generation', 'reports']) {
    fs.rmSync(path.join(dir, name), { recursive: true, force: true });
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) removeExcluded(full);
    else if (/\.log$|\.map$/i.test(entry.name)) fs.rmSync(full, { force: true });
  }
}

if (!themeSlug || !/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(themeSlug)) {
  fail('Usage: node scripts/package-theme.js <theme-slug>');
}

const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
if (!fs.existsSync(themeDir)) fail(`Theme directory missing: wp-content/themes/${themeSlug}`);

const zipDir = path.join(root, 'dist', 'zipped-themes');
const zipPath = path.join(zipDir, `${themeSlug}.zip`);
fs.mkdirSync(zipDir, { recursive: true });
fs.rmSync(zipPath, { force: true });

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-package-'));
try {
  const tempTheme = path.join(tempRoot, themeSlug);
  fs.cpSync(themeDir, tempTheme, { recursive: true });
  removeExcluded(tempTheme);

  const ps = spawnSync('powershell.exe', [
    '-NoProfile',
    '-ExecutionPolicy',
    'Bypass',
    '-Command',
    "$ErrorActionPreference='Stop'; Compress-Archive -LiteralPath $env:THEME_FACTORY_PACKAGE_SOURCE -DestinationPath $env:THEME_FACTORY_PACKAGE_ZIP -Force"
  ], {
    encoding: 'utf8',
    env: {
      ...process.env,
      THEME_FACTORY_PACKAGE_SOURCE: tempTheme,
      THEME_FACTORY_PACKAGE_ZIP: zipPath
    }
  });
  if (ps.stdout) process.stdout.write(ps.stdout);
  if (ps.stderr) process.stderr.write(ps.stderr);
  if (ps.status !== 0) process.exit(ps.status ?? 1);
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

if (!fs.existsSync(zipPath)) fail(`ZIP was not created: dist/zipped-themes/${themeSlug}.zip`);
console.log(`Created dist/zipped-themes/${themeSlug}.zip`);
