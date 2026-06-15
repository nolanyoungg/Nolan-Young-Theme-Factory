#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const [templateName, outputJson] = process.argv.slice(2);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!templateName || !outputJson) {
  fail('Usage: node scripts/create-template-manifest.js <template-name> <output-json>');
}

if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(templateName) || templateName.includes('..') || /[\\/]/.test(templateName)) {
  fail(`Unsafe template name: ${templateName}`);
}

const templateRoot = path.join(root, 'wordpress-themplate-themes', templateName);
if (!fs.existsSync(templateRoot)) fail(`Template not found: wordpress-themplate-themes/${templateName}`);

const requiredFiles = [];
const requiredDirectories = [];
const ignored = ['node_modules', '.git', '.generation', 'reports'];

function walk(dir, rel = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (ignored.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const nextRel = rel ? path.posix.join(rel, entry.name) : entry.name;
    if (entry.isDirectory()) {
      requiredDirectories.push(nextRel);
      walk(full, nextRel);
    } else if (!/\.(log|tmp|swp|bak|map)$/i.test(entry.name)) {
      requiredFiles.push(nextRel);
    }
  }
}

walk(templateRoot);

const manifest = {
  manifest_version: 1,
  created_at: new Date().toISOString(),
  template_name: templateName,
  normalized_template_root: path.posix.join('wordpress-themplate-themes', templateName),
  required_files: requiredFiles.sort(),
  required_directories: requiredDirectories.sort(),
  ignored_entries: ignored
};

const outputPath = path.isAbsolute(outputJson) ? outputJson : path.join(root, outputJson);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(path.relative(root, outputPath).replace(/\\/g, '/'));
