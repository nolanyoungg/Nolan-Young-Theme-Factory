'use strict';

const os = require('node:os');

const { runOllamaStage } = require('../providers/ollama');
const { runLmStudioStage } = require('../providers/lmstudio');

const LOCAL_MODEL_STAGES = [
  {
    id: 'identity-content',
    promptSections: ['Business Identity', 'Content Requirements', 'Pages to Build', 'Header and Navigation'],
    allow: [
      'style.css',
      'README.md',
      'header.php',
      'footer.php',
      'front-page.php',
      'index.php',
      'page.php',
      'single.php',
      'search.php',
      '404.php',
      '403.php',
      'searchform.php',
      'page-templates/**',
      'template-parts/**',
      'inc/helpers.php',
      'theme.json'
    ]
  },
  {
    id: 'wordpress-structure',
    promptSections: ['Functionality', 'Core WordPress Theme Requirements', 'WordPress Asset Enqueue Requirements', 'Pages to Build', 'Header and Navigation'],
    allow: [
      'functions.php',
      'inc/**',
      'header.php',
      'footer.php',
      'front-page.php',
      'index.php',
      'page.php',
      'single.php',
      'search.php',
      '404.php',
      '403.php',
      'searchform.php',
      'page-templates/**',
      'template-parts/**',
      'theme.json'
    ]
  },
  {
    id: 'visual-system',
    promptSections: ['Style / CSS Requirements', 'CSS Architecture', 'Visual Design Direction', 'Color System', 'Typography Direction'],
    allow: [
      'style.css',
      'theme.json',
      'src/scss/**',
      'assets/css/**',
      'assets/icons/**',
      'assets/images/**',
      'screenshot.png'
    ]
  },
  {
    id: 'interaction-build',
    promptSections: ['Functionality', 'Header Behavior', 'Accessibility and Motion', 'Accessibility', 'Header and Navigation', 'Webpack Build Requirements'],
    allow: [
      'src/js/**',
      'assets/js/**',
      'build/**',
      'package.json',
      'package-lock.json',
      'header.php',
      'footer.php',
      'inc/enqueue.php'
    ]
  }
];

const LOCAL_MODEL_PROVIDER_CONFIG = {
  ollama: {
    label: 'Ollama',
    planFile: 'ollama-stage-plan.json'
  },
  lmstudio: {
    label: 'LM Studio',
    planFile: 'lmstudio-stage-plan.json'
  }
};

async function runLocalModelGeneration(provider, themeDir, options, reportDir, deps) {
  const config = LOCAL_MODEL_PROVIDER_CONFIG[provider];
  if (!config) {
    throw new Error(`Unsupported local model provider: ${provider}`);
  }

  const { fs, path, collectMarkdownHeadings, writeJson } = deps;
  const prompt = fs.readFileSync(options.promptPath, 'utf8');
  const promptHeadings = collectMarkdownHeadings(prompt);
  const plan = validateLocalModelPlan(promptHeadings, config.label, deps);
  writeJson(path.join(reportDir, config.planFile), plan);

  for (const stage of LOCAL_MODEL_STAGES) {
    const stagePrompt = buildLocalModelStagePrompt(prompt, themeDir, stage, config.label, deps);
    const content = provider === 'ollama'
      ? runOllamaStage(stagePrompt, stage, themeDir, options, reportDir, deps)
      : await runLmStudioStage(stagePrompt, stage, options, reportDir, deps);
    applyFileBlocks(themeDir, content, stage.allow, stage.id, config.label, deps);
  }
}

function buildLocalModelStagePrompt(prompt, themeDir, stage, providerLabel, deps) {
  const context = deps.listThemeContext(themeDir);
  return [
    `You are running planned ${providerLabel} stage "${stage.id}" for a prepared WordPress theme.`,
    '',
    `Prompt-section ownership: ${stage.promptSections.join(', ')}`,
    '',
    'Allowed file paths for this stage:',
    ...stage.allow.map((item) => `- ${item}`),
    '',
    'Return only complete file blocks using this exact protocol:',
    '---FILE: relative/path/from/theme/root.php---',
    'complete file content',
    '---END FILE---',
    '',
    'Do not describe changes outside file blocks.',
    'Do not emit partial files.',
    'Do not write outside the allowed path list.',
    'Do not create previews, ZIPs, reports, scripts, docs, or repo files.',
    '',
    'Current theme file inventory:',
    context,
    '',
    'Production prompt:',
    prompt
  ].join('\n');
}

function validateLocalModelPlan(promptHeadings, providerLabel, deps) {
  const normalizedHeadings = promptHeadings.map(deps.normalizeHeading);
  return LOCAL_MODEL_STAGES.map((stage) => {
    const matchedSections = stage.promptSections.filter((section) => {
      const normalized = deps.normalizeHeading(section);
      return normalizedHeadings.some((heading) => heading.includes(normalized) || normalized.includes(heading));
    });
    if (!matchedSections.length) {
      throw new Error(`${providerLabel} stage "${stage.id}" has no matching production prompt coverage. Expected one of: ${stage.promptSections.join(', ')}`);
    }
    return {
      id: stage.id,
      promptSections: stage.promptSections,
      matchedSections,
      allow: stage.allow
    };
  });
}

function applyFileBlocks(themeDir, output, allow, stageId, providerLabel = 'Local model', deps) {
  const { fs, path, ensureDir, ensureInside, matchesAllowList, normalizeRelativeFile, removeIfExists } = deps;
  const blocks = parseFileBlocks(output);
  if (!blocks.length) {
    const markerHint = output.includes('---FILE:') ? ' File markers were present, but the block protocol was malformed.' : '';
    throw new Error(`${providerLabel} stage "${stageId}" returned no valid file blocks.${markerHint}`);
  }
  const candidateDir = fs.mkdtempSync(path.join(os.tmpdir(), `theme-stage-${stageId}-`));
  fs.cpSync(themeDir, candidateDir, { recursive: true });

  try {
    const seen = new Set();
    for (const block of blocks) {
      const relPath = normalizeRelativeFile(block.path);
      if (seen.has(relPath)) {
        throw new Error(`${providerLabel} stage "${stageId}" returned duplicate file block: ${relPath}`);
      }
      seen.add(relPath);
      if (!matchesAllowList(relPath, allow)) {
        throw new Error(`${providerLabel} stage "${stageId}" attempted to write disallowed file: ${relPath}`);
      }
      const target = path.join(candidateDir, relPath);
      ensureInside(candidateDir, target);
      ensureDir(path.dirname(target));
      fs.writeFileSync(target, block.content.replace(/\r\n/g, '\n'));
    }
    removeIfExists(themeDir);
    fs.cpSync(candidateDir, themeDir, { recursive: true });
  } finally {
    removeIfExists(candidateDir);
  }
}

function parseFileBlocks(output) {
  const blocks = [];
  const re = /^---FILE:\s*(.+?)\s*---\s*\r?\n([\s\S]*?)\r?\n---END FILE---/gm;
  let match;
  while ((match = re.exec(output)) !== null) {
    blocks.push({ path: match[1].trim(), content: match[2] });
  }
  return blocks;
}

module.exports = {
  LOCAL_MODEL_STAGES,
  applyFileBlocks,
  buildLocalModelStagePrompt,
  parseFileBlocks,
  runLocalModelGeneration,
  validateLocalModelPlan
};
