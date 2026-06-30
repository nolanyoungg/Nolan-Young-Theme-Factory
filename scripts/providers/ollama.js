const fs = require('fs');
const path = require('path');
const { root } = require('../lib/repo-root');
const { runCommand } = require('../lib/command-runner');
const { checkOllamaAccess } = require('../lib/model-access');
const { assertThemeSlug, safeRelativePath } = require('../lib/theme-utils');
const { applyModelOutput, parseExactFileBlocks } = require('../lib/model-output');
const { OUTPUT_FORMAT, TEMPLATE_OWNED_PROMPT_SECTIONS, ollamaStageSequence, resolveOllamaBatchesForDirectory, SHARED_GENERATION_RULES, SHARED_GLOBAL_REQUIREMENTS, validateStagePlan } = require('../lib/ollama-batches');
const { assertCoverage, buildCoverage, expandStageRequirementIds, parsePromptContract, promptSizeManifest, selectPromptRequirements, selectPromptSections } = require('../lib/prompt-contract');

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

function phpFunctionInventory(themeDir, excludedFiles = []) {
  const excluded = new Set((excludedFiles || []).map((file) => String(file).replace(/\\/g, '/')));
  const files = directoryFiles(themeDir, '.').filter((file) => file.endsWith('.php') && !excluded.has(file));
  const out = [];
  for (const file of files) {
    const text = readThemeFile(themeDir, file);
    const names = [];
    let match;
    const pattern = /function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
    while ((match = pattern.exec(text)) !== null) names.push(match[1]);
    if (names.length) out.push({ file, names: [...new Set(names)].sort() });
  }
  return out;
}

function declarationList(items, emptyText) {
  return items.length ? items.map((file) => `- ${file}`).join('\n') : emptyText;
}

function getTemplatePartCallForFile(file) {
  const withoutExt = String(file || '').replace(/\\/g, '/').replace(/\.php$/i, '');
  const dir = path.posix.dirname(withoutExt);
  const basename = path.posix.basename(withoutExt);
  const splitAt = basename.indexOf('-');
  if (splitAt === -1) return `get_template_part( '${withoutExt}' )`;
  const base = `${dir}/${basename.slice(0, splitAt)}`;
  const slug = basename.slice(splitAt + 1);
  return `get_template_part( '${base}', '${slug}' )`;
}

function requiredTemplatePartGuidance(requiredTemplateParts) {
  if (!requiredTemplateParts.length) return '';
  return `## Required Existing Template Part Calls

The returned files for this stage must contain get_template_part() calls resolving to every file below. Use these exact call shapes unless the current scaffold already uses an equivalent resolving call:

${requiredTemplateParts.map((file) => `- ${file} -> ${getTemplatePartCallForFile(file)}`).join('\n')}
`;
}

function templatePartReferenceGuidance(themeDir, phpWritableFiles, requiredTemplateParts = []) {
  if (!phpWritableFiles.length) return '';
  const templateParts = directoryFiles(themeDir, 'template-parts').filter((file) => file.endsWith('.php'));
  if (!templateParts.length) return '';
  return `## Template Part Reference Rules

- Every get_template_part() call must resolve to one of the existing files listed below.
- Never include a .php extension inside get_template_part() arguments. For example, do not call get_template_part( 'template-parts/front-page/content-all-services.php' ).
- Use the two-argument WordPress form for nested content files. Example: template-parts/global/content-cta-banner.php is referenced as get_template_part( 'template-parts/global/content', 'cta-banner' ).
- Do not invent flattened paths such as get_template_part( 'template-parts/content-cta-banner' ) or get_template_part( 'template-parts/content', 'cta-banner' ) unless that exact resolved file exists.
- Do not omit required composition calls from wrapper files such as header.php and front-page.php.

${requiredTemplatePartGuidance(requiredTemplateParts)}

Existing template part files:
${templateParts.map((file) => `- ${file} -> ${getTemplatePartCallForFile(file)}`).join('\n')}
`;
}

function stripTransportNoise(text) {
  const normalized = String(text || '').replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');
  const start = normalized.indexOf('---FILE: ');
  if (start === -1) return normalized.trim();
  return normalized.slice(start).trim();
}

function serializeFileBlocks(files) {
  return files.map((file) => `---FILE: ${file.relativePath}---\n${String(file.content || '').replace(/\n?$/, '\n')}---END FILE---`).join('\n\n');
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.round(Number(milliseconds || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

function writeOllamaStageTiming(generationDir, themeSlug, mode, model, results) {
  const stages = results.map((entry) => ({
    stage: `ollama-build-${entry.batch}`,
    provider: 'ollama',
    model,
    mode,
    status: entry.status,
    started_at: entry.started_at || '',
    ended_at: entry.ended_at || '',
    duration_ms: Number(entry.duration_ms || 0),
    duration: formatDuration(entry.duration_ms || 0),
    recovered_transport_failure: Boolean(entry.recovered_transport_failure)
  }));
  const totalDurationMs = stages.reduce((total, stage) => total + stage.duration_ms, 0);
  const report = {
    schema_version: 'ollama-stage-timing/v1',
    theme_slug: themeSlug,
    mode,
    model,
    total_duration_ms: totalDurationMs,
    total_duration: formatDuration(totalDurationMs),
    stages
  };
  writeJson(path.join(generationDir, 'ollama-stage-timing.json'), report);
}

function batchPromptParts(themeSlug, themeDir, contract, batch) {
  const readonlyFiles = [
    ...(batch.readonly || []),
    ...(batch.readonlyDirectories || []).flatMap((dir) => directoryFiles(themeDir, dir))
  ];
  const requiredFiles = batch.files || [];
  const optionalFiles = batch.optionalFiles || [];
  const allowedPatterns = batch.allowedPatterns || [];
  const existingFunctionInventory = phpFunctionInventory(themeDir, [...requiredFiles, ...optionalFiles]);
  const existingFunctionText = existingFunctionInventory.length
    ? existingFunctionInventory.map((entry) => `- ${entry.file}: ${entry.names.join(', ')}`).join('\n')
    : '- No existing PHP functions found outside this stage.';
  const phpWritableFiles = [...requiredFiles, ...optionalFiles].filter((file) => /\.php$/i.test(file));
  const requiredTemplateParts = batch.requiredTemplateParts || [];
  const creativeText = batch.creativePrompt || (batch.promptRequirements && batch.promptRequirements.length
    ? selectPromptRequirements(contract, batch.promptRequirements)
    : selectPromptSections(contract, batch.promptSections || []));
  const rulesText = `${OUTPUT_FORMAT}\n\nRules:\n${SHARED_GENERATION_RULES.map((rule) => `- ${rule}`).join('\n')}`;
  const phpStageRules = phpWritableFiles.length ? `## PHP Output Rules

- Do not include Markdown fences inside any FILE block.
- For user-facing text in PHP, prefer double-quoted strings.
- Avoid apostrophes inside single-quoted PHP strings. Rewrite the sentence or switch to double quotes.
- Use brace-style PHP control structures only: if (...) { ... }, foreach (...) { ... }, while (...) { ... }. Do not use colon syntax such as if (...) :, else :, endif, endwhile, or endforeach.
- Before responding, mentally lint every PHP file for balanced quotes and valid PHP syntax.
` : '';
  const templatePartRules = templatePartReferenceGuidance(themeDir, phpWritableFiles, requiredTemplateParts);
  const requiredCount = requiredFiles.length;
  const optionalGuidance = optionalFiles.length
    ? 'Optional files may be returned only when they are complete and directly needed.'
    : 'No optional writable files are available in this stage.';
  const patternGuidance = allowedPatterns.length
    ? 'Pattern-created files may be returned only when they are essential and match a declared pattern exactly.'
    : 'No pattern-created files are available in this stage.';
  const requiredReturnGuidance = requiredCount === 1
    ? optionalFiles.length || allowedPatterns.length
      ? `Return the required FILE block for ${requiredFiles[0]}. Your response must start with "---FILE: ${requiredFiles[0]}---".`
      : `Return exactly one FILE block: ${requiredFiles[0]}. Your response must start with "---FILE: ${requiredFiles[0]}---".`
    : `Return exactly ${requiredCount} required FILE blocks, one for each required writable file.`;
  const stageGuidance = [
    'Build the owned files for this stage from the prepared scaffold.',
    'Replace starter content with production-ready implementation inside the writable allowlist.',
    requiredReturnGuidance,
    optionalGuidance,
    patternGuidance,
    'Do not return read-only context files or sibling files.',
    'Do not ask questions or explain your plan.'
  ].join(' ');
  const finalPrompt = `You are editing a prepared WordPress theme folder.

Target folder:
wp-content/themes/${themeSlug}/

Stage: build-${batch.name}
Purpose: ${batch.focus}

## Creative Prompt

${creativeText}

${SHARED_GLOBAL_REQUIREMENTS}

## Stage Instructions

${stageGuidance}

## Required Writable Files

${declarationList(requiredFiles, 'No exact files are mandatory for this stage.')}

These are the primary stage-owned files. Return every file you complete in this pass, using the exact listed paths.

## Optional Writable Files

${declarationList(optionalFiles, 'No exact optional files are declared for this stage.')}

Do not return optional files unless they are complete and needed.

## Allowed New-File Patterns

${declarationList(allowedPatterns, 'No pattern-created files are allowed for this stage.')}

Pattern-created files may be returned only when needed, and every returned path must match one declared pattern.

## Path Fidelity

- Every FILE header path must match the declared writable lists exactly.
- Preserve nested directories exactly as shown.
- Do not collapse paths such as template-parts/content/content-page.php into template-parts/content-page.php.

## Read-Only Context

These files are provided only for integration context and must not be returned:

${readonlyFiles.length ? readonlyFiles.map((file) => `- ${file}`).join('\n') : '- No additional read-only files for this stage.'}

## Existing PHP Function Names

Do not redeclare any function listed here. If this stage needs related behavior, call the existing function or choose a distinct stage-owned function name.

${existingFunctionText}

${templatePartRules}

${fileContext(themeDir, 'Current Required Writable File', requiredFiles)}

${optionalFiles.length ? fileContext(themeDir, 'Current Optional Writable File', optionalFiles) : ''}

${readonlyFiles.length ? fileContext(themeDir, 'Read-Only Context File', readonlyFiles) : ''}

${phpStageRules}

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

function writeStageBanner(stageName) {
  console.log(`############# Running stage: ${stageName} #############`);
}

function runOllamaStage({ reportDir, model, timeoutMs, promptPath, promptText, stageName, themeSlug, mode }) {
  writeStageBanner(stageName);
  fs.writeFileSync(promptPath, promptText, 'utf8');
  return runCommand('ollama', ['run', model, '--nowordwrap'], {
    debugDir: path.join(reportDir, 'debug'),
    echo: false,
    echoSummary: true,
    env: { OLLAMA_NOHISTORY: '1' },
    input: promptText,
    mode,
    model,
    provider: 'Ollama',
    stage: stageName,
    themeSlug,
    timeoutMs
  });
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
  const batches = resolveOllamaBatchesForDirectory(themeDir);
  validateStagePlan(batches);
  checkOllamaAccess({ model, live: false, timeoutMs });
  const contract = parsePromptContract(path.join(root, promptFile));
  const coverage = buildCoverage(contract, batches, expandStageRequirementIds(contract, { name: 'template-owned', promptSections: TEMPLATE_OWNED_PROMPT_SECTIONS }));
  assertCoverage(coverage);
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'prompt-coverage.json'), `${JSON.stringify(coverage, null, 2)}\n`, 'utf8');

  createGenerationBrief(themeSlug, promptFile, options.mode || 'ollama-only');
  const generationDir = path.join(reportDir, 'ollama-generation');
  fs.mkdirSync(generationDir, { recursive: true });
  const results = [];
  const stageNames = ollamaStageSequence(batches);
  fs.writeFileSync(path.join(generationDir, 'ollama-stage-sequence.json'), `${JSON.stringify({ stages: stageNames }, null, 2)}\n`, 'utf8');

  for (const batch of batches) {
    const stageName = `ollama-build-${batch.name}`;
    const promptParts = batchPromptParts(themeSlug, themeDir, contract, batch);
    const sizeManifest = promptSizeManifest(promptParts, Number(options.contextBudgetCharacters || 180000));
    const stageManifestPath = path.join(generationDir, `${stageName}-stage-manifest.json`);
    fs.writeFileSync(stageManifestPath, `${JSON.stringify({ stage: stageName, role: 'build', batch: batch.name, prompt_sections: batch.promptSections || [], ...sizeManifest }, null, 2)}\n`, 'utf8');
    if (!sizeManifest.within_budget) fail(`Ollama stage ${stageName} exceeds context budget (${sizeManifest.total_prompt_characters} > ${sizeManifest.budget_characters}). Split the stage; requirements and file context were not truncated.`);
    const promptPath = path.join(generationDir, `${stageName}-prompt.md`);
    const result = runOllamaStage({
      reportDir,
      model,
      timeoutMs,
      promptPath,
      promptText: promptParts.finalPrompt,
      stageName,
      themeSlug,
      mode: options.mode || 'ollama-only'
    });
    const originalOutput = `${result.stdout || ''}${result.stderr || ''}`;
    const originalOutputPath = path.join(generationDir, `${stageName}-raw-original.md`);
    fs.writeFileSync(originalOutputPath, originalOutput, 'utf8');
    const rawOutput = path.join(generationDir, `${stageName}-raw.md`);
    const resultEntry = {
      batch: batch.name,
      role: 'build',
      status: result.status,
      started_at: result.startedAt,
      ended_at: result.endedAt,
      duration_ms: result.durationMs,
      duration: formatDuration(result.durationMs),
      raw_output: rawOutput,
      original_raw_output: originalOutputPath
    };
    results.push(resultEntry);
    try {
      const normalizedOutput = stripTransportNoise(originalOutput);
      const files = parseExactFileBlocks(normalizedOutput, themeSlug, {
        allowNoChange: false,
        allowDeclineAsNoChange: false,
        requiredFiles: batch.files || [],
        optionalFiles: batch.optionalFiles || [],
        allowedPatterns: batch.allowedPatterns || []
      });
      fs.writeFileSync(rawOutput, serializeFileBlocks(files), 'utf8');
      applyModelOutput({
        sourceFile: rawOutput,
        themeDir,
        stage: stageName,
        requiredFiles: batch.files || [],
        optionalFiles: batch.optionalFiles || [],
        allowedPatterns: batch.allowedPatterns || [],
        requiredTemplateParts: batch.requiredTemplateParts || [],
        manifestPath: path.join(generationDir, `${stageName}-application.json`),
        candidateEvidenceDir: path.join(generationDir, `${stageName}-failed-candidate`)
      });
      if (result.status !== 0) {
        resultEntry.recovered_transport_failure = true;
        writeJson(path.join(generationDir, `${stageName}-transport-recovery.json`), {
          stage: stageName,
          provider: 'ollama',
          status: result.status,
          raw_output: rawOutput,
          original_raw_output: originalOutputPath,
          recovered_at: new Date().toISOString(),
          recovery_rule: 'Accepted because complete normalized file blocks passed allowlist and candidate stage checks despite non-zero transport status.'
        });
      }
    } catch (error) {
      if (result.status !== 0) fail(`Ollama stage failed: ${stageName}. ${error.message}`);
      throw error;
    } finally {
      writeOllamaStageTiming(generationDir, themeSlug, options.mode || 'ollama-only', model, results);
    }
  }
  writeOllamaStageTiming(generationDir, themeSlug, options.mode || 'ollama-only', model, results);
  return { passed: true, status: 0, provider: 'ollama', results };
}

module.exports = { batchPromptParts, runOllamaGeneration };
