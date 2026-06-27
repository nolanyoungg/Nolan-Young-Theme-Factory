const fs = require('fs');
const path = require('path');

const OUTPUT_FORMAT = `Return only file blocks in this exact format:

---FILE: relative/path.ext---
complete file contents
---END FILE---`;

const SHARED_GENERATION_RULES = [
  'Return every assigned writable file exactly once.',
  'Return complete file contents, not patches.',
  'Do not return read-only context files.',
  'Do not return files outside the writable allowlist.',
  'Do not wrap the response in Markdown fences or JSON.',
  'Do not use external assets, CDN dependencies, remote fonts, remote images, secrets, or machine-specific paths.',
  'Preserve valid WordPress PHP structure.',
  'Close PHP before raw HTML.',
  'Never place an unescaped apostrophe inside a single-quoted PHP string; use double quotes or escape the apostrophe when copy contains contractions or possessives.',
  'Keep template parts as fragments.',
  'Keep document wrappers only in header.php and footer.php.',
  'Use consistent function prefixes.',
  'Never reuse a function name that already appears in any provided read-only context file or already-generated file for the current stage. Choose a distinct function name when a similar helper already exists elsewhere.',
  'Reference only local files that exist or that this stage is explicitly allowed to create.',
  'Use the exact relative paths shown in the writable file lists. Do not shorten, rename, flatten, or relocate nested directories in FILE headers.',
  'If two scaffold files have similar names, preserve the full declared path exactly as listed for this stage.',
  'Do not leave TODOs, Lorem Ipsum, placeholder comments, empty sections, or instructions for future implementation.',
  'If the creative prompt mentions build files, source folders, module names, or template paths that are not present in the prepared theme, preserve the intent and implement it using the actual prepared file tree for this stage.',
  'Treat the declared writable and read-only file lists as authoritative for the current scaffold.',
  'Inside a FILE block, never include Markdown fences such as ```php or ```.',
  'Do not ask clarifying questions, request approval, or describe what you plan to do.',
  'If the prompt and file context provide enough information to proceed, make the best implementation decision and return file blocks only.',
  'Before responding, check that every assigned file is complete and that all braces, parentheses, quotes, PHP blocks, and HTML structures are balanced.'
];

const SHARED_GLOBAL_REQUIREMENTS = `## Shared Global Requirements

- Edit only the prepared generated-theme folder.
- Do not use CDN dependencies, remote fonts, remote images, secrets, or machine-specific paths.
- Return complete files through the strict file-block protocol.
- Preserve valid WordPress escaping, sanitization, PHP syntax, and local asset references.
- Do not leave placeholder content, TODOs, Lorem Ipsum, or future-work instructions.
- Use approved local assets from the asset inventory, or original local SVG marks, icons, textures, and illustrations when no approved photograph was supplied.
- If the prompt references scaffold paths that do not exist in the prepared theme, use the prepared theme tree on disk as the source of truth and implement the same intent through the files assigned to this stage.
- Apply the definition-of-done rules that directly affect this stage's files.`;

const DEFAULT_MAX_STAGE_REQUIRED_FILES = 1;
const CONTENT_HEAVY_STAGE_MAX_REQUIRED_FILES = 1;

const SECTION_OWNERSHIP = {
  'foundation-core': ['01', '02', '03', '04', '05', '06', '15'],
  'navigation-header': ['01', '02', '04', '05', '06', '07', '13', '15'],
  'navigation-menu-shells': ['01', '02', '04', '05', '06', '07', '13', '15'],
  'navigation-menu-panels': ['01', '02', '04', '05', '06', '07', '13', '15'],
  'footer-global': ['01', '02', '04', '05', '06', '08', '10', '11', '13', '15'],
  'front-page-sections': ['01', '02', '04', '05', '06', '11', '12', '13', '15'],
  'front-page-assembly': ['07', '11', '12', '13', '15'],
  'service-templates': ['01', '02', '04', '05', '06', '11', '12', '15'],
  'page-templates': ['01', '02', '04', '05', '06', '09', '10', '11', '12', '15'],
  'wordpress-templates': ['11', '12', '15'],
  'compiled-assets': ['02', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '15'],
  'interactive-assets': ['07', '15'],
  'brand-local-assets': ['05', '13', '15'],
  'theme-documentation': ['14', '15']
};

const TEMPLATE_OWNED_PROMPT_SECTIONS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'];

function normalize(file) {
  return String(file || '').replace(/\\/g, '/').replace(/^\/+/, '');
}

function walkFiles(rootDir, current = rootDir, out = []) {
  if (!fs.existsSync(current)) return out;
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const full = path.join(current, entry.name);
    if (entry.isDirectory()) walkFiles(rootDir, full, out);
    else out.push(normalize(path.relative(rootDir, full)));
  }
  return out.sort();
}

function partition(files, predicate) {
  const matched = [];
  const rest = [];
  files.forEach((file) => (predicate(file) ? matched : rest).push(file));
  return [matched, rest];
}

function addStage(stages, name, files, extra = {}) {
  const normalizedFiles = [...new Set((files || []).map(normalize).filter(Boolean))].sort();
  const normalizedOptional = [...new Set((extra.optionalFiles || []).map(normalize).filter(Boolean))].sort();
  const allowedPatterns = [...new Set(extra.allowedPatterns || [])];
  if (!normalizedFiles.length && !normalizedOptional.length && !allowedPatterns.length) return;
  stages.push({
    name,
    files: normalizedFiles,
    readonly: [...new Set((extra.readonly || []).map(normalize).filter(Boolean))].sort(),
    readonlyDirectories: [...new Set((extra.readonlyDirectories || []).map(normalize).filter(Boolean))].sort(),
    optionalFiles: normalizedOptional,
    allowedPatterns,
    promptSections: extra.promptSections || SECTION_OWNERSHIP[name] || ['15'],
    promptRequirements: [...new Set(extra.promptRequirements || [])],
    focus: extra.focus || `Implement the ${name} stage for the prepared WordPress theme scaffold.`
  });
}

function uniquePatternsForAssetDirs(files, baseDir, extensions) {
  const dirs = [...new Set(files.map((file) => path.posix.dirname(file)).filter((dir) => dir.startsWith(baseDir)))];
  return dirs.map((dir) => `^${dir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/[a-z0-9-]+\\.(${extensions.join('|')})$`);
}

function deriveSiblingPatterns(files) {
  const patterns = [];
  const groups = new Map();
  for (const file of files || []) {
    const normalized = normalize(file);
    const ext = path.posix.extname(normalized).toLowerCase();
    if ('.php' !== ext) continue;
    const dir = path.posix.dirname(normalized);
    groups.set(dir, ext);
  }
  for (const [dir] of groups.entries()) {
    patterns.push(`^${dir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/[a-z0-9-]+\\.php$`);
  }
  return patterns;
}

function isolatedFileStageOverrides(file, stage) {
  const normalized = normalize(file);
  if (normalized === 'functions.php') {
    return {
      readonly: [],
      readonlyDirectories: [],
      focus: 'Implement only functions.php for the prepared theme foundation. Preserve the prepared include architecture, register theme support and menus, enqueue existing local assets only through declared helpers, and return functions.php only.'
    };
  }
  if (normalized === 'style.css') {
    return {
      readonly: ['theme.json'],
      readonlyDirectories: [],
      focus: 'Implement only style.css for the prepared theme foundation and public design system. Use local CSS only, avoid generated PHP or template files, and return style.css only.'
    };
  }
  if (normalized === 'theme.json') {
    return {
      readonly: ['style.css'],
      readonlyDirectories: [],
      focus: 'Implement only theme.json for WordPress global settings and design tokens. Return valid JSON for theme.json only.'
    };
  }
  if (normalized.startsWith('inc/')) {
    return {
      readonly: ['functions.php'],
      readonlyDirectories: [],
      focus: `Implement only ${normalized} for the prepared theme foundation. Do not create sibling include files, do not rename include paths, and return that exact file only.`
    };
  }
  if (normalized === 'searchform.php') {
    return {
      promptSections: ['01', '04', '05', '06', '09', '15'],
      promptRequirements: [
        '01-business-identity',
        '04-color-system',
        '05-visual-design-direction',
        '06-typography-direction',
        '09-forms',
        '15-definition-of-done'
      ],
      focus: 'Implement only the WordPress search form file for the prepared site. Return searchform.php only, with no footer template parts or supporting files.'
    };
  }
  if (normalized === 'footer.php' || normalized.startsWith('template-parts/footer/')) {
    return {
      promptSections: ['01', '04', '05', '06', '08', '10', '15'],
      promptRequirements: [
        '01-business-identity',
        '04-color-system',
        '05-visual-design-direction',
        '06-typography-direction',
        '08-footer',
        '10-newsletter',
        '15-definition-of-done'
      ],
      focus: `Implement only ${normalized} for the prepared footer system. Return that exact file only; do not create sibling footer files.`
    };
  }
  if (normalized === 'header.php' || normalized.startsWith('template-parts/header/')) {
    const headerFile = normalized === 'header.php';
    return {
      promptSections: ['01', '04', '05', '06', '07', '15'],
      promptRequirements: [
        '01-business-identity',
        '04-color-system',
        '05-visual-design-direction',
        '06-typography-direction',
        '07-header-layout',
        '07-mobile-header',
        '15-definition-of-done'
      ],
      focus: headerFile
        ? 'Implement only header.php as the document/header shell for the prepared header/navigation system. Compose existing header template parts with get_template_part(), do not inline a logo SVG, do not replace the scaffold with a whole starter theme, and return header.php only.'
        : `Implement only ${normalized} for the prepared header/navigation system. Keep any inline SVG small and intentional, do not create sibling header files, and return that exact file only.`
    };
  }
  return null;
}

function isTemplateOwnedStructuralFile(file) {
  const normalized = normalize(file);
  return normalized === 'header.php' ||
    normalized === 'footer.php' ||
    normalized === 'front-page.php' ||
    normalized.startsWith('template-parts/header/') ||
    normalized.startsWith('template-parts/footer/') ||
    normalized === 'template-parts/global/content-brand-statement.php' ||
    normalized === 'template-parts/front-page/content-featured-work.php';
}

function chunk(array, size) {
  const out = [];
  for (let index = 0; index < array.length; index += size) out.push(array.slice(index, index + size));
  return out;
}

function maxRequiredFilesForStage(stage) {
  const name = String(stage?.name || '');
  if (/^(front-page-sections|page-templates|wordpress-templates)(-|$)/.test(name)) return CONTENT_HEAVY_STAGE_MAX_REQUIRED_FILES;
  return DEFAULT_MAX_STAGE_REQUIRED_FILES;
}

function isSensitiveLegalTemplate(file) {
  return /(?:^|\/)[a-z0-9-]*(policy|privacy|terms|legal)[a-z0-9-]*\.php$/i.test(normalize(file));
}

function isServiceWrapperTemplate(file) {
  const normalized = normalize(file);
  return /^[^/]+\.php$/.test(normalized) && (/ny_service/i.test(normalized) || /service_category/i.test(normalized));
}

function isDeterministicSupportFile(file) {
  const normalized = normalize(file);
  return normalized === 'functions.php' ||
    normalized === 'style.css' ||
    normalized === 'webpack.config.js' ||
    /^build\//.test(normalized) ||
    /^package(?:-lock)?\.json$/.test(normalized);
}

function isDeterministicCompiledStyle(file) {
  const normalized = normalize(file);
  return /^assets\/css\/[^/]+\.css$/i.test(normalized);
}

function stageNameForFile(stageName, file) {
  return `${stageName}-${path.posix.basename(file, path.posix.extname(file)).replace(/[^a-z0-9]+/gi, '-')}`;
}

function isolatedSensitiveStageOverrides(file, stage) {
  const normalized = normalize(file);
  if (/(?:^|\/)(?:privacy-policy|template-policy)\.php$/i.test(normalized)) {
    return {
      promptSections: ['12', '15'],
      promptRequirements: ['12-template-policy-php', '15-definition-of-done'],
      readonly: ['functions.php', 'header.php', 'footer.php', 'template-parts/content/content-policy.php'],
      focus: 'Implement the dedicated policy/privacy template for the prepared site architecture without emitting unrelated template parts or page templates.'
    };
  }
  if (/(?:^|\/)content-policy\.php$/i.test(normalized)) {
    return {
      promptSections: ['11', '15'],
      promptRequirements: ['11-template-parts-to-fill-in-build-out', '15-definition-of-done'],
      readonly: ['functions.php', 'header.php', 'footer.php'],
      focus: 'Implement the reusable policy content template part without emitting unrelated page templates or other content parts.'
    };
  }
  return {
    promptSections: stage.promptSections,
    promptRequirements: stage.promptRequirements,
    focus: stage.focus
  };
}

function splitOversizedStages(stages) {
  const out = [];
  for (const stage of stages || []) {
    let pendingStages = [stage];
    const requiredFiles = [...(stage.files || [])];
    const hasFlexibleWrites = (stage.optionalFiles || []).length > 0;
    const sensitiveFiles = requiredFiles.filter(isSensitiveLegalTemplate);
    if (sensitiveFiles.length && sensitiveFiles.length < requiredFiles.length && !hasFlexibleWrites) {
      const nonSensitiveFiles = requiredFiles.filter((file) => !sensitiveFiles.includes(file));
      pendingStages = [
        ...sensitiveFiles.map((file) => {
          const overrides = isolatedSensitiveStageOverrides(file, stage);
          return {
            ...stage,
            name: stageNameForFile(stage.name, file),
            files: [file],
            readonly: [...new Set(overrides.readonly || [...(stage.readonly || []), ...requiredFiles.filter((candidate) => candidate !== file)])].sort(),
            promptSections: overrides.promptSections,
            promptRequirements: overrides.promptRequirements,
            focus: `${overrides.focus} This stage isolates a legal/policy-oriented template so the model handles it independently from unrelated content files.`
          };
        }),
        {
          ...stage,
          files: nonSensitiveFiles,
          readonly: [...new Set([...(stage.readonly || []), ...sensitiveFiles])].sort(),
          focus: `${stage.focus} Legal/policy-oriented files are handled in dedicated sibling stages.`
        }
      ].filter((candidate) => candidate.files.length > 0);
    }
    for (const pending of pendingStages) {
      const pendingRequiredFiles = [...(pending.files || [])];
      const maxRequiredFiles = maxRequiredFilesForStage(pending);
      if (pendingRequiredFiles.length <= maxRequiredFiles) {
        out.push(pending);
        continue;
      }
      const pieces = chunk(pendingRequiredFiles, maxRequiredFiles);
      pieces.forEach((piece, index) => {
        const fileOverrides = piece.length === 1 ? isolatedFileStageOverrides(piece[0], pending) : null;
        out.push({
          ...pending,
          name: `${pending.name}-part-${index + 1}`,
          files: piece,
          optionalFiles: [],
          readonly: [...new Set(fileOverrides?.readonly || [...(pending.readonly || []), ...pendingRequiredFiles.filter((file) => !piece.includes(file))])].sort(),
          readonlyDirectories: [...new Set(fileOverrides?.readonlyDirectories || pending.readonlyDirectories || [])].sort(),
          promptSections: fileOverrides?.promptSections || pending.promptSections,
          promptRequirements: fileOverrides?.promptRequirements || pending.promptRequirements,
          focus: fileOverrides?.focus || `${pending.focus} This is chunk ${index + 1} of ${pieces.length} for the same planned ownership stage.`
        });
      });
    }
  }
  return out;
}

function resolveOllamaBatchesForDirectory(targetDir) {
  let files = walkFiles(targetDir).filter((file) => !file.startsWith('.generation/'));
  files = files.filter((file) => file !== '.theme-template-source');
  const stages = [];

  const topLevelPhp = files.filter((file) => /^[^/]+\.php$/.test(file));
  const incPhp = files.filter((file) => file.startsWith('inc/') && file.endsWith('.php'));
  const headerParts = files.filter((file) => file.startsWith('template-parts/header/'));
  const footerParts = files.filter((file) => file.startsWith('template-parts/footer/'));
  const globalParts = files.filter((file) => file.startsWith('template-parts/global/'));
  const frontPageParts = files.filter((file) => file.startsWith('template-parts/front-page/'));
  const contentParts = files.filter((file) => file.startsWith('template-parts/content/'));
  const errorParts = files.filter((file) => file.startsWith('template-parts/errors/'));
  const pageTemplateFiles = files.filter((file) => file.startsWith('page-templates/'));
  const patternFiles = files.filter((file) => file.startsWith('patterns/') || file.startsWith('blocks/'));
  const docsFiles = [];
  const imageFiles = [];
  const imageReadmes = [];
  const assetManifest = files.filter((file) => file === 'assets/images/asset-manifest.json');
  const cssFiles = [];
  const jsFiles = [];
  const buildFiles = files.filter((file) => /(^|\/)(package(-lock)?\.json|webpack\.config\.js|vite\.config\.(js|ts)|rollup\.config\.(js|mjs)|postcss\.config\.(js|cjs)|tailwind\.config\.(js|cjs|ts)|tsconfig\.json)$/.test(file) && !isDeterministicSupportFile(file));
  const serviceTopLevel = [];

  let remainingInc = [...incPhp];
  let remainingTopLevelPhp = [...topLevelPhp];

  const navigationInc = remainingInc.filter((file) => /navigation/i.test(path.posix.basename(file)));
  remainingInc = remainingInc.filter((file) => !navigationInc.includes(file));

  const headerTopLevel = [];
  remainingTopLevelPhp = remainingTopLevelPhp.filter((file) => file !== 'header.php');
  const brandingHeaderParts = [];
  const menuHeaderParts = [];
  const menuShellHeaderParts = menuHeaderParts.filter((file) => /(?:^|\/)(primary-navigation|mobile-navigation)\.php$/i.test(file));
  const megaMenuHeaderParts = menuHeaderParts.filter((file) => !menuShellHeaderParts.includes(file));
  addStage(stages, 'navigation-header', [...headerTopLevel, ...brandingHeaderParts], {
    readonly: ['functions.php', 'theme.json', 'style.css'],
    promptSections: SECTION_OWNERSHIP['navigation-header'],
    promptRequirements: [
      '01-business-identity',
      '04-color-system',
      '05-visual-design-direction',
      '06-typography-direction',
      '07-header-layout',
      '07-mobile-header',
      '13-images',
      '15-definition-of-done'
    ],
    focus: 'Build the prepared site header shell, branding block, and top-level header composition without replacing the scaffold with simpler generic markup.'
  });
  addStage(stages, 'navigation-menu-shells', [...menuShellHeaderParts], {
    readonly: ['functions.php', 'theme.json', 'style.css', 'header.php', ...navigationInc, ...megaMenuHeaderParts],
    promptSections: SECTION_OWNERSHIP['navigation-menu-shells'],
    promptRequirements: [
      '01-business-identity',
      '04-color-system',
      '05-visual-design-direction',
      '06-typography-direction',
      '07-navigation-panel-content-requirements',
      '07-dropdown-navigation-panel-requirements-behavior',
      '07-mobile-accordions',
      '07-required-data-attributes',
      '13-images',
      '15-definition-of-done'
    ],
    focus: 'Build the prepared desktop and mobile navigation shell files, including trigger structure, mobile accordions, and required navigation data attributes.'
  });
  addStage(stages, 'navigation-menu-panels', [], {
    readonly: ['functions.php', 'theme.json', 'style.css', 'header.php'],
    promptSections: SECTION_OWNERSHIP['navigation-menu-panels'],
    promptRequirements: [
      '01-business-identity',
      '04-color-system',
      '05-visual-design-direction',
      '06-typography-direction',
      '07-navigation-panel-content-requirements',
      '07-dropdown-navigation-panel-requirements-behavior',
      '07-mobile-accordions',
      '07-required-data-attributes',
      '07-inside-the-services-and-about-panels',
      '13-images',
      '15-definition-of-done'
    ],
    focus: 'Build the prepared mega-menu logic and panel content for navigation without replacing the scaffold with simpler generic markup.'
  });

  const footerTopLevel = remainingTopLevelPhp.filter((file) => file === 'searchform.php');
  remainingTopLevelPhp = remainingTopLevelPhp.filter((file) => file !== 'footer.php' && !footerTopLevel.includes(file));
  addStage(stages, 'footer-global', [...footerTopLevel], {
    readonly: ['functions.php', 'theme.json', 'style.css'],
    promptSections: SECTION_OWNERSHIP['footer-global'],
    promptRequirements: [
      '01-business-identity',
      '04-color-system',
      '05-visual-design-direction',
      '06-typography-direction',
      '08-footer',
      '10-newsletter',
      '11-template-parts-to-fill-in-build-out',
      '13-images',
      '15-definition-of-done'
    ],
    focus: 'Build the prepared footer system, search form, footer widget areas, and global closing sections.'
  });

  const frontPageAssembly = [];
  remainingTopLevelPhp = remainingTopLevelPhp.filter((file) => file !== 'front-page.php');
  addStage(stages, 'front-page-sections', [], {
    readonly: ['front-page.php', 'functions.php', 'style.css'],
    promptSections: SECTION_OWNERSHIP['front-page-sections'],
    focus: 'Create rich homepage sections and global promotional sections using the prepared scaffold.'
  });
  addStage(stages, 'front-page-assembly', frontPageAssembly, {
    readonlyDirectories: ['template-parts/front-page', 'template-parts/global'],
    readonly: ['header.php', 'footer.php', 'functions.php'],
    promptSections: SECTION_OWNERSHIP['front-page-assembly'],
    focus: 'Assemble the homepage using the prepared section inventory and preserve section order, density, and page rhythm.'
  });

  addStage(stages, 'service-templates', [...serviceTopLevel], {
    readonly: ['functions.php', 'header.php', 'footer.php', 'template-parts/front-page/content-all-services.php', 'template-parts/front-page/content-single-service-highlight.php', 'template-parts/content/content-single.php'],
    promptSections: SECTION_OWNERSHIP['service-templates'],
    promptRequirements: [
      '01-business-identity',
      '05-visual-design-direction',
      '06-typography-direction',
      '12-template-services-php',
      '12-template-single-service-php',
      '15-definition-of-done'
    ],
    focus: 'Implement service-related archive, taxonomy, and singular templates using the prepared content structure.'
  });
  remainingTopLevelPhp = remainingTopLevelPhp.filter((file) => !serviceTopLevel.includes(file));

  addStage(stages, 'page-templates', [], {
    readonly: ['functions.php', 'header.php', 'footer.php', 'template-parts/global/content-brand-statement.php', 'template-parts/global/content-cta-banner.php', 'template-parts/front-page/content-process.php', 'template-parts/front-page/content-testimonials.php', 'template-parts/front-page/content-blog-preview.php'],
    promptSections: SECTION_OWNERSHIP['page-templates'],
    promptRequirements: [
      '01-business-identity',
      '05-visual-design-direction',
      '06-typography-direction',
      '09-forms',
      '10-newsletter',
      '12-template-about-us-php',
      '12-template-work-php',
      '12-template-blog-php',
      '12-template-contact-php',
      '12-template-policy-php',
      '15-definition-of-done'
    ],
    focus: 'Implement page templates for the prepared site architecture, with complete content, hierarchy, and conversion-ready sections.'
  });

  const reservedTopLevel = new Set(['functions.php', 'style.css', 'theme.json']);
  const standardTopLevel = [];
  addStage(stages, 'wordpress-templates', [], {
    readonly: ['functions.php', 'header.php', 'footer.php', 'front-page.php'],
    promptSections: SECTION_OWNERSHIP['wordpress-templates'],
    promptRequirements: [
      '15-definition-of-done'
    ],
    focus: 'Implement the standard WordPress templates and reusable content parts that remain outside dedicated homepage and page-template stages.'
  });

  const foundationFiles = [];
  addStage(stages, 'foundation-core', foundationFiles, {
    readonlyDirectories: ['assets'],
    promptSections: SECTION_OWNERSHIP['foundation-core'],
    focus: 'Implement only theme.json for WordPress global settings, design tokens, spacing, typography, colors, and editor presets. Do not return PHP, documentation, style.css, or support files.'
  });

  const interactiveFiles = [...new Set(jsFiles.filter((file) => !imageFiles.includes(file) && !/README\.md$/i.test(file) && !isDeterministicSupportFile(file)))].sort();
  addStage(stages, 'interactive-assets', interactiveFiles, {
    readonly: ['header.php', 'footer.php', 'front-page.php'],
    promptSections: SECTION_OWNERSHIP['interactive-assets'],
    focus: 'Implement interactive behavior, accessibility controls, and state management for the prepared front-end scaffold.'
  });

  const compiledAssetFiles = [...new Set([...cssFiles, ...buildFiles].filter((file) => !/README\.md$/i.test(file)))].sort();
  addStage(stages, 'compiled-assets', compiledAssetFiles, {
    readonly: ['functions.php', 'theme.json'],
    promptSections: SECTION_OWNERSHIP['compiled-assets'],
    focus: 'Implement the prepared styling system, compiled assets, design tokens, and build-layer files that exist in the scaffold.'
  });

  const brandFiles = [...imageFiles].sort();
  const allowedPatterns = [
    ...uniquePatternsForAssetDirs(brandFiles.filter((file) => file.startsWith('assets/icons/')), 'assets/icons', ['svg']),
    ...uniquePatternsForAssetDirs(brandFiles.filter((file) => file.startsWith('assets/images/')), 'assets/images', ['svg', 'png', 'webp', 'jpg', 'jpeg', 'gif', 'avif'])
  ];
  addStage(stages, 'brand-local-assets', brandFiles, {
    readonly: [...assetManifest],
    optionalFiles: [],
    allowedPatterns,
    promptSections: SECTION_OWNERSHIP['brand-local-assets'],
    focus: 'Create or refine original local visual assets only within the prepared asset directories and declared local formats.'
  });

  const docsStageFiles = [...new Set([...docsFiles, ...imageReadmes])].sort();
  addStage(stages, 'theme-documentation', docsStageFiles, {
    readonly: [...assetManifest],
    promptSections: SECTION_OWNERSHIP['theme-documentation'],
    focus: 'Document the generated theme and prepared asset usage without inventing provenance or licensing claims.'
  });

  return splitOversizedStages(stages);
}

function validateStagePlan(batches) {
  const errors = [];
  for (const batch of batches || []) {
    const required = batch.files || [];
    const optional = batch.optionalFiles || [];
    const readonly = batch.readonly || [];
    const readonlyDirs = batch.readonlyDirectories || [];
    const exactGroups = [
      ['required', required],
      ['optional', optional],
      ['readonly', readonly],
      ['readonlyDirectories', readonlyDirs]
    ];
    for (const [label, values] of exactGroups) {
      const seen = new Set();
      values.forEach((value) => {
        if (seen.has(value)) errors.push(`${batch.name}: duplicate ${label} path ${value}`);
        seen.add(value);
      });
    }
    required.filter((file) => optional.includes(file)).forEach((file) => errors.push(`${batch.name}: required file is also optional: ${file}`));
    required.filter((file) => readonly.includes(file)).forEach((file) => errors.push(`${batch.name}: required file is also read-only: ${file}`));
    optional.filter((file) => readonly.includes(file)).forEach((file) => errors.push(`${batch.name}: optional file is also read-only: ${file}`));
  }
  if (errors.length) throw new Error(`Invalid Ollama stage plan:\n${errors.join('\n')}`);
  return true;
}

function creativePromptFromBrief(brief) {
  const marker = '\n## Creative Prompt\n';
  const markerIndex = brief.indexOf(marker);
  return markerIndex === -1 ? brief : brief.slice(markerIndex + marker.length).trim();
}

function ollamaStageSequence(batches) {
  return (batches || []).map((batch) => `build-${batch.name}`);
}

module.exports = {
  SECTION_OWNERSHIP,
  creativePromptFromBrief,
  ollamaStageSequence,
  OUTPUT_FORMAT,
  resolveOllamaBatchesForDirectory,
  SHARED_GENERATION_RULES,
  SHARED_GLOBAL_REQUIREMENTS,
  TEMPLATE_OWNED_PROMPT_SECTIONS,
  validateStagePlan
};
