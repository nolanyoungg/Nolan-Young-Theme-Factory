#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yauzl = require('yauzl');
const { root } = require('./lib/repo-root');
const { parseArgs, arg } = require('./lib/args');
const { runCommand } = require('./lib/command-runner');
const {
  ALLOWED_REMOTE_REFERENCE_PATTERN,
  ABSOLUTE_LOCAL_ASSET_PATTERN,
  INLINE_STYLE_BLOCK_PATTERN,
  MODEL_FILE_BLOCK_MARKER_PATTERN,
  PLACEHOLDER_PATTERN,
  PREVIEW_RUNTIME_WARNING_PATTERN,
  REMOTE_RUNTIME_PATTERN,
  REPO_LOCAL_PATH_PATTERN,
  REQUIRED_BUNDLES,
  REQUIRED_ROOT_FILES,
  SECRET_PATTERN,
  TEMPLATE_PART_WRAPPER_PATTERN,
  WALK_IGNORED_DIRECTORIES
} = require('./lib/constants');
const { assertThemeSlug, assertTemplateName, walkFiles } = require('./lib/theme-utils');

const args = parseArgs(process.argv.slice(2));
const themeSlug = arg(args, 'theme-slug', args._[0] || '');
const templateArg = arg(args, 'template', args._[1] || '');
const outputArg = arg(args, 'output', '');

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

  if (fs.existsSync(themeDir)) {
    const missingRoot = REQUIRED_ROOT_FILES.filter((file) => !fs.existsSync(path.join(themeDir, file)));
    add(checks, 'required_wordpress_root_files', missingRoot.length === 0, missingRoot.join(', '));

    const stylePath = path.join(themeDir, 'style.css');
    const style = fs.existsSync(stylePath) ? fs.readFileSync(stylePath, 'utf8') : '';
    add(checks, 'style_css_headers', /^Theme Name:/m.test(style) && /^Text Domain:/m.test(style), 'Requires Theme Name and Text Domain.');

    const missingBundles = REQUIRED_BUNDLES.filter((file) => !fs.existsSync(path.join(themeDir, file)));
    add(checks, 'expected_asset_files', missingBundles.length === 0, missingBundles.join(', '));

    const phpProbe = runCommand('php', ['-v'], { echo: false });
    if (phpProbe.status === 0) {
      const failedPhp = [];
      for (const file of walkFiles(themeDir).filter((item) => item.endsWith('.php'))) {
        const lint = runCommand('php', ['-l', file], { echo: false });
        if (lint.status !== 0) failedPhp.push(rel(file, themeDir));
      }
      add(checks, 'php_syntax', failedPhp.length === 0, failedPhp.join(', '));
    } else {
      checks.push({ name: 'php_syntax', status: 'skipped', details: 'php command not available' });
    }

    const textFailures = [];
    const placeholderFailures = [];
    const missingAssets = [];
    for (const file of walkFiles(themeDir).filter((item) => !/\.(png|jpe?g|webp|gif|zip)$/i.test(item))) {
      const relative = rel(file, themeDir);
      if (relative === 'package-lock.json') continue;
      const text = fs.readFileSync(file, 'utf8');
      if (PLACEHOLDER_PATTERN.test(text)) placeholderFailures.push(relative);
      if (SECRET_PATTERN.test(text)) textFailures.push(`${relative}: potential secret`);
      if (REMOTE_RUNTIME_PATTERN.test(text) && !ALLOWED_REMOTE_REFERENCE_PATTERN.test(text)) textFailures.push(`${relative}: remote runtime dependency`);
      if (ABSOLUTE_LOCAL_ASSET_PATTERN.test(text)) textFailures.push(`${relative}: root-relative /assets path`);
      if (REPO_LOCAL_PATH_PATTERN.test(text)) textFailures.push(`${relative}: repo-local path`);
      if (/\.php$/i.test(relative) && INLINE_STYLE_BLOCK_PATTERN.test(text)) textFailures.push(`${relative}: inline style block`);
      if (/\.(php|css|scss|js)$/i.test(relative) && MODEL_FILE_BLOCK_MARKER_PATTERN.test(text)) textFailures.push(`${relative}: model file block marker`);
      if (relative.startsWith('template-parts/') && TEMPLATE_PART_WRAPPER_PATTERN.test(text)) textFailures.push(`${relative}: template part document wrapper`);
      for (const reference of localAssetReferences(text)) {
        if (/^\//.test(reference)) continue;
        const candidate = reference.startsWith('assets/') ? path.join(themeDir, reference) : path.resolve(path.dirname(file), reference);
        if (!fs.existsSync(candidate) && /\.(svg|png|jpe?g|webp|gif|css|js|woff2?)($|[?#])/i.test(reference)) missingAssets.push(`${relative}: ${reference}`);
      }
    }
    add(checks, 'placeholder_content', placeholderFailures.length === 0, placeholderFailures.join(', '));
    add(checks, 'wordpress_quality', textFailures.length === 0, textFailures.join('; '));
    add(checks, 'missing_local_assets', missingAssets.length === 0, missingAssets.join('; '));

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

    const unresolvedImports = [];
    for (const file of walkFiles(path.join(themeDir, 'src', 'scss')).filter((item) => item.endsWith('.scss'))) {
      const relative = rel(file, themeDir);
      const text = fs.readFileSync(file, 'utf8');
      let match;
      const importPattern = /@(use|import)\s+["']([^"']+)["']/g;
      while ((match = importPattern.exec(text)) !== null) {
        const specifier = match[2];
        if (specifier.startsWith('http:') || specifier.startsWith('https:') || specifier.startsWith('sass:')) continue;
        if (!scssImportCandidates(path.dirname(file), specifier).some((candidate) => fs.existsSync(candidate))) {
          unresolvedImports.push(`${relative}: ${specifier}`);
        }
      }
    }
    add(checks, 'unresolved_scss_imports', unresolvedImports.length === 0, unresolvedImports.join('; '));
  }

  const previewDir = path.join(root, 'docs', 'Preview-Themes-Github', selectedSlug);
  add(checks, 'preview_exists', fs.existsSync(previewDir), rel(previewDir));
  if (fs.existsSync(previewDir)) {
    const html = fs.readdirSync(previewDir).filter((file) => file.endsWith('.html')).map((file) => fs.readFileSync(path.join(previewDir, file), 'utf8')).join('\n');
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

  const passed = checks.every((check) => check.status === 'passed' || check.status === 'skipped');
  const report = {
    theme_slug: selectedSlug,
    template_name: templateName,
    checked_at: new Date().toISOString(),
    passed,
    status: passed ? 0 : 1,
    checks
  };
  const reportPath = options.output || outputArg || path.join(root, 'reports', 'runs', selectedSlug, 'validation.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return report;
}

if (require.main === module) {
  if (!themeSlug) fail('Usage: node scripts/validate-theme.js --theme-slug <theme-slug> [--template <template-name>]');
  validateTheme().then((report) => {
    console.log(`Validation report: reports/runs/${report.theme_slug}/validation.json`);
    process.exit(report.passed ? 0 : 1);
  }).catch((error) => fail(error.message));
}

module.exports = { validateTheme };
