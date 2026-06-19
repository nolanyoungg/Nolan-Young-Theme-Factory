#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('../lib/repo-root');

const docsDir = path.join(root, 'docs');
const themesRoot = path.join(root, 'wp-content', 'themes');
const previewRoot = path.join(docsDir, 'Preview-Themes-Github');
const indexPath = path.join(docsDir, 'index.html');
const reportsRoot = path.join(root, 'reports', 'runs');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function listThemeSlugs() {
  if (!fs.existsSync(themesRoot)) return [];
  return fs.readdirSync(themesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => /^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(name))
    .filter((name) => shouldRequirePreview(name))
    .sort();
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

function shouldRequirePreview(slug) {
  const previewDir = path.join(previewRoot, slug);
  const hasPreview = fs.existsSync(path.join(previewDir, 'homepage_preview.html')) || fs.existsSync(path.join(previewDir, 'index.html'));
  const status = workflowStatus(slug);
  if (hasPreview) return true;
  return !['codex-build-pending', 'codex-finish-pending', 'codex-repair-pending', 'failed'].includes(status);
}

if (!fs.existsSync(indexPath)) {
  fail('docs/index.html is missing. Run: node scripts/preview/rebuild-preview-gallery.js');
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const missing = [];

for (const slug of listThemeSlugs()) {
  const previewDir = path.join(previewRoot, slug);
  const homepage = path.join(previewDir, 'homepage_preview.html');
  const fallback = path.join(previewDir, 'index.html');
  const expectedLink = `Preview-Themes-Github/${slug}/`;

  if (!fs.existsSync(homepage) && !fs.existsSync(fallback)) {
    missing.push(`${slug}: missing preview HTML`);
    continue;
  }

  if (!indexHtml.includes(slug) || !indexHtml.includes(expectedLink)) {
    missing.push(`${slug}: missing docs/index.html preview card`);
  }
}

if (missing.length > 0) {
  fail(`Preview gallery is incomplete:\n- ${missing.join('\n- ')}`);
}

console.log(`Preview gallery validation passed for ${listThemeSlugs().length} theme(s).`);
