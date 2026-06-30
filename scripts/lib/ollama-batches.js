const fs = require('fs');
const path = require('path');
const { GENERATED_DETAILED_PAGE_TEMPLATES } = require('./constants');

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
  'This is an authorized local WordPress theme generation task for the user-owned repository; do not refuse or answer conversationally.',
  'Do not use external assets, CDN dependencies, remote fonts, remote images, secrets, or machine-specific paths.',
  'Do not invent local image paths. Only reference local assets that exist in the prepared theme context or assets that this exact stage is allowed to return as FILE blocks.',
  'Preserve valid WordPress PHP structure.',
  'Never call wp_reset_query(); use wp_reset_postdata() only after setup_postdata() or WP_Query loops.',
  'Do not call get_categories(), get_category_link(), or get_terms(); use explicit static topic/category links or existing post loop data for visible Blog pages.',
  'Close PHP before raw HTML.',
  'Never place an unescaped apostrophe inside a single-quoted PHP string; use double quotes or escape the apostrophe when copy contains contractions or possessives.',
  'Keep template parts as fragments.',
  'Keep document wrappers only in header.php and footer.php.',
  'Use consistent function prefixes.',
  'Never reuse a function name that already appears in any provided read-only context file or already-generated file for the current stage. Choose a distinct function name when a similar helper already exists elsewhere.',
  'Do not call theme-prefixed helper functions such as nytt01_*, ny_*, or nolan_young_* unless that exact function already exists in the provided context or is declared in the returned file.',
  'Reference only local files that exist or that this stage is explicitly allowed to create.',
  'Use the exact relative paths shown in the writable file lists. Do not shorten, rename, flatten, or relocate nested directories in FILE headers.',
  'If two scaffold files have similar names, preserve the full declared path exactly as listed for this stage.',
  'Never include a .php extension inside get_template_part() arguments; WordPress adds .php automatically.',
  "When reading local array keys in PHP, either define every read key on every item in the local array or use null-coalescing defaults such as $item['title'] ?? '' for optional keys.",
  'Do not leave TODOs, Lorem Ipsum, placeholder comments, empty sections, or instructions for future implementation.',
  'Do not use placeholder people such as John Doe, Jane Doe, John Smith, Jane Smith, or Mike Johnson. Use role-based proof points or real business copy instead.',
  'Do not use placeholder companies such as Example Corp, Example Inc, Example Company, or Acme. Use anonymized role-based proof attribution instead.',
  'Do not use generic numbered placeholders such as Case Study 1, Project 1, Service 1, or "Description of the project". Write specific Nolan Young business proof copy instead.',
  'Do not invent phone numbers, street addresses, ZIP codes, or generic info@ email addresses. If no real contact details are supplied, use form-first inquiry copy and non-fake routing labels instead.',
  'Detailed page templates must write explicit hero and body copy; do not call get_the_excerpt() or the_content() for page hero, subtitle, intro, or main section text.',
  'Use the brand as "Nolan Young" or "Nolan Young Designs"; never shorten it to "Nolan Designs".',
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
- Do not invent local image paths. Only reference local assets that exist in the prepared theme context or assets that this exact stage is allowed to return as FILE blocks.
- Page-template stages normally cannot write image files, so they should prefer CSS shapes, text cards, existing asset-inventory images, or inline SVG markup over img tags with made-up paths.
- Return complete files through the strict file-block protocol.
- This is an authorized local WordPress theme generation task for the user-owned repository; do not refuse or answer conversationally.
- Preserve valid WordPress escaping, sanitization, PHP syntax, and local asset references.
- Never call wp_reset_query(); use wp_reset_postdata() only after setup_postdata() or WP_Query loops.
- Do not call get_categories(), get_category_link(), or get_terms(); use explicit static topic/category links or existing post loop data for visible Blog pages.
- Do not call theme-prefixed helper functions such as nytt01_*, ny_*, or nolan_young_* unless that exact function already exists in the provided context or is declared in the returned file.
- Never include a .php extension inside get_template_part() arguments; WordPress adds .php automatically.
- When reading local array keys in PHP, either define every read key on every item in the local array or use null-coalescing defaults such as $item['title'] ?? '' for optional keys.
- Do not leave placeholder content, TODOs, Lorem Ipsum, or future-work instructions.
- Do not use placeholder people such as John Doe, Jane Doe, John Smith, Jane Smith, or Mike Johnson. Use role-based proof points or real business copy instead.
- Do not use placeholder companies such as Example Corp, Example Inc, Example Company, or Acme. Use anonymized role-based proof attribution instead.
- Do not use generic numbered placeholders such as Case Study 1, Project 1, Service 1, or "Description of the project". Write specific Nolan Young business proof copy instead.
- Do not invent phone numbers, street addresses, ZIP codes, or generic info@ email addresses. If no real contact details are supplied, use form-first inquiry copy and non-fake routing labels instead.
- Detailed page templates must write explicit hero and body copy; do not call get_the_excerpt() or the_content() for page hero, subtitle, intro, or main section text.
- Use the brand as "Nolan Young" or "Nolan Young Designs"; never shorten it to "Nolan Designs".
- Use approved local assets from the asset inventory, or original local SVG marks, icons, textures, and illustrations when no approved photograph was supplied.
- If the prompt references scaffold paths that do not exist in the prepared theme, use the prepared theme tree on disk as the source of truth and implement the same intent through the files assigned to this stage.
- Apply the definition-of-done rules that directly affect this stage's files.`;

const DEFAULT_MAX_STAGE_REQUIRED_FILES = 3;
const CONTENT_HEAVY_STAGE_MAX_REQUIRED_FILES = 4;

const SECTION_OWNERSHIP = {
  'foundation-core': ['01', '02', '03', '04', '05', '06', '15'],
  'global-frame': ['01', '02', '04', '05', '06', '07', '08', '10', '11', '13', '15'],
  'global-header-frame': ['01', '02', '04', '05', '06', '07', '11', '13', '15'],
  'global-footer-frame': ['01', '02', '04', '05', '06', '08', '10', '11', '12', '13', '15'],
  'navigation-header': ['01', '02', '04', '05', '06', '07', '13', '15'],
  'navigation-menu-shells': ['01', '02', '04', '05', '06', '07', '13', '15'],
  'navigation-menu-panels': ['01', '02', '04', '05', '06', '07', '13', '15'],
  'footer-global': ['01', '02', '04', '05', '06', '08', '10', '11', '13', '15'],
  'front-page-sections': ['01', '02', '04', '05', '06', '11', '12', '13', '15'],
  'front-page-assembly': ['07', '11', '12', '13', '15'],
  'front-page-final': ['01', '02', '04', '05', '06', '07', '11', '12', '13', '15'],
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
    requiredTemplateParts: [...new Set((extra.requiredTemplateParts || []).map(normalize).filter(Boolean))].sort(),
    promptSections: extra.promptSections || SECTION_OWNERSHIP[name] || ['15'],
    promptRequirements: [...new Set(extra.promptRequirements || [])],
    creativePrompt: extra.creativePrompt || null,
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
  if (normalized === 'front-page.php') {
    const requiredTemplateParts = [
      'template-parts/front-page/content-all-services.php',
      'template-parts/front-page/content-blog-preview.php',
      'template-parts/front-page/content-featured-work.php',
      'template-parts/front-page/content-process.php',
      'template-parts/front-page/content-service-highlight.php',
      'template-parts/front-page/content-style-pillars.php',
      'template-parts/front-page/content-testimonials.php',
      'template-parts/global/content-brand-statement.php',
      'template-parts/global/content-cta-banner.php',
      'template-parts/global/content-hero.php'
    ];
    return {
      promptSections: ['15'],
      promptRequirements: [
        '12-front-page-php',
        '15-definition-of-done'
      ],
      readonly: ['functions.php', 'header.php', 'footer.php', ...requiredTemplateParts],
      readonlyDirectories: [],
      requiredTemplateParts,
      creativePrompt: `This stage owns front-page.php only.

Preserve front-page.php as a WordPress page shell that calls get_header(), opens <main id="primary" class="nytt01-site-main">, calls the existing prepared homepage/global template parts, closes </main>, and calls get_footer().

Do not create new homepage section file names from the production prompt. Do not rename section slugs. Do not use comments to label sections. Do not move content-brand-statement or content-cta-banner into template-parts/front-page.

The only allowed homepage section calls are the exact calls listed in Required Existing Template Part Calls below. Return front-page.php exactly once and do not return any template-part fragments.`,
      focus: 'Implement only front-page.php as the homepage assembly. This is a composition-preservation stage: copy the exact get_template_part() path pairs shown in Required Existing Template Part Calls, preserve their order, and do not move global fragments into template-parts/front-page. content-brand-statement and content-cta-banner must stay under template-parts/global. Do not inline replacement homepage sections here. Return front-page.php only.'
    };
  }
  if (normalized.startsWith('template-parts/front-page/') || normalized.startsWith('template-parts/global/')) {
    return {
      promptSections: ['01', '04', '05', '06', '11', '12', '13', '15'],
      promptRequirements: [
        '01-business-identity',
        '04-color-system',
        '05-visual-design-direction',
        '06-typography-direction',
        '11-template-parts-to-fill-in-build-out',
        '12-front-page-php',
        '13-images',
        '15-definition-of-done'
      ],
      readonly: ['functions.php', 'header.php', 'footer.php', 'front-page.php'],
      readonlyDirectories: [],
      focus: `Implement only ${normalized} as a polished homepage/global section fragment. Make the section visually distinct from the template, content-rich, accessible, and mobile-first. Do not call get_header() or get_footer(), do not create sibling files, and return that exact file only.`
    };
  }
  if (normalized.startsWith('page-templates/')) {
    const templateRequirementByFile = {
      'page-templates/template-about-us.php': '12-template-about-us-php',
      'page-templates/template-services.php': '12-template-services-php',
      'page-templates/template-single-service.php': '12-template-single-service-php',
      'page-templates/template-service-detail.php': '12-template-single-service-php',
      'page-templates/template-work.php': '12-template-work-php',
      'page-templates/template-blog.php': '12-template-blog-php',
      'page-templates/template-blog-landing.php': '12-template-blog-php',
      'page-templates/template-contact.php': '12-template-contact-php'
    };
    const pageRequirement = templateRequirementByFile[normalized] || '12-page-templates-to-fill-in-build-out';
    const fileSpecificGuidance = {
      'page-templates/template-about-us.php': 'For the About page, include company positioning, approach, values, operating principles, proof points, and a contact CTA without inventing unsupported biographical claims. Proof points must be specific anonymized business outcomes or service scenarios, not Case Study 1/2/3, Project 1, or Description of the project placeholders.',
      'page-templates/template-blog-landing.php': 'For the Blog page, include a featured article lead, topic/category navigation, article-card grid, excerpt treatment, search access, and a resource/newsletter CTA or editorial aside. Do not rely only on the WordPress loop and pagination. Do not call get_categories(); use explicit editorial topic chips or categories derived from the visible fixture/article data.',
      'page-templates/template-contact.php': 'For the Contact page, include inquiry guidance, full accessible form markup or shortcode fallback, expectation-setting copy, project-fit prompts, response timing, contact pathways, and supporting details. Do not return only a shortcode wrapper, plugin notice, or one generic section.',
      'page-templates/template-service-detail.php': "For the Service Detail page, include outcomes, deliverables, process, fit criteria, FAQ or proof, and the service inquiry pathway directly in this file. Do not rely only on content-page plus process/CTA fragments. If using the prepared CTA fragment, call get_template_part( 'template-parts/global/content', 'cta-banner' ); never call template-parts/content/content-cta-banner.php.",
      'page-templates/template-services.php': 'For the Services page, write explicit hero and intro copy instead of get_the_excerpt(). Include at least four Nolan Young-specific service cards, decision guidance, package or comparison cards, process proof, fit criteria, and contact CTAs. Use concrete service names such as Launch Readiness Audit, Conversion Homepage System, Service Page Architecture, Accessible WordPress Build, Performance Cleanup Sprint, and Care Plan Handoff. Do not use generic service labels such as Custom WordPress Development, Responsive Design, or SEO Optimization.',
      'page-templates/template-work.php': 'For the Work page, write explicit hero and intro copy instead of get_the_excerpt(). Include project categories, selected work cards with outcome metrics, process connection, proof details, and clear service/contact CTAs. Use specific anonymized project labels such as Membership Portal Relaunch, Local Service Booking Flow, Nonprofit Donation Storyline, Professional Services Authority Hub, and Care Plan Recovery Sprint. Do not use generic project labels such as E-commerce Website, Non-profit Organization Site, or Corporate Blog.'
    }[normalized] || '';
    const creativePromptByFile = {
      'page-templates/template-about-us.php': `This stage owns only page-templates/template-about-us.php.

Build a complete About page with:
- explicit hero and intro copy for Nolan Young Designs, not get_the_excerpt()
- positioning for WordPress strategy, design systems, implementation, and support
- operating principles and values with concrete service-business language
- process or collaboration sections that feel distinct from the homepage
- proof points using specific anonymized outcomes or role-based scenarios
- a clear contact CTA

Do not use placeholder proof labels such as Case Study 1, Case Study 2, Project 1, or generic "What We Achieve" filler. Do not invent personal biography claims or named team members. Return page-templates/template-about-us.php only.`,
      'page-templates/template-blog-landing.php': `This stage owns only page-templates/template-blog-landing.php.

Build a complete Blog landing page with:
- a strong editorial hero
- a featured article area
- static topic chips using a local PHP array of labels and safe static links such as #latest, #accessibility, #performance, #design-systems
- a post/article card grid using WP_Query or visible fallback cards
- search access or resource/navigation support
- a newsletter/resource CTA using the existing global CTA template part if helpful

Do not call get_categories(), get_category_link(), get_terms(), or any category taxonomy API. The deterministic preview harness does not support category APIs.
Do not call get_template_part() for post/article cards or content templates in this file. Render article cards inline inside this template so you do not invent paths such as get_template_part( 'template-parts/content', 'search' ).
Do not add img tags, image fields, or image array keys for hero, featured article, or post cards unless the exact referenced file exists in assets/images. Prefer editorial cards, CSS panels, or inline SVG accents if no approved image is available. Never write comments such as "placeholder image" or "ensure this exists".
If you use the existing global CTA, the only allowed get_template_part() call in this Blog template is get_template_part( 'template-parts/global/content', 'cta-banner' ).

Do not return a thin loop-only page. Include multiple visible sections directly in this file. Return page-templates/template-blog-landing.php only.`,
      'page-templates/template-contact.php': `This stage owns only page-templates/template-contact.php.

Build a complete Contact page with:
- a clear hero for project inquiries
- expectation-setting copy for response timing and fit
- a full accessible static inquiry form with labels, help text, and project-fit fields
- a section explaining what to include in the brief
- non-fake contact pathways such as "Project intake", "Support handoff", and "Accessibility review" as routing labels only
- a small FAQ or decision guide for next steps
- a final conversion CTA

Do not write any email address, including @nolanyoung.com addresses. Do not include a phone field at all. Do not invent phone numbers, street addresses, ZIP codes, office locations, guaranteed response windows, 24-hour promises, free consultation promises, or generic info@ identities. Never write the exact phrases "within 24 hours", "24-hour", "free consultation", or "free consultations", even as an FAQ question. Use the form as the contact mechanism and describe routing labels without fake contact details.
Do not use shortcode_exists(), do_shortcode(), current_user_can(), plugin notices, or conditional PHP to render the form. Do not return a thin contact-form wrapper. Include at least ten visible structural elements across sections, cards, form groups, lists, or asides. Return page-templates/template-contact.php only.`,
      'page-templates/template-service-detail.php': `This stage owns only page-templates/template-service-detail.php.

Build a complete Service Detail page for a Nolan Young WordPress engagement with:
- explicit hero and intro copy, not get_the_excerpt()
- outcomes, deliverables, process, fit criteria, proof, FAQ, and inquiry pathway sections
- concrete service-business language for accessibility, content systems, launch readiness, and support
- proof cards labeled with specific non-placeholder names such as "Mobile readiness proof", "Content governance proof", or "Launch confidence proof"
- the required CTA call: get_template_part( 'template-parts/global/content', 'cta-banner' )

Do not write the exact strings "Case Study 1", "Case Study 2", "Project 1", "Service 1", or "Description of the project"; those strings fail validation. Do not use while ( have_posts() ), the_content(), get_the_excerpt(), or mixed brace/alternative PHP control syntax. Do not label sections with PHP comments. Keep all visible page body copy explicit in this file. Return page-templates/template-service-detail.php only.`,
      'page-templates/template-services.php': `This stage owns only page-templates/template-services.php.

Build a complete Services page with explicit hero and intro copy, not get_the_excerpt().

Use this exact service-card title set or a close Nolan Young-specific variant:
- Launch Readiness Audit
- Conversion Homepage System
- Service Page Architecture
- Accessible WordPress Build
- Performance Cleanup Sprint
- Care Plan Handoff

Include decision guidance, package or comparison cards, process proof, fit criteria, FAQ or buyer questions, and contact CTAs. The copy should describe Nolan Young Designs helping service businesses plan, design, launch, and maintain WordPress sites.

Never use the generic labels "Custom WordPress Development", "Responsive Design", "SEO Optimization", "Website Maintenance", or "User Experience Design"; those labels fail validation for this repo. Do not return a thin service grid. Return page-templates/template-services.php only.
Do not add service-card image paths unless the exact files exist in assets/images. Use numbered badges, inline SVG symbols, CSS gradients, or text-first cards instead of made-up /images/*.svg paths.`,
      'page-templates/template-work.php': `This stage owns only page-templates/template-work.php.

Build a complete Work page with explicit hero and intro copy, not get_the_excerpt().

Use specific anonymized project labels such as:
- Membership Portal Relaunch
- Local Service Booking Flow
- Nonprofit Donation Storyline
- Professional Services Authority Hub
- Care Plan Recovery Sprint

Include project categories, selected work cards with outcome metrics, mobile/detail notes, process connection, proof details, and clear Services/Contact CTAs. Keep the examples anonymized but specific to Nolan Young Designs work.

Never use the generic labels "E-commerce Website", "Non-profit Organization Site", or "Corporate Blog"; those labels fail validation for this repo. Do not return a thin portfolio grid. Return page-templates/template-work.php only.
Do not add work-card image paths unless the exact files exist in assets/images. Use result cards, CSS panels, inline SVG symbols, or text-first cards instead of made-up /images/*.svg paths.`
    };
    return {
      promptSections: ['01', '04', '05', '06', '09', '10', '11', '12', '13', '15'],
      promptRequirements: [
        '01-business-identity',
        '04-color-system',
        '05-visual-design-direction',
        '06-typography-direction',
        '09-forms',
        '10-newsletter',
        '11-template-parts-to-fill-in-build-out',
        pageRequirement,
        '13-images',
        '15-definition-of-done'
      ],
      readonly: ['functions.php', 'header.php', 'footer.php', 'front-page.php'],
      readonlyDirectories: ['template-parts', 'assets/images'],
      requiredTemplateParts: normalized === 'page-templates/template-service-detail.php' ? [
        'template-parts/global/content-cta-banner.php'
      ] : [],
      creativePrompt: creativePromptByFile[normalized] || null,
      focus: `Implement only ${normalized} as a complete, production-ready page template. It must be substantially different from the starting template, content-rich, accessible, and intentionally responsive on mobile. Include multiple page-owned sections directly in this file; reusable template parts may supplement the page but must not be the whole page body. ${fileSpecificGuidance} Preserve a valid WordPress Template Name header when the file uses one. Use only get_template_part() paths that exist in the prepared scaffold; never invent flattened paths such as template-parts/content-cta-banner.php. Return that exact file only.`
    };
  }
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
      promptSections: headerFile ? ['15'] : ['01', '04', '05', '06', '07', '15'],
      promptRequirements: [
        ...(headerFile ? [] : [
          '01-business-identity',
          '04-color-system',
          '05-visual-design-direction',
          '06-typography-direction',
          '07-header-layout',
          '07-mobile-header'
        ]),
        '15-definition-of-done'
      ],
      focus: headerFile
        ? 'Implement only header.php as the document/header shell for the prepared header/navigation system. This is a composition-preservation stage, not a navigation implementation stage: preserve the existing site-branding and primary-navigation get_template_part() calls exactly, keep their order, keep the data-nytt01-menu-toggle control, do not add mobile-navigation here, do not inline a replacement nav menu, do not replace the scaffold with a whole starter theme, and return header.php only.'
        : `Implement only ${normalized} for the prepared header/navigation system. Keep any inline SVG small and intentional, do not create sibling header files, and return that exact file only.`,
      requiredTemplateParts: headerFile ? [
        'template-parts/header/primary-navigation.php',
        'template-parts/header/site-branding.php'
      ] : []
    };
  }
  return null;
}

function chunk(array, size) {
  const out = [];
  for (let index = 0; index < array.length; index += size) out.push(array.slice(index, index + size));
  return out;
}

function maxRequiredFilesForStage(stage) {
  const name = String(stage?.name || '');
  if (/^navigation-header(?:-|$)/.test(name)) return 3;
  if (/^global-frame(?:-|$)/.test(name)) return CONTENT_HEAVY_STAGE_MAX_REQUIRED_FILES;
  if (/^global-header-frame(?:-|$)/.test(name)) return 3;
  if (/^global-footer-frame(?:-|$)/.test(name)) return 3;
  if (/^navigation-menu-shells(?:-|$)/.test(name)) return 2;
  if (/^footer-global(?:-|$)/.test(name)) return 2;
  if (/^front-page-sections(?:-|$)/.test(name)) return CONTENT_HEAVY_STAGE_MAX_REQUIRED_FILES;
  if (/^page-templates-service-suite(?:-|$)/.test(name)) return 3;
  if (/^page-templates(?:-|$)/.test(name)) return 2;
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
        const fileOverrides = pendingRequiredFiles.length === 1 ? isolatedFileStageOverrides(pendingRequiredFiles[0], pending) : null;
        out.push(fileOverrides ? {
          ...pending,
          readonly: [...new Set(fileOverrides.readonly || pending.readonly || [])].sort(),
          readonlyDirectories: [...new Set(fileOverrides.readonlyDirectories || pending.readonlyDirectories || [])].sort(),
          promptSections: fileOverrides.promptSections || pending.promptSections,
          promptRequirements: fileOverrides.promptRequirements || pending.promptRequirements,
          creativePrompt: fileOverrides.creativePrompt || pending.creativePrompt,
          requiredTemplateParts: [...new Set(fileOverrides.requiredTemplateParts || pending.requiredTemplateParts || [])].sort(),
          focus: fileOverrides.focus || pending.focus
        } : pending);
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
          creativePrompt: fileOverrides?.creativePrompt || pending.creativePrompt,
          requiredTemplateParts: [...new Set(fileOverrides?.requiredTemplateParts || pending.requiredTemplateParts || [])].sort(),
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

  const headerTopLevel = remainingTopLevelPhp.filter((file) => file === 'header.php');
  remainingTopLevelPhp = remainingTopLevelPhp.filter((file) => file !== 'header.php');
  const brandingHeaderParts = headerParts.filter((file) => /(?:^|\/)site-branding\.php$/i.test(file));
  const menuHeaderParts = headerParts.filter((file) => /(?:^|\/)(primary-navigation|mobile-navigation|mega-menu-[a-z0-9-]+)\.php$/i.test(file));
  const menuShellHeaderParts = menuHeaderParts.filter((file) => /(?:^|\/)primary-navigation\.php$/i.test(file));
  const templateOwnedHeaderParts = menuHeaderParts.filter((file) => !menuShellHeaderParts.includes(file));
  const megaMenuHeaderParts = templateOwnedHeaderParts.filter((file) => /(?:^|\/)mega-menu-[a-z0-9-]+\.php$/i.test(file));
  const footerTopLevel = remainingTopLevelPhp.filter((file) => file === 'footer.php');
  remainingTopLevelPhp = remainingTopLevelPhp.filter((file) => file !== 'footer.php');
  const frontPageAssembly = remainingTopLevelPhp.filter((file) => file === 'front-page.php');
  remainingTopLevelPhp = remainingTopLevelPhp.filter((file) => file !== 'front-page.php');
  const homepageSectionFiles = new Set([...globalParts, ...frontPageParts].map(normalize));
  const requiredFrontPageTemplateParts = [
    'template-parts/front-page/content-all-services.php',
    'template-parts/front-page/content-blog-preview.php',
    'template-parts/front-page/content-featured-work.php',
    'template-parts/front-page/content-process.php',
    'template-parts/front-page/content-service-highlight.php',
    'template-parts/front-page/content-style-pillars.php',
    'template-parts/front-page/content-testimonials.php',
    'template-parts/global/content-brand-statement.php',
    'template-parts/global/content-cta-banner.php',
    'template-parts/global/content-hero.php'
  ].filter((file) => homepageSectionFiles.has(file));
  addStage(stages, 'global-header-frame', [...brandingHeaderParts, ...menuShellHeaderParts], {
    readonly: ['functions.php', 'theme.json', 'style.css', ...headerTopLevel, ...navigationInc, ...templateOwnedHeaderParts],
    promptSections: SECTION_OWNERSHIP['global-header-frame'],
    promptRequirements: [
      '01-business-identity',
      '04-color-system',
      '05-visual-design-direction',
      '06-typography-direction',
      '07-header-layout',
      '07-mobile-header',
      '07-navigation-panel-content-requirements',
      '07-dropdown-navigation-panel-requirements-behavior',
      '07-mobile-accordions',
      '07-required-data-attributes',
      '11-template-parts-to-fill-in-build-out',
      '13-images',
      '15-definition-of-done'
    ],
    creativePrompt: `This stage owns only rendered header fragments.

header.php is read-only template-owned scaffold for this run. Do not return header.php. Do not recreate the document shell, wp_head(), wp_body_open(), skip link, top bar, or outer header container.

For template-parts/header/site-branding.php, refine only the brand mark/text area using local markup and escaped WordPress functions.

For template-parts/header/primary-navigation.php, refine the prepared menu wrapper markup, accessible labels, dropdown/accordion trigger content, and mobile-friendly link groups without editing inc/navigation.php or mega-menu template parts. template-parts/header/mobile-navigation.php is a template-owned unused extension point in this scaffold; do not return it from this stage.

Return every writable file listed for this stage exactly once. Do not return footer.php, front-page.php, footer template parts, or homepage section fragments from this header stage.`,
    focus: 'Build the prepared rendered header branding/navigation fragments only. header.php remains template-owned scaffold.'
  });
  addStage(stages, 'global-footer-frame', [...footerTopLevel, ...footerParts, ...frontPageAssembly], {
    readonly: ['functions.php', 'theme.json', 'style.css', ...headerTopLevel, ...navigationInc, ...templateOwnedHeaderParts, ...brandingHeaderParts, ...menuShellHeaderParts, ...requiredFrontPageTemplateParts],
    requiredTemplateParts: [
      ...(footerParts.includes('template-parts/footer/footer-widgets.php') ? ['template-parts/footer/footer-widgets.php'] : []),
      ...requiredFrontPageTemplateParts
    ],
    promptSections: SECTION_OWNERSHIP['global-footer-frame'],
    promptRequirements: [
      '01-business-identity',
      '04-color-system',
      '05-visual-design-direction',
      '06-typography-direction',
      '08-footer',
      '10-newsletter',
      '11-template-parts-to-fill-in-build-out',
      '12-front-page-php',
      '13-images',
      '15-definition-of-done'
    ],
    creativePrompt: `This stage owns only footer.php, footer widget fragments, and front-page.php.

For footer.php and template-parts/footer/footer-widgets.php, build the prepared footer system, footer widget area, newsletter/contact paths, and global legal/navigation rows. If footer.php calls the footer widget fragment, it must use the exact prepared path template-parts/footer/footer-widgets.php, not template-parts/content-footer-widgets.php.

For front-page.php, preserve it as the homepage assembly file only: call get_header(), open <main id="primary" class="nytt01-site-main">, call the required existing homepage/global template parts exactly, close </main>, and call get_footer(). Do not inline homepage section content in front-page.php.

Return every writable file listed for this stage exactly once. Do not return header template parts or homepage section fragments from this footer/front-page stage.`,
    focus: 'Build the prepared footer system and front-page assembly. front-page.php must stay as a composition shell that calls existing homepage/global fragments.'
  });
  addStage(stages, 'navigation-menu-shells', [], {
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

  const frontPageSectionGroups = [
    {
      name: 'front-page-sections-hero-services',
      files: [
        'template-parts/global/content-hero.php',
        'template-parts/front-page/content-all-services.php',
        'template-parts/front-page/content-featured-work.php'
      ],
      creativePrompt: `This stage owns hero, services overview, and featured work fragments.

Use the brand exactly as "Nolan Young Designs" when a full brand name is needed, or "Nolan Young" when referring to the person/business shorthand. Never write "Nolan Designs".

Create specific homepage copy for WordPress strategy, conversion-focused service pages, mobile detail, maintainable implementation, and selected work outcomes.

For the hero fragment, do not invent numeric proof stats or generic claims such as "98% Client Satisfaction", "3+ Years of Experience", "200+ Projects Delivered", "Happy Clients", or "Satisfaction Rate". Use qualitative proof labels instead, such as Mobile-ready planning, Launch-safe handoff, Accessible service paths, Conversion section clarity, or Maintainable WordPress delivery.

Service titles should be Nolan Young-specific, not generic labels like Custom WordPress Development, Custom Development, Responsive Design, or SEO Optimization. Return only the assigned section fragments.`
    },
    {
      name: 'front-page-sections-process',
      files: [
        'template-parts/front-page/content-blog-preview.php',
        'template-parts/front-page/content-process.php',
        'template-parts/front-page/content-service-highlight.php'
      ],
      creativePrompt: `This stage owns process, service-highlight, and blog-preview fragments.

Use the brand exactly as "Nolan Young Designs" or "Nolan Young"; never write "Nolan Designs".

Write concrete process steps such as Discovery Map, Design System Pass, Build Sprint, and Launch Handoff.

For the service-highlight fragment, use Nolan Young-specific labels such as Launch Handoff Sprint, Mobile Conversion Pass, Content Governance Map, Accessibility Detail Review, or Care Plan Readiness. Never write "Custom WordPress Development", "Responsive Design", "SEO Optimization", "Website Maintenance", or "User Experience Design"; those exact strings fail validation anywhere in the generated theme.

Blog/article preview titles should sound like practical WordPress guidance, not placeholder posts. Return only the assigned section fragments.`
    },
    {
      name: 'front-page-sections-proof',
      files: [
        'template-parts/front-page/content-style-pillars.php',
        'template-parts/front-page/content-testimonials.php',
        'template-parts/global/content-brand-statement.php',
        'template-parts/global/content-cta-banner.php'
      ],
      creativePrompt: `This stage owns proof, style pillars, brand statement, testimonials, and CTA fragments.

Use the brand exactly as "Nolan Young Designs" when writing the full brand. Never write "Nolan Designs"; that exact shortened brand fails validation.

Use specific proof and pillar language such as Mobile readiness proof, Content governance proof, Launch confidence proof, Accessible interface systems, Conversion section strategy, and Maintainable WordPress handoff.

Testimonials should use anonymized role-based attribution such as "Owner, local service company" or "Operations lead, membership organization"; do not use named placeholder people, "Satisfied Customer", "Key Contact", Example/Acme companies, or numbered Case Study labels.

Return only the assigned four section fragments and keep each fragment as a valid template part.`
    }
  ];
  const frontPageSectionOnlyFiles = frontPageSectionGroups.flatMap(({ files: group }) => group).filter((file) => homepageSectionFiles.has(file));

  for (const { name, files: group, creativePrompt } of frontPageSectionGroups) {
    const writableGroup = group.filter((file) => file === 'front-page.php' || homepageSectionFiles.has(file));
    addStage(stages, name, writableGroup, {
    readonly: writableGroup.includes('front-page.php') ? ['functions.php', 'style.css'] : ['front-page.php', 'functions.php', 'style.css'],
    promptSections: SECTION_OWNERSHIP['front-page-sections'],
    promptRequirements: writableGroup.includes('front-page.php') ? ['12-front-page-php', '15-definition-of-done'] : [],
    requiredTemplateParts: writableGroup.includes('front-page.php') ? requiredFrontPageTemplateParts : [],
    creativePrompt,
    focus: 'Create rich homepage sections and global promotional sections using the prepared scaffold. Implement only the listed files, do not create sibling files, and return exact listed paths only. If front-page.php is assigned, keep it as the get_header()/section/get_footer() assembly shell; template-part fragments must not call get_header() or get_footer(). For testimonials or proof fragments, use anonymized role-based attribution such as "Owner, local service company" or "Operations lead, membership organization"; never use named placeholder people or Example/Acme companies.'
  });
  }
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

  const visiblePageTemplates = new Set(pageTemplateFiles.filter((file) => GENERATED_DETAILED_PAGE_TEMPLATES.includes(file)));
  const pageTemplateStageOptions = {
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
    focus: 'Implement only the listed detailed page templates for the prepared site architecture, with complete page-specific content, hierarchy, conversion-ready sections, and mobile-friendly rendered structure. Do not simply call content-page plus global fragments; each generated page template must include its own visible page-specific sections, proof blocks, cards, lists, forms, comparison grids, process summaries, or editorial blocks directly in that file. If you include content-page or a homepage fragment, it must be supplemental rather than the main page body. Use template-blog-landing.php as the detailed blog page; template-blog.php is a template-owned legacy alias and must not be returned. Use template-service-detail.php as the detailed service preview page; template-single-service.php is a template-owned legacy alias and must not be returned. Do not use placeholder team names, numbered case-study placeholders, generic numbered project labels, filler descriptions, or nonexistent team photos. Use only get_template_part() paths that exist in the prepared scaffold; never invent flattened paths such as template-parts/content-single-service.php or template-parts/content-cta-banner.php.'
  };
  [
    {
      name: 'page-templates-about',
      files: ['page-templates/template-about-us.php'],
      extra: {
        creativePrompt: `This stage owns only page-templates/template-about-us.php.

Include explicit hero and intro copy for Nolan Young Designs, positioning for WordPress strategy/design systems/implementation/support, operating principles, values, collaboration model, service-business proof points, process detail, and a contact CTA. Do not use numbered placeholder case studies, invented personal biography claims, invented launch counts, invented satisfaction rates, or unsupported percentage metrics. Use scenario-based proof labels instead.

Return exactly page-templates/template-about-us.php and do not return Blog, Contact, Services, Work, or Service Detail templates from this stage.`,
        focus: `${pageTemplateStageOptions.focus} This isolated stage exists so the About page has enough depth. Return exactly page-templates/template-about-us.php.`
      }
    },
    {
      name: 'page-templates-blog',
      files: ['page-templates/template-blog-landing.php'],
      extra: {
        creativePrompt: `This stage owns only page-templates/template-blog-landing.php.

Include a strong editorial hero, featured article area, static topic chips with safe anchors, inline article cards or a loop with visible fallback cards, search/resource support, and an editorial CTA. Do not call get_categories(), get_category_link(), get_terms(), or invented template-part paths for cards. Render article cards inline inside this template so the model does not invent content template-part calls. Do not add img tags, image fields, or image array keys for hero, featured article, or post cards unless the exact referenced file exists in assets/images; prefer editorial cards, CSS panels, or inline SVG accents when no approved image exists. Never write comments such as "placeholder image" or "ensure this exists".

Return exactly page-templates/template-blog-landing.php and do not return About, Contact, Services, Work, or Service Detail templates from this stage.`,
        focus: `${pageTemplateStageOptions.focus} This isolated stage exists so the Blog page has enough editorial depth. Return exactly page-templates/template-blog-landing.php.`
      }
    },
    {
      name: 'page-templates-contact',
      files: ['page-templates/template-contact.php']
    },
    {
      name: 'page-templates-service-detail',
      files: ['page-templates/template-service-detail.php'],
      extra: {
        requiredTemplateParts: ['template-parts/global/content-cta-banner.php']
      }
    },
    {
      name: 'page-templates-services-work',
      files: ['page-templates/template-services.php', 'page-templates/template-work.php'],
      extra: {
        creativePrompt: `This stage owns exactly two detailed page templates: page-templates/template-services.php and page-templates/template-work.php.

For template-services.php, write explicit hero and intro copy instead of get_the_excerpt(). Include at least four Nolan Young-specific service cards, decision guidance, package or comparison cards, process proof, fit criteria, buyer questions, and contact CTAs. Use concrete service names such as Launch Readiness Audit, Conversion Homepage System, Service Page Architecture, Accessible WordPress Build, Performance Cleanup Sprint, and Care Plan Handoff. Never use "Custom WordPress Development", "Responsive Design", "SEO Optimization", "Website Maintenance", or "User Experience Design". Do not add service-card image paths unless the exact files exist in assets/images; use numbered badges, inline SVG symbols, CSS gradients, or text-first cards instead of made-up /images/*.svg paths.

For template-work.php, write explicit hero and intro copy instead of get_the_excerpt(). Include project categories, selected work cards with outcome metrics, mobile/detail notes, process connection, proof details, and clear Services/Contact CTAs. Use specific anonymized project labels such as Membership Portal Relaunch, Local Service Booking Flow, Nonprofit Donation Storyline, Professional Services Authority Hub, and Care Plan Recovery Sprint. Never use "E-commerce Website", "Non-profit Organization Site", or "Corporate Blog". Do not add work-card image paths unless the exact files exist in assets/images; use result cards, CSS panels, inline SVG symbols, or text-first cards instead of made-up /images/*.svg paths.

Return exactly both assigned files once. Do not return About, Blog, Contact, or Service Detail templates from this stage.`,
        focus: `${pageTemplateStageOptions.focus} This combined two-file stage keeps Ollama-only generation at ten planned invocations while Services and Work still get explicit page-specific requirements. Return exactly page-templates/template-services.php and page-templates/template-work.php.`
      }
    }
  ].forEach(({ name, files: group, extra = {} }) => addStage(stages, name, group.filter((file) => visiblePageTemplates.has(file)), {
    ...pageTemplateStageOptions,
    ...extra,
    requiredTemplateParts: [...new Set([...(pageTemplateStageOptions.requiredTemplateParts || []), ...(extra.requiredTemplateParts || [])])].sort()
  }));

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
