#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root, scriptPath } = require('../../shared/repo-root');
const { parseArgs, arg } = require('../../shared/args');
const { runCommand } = require('../../shared/command-runner');
const {
  CONTENT_SECTION_PATTERN,
  PLACEHOLDER_PATTERN,
  TEMPLATE_PART_WRAPPER_PATTERN
} = require('../../shared/constants');
const { assertThemeSlug, safeRelativePath, walkFiles } = require('../../shared/theme-utils');
const { checkOllamaAccess } = require('../../shared/model-access');

const args = parseArgs(process.argv.slice(2));
const [positionalSlug, positionalPrompt, positionalModel] = args._;
const themeSlug = arg(args, 'theme-slug', positionalSlug || '');
const promptFile = arg(args, 'prompt', positionalPrompt || '');
const model = arg(args, 'ollama-model', positionalModel || 'qwen2.5-coder:14b');
const timeoutMs = Number(arg(args, 'ollama-timeout-ms', '180000'));

const scripts = {
  applyThemeFileBlocks: scriptPath('ai-output', 'apply-theme-file-blocks.js'),
  createThemeGenerationBrief: scriptPath('briefs', 'create-theme-generation-brief.js')
};

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function run(command, commandArgs, options = {}) {
  return runCommand(command, commandArgs, { cwd: root, ...options });
}

function createBrief() {
  const result = run('node', [scripts.createThemeGenerationBrief, themeSlug, promptFile, 'ollama-only'], { echo: false, timeoutMs: 120000 });
  if (result.status !== 0) fail('Generation brief creation failed.');
  return fs.readFileSync(path.join(root, result.stdout.trim()), 'utf8');
}

function problemFiles(themeDir) {
  return walkFiles(themeDir)
    .filter((file) => /\.(php|css|js)$/i.test(file) || path.basename(file) === 'README.md')
    .filter((file) => {
      const text = fs.readFileSync(file, 'utf8');
      const relative = path.relative(themeDir, file).replace(/\\/g, '/');
      if (PLACEHOLDER_PATTERN.test(text)) return true;
      if (relative.startsWith('template-parts/') && TEMPLATE_PART_WRAPPER_PATTERN.test(text)) return true;
      if (relative === 'header.php') {
        return !/<!doctype html>/i.test(text) || !/wp_head\s*\(/i.test(text) || !/<body/i.test(text) || CONTENT_SECTION_PATTERN.test(text);
      }
      if (relative === 'footer.php') {
        return !/wp_footer\s*\(/i.test(text) || !/<\/body>/i.test(text) || !/<\/html>/i.test(text) || CONTENT_SECTION_PATTERN.test(text);
      }
      return false;
    })
    .map((file) => path.relative(themeDir, file).replace(/\\/g, '/'))
    .sort();
}

function repairPrompt(brief, relativePath, currentContents) {
  const extraRules = relativePath.startsWith('template-parts/')
    ? '- This file is a fragment only. Remove any get_header(), get_footer(), wp_head(), wp_footer(), <!doctype>, <html>, <head>, or <body> wrappers.'
    : relativePath === 'header.php'
      ? '- This file must be a complete document header with <!doctype html>, <html>, <head>, wp_head(), and the opening <body> tag. It must not include content sections.'
      : relativePath === 'footer.php'
        ? '- This file must close the document with wp_footer(), </body>, and </html>. It must not include content sections.'
        : '- Keep the file focused on its own technical purpose and remove placeholder copy.';
  return `You are repairing one file inside a generated WordPress theme.

Target folder:
wp-content/themes/${themeSlug}/

Target file:
${relativePath}

You must return only one file block and write exactly this one file path.

Creative brief:
${brief}

Current file contents:
${currentContents.replace(/\r/g, '')}

Format:
---FILE: ${relativePath}---
line 1
line 2
---END FILE---

Rules:
- Rewrite the complete file, not a patch.
- Keep the path exactly "${relativePath}".
- Keep output inside wp-content/themes/${themeSlug}/.
- Remove all Lorem ipsum, TODO, FIXME, "Add ... here", and future-editor instructions.
- Use finished copy aligned with the selected creative prompt.
- Preserve valid WordPress PHP syntax for PHP files.
- Do not use http://, https://, CDN scripts, remote images, secrets, tokens, or API keys.
- Do not wrap the file block in markdown fences or JSON.
${extraRules}
`;
}

if (!themeSlug || !promptFile) fail('Usage: node scripts/modes/ollama-only/repair-theme.js --theme-slug <theme-slug> --prompt <prompt-file> [--ollama-model <model>]');
assertThemeSlug(themeSlug);
safeRelativePath(promptFile, 'prompt file');
if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) fail(`Invalid --ollama-timeout-ms: ${timeoutMs}`);

const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
if (!fs.existsSync(themeDir)) fail(`Theme folder missing: wp-content/themes/${themeSlug}`);
if (!fs.existsSync(path.join(root, promptFile))) fail(`Prompt file missing: ${promptFile}`);

try {
  checkOllamaAccess({ model, live: false, timeoutMs });
} catch (error) {
  fail(error.message);
}

const files = problemFiles(themeDir);
if (files.length === 0) {
  console.log(`No Ollama repair needed for ${themeSlug}`);
  process.exit(0);
}

const brief = createBrief();
const repairDir = path.join(root, 'reports', 'runs', themeSlug, 'ollama-repair');
fs.mkdirSync(repairDir, { recursive: true });
console.log(`Ollama targeted repair found ${files.length} file(s).`);

for (const relativePath of files) {
  const safeName = relativePath.replace(/[\/\\.]/g, '_');
  const promptPath = path.join(repairDir, `repair-${safeName}-prompt.md`);
  const rawOutput = path.join(repairDir, `repair-${safeName}-raw.md`);
  fs.writeFileSync(promptPath, repairPrompt(brief, relativePath, fs.readFileSync(path.join(themeDir, relativePath), 'utf8')), 'utf8');
  console.log(`Running Ollama repair for: ${relativePath}`);
  const result = run('ollama', ['run', model, '--nowordwrap'], {
    debugDir: path.join(root, 'reports', 'runs', themeSlug, 'debug'),
    echo: false,
    echoSummary: true,
    env: { OLLAMA_NOHISTORY: '1' },
    input: fs.readFileSync(promptPath, 'utf8'),
    mode: 'ollama-only',
    model,
    provider: 'Ollama',
    stage: `ollama-repair-${safeName}`,
    themeSlug,
    timeoutMs
  });
  fs.writeFileSync(rawOutput, `${result.stdout || ''}${result.stderr || ''}`, 'utf8');
  if (result.status !== 0) fail(`Ollama repair failed for ${relativePath}`);
  const apply = run('node', [scripts.applyThemeFileBlocks, rawOutput, `wp-content/themes/${themeSlug}`], { timeoutMs: 120000 });
  if (apply.status !== 0) fail(`Ollama repair did not produce an applicable file for ${relativePath}`);
}

const remaining = problemFiles(themeDir);
if (remaining.length > 0) fail(`Ollama repair could not clear deterministic findings from: ${remaining.join(', ')}`);
console.log(`Ollama targeted repair complete for ${themeSlug}`);
