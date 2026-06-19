#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { root } = require('../lib/repo-root');

const [themeSlug] = process.argv.slice(2);
const failures = [];

function failCheck(message) {
  failures.push(message);
  console.error(`FAIL: ${message}`);
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.generation'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

if (!themeSlug || !/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(themeSlug)) {
  console.error('Usage: node scripts/validation/theme-quality-check.js <theme-slug>');
  process.exit(1);
}

const themesRoot = path.resolve(root, 'wp-content', 'themes');
const themeDir = path.resolve(themesRoot, themeSlug);
if (!themeDir.startsWith(`${themesRoot}${path.sep}`)) failCheck('Theme folder resolves outside wp-content/themes');
if (!fs.existsSync(themeDir)) failCheck(`Theme folder is missing: wp-content/themes/${themeSlug}`);

if (fs.existsSync(themeDir)) {
  for (const file of ['style.css', 'functions.php', 'index.php', 'header.php', 'footer.php']) {
    if (!fs.existsSync(path.join(themeDir, file))) failCheck(`Missing required WordPress file: ${file}`);
  }

  const stylePath = path.join(themeDir, 'style.css');
  if (fs.existsSync(stylePath)) {
    const style = fs.readFileSync(stylePath, 'utf8');
    if (!/^Theme Name:/m.test(style)) failCheck('style.css missing Theme Name header');
    if (!/^Text Domain:/m.test(style)) failCheck('style.css missing Text Domain header');
  }

  const cssBundle = path.join(themeDir, 'assets', 'css', 'bundle.css');
  const jsBundle = path.join(themeDir, 'assets', 'js', 'bundle.js');
  const scssEntry = path.join(themeDir, 'src', 'scss', 'main.scss');
  const jsEntry = path.join(themeDir, 'src', 'js', 'main.js');
  if (!fs.existsSync(cssBundle)) failCheck('Missing compiled CSS bundle: assets/css/bundle.css');
  if (!fs.existsSync(jsBundle)) failCheck('Missing compiled JS bundle: assets/js/bundle.js');
  if (fs.existsSync(cssBundle) && fs.statSync(cssBundle).size < 2000) failCheck('Compiled CSS bundle is too small to represent a finished styled theme');
  if (fs.existsSync(scssEntry) && fs.existsSync(cssBundle) && fs.statSync(scssEntry).mtimeMs > fs.statSync(cssBundle).mtimeMs) {
    failCheck('Compiled CSS bundle is older than src/scss/main.scss; run npm run build');
  }
  if (fs.existsSync(jsEntry) && fs.existsSync(jsBundle) && fs.statSync(jsEntry).mtimeMs > fs.statSync(jsBundle).mtimeMs) {
    failCheck('Compiled JS bundle is older than src/js/main.js; run npm run build');
  }

  const phpProbe = spawnSync('php', ['-v'], { encoding: 'utf8', stdio: 'ignore' });
  if (phpProbe.status === 0) {
    for (const file of walk(themeDir).filter((item) => item.endsWith('.php'))) {
      const lint = spawnSync('php', ['-l', file], { encoding: 'utf8' });
      if (lint.error) {
        console.error(`WARNING: php lint could not run from Node (${lint.error.message}); skipped PHP syntax lint.`);
        break;
      }
      if (lint.status !== 0) failCheck(`PHP syntax failed: ${path.relative(themeDir, file).replace(/\\/g, '/')}`);
    }
  } else {
    console.error('WARNING: php command not found; skipped PHP syntax lint.');
  }

  const textFiles = walk(themeDir).filter((file) => !/\.(png|jpe?g|webp|gif|zip)$/i.test(file));
  const secretPattern = /OPENAI_API_KEY|sk-[A-Za-z0-9_-]{20,}|BEGIN [A-Z ]*PRIVATE KEY|ghp_[A-Za-z0-9]{20,}|AWS_SECRET_ACCESS_KEY|password\s*[:=]\s*\S+|token\s*[:=]\s*\S+/i;
  const remotePattern = /<(script|link|img|source|video|audio)[^>]+(src|href)=["'][^"']*https?:\/\/|@import\s+url\(["']?https?:\/\/|url\(["']?https?:\/\/|\/\/cdn\.|cdnjs|jsdelivr|unpkg|fonts\.google|gstatic/i;
  const localPathPattern = /C:\\Users\\|\/Users\/|codex-ggi-nolan-local|docs\/Preview-Themes-Github|dist\/zipped-themes/i;
  const placeholderPattern = /Lorem ipsum|TODO|FIXME|Add [A-Za-z0-9 _/-]+ here|add [A-Za-z0-9 _/-]+ here|Generation should replace|Static preview generated from|prepared WordPress theme folder/i;
  for (const file of textFiles) {
    const relative = path.relative(themeDir, file).replace(/\\/g, '/');
    if (relative === 'package-lock.json' || relative.endsWith('.svg')) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (secretPattern.test(text)) failCheck('Potential secret or credential found in theme');
    if (remotePattern.test(text) && !/schemas\.wp\.org|www\.w3\.org|gmpg\.org\/xfn\/11/.test(text)) failCheck('Remote runtime dependency or CDN reference found');
    if (localPathPattern.test(text)) failCheck('Theme contains repo-local, preview, dist, or machine-specific paths');
    if (/\.(php|css|js)$|README\.md$/i.test(relative) && placeholderPattern.test(text)) failCheck('Theme contains unfinished placeholder/runtime copy');
  }
}

if (failures.length > 0) {
  console.error(`Theme quality check failed for ${themeSlug} with ${failures.length} issue(s).`);
  process.exit(1);
}
console.log(`Theme quality check passed for ${themeSlug}.`);
