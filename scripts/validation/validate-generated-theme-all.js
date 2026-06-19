#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yauzl = require('yauzl');
const { root, scriptPath } = require('../shared/repo-root');
const { parseArgs, arg } = require('../shared/args');
const { runCommand } = require('../shared/command-runner');
const { assertThemeSlug } = require('../shared/theme-utils');

const args = parseArgs(process.argv.slice(2));
const [positionalThemeSlug, positionalTemplate] = args._;
const themeSlug = assertThemeSlug(arg(args, 'theme-slug', positionalThemeSlug || ''));
const templateName = arg(args, 'template', positionalTemplate || process.env.THEME_TEMPLATE || 'NOLAN-YOUNG-theme-000');
let failures = 0;

function failCheck(message) {
  failures += 1;
  console.error(`FAIL: ${message}`);
}

function runCheck(command, commandArgs) {
  const result = runCommand(command, commandArgs, { cwd: root });
  if (result.status !== 0) failures += 1;
}

function filesInZip(zipPath) {
  return new Promise((resolve, reject) => {
    const entries = [];
    yauzl.open(zipPath, { lazyEntries: true }, (openError, zipfile) => {
      if (openError) {
        reject(openError);
        return;
      }
      zipfile.readEntry();
      zipfile.on('entry', (entry) => {
        entries.push(entry.fileName.replace(/\\/g, '/'));
        zipfile.readEntry();
      });
      zipfile.on('end', () => resolve(entries));
      zipfile.on('error', reject);
    });
  });
}

async function main() {
  runCheck('node', [scriptPath('validation', 'validate-theme-from-template.js'), '--theme-slug', themeSlug, '--template', templateName]);
  runCheck('node', [scriptPath('validation', 'theme-quality-check.js'), '--theme-slug', themeSlug]);

  const previewDir = path.join(root, 'docs', 'Preview-Themes-Github', themeSlug);
  const zipPath = path.join(root, 'dist', 'zipped-themes', `${themeSlug}.zip`);

  if (!fs.existsSync(previewDir)) failCheck(`Preview folder is missing: docs/Preview-Themes-Github/${themeSlug}`);

  if (fs.existsSync(previewDir)) {
    for (const page of ['index.html', 'homepage_preview.html', 'services_preview.html', 'about-us_preview.html', 'contact_preview.html', 'single_services_preview.html', 'blog_preview.html', 'work_preview.html']) {
      if (!fs.existsSync(path.join(previewDir, page))) failCheck(`Preview page is missing: docs/Preview-Themes-Github/${themeSlug}/${page}`);
    }
    for (const asset of ['assets/css/preview.css', 'assets/js/preview.js', 'assets/images/README.md']) {
      if (!fs.existsSync(path.join(previewDir, asset))) failCheck(`Preview asset is missing: docs/Preview-Themes-Github/${themeSlug}/${asset}`);
    }
    const htmlFiles = fs.readdirSync(previewDir).filter((file) => file.endsWith('.html'));
    const html = htmlFiles.map((file) => fs.readFileSync(path.join(previewDir, file), 'utf8')).join('\n');
    if (!/<header[\s>]/i.test(html)) failCheck('Preview pages are missing header markup');
    if (/Lorem ipsum|TODO|FIXME|Generation should replace|Static preview generated from|prepared WordPress theme folder/i.test(html)) failCheck('Preview contains unfinished placeholder/runtime copy');
    if (/<(script|link|img|source|video|audio)[^>]+(src|href)=["'][^"']*https?:\/\/|@import\s+url\(["']?https?:\/\/|url\(["']?https?:\/\/|\/\/cdn\.|cdnjs|jsdelivr|unpkg|fonts\.google|gstatic/i.test(html)) {
      failCheck('Preview contains a remote runtime dependency or CDN reference');
    }
  }

  if (!fs.existsSync(zipPath)) {
    failCheck(`Theme ZIP is missing: dist/zipped-themes/${themeSlug}.zip`);
  } else {
    try {
      const entries = await filesInZip(zipPath);
      if (!entries.includes(`${themeSlug}/style.css`)) failCheck(`ZIP does not contain ${themeSlug}/style.css`);
      if (entries.some((entry) => /(^|\/)(node_modules|\.generation|reports)(\/|$)/.test(entry))) failCheck('ZIP contains excluded transient folders');
    } catch (error) {
      failCheck(`ZIP content validation failed: ${error.message}`);
    }
  }

  const docsIndex = path.join(root, 'docs', 'index.html');
  if (!fs.existsSync(docsIndex) || !fs.readFileSync(docsIndex, 'utf8').includes(themeSlug)) failCheck(`Preview gallery does not link to ${themeSlug}`);

  runCheck('node', [scriptPath('theme-preview', 'validate-preview-gallery.js')]);

  if (failures > 0) {
    console.error(`Generated theme validation failed for ${themeSlug} with ${failures} issue(s).`);
    process.exit(1);
  }
  console.log(`Generated theme validation passed for ${themeSlug}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
