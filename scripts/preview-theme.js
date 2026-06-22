#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('./lib/repo-root');
const { parseArgs, arg, flag } = require('./lib/args');
const { assertThemeSlug } = require('./lib/theme-utils');

const args = parseArgs(process.argv.slice(2));
const themeSlug = arg(args, 'theme-slug', args._[0] || '');
const rebuildIndex = flag(args, 'rebuild-index');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function escapeHtml(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function readStyle(themeDir, field) {
  const stylePath = path.join(themeDir, 'style.css');
  if (!fs.existsSync(stylePath)) return '';
  const match = fs.readFileSync(stylePath, 'utf8').match(new RegExp(`^${field}:\\s*(.+)$`, 'mi'));
  return match ? match[1].trim() : '';
}

function titleFromSlug(slug) {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function copyIfExists(source, target) {
  if (!fs.existsSync(source)) return false;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
  return true;
}

function previewHtml({ slug, title, description, pageTitle }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(pageTitle)} - ${escapeHtml(title)}</title>
    <link rel="stylesheet" href="assets/css/preview.css">
  </head>
  <body>
    <header class="site-header">
      <a class="site-brand" href="homepage_preview.html">${escapeHtml(title)}</a>
      <nav><a href="services_preview.html">Services</a><a href="about-us_preview.html">About</a><a href="contact_preview.html">Contact</a></nav>
    </header>
    <main>
      <section class="hero">
        <p class="eyebrow">${escapeHtml(slug)}</p>
        <h1>${escapeHtml(pageTitle)}</h1>
        <p>${escapeHtml(description || 'Generated WordPress theme preview.')}</p>
      </section>
      <section class="preview-grid">
        <article><h2>Design System</h2><p>Static preview generated from the theme metadata and bundled local assets.</p></article>
        <article><h2>Theme Files</h2><p>Source remains in wp-content/themes/${escapeHtml(slug)} and is not modified by preview generation.</p></article>
        <article><h2>Artifact Status</h2><p>Use validation for exact template, ZIP, PHP, and quality findings.</p></article>
      </section>
    </main>
    <script src="assets/js/preview.js"></script>
  </body>
</html>
`;
}

function generatePreview(options = {}) {
  const slug = assertThemeSlug(options.themeSlug || themeSlug);
  const themeDir = path.join(root, 'wp-content', 'themes', slug);
  const previewDir = path.join(root, 'docs', 'Preview-Themes-Github', slug);
  if (!fs.existsSync(themeDir)) fail(`Theme folder missing: wp-content/themes/${slug}`);

  const title = readStyle(themeDir, 'Theme Name') || titleFromSlug(slug);
  const description = readStyle(themeDir, 'Description') || 'Generated WordPress theme preview.';
  fs.rmSync(previewDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(previewDir, 'assets', 'css'), { recursive: true });
  fs.mkdirSync(path.join(previewDir, 'assets', 'js'), { recursive: true });
  fs.mkdirSync(path.join(previewDir, 'assets', 'images'), { recursive: true });
  fs.mkdirSync(path.join(previewDir, 'assets', 'icons'), { recursive: true });

  copyIfExists(path.join(themeDir, 'assets', 'css', 'bundle.css'), path.join(previewDir, 'assets', 'css', 'preview.css'));
  copyIfExists(path.join(themeDir, 'assets', 'js', 'bundle.js'), path.join(previewDir, 'assets', 'js', 'preview.js'));
  copyIfExists(path.join(themeDir, 'assets', 'images'), path.join(previewDir, 'assets', 'images'));
  copyIfExists(path.join(themeDir, 'assets', 'icons'), path.join(previewDir, 'assets', 'icons'));
  if (!fs.existsSync(path.join(previewDir, 'assets', 'css', 'preview.css'))) {
    fs.writeFileSync(path.join(previewDir, 'assets', 'css', 'preview.css'), 'body{font-family:system-ui,sans-serif;margin:0;color:#111827}.site-header{display:flex;justify-content:space-between;padding:24px;border-bottom:1px solid #e5e7eb}.site-header a{color:inherit;text-decoration:none;margin-left:16px}.hero{padding:64px 24px;max-width:900px}.hero h1{font-size:clamp(2rem,5vw,4rem);margin:0 0 16px}.eyebrow{text-transform:uppercase;letter-spacing:.08em;color:#64748b}.preview-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;padding:24px}.preview-grid article{border:1px solid #e5e7eb;padding:20px;border-radius:8px}', 'utf8');
  }
  if (!fs.existsSync(path.join(previewDir, 'assets', 'js', 'preview.js'))) fs.writeFileSync(path.join(previewDir, 'assets', 'js', 'preview.js'), '', 'utf8');

  const pages = [
    ['index.html', 'Overview'],
    ['homepage_preview.html', 'Homepage Preview'],
    ['services_preview.html', 'Services Preview'],
    ['about-us_preview.html', 'About Preview'],
    ['contact_preview.html', 'Contact Preview'],
    ['single_services_preview.html', 'Single Service Preview'],
    ['blog_preview.html', 'Blog Preview'],
    ['work_preview.html', 'Work Preview'],
    ['policy_preview.html', 'Policy Preview']
  ];
  for (const [file, pageTitle] of pages) {
    fs.writeFileSync(path.join(previewDir, file), previewHtml({ slug, title, description, pageTitle }), 'utf8');
  }
  fs.writeFileSync(path.join(previewDir, 'README.md'), `# ${title}\n\nStatic preview for ${slug}.\n`, 'utf8');
  console.log(`Generated docs/Preview-Themes-Github/${slug}`);
  return { preview_dir: previewDir };
}

function listSlugs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => /^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(name));
}

function rebuildPreviewGallery() {
  const docsDir = path.join(root, 'docs');
  const previewRoot = path.join(docsDir, 'Preview-Themes-Github');
  const themesRoot = path.join(root, 'wp-content', 'themes');
  const zipRoot = path.join(root, 'dist', 'zipped-themes');
  fs.mkdirSync(previewRoot, { recursive: true });
  const slugs = listSlugs(previewRoot).filter((slug) => fs.existsSync(path.join(previewRoot, slug, 'index.html'))).sort();
  const cards = slugs.map((slug) => {
    const themeDir = path.join(themesRoot, slug);
    const title = readStyle(themeDir, 'Theme Name') || titleFromSlug(slug);
    const description = readStyle(themeDir, 'Description') || 'Generated WordPress theme preview.';
    const zip = fs.existsSync(path.join(zipRoot, `${slug}.zip`)) ? 'ZIP ready' : 'ZIP missing';
    return `<article class="theme-card"><iframe title="${escapeHtml(title)} preview" src="Preview-Themes-Github/${escapeHtml(slug)}/index.html" loading="lazy"></iframe><div><p>${escapeHtml(slug)}</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p><a href="Preview-Themes-Github/${escapeHtml(slug)}/homepage_preview.html">Open Preview</a><span>${zip}</span></div></article>`;
  }).join('\n');
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Nolan Young Theme Preview Gallery</title><link rel="stylesheet" href="assets/css/gallery.css"></head>
<body><header class="site-header"><h1>Preview Themes</h1><p>Generated WordPress theme previews.</p></header><main class="theme-grid">${cards || '<p>No previews yet.</p>'}</main></body></html>
`;
  fs.writeFileSync(path.join(docsDir, 'index.html'), html, 'utf8');
  console.log(`Rebuilt docs/index.html with ${slugs.length} preview(s).`);
  return { count: slugs.length };
}

async function previewTheme(options = {}) {
  let preview = null;
  if (options.themeSlug || themeSlug) preview = generatePreview({ themeSlug: options.themeSlug || themeSlug });
  let index = null;
  if (options.rebuildIndex || rebuildIndex) index = rebuildPreviewGallery();
  return { preview, index };
}

if (require.main === module) {
  if (!themeSlug && !rebuildIndex) fail('Usage: node scripts/preview-theme.js --theme-slug <slug> [--rebuild-index]');
  previewTheme().catch((error) => fail(error.message));
}

module.exports = { generatePreview, rebuildPreviewGallery, previewTheme };
