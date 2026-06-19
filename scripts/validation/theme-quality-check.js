#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('../shared/repo-root');
const { parseArgs, arg } = require('../shared/args');
const { runCommand } = require('../shared/command-runner');
const {
  ALLOWED_REMOTE_REFERENCE_PATTERN,
  CONTENT_SECTION_PATTERN,
  PLACEHOLDER_PATTERN,
  REMOTE_RUNTIME_PATTERN,
  REPO_LOCAL_PATH_PATTERN,
  REQUIRED_BUNDLES,
  REQUIRED_ROOT_FILES,
  SECRET_PATTERN,
  TEMPLATE_PART_WRAPPER_PATTERN
} = require('../shared/constants');
const { assertThemeSlug } = require('../shared/theme-utils');

const args = parseArgs(process.argv.slice(2));
const [positionalThemeSlug] = args._;
const themeSlug = arg(args, 'theme-slug', positionalThemeSlug || '');
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

if (!themeSlug) {
  console.error('Usage: node scripts/validation/theme-quality-check.js --theme-slug <theme-slug>');
  process.exit(1);
}
assertThemeSlug(themeSlug);

const themesRoot = path.resolve(root, 'wp-content', 'themes');
const themeDir = path.resolve(themesRoot, themeSlug);
if (!themeDir.startsWith(`${themesRoot}${path.sep}`)) failCheck('Theme folder resolves outside wp-content/themes');
if (!fs.existsSync(themeDir)) failCheck(`Theme folder is missing: wp-content/themes/${themeSlug}`);

if (fs.existsSync(themeDir)) {
  for (const file of REQUIRED_ROOT_FILES) {
    if (!fs.existsSync(path.join(themeDir, file))) failCheck(`Missing required WordPress file: ${file}`);
  }

  const stylePath = path.join(themeDir, 'style.css');
  if (fs.existsSync(stylePath)) {
    const style = fs.readFileSync(stylePath, 'utf8');
    if (!/^Theme Name:/m.test(style)) failCheck('style.css missing Theme Name header');
    if (!/^Text Domain:/m.test(style)) failCheck('style.css missing Text Domain header');
  }

  const templatePartsDir = path.join(themeDir, 'template-parts');
  if (fs.existsSync(templatePartsDir)) {
    for (const file of walk(templatePartsDir).filter((item) => item.endsWith('.php'))) {
      const text = fs.readFileSync(file, 'utf8');
      if (TEMPLATE_PART_WRAPPER_PATTERN.test(text)) {
        failCheck(`Template part must be a fragment only: ${path.relative(themeDir, file).replace(/\\/g, '/')}`);
      }
    }
  }

  const headerPath = path.join(themeDir, 'header.php');
  if (fs.existsSync(headerPath)) {
    const header = fs.readFileSync(headerPath, 'utf8');
    if (!/<!doctype html>/i.test(header)) failCheck('header.php missing <!doctype html>');
    if (!/wp_head\s*\(/i.test(header)) failCheck('header.php missing wp_head()');
    if (!/<body/i.test(header)) failCheck('header.php missing opening body tag');
    if (CONTENT_SECTION_PATTERN.test(header)) failCheck('header.php must not include site content sections');
  }

  const footerPath = path.join(themeDir, 'footer.php');
  if (fs.existsSync(footerPath)) {
    const footer = fs.readFileSync(footerPath, 'utf8');
    if (!/wp_footer\s*\(/i.test(footer)) failCheck('footer.php missing wp_footer()');
    if (!/<\/body>/i.test(footer)) failCheck('footer.php missing closing body tag');
    if (!/<\/html>/i.test(footer)) failCheck('footer.php missing closing html tag');
    if (CONTENT_SECTION_PATTERN.test(footer)) failCheck('footer.php must not include site content sections');
  }

  const cssBundle = path.join(themeDir, REQUIRED_BUNDLES[0]);
  const jsBundle = path.join(themeDir, REQUIRED_BUNDLES[1]);
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

  const phpProbe = runCommand('php', ['-v'], { echo: false });
  if (phpProbe.status === 0) {
    for (const file of walk(themeDir).filter((item) => item.endsWith('.php'))) {
      const lint = runCommand('php', ['-l', file], { echo: false });
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
  for (const file of textFiles) {
    const relative = path.relative(themeDir, file).replace(/\\/g, '/');
    if (relative === 'package-lock.json' || relative.endsWith('.svg')) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (SECRET_PATTERN.test(text)) failCheck('Potential secret or credential found in theme');
    if (REMOTE_RUNTIME_PATTERN.test(text) && !ALLOWED_REMOTE_REFERENCE_PATTERN.test(text)) failCheck('Remote runtime dependency or CDN reference found');
    if (REPO_LOCAL_PATH_PATTERN.test(text)) failCheck('Theme contains repo-local, preview, dist, or machine-specific paths');
    if (/\.(php|css|js)$|README\.md$/i.test(relative) && PLACEHOLDER_PATTERN.test(text)) failCheck('Theme contains unfinished placeholder/runtime copy');
  }
}

if (failures.length > 0) {
  console.error(`Theme quality check failed for ${themeSlug} with ${failures.length} issue(s).`);
  process.exit(1);
}
console.log(`Theme quality check passed for ${themeSlug}.`);
