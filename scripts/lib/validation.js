'use strict';

const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function createValidation(deps) {
  const {
    DEFAULT_TEMPLATE_DIR,
    PREVIEW_PAGES,
    PREVIEWS_DIR,
    REQUIRED_THEME_FILES,
    ROOT,
    SEEDED_ASSET_MANIFEST,
    ZIPS_DIR,
    ensureReportDir,
    escapeRegExp,
    existingThemeDir,
    fs,
    isLandscapingTheme,
    listZipEntries,
    readJson,
    relative,
    relativeTo,
    walk,
    writeJson,
    zipEntryHasExcludedDir
  } = deps;

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
    const designDifferentiation = validateDesignDifferentiation(themeDir);
    errors.push(...designDifferentiation.errors);
    warnings.push(...designDifferentiation.warnings);
  
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
    const errors = [];
    const warnings = [];
    if (path.resolve(themeDir) === path.resolve(DEFAULT_TEMPLATE_DIR)) {
      return { errors, warnings };
    }

    const manifestPath = path.join(themeDir, SEEDED_ASSET_MANIFEST);
    const relevantFiles = walk(themeDir)
      .filter((file) => /\.(php|scss|css|js|md)$/i.test(file))
      .filter((file) => !relativeTo(themeDir, file).startsWith('node_modules/'));
    const joined = relevantFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  
    if (fs.existsSync(manifestPath)) {
      const manifest = readJson(manifestPath);
      const referenced = manifest.assets.filter((asset) => joined.includes(asset.path) || joined.includes(path.basename(asset.path)));
      if (referenced.length < Math.min(4, manifest.assets.length)) {
        errors.push(`Seeded assets appear underused: ${referenced.length}/${manifest.assets.length} referenced in generated source.`);
      }
    }
  
    const headerPath = path.join(themeDir, 'header.php');
    const defaultHeaderPath = path.join(DEFAULT_TEMPLATE_DIR, 'header.php');
    if (fs.existsSync(headerPath) && fs.existsSync(defaultHeaderPath)) {
      const current = normalizeForComparison(fs.readFileSync(headerPath, 'utf8'));
      const base = normalizeForComparison(fs.readFileSync(defaultHeaderPath, 'utf8'));
      if (current === base) {
        errors.push('Header appears unchanged from the default template.');
      }
    }

    errors.push(...validateTemplateTransformation(themeDir));
  
    const motionFiles = ['src/js/main.js', 'src/scss/main.scss', 'assets/js/bundle.js', 'assets/css/bundle.css']
      .map((file) => path.join(themeDir, file))
      .filter((file) => fs.existsSync(file))
      .map((file) => fs.readFileSync(file, 'utf8'))
      .join('\n');
    if (!/(IntersectionObserver|requestAnimationFrame|data-animate|prefers-reduced-motion|@keyframes|transition|transform)/i.test(motionFiles)) {
      errors.push('No strong animation or interaction signal found in JS/CSS.');
    }
    return { errors, warnings };
  }

  function validateTemplateTransformation(themeDir) {
    if (path.resolve(themeDir) === path.resolve(DEFAULT_TEMPLATE_DIR) || !fs.existsSync(DEFAULT_TEMPLATE_DIR)) {
      return [];
    }

    const errors = [];
    const criticalFiles = [
      'front-page.php',
      'header.php',
      'footer.php',
      'template-parts/content-hero.php',
      'src/scss/layout/_header.scss',
      'src/scss/layout/_sections.scss',
      'src/scss/layout/_footer.scss',
      'src/scss/pages/_homepage.scss',
      'assets/css/bundle.css'
    ];
    const unchangedFiles = [];

    for (const relPath of criticalFiles) {
      const generatedPath = path.join(themeDir, relPath);
      const templatePath = path.join(DEFAULT_TEMPLATE_DIR, relPath);
      if (!fs.existsSync(generatedPath) || !fs.existsSync(templatePath)) {
        continue;
      }
      const generated = normalizeForComparison(fs.readFileSync(generatedPath, 'utf8'));
      const template = normalizeForComparison(fs.readFileSync(templatePath, 'utf8'));
      if (generated === template) {
        unchangedFiles.push(relPath);
      }
    }

    if (unchangedFiles.length) {
      errors.push(`Generated theme left starter-template files unchanged in critical layout/style paths: ${unchangedFiles.join(', ')}.`);
    }

    const generatedCss = path.join(themeDir, 'assets/css/bundle.css');
    const templateCss = path.join(DEFAULT_TEMPLATE_DIR, 'assets/css/bundle.css');
    if (fs.existsSync(generatedCss) && fs.existsSync(templateCss)) {
      const generatedCssSize = fs.statSync(generatedCss).size;
      const templateCssSize = fs.statSync(templateCss).size;
      const sizeDelta = Math.abs(generatedCssSize - templateCssSize);
      if (sizeDelta < 1500) {
        errors.push(`Compiled CSS changed by only ${sizeDelta} bytes from the starter template; a major visual redesign must materially change the generated stylesheet.`);
      }
    }

    return errors;
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

  return {
    printValidation,
    validateArtifacts,
    validateArtifactsOrThrow,
    validateSource,
    validateSourceOrThrow
  };
}

module.exports = { createValidation };
