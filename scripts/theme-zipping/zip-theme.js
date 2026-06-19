#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { root } = require('../shared/repo-root');
const { parseArgs, arg } = require('../shared/args');

const args = parseArgs(process.argv.slice(2));
const [positionalThemeSlug] = args._;
const themeSlug = arg(args, 'theme-slug', positionalThemeSlug || '');

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

if (!themeSlug || !/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(themeSlug)) fail('Usage: node scripts/theme-zipping/zip-theme.js --theme-slug <theme-slug>');

const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
if (!fs.existsSync(themeDir)) fail(`Theme directory missing: wp-content/themes/${themeSlug}`);

const zipDir = path.join(root, 'dist', 'zipped-themes');
const zipPath = path.join(zipDir, `${themeSlug}.zip`);
fs.mkdirSync(zipDir, { recursive: true });
fs.rmSync(zipPath, { force: true });

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-package-'));
const tempTheme = path.join(tempRoot, themeSlug);
fs.cpSync(themeDir, tempTheme, { recursive: true });
removeExcluded(tempTheme);

async function createZip() {
  const { ZipArchive } = await import('archiver');
  const output = fs.createWriteStream(zipPath);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  await new Promise((resolve, reject) => {
    output.on('close', resolve);
    output.on('error', reject);
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(tempTheme, themeSlug);
    const finalized = archive.finalize();
    if (finalized && typeof finalized.catch === 'function') finalized.catch(reject);
  });
}

createZip().then(() => {
  fs.rmSync(tempRoot, { recursive: true, force: true });
  if (!fs.existsSync(zipPath)) fail(`ZIP was not created: dist/zipped-themes/${themeSlug}.zip`);
  console.log(`Created dist/zipped-themes/${themeSlug}.zip`);
}).catch((error) => {
  fs.rmSync(tempRoot, { recursive: true, force: true });
  fs.rmSync(zipPath, { force: true });
  fail(error.message);
});
