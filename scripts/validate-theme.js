#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yauzl = require('yauzl');
const { root } = require('./lib/repo-root');
const { parseArgs, arg } = require('./lib/args');
const { PREVIEW_RUNTIME_WARNING_PATTERN, REMOTE_RUNTIME_PATTERN, WALK_IGNORED_DIRECTORIES } = require('./lib/constants');
const { assertThemeSlug, assertTemplateName, walkFiles } = require('./lib/theme-utils');

const args = parseArgs(process.argv.slice(2));
const themeSlug = arg(args, 'theme-slug', args._[0] || '');
const templateArg = arg(args, 'template', args._[1] || '');
const outputArg = arg(args, 'output', '');
const phaseArg = arg(args, 'phase', 'final');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function rel(file, base) {
  return path.relative(base || root, file).replace(/\\/g, '/');
}

function readTemplateSource(themeDir) {
  const sourceFile = path.join(themeDir, '.theme-template-source');
  if (!fs.existsSync(sourceFile)) return '';
  const match = fs.readFileSync(sourceFile, 'utf8').match(/^template=(.+)$/m);
  return match ? match[1].trim() : '';
}

function filesInZip(zipPath) {
  return new Promise((resolve, reject) => {
    const entries = [];
    yauzl.open(zipPath, { lazyEntries: true }, (openError, zipfile) => {
      if (openError) return reject(openError);
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

function add(checks, name, passed, details = '') {
  checks.push({ name, status: passed ? 'passed' : 'failed', details });
}

function scssImportCandidates(baseDir, specifier) {
  const parsed = path.posix.parse(specifier);
  const direct = path.resolve(baseDir, specifier);
  const underscored = path.resolve(baseDir, parsed.dir, `_${parsed.base}`);
  return [direct, `${direct}.scss`, `${direct}.sass`, underscored, `${underscored}.scss`, `${underscored}.sass`, path.resolve(baseDir, specifier, 'index.scss'), path.resolve(baseDir, specifier, '_index.scss')];
}

function localAssetReferences(text) {
  return [...text.matchAll(/\b(?:src|href)=["']([^"']+)["']|url\(["']?([^"')]+)["']?\)/g)]
    .map((match) => match[1] || match[2])
    .filter((value) => value && !/^(?:https?:|data:|mailto:|tel:|#)/i.test(value));
}

async function validateTheme(options = {}) {
  const selectedSlug = assertThemeSlug(options.themeSlug || themeSlug);
  const themesRoot = path.resolve(root, 'wp-content', 'themes');
  const themeDir = path.resolve(themesRoot, selectedSlug);
  const checks = [];
  const phase = options.phase || phaseArg;

  add(checks, 'theme_path_containment', themeDir.startsWith(`${themesRoot}${path.sep}`), rel(themeDir));
  add(checks, 'theme_folder_exists', fs.existsSync(themeDir), `wp-content/themes/${selectedSlug}`);

  const templateName = assertTemplateName(options.template || templateArg || readTemplateSource(themeDir) || 'NOLAN-YOUNG-theme-000');
  const templateRoot = path.resolve(root, 'wordpress-themplate-themes', templateName);
  add(checks, 'template_exists', fs.existsSync(templateRoot), `wordpress-themplate-themes/${templateName}`);

  if (fs.existsSync(themeDir) && fs.existsSync(templateRoot)) {
    const templateFiles = walkFiles(templateRoot, { ignoredDirectories: WALK_IGNORED_DIRECTORIES })
      .map((file) => rel(file, templateRoot))
      .filter((file) => !/\.(log|tmp|swp|bak|map)$/i.test(file));
    const missing = templateFiles.filter((file) => !fs.existsSync(path.join(themeDir, file)));
    add(checks, 'selected_template_file_structure', missing.length === 0, missing.join(', '));
  }

  if ((phase === 'source' || phase === 'final') && fs.existsSync(themeDir)) {
    const declarations = new Map();
    for (const file of walkFiles(themeDir).filter((item) => item.endsWith('.php'))) {
      const relative = rel(file, themeDir);
      const text = fs.readFileSync(file, 'utf8');
      let match;
      const functionPattern = /function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
      while ((match = functionPattern.exec(text)) !== null) {
        if (!declarations.has(match[1])) declarations.set(match[1], []);
        declarations.get(match[1]).push(relative);
      }
    }
    const duplicateFunctions = [...declarations.entries()].filter(([, files]) => files.length > 1).map(([name, files]) => `${name}: ${files.join(', ')}`);
    add(checks, 'duplicate_php_functions', duplicateFunctions.length === 0, duplicateFunctions.join('; '));
  }

  if (phase === 'artifacts' || phase === 'final') {
    const previewDir = path.join(root, 'docs', 'Preview-Themes-Github', selectedSlug);
    add(checks, 'preview_exists', fs.existsSync(previewDir), rel(previewDir));
    if (fs.existsSync(previewDir)) {
      const htmlFiles = fs.readdirSync(previewDir).filter((file) => file.endsWith('.html'));
      add(checks, 'preview_expected_pages', ['index.html', 'homepage_preview.html'].every((file) => fs.existsSync(path.join(previewDir, file))), 'index.html and homepage_preview.html must exist.');
      const html = htmlFiles.map((file) => fs.readFileSync(path.join(previewDir, file), 'utf8')).join('\n');
      add(checks, 'preview_quality', !PREVIEW_RUNTIME_WARNING_PATTERN.test(html) && !REMOTE_RUNTIME_PATTERN.test(html), 'No runtime warnings or remote dependencies.');
    }
    const docsIndex = path.join(root, 'docs', 'index.html');
    add(checks, 'preview_gallery_entry', fs.existsSync(docsIndex) && fs.readFileSync(docsIndex, 'utf8').includes(selectedSlug), 'docs/index.html contains theme slug.');

    const zipPath = path.join(root, 'dist', 'zipped-themes', `${selectedSlug}.zip`);
    if (fs.existsSync(zipPath)) {
      try {
        const entries = await filesInZip(zipPath);
        const top = new Set(entries.map((entry) => entry.split('/')[0]).filter(Boolean));
        add(checks, 'zip_structure', top.size === 1 && top.has(selectedSlug) && entries.includes(`${selectedSlug}/style.css`), 'ZIP contains one top-level theme folder.');
      } catch (error) {
        add(checks, 'zip_structure', false, error.message);
      }
    } else {
      add(checks, 'zip_exists', false, rel(zipPath));
    }
  }

  const passed = checks.every((check) => check.status === 'passed' || check.status === 'skipped');
  const report = {
    theme_slug: selectedSlug,
    template_name: templateName,
    phase,
    checked_at: new Date().toISOString(),
    passed,
    status: passed ? 0 : 1,
    checks
  };
  const reportPath = options.output || outputArg || path.join(root, 'reports', 'runs', selectedSlug, `validation.${phase}.json`);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return report;
}

if (require.main === module) {
  if (!themeSlug) fail('Usage: node scripts/validate-theme.js --theme-slug <theme-slug> [--template <template-name>] [--phase <source|artifacts|final>]');
  validateTheme().then((report) => {
    console.log(`Validation report: reports/runs/${report.theme_slug}/validation.${report.phase}.json`);
    process.exit(report.passed ? 0 : 1);
  }).catch((error) => fail(error.message));
}

module.exports = { validateTheme };
