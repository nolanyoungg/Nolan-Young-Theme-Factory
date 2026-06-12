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

const themeName = readStyle('Theme Name') || slug;
const description = readStyle('Description') || 'Generated WordPress theme preview.';
const pages = [
  ['index.html', 'Overview'],
  ['homepage_preview.html', 'Homepage'],
  ['services_preview.html', 'Services'],
  ['about-us_preview.html', 'About'],
  ['contact_preview.html', 'Contact'],
  ['single_services_preview.html', 'Single Service'],
  ['blog_preview.html', 'Blog'],
  ['work_preview.html', 'Work']
];

const nav = pages
  .map(([file, label]) => `<a href="${file}">${escapeHtml(label)}</a>`)
  .join('');

const css = `:root{--ink:#17201c;--paper:#f7f8f5;--accent:#1d6b5d;--line:#d8dfd8}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:system-ui,sans-serif;line-height:1.55}.wrap{width:min(1120px,calc(100% - 40px));margin:0 auto}.site-header{padding:24px 0;border-bottom:1px solid var(--line)}.brand{font-weight:800}.nav{display:flex;flex-wrap:wrap;gap:12px;margin-top:16px}.nav a{color:var(--accent);font-weight:700;text-decoration:none}.hero{padding:80px 0}.hero h1{max-width:820px;font-size:4rem;line-height:1;margin:0 0 18px}.section{padding:42px 0;border-top:1px solid var(--line)}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px}.card{padding:20px;border:1px solid var(--line);border-radius:8px;background:#fff}@media(max-width:720px){.hero h1{font-size:2.5rem}}`;

function page(title) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(themeName)} - ${escapeHtml(title)}</title>
    <link rel="stylesheet" href="assets/css/preview.css">
  </head>
  <body>
    <header class="site-header">
      <div class="wrap">
        <div class="brand">${escapeHtml(themeName)}</div>
        <nav class="nav" aria-label="Preview navigation">${nav}</nav>
      </div>
    </header>
    <main>
      <section class="hero">
        <div class="wrap">
          <p>${escapeHtml(slug)}</p>
          <h1>${escapeHtml(title)} Preview</h1>
          <p>${escapeHtml(description)}</p>
        </div>
      </section>
      <section class="section">
        <div class="wrap grid">
          <article class="card"><h2>Design</h2><p>Static preview generated from the prepared WordPress theme folder.</p></article>
          <article class="card"><h2>Content</h2><p>Generation should replace template filler with prompt-specific website content.</p></article>
          <article class="card"><h2>Assets</h2><p>Theme assets must remain local and live inside the generated theme folder.</p></article>
        </div>
      </section>
    </main>
  </body>
</html>`;
}

fs.mkdirSync(path.join(previewDir, 'assets', 'css'), { recursive: true });
fs.writeFileSync(path.join(previewDir, 'assets', 'css', 'preview.css'), css);
fs.mkdirSync(path.join(previewDir, 'assets', 'js'), { recursive: true });
fs.writeFileSync(path.join(previewDir, 'assets', 'js', 'preview.js'), '');
fs.mkdirSync(path.join(previewDir, 'assets', 'images'), { recursive: true });
fs.writeFileSync(path.join(previewDir, 'assets', 'images', 'README.md'), '# Preview Images\n\nLocal preview images may be copied here after generation.\n');
fs.writeFileSync(path.join(previewDir, 'README.md'), `# ${themeName}\n\nStatic preview for ${slug}.\n`);

for (const [file, title] of pages) {
  fs.writeFileSync(path.join(previewDir, file), page(title));
}

console.log(`Generated docs/Preview-Themes-Github/${slug}`);
