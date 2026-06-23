const fs = require('fs');
const path = require('path');
const { root } = require('../lib/repo-root');
const { runCommand } = require('../lib/command-runner');
const { checkCodexAccess, codexExecArgs } = require('../lib/model-access');
const { assertThemeSlug, safeRelativePath } = require('../lib/theme-utils');

function fail(message) {
  throw new Error(message);
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

${currentThemeContext(options.themeSlug)}
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
  const result = runCommand(process.platform === 'win32' ? 'codex.cmd' : 'codex', codexExecArgs(model, reasoning), {
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
  return { passed: true, provider: 'codex', stage, status: result.status, output: outputPath };
}

async function runCodexFinish(options) {
  return runCodexGeneration({ ...options, passType: 'finish' });
}

module.exports = { runCodexGeneration, runCodexFinish };
