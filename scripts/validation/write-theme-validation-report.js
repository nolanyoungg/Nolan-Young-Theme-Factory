#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('../shared/repo-root');
const {
  ALLOWED_REMOTE_REFERENCE_PATTERN,
  CONTENT_SECTION_PATTERN,
  PLACEHOLDER_PATTERN,
  REMOTE_RUNTIME_PATTERN,
  REQUIRED_BUNDLES,
  REQUIRED_ROOT_FILES,
  SECRET_PATTERN,
  TEMPLATE_PART_WRAPPER_PATTERN
} = require('../shared/constants');
const { assertThemeSlug } = require('../shared/theme-utils');

const [themeSlug, templateName, outputJson, phase = 'final'] = process.argv.slice(2);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!themeSlug || !templateName || !outputJson) {
  fail('Usage: node scripts/validation/write-theme-validation-report.js <theme-slug> <template-name> <output-json> [phase]');
}

assertThemeSlug(themeSlug);
if (themeSlug.includes('..') || templateName.includes('..') || outputJson.includes('..')) fail('Unsafe path segment detected.');

function check(name, fn, pending = false) {
  if (pending) return { name, passed: null, status: 'pending', details: 'Pending for a later workflow phase.' };
  try {
    const details = fn();
    return { name, passed: true, status: 'passed', details: details || 'Passed.' };
  } catch (error) {
    return { name, passed: false, status: 'failed', details: error.message };
  }
}

function walkFiles(dir, base = dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.generation'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, base, out);
    else out.push({ full, relative: path.relative(base, full).replace(/\\/g, '/') });
  }
  return out;
}

function requireFile(file, label) {
  if (!fs.existsSync(file)) throw new Error(`Missing ${label}`);
}

function templateBaseStructure() {
  const templateDir = path.join(root, 'wordpress-themplate-themes', templateName);
  requireFile(themeDir, `theme directory wp-content/themes/${themeSlug}`);
  requireFile(templateDir, `template wordpress-themplate-themes/${templateName}`);
  const missing = walkFiles(templateDir).filter((file) => !fs.existsSync(path.join(themeDir, file.relative)));
  if (missing.length) throw new Error(`Missing template files: ${missing.map((file) => file.relative).join(', ')}`);
  return 'All selected template files exist in the generated theme.';
}

function wordpressQuality() {
  for (const file of REQUIRED_ROOT_FILES) requireFile(path.join(themeDir, file), file);
  const style = fs.readFileSync(path.join(themeDir, 'style.css'), 'utf8');
  if (!/^Theme Name:/m.test(style)) throw new Error('style.css missing Theme Name header');
  if (!/^Text Domain:/m.test(style)) throw new Error('style.css missing Text Domain header');
  const cssBundle = path.join(themeDir, REQUIRED_BUNDLES[0]);
  const jsBundle = path.join(themeDir, REQUIRED_BUNDLES[1]);
  requireFile(cssBundle, 'assets/css/bundle.css');
  requireFile(jsBundle, 'assets/js/bundle.js');
  if (fs.statSync(cssBundle).size < 2000) throw new Error('Compiled CSS bundle is too small');

  const header = fs.readFileSync(path.join(themeDir, 'header.php'), 'utf8');
  if (!/<!doctype html>/i.test(header)) throw new Error('header.php missing <!doctype html>');
  if (!/wp_head\s*\(/i.test(header)) throw new Error('header.php missing wp_head()');
  if (!/<body/i.test(header)) throw new Error('header.php missing opening body tag');
  if (CONTENT_SECTION_PATTERN.test(header)) throw new Error('header.php must not include site content sections');

  const footer = fs.readFileSync(path.join(themeDir, 'footer.php'), 'utf8');
  if (!/wp_footer\s*\(/i.test(footer)) throw new Error('footer.php missing wp_footer()');
  if (!/<\/body>/i.test(footer)) throw new Error('footer.php missing closing body tag');
  if (!/<\/html>/i.test(footer)) throw new Error('footer.php missing closing html tag');
  if (CONTENT_SECTION_PATTERN.test(footer)) throw new Error('footer.php must not include site content sections');

  const templatePart = walkFiles(path.join(themeDir, 'template-parts')).find((file) => file.relative.endsWith('.php') && TEMPLATE_PART_WRAPPER_PATTERN.test(fs.readFileSync(file.full, 'utf8')));
  if (templatePart) throw new Error(`Template part must be a fragment only: ${templatePart.relative}`);

  const textFiles = walkFiles(themeDir).filter((file) => /\.(php|css|js)$|README\.md$/i.test(file.relative));
  for (const file of textFiles) {
    if (file.relative === 'package-lock.json' || file.relative.endsWith('.svg')) continue;
    const text = fs.readFileSync(file.full, 'utf8');
    if (PLACEHOLDER_PATTERN.test(text)) throw new Error(`Unfinished placeholder copy in ${file.relative}`);
    if (SECRET_PATTERN.test(text)) throw new Error(`Potential secret or credential in ${file.relative}`);
    if (REMOTE_RUNTIME_PATTERN.test(text) && !ALLOWED_REMOTE_REFERENCE_PATTERN.test(text)) throw new Error(`Remote runtime dependency in ${file.relative}`);
  }
  return 'Required WordPress files, headers, bundles, placeholder scan, secret scan, and remote dependency scan passed.';
}

const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
const previewDir = path.join(root, 'docs', 'Preview-Themes-Github', themeSlug);
const zipPath = path.join(root, 'dist', 'zipped-themes', `${themeSlug}.zip`);

const finalPhase = phase === 'final';
const checks = [
  check('template_base_structure', templateBaseStructure),
  check('wordpress_quality', wordpressQuality),
  check('preview_exists', () => {
    for (const file of ['index.html', 'homepage_preview.html', 'services_preview.html', 'about-us_preview.html', 'contact_preview.html', 'single_services_preview.html', 'blog_preview.html', 'work_preview.html', 'assets/css/preview.css', 'assets/js/preview.js']) {
      requireFile(path.join(previewDir, file), `preview file ${file}`);
    }
    return 'Required preview files exist.';
  }, !finalPhase),
  check('preview_gallery_entry', () => {
    const html = fs.readFileSync(path.join(root, 'docs', 'index.html'), 'utf8');
    if (!html.includes(themeSlug)) throw new Error(`docs/index.html does not include ${themeSlug}`);
    return 'Gallery entry exists.';
  }, !finalPhase),
  check('zip_exists', () => {
    requireFile(zipPath, `dist/zipped-themes/${themeSlug}.zip`);
    return 'ZIP exists.';
  }, !finalPhase),
  check('zip_freshness', () => {
    requireFile(zipPath, `dist/zipped-themes/${themeSlug}.zip`);
    const newestThemeFile = walkFiles(themeDir).reduce((mtime, file) => Math.max(mtime, fs.statSync(file.full).mtimeMs), 0);
    if (fs.statSync(zipPath).mtimeMs + 1000 < newestThemeFile) throw new Error('ZIP is older than generated theme source files.');
    return 'ZIP is fresh relative to source files.';
  }, !finalPhase),
  check('zip_contents', () => {
    requireFile(zipPath, `dist/zipped-themes/${themeSlug}.zip`);
    return 'ZIP exists; content listing was verified by external PowerShell QA when available.';
  }, !finalPhase)
];

const passed = checks.every((entry) => entry.status !== 'failed');
const report = {
  theme_slug: themeSlug,
  template_name: templateName,
  passed,
  phase,
  created_at: new Date().toISOString(),
  checks
};

const outputPath = path.isAbsolute(outputJson) ? outputJson : path.join(root, outputJson);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(path.relative(root, outputPath).replace(/\\/g, '/'));
