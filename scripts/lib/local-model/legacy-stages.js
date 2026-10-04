'use strict';

const COMPILED_WRITE_PATHS = new Set([
  'assets/css/bundle.css',
  'assets/js/bundle.js',
  'package-lock.json'
]);

const LOCAL_MODEL_STAGES = [
  {
    id: '01-identity-copy',
    promptSections: ['Business Identity', 'Content Requirements', 'Color System', 'Visual Design Direction'],
    read: [
      'style.css',
      'theme.json',
      'functions.php',
      'inc/helpers.php',
      'template-parts/content-brand-statement.php',
      'template-parts/content-cta-banner.php',
      'assets/images/asset-manifest.json'
    ],
    write: [
      'style.css',
      'theme.json',
      'inc/helpers.php',
      'template-parts/content-brand-statement.php',
      'template-parts/content-cta-banner.php'
    ],
    checks: ['php-lint', 'json-parse', 'no-inline-style']
  },
  {
    id: '02-header-navigation',
    promptSections: ['Header', 'Header Layout', 'Header and Navigation', 'Header Behavior', 'Accessibility'],
    read: [
      'header.php',
      'footer.php',
      'functions.php',
      'inc/**',
      'src/scss/layout/_header.scss',
      'src/scss/base/_accessibility.scss',
      'src/js/main.js',
      'assets/images/asset-manifest.json'
    ],
    write: [
      'header.php',
      'inc/helpers.php',
      'src/scss/layout/_header.scss'
    ],
    checks: ['php-lint', 'no-inline-style'],
    overlapJustification: 'The navigation stage may extend shared helper data created during identity work, while keeping identity facts intact.'
  },
  {
    id: '03-homepage-layout',
    promptSections: ['front-page.php', 'Pages to Build', 'Homepage', 'template-parts to fill in/build out'],
    read: [
      'front-page.php',
      'header.php',
      'footer.php',
      'inc/helpers.php',
      'template-parts/**',
      'src/scss/pages/_homepage.scss',
      'src/scss/layout/_sections.scss',
      'src/scss/components/**',
      'assets/images/asset-manifest.json'
    ],
    write: [
      'front-page.php',
      'template-parts/content-all-services.php',
      'template-parts/content-blog-preview.php',
      'template-parts/content-brand-statement.php',
      'template-parts/content-cta-banner.php',
      'template-parts/content-featured-work.php',
      'template-parts/content-hero.php',
      'template-parts/content-process.php',
      'template-parts/content-single-service-highlight.php',
      'template-parts/content-style-pillars.php',
      'template-parts/content-testimonials.php',
      'src/scss/pages/_homepage.scss',
      'src/scss/layout/_sections.scss'
    ],
    checks: ['php-lint', 'no-inline-style'],
    overlapJustification: 'Homepage composition refines the identity copy established in stage 01 while preserving its business facts.'
  },
  {
    id: '04-page-templates',
    promptSections: ['page-templates to fill in/build out', 'Pages to Build', 'Page Templates'],
    read: [
      'index.php',
      'archive.php',
      'page.php',
      'single.php',
      'search.php',
      '404.php',
      '403.php',
      'comments.php',
      'searchform.php',
      'header.php',
      'footer.php',
      'inc/helpers.php',
      'page-templates/**',
      'template-parts/**',
      'assets/images/asset-manifest.json'
    ],
    write: [
      'index.php',
      'archive.php',
      'page.php',
      'single.php',
      'search.php',
      '404.php',
      '403.php',
      'comments.php',
      'searchform.php',
      'page-templates/**',
      'template-parts/content-none.php',
      'template-parts/content-page.php',
      'template-parts/content-policy.php',
      'template-parts/content-search.php',
      'template-parts/content-single.php'
    ],
    checks: ['php-lint', 'no-inline-style']
  },
  {
    id: '05-forms-admin',
    promptSections: ['Forms', 'Required Forms', 'Newsletter', 'Functionality', 'WordPress Security Requirements'],
    read: [
      'functions.php',
      'inc/**',
      'page-templates/template-contact.php',
      'page-templates/template-single-service.php',
      'src/scss/base/_forms.scss',
      'src/scss/base/_newsletter.scss',
      'src/scss/components/_forms.scss'
    ],
    write: [
      'functions.php',
      'inc/forms.php',
      'inc/newsletter.php',
      'inc/policy-routing.php',
      'inc/setup.php',
      'page-templates/template-contact.php',
      'page-templates/template-single-service.php'
    ],
    checks: ['php-lint', 'no-inline-style'],
    overlapJustification: 'The forms stage adds secure handlers and form integration to page templates created in stage 04 without redesigning unrelated page content.'
  },
  {
    id: '06-scss-design-system',
    promptSections: ['Style / CSS Requirements', 'CSS Architecture', 'Accessibility and Motion', 'Webpack Build Requirements', 'Color System', 'Visual Design Direction', 'Typography Direction'],
    read: [
      'style.css',
      'theme.json',
      'header.php',
      'footer.php',
      'front-page.php',
      'page-templates/**',
      'template-parts/**',
      'src/scss/**',
      'package.json',
      'package-lock.json',
      'build/webpack.config.js',
      'assets/css/bundle.css',
      'assets/images/asset-manifest.json'
    ],
    write: [
      'theme.json',
      'src/scss/**'
    ],
    checks: ['json-parse', 'scss-structure', 'no-inline-style'],
    contextBudgetBytes: 98304,
    overlapJustification: 'The design-system stage consolidates and completes SCSS begun by focused layout stages; compiled CSS remains deterministic build output.'
  },
  {
    id: '07-js-interactions',
    promptSections: ['Functionality', 'Header Behavior', 'Accessibility and Motion', 'Accessibility', 'Webpack Build Requirements'],
    read: [
      'header.php',
      'footer.php',
      'front-page.php',
      'page-templates/**',
      'template-parts/**',
      'src/js/main.js',
      'src/scss/base/_accessibility.scss',
      'src/scss/layout/_header.scss',
      'package.json',
      'package-lock.json',
      'build/webpack.config.js',
      'assets/js/bundle.js'
    ],
    write: [
      'src/js/main.js'
    ],
    checks: ['javascript-syntax']
  },
  {
    id: '08-footer-cleanup',
    promptSections: ['Footer', 'Responsive Footer Behavior', 'Accessibility and Visual Quality'],
    read: [
      'footer.php',
      'header.php',
      'inc/helpers.php',
      'template-parts/content-footer-widgets.php',
      'src/scss/layout/_footer.scss',
      'src/scss/base/_newsletter.scss'
    ],
    write: [
      'footer.php',
      'template-parts/content-footer-widgets.php',
      'src/scss/layout/_footer.scss'
    ],
    checks: ['php-lint', 'no-inline-style'],
    overlapJustification: 'The footer pass is a final focused composition and responsive refinement after the shared design-system stage.'
  },
  {
    id: '09-docs-and-stale-copy-cleanup',
    promptSections: ['README REQUIREMENTS', 'Supporting Documentation', 'Changelog and License', 'Definition of done'],
    read: [
      'README.md',
      'CHANGELOG.md',
      'LICENSE.txt',
      'accessibility/**',
      'blocks/**',
      'docs/**',
      'assets/icons/README.md',
      'style.css',
      'functions.php',
      'header.php',
      'footer.php',
      'front-page.php',
      'inc/**',
      'page-templates/**',
      'template-parts/**',
      'src/scss/**',
      'src/js/main.js',
      'package.json',
      'theme.json',
      'assets/images/asset-manifest.json'
    ],
    write: [
      'README.md',
      'CHANGELOG.md',
      'LICENSE.txt',
      'accessibility/**',
      'blocks/**',
      'docs/**',
      'assets/icons/README.md'
    ],
    checks: ['documentation-presence']
  }
];

function validateLocalModelPlan(promptHeadings, providerLabel = 'Local model', deps = {}) {
  validateStagePolicies(LOCAL_MODEL_STAGES);
  const normalize = deps.normalizeHeading || normalizeHeading;
  const normalizedHeadings = promptHeadings.map((heading) => normalize(heading));
  return LOCAL_MODEL_STAGES.map((stage) => {
    const matchedSections = stage.promptSections.filter((section) => normalizedHeadings.includes(normalize(section)));
    if (!matchedSections.length) {
      throw new Error(`${providerLabel} stage "${stage.id}" has no matching production prompt coverage. Expected one of: ${stage.promptSections.join(', ')}`);
    }
    return serializeStage(stage, matchedSections);
  });
}

function validateStagePolicies(stages = LOCAL_MODEL_STAGES) {
  const ids = new Set();
  for (const [index, stage] of stages.entries()) {
    if (!stage || typeof stage.id !== 'string' || !/^\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(stage.id)) {
      throw new Error(`Local-model stage ${index + 1} has an invalid id.`);
    }
    if (ids.has(stage.id)) {
      throw new Error(`Duplicate local-model stage id: ${stage.id}`);
    }
    ids.add(stage.id);
    for (const key of ['promptSections', 'read', 'write', 'checks']) {
      if (!Array.isArray(stage[key]) || !stage[key].length || stage[key].some((value) => typeof value !== 'string' || !value.trim())) {
        throw new Error(`Local-model stage "${stage.id}" must declare a non-empty ${key} list.`);
      }
    }
    for (const writePath of stage.write) {
      if (COMPILED_WRITE_PATHS.has(writePath)) {
        throw new Error(`Local-model stage "${stage.id}" may not write deterministic build output: ${writePath}`);
      }
      if (!stage.read.some((readPath) => scopeContains(readPath, writePath))) {
        throw new Error(`Local-model stage "${stage.id}" writes ${writePath} without a matching read scope.`);
      }
    }
    const earlierStages = stages.slice(0, index);
    const overlapsEarlier = earlierStages.some((earlier) => earlier.write.some((left) => stage.write.some((right) => scopesOverlap(left, right))));
    if (overlapsEarlier && !stage.overlapJustification) {
      throw new Error(`Local-model stage "${stage.id}" overlaps an earlier write scope without overlapJustification.`);
    }
  }
  return true;
}

function serializeStage(stage, matchedSections = []) {
  return {
    id: stage.id,
    promptSections: [...stage.promptSections],
    matchedSections: [...matchedSections],
    read: [...stage.read],
    write: [...stage.write],
    checks: [...stage.checks],
    ...(stage.contextBudgetBytes ? { contextBudgetBytes: stage.contextBudgetBytes } : {}),
    ...(stage.toolCallLimit ? { toolCallLimit: stage.toolCallLimit } : {}),
    ...(stage.timeoutMs ? { timeoutMs: stage.timeoutMs } : {}),
    ...(stage.overlapJustification ? { overlapJustification: stage.overlapJustification } : {})
  };
}

function buildLocalModelStagePrompt(options) {
  const {
    provider,
    model,
    stage,
    stageIndex,
    stageCount,
    context,
    productionPrompt
  } = options;
  const ownedPrompt = extractPromptSections(productionPrompt, stage.promptSections);
  const identityReference = stage.id === '01-identity-copy'
    ? ''
    : extractPromptSections(productionPrompt, ['Business Identity']);
  return [
    `You are running planned local-model stage ${stageIndex + 1}/${stageCount}: ${stage.id}.`,
    `Provider: ${provider}.`,
    `Model: ${model}.`,
    '',
    `Owned production-prompt sections: ${stage.promptSections.join(', ')}`,
    '',
    'Read scope (inspection only):',
    ...stage.read.map((item) => `- ${item}`),
    '',
    'Write scope (the final patch may touch only these paths):',
    ...stage.write.map((item) => `- ${item}`),
    '',
    'Candidate checks:',
    ...stage.checks.map((item) => `- ${item}`),
    '',
    'Available read-only tools: list_files, read_file, read_file_excerpt, search_files.',
    'Use tools whenever required information is absent from the bounded context.',
    'Do not assume file contents you have neither received nor read through a tool.',
    'You do not have direct filesystem access and may not claim that you modified files.',
    'Do not request write, shell, Git, preview, report, ZIP, commit, or repository-level operations.',
    'Preserve unrelated work committed by earlier successful stages.',
    'Do not modify compiled bundles or package-lock.json; the Node workflow regenerates build output deterministically.',
    '',
    'FINAL RESPONSE CONTRACT:',
    '- Return exactly one textual unified diff, either raw or in one fenced diff block.',
    '- Return no explanation, preface, summary, or trailing prose with the final patch.',
    '- Touch only paths in the write scope.',
    '- Complete-file marker protocols are forbidden.',
    '- If more context is needed, call a read-only tool before producing the final patch.',
    '',
    'Bounded current-theme context:',
    context,
    '',
    ...(identityReference ? ['Business identity reference (not additional write ownership):', identityReference, ''] : []),
    'Owned production prompt:',
    ownedPrompt
  ].join('\n');
}

function extractPromptSections(prompt, wantedSections) {
  const lines = String(prompt || '').split(/\r?\n/);
  const wanted = wantedSections.map(normalizeHeading);
  const ranges = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!match) {
      continue;
    }
    const normalized = normalizeHeading(match[2]);
    if (!wanted.includes(normalized)) {
      continue;
    }
    let end = index + 1;
    while (end < lines.length) {
      const next = lines[end].match(/^(#{1,6})\s+(.+?)\s*$/);
      if (next) {
        break;
      }
      end += 1;
    }
    ranges.push([index, end]);
  }
  const selected = [];
  const seen = new Set();
  for (const [start, end] of ranges) {
    for (let index = start; index < end; index += 1) {
      if (!seen.has(index)) {
        selected.push({ index, line: lines[index] });
        seen.add(index);
      }
    }
  }
  selected.sort((left, right) => left.index - right.index);
  return selected.map((entry) => entry.line).join('\n').trim() || '(No owned section text was extracted.)';
}

function normalizeHeading(value) {
  return String(value || '').toLowerCase()
    .replace(/^\d+[\s.)-]*/, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function scopeContains(container, candidate) {
  const left = container.replace(/\\/g, '/');
  const right = candidate.replace(/\\/g, '/');
  if (left === right) {
    return true;
  }
  if (left.endsWith('/**')) {
    return right.startsWith(left.slice(0, -3) + '/');
  }
  return false;
}

function scopesOverlap(left, right) {
  return scopeContains(left, right) || scopeContains(right, left);
}

module.exports = {
  COMPILED_WRITE_PATHS,
  LOCAL_MODEL_STAGES,
  buildLocalModelStagePrompt,
  extractPromptSections,
  normalizeHeading,
  scopeContains,
  scopesOverlap,
  serializeStage,
  validateLocalModelPlan,
  validateStagePolicies
};
