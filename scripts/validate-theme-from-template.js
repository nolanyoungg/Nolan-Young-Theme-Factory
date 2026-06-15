#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const [themeSlug, requestedTemplate] = process.argv.slice(2);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function walkFiles(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, base, out);
    else if (entry.isFile()) out.push(path.relative(base, full).replace(/\\/g, '/'));
  }
  return out;
}

if (!themeSlug) fail('Usage: node scripts/validate-theme-from-template.js <theme-slug> [template-name]');
if (!/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(themeSlug)) fail(`Invalid theme slug: ${themeSlug}`);
if ((requestedTemplate || '').includes('..')) fail('Unsafe template name.');

const themesRoot = path.resolve(root, 'wp-content', 'themes');
const themeDir = path.resolve(themesRoot, themeSlug);
if (!themeDir.startsWith(`${themesRoot}${path.sep}`)) fail(`Generated theme is outside wp-content/themes: ${themeDir}`);
if (!fs.existsSync(themeDir)) fail(`Generated theme folder not found: wp-content/themes/${themeSlug}`);

let templateName = requestedTemplate;
const sourceFile = path.join(themeDir, '.theme-template-source');
if (!templateName && fs.existsSync(sourceFile)) {
  const match = fs.readFileSync(sourceFile, 'utf8').match(/^template=(.+)$/m);
  if (match) templateName = match[1].trim();
}
templateName ||= 'NOLAN-YOUNG-theme-000';

const templateDir = path.resolve(root, 'wordpress-themplate-themes', templateName);
if (!templateDir.startsWith(path.resolve(root, 'wordpress-themplate-themes') + path.sep)) fail('Template path resolves outside templates.');
if (!fs.existsSync(templateDir)) fail(`Template not found: wordpress-themplate-themes/${templateName}`);

const missing = walkFiles(templateDir).filter((relative) => !fs.existsSync(path.join(themeDir, relative)));
if (missing.length > 0) {
  for (const file of missing) console.error(`Missing template file: ${file}`);
  fail(`${missing.length} template file(s) missing from wp-content/themes/${themeSlug}`);
}

console.log('Template-aware validation passed.');
console.log(`Theme: ${themeSlug}`);
console.log(`Template: ${templateName}`);
