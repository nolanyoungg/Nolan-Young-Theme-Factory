#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const [slug] = process.argv.slice(2);
const root = path.resolve(__dirname, '..');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!slug) fail('Usage: node scripts/generate-static-preview.js <theme-slug>');
if (!/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(slug)) fail(`Invalid theme slug: ${slug}`);

const themeDir = path.join(root, 'wp-content', 'themes', slug);
const previewDir = path.join(root, 'docs', 'Preview-Themes-Github', slug);
if (!fs.existsSync(themeDir)) fail(`Theme folder missing: wp-content/themes/${slug}`);

function readStyle(field) {
  const file = path.join(themeDir, 'style.css');
  if (!fs.existsSync(file)) return '';
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(new RegExp(`^${field}:\\s*(.+)$`, 'mi'));
  return match ? match[1].trim() : '';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function titleFromSlug(value) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function readThemeFile(relativePath) {
  const file = path.join(themeDir, relativePath);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function stripPhpToStatic(html) {
  return html
    .replace(/\r\n/g, '\n')
    .replace(/^<\?php[^\n]*\?>\n\?>\n/, '')
    .replace(/<\?php[\s\S]*?get_header\s*\([^)]*\)\s*;?[\s\S]*?\?>/g, '')
    .replace(/<\?php[\s\S]*?get_footer\s*\([^)]*\)\s*;?[\s\S]*?\?>/g, '')
    .replace(/<\?php[\s\S]*?wp_head\s*\([^)]*\)\s*;?[\s\S]*?\?>/g, '')
    .replace(/<\?php[\s\S]*?wp_footer\s*\([^)]*\)\s*;?[\s\S]*?\?>/g, '')
    .replace(/<\?php[\s\S]*?the_custom_logo\s*\([^)]*\)\s*;?[\s\S]*?\?>/g, '<span class="preview-logo-mark">NY</span>')
    .replace(/<\?php[\s\S]*?wp_nav_menu\s*\([\s\S]*?\)\s*;?[\s\S]*?\?>/g, '')
    .replace(/<\?php[\s\S]*?bloginfo\s*\([\s\S]*?\)\s*;?[\s\S]*?\?>/g, '')
    .replace(/<\?php[\s\S]*?body_class\s*\([\s\S]*?\)\s*;?[\s\S]*?\?>/g, '')
    .replace(/<\?php[\s\S]*?language_attributes\s*\([\s\S]*?\)\s*;?[\s\S]*?\?>/g, 'lang="en"')
    .replace(/<\?php[\s\S]*?\?>/g, '')
    .replace(/^\?>\s*/gm, '')
    .replace(/\bhref=(["'])\#\1/g, 'href="#"')
    .trim();
}

function copyIfExists(sourceRelative, targetRelative) {
  const source = path.join(themeDir, sourceRelative);
  if (!fs.existsSync(source)) return false;
  const target = path.join(previewDir, targetRelative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  return true;
}

const themeName = readStyle('Theme Name') || titleFromSlug(slug);
const description = readStyle('Description') || 'Generated WordPress theme preview.';
const pages = [
  ['index.html', 'Overview', 'front-page.php'],
  ['homepage_preview.html', 'Homepage', 'front-page.php'],
  ['services_preview.html', 'Services', 'page-templates/template-services.php'],
  ['about-us_preview.html', 'About', 'page-templates/template-about-us.php'],
  ['contact_preview.html', 'Contact', 'page-templates/template-contact.php'],
  ['single_services_preview.html', 'Single Service', 'page-templates/template-single-service.php'],
  ['blog_preview.html', 'Blog', 'page-templates/template-blog.php'],
  ['work_preview.html', 'Work', 'page-templates/template-work.php']
];

const nav = pages
  .filter(([file]) => file !== 'index.html')
  .map(([file, label]) => `<a href="${file}">${escapeHtml(label)}</a>`)
  .join('');

const fallbackCss = `:root{--ink:#111827;--paper:#f7f8fb;--accent:#2563eb;--line:#dbe3ee}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:system-ui,sans-serif;line-height:1.55}.container,.wrap{width:min(1120px,calc(100% - 40px));margin:0 auto}.preview-header{position:sticky;top:0;z-index:20;background:#fff;border-bottom:1px solid var(--line)}.preview-header-inner{min-height:74px;display:flex;align-items:center;justify-content:space-between;gap:24px}.preview-brand{font-weight:800}.preview-nav{display:flex;flex-wrap:wrap;gap:12px}.preview-nav a{color:var(--accent);font-weight:700;text-decoration:none}.preview-footer{padding:32px 0;border-top:1px solid var(--line);background:#fff}.hero,section{padding:56px 0}.btn-primary,.btn-secondary,.button{display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:800}@media(max-width:760px){.preview-header-inner{align-items:flex-start;flex-direction:column;padding:18px 0}}`;

fs.rmSync(previewDir, { recursive: true, force: true });
fs.mkdirSync(path.join(previewDir, 'assets', 'css'), { recursive: true });
fs.mkdirSync(path.join(previewDir, 'assets', 'js'), { recursive: true });
fs.mkdirSync(path.join(previewDir, 'assets', 'images'), { recursive: true });

if (!copyIfExists('assets/css/bundle.css', 'assets/css/preview.css')) {
  fs.writeFileSync(path.join(previewDir, 'assets', 'css', 'preview.css'), fallbackCss);
} else {
  fs.appendFileSync(path.join(previewDir, 'assets', 'css', 'preview.css'), `\n${fallbackCss}\n`);
}

copyIfExists('assets/js/bundle.js', 'assets/js/preview.js') || fs.writeFileSync(path.join(previewDir, 'assets', 'js', 'preview.js'), '');
fs.writeFileSync(path.join(previewDir, 'assets', 'images', 'README.md'), '# Preview Images\n\nPreview pages use generated theme CSS, local SVGs, and local theme assets.\n');
fs.writeFileSync(path.join(previewDir, 'README.md'), `# ${themeName}\n\nStatic preview for ${slug}.\n`);

function renderPage(file, label, sourceRelative) {
  const source = readThemeFile(sourceRelative) || readThemeFile('index.php');
  const body = stripPhpToStatic(source) || `<main><section class="hero"><div class="container"><h1>${escapeHtml(label)}</h1><p>${escapeHtml(description)}</p></div></section></main>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(themeName)} - ${escapeHtml(label)}</title>
    <link rel="stylesheet" href="assets/css/preview.css">
  </head>
  <body>
    <header class="preview-header" data-nolan-menu-header>
      <div class="container preview-header-inner">
        <a class="preview-brand" href="homepage_preview.html">${escapeHtml(themeName)}</a>
        <nav class="preview-nav" aria-label="Preview navigation">${nav}</nav>
      </div>
    </header>
${body}
    <footer class="preview-footer">
      <div class="container">
        <strong>${escapeHtml(themeName)}</strong>
        <p>${escapeHtml(description)}</p>
      </div>
    </footer>
    <script src="assets/js/preview.js"></script>
  </body>
</html>`;
}

for (const [file, label, sourceRelative] of pages) {
  fs.writeFileSync(path.join(previewDir, file), renderPage(file, label, sourceRelative));
}

console.log(`Generated docs/Preview-Themes-Github/${slug}`);
