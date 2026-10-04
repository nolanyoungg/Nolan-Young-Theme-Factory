'use strict';
const { fs, path, PAGES, walk, normalizeRelativeFile, ensureInside } = require('./workspace');
const { spawnSync } = require('node:child_process');
const METADATA = ['id', 'file', 'source', 'source_url', 'license', 'license_url', 'creator', 'creator_url', 'acquired_at', 'allowed_use', 'theme_slug', 'alt_text', 'notes'];
const decode = text => text.replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&#x([a-f0-9]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
function attributes(tag) {
  const result = {};
  for (const m of tag.matchAll(/\s([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) result[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4]);
  return result;
}
function validateStatic(dir, { legacy = false, candidate = false } = {}) {
  const errors = []; const warnings = []; let files;
  try { files = walk(dir); } catch (error) { return { status: 'failed', errors: [error.message], warnings }; }
  const relative = f => path.relative(dir, f).replace(/\\/g, '/');
  const html = new Map(files.filter(f => f.endsWith('.html')).map(f => [f, fs.readFileSync(f, 'utf8')]));
  const approved = new Set();
  if (!candidate) {
    for (const name of PAGES) if (!html.has(path.join(dir, name)) || !html.get(path.join(dir, name)).trim()) errors.push(`Missing or empty page: ${name}`);
    try {
      const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'assets/images/asset-manifest.json'), 'utf8'));
      if (!Array.isArray(manifest.assets) || !manifest.assets.length) throw new Error('Approved asset list is empty.');
      for (const asset of manifest.assets) {
        for (const key of METADATA) if (typeof asset[key] !== 'string' || !asset[key].trim()) errors.push(`Asset ${asset.id}: missing ${key}`);
        const name = normalizeRelativeFile(asset.file); approved.add(name);
        const target = path.join(dir, name); ensureInside(dir, target);
        if (!fs.existsSync(target) || !fs.statSync(target).size) errors.push(`Missing approved asset: ${name}`);
      }
    } catch (error) { errors.push(`Asset manifest: ${error.message}`); }
  }
  function reference(from, value, resource = false) {
    if (!value || /^(?:mailto:|tel:)/i.test(value)) return;
    if (/^(?:https?:)?\/\//i.test(value)) { if (resource) errors.push(`Unapproved remote resource in ${relative(from)}: ${value}`); return; }
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) { errors.push(`Unsupported resource/link scheme in ${relative(from)}: ${value.slice(0, 80)}`); return; }
    try {
      const [route, fragment] = value.split('#');
      const clean = decodeURIComponent(route.split('?')[0]);
      if (clean.startsWith('/') || clean.includes('\\')) throw new Error('Use sample-relative URLs, not root/Windows paths');
      let target = clean ? path.resolve(path.dirname(from), clean) : from;
      ensureInside(dir, target);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target) || !fs.statSync(target).isFile() || !fs.statSync(target).size) throw new Error('Missing or empty target');
      if (fragment && html.has(target)) {
        const id = decodeURIComponent(fragment);
        const ids = [...html.get(target).matchAll(/<[a-z][^>]*>/gi)].map(m => attributes(m[0])).flatMap(a => [a.id, a.name]);
        if (!ids.includes(id)) throw new Error(`Missing fragment #${id}`);
      }
      if (!legacy && !candidate && /\.(?:jpe?g|png|webp|avif|gif|svg)$/i.test(target) && !approved.has(relative(target))) throw new Error('Image is absent from approved manifest');
    } catch (error) { errors.push(`${relative(from)} → ${value}: ${error.message}`); }
  }
  for (const file of files) {
    const name = relative(file);
    if (!legacy && !/^(?:[^/]+\.html|README\.md|content\.json|sample\.json|assets\/(?:css\/[^/]+\.css|js\/[^/]+\.js|(?:images|icons)\/[a-zA-Z0-9_./-]+))$/.test(name)) errors.push(`Unexpected public static file: ${name}`);
    if (!legacy && !candidate && /^assets\/(?:images|icons)\//.test(name) && name !== 'assets/images/asset-manifest.json' && !approved.has(name)) errors.push(`Unapproved asset file: ${name}`);
    if (!legacy && (/\.(php|zip|scss|lock)$/i.test(name) || /(?:^|\/)(?:node_modules|reports|wp-content|\.codex|\.agents)(?:\/|$)/i.test(name) || /(?:codex\.log|run\..*json|package.*json)$/.test(name))) errors.push(`Forbidden static output: ${name}`);
    if (/\.(html|css|js|json|md)$/.test(file) && !fs.statSync(file).size) errors.push(`Empty source: ${name}`);
    if (/\.json$/.test(file)) { try { JSON.parse(fs.readFileSync(file, 'utf8')); } catch { errors.push(`Invalid JSON: ${name}`); } }
    if (/\.js$/.test(file)) {
      const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
      if (result.status !== 0) errors.push(`JavaScript syntax: ${name}: ${result.stderr}`);
    }
    if (candidate) continue;
    if (/\.html$/.test(file)) {
      const source = html.get(file);
      if (!/<html\b[^>]*\blang=/i.test(source) || !/<title>[^<]+<\/title>/i.test(source) || !/<h1\b/i.test(source) || !/name=["']viewport["']/i.test(source)) errors.push(`Missing language, title, h1 or viewport: ${name}`);
      if (!legacy && /data-scaffold|Replace this scaffold/.test(source)) errors.push(`Unfinished scaffold: ${name}`);
      const seen = new Set();
      for (const match of source.matchAll(/<[a-z][^>]*>/gi)) {
        const a = attributes(match[0]); const tag = /^<(\w+)/.exec(match[0])[1].toLowerCase();
        if (a.id) { if (seen.has(a.id)) errors.push(`Duplicate id ${a.id}: ${name}`); seen.add(a.id); }
        if (tag === 'base') errors.push(`Base URL overrides are not supported: ${name}`);
        for (const key of ['href', 'src', 'poster', 'action']) if (a[key]) reference(file, a[key], key !== 'href' || tag === 'link');
        if (a.srcset) for (const src of a.srcset.split(',')) reference(file, src.trim().split(/\s+/)[0], true);
        if (tag === 'img' && a.alt === undefined) errors.push(`Image without alt: ${name}`);
      }
    }
    if (/\.(css|html)$/.test(file)) for (const match of fs.readFileSync(file, 'utf8').matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)|@import\s+["']([^"']+)["']/gi)) reference(file, match[1] || match[2], true);
  }
  return { status: errors.length ? 'failed' : 'passed', errors: [...new Set(errors)], warnings, pages: html.size, files: files.length };
}
module.exports = { validateStatic, attributes };
