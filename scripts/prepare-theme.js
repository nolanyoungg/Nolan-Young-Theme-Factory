#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { root } = require('./lib/repo-root');
const { parseArgs, arg } = require('./lib/args');
const { WALK_IGNORED_DIRECTORIES } = require('./lib/constants');
const {
  assertTemplateName,
  assertThemeSlug,
  nextThemeNumber,
  slugifyPromptPath,
  walkFiles
} = require('./lib/theme-utils');

const args = parseArgs(process.argv.slice(2));
const [positionalPrompt, positionalTemplate] = args._;
const promptFile = arg(args, 'prompt', positionalPrompt || process.env.THEME_PROMPT_FILE || '');
const templateName = arg(args, 'template', positionalTemplate || process.env.THEME_TEMPLATE || 'nolan-young-theme-template-01');
const requestedThemeSlug = arg(args, 'theme-slug', process.env.THEME_SLUG || '');

function fail(message) {
  throw new Error(message);
}

function updateJson(file, updater) {
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  updater(data);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function createTemplateManifest(templateDir, selectedTemplateName) {
  const files = walkFiles(templateDir)
    .map((file) => path.relative(templateDir, file).replace(/\\/g, '/'))
    .filter((file) => !/\.(log|tmp|swp|bak|map)$/i.test(file))
    .sort();
  return {
    manifest_version: 1,
    created_at: new Date().toISOString(),
    template_name: selectedTemplateName,
    normalized_template_root: `wordpress-themplate-themes/${selectedTemplateName}`,
    required_files: files
  };
}

function hashThemeFiles(themeDir) {
  return walkFiles(themeDir)
    .map((file) => {
      const relative = path.relative(themeDir, file).replace(/\\/g, '/');
      return {
        path: relative,
        sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}

function shouldNormalizeLineEndings(relativePath) {
  if (/^(?:node_modules|vendor|\.git)\//.test(relativePath)) return false;
  return /\.(php|css|scss|sass|js|mjs|cjs|ts|tsx|json|md|txt|yml|yaml|xml|svg|html|htm|config|dist)$/i.test(relativePath) ||
    /(^|\/)(webpack\.config\.js|package-lock\.json|package\.json|composer\.json|composer\.lock|\.editorconfig|\.gitignore)$/i.test(relativePath);
}

function normalizePreparedTextFiles(themeDir) {
  for (const file of walkFiles(themeDir)) {
    const relative = path.relative(themeDir, file).replace(/\\/g, '/');
    if (!shouldNormalizeLineEndings(relative)) continue;
    const buffer = fs.readFileSync(file);
    if (buffer.includes(0)) continue;
    const text = buffer.toString('utf8');
    const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    if (normalized !== text) fs.writeFileSync(file, normalized, 'utf8');
  }
}

function shouldCopyTemplateEntry(templateDir, source) {
  const relative = path.relative(templateDir, source).replace(/\\/g, '/');
  if (!relative) return true;
  const segments = relative.split('/');
  return !segments.some((segment) => WALK_IGNORED_DIRECTORIES.includes(segment));
}

function prepareTheme(options = {}) {
  const selectedPrompt = options.promptFile || promptFile;
  const selectedTemplate = assertTemplateName(options.templateName || templateName);
  const selectedSlug = options.themeSlug || requestedThemeSlug;
  const templateSourcePath = options.templateSourcePath || arg(args, 'template-source-path', process.env.THEME_TEMPLATE_SOURCE_PATH || '');
  if (!selectedPrompt) fail('Usage: node scripts/prepare-theme.js --prompt <prompt-file> [--template <template-name>] [--theme-slug <theme-slug>]');
  if (selectedPrompt.includes('..') || selectedTemplate.includes('..')) fail('Unsafe path segment detected.');

  const promptPath = path.isAbsolute(selectedPrompt) ? selectedPrompt : path.join(root, selectedPrompt);
  if (!fs.existsSync(promptPath)) fail(`Prompt file not found: ${selectedPrompt}`);
  const templateDir = templateSourcePath
    ? path.isAbsolute(templateSourcePath)
      ? templateSourcePath
      : path.join(root, templateSourcePath)
    : path.join(root, 'wordpress-themplate-themes', selectedTemplate);
  if (!fs.existsSync(templateDir)) fail(`Template not found: ${path.relative(root, templateDir).replace(/\\/g, '/')}`);
  if (!fs.statSync(templateDir).isDirectory()) fail(`Template source is not a directory: ${path.relative(root, templateDir).replace(/\\/g, '/')}`);

  const themeSlug = assertThemeSlug(selectedSlug || `${nextThemeNumber()}_nolan_young_theme_${slugifyPromptPath(promptPath)}`);
  const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
  if (fs.existsSync(themeDir)) fail(`Theme already exists: wp-content/themes/${themeSlug}`);

  fs.cpSync(templateDir, themeDir, {
    recursive: true,
    filter: (source) => shouldCopyTemplateEntry(templateDir, source)
  });
  normalizePreparedTextFiles(themeDir);

  const title = themeSlug.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  const stylePath = path.join(themeDir, 'style.css');
  if (fs.existsSync(stylePath)) {
    let style = fs.readFileSync(stylePath, 'utf8');
    style = style.replace(/^Theme Name:.*$/m, `Theme Name: ${title}`);
    style = style.replace(/^Description:.*$/m, `Description: Generated WordPress theme prepared from ${selectedTemplate}.`);
    style = style.replace(/^Text Domain:.*$/m, `Text Domain: ${themeSlug}`);
    fs.writeFileSync(stylePath, style);
  }

  const packageName = themeSlug.replace(/_/g, '-');
  updateJson(path.join(themeDir, 'package.json'), (pkg) => { pkg.name = packageName; });
  updateJson(path.join(themeDir, 'package-lock.json'), (lock) => {
    lock.name = packageName;
    if (lock.packages && lock.packages['']) lock.packages[''].name = packageName;
  });

  const manifest = createTemplateManifest(templateDir, selectedTemplate);
  fs.mkdirSync(path.join(themeDir, '.generation'), { recursive: true });
  fs.writeFileSync(path.join(themeDir, '.generation', 'template.manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  fs.writeFileSync(path.join(themeDir, '.generation', 'prepared-theme-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  fs.writeFileSync(path.join(themeDir, '.theme-template-source'), `template=${selectedTemplate}\nprepared_slug=${themeSlug}\n`);
  fs.writeFileSync(path.join(themeDir, '.generation', 'prepared-theme-hashes.json'), `${JSON.stringify({ created_at: new Date().toISOString(), excludes: ['.generation/prepared-theme-hashes.json'], files: hashThemeFiles(themeDir).filter((entry) => entry.path !== '.generation/prepared-theme-hashes.json') }, null, 2)}\n`);

  console.log(`Prepared theme folder: wp-content/themes/${themeSlug}`);
  console.log(`Template source: ${path.relative(root, templateDir).replace(/\\/g, '/')}`);
  console.log(`Theme generation must edit only: wp-content/themes/${themeSlug}`);
  return { themeSlug, themeDir, templateName: selectedTemplate };
}

if (require.main === module) {
  try {
    prepareTheme();
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { prepareTheme };
