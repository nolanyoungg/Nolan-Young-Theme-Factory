const fs = require('fs');
const path = require('path');
const { root } = require('../lib/repo-root');
const { runCommand } = require('../lib/command-runner');
const { checkOllamaAccess } = require('../lib/model-access');
const { assertThemeSlug, safeRelativePath } = require('../lib/theme-utils');
const { applyModelOutput, parseExactFileBlocks } = require('../lib/model-output');
const { BATCHES, OUTPUT_FORMAT, SHARED_GENERATION_RULES, SHARED_GLOBAL_REQUIREMENTS, validateStagePlan } = require('../lib/ollama-batches');
const { assertCoverage, buildCoverage, parsePromptContract, promptSizeManifest, selectPromptSections } = require('../lib/prompt-contract');

function fail(message) {
  throw new Error(message);
}

function createGenerationBrief(themeSlug, promptFile, mode) {
  const result = runCommand('node', [path.join(root, 'scripts', 'lib', 'prompts.js'), themeSlug, promptFile, mode], { cwd: root, echo: false });
  if (result.status !== 0) fail('Generation brief creation failed.');
  return result.stdout.trim();
}

function readThemeFile(themeDir, relativePath) {
  const file = path.join(themeDir, relativePath);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return '';
  return fs.readFileSync(file, 'utf8');
}

function directoryFiles(themeDir, relativeDir) {
  const dir = path.join(themeDir, relativeDir);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else out.push(path.relative(themeDir, full).replace(/\\/g, '/'));
    }
  }
  walk(dir);
  return out.sort();
}

function fileContext(themeDir, label, files) {
  return files.map((file) => `## ${label}: ${file}\n\n\`\`\`text\n${readThemeFile(themeDir, file)}\n\`\`\``).join('\n\n');
}

function contextEntries(themeDir, files) {
  return files.map((file) => ({ path: file, content: readThemeFile(themeDir, file) }));
}

function declarationList(items, emptyText) {
  return items.length ? items.map((file) => `- ${file}`).join('\n') : emptyText;
}

function stripTransportNoise(text) {
  const normalized = String(text || '').replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');
  const start = normalized.indexOf('---FILE: ');
  if (start === -1) return normalized.trim();
  let end = normalized.lastIndexOf('\n---END FILE---');
  if (end === -1) end = normalized.lastIndexOf('---END FILE---');
  if (end === -1) return normalized.slice(start).trim();
  const endMarker = normalized.indexOf('---END FILE---', end);
  return normalized.slice(start, endMarker + '---END FILE---'.length).trim();
}

function serializeFileBlocks(files) {
  return files.map((file) => `---FILE: ${file.relativePath}---\n${String(file.content || '').replace(/\n?$/, '\n')}---END FILE---`).join('\n\n');
}

function batchPromptParts(themeSlug, themeDir, contract, batch) {
  const readonlyFiles = [
    ...(batch.readonly || []),
    ...(batch.readonlyDirectories || []).flatMap((dir) => directoryFiles(themeDir, dir))
  ];
  const requiredFiles = batch.files || [];
  const optionalFiles = batch.optionalFiles || [];
  const allowedPatterns = batch.allowedPatterns || [];
  const creativeText = selectPromptSections(contract, batch.promptSections || []);
  const rulesText = `${OUTPUT_FORMAT}\n\nRules:\n${SHARED_GENERATION_RULES.map((rule) => `- ${rule}`).join('\n')}`;
  const finalPrompt = `You are editing a prepared WordPress theme folder.

Target folder:
wp-content/themes/${themeSlug}/

Stage: ${batch.name}
Purpose: ${batch.focus}

## Creative Prompt

${creativeText}

${SHARED_GLOBAL_REQUIREMENTS}

## Required Writable Files

${declarationList(requiredFiles, 'No exact files are mandatory for this stage.')}

Required files must be returned exactly once.

## Optional Writable Files

${declarationList(optionalFiles, 'No exact optional files are declared for this stage.')}

Do not return optional files unless they are complete and needed.

## Allowed New-File Patterns

${declarationList(allowedPatterns, 'No pattern-created files are allowed for this stage.')}

Pattern-created files may be returned only when needed, and every returned path must match one declared pattern.

## Read-Only Context

These files are provided only for integration context and must not be returned:

${readonlyFiles.length ? readonlyFiles.map((file) => `- ${file}`).join('\n') : '- No additional read-only files for this stage.'}

${fileContext(themeDir, 'Current Required Writable File', requiredFiles)}

${optionalFiles.length ? fileContext(themeDir, 'Current Optional Writable File', optionalFiles) : ''}

${readonlyFiles.length ? fileContext(themeDir, 'Read-Only Context File', readonlyFiles) : ''}

${rulesText}
`;
  return {
    finalPrompt,
    creativeText,
    sharedText: SHARED_GLOBAL_REQUIREMENTS,
    protocolText: rulesText,
    requiredWritableFiles: contextEntries(themeDir, requiredFiles),
    optionalWritableFiles: contextEntries(themeDir, optionalFiles),
    readonlyFiles: contextEntries(themeDir, readonlyFiles)
  };
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
  validateStagePlan(BATCHES);
  checkOllamaAccess({ model, live: false, timeoutMs });
  const contract = parsePromptContract(path.join(root, promptFile));
  const coverage = buildCoverage(contract, BATCHES);
  assertCoverage(coverage);
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'prompt-coverage.json'), `${JSON.stringify(coverage, null, 2)}\n`, 'utf8');

  createGenerationBrief(themeSlug, promptFile, options.mode || 'ollama-only');
  const generationDir = path.join(reportDir, 'ollama-generation');
  fs.mkdirSync(generationDir, { recursive: true });
  const results = [];
  for (const batch of BATCHES) {
    const promptPath = path.join(generationDir, `ollama-${batch.name}-prompt.md`);
    const rawOutput = path.join(generationDir, `ollama-${batch.name}-raw.md`);
    const manifestPath = path.join(generationDir, `ollama-${batch.name}-application.json`);
    const promptParts = batchPromptParts(themeSlug, themeDir, contract, batch);
    const sizeManifest = promptSizeManifest(promptParts, Number(options.contextBudgetCharacters || 180000));
    const stageManifestPath = path.join(generationDir, `ollama-${batch.name}-stage-manifest.json`);
    fs.writeFileSync(stageManifestPath, `${JSON.stringify({ stage: batch.name, prompt_sections: batch.promptSections || [], ...sizeManifest }, null, 2)}\n`, 'utf8');
    if (!sizeManifest.within_budget) fail(`Ollama stage ${batch.name} exceeds context budget (${sizeManifest.total_prompt_characters} > ${sizeManifest.budget_characters}). Split the stage; requirements and file context were not truncated.`);
    fs.writeFileSync(promptPath, promptParts.finalPrompt, 'utf8');
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
    const originalOutput = `${result.stdout || ''}${result.stderr || ''}`;
    fs.writeFileSync(path.join(generationDir, `ollama-${batch.name}-raw-original.md`), originalOutput, 'utf8');
    const files = parseExactFileBlocks(stripTransportNoise(originalOutput), themeSlug);
    fs.writeFileSync(rawOutput, serializeFileBlocks(files), 'utf8');
    results.push({ batch: batch.name, status: result.status, raw_output: rawOutput, original_raw_output: path.join(generationDir, `ollama-${batch.name}-raw-original.md`) });
    if (result.status !== 0) fail(`Ollama batch failed: ${batch.name}`);
    applyModelOutput({
      sourceFile: rawOutput,
      themeDir,
      stage: batch.name,
      requiredFiles: batch.files || [],
      optionalFiles: batch.optionalFiles || [],
      allowedPatterns: batch.allowedPatterns || [],
      manifestPath,
      candidateEvidenceDir: path.join(generationDir, `ollama-${batch.name}-failed-candidate`)
    });
  }
  return { passed: true, status: 0, provider: 'ollama', results };
}

module.exports = { batchPromptParts, runOllamaGeneration };
