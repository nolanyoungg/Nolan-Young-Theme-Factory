#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const [promptFile, templateName = process.env.THEME_TEMPLATE || 'NOLAN-YOUNG-theme-000'] = process.argv.slice(2);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function slugify(input) {
  const base = path.basename(input).replace(/\.[^.]+$/, '');
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')
    .replace(/^[0-9]+_/, '')
    .replace(/^nolan_young_theme_/, '') || 'generated_theme';
}

function collectExisting(dir, files = false) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full, { withFileTypes: true })
    .filter((entry) => files ? entry.isFile() : entry.isDirectory())
    .map((entry) => entry.name);
}

function nextNumber() {
  for (const dir of ['wp-content/themes', 'docs/Preview-Themes-Github', 'dist/zipped-themes', 'reports/runs']) {
    fs.mkdirSync(path.join(root, dir), { recursive: true });
  }
  const names = [
    ...collectExisting('wp-content/themes'),
    ...collectExisting('docs/Preview-Themes-Github'),
    ...collectExisting('reports/runs'),
    ...collectExisting('dist/zipped-themes', true).map((name) => name.replace(/\.zip$/, ''))
  ];
  const max = names.reduce((highest, name) => {
    const match = name.match(/^([0-9]{3})_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, -1);
  return String(max + 1).padStart(3, '0');
}

function updateJson(file, updater) {
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  updater(data);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

if (!promptFile) fail('Usage: node scripts/prepare-theme-from-template.js <prompt-file> [template-name]');
if (promptFile.includes('..') || templateName.includes('..')) fail('Unsafe path segment detected.');

const promptPath = path.isAbsolute(promptFile) ? promptFile : path.join(root, promptFile);
if (!fs.existsSync(promptPath)) fail(`Prompt file not found: ${promptFile}`);

const templateDir = path.join(root, 'wordpress-themplate-themes', templateName);
if (!fs.existsSync(templateDir)) fail(`Template not found: wordpress-themplate-themes/${templateName}`);

const themeSlug = process.env.THEME_SLUG || `${nextNumber()}_nolan_young_theme_${slugify(promptPath)}`;
if (!/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(themeSlug)) fail(`Invalid theme slug: ${themeSlug}`);

const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
if (fs.existsSync(themeDir)) fail(`Theme already exists: wp-content/themes/${themeSlug}`);

fs.cpSync(templateDir, themeDir, { recursive: true });

const title = themeSlug.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const stylePath = path.join(themeDir, 'style.css');
if (fs.existsSync(stylePath)) {
  let style = fs.readFileSync(stylePath, 'utf8');
  style = style.replace(/^Theme Name:.*$/m, `Theme Name: ${title}`);
  style = style.replace(/^Description:.*$/m, `Description: Generated WordPress theme prepared from ${templateName}.`);
  style = style.replace(/^Text Domain:.*$/m, `Text Domain: ${themeSlug}`);
  fs.writeFileSync(stylePath, style);
}

const packageName = themeSlug.replace(/_/g, '-');
updateJson(path.join(themeDir, 'package.json'), (pkg) => { pkg.name = packageName; });
updateJson(path.join(themeDir, 'package-lock.json'), (lock) => {
  lock.name = packageName;
  if (lock.packages && lock.packages['']) lock.packages[''].name = packageName;
});

fs.writeFileSync(path.join(themeDir, '.theme-template-source'), `template=${templateName}\nprepared_slug=${themeSlug}\n`);

console.log(`Prepared theme folder: wp-content/themes/${themeSlug}`);
console.log(`Template source: wordpress-themplate-themes/${templateName}`);
console.log(`Theme generation must edit only: wp-content/themes/${themeSlug}`);
