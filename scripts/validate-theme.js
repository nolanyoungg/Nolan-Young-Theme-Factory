#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yauzl = require('yauzl');
const { root } = require('./lib/repo-root');
const { parseArgs, arg } = require('./lib/args');
const {
  PLACEHOLDER_PATTERN,
  PREVIEW_RUNTIME_WARNING_PATTERN,
  REMOTE_RUNTIME_PATTERN,
  UNSUPPORTED_PREVIEW_PHP_CALLS,
  WALK_IGNORED_DIRECTORIES
} = require('./lib/constants');
const { localAssetReferenceFailures } = require('./lib/local-assets');
const { pageTemplateDetailFailures, phpLiteralTemplatePartReferences } = require('./lib/page-template-validation');
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

function literalDataAttributes(text) {
  return [...text.matchAll(/\b(data-[a-z0-9-]+)=/gi)].map((match) => match[1].toLowerCase());
}

function templatePartInventory(file) {
  if (!fs.existsSync(file)) return [];
  return [...new Set(phpLiteralTemplatePartReferences(fs.readFileSync(file, 'utf8')))].sort();
}

function phpDeclarations(file, kind) {
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, 'utf8');
  const pattern = kind === 'class'
    ? /\bclass\s+([A-Za-z_][A-Za-z0-9_]*)\b/g
    : /\bfunction\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  const names = [];
  let match;
  while ((match = pattern.exec(text)) !== null) names.push(match[1]);
  return [...new Set(names)].sort();
}

function fileStructureMetrics(file) {
  if (!fs.existsSync(file)) return { tags: 0, classes: 0, bytes: 0 };
  const text = fs.readFileSync(file, 'utf8');
  return {
    tags: (text.match(/<([a-z][a-z0-9-]*)\b/gi) || []).length,
    classes: (text.match(/\bclass\s*=\s*["'][^"']+["']/gi) || []).length,
    bytes: Buffer.byteLength(text, 'utf8')
  };
}

function renderCriticalFiles(themeDir) {
  const files = [];
  const frontPage = path.join(themeDir, 'front-page.php');
  if (fs.existsSync(frontPage)) files.push('front-page.php');
  const templatePartsDir = path.join(themeDir, 'template-parts');
  if (fs.existsSync(templatePartsDir)) {
    for (const file of walkFiles(templatePartsDir)) {
      const relative = rel(file, themeDir);
      if (/^template-parts\/content-.*\.php$/i.test(relative)) files.push(relative);
    }
  }
  const pageTemplatesDir = path.join(themeDir, 'page-templates');
  if (fs.existsSync(pageTemplatesDir)) {
    for (const file of walkFiles(pageTemplatesDir)) {
      const relative = rel(file, themeDir);
      if (/^page-templates\/.*\.php$/i.test(relative)) files.push(relative);
    }
  }
  return [...new Set(files)].sort();
}

async function validateTheme(options = {}) {
  const selectedSlug = assertThemeSlug(options.themeSlug || themeSlug);
  const themesRoot = path.resolve(root, 'wp-content', 'themes');
  const themeDir = path.resolve(themesRoot, selectedSlug);
  const checks = [];
  const phase = options.phase || phaseArg;

  add(checks, 'theme_path_containment', themeDir.startsWith(`${themesRoot}${path.sep}`), rel(themeDir));
  add(checks, 'theme_folder_exists', fs.existsSync(themeDir), `wp-content/themes/${selectedSlug}`);

  const templateName = assertTemplateName(options.template || templateArg || readTemplateSource(themeDir) || 'nolan-young-theme-template-01');
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
    const themeFiles = walkFiles(themeDir);
    for (const file of themeFiles.filter((item) => item.endsWith('.php'))) {
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

    const placeholderHits = themeFiles
      .filter((file) => /\.(php|html|css|scss|sass|js|json|svg|md|txt)$/i.test(file))
      .map((file) => {
        const text = fs.readFileSync(file, 'utf8');
        return PLACEHOLDER_PATTERN.test(text) ? rel(file, themeDir) : '';
      })
      .filter(Boolean);
    add(checks, 'placeholder_content', placeholderHits.length === 0, placeholderHits.join(', '));

    const thinPageTemplates = pageTemplateDetailFailures(themeDir);
    add(checks, 'page_template_detail', thinPageTemplates.length === 0, thinPageTemplates.join(', '));

    const localAssetFailures = localAssetReferenceFailures(
      themeDir,
      themeFiles.filter((file) => /\.(php|html|css|scss|sass|js|json|svg)$/i.test(file)),
      (file) => rel(file, themeDir)
    );
    add(checks, 'local_asset_references_resolve', localAssetFailures.length === 0, localAssetFailures.join(', '));

    const unsupportedPreviewPhpCalls = themeFiles
      .filter((file) => file.endsWith('.php'))
      .flatMap((file) => {
        const relative = rel(file, themeDir);
        const text = fs.readFileSync(file, 'utf8');
        return UNSUPPORTED_PREVIEW_PHP_CALLS
          .filter((call) => call.pattern.test(text))
          .map((call) => `${relative} -> ${call.name}`);
      });
    add(checks, 'unsupported_preview_php_calls', unsupportedPreviewPhpCalls.length === 0, unsupportedPreviewPhpCalls.join(', '));

    const unchangedCritical = renderCriticalFiles(themeDir)
      .filter((file) => fs.existsSync(path.join(templateRoot, file)))
      .filter((file) => {
        const themeText = fs.readFileSync(path.join(themeDir, file), 'utf8');
        const templateText = fs.readFileSync(path.join(templateRoot, file), 'utf8');
        return themeText === templateText && PLACEHOLDER_PATTERN.test(themeText);
      });
    add(checks, 'critical_template_fragments_replaced', unchangedCritical.length === 0, unchangedCritical.join(', '));

    const missingTemplatePartRefs = themeFiles
      .filter((file) => file.endsWith('.php'))
      .flatMap((file) => {
        const relative = rel(file, themeDir);
        const text = fs.readFileSync(file, 'utf8');
        return phpLiteralTemplatePartReferences(text)
          .filter((reference) => reference.startsWith('template-parts/'))
          .filter((reference) => !fs.existsSync(path.join(themeDir, reference)))
          .map((reference) => `${relative} -> ${reference}`);
      });
    add(checks, 'template_part_references_resolve', missingTemplatePartRefs.length === 0, missingTemplatePartRefs.join(', '));

    const templateHeaderInventory = templatePartInventory(path.join(templateRoot, 'header.php'));
    const themeHeaderInventory = new Set(templatePartInventory(path.join(themeDir, 'header.php')));
    const missingHeaderInventory = templateHeaderInventory.filter((reference) => !themeHeaderInventory.has(reference));
    add(checks, 'header_scaffold_inventory_preserved', missingHeaderInventory.length === 0, missingHeaderInventory.join(', '));

    const templateHeaderText = fs.existsSync(path.join(templateRoot, 'header.php')) ? fs.readFileSync(path.join(templateRoot, 'header.php'), 'utf8') : '';
    const themeHeaderText = fs.existsSync(path.join(themeDir, 'header.php')) ? fs.readFileSync(path.join(themeDir, 'header.php'), 'utf8') : '';
    add(checks, 'header_no_inline_navigation', !/\bwp_nav_menu\s*\(/.test(themeHeaderText), 'header.php must delegate primary navigation to the prepared header template part.');
    const requiredHeaderDataAttrs = [...new Set(literalDataAttributes(templateHeaderText))];
    const themeHeaderDataAttrs = new Set(literalDataAttributes(themeHeaderText));
    const missingHeaderDataAttrs = requiredHeaderDataAttrs.filter((attribute) => !themeHeaderDataAttrs.has(attribute));
    add(checks, 'header_scaffold_behavior_preserved', missingHeaderDataAttrs.length === 0, missingHeaderDataAttrs.join(', '));

    const templateFrontPageInventory = templatePartInventory(path.join(templateRoot, 'front-page.php'));
    const themeFrontPageInventoryList = templatePartInventory(path.join(themeDir, 'front-page.php'));
    const themeFrontPageInventory = new Set(themeFrontPageInventoryList);
    const missingFrontPageInventory = templateFrontPageInventory.filter((reference) => !themeFrontPageInventory.has(reference));
    add(checks, 'front_page_section_inventory_preserved', missingFrontPageInventory.length === 0, missingFrontPageInventory.join(', '));
    add(
      checks,
      'front_page_section_sequence_preserved',
      JSON.stringify(themeFrontPageInventoryList) === JSON.stringify(templateFrontPageInventory),
      `expected=${templateFrontPageInventory.join(' | ')} actual=${themeFrontPageInventoryList.join(' | ')}`
    );

    const simplifiedFrontPageSections = templateFrontPageInventory
      .filter((reference) => fs.existsSync(path.join(templateRoot, reference)) && fs.existsSync(path.join(themeDir, reference)))
      .filter((reference) => {
        const templateMetrics = fileStructureMetrics(path.join(templateRoot, reference));
        const themeMetrics = fileStructureMetrics(path.join(themeDir, reference));
        if (templateMetrics.tags < 8 && templateMetrics.bytes < 800) return false;
        const minTags = Math.max(4, Math.floor(templateMetrics.tags * 0.6));
        const minBytes = Math.floor(templateMetrics.bytes * 0.45);
        return themeMetrics.tags < minTags || themeMetrics.bytes < minBytes;
      });
    add(checks, 'front_page_section_density_preserved', simplifiedFrontPageSections.length === 0, simplifiedFrontPageSections.join(', '));

    const templateNavigationFunctions = phpDeclarations(path.join(templateRoot, 'inc', 'navigation.php'), 'function');
    const themeNavigationFunctions = new Set(phpDeclarations(path.join(themeDir, 'inc', 'navigation.php'), 'function'));
    const missingNavigationFunctions = templateNavigationFunctions.filter((name) => !themeNavigationFunctions.has(name));
    const templateNavigationClasses = phpDeclarations(path.join(templateRoot, 'inc', 'navigation.php'), 'class');
    const themeNavigationClasses = new Set(phpDeclarations(path.join(themeDir, 'inc', 'navigation.php'), 'class'));
    const missingNavigationClasses = templateNavigationClasses.filter((name) => !themeNavigationClasses.has(name));
    add(
      checks,
      'navigation_scaffold_inventory_preserved',
      missingNavigationFunctions.length === 0 && missingNavigationClasses.length === 0,
      [...missingNavigationFunctions, ...missingNavigationClasses].join(', ')
    );
  }

  if (phase === 'artifacts' || phase === 'final') {
    const previewDir = path.join(root, 'docs', 'Preview-Themes-Github', selectedSlug);
    add(checks, 'preview_exists', fs.existsSync(previewDir), rel(previewDir));
    if (fs.existsSync(previewDir)) {
      const htmlFiles = fs.readdirSync(previewDir).filter((file) => file.endsWith('.html'));
      add(checks, 'preview_expected_pages', ['index.html', 'homepage_preview.html'].every((file) => fs.existsSync(path.join(previewDir, file))), 'index.html and homepage_preview.html must exist.');
      const html = htmlFiles.map((file) => fs.readFileSync(path.join(previewDir, file), 'utf8')).join('\n');
      add(checks, 'preview_quality', !PREVIEW_RUNTIME_WARNING_PATTERN.test(html) && !REMOTE_RUNTIME_PATTERN.test(html), 'No runtime warnings or remote dependencies.');
      const previewAssetFailures = localAssetReferenceFailures(
        previewDir,
        walkFiles(previewDir).filter((file) => /\.(html|css|js|svg)$/i.test(file)),
        (file) => rel(file, previewDir)
      );
      add(checks, 'preview_local_asset_references_resolve', previewAssetFailures.length === 0, previewAssetFailures.join(', '));
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
