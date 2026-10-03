'use strict';

const fs = require('node:fs');
const path = require('node:path');

const PAGE_LABELS = {
  'index.html': 'Home', 'homepage_preview.html': 'Homepage',
  'about-us_preview.html': 'About', 'services_preview.html': 'Services',
  'work_preview.html': 'Work', 'blog_preview.html': 'Journal',
  'contact_preview.html': 'Contact', 'policy_preview.html': 'Privacy',
  'single_services_preview.html': 'Service detail'
};
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function renderGallery(themes) {
  const cards = themes.map(({ slug, title, pages }, index) => {
    const name = title.replace(/^\d{3}\s+Nolan Young Theme\s+/i, '');
    const base = `Preview-Themes-Github/${encodeURIComponent(slug)}/`;
    const home = pages.includes('index.html') ? 'index.html' : pages[0];
    const frame = `preview-${slug}`;
    return `<article class="card" id="theme-${slug}" data-search="${escape(name.toLowerCase())}">
      <div class="browser-bar"><span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="browser-label">Interactive preview <span aria-hidden="true">/</span> <span data-current-page>${escape(PAGE_LABELS[home] || home)}</span></span><div class="view-controls" aria-label="Preview width"><button type="button" data-width="desktop" aria-pressed="true">Desktop</button><button type="button" data-width="mobile" aria-pressed="false">Mobile</button></div></div>
      <nav class="page-nav" aria-label="${escape(name)} pages">${pages.map((page) => `<a href="${base}${encodeURIComponent(page)}" target="${frame}"${page === home ? ' aria-current="page"' : ''}>${escape(PAGE_LABELS[page] || page.replace(/[_-]/g, ' ').replace(/\.html$/, ''))}</a>`).join('')}</nav>
      <div class="preview"><iframe name="${frame}" title="${escape(name)} interactive website" src="${base}${encodeURIComponent(home)}" loading="${index === 0 ? 'eager' : 'lazy'}"></iframe></div>
      <div class="card-info"><div><p class="eyebrow">${slug.startsWith('000_') ? 'Starter template' : `Theme ${slug.slice(0, 3)}`} <span aria-hidden="true">/</span> ${pages.length} pages to explore</p><h2>${escape(name)}</h2></div><a class="open-link" data-open-preview href="${base}${encodeURIComponent(home)}" target="_blank" rel="noopener">Open full preview <span aria-hidden="true">↗</span></a></div>
    </article>`;
  }).join('\n');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Explore Nolan Young's WordPress theme collection. Browse complete websites, switch pages, and try desktop and mobile previews."><title>Theme Collection — Nolan Young</title><style>${fs.readFileSync(path.join(__dirname, 'gallery.css'), 'utf8')}</style></head>
<body><a class="skip-link" href="#collection">Skip to themes</a><header class="masthead"><a class="wordmark" href="#" aria-label="Nolan Young Theme Factory home"><span class="brand-mark" aria-hidden="true">ny.</span><span>NOLAN YOUNG<br><small>THEME FACTORY</small></span></a><a class="collection-link" href="#collection">Explore the collection <span aria-hidden="true">↘</span></a></header>
<main><section class="intro"><p class="eyebrow"><span class="live-dot" aria-hidden="true"></span> The WordPress collection</p><h1>Different businesses.<br><em>Distinct perspectives.</em></h1><div class="intro-bottom"><p>Real themes. Complete websites. Step inside a design, explore every page, and find a direction that feels like you.</p><span class="collection-count"><strong>${String(themes.length).padStart(2, '0')}</strong> designs in the collection</span></div></section>
<section id="collection" class="collection" aria-label="Theme collection"><div class="collection-toolbar"><div><h2>Explore the themes</h2><p id="results" role="status">${themes.length} themes · Browse each website right here</p></div><label class="search-label">Find a theme<input type="search" id="theme-search" placeholder="Search by name…" aria-controls="theme-grid"></label></div><div id="theme-grid">${cards || '<p>No previews are available yet.</p>'}</div><p id="empty-state" hidden>No themes match that name. Try another search.</p></section></main>
<footer class="footer"><span>Nolan Young <span aria-hidden="true">/</span> Theme Factory</span><p>Static WordPress demos. Forms and checkout require a live WordPress installation.</p><a href="#">Back to top ↑</a></footer><script>${fs.readFileSync(path.join(__dirname, 'gallery-client.js'), 'utf8')}</script></body></html>\n`;
}

module.exports = { renderGallery };
