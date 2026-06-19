#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('../shared/repo-root');
const { parseArgs, arg } = require('../shared/args');
const {
  assertTemplateName,
  assertThemeSlug,
  nextThemeNumber,
  slugifyPromptPath
} = require('../shared/theme-utils');

const args = parseArgs(process.argv.slice(2));
const [positionalPrompt, positionalTemplate] = args._;
const promptFile = arg(args, 'prompt', positionalPrompt || process.env.THEME_PROMPT_FILE || '');
const templateName = arg(args, 'template', positionalTemplate || process.env.THEME_TEMPLATE || 'NOLAN-YOUNG-theme-000');
const requestedThemeSlug = arg(args, 'theme-slug', process.env.THEME_SLUG || '');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function updateJson(file, updater) {
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  updater(data);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

if (!promptFile) fail('Usage: node scripts/template-theme-copy/prepare-theme-from-template.js --prompt <prompt-file> [--template <template-name>] [--theme-slug <theme-slug>]');
if (promptFile.includes('..') || templateName.includes('..')) fail('Unsafe path segment detected.');
assertTemplateName(templateName);

const promptPath = path.isAbsolute(promptFile) ? promptFile : path.join(root, promptFile);
if (!fs.existsSync(promptPath)) fail(`Prompt file not found: ${promptFile}`);

const templateDir = path.join(root, 'wordpress-themplate-themes', templateName);
if (!fs.existsSync(templateDir)) fail(`Template not found: wordpress-themplate-themes/${templateName}`);

const themeSlug = requestedThemeSlug || `${nextThemeNumber()}_nolan_young_theme_${slugifyPromptPath(promptPath)}`;
assertThemeSlug(themeSlug);

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
