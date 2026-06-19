#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('../lib/repo-root');

const docsDir = path.join(root, 'docs');
const themesRoot = path.join(root, 'wp-content', 'themes');
const zipRoot = path.join(root, 'dist', 'zipped-themes');
const previewRoot = path.join(docsDir, 'Preview-Themes-Github');
const indexPath = path.join(docsDir, 'index.html');
const reportsRoot = path.join(root, 'reports', 'runs');

fs.mkdirSync(previewRoot, { recursive: true });

function listSlugs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => /^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(name));
}

function workflowStatus(slug) {
  const statePath = path.join(reportsRoot, slug, 'workflow.state.json');
  if (!fs.existsSync(statePath)) return '';
  try {
    return JSON.parse(fs.readFileSync(statePath, 'utf8')).status || '';
  } catch (error) {
    return '';
  }
}

function includeThemeSlug(slug) {
  const hasPreview = fs.existsSync(path.join(previewRoot, slug, 'homepage_preview.html')) || fs.existsSync(path.join(previewRoot, slug, 'index.html'));
  const status = workflowStatus(slug);
  if (hasPreview) return true;
  if (['completed'].includes(status)) return false;
  return !['codex-build-pending', 'codex-finish-pending', 'codex-repair-pending', 'failed'].includes(status);
}

const slugs = Array.from(new Set([...listSlugs(themesRoot).filter(includeThemeSlug), ...listSlugs(previewRoot)])).filter((slug) => {
  return fs.existsSync(path.join(previewRoot, slug, 'homepage_preview.html')) || fs.existsSync(path.join(previewRoot, slug, 'index.html'));
}).sort();

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function readStyle(slug, field) {
  const stylePath = path.join(themesRoot, slug, 'style.css');
  if (!fs.existsSync(stylePath)) return '';
  const match = fs.readFileSync(stylePath, 'utf8').match(new RegExp(`^${field}:\\s*(.+)$`, 'mi'));
  return match ? match[1].trim() : '';
}

function titleFromSlug(slug) {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function tagsFromSlug(slug) {
  return slug.replace(/^[0-9]{3}_nolan_young_theme_/, '').split('_').filter((part) => part.length > 2).slice(0, 4);
}

function status(label, ok) {
  return `<span class="status-pill ${ok ? 'is-ok' : 'is-missing'}">${escapeHtml(label)}</span>`;
}

const cards = slugs.length ? slugs.map((slug) => {
  const previewFolder = path.join(previewRoot, slug);
  const themeFolder = path.join(themesRoot, slug);
  const target = fs.existsSync(path.join(previewFolder, 'homepage_preview.html'))
    ? `Preview-Themes-Github/${slug}/homepage_preview.html`
    : `Preview-Themes-Github/${slug}/index.html`;
  const hasPreview = fs.existsSync(path.join(docsDir, target));
  const hasTheme = fs.existsSync(themeFolder);
  const hasZip = fs.existsSync(path.join(zipRoot, `${slug}.zip`));
  const themeName = readStyle(slug, 'Theme Name') || titleFromSlug(slug);
  const description = readStyle(slug, 'Description') || 'Generated WordPress theme preview.';
  const tags = tagsFromSlug(slug).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');

  return `        <article class="theme-card">
          <div class="theme-card__preview">
            ${hasPreview ? `<iframe title="${escapeHtml(themeName)} preview" src="${escapeHtml(target)}" loading="lazy"></iframe>` : '<div class="preview-missing">Preview pending</div>'}
          </div>
          <div class="theme-card__body">
            <p class="eyebrow">${escapeHtml(slug)}</p>
            <h3>${escapeHtml(themeName)}</h3>
            <p>${escapeHtml(description)}</p>
            <div class="tag-row">${tags}</div>
            <div class="status-row">${status('Theme', hasTheme)}${status('Preview', hasPreview)}${status('ZIP', hasZip)}</div>
            <p><a class="open-preview" href="${escapeHtml(target)}">Open Preview</a></p>
          </div>
        </article>`;
}).join('\n') : `        <article class="empty-state" data-empty-state><h3>No previews yet</h3><p>Generated previews will appear here.</p></article>`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nolan Young Theme Preview Gallery</title>
    <link rel="stylesheet" href="assets/css/gallery.css">
  </head>
  <body>
    <header class="site-header">
      <p class="eyebrow">GitHub Pages Previews</p>
      <h1>Preview Themes</h1>
      <p class="lede">Browse generated WordPress themes with embedded static previews, release status, tags, and direct preview links.</p>
    </header>
    <main>
      <section class="gallery-intro">
        <h2>Generated Theme Previews</h2>
        <p>Theme source stays in <code>wp-content/themes</code>, ZIP files stay in <code>dist/zipped-themes</code>, and previews stay in <code>docs/Preview-Themes-Github</code>.</p>
      </section>
      <section class="theme-grid" data-theme-grid>${cards}
      </section>
    </main>
    <footer class="site-footer"><p>Generated by the Nolan Young Theme Factory.</p></footer>
    <script src="assets/js/gallery.js"></script>
  </body>
</html>
`;

fs.writeFileSync(indexPath, html, 'utf8');
console.log(`Rebuilt docs/index.html with ${slugs.length} preview(s).`);
