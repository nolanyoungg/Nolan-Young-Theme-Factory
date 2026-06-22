const fs = require('fs');
const path = require('path');
const { root } = require('./repo-root');
const {
  GENERATED_THEME_PATHS,
  TEMPLATE_NAME_PATTERN,
  THEME_SLUG_PATTERN,
  WALK_IGNORED_DIRECTORIES
} = require('./constants');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assertThemeSlug(themeSlug) {
  if (!themeSlug || !THEME_SLUG_PATTERN.test(themeSlug)) fail(`Invalid theme slug: ${themeSlug || '(missing)'}`);
  return themeSlug;
}

function assertTemplateName(templateName) {
  if (!templateName || !TEMPLATE_NAME_PATTERN.test(templateName) || templateName.includes('..') || /[\\/]/.test(templateName)) {
    fail(`Unsafe template name: ${templateName || '(missing)'}`);
  }
  return templateName;
}

function safeRelativePath(input, label) {
  if (!input || input.includes('..') || path.isAbsolute(input)) fail(`Unsafe ${label}: ${input}`);
  return path.normalize(input).replace(/\\/g, '/');
}

function slugifyPromptPath(input) {
  const base = path.basename(input).replace(/\.[^.]+$/, '');
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')
    .replace(/^[0-9]+_/, '')
    .replace(/^nolan_young_theme_/, '') || 'generated_theme';
}

function repoRelative(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function collectArtifactNames(relativeDir, files = false) {
  const full = path.join(root, relativeDir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full, { withFileTypes: true })
    .filter((entry) => files ? entry.isFile() : entry.isDirectory())
    .map((entry) => entry.name);
}

function nextThemeNumber(paths = GENERATED_THEME_PATHS, options = {}) {
  const reports = paths.reports || paths.run_reports;
  if (options.createDirs !== false) {
    for (const dir of [paths.themes, paths.previews, paths.zips, reports]) {
      fs.mkdirSync(path.join(root, dir), { recursive: true });
    }
  }

  const names = [
    ...collectArtifactNames(paths.themes),
    ...collectArtifactNames(paths.previews),
    ...collectArtifactNames(reports),
    ...collectArtifactNames(paths.zips, true).map((name) => name.replace(/\.zip$/, ''))
  ];
  const max = names.reduce((highest, name) => {
    const match = name.match(THEME_SLUG_PATTERN);
    return match ? Math.max(highest, Number(name.slice(0, 3))) : highest;
  }, -1);
  return String(max + 1).padStart(3, '0');
}

function themeSlugForPrompt(promptFile, paths = GENERATED_THEME_PATHS, options = {}) {
  return `${nextThemeNumber(paths, options)}_nolan_young_theme_${slugifyPromptPath(promptFile)}`;
}

function artifactPlan(themeSlug, paths = GENERATED_THEME_PATHS) {
  assertThemeSlug(themeSlug);
  const reports = paths.reports || paths.run_reports;
  return [
    path.join(paths.themes, themeSlug),
    path.join(paths.previews, themeSlug),
    path.join(paths.zips, `${themeSlug}.zip`),
    path.join(reports, themeSlug)
  ].map((item) => item.replace(/\\/g, '/'));
}

function existingArtifacts(themeSlug, paths = GENERATED_THEME_PATHS) {
  return artifactPlan(themeSlug, paths).filter((item) => fs.existsSync(path.join(root, item)));
}

function removeThemeArtifacts(themeSlug, paths = GENERATED_THEME_PATHS) {
  const targets = artifactPlan(themeSlug, paths);

  for (const target of targets) {
    const resolved = path.resolve(root, target);
    if (!resolved.startsWith(root + path.sep)) fail(`Refusing to remove outside repository: ${resolved}`);
    fs.rmSync(resolved, { recursive: true, force: true });
  }
}

function walkFiles(dir, options = {}, out = []) {
  if (!fs.existsSync(dir)) return out;
  const ignored = options.ignoredDirectories || WALK_IGNORED_DIRECTORIES;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignored.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, options, out);
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

module.exports = {
  artifactPlan,
  assertTemplateName,
  assertThemeSlug,
  existingArtifacts,
  fail,
  nextThemeNumber,
  repoRelative,
  removeThemeArtifacts,
  safeRelativePath,
  slugifyPromptPath,
  themeSlugForPrompt,
  themeSlugPattern: THEME_SLUG_PATTERN,
  walkFiles
};
