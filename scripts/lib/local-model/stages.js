'use strict';

const COMPILED_WRITE_PATHS = new Set([
  'assets/css/bundle.css',
  'assets/js/bundle.js',
  'package-lock.json'
]);

const LOCAL_MODEL_STAGES = [
  {
    "id": "01-identity-content",
    "promptSections": [
      "Business Identity",
      "Content Requirements"
    ],
    "read": [
      "content.json",
      "sample.json",
      "assets/images/asset-manifest.json",
      "index.html",
      "homepage_preview.html",
      "about-us_preview.html",
      "services_preview.html",
      "work_preview.html",
      "blog_preview.html",
      "contact_preview.html",
      "policy_preview.html",
      "single_services_preview.html",
      "assets/css/site.css",
      "assets/js/site.js",
      "README.md"
    ],
    "write": [
      "content.json"
    ],
    "checks": [
      "static-syntax"
    ]
  },
  {
    "id": "02-navigation",
    "promptSections": [
      "Header",
      "Header and Navigation",
      "Accessibility"
    ],
    "read": [
      "content.json",
      "sample.json",
      "assets/images/asset-manifest.json",
      "index.html",
      "homepage_preview.html",
      "about-us_preview.html",
      "services_preview.html",
      "work_preview.html",
      "blog_preview.html",
      "contact_preview.html",
      "policy_preview.html",
      "single_services_preview.html",
      "assets/css/site.css",
      "assets/js/site.js",
      "README.md"
    ],
    "write": [
      "index.html",
      "homepage_preview.html",
      "about-us_preview.html",
      "services_preview.html",
      "work_preview.html",
      "blog_preview.html",
      "contact_preview.html",
      "policy_preview.html",
      "single_services_preview.html"
    ],
    "checks": [
      "static-syntax"
    ]
  },
  {
    "id": "03-layouts-pages",
    "promptSections": [
      "Pages to Build",
      "Homepage",
      "Page Templates"
    ],
    "read": [
      "content.json",
      "sample.json",
      "assets/images/asset-manifest.json",
      "index.html",
      "homepage_preview.html",
      "about-us_preview.html",
      "services_preview.html",
      "work_preview.html",
      "blog_preview.html",
      "contact_preview.html",
      "policy_preview.html",
      "single_services_preview.html",
      "assets/css/site.css",
      "assets/js/site.js",
      "README.md"
    ],
    "write": [
      "index.html",
      "homepage_preview.html",
      "about-us_preview.html",
      "services_preview.html",
      "work_preview.html",
      "blog_preview.html",
      "contact_preview.html",
      "policy_preview.html",
      "single_services_preview.html"
    ],
    "checks": [
      "static-syntax"
    ],
    "overlapJustification": "Completes the prepared navigation shells as planned, preserving consistent navigation."
  },
  {
    "id": "04-styles",
    "promptSections": [
      "Visual Design Direction",
      "Color System",
      "Typography Direction"
    ],
    "read": [
      "content.json",
      "sample.json",
      "assets/images/asset-manifest.json",
      "index.html",
      "homepage_preview.html",
      "about-us_preview.html",
      "services_preview.html",
      "work_preview.html",
      "blog_preview.html",
      "contact_preview.html",
      "policy_preview.html",
      "single_services_preview.html",
      "assets/css/site.css",
      "assets/js/site.js",
      "README.md"
    ],
    "write": [
      "assets/css/site.css"
    ],
    "checks": [
      "static-syntax"
    ]
  },
  {
    "id": "05-interactions",
    "promptSections": [
      "Functionality",
      "Forms",
      "Accessibility and Motion"
    ],
    "read": [
      "content.json",
      "sample.json",
      "assets/images/asset-manifest.json",
      "index.html",
      "homepage_preview.html",
      "about-us_preview.html",
      "services_preview.html",
      "work_preview.html",
      "blog_preview.html",
      "contact_preview.html",
      "policy_preview.html",
      "single_services_preview.html",
      "assets/css/site.css",
      "assets/js/site.js",
      "README.md"
    ],
    "write": [
      "assets/js/site.js"
    ],
    "checks": [
      "static-syntax"
    ]
  },
  {
    "id": "06-documentation",
    "promptSections": [
      "Supporting Documentation",
      "Definition of done",
      "README REQUIREMENTS"
    ],
    "read": [
      "content.json",
      "sample.json",
      "assets/images/asset-manifest.json",
      "index.html",
      "homepage_preview.html",
      "about-us_preview.html",
      "services_preview.html",
      "work_preview.html",
      "blog_preview.html",
      "contact_preview.html",
      "policy_preview.html",
      "single_services_preview.html",
      "assets/css/site.css",
      "assets/js/site.js",
      "README.md"
    ],
    "write": [
      "README.md"
    ],
    "checks": [
      "static-syntax"
    ]
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
    'Produce plain static HTML/CSS/JavaScript only. No PHP, packages, build tools, network requests, or WordPress output. Preserve sample.json and all approved images/manifest unchanged.',
    'All nine pages must work without JavaScript for navigation. Use only sample-relative links and listed local images. Forms are demos: prevent submission and show accessible honest feedback. Mobile navigation must support Escape and aria-expanded.',
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
