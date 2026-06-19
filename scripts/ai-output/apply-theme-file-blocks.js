#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { runCommand } = require('../shared/command-runner');
const { CONTENT_SECTION_PATTERN, THEME_SLUG_PATTERN } = require('../shared/constants');

const [sourceFile, themeDirArg] = process.argv.slice(2);
const warnings = [];

function fail(message) {
  for (const warning of warnings || []) {
    console.warn(`WARNING: ${warning}`);
  }
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!sourceFile || !themeDirArg) {
  fail('Usage: node scripts/ai-output/apply-theme-file-blocks.js <source-output-file> <theme-dir>');
}

const themeDir = path.resolve(themeDirArg);
const themeSlug = path.basename(themeDir);
if (!THEME_SLUG_PATTERN.test(themeSlug)) fail(`Invalid theme folder slug: ${themeSlug}`);
const input = fs.readFileSync(sourceFile, 'utf8')
  .replace(/\u001B\[[0-9;?]*[ -/]*[@-~]/g, '')
  .replace(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]\s*/g, '')
  .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '');
const pattern = /^---FILE: ([^\r\n]+)---\r?\n([\s\S]*?)\r?\n---END FILE---$/gm;
let match;
let count = 0;
let latestBundleCss = '';

function phpIsAvailable() {
  if (phpIsAvailable.cached !== undefined) return phpIsAvailable.cached;
  phpIsAvailable.cached = runCommand('php', ['-v'], { echo: false }).status === 0;
  return phpIsAvailable.cached;
}

function phpSyntaxIsValid(relativePath, content) {
  if (!relativePath.endsWith('.php') || !phpIsAvailable()) return true;
  const tempDir = path.join(os.tmpdir(), 'theme-factory-php-lint');
  fs.mkdirSync(tempDir, { recursive: true });
  const tempFile = path.join(tempDir, `.php-lint-${Date.now()}-${Math.random().toString(16).slice(2)}.php`);
  fs.writeFileSync(tempFile, content, 'utf8');
  const result = runCommand('php', ['-l', tempFile], { echo: false });
  fs.rmSync(tempFile, { force: true });
  if (result.status !== 0) {
    warnings.push(`Skipped invalid PHP from model for ${relativePath}; kept existing template file.`);
    return false;
  }
  return true;
}

function sanitizeRemoteReferences(content) {
  return content.replace(/https?:\/\/[^\s"'<>),]+/g, (url) => {
    if (url.startsWith('https://schemas.wp.org')) return url;
    if (url.startsWith('https://www.w3.org') || url.startsWith('http://www.w3.org')) return url;
    return '#';
  });
}

function sanitizeScaffoldOnlyCopy(content) {
  return content
    .replace(/<!--\s*Add [^-]+ here\s*-->/gi, '<p>Details are presented with clear next steps, practical context, and direct links to continue the conversation.</p>')
    .replace(/<\?php\s*\/\/\s*Add [^?\r\n]+ here\s*\?>/gi, '<p>Every engagement is guided by clear planning, careful execution, and practical support from first conversation through launch.</p>')
    .replace(/^[ \t]*\/\/[ \t]*Add settings and controls here[ \t]*\r?\n/gm, '')
    .replace(/^[ \t]*\/\/[ \t]*Add routes here[ \t]*\r?\n/gm, '')
    .replace(/^[ \t]*\/\/[ \t]*Add .+ here if needed[ \t]*\r?\n/gm, '')
    .replace(/^[ \t]*\/\/[ \t]*Add .+ here[ \t]*\r?\n/gm, '');
}

function stripOuterCodeFences(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const trimmed = normalized.trim();
  const fenceMatch = trimmed.match(/^```[a-zA-Z0-9_-]*\n([\s\S]*?)\n```$/);
  if (fenceMatch) return `${fenceMatch[1].replace(/\n$/, '')}\n`;
  if (/^```[a-zA-Z0-9_-]*\n/.test(trimmed)) {
    return `${trimmed.replace(/^```[a-zA-Z0-9_-]*\n/, '').replace(/\n```$/, '').replace(/\n?$/, '\n')}`;
  }
  return content;
}

function removeFileBlockArtifacts(relativePath, content) {
  let normalized = content.replace(/\r\n/g, '\n');
  const nestedFileMarker = normalized.search(/^---FILE:\s*[^\r\n]+---\s*$/m);

  if (nestedFileMarker === 0) {
    warnings.push(`Skipped model output for ${relativePath}; content began with a nested FILE marker.`);
    return null;
  }

  if (nestedFileMarker > 0) {
    warnings.push(`Truncated leaked model file blocks from ${relativePath}.`);
    normalized = normalized.slice(0, nestedFileMarker);
  }

  if (/^---END FILE---\s*$/im.test(normalized)) {
    warnings.push(`Removed leaked END FILE marker from ${relativePath}.`);
    normalized = normalized.replace(/^---END FILE---\s*$/gmi, '');
  }

  if (/\.(php|css|scss|js)$/i.test(relativePath) && /^```[a-zA-Z0-9_-]*\s*$/m.test(normalized)) {
    warnings.push(`Removed leaked markdown code fence marker from ${relativePath}.`);
    normalized = normalized.replace(/^```[a-zA-Z0-9_-]*\s*$/gm, '');
  }

  return `${normalized.replace(/\n?$/, '\n')}`;
}

function stripAccidentalDiffPrefixes(relativePath, content) {
  if (!/\.(php|css|scss|js)$/i.test(relativePath)) return content;
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const prefixed = lines.filter((line) => /^\+[^\+]/.test(line)).length;
  if (prefixed < 2 || prefixed < Math.ceil(lines.filter((line) => line.trim()).length * 0.25)) return content;
  warnings.push(`Removed accidental leading diff markers from ${relativePath}.`);
  return lines
    .map((line) => line.replace(/^\+(?=[^\+])/, ''))
    .filter((line) => !/^\+\s*$/.test(line))
    .join('\n');
}

function normalizePhpTemplateContent(relativePath, content) {
  if (!relativePath.endsWith('.php') || !content.startsWith('<?php')) return content;

  content = content
    .replace(/^\?php$/gm, '?>')
    .replace(/^(<\?php[^\n]*\?>)\n\?>\n/, '$1\n')
    .replace(/^(<\?php[^\n]*\?>)\r\n\?>\r\n/, '$1\r\n');

  const lines = content.replace(/\r\n/g, '\n').split('\n');
  let inPhp = true;
  let inBlockComment = false;

  for (let index = 1; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();

    if (!inPhp) {
      if (trimmed === '<?php') inPhp = true;
      continue;
    }

    if (!trimmed) continue;

    if (inBlockComment) {
      if (trimmed.includes('*/')) inBlockComment = false;
      continue;
    }

    if (trimmed.startsWith('/*')) {
      if (!trimmed.includes('*/')) inBlockComment = true;
      continue;
    }

    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;

    if (trimmed.startsWith('?>')) {
      inPhp = false;
      continue;
    }

    if (trimmed.startsWith('<?php')) {
      inPhp = !trimmed.includes('?>');
      continue;
    }

    if (trimmed.startsWith('<')) {
      lines.splice(index, 0, '?>');
      inPhp = false;
      index += 1;
    }
  }

  return lines.join('\n');
}

function stripForbiddenHeaderFooterSections(relativePath, content) {
  if (relativePath !== 'header.php' && relativePath !== 'footer.php') return content;
  return content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !CONTENT_SECTION_PATTERN.test(line))
    .join('\n');
}

function wrapperStructureIsValid(relativePath, content) {
  if (relativePath === 'header.php') {
    const valid = /<!doctype html>/i.test(content) && /wp_head\s*\(/i.test(content) && /<body/i.test(content);
    if (!valid) warnings.push('Skipped structurally incomplete model output for header.php; kept prepared template wrapper.');
    return valid;
  }

  if (relativePath === 'footer.php') {
    const valid = /wp_footer\s*\(/i.test(content) && /<\/body>/i.test(content) && /<\/html>/i.test(content);
    if (!valid) warnings.push('Skipped structurally incomplete model output for footer.php; kept prepared template wrapper.');
    return valid;
  }

  return true;
}

function scssImportCandidates(baseDir, specifier) {
  const normalized = specifier.replace(/\\/g, '/');
  const parsed = path.posix.parse(normalized);
  const direct = path.resolve(baseDir, normalized);
  const underscored = path.resolve(baseDir, parsed.dir, `_${parsed.base}`);
  return [
    direct,
    `${direct}.scss`,
    `${direct}.sass`,
    underscored,
    `${underscored}.scss`,
    `${underscored}.sass`,
    path.resolve(baseDir, normalized, 'index.scss'),
    path.resolve(baseDir, normalized, '_index.scss')
  ];
}

function unresolvedScssImports(relativePath, content) {
  if (relativePath !== 'src/scss/main.scss') return [];
  const baseDir = path.join(themeDir, 'src', 'scss');
  const unresolved = [];
  const importPattern = /@(use|import)\s+["']([^"']+)["']/g;
  let importMatch;

  while ((importMatch = importPattern.exec(content)) !== null) {
    const specifier = importMatch[2].trim();
    if (!specifier || specifier.startsWith('http:') || specifier.startsWith('https:')) continue;
    if (specifier.startsWith('sass:')) continue;

    const found = scssImportCandidates(baseDir, specifier).some((candidate) => fs.existsSync(candidate));
    if (!found) unresolved.push(specifier);
  }

  return unresolved;
}

function scssFallbackValue(name) {
  const key = name.toLowerCase();
  if (key.includes('font')) return '"Inter", "Segoe UI", Arial, sans-serif';
  if (key.includes('radius')) return '8px';
  if (key.includes('shadow')) return '0 16px 40px rgba(15, 23, 42, 0.12)';
  if (key.includes('transition')) return '180ms ease';
  if (key.includes('duration')) return '180ms';
  if (key.includes('width') || key.includes('height')) return '1rem';
  if (key.includes('space') || key.includes('spacing') || key.includes('gap') || key.includes('padding') || key.includes('margin')) return '1rem';
  if (key.includes('border')) return 'rgba(15, 23, 42, 0.14)';
  if (key.includes('secondary')) return '#4b5563';
  if (key.includes('muted')) return '#64748b';
  if (key.includes('accent')) return '#0f766e';
  if (key.includes('primary') || key.includes('brand')) return '#1d4ed8';
  if (key.includes('background') || key.includes('surface')) return '#ffffff';
  if (key.includes('text') || key.includes('foreground') || key.includes('ink')) return '#111827';
  return '#111827';
}

function addMissingScssVariables(relativePath, content) {
  if (relativePath !== 'src/scss/main.scss') return content;
  const declared = new Set();
  const used = new Set();
  const declarationPattern = /^\s*\$([A-Za-z0-9_-]+)\s*:/gm;
  const variablePattern = /\$([A-Za-z0-9_-]+)/g;
  let match;

  while ((match = declarationPattern.exec(content)) !== null) declared.add(match[1]);
  while ((match = variablePattern.exec(content)) !== null) used.add(match[1]);

  const missing = [...used].filter((name) => !declared.has(name)).sort();
  if (missing.length === 0) return content;

  warnings.push(`Added deterministic SCSS fallback declarations for missing variables in ${relativePath}: ${missing.join(', ')}.`);
  const declarations = missing.map((name) => `$${name}: ${scssFallbackValue(name)} !default;`).join('\n');
  return `${declarations}\n\n${content.replace(/\r\n/g, '\n')}`;
}

function sanitizeUnsupportedCssColorFunctions(relativePath, content) {
  if (!/\.(css|scss)$/i.test(relativePath)) return content;
  const normalized = content.replace(/\r\n/g, '\n');
  const sanitized = normalized.replace(/\b(?:darken|lighten|adjust-hue|saturate|desaturate)\(\s*(var\([^)]+\))\s*,\s*[^)]+\)/gi, '$1');
  if (sanitized !== normalized) {
    warnings.push(`Removed unsupported Sass color-function wrappers around CSS custom properties in ${relativePath}.`);
  }
  return sanitized;
}

function supplementalThemeStyles() {
  return `

/* Deterministic completion styles added when generated CSS is too small for the finished-theme gate. */
.site,
.site-main {
  min-height: 100%;
}

.site-header,
.site-footer,
.site-main > section,
.content-section,
.section,
.hero,
.cta-banner {
  width: 100%;
}

.container,
.section__inner,
.content-wrap,
.footer-content,
.header-container {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(14px);
}

.site-header .container,
.header-container {
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.logo a,
.site-branding a {
  color: #111827;
  font-weight: 800;
  letter-spacing: 0;
  text-decoration: none;
}

.primary-navigation ul,
.primary-nav,
.footer-content,
.footer-widgets {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
}

.primary-navigation a,
.primary-nav a,
.primary-nav button,
.site-footer a {
  color: #1f2937;
  text-decoration: none;
}

.primary-navigation a:hover,
.primary-navigation a:focus-visible,
.primary-nav a:hover,
.primary-nav button:hover,
.site-footer a:hover {
  color: #2563eb;
}

.site-main > section,
.content-section {
  padding-block: clamp(48px, 8vw, 104px);
}

.site-main > section:nth-child(even),
.section-muted {
  background: #f8fafc;
}

h1,
h2,
h3 {
  color: #111827;
  line-height: 1.1;
  margin: 0 0 18px;
}

h1 {
  font-size: clamp(2.4rem, 5vw, 4.9rem);
}

h2 {
  font-size: clamp(1.8rem, 3vw, 3rem);
}

p,
li {
  color: #4b5563;
  font-size: 1rem;
}

.btn,
button,
input[type="submit"] {
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary,
input[type="submit"] {
  color: #ffffff;
  background: #2563eb;
}

.btn-secondary {
  color: #111827;
  background: #ffffff;
  border: 1px solid #d1d5db;
}

.card,
.service-card,
.work-card,
.testimonial,
.package-card,
article {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  padding: clamp(20px, 3vw, 32px);
}

.grid,
.services-grid,
.work-grid,
.blog-grid,
.testimonial-grid,
.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: clamp(18px, 3vw, 32px);
}

img,
svg {
  max-width: 100%;
  height: auto;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px 14px;
  color: #111827;
  background: #ffffff;
}

input:focus,
textarea:focus,
select:focus,
a:focus-visible,
button:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.28);
  outline-offset: 3px;
}

.site-footer {
  background: #111827;
  color: #f9fafb;
  padding-block: clamp(44px, 7vw, 80px);
}

.site-footer h2,
.site-footer h3,
.site-footer p,
.site-footer li,
.site-footer a {
  color: #f9fafb;
}

@media (max-width: 760px) {
  .site-header .container,
  .header-container,
  .primary-navigation ul,
  .primary-nav {
    align-items: flex-start;
    flex-direction: column;
  }

  .site-main > section,
  .content-section {
    padding-block: 44px;
  }
}
`;
}

function ensureFinishedStyles(relativePath, content) {
  if (relativePath !== 'assets/css/bundle.css' && relativePath !== 'src/scss/main.scss') return content;
  if (content.replace(/\s/g, '').length >= 2600) return content;
  warnings.push(`Expanded ${relativePath} with deterministic completion styles because generated CSS was too small.`);
  return `${content.replace(/\r\n/g, '\n').replace(/\n?$/, '\n')}${supplementalThemeStyles().replace(/\n?$/, '\n')}`;
}

function readGeneratedBundleCss() {
  if (latestBundleCss) return latestBundleCss;
  const bundlePath = path.join(themeDir, 'assets', 'css', 'bundle.css');
  if (!fs.existsSync(bundlePath)) return '';
  return fs.readFileSync(bundlePath, 'utf8');
}

function normalizeScssEntrypoint(relativePath, content) {
  const unresolved = unresolvedScssImports(relativePath, content);
  if (unresolved.length === 0) return content;

  const bundleCss = readGeneratedBundleCss();
  if (!bundleCss.trim()) {
    warnings.push(`Skipped model output for ${relativePath}; it referenced missing SCSS partials: ${unresolved.join(', ')}.`);
    return null;
  }

  if (bundleCss.length < 2000) {
    warnings.push(`Replaced ${relativePath} with deterministic completion styles because model output referenced missing SCSS partials and the generated CSS bundle was too small.`);
    return ensureFinishedStyles(relativePath, bundleCss);
  }

  warnings.push(`Replaced ${relativePath} with generated bundle CSS because model output referenced missing SCSS partials: ${unresolved.join(', ')}.`);
  return `/* Generated from assets/css/bundle.css because the model referenced missing SCSS partials. */\n${bundleCss.replace(/\r\n/g, '\n').replace(/\n?$/, '\n')}`;
}

function writeFile(relativePath, content) {
  let cleanedPath = String(relativePath || '').trim().replace(/\\/g, '/');
  cleanedPath = cleanedPath.replace(/^\.\//, '');

  const themePrefix = `wp-content/themes/${themeSlug}/`;
  if (cleanedPath.startsWith(themePrefix)) {
    cleanedPath = cleanedPath.slice(themePrefix.length);
  }

  if (!cleanedPath) fail('Encountered an empty file path.');
  if (path.isAbsolute(cleanedPath) || cleanedPath.includes('..')) {
    fail(`Rejected unsafe file path: ${cleanedPath}`);
  }

  const target = path.resolve(themeDir, cleanedPath);
  if (!target.startsWith(themeDir + path.sep)) {
    fail(`Rejected path outside theme folder: ${cleanedPath}`);
  }

  if (cleanedPath === 'style.css') {
    warnings.push('Skipped model output for style.css; WordPress theme metadata is prepared deterministically.');
    return;
  }

  content = stripOuterCodeFences(content);
  content = removeFileBlockArtifacts(cleanedPath, content);
  if (content === null) return;
  content = stripAccidentalDiffPrefixes(cleanedPath, content);
  content = sanitizeRemoteReferences(content);
  content = sanitizeUnsupportedCssColorFunctions(cleanedPath, content);
  content = addMissingScssVariables(cleanedPath, content);
  content = normalizeScssEntrypoint(cleanedPath, content);
  if (content === null) return;
  content = ensureFinishedStyles(cleanedPath, content);
  content = stripForbiddenHeaderFooterSections(cleanedPath, content);
  content = sanitizeScaffoldOnlyCopy(normalizePhpTemplateContent(cleanedPath, content));
  if (!wrapperStructureIsValid(cleanedPath, content)) return;

  if (!phpSyntaxIsValid(cleanedPath, content)) return;

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
  if (cleanedPath === 'assets/css/bundle.css') latestBundleCss = content;
  count += 1;
}

while ((match = pattern.exec(input)) !== null) {
  writeFile(match[1], match[2]);
}

function stripTrailingLooseDelimiter(content) {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/\n---END FILE---\s*$/i, '\n')
    .replace(/\n---\s*$/g, '\n');
}

function salvageLooseFileBlocks(text) {
  const loosePattern = /^---FILE:\s*([^\r\n]+?)---\r?\n([\s\S]*?)(?=^---FILE:\s*[^\r\n]+?---|\s*$)/gm;
  let salvaged = 0;
  let looseMatch;
  while ((looseMatch = loosePattern.exec(text)) !== null) {
    const before = count;
    writeFile(looseMatch[1], stripTrailingLooseDelimiter(looseMatch[2]));
    if (count > before) salvaged += 1;
  }
  return salvaged;
}

function salvageMarkdownFileSections(text) {
  const sectionPattern = /^#{1,6}\s*FILE:\s*([^\r\n]+)\r?\n+\s*```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)\r?\n```/gm;
  let salvaged = 0;
  let sectionMatch;
  while ((sectionMatch = sectionPattern.exec(text)) !== null) {
    const before = count;
    writeFile(sectionMatch[1], `${sectionMatch[2].replace(/\r\n/g, '\n').replace(/\n?$/, '\n')}`);
    if (count > before) salvaged += 1;
  }
  return salvaged;
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1];

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) return text.slice(start, end + 1);
  return '';
}

function readJsonString(text, start) {
  let end = start + 1;
  let escaped = false;
  while (end < text.length) {
    const char = text[end];
    if (escaped) {
      escaped = false;
    } else if (char === '\\') {
      escaped = true;
    } else if (char === '"') {
      return { value: JSON.parse(text.slice(start, end + 1)), end: end + 1 };
    }
    end += 1;
  }
  return null;
}

function readContentLines(text, start) {
  const lines = [];
  let index = start;

  while (index < text.length) {
    while (index < text.length && /[\s,]/.test(text[index])) index += 1;
    if (text[index] === ']') return lines;
    if (text[index] !== '"') return lines;

    const parsed = readJsonString(text, index);
    if (!parsed) return lines;
    lines.push(parsed.value);
    index = parsed.end;
  }

  return lines;
}

function salvageJsonFiles(text) {
  const pathPattern = /"path"\s*:\s*"([^"]+)"/g;
  let salvaged = 0;
  let pathMatch;

  while ((pathMatch = pathPattern.exec(text)) !== null) {
    const nextPath = text.indexOf('"path"', pathPattern.lastIndex);
    const contentKey = text.indexOf('"content_lines"', pathPattern.lastIndex);
    if (contentKey === -1) continue;
    if (nextPath !== -1 && nextPath < contentKey) continue;

    const arrayStart = text.indexOf('[', contentKey);
    if (arrayStart === -1) continue;

    const lines = readContentLines(text, arrayStart + 1);
    if (lines.length === 0) continue;

    const before = count;
    writeFile(pathMatch[1], `${lines.map((line) => String(line)).join('\n')}\n`);
    if (count > before) salvaged += 1;
  }

  return salvaged;
}

function stripMarkdownOuterFence(content) {
  let stripped = content.replace(/\r\n/g, '\n').trim();
  stripped = stripped.replace(/^```[a-zA-Z0-9_-]*\n/, '');
  stripped = stripped.replace(/\n```\s*$/, '');
  return `${stripped.replace(/\n?$/, '\n')}`;
}

function salvageMarkdownHeadingFileBlocks(text) {
  const headingPattern = /^#{1,6}\s+([A-Za-z0-9_./-]+\.[A-Za-z0-9]+)\s*\r?\n+([\s\S]*?)\r?\n---END FILE---/gm;
  let salvaged = 0;
  let headingMatch;
  while ((headingMatch = headingPattern.exec(text)) !== null) {
    const before = count;
    writeFile(headingMatch[1], stripMarkdownOuterFence(headingMatch[2]));
    if (count > before) salvaged += 1;
  }
  return salvaged;
}

if (count === 0) {
  const looseFiles = salvageLooseFileBlocks(input);
  if (looseFiles > 0) {
    warnings.push(`Model output omitted END FILE markers; salvaged ${looseFiles} complete file block${looseFiles === 1 ? '' : 's'}.`);
  }
}

if (count === 0) {
  const markdownFiles = salvageMarkdownFileSections(input);
  if (markdownFiles > 0) {
    warnings.push(`Model output used markdown FILE headings; salvaged ${markdownFiles} complete file section${markdownFiles === 1 ? '' : 's'}.`);
  }
}

if (count === 0) {
  const headingFiles = salvageMarkdownHeadingFileBlocks(input);
  if (headingFiles > 0) {
    warnings.push(`Model output used markdown path headings; salvaged ${headingFiles} complete file section${headingFiles === 1 ? '' : 's'}.`);
  }
}

if (count === 0) {
  const jsonText = extractJson(input);
  if (jsonText) {
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (error) {
      const salvaged = salvageJsonFiles(jsonText);
      if (salvaged === 0) {
        fail(`Could not parse JSON file payload: ${error.message}`);
      }
      warnings.push(`JSON payload was malformed; salvaged ${salvaged} complete file entr${salvaged === 1 ? 'y' : 'ies'}.`);
    }

    if (parsed && !Array.isArray(parsed.files)) {
      fail('JSON payload must contain a files array.');
    }

    if (parsed) {
      for (const file of parsed.files) {
        if (!file || typeof file !== 'object') continue;
        let content = '';
        if (Array.isArray(file.content_lines)) {
          content = file.content_lines.map((line) => String(line)).join('\n');
        } else if (typeof file.content === 'string') {
          content = file.content;
        } else {
          fail(`File entry missing content or content_lines: ${file.path || '(unknown path)'}`);
        }
        writeFile(file.path, `${content.replace(/\r\n/g, '\n')}\n`);
      }
    }
  }
}

if (count === 0) {
  fail('No file blocks or JSON files payload were found.');
}

for (const warning of warnings) {
  console.warn(`WARNING: ${warning}`);
}

console.log(`Applied ${count} file block(s).`);
