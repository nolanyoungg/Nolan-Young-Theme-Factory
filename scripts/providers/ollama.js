const fs = require('fs');
const path = require('path');
const { root } = require('../lib/repo-root');
const { runCommand } = require('../lib/command-runner');
const { checkOllamaAccess } = require('../lib/model-access');
const { assertThemeSlug, safeRelativePath } = require('../lib/theme-utils');
const { BATCHES, OUTPUT_FORMAT, SHARED_GENERATION_RULES, focusedOllamaBrief } = require('../lib/ollama-batches');

function fail(message) {
  throw new Error(message);
}

function createGenerationBrief(themeSlug, promptFile, mode) {
  const result = runCommand('node', [path.join(root, 'scripts', 'lib', 'prompts.js'), themeSlug, promptFile, mode], { cwd: root, echo: false });
  if (result.status !== 0) fail('Generation brief creation failed.');
  return result.stdout.trim();
}

function applyOutput(rawOutput, themeSlug) {
  const result = runCommand('node', [path.join(root, 'scripts', 'lib', 'model-output.js'), rawOutput, path.join(root, 'wp-content', 'themes', themeSlug)], { cwd: root });
  if (result.status !== 0) fail(`Could not apply Ollama output: ${rawOutput}`);
}

function batchPrompt(themeSlug, brief, batch) {
  if (batch.name === 'assets') {
    return `Generate front-end source files for a local fictional WordPress business theme.

Target folder:
wp-content/themes/${themeSlug}/

Return only file blocks. Paths must be relative to the target folder.

${OUTPUT_FORMAT}

Required files:
${batch.files.map((file) => `- ${file}`).join('\n')}

Use local assets only. Do not use remote URLs, CDN dependencies, secrets, or credentials.
`;
  }
  return `You are editing a prepared WordPress theme folder.

Target folder:
wp-content/themes/${themeSlug}/

Paths in your response must be relative to that folder.

Creative brief:
${focusedOllamaBrief(brief, batch.name)}

Batch focus:
${batch.focus}

${OUTPUT_FORMAT}

Required files for this batch:
${batch.files.map((file) => `- ${file}`).join('\n')}

Rules:
${SHARED_GENERATION_RULES.map((rule) => `- ${rule}`).join('\n')}
`;
}

async function runOllamaGeneration(options) {
  const themeSlug = assertThemeSlug(options.themeSlug);
  const promptFile = safeRelativePath(options.promptFile, 'prompt file');
  const model = options.model;
  const timeoutMs = Number(options.timeoutMs || 2700000);
  const reportDir = options.reportDir || path.join(root, 'reports', 'runs', themeSlug);
  const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
  if (!fs.existsSync(themeDir)) fail(`Theme folder missing: wp-content/themes/${themeSlug}`);
  if (!fs.existsSync(path.join(root, promptFile))) fail(`Prompt file missing: ${promptFile}`);
  checkOllamaAccess({ model, live: false, timeoutMs });

  const briefPath = createGenerationBrief(themeSlug, promptFile, options.mode || 'ollama-only');
  const brief = fs.readFileSync(path.join(root, briefPath), 'utf8');
  const generationDir = path.join(reportDir, 'ollama-generation');
  fs.mkdirSync(generationDir, { recursive: true });
  const results = [];
  for (const batch of BATCHES) {
    const promptPath = path.join(generationDir, `ollama-${batch.name}-prompt.md`);
    const rawOutput = path.join(generationDir, `ollama-${batch.name}-raw.md`);
    fs.writeFileSync(promptPath, batchPrompt(themeSlug, brief, batch), 'utf8');
    const result = runCommand('ollama', ['run', model, '--nowordwrap'], {
      debugDir: path.join(reportDir, 'debug'),
      echo: false,
      echoSummary: true,
      env: { OLLAMA_NOHISTORY: '1' },
      input: fs.readFileSync(promptPath, 'utf8'),
      mode: options.mode || 'ollama-only',
      model,
      provider: 'Ollama',
      stage: `ollama-${batch.name}`,
      themeSlug,
      timeoutMs
    });
    fs.writeFileSync(rawOutput, `${result.stdout || ''}${result.stderr || ''}`, 'utf8');
    results.push({ batch: batch.name, status: result.status, raw_output: rawOutput });
    if (result.status !== 0) fail(`Ollama batch failed: ${batch.name}`);
    applyOutput(rawOutput, themeSlug);
  }
  return { provider: 'ollama', results };
}

module.exports = { runOllamaGeneration };
