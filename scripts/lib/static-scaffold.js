'use strict';
const { fs, path, PAGES, ensureDir, writeJson, titleFromSlug } = require('./workspace');
const VERSION = 'static-v1';
function scaffold(dir, slug) {
  if (fs.existsSync(dir)) throw new Error(`Output collision: ${slug}. Existing output will not be overwritten.`);
  ensureDir(dir);
  const title = titleFromSlug(slug);
  writeJson(path.join(dir, 'sample.json'), { schema: VERSION, slug, title, pages: PAGES });
  writeJson(path.join(dir, 'content.json'), { name: title, tagline: 'Replace with the business identity and content plan.' });
  const nav = PAGES.filter(p => p !== 'homepage_preview.html').map(p => `<a href="${p}">${p.replace('_preview.html', '').replace('.html', '')}</a>`).join('\n');
  for (const page of PAGES) fs.writeFileSync(path.join(dir, page), `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><link rel="stylesheet" href="assets/css/site.css"><script src="assets/js/site.js" defer></script></head><body>\n<header><nav aria-label="Main">${nav}</nav></header>\n<main id="main"><h1>${title}</h1><p data-scaffold>Replace this scaffold with a complete designed page.</p></main>\n<footer><a href="policy_preview.html">Privacy</a></footer>\n</body></html>\n`);
  ensureDir(path.join(dir, 'assets/css')); ensureDir(path.join(dir, 'assets/js'));
  fs.writeFileSync(path.join(dir, 'assets/css/site.css'), '/* Replace with the complete responsive design system. */\n');
  fs.writeFileSync(path.join(dir, 'assets/js/site.js'), "'use strict';\n// Implement accessible browser interactions.\n");
  fs.writeFileSync(path.join(dir, 'README.md'), `# ${title}\n\nStatic sample. Complete the design and document its demo interactions.\n`);
}
module.exports = { scaffold, VERSION };
