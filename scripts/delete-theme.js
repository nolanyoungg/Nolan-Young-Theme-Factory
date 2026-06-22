#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('./lib/repo-root');
const { parseArgs, arg, flag } = require('./lib/args');
const { runCommand } = require('./lib/command-runner');
const { artifactPlan, assertThemeSlug, existingArtifacts } = require('./lib/theme-utils');
const { GENERATED_THEME_PATHS } = require('./lib/constants');

const args = parseArgs(process.argv.slice(2));
const [positionalSlug] = args._;
const themeSlug = assertThemeSlug(arg(args, 'theme-slug', positionalSlug || ''));
const dryRun = flag(args, 'dry-run');
const yes = flag(args, 'yes');
const skipGallery = flag(args, 'skip-gallery');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function repoPath(relativePath) {
  return path.resolve(root, relativePath);
}

function removeArtifact(relativePath) {
  const resolved = repoPath(relativePath);
  if (!resolved.startsWith(root + path.sep)) fail(`Refusing to remove outside repository: ${resolved}`);
  if (!fs.existsSync(resolved)) return false;
  fs.rmSync(resolved, { recursive: true, force: true });
  return true;
}

const planned = artifactPlan(themeSlug, GENERATED_THEME_PATHS);
const existing = existingArtifacts(themeSlug, GENERATED_THEME_PATHS);

console.log(`Theme artifact deletion plan for ${themeSlug}:`);
for (const item of planned) {
  console.log(`- ${item}${existing.includes(item) ? '' : ' (not found)'}`);
}

if (dryRun) {
  console.log('Dry run only. No files were deleted.');
  process.exit(0);
}

if (!yes) fail('Deletion requires --yes after reviewing the plan.');

for (const item of planned) {
  if (removeArtifact(item)) console.log(`Deleted ${item}`);
}

if (!skipGallery) {
  const result = runCommand('node', [path.join(root, 'scripts', 'preview-theme.js'), '--rebuild-index'], { cwd: root });
  if (result.status !== 0) process.exit(result.status);
}

console.log(`Deleted artifacts for ${themeSlug}.`);
