const fs = require('fs');
const path = require('path');
const { root } = require('../lib/repo-root');
const { runCommand } = require('../lib/command-runner');
const { checkCodexAccess, codexExecArgs } = require('../lib/model-access');
const { assertThemeSlug, safeRelativePath } = require('../lib/theme-utils');

function fail(message) {
  throw new Error(message);
}

function walkFiles(baseDir, out = []) {
  if (!fs.existsSync(baseDir)) return out;
  for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(entry.name)) continue;
    const full = path.join(baseDir, entry.name);
    if (entry.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

function repoSnapshot() {
  const map = new Map();
  for (const file of walkFiles(root)) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    const stat = fs.statSync(file);
    map.set(rel, `${stat.size}:${Math.round(stat.mtimeMs)}`);
  }
  return map;
}

function changedSnapshotPaths(before, after, allowedPrefixes) {
  const paths = new Set([...before.keys(), ...after.keys()]);
  return [...paths].filter((item) => before.get(item) !== after.get(item))
    .filter((item) => !allowedPrefixes.some((prefix) => item === prefix || item.startsWith(`${prefix}/`)))
    .sort();
}

function walkThemeFiles(themeDir, out = []) {
  for (const entry of fs.readdirSync(themeDir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.generation'].includes(entry.name)) continue;
    const full = path.join(themeDir, entry.name);
    if (entry.isDirectory()) walkThemeFiles(full, out);
    else if (entry.isFile() && !/\.(png|jpe?g|webp|gif|zip)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function currentThemeContext(themeSlug) {
  const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
  return walkThemeFiles(themeDir)
    .sort()
    .map((file) => {
      const relative = path.relative(themeDir, file).replace(/\\/g, '/');
      const text = fs.readFileSync(file, 'utf8');
      return `## Current File: ${relative}\n\n\`\`\`text\n${text}\n\`\`\``;
    })
    .join('\n\n');
}

function createBrief(options, passType) {
  const themeDir = `wp-content/themes/${options.themeSlug}`;
  const promptText = fs.readFileSync(path.join(root, options.promptFile), 'utf8').trim();
  return `# Codex Theme ${passType === 'finish' ? 'Finish' : 'Generation'} Brief

Mode: ${options.mode}
Pass type: ${passType}
Theme slug: ${options.themeSlug}
Theme directory: ${themeDir}
Selected template: ${options.templateName}
Requested Codex model: ${options.model}
Requested reasoning level: ${options.reasoning}

## Edit Boundary

Edit only files inside:

\`\`\`text
${themeDir}/
\`\`\`

Do not create, modify, delete, rename, or move files outside that folder. Do not generate previews, update docs, package ZIP files, edit prompts, edit scripts, or run watch/dev/server commands.

${passType === 'finish' ? 'Finish, improve, and unify the existing Ollama draft in this one planned Codex pass.' : 'Implement the requested WordPress theme completely in one Codex generation pass.'}

Use local assets only. Do not add secrets, CDN dependencies, remote images, or machine-specific paths. Preserve every required file from the selected template. Leave the theme ready for deterministic build, validation, preview, and packaging.

This brief is not a validation-failure checklist. Do not treat this as a build cleanup or repair pass; it is the planned creative generation stage for the selected mode.

## Creative Prompt

${promptText}

## Current Theme Context

Inspect the complete prepared theme from the current working directory. Do not rely on a validation report, and do not ask for or perform a repair pass.
`;
}

async function runCodexGeneration(options) {
  const themeSlug = assertThemeSlug(options.themeSlug);
  const promptFile = safeRelativePath(options.promptFile, 'prompt file');
  const model = options.model;
  const reasoning = options.reasoning;
  const timeoutMs = Number(options.timeoutMs || 600000);
  const reportDir = options.reportDir || path.join(root, 'reports', 'runs', themeSlug);
  const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
  if (!fs.existsSync(themeDir)) fail(`Theme folder missing: wp-content/themes/${themeSlug}`);
  if (!fs.existsSync(path.join(root, promptFile))) fail(`Prompt file missing: ${promptFile}`);
  checkCodexAccess({ model, reasoning, live: false, timeoutMs });

  const passType = options.passType || 'build';
  const briefPath = path.join(reportDir, passType === 'finish' ? 'codex.finish-brief.md' : 'codex.build-brief.md');
  fs.mkdirSync(path.dirname(briefPath), { recursive: true });
  fs.writeFileSync(briefPath, createBrief({ ...options, themeSlug, promptFile, model, reasoning }, passType), 'utf8');
  const stage = passType === 'finish' ? 'codex-finish' : 'codex-build';
  const before = repoSnapshot();
  const result = runCommand(process.platform === 'win32' ? 'codex.cmd' : 'codex', codexExecArgs(model, reasoning, [], { cd: themeDir, sandbox: 'workspace-write' }), {
    cwd: themeDir,
    debugDir: path.join(reportDir, 'debug'),
    echo: false,
    echoSummary: true,
    input: fs.readFileSync(briefPath, 'utf8'),
    mode: options.mode || 'codex-only',
    model,
    provider: 'Codex',
    reasoning,
    stage,
    themeSlug,
    timeoutMs
  });
  const outputPath = path.join(reportDir, passType === 'finish' ? 'codex.finish.output.txt' : 'codex.build.output.txt');
  fs.writeFileSync(outputPath, `${result.stdout || ''}${result.stderr || ''}`, 'utf8');
  if (result.status !== 0) fail('Codex execution failed or is unavailable.');
  const allowed = [
    path.relative(root, themeDir).replace(/\\/g, '/'),
    path.relative(root, reportDir).replace(/\\/g, '/')
  ];
  const outOfBound = changedSnapshotPaths(before, repoSnapshot(), allowed);
  const boundaryReport = { stage, allowed_prefixes: allowed, out_of_bound_changes: outOfBound, passed: outOfBound.length === 0 };
  fs.writeFileSync(path.join(reportDir, `${stage}.boundary.json`), `${JSON.stringify(boundaryReport, null, 2)}\n`, 'utf8');
  if (outOfBound.length) fail(`Codex changed out-of-bound path(s): ${outOfBound.join(', ')}`);
  return { passed: true, provider: 'codex', stage, status: result.status, output: outputPath, boundary: boundaryReport };
}

async function runCodexFinish(options) {
  return runCodexGeneration({ ...options, passType: 'finish' });
}

module.exports = { createBrief, runCodexGeneration, runCodexFinish };
