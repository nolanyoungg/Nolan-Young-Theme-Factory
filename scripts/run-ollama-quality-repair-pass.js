#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const [themeSlug, promptFile, model = 'qwen2.5-coder:14b'] = process.argv.slice(2);
const unfinishedPattern = /Lorem ipsum|TODO|FIXME|Add [A-Za-z0-9 _/-]+ here|add [A-Za-z0-9 _/-]+ here|Generation should replace|Static preview generated from|prepared WordPress theme folder/i;
const fragmentWrapperPattern = /(get_header\s*\(|get_footer\s*\(|<!doctype|<html\b|<body\b|<\/body>|<\/html>)/i;

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', shell: process.platform === 'win32', ...options });
  if (result.stdout && options.echo !== false) process.stdout.write(result.stdout);
  if (result.stderr && options.echo !== false) process.stderr.write(result.stderr);
  return result;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.generation'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function unfinishedFiles(themeDir) {
  return walk(themeDir)
    .filter((file) => /\.(php|css|js)$/i.test(file) || path.basename(file) === 'README.md')
    .filter((file) => {
      const text = fs.readFileSync(file, 'utf8');
      const relative = path.relative(themeDir, file).replace(/\\/g, '/');
      if (unfinishedPattern.test(text)) return true;
      if (relative.startsWith('template-parts/') && fragmentWrapperPattern.test(text)) return true;
      if (relative === 'header.php') {
        return !/<!doctype html>/i.test(text) || !/wp_head\s*\(/i.test(text) || !/<body/i.test(text);
      }
      if (relative === 'footer.php') {
        return !/wp_footer\s*\(/i.test(text) || !/<\/body>/i.test(text) || !/<\/html>/i.test(text);
      }
      return false;
    })
    .map((file) => path.relative(themeDir, file).replace(/\\/g, '/'))
    .sort();
}

function createBrief() {
  const result = run('node', ['scripts/create-theme-generation-brief.js', themeSlug, promptFile, 'ollama-only'], { echo: false });
  if (result.status !== 0) fail('Generation brief creation failed.');
  return fs.readFileSync(path.join(root, result.stdout.trim()), 'utf8');
}

function repairPrompt(brief, relativePath, currentContents) {
  const extraRules = relativePath.startsWith('template-parts/')
    ? '- This file is a fragment only. Remove any get_header(), get_footer(), wp_head(), wp_footer(), <!doctype>, <html>, <head>, or <body> wrappers.'
    : relativePath === 'header.php'
      ? '- This file must be a complete document header with <!doctype html>, <html>, <head>, wp_head(), and the opening <body> tag.'
      : relativePath === 'footer.php'
        ? '- This file must close the document with wp_footer(), </body>, and </html>.'
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
- Preserve the file's technical purpose.
- Preserve valid WordPress PHP syntax for PHP files.
- Do not use http://, https://, CDN scripts, remote images, secrets, tokens, or API keys.
- Do not wrap the file block in markdown fences or JSON.
- header.php must use lowercase <!doctype html> and a valid full document wrapper.
${extraRules}
`;
}

if (!themeSlug || !promptFile) fail('Usage: node scripts/run-ollama-quality-repair-pass.js <theme-slug> <prompt-file> [model]');
if (!/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(themeSlug)) fail(`Invalid theme slug: ${themeSlug}`);
if (promptFile.includes('..')) fail('Unsafe prompt path.');

const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
if (!fs.existsSync(themeDir)) fail(`Theme folder missing: wp-content/themes/${themeSlug}`);
if (!fs.existsSync(path.join(root, promptFile))) fail(`Prompt file missing: ${promptFile}`);

const list = run('ollama', ['list'], { echo: false });
const installedModels = (list.stdout || '').split(/\r?\n/).slice(1).map((line) => line.trim().split(/\s+/)[0]).filter(Boolean);
if (list.status !== 0 || !installedModels.includes(model)) {
  fail(`Ollama model is not installed: ${model}`);
}

const brief = createBrief();
const repairDir = path.join(root, 'reports', 'runs', themeSlug, 'ollama-repair');
fs.mkdirSync(repairDir, { recursive: true });

for (let pass = 1; pass <= 2; pass += 1) {
  const files = unfinishedFiles(themeDir);
  if (files.length === 0) {
    console.log(`Ollama quality repair pass complete for ${themeSlug}`);
    process.exit(0);
  }
  console.log(`Ollama quality repair pass ${pass} found ${files.length} file(s).`);
  for (const relativePath of files) {
    const safeName = relativePath.replace(/[\/\\.]/g, '_');
    const promptPath = path.join(repairDir, `repair-${safeName}-prompt.md`);
    const rawOutput = path.join(repairDir, `repair-${safeName}-raw.md`);
    fs.writeFileSync(promptPath, repairPrompt(brief, relativePath, fs.readFileSync(path.join(themeDir, relativePath), 'utf8')), 'utf8');
    console.log(`Running Ollama repair for: ${relativePath}`);
    const result = run('ollama', ['run', model, '--nowordwrap'], {
      input: fs.readFileSync(promptPath, 'utf8'),
      echo: false,
      env: { ...process.env, OLLAMA_NOHISTORY: '1' }
    });
    fs.writeFileSync(rawOutput, `${result.stdout || ''}${result.stderr || ''}`, 'utf8');
    if (result.status === 0) run('node', ['scripts/apply-theme-file-blocks.js', rawOutput, `wp-content/themes/${themeSlug}`]);
  }
}

const remaining = unfinishedFiles(themeDir);
if (remaining.length > 0) fail(`Ollama repair could not clear unfinished copy from: ${remaining.join(', ')}`);
console.log(`Ollama quality repair pass complete for ${themeSlug}`);
