'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '../..');
const SLUG_RE = /^\d{3,}_nolan_young_theme_[a-z0-9]+(?:_[a-z0-9]+)*$/;
const PREVIEWS = path.join(ROOT, 'docs/Preview-Themes-Github');
const REPORTS = path.join(ROOT, 'reports/static');
const PAGES = ['index.html', 'homepage_preview.html', 'about-us_preview.html', 'services_preview.html', 'work_preview.html', 'blog_preview.html', 'contact_preview.html', 'policy_preview.html', 'single_services_preview.html'];
const ensureDir = dir => fs.mkdirSync(dir, { recursive: true });
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function writeJson(file, value) { ensureDir(path.dirname(file)); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); }
const relative = file => path.relative(ROOT, file).replace(/\\/g, '/');
function normalizeRelativeFile(input) {
  if (typeof input !== 'string' || !input || /[\\:\x00-\x1f]/.test(input) || input.startsWith('/') || input.split('/').some(p => !p || p === '.' || p === '..')) throw new Error(`Unsafe relative path: ${input}`);
  return input;
}
function ensureInside(parent, child) {
  const rel = path.relative(path.resolve(parent), path.resolve(child));
  if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('Path escapes its allowed directory.');
  let current = path.resolve(child);
  while (true) {
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error('Symlink/junction paths are not allowed.');
    if (current === path.resolve(parent)) break;
    const next = path.dirname(current); if (next === current) throw new Error('Invalid path boundary.'); current = next;
  }
}
function requireSlug(slug) { if (!SLUG_RE.test(slug || '')) throw new Error('Supply a numbered --sample-slug (NNN_nolan_young_theme_description).'); return slug; }
function sampleDir(slug) { const dir = path.join(PREVIEWS, requireSlug(slug)); ensureInside(PREVIEWS, dir); return dir; }
function titleFromSlug(slug) { return slug.replace(/^\d+_nolan_young_theme_/, '').split('_').map(s => s[0].toUpperCase() + s.slice(1)).join(' '); }
function nextSlug(description) {
  const used = [];
  for (const root of [PREVIEWS, path.join(ROOT, 'wp-content/themes'), REPORTS, path.join(ROOT, 'reports/runs'), path.join(ROOT, 'reports/conversions'), path.join(ROOT, 'dist/zipped-themes')]) {
    if (fs.existsSync(root)) used.push(...fs.readdirSync(root).map(n => /^(\d+)_/.exec(n)?.[1]).filter(Boolean).map(Number));
  }
  const words = description.toLowerCase().replace(/^\d+[-_ ]*/, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'sample';
  return `${String(Math.max(-1, ...used) + 1).padStart(3, '0')}_nolan_young_theme_${words}`;
}
function walk(root, skip = new Set(['.git', 'node_modules'])) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    if (skip.has(entry.name)) return [];
    const full = path.join(root, entry.name);
    if (fs.lstatSync(full).isSymbolicLink()) throw new Error(`Symlink not allowed: ${relative(full)}`);
    return entry.isDirectory() ? walk(full, skip) : [full];
  });
}
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
function treeHash(dir) { return hash(walk(dir).sort().map(f => `${path.relative(dir, f)}:${hash(fs.readFileSync(f))}`).join('\n')); }
function assertStatus(result, label) { if (result.error || result.status !== 0) throw new Error(`${label}: ${result.error?.message || result.stderr || result.stdout || result.status}`); }
module.exports = { fs, path, crypto, ROOT, SLUG_RE, PREVIEWS, REPORTS, PAGES, ensureDir, readJson, writeJson, relative, normalizeRelativeFile, ensureInside, requireSlug, sampleDir, nextSlug, titleFromSlug, walk, hash, treeHash, assertStatus };
