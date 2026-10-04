'use strict';
const { fs, path, ROOT, PREVIEWS, REPORTS, SLUG_RE, PAGES, readJson, titleFromSlug, ensureDir, treeHash } = require('./workspace');
const { renderGallery } = require('./gallery');
function inventory() {
  if (!fs.existsSync(PREVIEWS)) return [];
  return fs.readdirSync(PREVIEWS).filter(slug => SLUG_RE.test(slug)).sort().reverse().flatMap(slug => {
    const dir = path.join(PREVIEWS, slug); const metadata = path.join(dir, 'sample.json');
    const modern = fs.existsSync(metadata);
    if (modern) {
      const resultPath = path.join(REPORTS, slug, 'run.result.json');
      if (!fs.existsSync(resultPath)) return [];
      const result = readJson(resultPath);
      if (result.technicalValidation?.status !== 'passed' || result.browserChecks?.status !== 'passed' || result.visualReview?.status !== 'passed' || result.sampleHash !== treeHash(dir)) return [];
    }
    const pages = fs.readdirSync(dir).filter(p => p.endsWith('.html') && fs.statSync(path.join(dir, p)).isFile()).sort((a,b) => (PAGES.includes(a) ? PAGES.indexOf(a) : 99) - (PAGES.includes(b) ? PAGES.indexOf(b) : 99) || a.localeCompare(b));
    return pages.length ? [{ slug, title: modern ? readJson(metadata).title : titleFromSlug(slug), pages, kind: modern ? 'static' : 'legacy-wordpress' }] : [];
  });
}
function updateGallery() { ensureDir(PREVIEWS); const themes = inventory(); fs.writeFileSync(path.join(ROOT, 'docs/index.html'), renderGallery(themes)); console.log(`Local gallery updated: ${themes.length} samples. No deployment performed.`); return themes; }
module.exports = { inventory, updateGallery };
