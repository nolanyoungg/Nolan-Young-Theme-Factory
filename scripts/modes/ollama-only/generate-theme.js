#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root, scriptPath } = require('../../shared/repo-root');
const { parseArgs, arg } = require('../../shared/args');
const { runCommand } = require('../../shared/command-runner');
const { assertThemeSlug, safeRelativePath } = require('../../shared/theme-utils');
const { checkOllamaAccess } = require('../../shared/model-access');
const { BATCHES, OUTPUT_FORMAT, SHARED_GENERATION_RULES, focusedOllamaBrief } = require('./batch-definitions');

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
  return result.stdout.trim();
}

function applyOutput(rawOutput, themeTarget) {
  const result = run('node', [scripts.applyThemeFileBlocks, rawOutput, themeTarget], { timeoutMs: 120000 });
  if (result.status !== 0) fail(`Could not apply Ollama output: ${rawOutput}`);
}

function batchPrompt(brief, batch) {
  const focusedBrief = focusedOllamaBrief(brief, batch.name);
  return `You are editing a prepared WordPress theme folder.

Target folder:
wp-content/themes/${themeSlug}/

You must generate only files inside that folder. Paths in your response must be relative to that folder.

Creative brief:
${focusedBrief}

Batch focus:
${batch.focus}

${OUTPUT_FORMAT}

Required files for this batch:
${batch.files.map((file) => `- ${file}`).join('\n')}

Rules:
${SHARED_GENERATION_RULES.map((rule) => `- ${rule}`).join('\n')}
`;
}

function runBatch(brief, generationDir, batch) {
  const runPrompt = path.join(generationDir, `ollama-${batch.name}-prompt.md`);
  const rawOutput = path.join(generationDir, `ollama-${batch.name}-raw.md`);
  fs.writeFileSync(runPrompt, batchPrompt(brief, batch), 'utf8');
  console.log(`Running Ollama batch: ${batch.name}`);
  const result = run('ollama', ['run', model, '--nowordwrap'], {
    debugDir: path.join(root, 'reports', 'runs', themeSlug, 'debug'),
    echo: false,
    echoSummary: true,
    env: { OLLAMA_NOHISTORY: '1' },
    input: fs.readFileSync(runPrompt, 'utf8'),
    mode: 'ollama-only',
    model,
    provider: 'Ollama',
    stage: `ollama-${batch.name}`,
    themeSlug,
    timeoutMs
  });
  fs.writeFileSync(rawOutput, `${result.stdout || ''}${result.stderr || ''}`, 'utf8');
  if (result.status !== 0) fail(`Ollama batch failed: ${batch.name}`);
  applyOutput(rawOutput, `wp-content/themes/${themeSlug}`);
}

if (!themeSlug || !promptFile) fail('Usage: node scripts/modes/ollama-only/generate-theme.js --theme-slug <theme-slug> --prompt <prompt-file> [--ollama-model <model>]');
assertThemeSlug(themeSlug);
safeRelativePath(promptFile, 'prompt file');
if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) fail(`Invalid --ollama-timeout-ms: ${timeoutMs}`);
if (!fs.existsSync(path.join(root, 'wp-content', 'themes', themeSlug))) fail(`Theme folder missing: wp-content/themes/${themeSlug}`);
if (!fs.existsSync(path.join(root, promptFile))) fail(`Prompt file missing: ${promptFile}`);

try {
  checkOllamaAccess({ model, live: false, timeoutMs });
} catch (error) {
  fail(error.message);
}

const briefPath = createBrief();
const brief = fs.readFileSync(path.join(root, briefPath), 'utf8');
const generationDir = path.join(root, 'reports', 'runs', themeSlug, 'ollama-generation');
fs.mkdirSync(generationDir, { recursive: true });

console.log(`Running Ollama model: ${model}`);
for (const batch of BATCHES) runBatch(brief, generationDir, batch);
console.log(`Ollama generation complete for ${themeSlug}`);
