const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { root } = require('../lib/repo-root');
const { runCommand } = require('../lib/command-runner');
const { checkCodexAccess, codexExecArgs } = require('../lib/model-access');
const { applyModelOutput } = require('../lib/model-output');
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
    map.set(rel, {
      path: rel,
      size: stat.size,
      sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
    });
  }
  return map;
}

function snapshotDiff(before, after, allowedPrefixes) {
  const paths = new Set([...before.keys(), ...after.keys()]);
  const diff = { added: [], deleted: [], modified: [] };
  for (const item of [...paths].sort()) {
    if (allowedPrefixes.some((prefix) => item === prefix || item.startsWith(`${prefix}/`))) continue;
    const oldEntry = before.get(item);
    const newEntry = after.get(item);
    if (!oldEntry && newEntry) diff.added.push(newEntry);
    else if (oldEntry && !newEntry) diff.deleted.push(oldEntry);
    else if (oldEntry.sha256 !== newEntry.sha256) diff.modified.push({ before: oldEntry, after: newEntry });
  }
  return diff;
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

function serializeFileBlocks(files) {
  return files.map((file) => `---FILE: ${file.relativePath}---\n${String(file.content || '').replace(/\n?$/, '\n')}---END FILE---`).join('\n\n');
}

function parseCodexSchemaOutput(file) {
  if (!fs.existsSync(file)) fail(`Codex last-message output missing: ${path.relative(root, file).replace(/\\/g, '/')}`);
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!parsed || !Array.isArray(parsed.files)) fail('Codex structured output must include a files array.');
  return parsed.files.map((item) => {
    if (!item || typeof item.path !== 'string' || typeof item.content !== 'string') {
      fail('Codex structured output file entries must include string path and content fields.');
    }
    return {
      relativePath: item.path.replace(/\\/g, '/'),
      content: `${item.content.replace(/\r\n/g, '\n').replace(/\n?$/, '\n')}`
    };
  });
}

function preparedManifest(themeDir) {
  const manifestPath = path.join(themeDir, '.generation', 'prepared-theme-manifest.json');
  if (!fs.existsSync(manifestPath)) fail(`Prepared theme manifest missing: ${path.relative(root, manifestPath).replace(/\\/g, '/')}`);
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function isWritableTextFile(relativePath) {
  return !/\.(png|jpe?g|webp|gif|zip)$/i.test(relativePath);
}

function codexWritableContract(themeSlug) {
  const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
  const manifest = preparedManifest(themeDir);
  const preparedFiles = (manifest.required_files || [])
    .map((item) => String(item || '').replace(/\\/g, '/'))
    .filter((item) => item && isWritableTextFile(item) && fs.existsSync(path.join(themeDir, item)));

  const required = new Set();
  const alwaysRequired = [
    'style.css',
    'functions.php',
    'header.php',
    'footer.php',
    'front-page.php',
    'page.php',
    'single.php',
    'archive.php',
    'search.php',
    'searchform.php',
    'theme.json',
    'assets/css/bundle.css',
    'assets/js/bundle.js'
  ];

  for (const file of preparedFiles) {
    if (
      alwaysRequired.includes(file)
      || file.startsWith('inc/')
      || file.startsWith('page-templates/')
      || file.startsWith('template-parts/')
    ) {
      required.add(file);
    }
  }

  const requiredFiles = [...required].sort();
  const optionalFiles = preparedFiles.filter((file) => !required.has(file)).sort();
  return { requiredFiles, optionalFiles, allowedPatterns: [] };
}

function currentThemeContext(themeSlug) {
  const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
  const priorities = [
    'style.css',
    'functions.php',
    'header.php',
    'footer.php',
    'front-page.php',
    'page.php',
    'single.php',
    'archive.php',
    'search.php',
    'searchform.php',
    'theme.json',
    'package.json',
    'build/webpack.config.js',
    'inc/',
    'page-templates/',
    'template-parts/',
    'src/js/main.js',
    'src/scss/main.scss',
    'src/scss/abstracts/',
    'src/scss/layout/',
    'src/scss/pages/'
  ];
  const maxChars = 45000;
  const files = walkThemeFiles(themeDir)
    .map((file) => path.relative(themeDir, file).replace(/\\/g, '/'))
    .sort((a, b) => {
      const aPriority = priorities.findIndex((prefix) => a === prefix || a.startsWith(prefix));
      const bPriority = priorities.findIndex((prefix) => b === prefix || b.startsWith(prefix));
      const aRank = aPriority === -1 ? Number.MAX_SAFE_INTEGER : aPriority;
      const bRank = bPriority === -1 ? Number.MAX_SAFE_INTEGER : bPriority;
      return aRank - bRank || a.localeCompare(b);
    });

  let totalChars = 0;
  const sections = [];
  for (const relative of files) {
    const full = path.join(themeDir, relative);
    const text = fs.readFileSync(full, 'utf8');
    const section = `## Current File: ${relative}\n\n\`\`\`text\n${text}\n\`\`\``;
    if (totalChars && totalChars + section.length > maxChars) break;
    sections.push(section);
    totalChars += section.length;
  }
  return sections.join('\n\n');
}

function createBrief(options, passType) {
  const themeDir = `wp-content/themes/${options.themeSlug}`;
  const promptText = fs.readFileSync(path.join(root, options.promptFile), 'utf8').trim();
  const contract = codexWritableContract(options.themeSlug);
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

Do not delete, rename, or move any file that exists in the prepared theme at the start of the pass. Every file copied from the selected template is required unless the brief explicitly asks to replace it. Treat the prepared file list as a hard preserve list.

Do not create new files. Edit the prepared template only. If a needed concept is not already represented by an existing prepared file, implement it by editing the existing prepared files instead of inventing new paths or new architecture.

You must replace starter scaffold content inherited from the template. A failed run includes any remaining placeholder text, TODO/FIXME markers, generic starter copy, or render-critical template parts left in their starter state.

Render-critical files must be finished: header/footer, front-page, page templates, and any template-parts/content-*.php files used by the homepage or preview pages.

This brief is not a validation-failure checklist. Do not treat this as a build cleanup or repair pass; it is the planned creative generation stage for the selected mode.

## Output Contract

Return a final JSON object that matches the provided schema exactly.

The JSON must contain one \`files\` array. Each entry must include:

- \`path\`: file path relative to the prepared theme root
- \`content\`: complete file contents

Do not include commentary anywhere. Do not omit required files. Do not include files outside the prepared theme contract.

## Required Returned Files

${contract.requiredFiles.length ? contract.requiredFiles.map((file) => `- ${file}`).join('\n') : '- None'}

Every required file above must be returned exactly once.

## Optional Writable Files

${contract.optionalFiles.length ? contract.optionalFiles.map((file) => `- ${file}`).join('\n') : '- None'}

You may return optional files only when they are complete and necessary.

## Creative Prompt

${promptText}

## Current Theme Context

Inspect the complete prepared theme from the current working directory. Do not rely on a validation report, and do not ask for or perform a repair pass. Use the prepared files on disk as the source of truth.
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
  const rawOutputPath = path.join(reportDir, passType === 'finish' ? 'codex.finish.raw.md' : 'codex.build.raw.md');
  const originalOutputPath = path.join(reportDir, passType === 'finish' ? 'codex.finish.output.txt' : 'codex.build.output.txt');
  const manifestPath = path.join(reportDir, passType === 'finish' ? 'codex.finish.application.json' : 'codex.build.application.json');
  const schemaPath = path.join(reportDir, passType === 'finish' ? 'codex.finish.schema.json' : 'codex.build.schema.json');
  const lastMessagePath = path.join(reportDir, passType === 'finish' ? 'codex.finish.last-message.json' : 'codex.build.last-message.json');
  const contract = codexWritableContract(themeSlug);
  fs.mkdirSync(path.dirname(briefPath), { recursive: true });
  fs.writeFileSync(briefPath, createBrief({ ...options, themeSlug, promptFile, model, reasoning }, passType), 'utf8');
  const allowedFiles = [...contract.requiredFiles, ...contract.optionalFiles].sort();
  fs.writeFileSync(schemaPath, `${JSON.stringify({
    type: 'object',
    properties: {
      files: {
        type: 'array',
        minItems: contract.requiredFiles.length,
        maxItems: allowedFiles.length,
        items: {
          type: 'object',
          properties: {
            path: { type: 'string', enum: allowedFiles },
            content: { type: 'string' }
          },
          required: ['path', 'content'],
          additionalProperties: false
        }
      }
    },
    required: ['files'],
    additionalProperties: false
  }, null, 2)}\n`, 'utf8');
  const stage = passType === 'finish' ? 'codex-finish' : 'codex-build';
  const before = repoSnapshot();
  const result = runCommand(process.platform === 'win32' ? 'codex.cmd' : 'codex', codexExecArgs(model, reasoning, ['--output-schema', schemaPath, '--output-last-message', lastMessagePath], { cd: themeDir, sandbox: 'read-only' }), {
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
  fs.writeFileSync(originalOutputPath, `${result.stdout || ''}${result.stderr || ''}`, 'utf8');
  if (result.status !== 0) fail('Codex execution failed or is unavailable.');
  const files = parseCodexSchemaOutput(lastMessagePath);
  fs.writeFileSync(rawOutputPath, serializeFileBlocks(files), 'utf8');
  applyModelOutput({
    sourceFile: rawOutputPath,
    themeDir,
    stage,
    requiredFiles: contract.requiredFiles,
    optionalFiles: contract.optionalFiles,
    allowedPatterns: contract.allowedPatterns,
    manifestPath,
    candidateEvidenceDir: path.join(reportDir, `${stage}-failed-candidate`)
  });
  const allowed = [
    path.relative(root, themeDir).replace(/\\/g, '/'),
    path.relative(root, reportDir).replace(/\\/g, '/')
  ];
  const outOfBound = snapshotDiff(before, repoSnapshot(), allowed);
  const changedCount = outOfBound.added.length + outOfBound.deleted.length + outOfBound.modified.length;
  const boundaryReport = { stage, allowed_prefixes: allowed, out_of_bound_changes: outOfBound, passed: changedCount === 0 };
  fs.writeFileSync(path.join(reportDir, `${stage}.boundary.json`), `${JSON.stringify(boundaryReport, null, 2)}\n`, 'utf8');
  if (changedCount) fail(`Codex changed out-of-bound path(s): ${[...outOfBound.added, ...outOfBound.deleted, ...outOfBound.modified.map((item) => item.after)].map((item) => item.path).join(', ')}`);
  return { passed: true, provider: 'codex', stage, status: result.status, output: originalOutputPath, boundary: boundaryReport, applied_output: rawOutputPath };
}

async function runCodexFinish(options) {
  return runCodexGeneration({ ...options, passType: 'finish' });
}

module.exports = { createBrief, repoSnapshot, snapshotDiff, runCodexGeneration, runCodexFinish };
