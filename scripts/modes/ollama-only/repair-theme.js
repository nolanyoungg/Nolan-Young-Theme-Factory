#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root, scriptPath } = require('../../shared/repo-root');
const { parseArgs, arg } = require('../../shared/args');
const { runCommand } = require('../../shared/command-runner');
const {
  CONTENT_SECTION_PATTERN,
  MODEL_FILE_BLOCK_MARKER_PATTERN,
  PLACEHOLDER_PATTERN,
  REQUIRED_BUNDLES,
  TEMPLATE_PART_WRAPPER_PATTERN
} = require('../../shared/constants');
const { assertThemeSlug, safeRelativePath, walkFiles } = require('../../shared/theme-utils');
const { checkOllamaAccess } = require('../../shared/model-access');
const { focusedOllamaBrief } = require('./batch-definitions');

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

const CSS_MIN_BYTES = 2000;

function addFinding(findings, relativePath, message) {
  if (!findings.has(relativePath)) findings.set(relativePath, []);
  findings.get(relativePath).push(message);
}

function problemFindings(themeDir) {
  const findings = new Map();
  const allFiles = walkFiles(themeDir);
  const phpFiles = allFiles.filter((file) => file.endsWith('.php'));
  const definesFormAttributes = phpFiles.some((file) => /\bfunction\s+get_form_attributes\s*\(/i.test(fs.readFileSync(file, 'utf8')));

  for (const file of allFiles) {
    const relative = path.relative(themeDir, file).replace(/\\/g, '/');
    if (relative === 'style.css' || relative === 'package-lock.json') continue;
    if (!(/\.(php|css|js)$/i.test(relative) || path.basename(relative) === 'README.md')) continue;

    const text = fs.readFileSync(file, 'utf8');
    if (PLACEHOLDER_PATTERN.test(text)) addFinding(findings, relative, 'Remove unfinished placeholder/runtime copy.');
    if (/\.php$/i.test(relative) && /<style[\s>]/i.test(text)) {
      addFinding(findings, relative, 'Move inline <style> blocks into src/scss/main.scss and remove the PHP style block.');
      addFinding(findings, 'src/scss/main.scss', `Add any styling needed after removing inline styles from ${relative}.`);
    }
    if (MODEL_FILE_BLOCK_MARKER_PATTERN.test(text)) addFinding(findings, relative, 'Remove leaked model file-block markers and any content from other file blocks.');
    if (/\.(php|css|scss|js)$/i.test(relative) && /^```[a-zA-Z0-9_-]*\s*$/m.test(text)) addFinding(findings, relative, 'Remove leaked markdown code fence markers.');
    if (relative.startsWith('template-parts/') && TEMPLATE_PART_WRAPPER_PATTERN.test(text)) {
      addFinding(findings, relative, 'Template part must be a fragment only and must not contain document wrappers.');
    }
    if (relative === 'header.php') {
      if (!/<!doctype html>/i.test(text)) addFinding(findings, relative, 'Header must include <!doctype html>.');
      if (!/wp_head\s*\(/i.test(text)) addFinding(findings, relative, 'Header must call wp_head().');
      if (!/<body/i.test(text)) addFinding(findings, relative, 'Header must open the body tag.');
      if (CONTENT_SECTION_PATTERN.test(text)) addFinding(findings, relative, 'Header must not include site content template parts.');
    }
    if (relative === 'footer.php') {
      if (!/wp_footer\s*\(/i.test(text)) addFinding(findings, relative, 'Footer must call wp_footer().');
      if (!/<\/body>/i.test(text)) addFinding(findings, relative, 'Footer must close the body tag.');
      if (!/<\/html>/i.test(text)) addFinding(findings, relative, 'Footer must close the html tag.');
      if (CONTENT_SECTION_PATTERN.test(text)) addFinding(findings, relative, 'Footer must not include site content template parts.');
    }
    if (relative === 'searchform.php' && /\bget_search_form\s*\(/i.test(text)) {
      addFinding(findings, relative, 'searchform.php must render a complete search form directly and must not call get_search_form(), which recursively loads itself in WordPress.');
    }
    if (/\.php$/i.test(relative) && !definesFormAttributes && /\bget_form_attributes\s*\(/i.test(text)) {
      addFinding(findings, relative, 'Remove the undefined get_form_attributes() helper call. Render form attributes directly with escaped literal attributes or define a real helper before calling it.');
    }
  }

  const cssBundle = path.join(themeDir, REQUIRED_BUNDLES[0]);
  if (fs.existsSync(cssBundle) && fs.statSync(cssBundle).size < CSS_MIN_BYTES) {
    addFinding(findings, REQUIRED_BUNDLES[0], `Compiled CSS bundle is below ${CSS_MIN_BYTES} bytes.`);
    addFinding(findings, 'src/scss/main.scss', `SCSS source must compile to a finished stylesheet above ${CSS_MIN_BYTES} bytes.`);
  }

  return [...findings.entries()]
    .map(([relativePath, messages]) => ({ relativePath, messages }))
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

function repairPrompt(brief, findings, themeDir) {
  const focusedBrief = focusedOllamaBrief(brief, 'repair');
  const targetList = findings.map((finding) => `- ${finding.relativePath}: ${finding.messages.join(' ')}`).join('\n');
  const currentFiles = findings.map((finding) => {
    const filePath = path.join(themeDir, finding.relativePath);
    const currentContents = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
    return `---CURRENT FILE: ${finding.relativePath}---\n${currentContents.replace(/\r/g, '')}\n---END CURRENT FILE---`;
  }).join('\n\n');

  return `You are running one targeted repair stage for a generated WordPress theme.

Target folder:
wp-content/themes/${themeSlug}/

Return complete replacement file blocks only for the target files listed below.
Do not write any other file paths.

Creative brief:
${focusedBrief}

Deterministic findings:
${targetList}

Current file contents:
${currentFiles}

Format:
---FILE: relative/path.php---
line 1
line 2
---END FILE---

Rules:
- Rewrite complete file contents, not patches.
- Return one file block for each target path that needs content changes.
- Keep every output path exactly one of the target paths listed above.
- Keep output inside wp-content/themes/${themeSlug}/.
- Remove all Lorem ipsum, TODO, FIXME, "Add ... here", and future-editor instructions.
- Remove generic labels such as "Highlight Service Title", "Service Title", "Project Title", "Work Item", "Step Icon", "Pillar Icon", "Post Image", and "Client Avatar".
- If a loop renders visible cards, define arrays with finished business-specific titles, descriptions, labels, and alt text instead of deriving visible copy from numeric counters.
- Use finished copy aligned with the selected creative prompt.
- Preserve valid WordPress PHP syntax for PHP files.
- Do not use http://, https://, CDN scripts, remote images, secrets, tokens, or API keys.
- Do not wrap the file block in markdown fences or JSON.
- Template-parts are fragments only. They must not call get_header(), get_footer(), wp_head(), or wp_footer(), and must not include <!doctype>, <html>, <head>, <body>, </body>, or </html>.
- header.php must be a complete document header with <!doctype html>, <html>, <head>, wp_head(), and the opening <body> tag. It must not include content section template-parts such as content-hero or content-cta-banner.
- footer.php must close the document with wp_footer(), </body>, and </html>. It must not include content section template-parts such as content-brand-statement or content-cta-banner.
- searchform.php must render a complete <form role="search"> directly. It must not call get_search_form().
- Do not call custom helper functions unless they are defined in the theme. In particular, remove get_form_attributes() calls by writing normal escaped form attributes directly.
- If assets/css/bundle.css or src/scss/main.scss is listed, write a complete responsive visual system for the generated theme. src/scss/main.scss must be self-contained and must not use @use or @import.
- If assets/css/bundle.css is listed, write a stylesheet above ${CSS_MIN_BYTES} bytes.
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

const findings = problemFindings(themeDir);
if (findings.length === 0) {
  console.log(`No Ollama repair needed for ${themeSlug}`);
  process.exit(0);
}

const brief = createBrief();
const repairDir = path.join(root, 'reports', 'runs', themeSlug, 'ollama-repair');
fs.mkdirSync(repairDir, { recursive: true });
console.log(`Ollama targeted repair found ${findings.length} file(s).`);
for (const finding of findings) {
  console.log(`- ${finding.relativePath}: ${finding.messages.join(' ')}`);
}

const promptPath = path.join(repairDir, 'targeted-repair-prompt.md');
const rawOutput = path.join(repairDir, 'targeted-repair-raw.md');
fs.writeFileSync(promptPath, repairPrompt(brief, findings, themeDir), 'utf8');
console.log('Running one Ollama targeted repair stage.');
const result = run('ollama', ['run', model, '--nowordwrap'], {
  debugDir: path.join(root, 'reports', 'runs', themeSlug, 'debug'),
  echo: false,
  echoSummary: true,
  env: { OLLAMA_NOHISTORY: '1' },
  input: fs.readFileSync(promptPath, 'utf8'),
  mode: 'ollama-only',
  model,
  provider: 'Ollama',
  stage: 'ollama-targeted-repair',
  themeSlug,
  timeoutMs
});
fs.writeFileSync(rawOutput, `${result.stdout || ''}${result.stderr || ''}`, 'utf8');
if (result.status !== 0) fail('Ollama targeted repair failed.');
const apply = run('node', [scripts.applyThemeFileBlocks, rawOutput, `wp-content/themes/${themeSlug}`], { timeoutMs: 120000 });
if (apply.status !== 0) fail('Ollama targeted repair did not produce applicable file blocks.');

const remaining = problemFindings(themeDir);
if (remaining.length > 0) {
  fail(`Ollama repair could not clear deterministic findings from: ${remaining.map((finding) => `${finding.relativePath} (${finding.messages.join('; ')})`).join(', ')}`);
}
console.log(`Ollama targeted repair complete for ${themeSlug}`);
