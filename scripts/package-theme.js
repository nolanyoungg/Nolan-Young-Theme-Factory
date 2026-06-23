#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const archiver = require('archiver');
const { root } = require('./lib/repo-root');
const { parseArgs, arg } = require('./lib/args');
const { ZIP_EXCLUDED_DIRECTORIES, ZIP_EXCLUDED_FILE_PATTERN } = require('./lib/constants');
const { assertThemeSlug } = require('./lib/theme-utils');

const args = parseArgs(process.argv.slice(2));
const [positionalThemeSlug] = args._;
const themeSlug = arg(args, 'theme-slug', positionalThemeSlug || '');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function removeExcluded(dir) {
  for (const name of ZIP_EXCLUDED_DIRECTORIES) {
    fs.rmSync(path.join(dir, name), { recursive: true, force: true });
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) removeExcluded(full);
    else if (ZIP_EXCLUDED_FILE_PATTERN.test(entry.name)) fs.rmSync(full, { force: true });
  }
}

async function packageTheme(options = {}) {
  const selectedSlug = assertThemeSlug(options.themeSlug || themeSlug);
  const themeDir = path.join(root, 'wp-content', 'themes', selectedSlug);
  if (!fs.existsSync(themeDir)) fail(`Theme directory missing: wp-content/themes/${selectedSlug}`);
  const zipDir = path.join(root, 'dist', 'zipped-themes');
  const zipPath = path.join(zipDir, `${selectedSlug}.zip`);
  fs.mkdirSync(zipDir, { recursive: true });
  fs.rmSync(zipPath, { force: true });

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-package-'));
  const tempTheme = path.join(tempRoot, selectedSlug);
  fs.cpSync(themeDir, tempTheme, { recursive: true });
  removeExcluded(tempTheme);

  async function writeZip() {
    const output = fs.createWriteStream(zipPath);
    const archive = new archiver.ZipArchive({ zlib: { level: 9 } });
    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      output.on('error', reject);
      archive.on('error', reject);
      archive.pipe(output);
      archive.directory(tempTheme, selectedSlug);
      const finalized = archive.finalize();
      if (finalized && typeof finalized.catch === 'function') finalized.catch(reject);
    });
  }

  try {
    await writeZip();
    if (!fs.existsSync(zipPath)) fail(`ZIP was not created: dist/zipped-themes/${selectedSlug}.zip`);
    console.log(`Created dist/zipped-themes/${selectedSlug}.zip`);
    return { passed: true, status: 0, zipPath };
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

if (require.main === module) {
  if (!themeSlug) fail('Usage: node scripts/package-theme.js --theme-slug <theme-slug>');
  packageTheme().catch((error) => {
    fs.rmSync(path.join(root, 'dist', 'zipped-themes', `${themeSlug}.zip`), { force: true });
    fail(error.message);
  });
}

module.exports = { packageTheme };
