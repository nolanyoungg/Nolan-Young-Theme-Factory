#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const readline = require('node:readline/promises');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const THEMES_DIR = path.join(ROOT, 'wp-content', 'themes');
const PREVIEWS_DIR = path.join(ROOT, 'docs', 'Preview-Themes-Github');
const ZIPS_DIR = path.join(ROOT, 'dist', 'zipped-themes');
const REPORTS_DIR = path.join(ROOT, 'reports', 'runs');
const PROMPTS_DIR = path.join(ROOT, 'prompts', 'pending');
const DEFAULT_TEMPLATE_DIR = path.join(THEMES_DIR, '000_nolan_young_theme_master_template_prompt_filler_template_1');
const MODE_VALUES = new Set(['codex-only', 'ollama-only']);
const SLUG_RE = /^\d{3}_nolan_young_theme_[a-z0-9]+(?:_[a-z0-9]+)*$/;
const SEEDED_ASSET_MANIFEST = path.join('assets', 'images', 'asset-manifest.json');
const PACKAGE_EXCLUDED_DIRS = new Set(['node_modules', '.git', '.agents', '.codex', '.svn', '.hg']);

const REQUIRED_THEME_FILES = [
  'style.css',
  'functions.php',
  'index.php',
  'header.php',
  'footer.php',
  'front-page.php',
  'package.json',
  'package-lock.json',
  'build/webpack.config.js',
  'src/js/main.js',
  'src/scss/main.scss',
  'assets/css/bundle.css',
  'assets/js/bundle.js',
  'page-templates/template-about-us.php',
  'page-templates/template-services.php',
  'page-templates/template-work.php',
  'page-templates/template-blog.php',
  'page-templates/template-contact.php',
  'page-templates/template-policy.php',
  'page-templates/template-single-service.php'
];

const PREVIEW_PAGES = [
  ['index.html', 'front-page.php'],
  ['homepage_preview.html', 'front-page.php'],
  ['about-us_preview.html', 'page-templates/template-about-us.php'],
  ['services_preview.html', 'page-templates/template-services.php'],
  ['work_preview.html', 'page-templates/template-work.php'],
  ['blog_preview.html', 'page-templates/template-blog.php'],
  ['contact_preview.html', 'page-templates/template-contact.php'],
  ['policy_preview.html', 'page-templates/template-policy.php'],
  ['single_services_preview.html', 'page-templates/template-single-service.php']
];

const OLLAMA_STAGES = [
  {
    id: 'identity-content',
    promptSections: ['Business Identity', 'Content Requirements', 'Pages to Build', 'Header and Navigation'],
    allow: [
      'style.css',
      'README.md',
      'header.php',
      'footer.php',
      'front-page.php',
      'index.php',
      'page.php',
      'single.php',
      'search.php',
      '404.php',
      '403.php',
      'searchform.php',
      'page-templates/**',
      'template-parts/**',
      'inc/helpers.php',
      'theme.json'
    ]
  },
  {
    id: 'wordpress-structure',
    promptSections: ['Functionality', 'Core WordPress Theme Requirements', 'WordPress Asset Enqueue Requirements', 'Pages to Build', 'Header and Navigation'],
    allow: [
      'functions.php',
      'inc/**',
      'header.php',
      'footer.php',
      'front-page.php',
      'index.php',
      'page.php',
      'single.php',
      'search.php',
      '404.php',
      '403.php',
      'searchform.php',
      'page-templates/**',
      'template-parts/**',
      'theme.json'
    ]
  },
  {
    id: 'visual-system',
    promptSections: ['Style / CSS Requirements', 'CSS Architecture', 'Visual Design Direction', 'Color System', 'Typography Direction'],
    allow: [
      'style.css',
      'theme.json',
      'src/scss/**',
      'assets/css/**',
      'assets/icons/**',
      'assets/images/**',
      'screenshot.png'
    ]
  },
  {
    id: 'interaction-build',
    promptSections: ['Functionality', 'Header Behavior', 'Accessibility and Motion', 'Accessibility', 'Header and Navigation', 'Webpack Build Requirements'],
    allow: [
      'src/js/**',
      'assets/js/**',
      'build/**',
      'package.json',
      'package-lock.json',
      'header.php',
      'footer.php',
      'inc/enqueue.php'
    ]
  }
];

function main() {
  const [command = 'help', ...rawArgs] = process.argv.slice(2);
  const args = parseArgs(rawArgs);

  Promise.resolve(dispatch(command, args)).catch((error) => {
    console.error(error && error.message ? error.message : String(error));
    process.exitCode = 1;
  });
}

async function dispatch(command, args) {
  switch (command) {
    case 'run':
      return run(args);
    case 'resume':
      return resume(args);
    case 'prepare':
      return prepare(args);
    case 'validate':
      return validateCommand(args);
    case 'build':
      return buildCommand(args);
    case 'preview':
      return previewCommand(args);
    case 'preview:index':
      return previewIndexCommand(args);
    case 'zip':
      return zipCommand(args);
    case 'delete':
      return deleteCommand(args);
    case 'env':
      return envCommand();
    case 'model-check':
      return modelCheckCommand(args);
    case 'self-test':
      return selfTest();
    case 'help':
    default:
      printHelp();
  }
}

async function run(args) {
  const options = await collectRunOptions(args);
  const ollamaPlan = options.mode === 'ollama-only'
    ? validateOllamaPlan(collectMarkdownHeadings(fs.readFileSync(options.promptPath, 'utf8')))
    : [];
  modelCheck(options.mode === 'codex-only' ? 'codex' : 'ollama', options);

  const reportDir = ensureReportDir(options.themeSlug);

  writeJson(path.join(reportDir, 'run.config.json'), {
    mode: options.mode,
    prompt: relative(options.promptPath),
    templateSource: relative(options.templateSourcePath),
    themeSlug: options.themeSlug,
    createdAt: new Date().toISOString(),
    ollamaStages: ollamaPlan
  });

  let prepared = false;
  if (options.force || !themeExists(options.themeSlug)) {
    prepareTheme(options);
    prepared = true;
  }

  const themeDir = getThemeDir(options.themeSlug);
  if (options.mode === 'codex-only') {
    seedGeneratedAssets(themeDir, options);
    runCodexGeneration(themeDir, options, reportDir);
  } else {
    runOllamaGeneration(themeDir, options, reportDir);
  }

  buildTheme(options.themeSlug);
  validateSourceOrThrow(options.themeSlug);
  generatePreview(options.themeSlug);
  generatePreviewIndex();
  packageTheme(options.themeSlug);
  validateArtifactsOrThrow(options.themeSlug);

  writeJson(path.join(reportDir, 'run.result.json'), {
    themeSlug: options.themeSlug,
    mode: options.mode,
    prepared,
    completedAt: new Date().toISOString(),
    status: 'completed'
  });

  console.log(`Theme run completed: ${options.themeSlug}`);
}

async function resume(args) {
  const themeSlug = requireSlug(args.themeSlug || args['theme-slug']);
  buildTheme(themeSlug);
  validateSourceOrThrow(themeSlug);
  generatePreview(themeSlug);
  generatePreviewIndex();
  packageTheme(themeSlug);
  validateArtifactsOrThrow(themeSlug);
  console.log(`Theme deterministic resume completed: ${themeSlug}`);
}

async function prepare(args) {
  const promptPath = resolvePromptPath(args.prompt);
  const templateSourcePath = resolveTemplateSource(args);
  const themeSlug = args.themeSlug || args['theme-slug'] || makeNextSlug(promptPath);
  const options = { promptPath, templateSourcePath, themeSlug, force: Boolean(args.force) };

  if (args['dry-run']) {
    console.log(JSON.stringify({
      themeSlug,
      prompt: relative(promptPath),
      templateSource: relative(templateSourcePath)
    }, null, 2));
    return;
  }

  prepareTheme(options);
  console.log(themeSlug);
}

async function validateCommand(args) {
  const themeSlug = requireSlug(args.themeSlug || args['theme-slug']);
  const phase = args.phase || 'all';
  if (!['source', 'artifact', 'all'].includes(phase)) {
    throw new Error(`Unsupported validation phase: ${phase}`);
  }

  const result = { source: null, artifact: null };
  if (phase === 'source' || phase === 'all') {
    result.source = validateSource(themeSlug);
    printValidation('source', result.source);
  }
  if (phase === 'artifact' || phase === 'all') {
    result.artifact = validateArtifacts(themeSlug);
    printValidation('artifact', result.artifact);
  }
  if ((result.source && result.source.errors.length) || (result.artifact && result.artifact.errors.length)) {
    process.exitCode = 1;
  }
}

async function buildCommand(args) {
  const themeSlug = requireSlug(args.themeSlug || args['theme-slug']);
  buildTheme(themeSlug);
}

async function previewCommand(args) {
  const themeSlug = requireSlug(args.themeSlug || args['theme-slug']);
  generatePreview(themeSlug);
  generatePreviewIndex();
}

async function previewIndexCommand() {
  generatePreviewIndex();
}

async function zipCommand(args) {
  const themeSlug = requireSlug(args.themeSlug || args['theme-slug']);
  packageTheme(themeSlug);
}

async function deleteCommand(args) {
  const themeSlug = requireSlug(args.themeSlug || args['theme-slug']);
  if (!args.yes) {
    throw new Error('Refusing delete without --yes.');
  }
  removeIfExists(getThemeDir(themeSlug));
  removeIfExists(path.join(PREVIEWS_DIR, themeSlug));
  removeIfExists(path.join(ZIPS_DIR, `${themeSlug}.zip`));
  if (args.reports) {
    removeIfExists(path.join(REPORTS_DIR, themeSlug));
  }
  generatePreviewIndex();
  console.log(`Deleted generated artifacts for ${themeSlug}`);
}

async function envCommand() {
  const checks = [
    ['node', ['--version']],
    ['npm', ['--version']],
    ['php', ['-v']],
    ['zip', ['-v']],
    ['unzip', ['-v']],
    ['codex', ['--version']],
    ['ollama', ['--version']]
  ];
  for (const [cmd, cmdArgs] of checks) {
    const result = spawnSync(cmd, cmdArgs, { cwd: ROOT, encoding: 'utf8' });
    const ok = result.status === 0;
    const firstLine = (result.stdout || result.stderr || '').split(/\r?\n/).find(Boolean) || '';
    console.log(`${ok ? 'ok' : 'missing'} ${cmd}${firstLine ? ` - ${firstLine}` : ''}`);
  }
  console.log(`default template: ${fs.existsSync(DEFAULT_TEMPLATE_DIR) ? relative(DEFAULT_TEMPLATE_DIR) : 'missing'}`);
  console.log('modes: codex-only, ollama-only');
}

async function modelCheckCommand(args) {
  modelCheck(args.provider, args);
}

async function selfTest() {
  const checks = [];
  checks.push(runCheck('node syntax', () => {
    const result = spawnSync(process.execPath, ['--check', path.join(ROOT, 'scripts', 'theme-factory.js')], { cwd: ROOT, encoding: 'utf8' });
    assertStatus(result, 'node --check scripts/theme-factory.js');
  }));
  checks.push(runCheck('package scripts', () => {
    const pkg = readJson(path.join(ROOT, 'package.json'));
    for (const scriptName of ['theme:run', 'theme:resume', 'theme:prepare', 'theme:validate', 'theme:build', 'theme:preview', 'theme:preview:index', 'theme:zip', 'theme:delete', 'theme:env', 'theme:model-check', 'test:scripts']) {
      if (!pkg.scripts || !pkg.scripts[scriptName]) {
        throw new Error(`Missing package script: ${scriptName}`);
      }
    }
    if (JSON.stringify(pkg).includes('hybrid')) {
      throw new Error('package.json still references hybrid mode.');
    }
  }));
  checks.push(runCheck('prepare dry run', () => {
    const prompt = firstPromptPath();
    const slug = makeNextSlug(prompt);
    if (!SLUG_RE.test(slug)) {
      throw new Error(`Dry-run slug is invalid: ${slug}`);
    }
  }));
  checks.push(runCheck('validate current source', () => {
    validateSourceOrThrow('000_nolan_young_theme_master_template_prompt_filler_template_1', { writeReport: false });
  }));
  checks.push(runCheck('codex model check', () => {
    modelCheck('codex', {});
  }));

  const failed = checks.filter((check) => !check.ok);
  for (const check of checks) {
    console.log(`${check.ok ? 'ok' : 'fail'} ${check.name}${check.error ? ` - ${check.error}` : ''}`);
  }
  if (failed.length) {
    process.exitCode = 1;
  }
}

function runCheck(name, fn) {
  try {
    fn();
    return { name, ok: true };
  } catch (error) {
    return { name, ok: false, error: error.message };
  }
}

async function collectRunOptions(args) {
  let options = {
    mode: args.mode,
    promptPath: args.prompt ? resolvePromptPath(args.prompt) : null,
    templateSourcePath: args.templateSourcePath || args['template-source-path'] ? resolveTemplateSource(args) : null,
    themeSlug: args.themeSlug || args['theme-slug'] || null,
    codexExecutable: args.codexExecutable || args['codex-executable'] || 'codex',
    codexModel: args.codexModel || args['codex-model'] || '',
    codexReasoning: args.codexReasoning || args['codex-reasoning'] || '',
    codexExtraArgs: splitExtraArgs(args.codexExtraArgs || args['codex-extra-args'] || ''),
    ollamaExecutable: args.ollamaExecutable || args['ollama-executable'] || 'ollama',
    ollamaModel: args.ollamaModel || args['ollama-model'] || '',
    force: Boolean(args.force)
  };

  const interactive = process.stdin.isTTY && process.stdout.isTTY && (!options.mode || !options.promptPath || !options.themeSlug);
  if (interactive) {
    options = await askRunOptions(options);
  }

  if (!MODE_VALUES.has(options.mode)) {
    throw new Error(`Choose --mode codex-only or --mode ollama-only. Received: ${options.mode || '(missing)'}`);
  }
  if (!options.promptPath) {
    throw new Error('Missing --prompt.');
  }
  if (!options.templateSourcePath) {
    options.templateSourcePath = resolveTemplateSource({});
  }
  if (!options.themeSlug) {
    options.themeSlug = makeNextSlug(options.promptPath);
  }
  requireSlug(options.themeSlug);
  if (options.mode === 'ollama-only' && !options.ollamaModel) {
    throw new Error('Missing --ollama-model for ollama-only mode.');
  }
  return options;
}

async function askRunOptions(options) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    if (!options.mode) {
      options.mode = await askWithDefault(rl, 'Mode (codex-only or ollama-only)', 'codex-only');
    }
    if (!options.promptPath) {
      const firstPrompt = firstPromptPath();
      options.promptPath = resolvePromptPath(await askWithDefault(rl, 'Prompt file', relative(firstPrompt)));
    }
    if (!options.templateSourcePath) {
      options.templateSourcePath = resolvePath(await askWithDefault(rl, 'Template source path', relative(DEFAULT_TEMPLATE_DIR)));
    }
    if (!options.themeSlug) {
      options.themeSlug = await askWithDefault(rl, 'Theme slug', makeNextSlug(options.promptPath));
    }
    if (options.mode === 'codex-only') {
      options.codexExecutable = await askWithDefault(rl, 'Codex executable', options.codexExecutable);
      options.codexModel = await askWithDefault(rl, 'Codex model (blank uses Codex config)', options.codexModel);
      options.codexReasoning = await askWithDefault(rl, 'Codex reasoning (blank uses Codex config)', options.codexReasoning);
      options.codexExtraArgs = splitExtraArgs(await askWithDefault(rl, 'Codex extra args', options.codexExtraArgs.join(' ')));
    } else {
      options.ollamaExecutable = await askWithDefault(rl, 'Ollama executable', options.ollamaExecutable);
      options.ollamaModel = await askWithDefault(rl, 'Ollama model', options.ollamaModel || 'llama3.1:8b');
    }
    const confirmation = await askWithDefault(rl, 'Type continue to start generation', '');
    if (confirmation !== 'continue') {
      throw new Error('Generation cancelled.');
    }
  } finally {
    rl.close();
  }
  return options;
}

async function askWithDefault(rl, label, defaultValue) {
  const suffix = defaultValue ? ` [${defaultValue}]` : '';
  const answer = await rl.question(`${label}${suffix}: `);
  return answer.trim() || defaultValue;
}

function prepareTheme(options) {
  const themeSlug = requireSlug(options.themeSlug);
  const promptPath = options.promptPath ? resolvePromptPath(options.promptPath) : null;
  const templateSourcePath = options.templateSourcePath ? resolvePath(options.templateSourcePath) : resolveTemplateSource({});
  const targetDir = getThemeDir(themeSlug);

  if (fs.existsSync(targetDir)) {
    if (!options.force) {
      throw new Error(`Theme already exists: ${relative(targetDir)}. Use --force only when you intend to replace the prepared copy.`);
    }
    removeIfExists(targetDir);
  }

  ensureDir(THEMES_DIR);
  const extracted = materializeTemplateSource(templateSourcePath);
  fs.cpSync(extracted.themeDir, targetDir, {
    recursive: true,
    filter: (src) => !path.basename(src).match(/^node_modules$/)
  });
  updatePreparedIdentity(targetDir, themeSlug, templateSourcePath);
  fs.writeFileSync(path.join(targetDir, '.theme-factory-run.json'), JSON.stringify({
    themeSlug,
    prompt: promptPath ? relative(promptPath) : null,
    templateSource: relative(templateSourcePath),
    preparedAt: new Date().toISOString()
  }, null, 2) + '\n');
  if (extracted.cleanupDir) {
    removeIfExists(extracted.cleanupDir);
  }
}

function materializeTemplateSource(templateSourcePath) {
  const stat = fs.statSync(templateSourcePath);
  if (stat.isDirectory()) {
    const stylePath = path.join(templateSourcePath, 'style.css');
    if (!fs.existsSync(stylePath)) {
      throw new Error(`Template directory does not contain style.css: ${relative(templateSourcePath)}`);
    }
    return { themeDir: templateSourcePath, cleanupDir: null };
  }

  if (!templateSourcePath.endsWith('.zip')) {
    throw new Error(`Template source must be a directory or .zip: ${relative(templateSourcePath)}`);
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-template-'));
  const unzip = spawnSync('unzip', ['-q', templateSourcePath, '-d', tempDir], { cwd: ROOT, encoding: 'utf8' });
  assertStatus(unzip, `unzip ${relative(templateSourcePath)}`);
  const candidates = findDirsWithFile(tempDir, 'style.css');
  if (!candidates.length) {
    removeIfExists(tempDir);
    throw new Error(`Template zip does not contain a WordPress theme style.css: ${relative(templateSourcePath)}`);
  }
  candidates.sort((a, b) => a.length - b.length);
  return { themeDir: candidates[0], cleanupDir: tempDir };
}

function updatePreparedIdentity(themeDir, themeSlug, templateSourcePath) {
  const themeName = titleFromSlug(themeSlug);
  const textDomain = themeSlug.replace(/_/g, '-');
  const stylePath = path.join(themeDir, 'style.css');
  if (fs.existsSync(stylePath)) {
    let style = fs.readFileSync(stylePath, 'utf8');
    style = upsertCssHeader(style, 'Theme Name', themeName);
    style = upsertCssHeader(style, 'Description', `Generated WordPress theme prepared from ${path.basename(templateSourcePath)}.`);
    style = upsertCssHeader(style, 'Text Domain', textDomain);
    fs.writeFileSync(stylePath, style);
  }

  const packagePath = path.join(themeDir, 'package.json');
  if (fs.existsSync(packagePath)) {
    const pkg = readJson(packagePath);
    pkg.name = themeSlug.replace(/_/g, '-');
    pkg.private = true;
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.dev = pkg.scripts.dev || 'webpack --config build/webpack.config.js --mode development --watch';
    pkg.scripts.build = pkg.scripts.build || 'webpack --config build/webpack.config.js --mode production';
    writeJson(packagePath, pkg);
  }

  const lockPath = path.join(themeDir, 'package-lock.json');
  if (fs.existsSync(lockPath)) {
    const lock = readJson(lockPath);
    lock.name = themeSlug.replace(/_/g, '-');
    if (lock.packages && lock.packages['']) {
      lock.packages[''].name = themeSlug.replace(/_/g, '-');
    }
    writeJson(lockPath, lock);
  }
}

function upsertCssHeader(content, field, value) {
  const re = new RegExp(`^(${escapeRegExp(field)}:\\s*).*$`, 'm');
  if (re.test(content)) {
    return content.replace(re, `$1${value}`);
  }
  return content.replace(/^\/\*\s*\n/, `/*\n${field}: ${value}\n`);
}

function seedGeneratedAssets(themeDir, options) {
  const themeSlug = path.basename(themeDir);
  const brand = titleFromSlug(themeSlug).replace(/^\d{3}\s+Nolan Young Theme\s+/, '');
  const assets = seededAssetCatalog(themeSlug, brand);
  const isLandscaping = isLandscapingTheme(themeSlug);

  const palette = isLandscaping ? landscapingPalette() : paletteForSlug(themeSlug);
  if (isLandscaping) {
    pruneCopiedIllustrationSvgs(themeDir);
    seedLandscapingThemeJson(themeDir);
  }
  for (const asset of assets) {
    const target = path.join(themeDir, asset.path);
    ensureDir(path.dirname(target));
    if (asset.kind === 'stock-photo') {
      downloadStockPhoto(asset.sourceUrl, target);
    } else {
      fs.writeFileSync(target, isLandscaping ? createLandscapingIconSvg(asset.role, palette) : createIconSvg(asset.role, palette));
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    themeSlug,
    source: 'Separate pre-generation stock-photo seeding by the Nolan Young Theme Factory before Codex generation.',
    license: 'Stock photos are downloaded from Unsplash and governed by the Unsplash License: free commercial and non-commercial use, no permission required, attribution appreciated. Local SVG icons are original generated interface assets for this theme run.',
    usageRule: 'Codex must use stock photos for photographic/hero/portfolio/menu imagery and SVG only for interface marks, icons, and small UI details.',
    assets
  };
  writeJson(path.join(themeDir, SEEDED_ASSET_MANIFEST), manifest);
}

function pruneCopiedIllustrationSvgs(themeDir) {
  for (const relDir of ['assets/images/hero', 'assets/images/portfolio', 'assets/images/texture']) {
    const dir = path.join(themeDir, relDir);
    if (!fs.existsSync(dir)) {
      continue;
    }
    for (const entry of fs.readdirSync(dir)) {
      if (entry.endsWith('.svg')) {
        fs.rmSync(path.join(dir, entry), { force: true });
      }
    }
  }
}

function seedLandscapingThemeJson(themeDir) {
  const themeJsonPath = path.join(themeDir, 'theme.json');
  if (!fs.existsSync(themeJsonPath)) {
    return;
  }
  const themeJson = readJson(themeJsonPath);
  themeJson.settings = themeJson.settings || {};
  themeJson.settings.color = themeJson.settings.color || {};
  themeJson.settings.color.palette = [
    { slug: 'evergreen', color: '#2f6b3f', name: 'Evergreen' },
    { slug: 'deep-evergreen', color: '#14251b', name: 'Deep Evergreen' },
    { slug: 'moss', color: '#6f8f3d', name: 'Moss' },
    { slug: 'seasonal-gold', color: '#d99a2b', name: 'Seasonal Gold' },
    { slug: 'warm-surface', color: '#f5f1e8', name: 'Warm Surface' },
    { slug: 'soft-outdoor', color: '#eef6e8', name: 'Soft Outdoor' },
    { slug: 'yard-text', color: '#172119', name: 'Yard Text' }
  ];
  writeJson(themeJsonPath, themeJson);
}

function seededAssetCatalog(themeSlug, brand) {
  if (isLandscapingTheme(themeSlug)) {
    return landscapingStockAssets(brand);
  }
  return softwareAgencyStockAssets(brand);
}

function isLandscapingTheme(themeSlug) {
  return /(lawn|landscap|garden|yard|grounds|turf)/i.test(themeSlug);
}

function landscapingStockAssets(brand) {
  return [
    {
      path: 'assets/images/hero/curb-appeal-lawn.jpg',
      kind: 'stock-photo',
      role: 'homepage hero photo for a professionally maintained residential lawn and landscape',
      alt: `${brand} freshly maintained residential lawn and planting beds`,
      sourceUrl: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1800&q=82',
      pageUrl: 'https://unsplash.com/photos/photo-1558904541-efa843a96f01'
    },
    {
      path: 'assets/images/hero/garden-crew-hands.jpg',
      kind: 'stock-photo',
      role: 'header dropdown and process photo for hands-on planting and garden care',
      alt: `${brand} landscape crew hands planting and improving garden beds`,
      sourceUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=82',
      pageUrl: 'https://unsplash.com/photos/photo-1416879595882-3373a0480b5b'
    },
    {
      path: 'assets/images/portfolio/landscape-install.jpg',
      kind: 'stock-photo',
      role: 'portfolio photo for landscape installation, lawn renovation, and outdoor living upgrades',
      alt: `${brand} landscape installation with healthy planting and outdoor detail`,
      sourceUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=82',
      pageUrl: 'https://unsplash.com/photos/photo-1625246333195-78d9c38ad449'
    },
    {
      path: 'assets/images/portfolio/lawn-maintenance.jpg',
      kind: 'stock-photo',
      role: 'services photo for recurring mowing, edging, trimming, and seasonal lawn maintenance',
      alt: `${brand} lawn maintenance crew work and fresh turf detail`,
      sourceUrl: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=1600&q=82',
      pageUrl: 'https://unsplash.com/photos/photo-1598902108854-10e335adac99'
    },
    {
      path: 'assets/images/portfolio/seasonal-planting.jpg',
      kind: 'stock-photo',
      role: 'seasonal color, garden bed refresh, mulching, pruning, and planting services photo',
      alt: `${brand} seasonal planting and garden bed care`,
      sourceUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=1600&q=82',
      pageUrl: 'https://unsplash.com/photos/photo-1591857177580-dc82b9ac4e1e'
    },
    {
      path: 'assets/images/texture/meadow-texture.jpg',
      kind: 'stock-photo',
      role: 'subtle grass and meadow texture photo for background crops and service bands',
      alt: '',
      sourceUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
      pageUrl: 'https://unsplash.com/photos/photo-1500382017468-9049fed747ef'
    },
    {
      path: 'assets/icons/platform-mark.svg',
      kind: 'local-svg-icon',
      role: 'original local leaf, path, and service-route interface mark',
      alt: `${brand} leaf and landscape route mark`
    },
    {
      path: 'assets/icons/icon1.svg',
      kind: 'local-svg-icon',
      role: 'original local fallback icon matching this landscaping brand',
      alt: `${brand} fallback service mark`
    }
  ];
}

function softwareAgencyStockAssets(brand) {
  return [
    {
      path: 'assets/images/hero/agency-workspace.jpg',
      kind: 'stock-photo',
      role: 'homepage hero photo for a premium WordPress and Shopify agency workspace',
      alt: `${brand} strategy workspace with laptops and planning material`,
      sourceUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=82',
      pageUrl: 'https://unsplash.com/photos/photo-1497366754035-f200968a6e72'
    },
    {
      path: 'assets/images/hero/developer-screens.jpg',
      kind: 'stock-photo',
      role: 'header dropdown and services photo for software development screens',
      alt: `${brand} developer screens and code workspace`,
      sourceUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=82',
      pageUrl: 'https://unsplash.com/photos/photo-1498050108023-c5249f4df085'
    },
    {
      path: 'assets/images/portfolio/ecommerce-planning.jpg',
      kind: 'stock-photo',
      role: 'Shopify and ecommerce planning case-study photo',
      alt: `${brand} ecommerce planning and analytics workspace`,
      sourceUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=82',
      pageUrl: 'https://unsplash.com/photos/photo-1460925895917-afdab827c52f'
    },
    {
      path: 'assets/images/portfolio/team-collaboration.jpg',
      kind: 'stock-photo',
      role: 'about and process photo for collaborative agency work',
      alt: `${brand} team collaboration around a digital project`,
      sourceUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=82',
      pageUrl: 'https://unsplash.com/photos/photo-1522071820081-009f0129c71c'
    },
    {
      path: 'assets/images/portfolio/performance-review.jpg',
      kind: 'stock-photo',
      role: 'WordPress performance and analytics case-study photo',
      alt: `${brand} performance review and analytics dashboard`,
      sourceUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=82',
      pageUrl: 'https://unsplash.com/photos/photo-1551288049-bebda4e38f71'
    },
    {
      path: 'assets/images/texture/studio-detail.jpg',
      kind: 'stock-photo',
      role: 'subtle editorial texture photo for background crops',
      alt: '',
      sourceUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
      pageUrl: 'https://unsplash.com/photos/photo-1516321318423-f06f85e504b3'
    },
    {
      path: 'assets/icons/platform-mark.svg',
      kind: 'local-svg-icon',
      role: 'original local brand/interface mark',
      alt: `${brand} platform mark`
    },
    {
      path: 'assets/icons/icon1.svg',
      kind: 'local-svg-icon',
      role: 'original local fallback icon matching this run brand',
      alt: `${brand} fallback mark`
    }
  ];
}

function downloadStockPhoto(sourceUrl, target) {
  if (fs.existsSync(target) && fs.statSync(target).size > 1024) {
    return;
  }
  const result = spawnSync('curl', ['-L', '--silent', '--show-error', '--fail', sourceUrl, '-o', target], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20
  });
  assertStatus(result, `download stock photo ${sourceUrl}`);
  if (!fs.existsSync(target) || fs.statSync(target).size < 1024) {
    throw new Error(`Downloaded stock photo is unexpectedly small: ${relative(target)}`);
  }
}

function readSeededAssetInventory(themeDir) {
  const manifestPath = path.join(themeDir, SEEDED_ASSET_MANIFEST);
  if (!fs.existsSync(manifestPath)) {
    return '';
  }
  const manifest = readJson(manifestPath);
  return [
    `Manifest: ${SEEDED_ASSET_MANIFEST}`,
    ...manifest.assets.map((asset) => `- ${asset.path} (${asset.kind}): ${asset.role}; alt="${asset.alt}"`)
  ].join('\n');
}

function paletteForSlug(slug) {
  const seed = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const hue = seed % 360;
  return {
    dark: hsl(hue, 42, 10),
    mid: hsl((hue + 38) % 360, 72, 36),
    bright: hsl((hue + 92) % 360, 88, 58),
    accent: hsl((hue + 168) % 360, 80, 62),
    pale: hsl((hue + 210) % 360, 82, 86)
  };
}

function landscapingPalette() {
  return {
    dark: '#14251b',
    mid: '#2f6b3f',
    bright: '#6f8f3d',
    accent: '#d99a2b',
    pale: '#eef6e8'
  };
}

function hsl(h, s, l) {
  return `hsl(${h} ${s}% ${l}%)`;
}

function createIconSvg(label, palette) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" role="img" aria-label="${escapeHtml(label)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.dark}"/>
      <stop offset=".52" stop-color="${palette.mid}"/>
      <stop offset="1" stop-color="${palette.bright}"/>
    </linearGradient>
  </defs>
  <rect width="96" height="96" rx="24" fill="url(#g)"/>
  <path d="M24 56 42 28l12 19 9-13 13 22" fill="none" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="32" cy="30" r="7" fill="${palette.accent}"/>
  <path d="M21 70h54" stroke="rgba(255,255,255,.72)" stroke-width="6" stroke-linecap="round"/>
</svg>
`;
}

function createLandscapingIconSvg(label, palette) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" role="img" aria-label="${escapeHtml(label)}">
  <rect width="96" height="96" rx="22" fill="${palette.dark}"/>
  <path d="M23 68c20-1 35-8 49-28" fill="none" stroke="${palette.pale}" stroke-width="7" stroke-linecap="round"/>
  <path d="M28 58c-1-20 13-34 34-34 3 20-8 37-29 40-3 0-5-2-5-6Z" fill="${palette.bright}"/>
  <path d="M33 57c8-10 18-18 29-25" fill="none" stroke="${palette.dark}" stroke-width="4" stroke-linecap="round" opacity=".45"/>
  <path d="M21 74h54" stroke="${palette.accent}" stroke-width="6" stroke-linecap="round"/>
  <path d="M25 42h13M21 51h14M58 70h17" stroke="${palette.pale}" stroke-width="5" stroke-linecap="round" opacity=".82"/>
</svg>
`;
}

function runCodexGeneration(themeDir, options, reportDir) {
  const prompt = buildCodexPrompt(options.promptPath, path.basename(themeDir), themeDir);
  const command = [
    'exec',
    '--cd', themeDir,
    '--sandbox', 'workspace-write',
    '--ephemeral'
  ];
  if (options.codexModel) {
    command.push('--model', options.codexModel);
  }
  if (options.codexReasoning) {
    command.push('-c', `model_reasoning_effort="${options.codexReasoning}"`);
  }
  command.push(...options.codexExtraArgs);
  command.push('-');

  const before = statusPaths();
  const result = spawnSync(options.codexExecutable || 'codex', command, {
    cwd: themeDir,
    input: prompt,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 100
  });
  const afterCodex = statusPaths();
  assertOnlyAllowedStatusChanges(before, afterCodex, [
    relative(themeDir)
  ]);
  fs.writeFileSync(path.join(reportDir, 'codex.log'), [
    `$ ${(options.codexExecutable || 'codex')} ${command.join(' ')}`,
    '',
    result.stdout || '',
    result.stderr || ''
  ].join('\n'));
  assertStatus(result, 'codex generation');
}

function buildCodexPrompt(promptPath, themeSlug, themeDir) {
  const userPrompt = fs.readFileSync(promptPath, 'utf8');
  const assetInventory = readSeededAssetInventory(themeDir);
  return [
    'You are generating exactly one WordPress theme pass for the Nolan Young Theme Factory.',
    '',
    `Prepared theme slug: ${themeSlug}`,
    'You are already running from the prepared theme directory.',
    '',
    'Hard rules:',
    '- Edit only files inside the current prepared theme directory.',
    '- Do not create previews, ZIPs, reports, branches, commits, or files outside this directory.',
    '- Do not copy templates or rename the prepared theme folder.',
    '- Do not run a repair pass after validation; this is the only Codex generation pass.',
    '- Keep build commands in package.json and preserve npm run build.',
    '- Keep generated runtime assets local to this theme.',
    '- Preserve prepared Theme Name, Description, Text Domain, slug, and package name unless the prepared fields are missing.',
    '- This must be a major visual transformation of the copied template, not a light content swap.',
    '- Redesign the header architecture, homepage rhythm, page compositions, motion system, and visual language so the preview is clearly distinct from prior numbered themes.',
    '- Treat the homepage as a complete design pass: every homepage template part must be edited, reordered or redesigned so the sections flow as one polished agency website.',
    '- The homepage first viewport must look professionally composed at desktop and mobile widths: no cropped hero text, no oversized headline that pushes the primary image or calls to action out of view, and no large empty dead zones.',
    '- Keep hero display type controlled and readable. Do not use extreme viewport-scaled headline sizing; the full H1, supporting copy, CTAs, and a meaningful stock-photo crop should fit coherently in the opening viewport.',
    '- At 390px mobile width there must be no horizontal overflow: the header status strip, logo row, H1, supporting copy, CTAs, chips, notes, and hero image must fit within the viewport. Use constrained mobile font clamps, max-width: 100%, min-width: 0, wrapping, stacked buttons, and overflow-wrap where needed.',
    '- For mobile hero CSS, explicitly override desktop sizing. Do not leave h1 max-width, vw font sizes, flex rows, or white-space behavior that can push text or controls off the right edge.',
    '- Fully personalize and redesign the footer; do not leave generic copied footer widgets, newsletter copy, service links, legal rows, or brand paragraphs.',
    '- At 390px mobile width the footer must also fit inside the viewport. Stack footer widgets to one column, remove mobile grid-column spans, wrap email/contact links, and avoid nowrap or min-width values that make footer nav/contact columns overflow.',
    '- Use the seeded stock photos listed below for visible hero, service, work, process, about, and header-dropdown imagery. These are real stock photos, not filler generated graphics.',
    '- Use SVG only for interface marks, hamburger/menu icons, small UI icons, decorative marks, and lightweight diagrams; do not use SVG as the primary hero/portfolio placeholder imagery.',
    '- Make header dropdown panel content, right-side dropdown copy, dropdown images, and mobile drawer content match the business and services described in the user prompt.',
    '- Add accessible animation and interaction through src/js/main.js and SCSS, respecting reduced-motion preferences.',
    '- Replace every old copied-theme business name, including Northstar Websites, Nolan Designs, and any prior numbered-theme identity in PHP, markdown, SVG, alt text, form email subjects, and page copy.',
    '- Do not leave old copied-theme content in unused template parts, fallback pages, docs, icon READMEs, forms, or accessibility docs.',
    '- Before finishing, inspect the entire current theme for stale copied identity strings and remove them from every source/documentation file inside this theme.',
    '- The generated theme will fail validation if any stale copied identity string remains.',
    '- Complete the conversion across the whole theme source, not just the visible homepage. Update fallback pages, README, CHANGELOG, accessibility docs, icon docs, customization docs, footer widgets, form email subjects, helpers, page templates, template parts, SCSS variables, and compiled CSS so they all match the new business.',
    '- Do not leave old default-template color tokens such as #2563eb, #1d4ed8, #14b8a6, or #f97316 in SCSS, CSS, SVG, or inline styles when the brief provides a different palette.',
    '- Run npm run build after editing SCSS or JS so assets/css/bundle.css and assets/js/bundle.js reflect the generated source.',
    '- Reference the seeded photo inventory broadly in source templates and helper data; using only one seeded asset is insufficient for a complete theme transformation.',
    '- As a final self-audit before exiting, search the current theme directory for stale brand names, old software-agency phrases, old default palette colors, and unused copied SVG illustration names. Fix any matches inside this prepared theme directory.',
    '',
    'Seeded local stock-photo and icon inventory:',
    assetInventory || '- No seeded asset inventory was found; create original local SVG icons only and avoid fake photo provenance.',
    '',
    'User creative brief:',
    userPrompt
  ].join('\n');
}

function runOllamaGeneration(themeDir, options, reportDir) {
  const prompt = fs.readFileSync(options.promptPath, 'utf8');
  const promptHeadings = collectMarkdownHeadings(prompt);
  const plan = validateOllamaPlan(promptHeadings);
  writeJson(path.join(reportDir, 'ollama-stage-plan.json'), plan);

  for (const stage of OLLAMA_STAGES) {
    const stagePrompt = buildOllamaStagePrompt(prompt, themeDir, stage);
    const result = spawnSync(options.ollamaExecutable || 'ollama', ['run', options.ollamaModel], {
      cwd: themeDir,
      input: stagePrompt,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 100
    });
    fs.writeFileSync(path.join(reportDir, `ollama-${stage.id}.log`), [
      `$ ${(options.ollamaExecutable || 'ollama')} run ${options.ollamaModel}`,
      '',
      result.stdout || '',
      result.stderr || ''
    ].join('\n'));
    assertStatus(result, `ollama stage ${stage.id}`);
    applyFileBlocks(themeDir, result.stdout || '', stage.allow, stage.id);
  }
}

function buildOllamaStagePrompt(prompt, themeDir, stage) {
  const context = listThemeContext(themeDir);
  return [
    `You are running planned Ollama stage "${stage.id}" for a prepared WordPress theme.`,
    '',
    `Prompt-section ownership: ${stage.promptSections.join(', ')}`,
    '',
    'Allowed file paths for this stage:',
    ...stage.allow.map((item) => `- ${item}`),
    '',
    'Return only complete file blocks using this exact protocol:',
    '---FILE: relative/path/from/theme/root.php---',
    'complete file content',
    '---END FILE---',
    '',
    'Do not describe changes outside file blocks.',
    'Do not emit partial files.',
    'Do not write outside the allowed path list.',
    'Do not create previews, ZIPs, reports, scripts, docs, or repo files.',
    '',
    'Current theme file inventory:',
    context,
    '',
    'Production prompt:',
    prompt
  ].join('\n');
}

function validateOllamaPlan(promptHeadings) {
  const normalizedHeadings = promptHeadings.map(normalizeHeading);
  return OLLAMA_STAGES.map((stage) => {
    const matchedSections = stage.promptSections.filter((section) => {
      const normalized = normalizeHeading(section);
      return normalizedHeadings.some((heading) => heading.includes(normalized) || normalized.includes(heading));
    });
    if (!matchedSections.length) {
      throw new Error(`Ollama stage "${stage.id}" has no matching production prompt coverage. Expected one of: ${stage.promptSections.join(', ')}`);
    }
    return {
      id: stage.id,
      promptSections: stage.promptSections,
      matchedSections,
      allow: stage.allow
    };
  });
}

function applyFileBlocks(themeDir, output, allow, stageId) {
  const blocks = parseFileBlocks(output);
  if (!blocks.length) {
    throw new Error(`Ollama stage "${stageId}" returned no valid file blocks.`);
  }
  const candidateDir = fs.mkdtempSync(path.join(os.tmpdir(), `theme-stage-${stageId}-`));
  fs.cpSync(themeDir, candidateDir, { recursive: true });

  try {
    for (const block of blocks) {
      const relPath = normalizeRelativeFile(block.path);
      if (!matchesAllowList(relPath, allow)) {
        throw new Error(`Ollama stage "${stageId}" attempted to write disallowed file: ${relPath}`);
      }
      const target = path.join(candidateDir, relPath);
      ensureInside(candidateDir, target);
      ensureDir(path.dirname(target));
      fs.writeFileSync(target, block.content.replace(/\r\n/g, '\n'));
    }
    removeIfExists(themeDir);
    fs.cpSync(candidateDir, themeDir, { recursive: true });
  } finally {
    removeIfExists(candidateDir);
  }
}

function parseFileBlocks(output) {
  const blocks = [];
  const re = /^---FILE:\s*(.+?)\s*---\s*\r?\n([\s\S]*?)\r?\n---END FILE---/gm;
  let match;
  while ((match = re.exec(output)) !== null) {
    blocks.push({ path: match[1].trim(), content: match[2] });
  }
  return blocks;
}

function buildTheme(themeSlug) {
  const themeDir = existingThemeDir(themeSlug);
  const pkgPath = path.join(themeDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    throw new Error(`Missing theme package.json: ${relative(pkgPath)}`);
  }

  const hasNodeModules = fs.existsSync(path.join(themeDir, 'node_modules'));
  const installCommand = fs.existsSync(path.join(themeDir, 'package-lock.json')) ? ['ci'] : ['install'];
  if (!hasNodeModules) {
    console.log(`Installing theme dependencies in ${relative(themeDir)}...`);
    assertStatus(spawnSync('npm', installCommand, { cwd: themeDir, encoding: 'utf8', maxBuffer: 1024 * 1024 * 100 }), `npm ${installCommand.join(' ')}`);
  }

  console.log(`Building theme ${themeSlug}...`);
  assertStatus(spawnSync('npm', ['run', 'build'], { cwd: themeDir, encoding: 'utf8', maxBuffer: 1024 * 1024 * 100 }), 'npm run build');
}

function validateSource(themeSlug, options = {}) {
  const writeReport = options.writeReport !== false;
  const themeDir = existingThemeDir(themeSlug);
  const errors = [];
  const warnings = [];

  for (const relPath of REQUIRED_THEME_FILES) {
    const file = path.join(themeDir, relPath);
    if (!fs.existsSync(file)) {
      errors.push(`Missing required file: ${relPath}`);
    } else if (fs.statSync(file).isFile() && fs.statSync(file).size === 0) {
      errors.push(`Required file is empty: ${relPath}`);
    }
  }

  const phpFiles = walk(themeDir).filter((file) => file.endsWith('.php'));
  for (const file of phpFiles) {
    const result = spawnSync('php', ['-l', file], { cwd: ROOT, encoding: 'utf8' });
    if (result.status !== 0) {
      errors.push(`PHP lint failed for ${relative(file)}: ${(result.stderr || result.stdout || '').trim()}`);
    }
  }

  for (const file of phpFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (/<style[\s>]/i.test(content)) {
      errors.push(`Inline <style> block found in PHP template: ${relativeTo(themeDir, file)}`);
    }
    if (/\bupload_mimes\b|image\/svg\+xml|\bsvg\s*=>|svg upload/i.test(content)) {
      errors.push(`Potential global SVG upload enablement found in PHP: ${relativeTo(themeDir, file)}`);
    }
  }

  const packagePath = path.join(themeDir, 'package.json');
  if (fs.existsSync(packagePath)) {
    try {
      const pkg = readJson(packagePath);
      if (!pkg.scripts || !pkg.scripts.build) {
        errors.push('Theme package.json is missing scripts.build.');
      }
      if (!pkg.scripts || !pkg.scripts.dev) {
        warnings.push('Theme package.json is missing scripts.dev.');
      }
    } catch (error) {
      errors.push(`Theme package.json is invalid: ${error.message}`);
    }
  }

  const style = path.join(themeDir, 'style.css');
  if (fs.existsSync(style)) {
    const styleContent = fs.readFileSync(style, 'utf8');
    for (const field of ['Theme Name', 'Description', 'Text Domain']) {
      if (!new RegExp(`^${escapeRegExp(field)}:\\s*\\S`, 'm').test(styleContent)) {
        errors.push(`style.css missing ${field}.`);
      }
    }
  }

  errors.push(...validateStaleBrandResidue(themeDir));
  errors.push(...validateSeededAssetContract(themeDir));
  errors.push(...validateDomainAssetResidue(themeDir));
  warnings.push(...validateDesignDifferentiation(themeDir));

  if (writeReport) {
    writeValidation(themeSlug, 'source', errors, warnings);
  }
  return { errors, warnings };
}

function validateDomainAssetResidue(themeDir) {
  const manifestPath = path.join(themeDir, SEEDED_ASSET_MANIFEST);
  if (!fs.existsSync(manifestPath)) {
    return [];
  }
  const manifest = readJson(manifestPath);
  if (!isLandscapingTheme(manifest.themeSlug || path.basename(themeDir))) {
    return [];
  }
  const errors = [];
  const forbidden = [
    '#2563eb',
    '#1d4ed8',
    '#14b8a6',
    '#f97316',
    'Northstar Websites',
    'Nolan Designs',
    'Northstar Codeworks',
    'Brightlane Commerce Engineering',
    'Circuit Commerce Studio',
    'Stackforge Commerce Labs'
  ];
  for (const file of walk(themeDir)) {
    const rel = relativeTo(themeDir, file);
    if (rel.startsWith('node_modules/') || /\.(png|jpg|jpeg|webp|gif|zip|lock)$/i.test(rel)) {
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');
    for (const phrase of forbidden) {
      if (content.includes(phrase)) {
        errors.push(`Landscaping theme contains copied software-theme residue "${phrase}" in ${rel}.`);
      }
    }
  }
  return errors;
}

function validateStaleBrandResidue(themeDir) {
  const manifestPath = path.join(themeDir, SEEDED_ASSET_MANIFEST);
  if (!fs.existsSync(manifestPath)) {
    return [];
  }
  const currentBrand = String(readJson(manifestPath).assets?.find((asset) => asset.alt)?.alt || '');
  const forbidden = [
    'Northstar Websites',
    'Nolan Designs',
    'Northstar Codeworks',
    'Circuit Commerce Studio',
    'Stackforge Commerce Labs',
    'Brightlane Commerce Engineering'
  ].filter((phrase) => !currentBrand.includes(phrase));
  const errors = [];
  for (const file of walk(themeDir)) {
    const rel = relativeTo(themeDir, file);
    if (rel.startsWith('node_modules/') || /\.(png|jpg|jpeg|webp|gif|zip|lock)$/i.test(rel)) {
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');
    for (const phrase of forbidden) {
      if (content.includes(phrase)) {
        errors.push(`Stale copied-theme identity "${phrase}" found in ${rel}.`);
      }
    }
  }
  return errors;
}

function validateDesignDifferentiation(themeDir) {
  const warnings = [];
  const manifestPath = path.join(themeDir, SEEDED_ASSET_MANIFEST);
  if (!fs.existsSync(manifestPath)) {
    return warnings;
  }

  const manifest = readJson(manifestPath);
  const relevantFiles = walk(themeDir)
    .filter((file) => /\.(php|scss|css|js|md)$/i.test(file))
    .filter((file) => !relativeTo(themeDir, file).startsWith('node_modules/'));
  const joined = relevantFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  const referenced = manifest.assets.filter((asset) => joined.includes(asset.path) || joined.includes(path.basename(asset.path)));
  if (referenced.length < Math.min(4, manifest.assets.length)) {
    warnings.push(`Seeded assets appear underused: ${referenced.length}/${manifest.assets.length} referenced in generated source.`);
  }

  const headerPath = path.join(themeDir, 'header.php');
  const defaultHeaderPath = path.join(DEFAULT_TEMPLATE_DIR, 'header.php');
  if (fs.existsSync(headerPath) && fs.existsSync(defaultHeaderPath)) {
    const current = normalizeForComparison(fs.readFileSync(headerPath, 'utf8'));
    const base = normalizeForComparison(fs.readFileSync(defaultHeaderPath, 'utf8'));
    if (current === base) {
      warnings.push('Header appears unchanged from the default template.');
    }
  }

  const motionFiles = ['src/js/main.js', 'src/scss/main.scss', 'assets/js/bundle.js', 'assets/css/bundle.css']
    .map((file) => path.join(themeDir, file))
    .filter((file) => fs.existsSync(file))
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('\n');
  if (!/(IntersectionObserver|requestAnimationFrame|data-animate|prefers-reduced-motion|@keyframes|transition|transform)/i.test(motionFiles)) {
    warnings.push('No strong animation or interaction signal found in JS/CSS.');
  }
  return warnings;
}

function validateSeededAssetContract(themeDir) {
  const manifestPath = path.join(themeDir, SEEDED_ASSET_MANIFEST);
  if (!fs.existsSync(manifestPath)) {
    return [];
  }
  const manifest = readJson(manifestPath);
  const errors = [];
  const stockAssets = manifest.assets.filter((asset) => asset.kind === 'stock-photo');
  const generatedBitmaps = manifest.assets.filter((asset) => /generated-bitmap|placeholder/i.test(asset.kind || asset.role || ''));
  if (generatedBitmaps.length) {
    errors.push(`Generated bitmap placeholders are not allowed for photo roles: ${generatedBitmaps.map((asset) => asset.path).join(', ')}`);
  }
  for (const asset of stockAssets) {
    const file = path.join(themeDir, asset.path);
    if (!fs.existsSync(file) || fs.statSync(file).size < 1024) {
      errors.push(`Missing or invalid seeded stock photo: ${asset.path}`);
    }
    if (!asset.sourceUrl || !asset.pageUrl || !/Unsplash/i.test(manifest.license || '')) {
      errors.push(`Seeded stock photo lacks Unsplash provenance: ${asset.path}`);
    }
  }
  const relevantText = walk(themeDir)
    .filter((file) => /\.(php|scss|css|js|md|json)$/i.test(file))
    .filter((file) => !relativeTo(themeDir, file).startsWith('node_modules/'))
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('\n');
  const referencedStock = stockAssets.filter((asset) => relevantText.includes(asset.path) || relevantText.includes(path.basename(asset.path)));
  if (stockAssets.length && referencedStock.length < Math.min(4, stockAssets.length)) {
    errors.push(`Seeded stock photos are underused: ${referencedStock.length}/${stockAssets.length} referenced in generated source.`);
  }
  return errors;
}

function normalizeForComparison(value) {
  return value.replace(/\s+/g, ' ')
    .replace(/nolan[-_\s]+young[-_\s]+theme[-_\s]+[a-z0-9_-]+/gi, 'nolan-young-theme')
    .trim();
}

function validateArtifacts(themeSlug) {
  const errors = [];
  const warnings = [];
  const previewDir = path.join(PREVIEWS_DIR, themeSlug);
  const zipPath = path.join(ZIPS_DIR, `${themeSlug}.zip`);

  for (const [htmlName] of PREVIEW_PAGES) {
    const file = path.join(previewDir, htmlName);
    if (!fs.existsSync(file)) {
      errors.push(`Missing preview page: ${relative(file)}`);
    } else if (fs.statSync(file).size === 0) {
      errors.push(`Preview page is empty: ${relative(file)}`);
    }
  }

  const galleryPath = path.join(ROOT, 'docs', 'index.html');
  if (!fs.existsSync(galleryPath)) {
    errors.push('Missing docs/index.html.');
  } else if (!fs.readFileSync(galleryPath, 'utf8').includes(`Preview-Themes-Github/${themeSlug}/`)) {
    errors.push(`docs/index.html does not link to ${themeSlug}.`);
  }

  const mobileProbe = probeMobilePreviewLayout(path.join(previewDir, 'homepage_preview.html'));
  errors.push(...mobileProbe.errors);
  warnings.push(...mobileProbe.warnings);

  if (!fs.existsSync(zipPath)) {
    errors.push(`Missing ZIP: ${relative(zipPath)}`);
  } else {
    const entries = listZipEntries(zipPath);
    if (!entries.length) {
      errors.push(`Could not inspect ZIP or ZIP is empty: ${relative(zipPath)}`);
    } else if (!entries.includes(`${themeSlug}/style.css`)) {
      errors.push(`ZIP does not contain ${themeSlug}/style.css.`);
    }
    const forbiddenEntries = entries.filter((entry) => zipEntryHasExcludedDir(entry));
    if (forbiddenEntries.length) {
      errors.push(`ZIP contains non-production directories: ${[...new Set(forbiddenEntries.map((entry) => entry.split('/').slice(0, 2).join('/')))].join(', ')}`);
    }
  }

  writeValidation(themeSlug, 'artifact', errors, warnings);
  return { errors, warnings };
}

function probeMobilePreviewLayout(previewPath) {
  const errors = [];
  const warnings = [];
  if (!fs.existsSync(previewPath)) {
    return { errors, warnings };
  }

  const chromePath = findChromeExecutable();
  if (!chromePath) {
    warnings.push('Skipped mobile preview layout probe because Chrome was not found.');
    return { errors, warnings };
  }

  const probeScript = `
const { spawn } = require('child_process');
const http = require('http');
const chromePath = process.env.CHROME_PATH;
const previewUrl = process.env.PREVIEW_URL;
const port = Number(process.env.CDP_PORT || 0);
const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=' + port,
  '--user-data-dir=' + process.env.USER_DATA_DIR,
  'about:blank'
], { stdio: 'ignore' });
function getJson(pathname) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path: pathname }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (error) { reject(error); }
      });
    }).on('error', reject);
  });
}
function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
(async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const page = (await getJson('/json')).find((entry) => entry.type === 'page');
      if (page) {
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        let id = 0;
        const pending = new Map();
        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.id && pending.has(message.id)) {
            pending.get(message.id)(message);
            pending.delete(message.id);
          }
        };
        await new Promise((resolve) => { ws.onopen = resolve; });
        const send = (method, params = {}) => new Promise((resolve) => {
          const messageId = ++id;
          pending.set(messageId, resolve);
          ws.send(JSON.stringify({ id: messageId, method, params }));
        });
        await send('Page.enable');
        await send('Runtime.enable');
        await send('Emulation.setDeviceMetricsOverride', {
          width: 390,
          height: 844,
          deviceScaleFactor: 1,
          mobile: true
        });
        await send('Page.navigate', { url: previewUrl });
        await wait(1600);
        const expression = String.raw\`(() => {
          const targetWidth = 390;
          const hidden = (el) => el.closest('.form-honeypot,.honeypot,.visually-hidden-field,.screen-reader-text,[hidden]');
          const overflowNodes = [...document.body.querySelectorAll('*')]
            .filter((el) => !hidden(el))
            .map((el) => {
              const rect = el.getBoundingClientRect();
              return {
                tag: el.tagName,
                className: String(el.className || ''),
                text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 90),
                left: rect.left,
                right: rect.right,
                top: rect.top,
                width: rect.width,
                height: rect.height
              };
            })
            .filter((item) => item.width > 1 && item.height > 1 && (item.left < -1 || item.right > targetWidth + 1))
            .sort((a, b) => b.right - a.right)
            .slice(0, 8);
          const h1 = document.querySelector('.hero h1');
          const image = document.querySelector('.hero img');
          const buttons = [...document.querySelectorAll('.hero .btn')].map((el) => {
            const rect = el.getBoundingClientRect();
            return { text: el.textContent.trim(), left: rect.left, right: rect.right };
          });
          return {
            targetWidth,
            documentScrollWidth: document.documentElement.scrollWidth,
            bodyScrollWidth: document.body.scrollWidth,
            overflowNodes,
            h1: h1 ? h1.getBoundingClientRect().toJSON() : null,
            heroImageTop: image ? image.getBoundingClientRect().top : null,
            buttons
          };
        })()\`;
        const result = await send('Runtime.evaluate', { expression, returnByValue: true });
        console.log(JSON.stringify(result.result.result.value));
        ws.close();
        chrome.kill('SIGTERM');
        return;
      }
    } catch (error) {}
    await wait(250);
  }
  throw new Error('Could not connect to Chrome DevTools.');
})().catch((error) => {
  console.error(error.stack || String(error));
  chrome.kill('SIGTERM');
  process.exit(1);
});
`;

  const port = 9400 + Math.floor(Math.random() * 300);
  const result = spawnSync(process.execPath, ['-e', probeScript], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 10,
    env: {
      ...process.env,
      CHROME_PATH: chromePath,
      PREVIEW_URL: pathToFileUrl(previewPath),
      CDP_PORT: String(port),
      USER_DATA_DIR: path.join(os.tmpdir(), `theme-mobile-probe-${process.pid}-${Date.now()}`)
    }
  });

  if (result.status !== 0) {
    warnings.push(`Skipped mobile preview layout probe because Chrome execution failed: ${(result.stderr || result.stdout).trim().split('\n').pop() || 'unknown error'}`);
    return { errors, warnings };
  }

  let probe;
  try {
    probe = JSON.parse((result.stdout || '').trim().split('\n').pop());
  } catch (error) {
    warnings.push('Skipped mobile preview layout probe because Chrome returned unreadable output.');
    return { errors, warnings };
  }

  if (probe.overflowNodes && probe.overflowNodes.length) {
    const offenders = probe.overflowNodes.map((item) => `${item.tag}${item.className ? `.${item.className}` : ''} "${item.text}"`).join('; ');
    errors.push(`Mobile preview has horizontal overflow at 390px: ${offenders}`);
  }
  if (!probe.h1 || probe.h1.left < -1 || probe.h1.right > 391) {
    errors.push('Mobile preview hero H1 is clipped or outside the 390px viewport.');
  }
  const badButtons = (probe.buttons || []).filter((button) => button.left < -1 || button.right > 391);
  if (badButtons.length) {
    errors.push(`Mobile preview hero CTA is clipped at 390px: ${badButtons.map((button) => button.text).join(', ')}`);
  }
  if (typeof probe.heroImageTop === 'number' && probe.heroImageTop > 844) {
    errors.push('Mobile preview hero image does not begin within the first 390x844 viewport.');
  }

  return { errors, warnings };
}

function findChromeExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function pathToFileUrl(filePath) {
  return `file://${path.resolve(filePath).split(path.sep).map(encodeURIComponent).join('/')}`;
}

function validateSourceOrThrow(themeSlug, options = {}) {
  const result = validateSource(themeSlug, options);
  if (result.errors.length) {
    throw new Error(`Source validation failed:\n${result.errors.map((item) => `- ${item}`).join('\n')}`);
  }
}

function validateArtifactsOrThrow(themeSlug) {
  const result = validateArtifacts(themeSlug);
  if (result.errors.length) {
    throw new Error(`Artifact validation failed:\n${result.errors.map((item) => `- ${item}`).join('\n')}`);
  }
}

function writeValidation(themeSlug, phase, errors, warnings) {
  const reportDir = ensureReportDir(themeSlug);
  writeJson(path.join(reportDir, `${phase}-validation.json`), {
    phase,
    themeSlug,
    errors,
    warnings,
    checkedAt: new Date().toISOString()
  });
}

function printValidation(label, result) {
  for (const warning of result.warnings) {
    console.log(`WARN ${label}: ${warning}`);
  }
  for (const error of result.errors) {
    console.log(`FAIL ${label}: ${error}`);
  }
  if (!result.errors.length) {
    console.log(`PASS ${label}`);
  }
}

function generatePreview(themeSlug) {
  const themeDir = existingThemeDir(themeSlug);
  const candidate = path.join(PREVIEWS_DIR, `.candidate-${themeSlug}-${process.pid}`);
  const target = path.join(PREVIEWS_DIR, themeSlug);
  removeIfExists(candidate);
  ensureDir(candidate);

  try {
    copyIfExists(path.join(themeDir, 'assets'), path.join(candidate, 'assets'));
    copyIfExists(path.join(themeDir, 'style.css'), path.join(candidate, 'style.css'));
    fs.writeFileSync(path.join(candidate, 'README.md'), `# ${themeSlug}\n\nStatic preview generated from theme source.\n`);
    for (const [htmlName, templateRel] of PREVIEW_PAGES) {
      const html = renderTemplate(themeDir, templateRel);
      fs.writeFileSync(path.join(candidate, htmlName), html);
    }
    removeIfExists(target);
    fs.renameSync(candidate, target);
  } catch (error) {
    removeIfExists(candidate);
    throw error;
  }
  console.log(`Preview generated: ${relative(target)}`);
}

function renderTemplate(themeDir, templateRel) {
  const templatePath = path.join(themeDir, templateRel);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Cannot render missing template: ${relative(templatePath)}`);
  }
  const harnessPath = path.join(os.tmpdir(), `theme-preview-harness-${process.pid}-${Math.random().toString(16).slice(2)}.php`);
  fs.writeFileSync(harnessPath, buildPreviewHarness(themeDir, templateRel));
  try {
    const result = spawnSync('php', [harnessPath], { cwd: themeDir, encoding: 'utf8', maxBuffer: 1024 * 1024 * 100 });
    if (result.status !== 0 || result.stderr.trim()) {
      throw new Error(`Preview render failed for ${templateRel}: ${(result.stderr || result.stdout).trim()}`);
    }
    return result.stdout;
  } finally {
    removeIfExists(harnessPath);
  }
}

function buildPreviewHarness(themeDir, templateRel) {
  return `<?php
error_reporting(E_ALL);
ini_set('display_errors', 'stderr');
$theme_dir = ${JSON.stringify(themeDir)};
$template_rel = ${JSON.stringify(templateRel)};
define('ABSPATH', $theme_dir . '/');
function esc_html($value){ return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function esc_attr($value){ return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function esc_url($value){ return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function esc_html__($text, $domain = null){ return (string)$text; }
function esc_attr__($text, $domain = null){ return (string)$text; }
function __($text, $domain = null){ return (string)$text; }
function esc_html_e($text, $domain = null){ echo esc_html($text); }
function esc_attr_e($text, $domain = null){ echo esc_attr($text); }
function wp_kses_post($value){ return (string)$value; }
function sanitize_text_field($value){ return is_scalar($value) ? trim((string)$value) : ''; }
function sanitize_email($value){ return sanitize_text_field($value); }
function sanitize_textarea_field($value){ return sanitize_text_field($value); }
function wp_unslash($value){ return $value; }
function is_email($value){ return filter_var($value, FILTER_VALIDATE_EMAIL); }
function add_action(){ return true; }
function add_filter(){ return true; }
function apply_filters($hook, $value){ return $value; }
function add_theme_support(){ return true; }
function add_editor_style(){ return true; }
function load_theme_textdomain(){ return true; }
function register_nav_menus(){ return true; }
function register_post_type(){ return true; }
function add_menu_page(){ return true; }
function register_setting(){ return true; }
function wp_enqueue_style(){ return true; }
function wp_enqueue_script(){ return true; }
function wp_nonce_field($action = '', $name = '_wpnonce'){ echo '<input type="hidden" name="' . esc_attr($name) . '" value="preview">'; }
function wp_verify_nonce(){ return true; }
function wp_die($message = ''){ throw new Exception((string)$message); }
function wp_safe_redirect(){ return true; }
function wp_get_referer(){ return 'index.html'; }
function wp_insert_post(){ return 1; }
function update_post_meta(){ return true; }
function wp_generate_password(){ return 'preview-token'; }
function wp_nonce_url($url){ return $url; }
function check_admin_referer(){ return true; }
function get_posts(){ return array(); }
function get_post_meta(){ return ''; }
function get_the_date(){ return date('Y-m-d'); }
function get_option($name, $default = false){ return $name === 'admin_email' ? 'preview@example.test' : $default; }
function current_user_can(){ return true; }
function is_wp_error(){ return false; }
function sanitize_key($value){ return preg_replace('/[^a-z0-9_\\-]/', '', strtolower((string)$value)); }
function wp_mail(){ return true; }
function admin_url($path = ''){ return 'admin-post.php' . ($path ? '?' . ltrim($path, '?') : ''); }
function add_query_arg($key, $value, $url = ''){ return $url ?: 'index.html'; }
function get_template_directory(){ global $theme_dir; return $theme_dir; }
function get_theme_file_path($path = ''){ global $theme_dir; return $theme_dir . '/' . ltrim($path, '/'); }
function get_theme_file_uri($path = ''){ return ltrim($path, '/'); }
function language_attributes(){ echo 'lang="en"'; }
function bloginfo($show = ''){ echo $show === 'charset' ? 'utf-8' : 'Nolan Young Preview'; }
function body_class($class = ''){ echo 'class="' . esc_attr(trim('preview ' . (is_array($class) ? implode(' ', $class) : $class))) . '"'; }
function wp_body_open(){ return true; }
function wp_head(){ echo '<link rel="stylesheet" href="assets/css/bundle.css">' . PHP_EOL; }
function wp_footer(){ echo '<script src="assets/js/bundle.js"></script>' . PHP_EOL; }
function date_i18n($format){ return date($format); }
function preview_home_url($path = ''){
  $path = '/' . trim((string)$path, '/');
  $map = array(
    '/' => 'index.html',
    '/about' => 'about-us_preview.html',
    '/about/' => 'about-us_preview.html',
    '/services' => 'services_preview.html',
    '/services/' => 'services_preview.html',
    '/work' => 'work_preview.html',
    '/work/' => 'work_preview.html',
    '/blog' => 'blog_preview.html',
    '/blog/' => 'blog_preview.html',
    '/contact' => 'contact_preview.html',
    '/contact/' => 'contact_preview.html',
    '/privacy-policy' => 'policy_preview.html',
    '/privacy-policy/' => 'policy_preview.html'
  );
  if (isset($map[$path])) { return $map[$path]; }
  if (strpos($path, '/services/') === 0) { return 'single_services_preview.html'; }
  return 'index.html';
}
function home_url($path = ''){ return preview_home_url($path); }
function site_url($path = ''){ return preview_home_url($path); }
function get_header(){ global $theme_dir; include $theme_dir . '/header.php'; }
function get_footer(){ global $theme_dir; include $theme_dir . '/footer.php'; }
function get_template_part($slug, $name = null){ global $theme_dir; $file = $theme_dir . '/' . $slug . ($name ? '-' . $name : '') . '.php'; if (!file_exists($file)) { $file = $theme_dir . '/' . $slug . '.php'; } if (file_exists($file)) { include $file; } }
function get_search_form(){ global $theme_dir; if (file_exists($theme_dir . '/searchform.php')) { include $theme_dir . '/searchform.php'; } }
function get_search_query(){ return ''; }
function have_posts(){ static $done = false; if ($done) { return false; } $done = true; return true; }
function the_post(){ return true; }
function the_ID(){ echo '1'; }
function post_class($class = ''){ echo 'class="' . esc_attr($class) . '"'; }
function get_the_title(){ return 'Website Service'; }
function the_title(){ echo 'Preview Title'; }
function the_content(){ echo '<p>Preview content rendered by the factory harness.</p>'; }
function get_permalink(){ return 'index.html'; }
function the_permalink(){ echo 'index.html'; }
function get_the_excerpt(){ return 'Preview excerpt rendered by the factory harness.'; }
function wp_trim_words($text, $num_words = 55){ $words = preg_split('/\\s+/', (string)$text); return implode(' ', array_slice($words, 0, $num_words)); }
function get_post_type(){ return 'post'; }
function the_posts_navigation(){ return true; }
function the_archive_title($before = '', $after = ''){ echo $before . 'Archive' . $after; }
function post_password_required(){ return false; }
function have_comments(){ return false; }
function wp_list_comments(){ return true; }
function comment_form(){ echo '<form class="comment-form"></form>'; }
require_once $theme_dir . '/functions.php';
include $theme_dir . '/' . $template_rel;
`;
}

function generatePreviewIndex() {
  ensureDir(PREVIEWS_DIR);
  const slugs = fs.readdirSync(PREVIEWS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && SLUG_RE.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  const cards = slugs.map((slug) => {
    const themeDir = path.join(THEMES_DIR, slug);
    const title = fs.existsSync(path.join(themeDir, 'style.css')) ? readStyleHeader(path.join(themeDir, 'style.css'), 'Theme Name') || titleFromSlug(slug) : titleFromSlug(slug);
    const zipReady = fs.existsSync(path.join(ZIPS_DIR, `${slug}.zip`));
    return `  <section class="card" aria-label="${escapeHtml(title)} preview">
    <div class="preview">
      <iframe title="${escapeHtml(title)} preview" src="Preview-Themes-Github/${slug}/index.html" loading="lazy"></iframe>
    </div>
    <div class="body">
      <div>
        <p class="eyebrow">${slug}</p>
        <h2>${escapeHtml(title)}</h2>
        <p>Generated WordPress theme preview.</p>
      </div>
      <div class="tag-row"><span class="pill">${zipReady ? 'ZIP ready' : 'ZIP pending'}</span><span class="pill status">Published preview</span></div>
      <div class="links">
        <a class="button" href="Preview-Themes-Github/${slug}/homepage_preview.html">Open Preview</a>
      </div>
    </div>
  </section>`;
  }).join('\n');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Nolan Young Theme Preview Gallery</title>
<style>
:root{color-scheme:dark;--bg:#050914;--panel:#0d1a2b;--line:rgb(80 209 255 / 24%);--line-2:rgb(184 255 77 / 24%);--text:#f2fbff;--muted:#9fb2c8;--soft:#d7e8f2;--blue:#38d6ff;--cyan:#66f2ff;--lime:#b8ff4d;--shadow:0 26px 90px rgb(0 0 0 / 42%)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 16% -10%,rgb(56 214 255 / 18%),transparent 34%),radial-gradient(circle at 92% 10%,rgb(184 255 77 / 9%),transparent 26%),linear-gradient(180deg,var(--bg),#07111f 44%,#050914);color:var(--text);font-family:Inter,Arial,sans-serif;line-height:1.6}a{color:inherit}.page,.foot{width:min(1180px,calc(100% - 32px));margin:0 auto}.page{padding:4rem 0 2rem}.eyebrow{margin:0 0 .75rem;color:var(--lime);font-size:.78rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}h1,h2,h3,p{margin-top:0}h1{max-width:850px;margin:0 0 1rem;font-size:clamp(3rem,7vw,6.5rem);line-height:.94}h2{margin-bottom:.6rem;font-size:clamp(2rem,4vw,3.7rem);line-height:1}.lede{max-width:720px;margin:0 0 2rem;color:var(--muted);font-size:1.05rem}.grid{display:grid;gap:1.2rem}.card{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);gap:0;background:linear-gradient(135deg,rgb(16 36 59 /.92),rgb(13 26 43 /.96));border:1px solid var(--line);border-radius:30px;overflow:hidden;box-shadow:var(--shadow)}.preview{position:relative;min-height:680px;background:#08101b;border-right:1px solid var(--line)}iframe{display:block;width:100%;height:100%;min-height:680px;border:0}.body{padding:2rem 2rem 2.2rem;display:flex;flex-direction:column;justify-content:space-between;gap:1.5rem}.tag-row,.links{display:flex;flex-wrap:wrap;gap:.75rem}.pill{display:inline-flex;align-items:center;justify-content:center;padding:.45rem .75rem;border-radius:999px;background:rgb(184 255 77 /.12);border:1px solid var(--line-2);color:var(--soft);font-size:.82rem;font-weight:700}.status{background:rgb(56 214 255 /.12);border-color:var(--line);color:var(--text)}.button{display:inline-flex;align-items:center;justify-content:center;padding:.95rem 1.2rem;border-radius:999px;background:linear-gradient(135deg,var(--lime),var(--cyan));color:#08101b;text-decoration:none;font-weight:900;min-height:48px}footer{padding:0 0 3rem;color:var(--muted)}@media (max-width:900px){.card{grid-template-columns:1fr}.preview{border-right:0;border-bottom:1px solid var(--line);min-height:420px}iframe{min-height:420px}.body{padding:1.4rem}}@media (max-width:600px){.page,.foot{width:min(100% - 20px,1180px)}h1{font-size:clamp(2.4rem,14vw,4rem)}}
</style>
</head>
<body>
<main class="page">
  <p class="eyebrow">Generated outputs</p>
  <h1>Preview Themes</h1>
  <p class="lede">Generated WordPress theme previews.</p>
  <div class="grid">
${cards || '    <p>No generated previews found.</p>'}
  </div>
</main>
<footer class="foot">
  <p>Preview gallery rebuilt from the current repository inventory.</p>
</footer>
</body>
</html>
`;
  ensureDir(path.join(ROOT, 'docs'));
  fs.writeFileSync(path.join(ROOT, 'docs', 'index.html'), html);
  console.log('Preview index generated: docs/index.html');
}

function createZipArchive(zipPath, themeSlug, cwd) {
  const zip = spawnSync('zip', ['-qr', zipPath, themeSlug], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 100
  });
  if (!zip.error) {
    return zip;
  }
  const tarExecutable = process.platform === 'win32' ? 'tar.exe' : 'tar';
  return spawnSync(tarExecutable, ['-a', '-c', '-f', zipPath, '-C', cwd, themeSlug], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 100
  });
}

function packageTheme(themeSlug) {
  const themeDir = existingThemeDir(themeSlug);
  ensureDir(ZIPS_DIR);
  const tempParent = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-zip-'));
  const tempTheme = path.join(tempParent, themeSlug);
  const tempZip = path.join(tempParent, `${themeSlug}.zip`);
  fs.cpSync(themeDir, tempTheme, {
    recursive: true,
    filter: (src) => !PACKAGE_EXCLUDED_DIRS.has(path.basename(src))
  });
  try {
    const result = createZipArchive(tempZip, themeSlug, tempParent);
    assertStatus(result, `zip ${themeSlug}`);
    fs.copyFileSync(tempZip, path.join(ZIPS_DIR, `${themeSlug}.zip`));
  } finally {
    removeIfExists(tempParent);
  }
  console.log(`ZIP packaged: dist/zipped-themes/${themeSlug}.zip`);
}

function listZipEntries(zipPath) {
  const parsedEntries = readZipCentralDirectoryEntries(zipPath);
  if (parsedEntries.length) {
    return parsedEntries;
  }

  const unzip = spawnSync('unzip', ['-Z1', zipPath], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 100
  });
  if (unzip.status === 0 && unzip.stdout.trim()) {
    return normalizeZipEntryList(unzip.stdout);
  }

  const tarExecutable = process.platform === 'win32' ? 'tar.exe' : 'tar';
  const tar = spawnSync(tarExecutable, ['-tf', zipPath], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 100
  });
  if (tar.status === 0 && tar.stdout.trim()) {
    return normalizeZipEntryList(tar.stdout);
  }

  return [];
}

function readZipCentralDirectoryEntries(zipPath) {
  const buffer = fs.readFileSync(zipPath);
  const minEocdSize = 22;
  if (buffer.length < minEocdSize) {
    return [];
  }
  const searchStart = Math.max(0, buffer.length - 0xffff - minEocdSize);
  let eocdOffset = -1;
  for (let offset = buffer.length - minEocdSize; offset >= searchStart; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      eocdOffset = offset;
      break;
    }
  }
  if (eocdOffset === -1) {
    return [];
  }

  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  let cursor = buffer.readUInt32LE(eocdOffset + 16);
  const entries = [];
  for (let index = 0; index < entryCount; index += 1) {
    if (cursor + 46 > buffer.length || buffer.readUInt32LE(cursor) !== 0x02014b50) {
      return [];
    }
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const nameStart = cursor + 46;
    const nameEnd = nameStart + nameLength;
    if (nameEnd > buffer.length) {
      return [];
    }
    entries.push(buffer.toString('utf8', nameStart, nameEnd).replace(/\\/g, '/'));
    cursor = nameEnd + extraLength + commentLength;
  }
  return entries.filter(Boolean);
}

function normalizeZipEntryList(output) {
  return output
    .split(/\r?\n/)
    .map((entry) => entry.trim().replace(/\\/g, '/'))
    .filter(Boolean);
}

function zipEntryHasExcludedDir(entry) {
  return entry.split('/').some((part) => PACKAGE_EXCLUDED_DIRS.has(part));
}

function modelCheck(provider, args) {
  if (!provider) {
    throw new Error('Missing --provider codex or --provider ollama.');
  }
  if (provider === 'codex') {
    const executable = args.codexExecutable || args['codex-executable'] || 'codex';
    assertStatus(spawnSync(executable, ['--version'], { cwd: ROOT, encoding: 'utf8' }), `${executable} --version`);
    console.log('PASS model-check codex');
    return;
  }
  if (provider === 'ollama') {
    const executable = args.ollamaExecutable || args['ollama-executable'] || 'ollama';
    const version = spawnSync(executable, ['--version'], { cwd: ROOT, encoding: 'utf8' });
    assertStatus(version, `${executable} --version`);
    const model = args.ollamaModel || args['ollama-model'];
    if (model) {
      const list = spawnSync(executable, ['list'], { cwd: ROOT, encoding: 'utf8' });
      assertStatus(list, `${executable} list`);
      if (!list.stdout.includes(model)) {
        throw new Error(`Ollama model not found locally: ${model}`);
      }
    }
    console.log('PASS model-check ollama');
    return;
  }
  throw new Error(`Unsupported provider: ${provider}`);
}

function parseArgs(rawArgs) {
  const args = {};
  for (let i = 0; i < rawArgs.length; i += 1) {
    const token = rawArgs[i];
    if (!token.startsWith('--')) {
      args._ = args._ || [];
      args._.push(token);
      continue;
    }
    const without = token.slice(2);
    const eq = without.indexOf('=');
    if (eq !== -1) {
      args[toCamel(without.slice(0, eq))] = without.slice(eq + 1);
      args[without.slice(0, eq)] = without.slice(eq + 1);
      continue;
    }
    const key = toCamel(without);
    const originalKey = without;
    const next = rawArgs[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      args[originalKey] = true;
    } else {
      args[key] = next;
      args[originalKey] = next;
      i += 1;
    }
  }
  return args;
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function resolveTemplateSource(args) {
  if (args.templateSourcePath || args['template-source-path']) {
    return resolvePath(args.templateSourcePath || args['template-source-path']);
  }
  if (args.template) {
    const candidates = [
      path.join(ROOT, 'wordpress-themplate-themes', args.template),
      path.join(ROOT, 'wordpress-themplate-themes', `${args.template}.zip`),
      path.join(ROOT, 'dist', 'zipped-theme-templates', args.template),
      path.join(ROOT, 'dist', 'zipped-theme-templates', `${args.template}.zip`)
    ];
    const found = candidates.find((candidate) => fs.existsSync(candidate));
    if (found) {
      return found;
    }
    throw new Error(`Template not found: ${args.template}`);
  }
  if (fs.existsSync(DEFAULT_TEMPLATE_DIR)) {
    return DEFAULT_TEMPLATE_DIR;
  }
  const fallbackZip = path.join(ROOT, 'dist', 'zipped-theme-templates', 'nolan-young-theme-template-000-classic.zip');
  if (fs.existsSync(fallbackZip)) {
    return fallbackZip;
  }
  throw new Error('No default template source found.');
}

function resolvePromptPath(input) {
  if (!input) {
    throw new Error('Missing prompt path.');
  }
  const promptPath = resolvePath(input);
  if (!fs.existsSync(promptPath)) {
    throw new Error(`Prompt file not found: ${input}`);
  }
  if (!fs.statSync(promptPath).isFile()) {
    throw new Error(`Prompt path is not a file: ${input}`);
  }
  return promptPath;
}

function resolvePath(input) {
  return path.isAbsolute(input) ? path.resolve(input) : path.resolve(ROOT, input);
}

function firstPromptPath() {
  if (!fs.existsSync(PROMPTS_DIR)) {
    throw new Error('prompts/pending does not exist.');
  }
  const files = fs.readdirSync(PROMPTS_DIR).filter((file) => file.endsWith('.md') || file.endsWith('.txt')).sort();
  if (!files.length) {
    throw new Error('No prompt files found in prompts/pending.');
  }
  return path.join(PROMPTS_DIR, files[0]);
}

function makeNextSlug(promptPath) {
  const number = nextThemeNumber();
  const description = slugDescriptionFromPrompt(promptPath);
  return `${String(number).padStart(3, '0')}_nolan_young_theme_${description}`;
}

function nextThemeNumber() {
  const numbers = [];
  for (const dir of [THEMES_DIR, PREVIEWS_DIR]) {
    if (!fs.existsSync(dir)) {
      continue;
    }
    for (const entry of fs.readdirSync(dir)) {
      const match = entry.match(/^(\d{3})_nolan_young_theme_/);
      if (match) {
        numbers.push(Number(match[1]));
      }
    }
  }
  if (fs.existsSync(ZIPS_DIR)) {
    for (const entry of fs.readdirSync(ZIPS_DIR)) {
      const match = entry.match(/^(\d{3})_nolan_young_theme_.*\.zip$/);
      if (match) {
        numbers.push(Number(match[1]));
      }
    }
  }
  return numbers.length ? Math.max(...numbers) + 1 : 0;
}

function slugDescriptionFromPrompt(promptPath) {
  const content = fs.readFileSync(promptPath, 'utf8');
  const businessMatch = content.match(/Business Name\s*\n+([\s\S]{0,300})/i);
  if (businessMatch) {
    const candidate = businessMatch[1].split(/\r?\n/).map((line) => line.trim()).find((line) => line && !line.startsWith('#'));
    if (candidate) {
      const backtick = candidate.match(/`([^`]+)`/);
      return sanitizeSlugWords(backtick ? backtick[1] : candidate);
    }
  }
  return sanitizeSlugWords(path.basename(promptPath, path.extname(promptPath)).replace(/^\d+[-_ ]*/, ''));
}

function sanitizeSlugWords(value) {
  return value.toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_{2,}/g, '_')
    .slice(0, 72) || 'generated_theme';
}

function requireSlug(slug) {
  if (!slug || !SLUG_RE.test(slug)) {
    throw new Error(`Invalid theme slug: ${slug || '(missing)'}. Expected NNN_nolan_young_theme_description.`);
  }
  return slug;
}

function getThemeDir(themeSlug) {
  return path.join(THEMES_DIR, requireSlug(themeSlug));
}

function existingThemeDir(themeSlug) {
  const themeDir = getThemeDir(themeSlug);
  if (!fs.existsSync(themeDir)) {
    throw new Error(`Theme does not exist: ${relative(themeDir)}`);
  }
  return themeDir;
}

function themeExists(themeSlug) {
  return fs.existsSync(getThemeDir(themeSlug));
}

function ensureReportDir(themeSlug) {
  const dir = path.join(REPORTS_DIR, requireSlug(themeSlug));
  ensureDir(dir);
  return dir;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function removeIfExists(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

function copyIfExists(source, target) {
  if (!fs.existsSync(source)) {
    return;
  }
  fs.cpSync(source, target, { recursive: true });
}

function walk(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (PACKAGE_EXCLUDED_DIRS.has(entry.name)) {
        continue;
      }
      result.push(...walk(full));
    } else if (entry.isFile()) {
      result.push(full);
    }
  }
  return result;
}

function findDirsWithFile(rootDir, fileName) {
  const matches = [];
  function visit(dir) {
    if (fs.existsSync(path.join(dir, fileName))) {
      matches.push(dir);
    }
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        visit(path.join(dir, entry.name));
      }
    }
  }
  visit(rootDir);
  return matches;
}

function relative(file) {
  return path.relative(ROOT, file) || '.';
}

function relativeTo(parent, file) {
  return path.relative(parent, file).split(path.sep).join('/');
}

function assertStatus(result, label) {
  if (result.error) {
    throw new Error(`${label} failed: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`${label} failed${output ? `:\n${output}` : ''}`);
  }
}

function collectMarkdownHeadings(content) {
  return content.split(/\r?\n/)
    .map((line) => line.match(/^#{1,6}\s+(.+?)\s*$/))
    .filter(Boolean)
    .map((match) => match[1]);
}

function normalizeHeading(value) {
  return value.toLowerCase()
    .replace(/^\d+[\s.)-]*/, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normalizeRelativeFile(input) {
  const cleaned = input.replace(/\\/g, '/').replace(/^\.?\//, '');
  if (!cleaned || cleaned.startsWith('../') || path.isAbsolute(cleaned)) {
    throw new Error(`Unsafe relative path: ${input}`);
  }
  return cleaned;
}

function ensureInside(parent, child) {
  const rel = path.relative(parent, child);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Path escapes allowed directory: ${child}`);
  }
}

function matchesAllowList(relPath, allowList) {
  return allowList.some((pattern) => {
    const normalized = pattern.replace(/\\/g, '/');
    if (normalized.endsWith('/**')) {
      return relPath.startsWith(normalized.slice(0, -3) + '/');
    }
    return relPath === normalized;
  });
}

function listThemeContext(themeDir) {
  return walk(themeDir)
    .map((file) => relativeTo(themeDir, file))
    .filter((file) => !file.startsWith('node_modules/'))
    .sort()
    .join('\n');
}

function statusPaths() {
  const result = spawnSync('git', ['status', '--porcelain=v1'], { cwd: ROOT, encoding: 'utf8' });
  assertStatus(result, 'git status');
  return new Set(result.stdout.split(/\r?\n/).filter(Boolean).map((line) => line.slice(3).trim()));
}

function assertOnlyAllowedStatusChanges(before, after, allowedPrefixes) {
  const changed = [...after].filter((item) => !before.has(item));
  const illegal = changed.filter((item) => !allowedPrefixes.some((prefix) => item === prefix || item.startsWith(`${prefix}/`)));
  if (illegal.length) {
    throw new Error(`Generation touched paths outside the prepared theme/report scope:\n${illegal.map((item) => `- ${item}`).join('\n')}`);
  }
}

function splitExtraArgs(value) {
  if (!value) {
    return [];
  }
  return String(value).match(/(?:[^\s"]+|"[^"]*")+/g)?.map((item) => item.replace(/^"|"$/g, '')) || [];
}

function readStyleHeader(stylePath, field) {
  const content = fs.readFileSync(stylePath, 'utf8');
  const match = content.match(new RegExp(`^${escapeRegExp(field)}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim() : '';
}

function titleFromSlug(slug) {
  const parts = slug.split('_');
  const number = parts.shift();
  const words = parts.join(' ').replace(/^nolan young theme /, '');
  return `${number} Nolan Young Theme ${words.replace(/\b\w/g, (letter) => letter.toUpperCase())}`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function printHelp() {
  console.log(`Nolan Young Theme Factory

Commands:
  run            Prepare, generate, build, validate, preview, zip
  resume         Re-run deterministic post-generation work for a theme
  prepare        Copy a template into wp-content/themes/{slug}
  validate       Validate source and artifacts
  build          Run npm build inside a theme
  preview        Render static preview pages
  preview:index  Rebuild docs/index.html
  zip            Package a theme zip
  delete         Delete generated artifacts for a theme
  env            Print local tool availability
  model-check    Check codex or ollama availability
  self-test      Run script-layer tests

Generation modes:
  codex-only
  ollama-only
`);
}

main();
