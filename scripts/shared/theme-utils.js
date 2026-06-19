const fs = require('fs');
const path = require('path');
const { root } = require('./repo-root');

const themeSlugPattern = /^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/;

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assertThemeSlug(themeSlug) {
  if (!themeSlug || !themeSlugPattern.test(themeSlug)) fail(`Invalid theme slug: ${themeSlug || '(missing)'}`);
  return themeSlug;
}

function safeRelativePath(input, label) {
  if (!input || input.includes('..') || path.isAbsolute(input)) fail(`Unsafe ${label}: ${input}`);
  return path.normalize(input).replace(/\\/g, '/');
}

function removeThemeArtifacts(themeSlug, defaults) {
  assertThemeSlug(themeSlug);
  const targets = [
    path.join(root, defaults.paths.themes, themeSlug),
    path.join(root, defaults.paths.previews, themeSlug),
    path.join(root, defaults.paths.zips, `${themeSlug}.zip`),
    path.join(root, defaults.paths.run_reports, themeSlug)
  ];

  for (const target of targets) {
    const resolved = path.resolve(target);
    if (!resolved.startsWith(root + path.sep)) fail(`Refusing to remove outside repository: ${resolved}`);
    fs.rmSync(resolved, { recursive: true, force: true });
  }
}

module.exports = {
  assertThemeSlug,
  fail,
  removeThemeArtifacts,
  safeRelativePath,
  themeSlugPattern
};
