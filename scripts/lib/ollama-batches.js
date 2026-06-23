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
  'Do not leave TODOs, Lorem Ipsum, placeholder comments, empty sections, or instructions for future implementation.',
  'Before responding, check that every assigned file is complete and that all braces, parentheses, quotes, PHP blocks, and HTML structures are balanced.'
];

const SHARED_GLOBAL_REQUIREMENTS = `## Shared Global Requirements

- Edit only the prepared generated-theme folder.
- Do not use CDN dependencies, remote fonts, remote images, secrets, or machine-specific paths.
- Return complete files through the strict file-block protocol.
- Preserve valid WordPress escaping, sanitization, PHP syntax, and local asset references.
- Do not leave placeholder content, TODOs, Lorem Ipsum, or future-work instructions.
- Use approved local assets from the asset inventory, or original local SVG marks, icons, textures, and illustrations when no approved photograph was supplied.
- Apply the definition-of-done rules that directly affect this stage's files.`;

const BATCHES = [
  {
    name: 'foundation',
    files: ['functions.php', 'theme.json', 'inc/setup.php', 'inc/enqueue.php', 'inc/template-tags.php'],
    readonly: ['style.css', 'package.json', 'package-lock.json', 'build/webpack.config.js'],
    promptSections: ['01', '02', '03', '04', '05', '06', '15'],
    focus: 'Establish WordPress setup, local asset enqueueing, menus, theme support, function prefixes, and shared template functions.'
  },
  {
    name: 'forms-system',
    files: ['inc/forms.php'],
    readonly: ['functions.php', 'inc/setup.php'],
    promptSections: ['03', '09', '11', '12', '15'],
    focus: 'Create the forms module only. Do not combine this with newsletter administration.'
  },
  {
    name: 'newsletter-system',
    files: ['inc/newsletter.php'],
    readonly: ['functions.php', 'inc/setup.php'],
    promptSections: ['03', '10', '11', '15'],
    focus: 'Create the newsletter module only. Do not combine this with forms handling.'
  },
  {
    name: 'supporting-php-helpers',
    files: ['inc/helpers.php'],
    readonly: ['functions.php', 'inc/forms.php', 'inc/newsletter.php'],
    promptSections: ['03', '15'],
    focus: 'Create the shared helpers module only. Keep it limited to reusable helper functions and do not add forms, newsletter, or custom post type logic.'
  },
  {
    name: 'supporting-php-custom-post-types',
    files: ['inc/custom-post-types.php'],
    readonly: ['functions.php', 'inc/forms.php', 'inc/newsletter.php'],
    promptSections: ['03', '15'],
    focus: 'Create the custom post types module only. Use unique function names such as nolan_young_template_register_projects_post_type and nolan_young_template_add_projects_admin_menu. Do not define form submission types, newsletter logic, or any function that belongs in inc/forms.php or inc/newsletter.php.'
  },
  {
    name: 'supporting-php-customizer-routing',
    files: ['inc/customizer.php', 'inc/policy-routing.php'],
    readonly: ['functions.php', 'inc/forms.php', 'inc/newsletter.php'],
    promptSections: ['03', '15'],
    focus: 'Create the customizer and policy routing modules only. Keep the files focused on site settings and policy routing, with no forms, newsletter, or template markup logic.'
  },
  {
    name: 'header-markup',
    files: ['header.php'],
    readonly: ['functions.php', 'inc/setup.php', 'inc/enqueue.php', 'inc/template-tags.php', 'inc/helpers.php', 'src/js/main.js'],
    promptSections: ['01', '04', '05', '06', '07', '15'],
    focus: 'Create the advanced header and navigation markup only.'
  },
  {
    name: 'footer-search-markup',
    files: ['footer.php', 'searchform.php', 'template-parts/content-footer-widgets.php', 'template-parts/content-cta-banner.php'],
    readonly: ['header.php', 'functions.php', 'inc/template-tags.php', 'inc/newsletter.php'],
    promptSections: ['01', '04', '05', '06', '08', '10', '11', '15'],
    focus: 'Create footer, search form, footer widgets, and CTA markup.'
  },
  {
    name: 'standard-template-parts',
    files: ['template-parts/content-page.php', 'template-parts/content-single.php', 'template-parts/content-none.php', 'template-parts/content-policy.php', 'template-parts/content-search.php'],
    readonly: ['functions.php', 'inc/template-tags.php'],
    promptSections: ['03', '11', '12', '15'],
    focus: 'Create standard reusable template parts.'
  },
  {
    name: 'homepage-content-intro',
    files: ['template-parts/content-hero.php', 'template-parts/content-brand-statement.php', 'template-parts/content-featured-work.php'],
    readonly: ['functions.php', 'inc/template-tags.php', 'header.php'],
    promptSections: ['01', '04', '05', '06', '11', '12', '13', '15'],
    focus: 'Create homepage hero, brand statement, and featured work content parts.'
  },
  {
    name: 'homepage-content-services-process',
    files: ['template-parts/content-all-services.php', 'template-parts/content-single-service-highlight.php', 'template-parts/content-process.php', 'template-parts/content-style-pillars.php'],
    readonly: ['functions.php', 'inc/template-tags.php'],
    promptSections: ['01', '04', '05', '06', '11', '12', '13', '15'],
    focus: 'Create service, highlighted service, process, and style-pillar homepage sections.'
  },
  {
    name: 'homepage-content-proof-interaction',
    files: ['template-parts/content-testimonials.php', 'template-parts/content-blog-preview.php', 'template-parts/content-faq.php', 'template-parts/content-packages.php', 'template-parts/content-business-solutions.php', 'template-parts/content-customer-experience.php', 'template-parts/content-before-after.php', 'template-parts/content-featured-case-study.php'],
    optionalFiles: ['template-parts/content-work-filter.php'],
    allowedPatterns: ['^template-parts/content-homepage-[a-z0-9-]+\\.php$'],
    readonly: ['functions.php', 'inc/template-tags.php', 'template-parts/content-cta-banner.php'],
    promptSections: ['01', '04', '05', '06', '11', '12', '13', '15'],
    focus: 'Create homepage proof, FAQ, packages, business solutions, customer experience, comparison, and case-study content parts.'
  },
  {
    name: 'homepage-assembly',
    files: ['front-page.php'],
    readonly: ['header.php', 'footer.php', 'functions.php'],
    readonlyDirectories: ['template-parts'],
    promptSections: ['07', '08', '11', '12', '13', '15'],
    focus: 'Assemble the homepage in the required section order using existing generated template parts.'
  },
  {
    name: 'primary-page-templates',
    files: ['page-templates/template-about-us.php', 'page-templates/template-services.php', 'page-templates/template-single-service.php', 'page-templates/template-work.php'],
    readonly: ['header.php', 'footer.php', 'functions.php', 'inc/template-tags.php'],
    readonlyDirectories: ['template-parts'],
    promptSections: ['01', '04', '05', '06', '11', '12', '15'],
    focus: 'Create primary page templates for about, services, single service, and work pages.'
  },
  {
    name: 'blog-contact-policy-templates',
    files: ['page-templates/template-blog.php', 'page-templates/template-contact.php', 'page-templates/template-policy.php'],
    readonly: ['header.php', 'footer.php', 'functions.php', 'inc/forms.php', 'inc/newsletter.php', 'inc/policy-routing.php'],
    readonlyDirectories: ['template-parts'],
    promptSections: ['09', '10', '11', '12', '15'],
    focus: 'Create blog, contact, and policy page templates.'
  },
  {
    name: 'standard-wordpress-templates',
    files: ['page.php', 'single.php', 'archive.php', 'search.php', '404.php', '403.php', 'comments.php'],
    optionalFiles: ['inc/enqueue.php'],
    readonly: ['front-page.php', 'header.php', 'footer.php', 'functions.php', 'package.json', 'package-lock.json', 'template-parts/content-page.php', 'template-parts/content-single.php', 'template-parts/content-search.php', 'template-parts/content-none.php'],
    promptSections: ['11', '12', '15'],
    focus: 'Create standard WordPress templates and comments handling only. Do not return front-page.php, package.json, or package-lock.json. front-page.php belongs to the homepage assembly stage.'
  },
  {
    name: 'scss-foundation',
    files: ['src/scss/main.scss', 'src/scss/abstracts/_variables.scss', 'src/scss/abstracts/_mixins.scss', 'src/scss/abstracts/_functions.scss', 'src/scss/base/_reset.scss', 'src/scss/base/_typography.scss', 'src/scss/base/_accessibility.scss', 'src/scss/base/_forms.scss', 'src/scss/base/_newsletter.scss'],
    readonly: ['header.php', 'footer.php', 'front-page.php'],
    promptSections: ['02', '04', '05', '06', '09', '10', '15'],
    focus: 'Create the SCSS entrypoint and foundational tokens, mixins, reset, typography, accessibility, forms, and newsletter styles.'
  },
  {
    name: 'scss-layout',
    files: ['src/scss/layout/_container.scss', 'src/scss/layout/_header.scss', 'src/scss/layout/_footer.scss', 'src/scss/layout/_grid.scss', 'src/scss/layout/_sections.scss'],
    readonly: ['src/scss/main.scss', 'header.php', 'footer.php', 'front-page.php'],
    promptSections: ['02', '04', '05', '06', '07', '08', '15'],
    focus: 'Create layout SCSS for containers, header, footer, grids, and sections.'
  },
  {
    name: 'scss-components',
    files: ['src/scss/components/_buttons.scss', 'src/scss/components/_cards.scss', 'src/scss/components/_forms.scss', 'src/scss/components/_badges.scss', 'src/scss/components/_accordion.scss', 'src/scss/components/_carousel.scss', 'src/scss/components/_portfolio-filter.scss', 'src/scss/components/_before-after.scss'],
    readonly: ['src/scss/main.scss', 'front-page.php', 'page-templates/template-work.php', 'page-templates/template-contact.php'],
    promptSections: ['02', '04', '05', '06', '09', '13', '15'],
    focus: 'Create component SCSS for buttons, cards, forms, badges, accordions, carousels, portfolio filters, and before-after elements.'
  },
  {
    name: 'scss-pages',
    files: ['src/scss/pages/_homepage.scss', 'src/scss/pages/_contact.scss', 'src/scss/pages/_about-us.scss', 'src/scss/pages/_services.scss', 'src/scss/pages/_work.scss', 'src/scss/pages/_blog.scss', 'src/scss/pages/_policy.scss'],
    readonly: ['src/scss/main.scss', 'front-page.php', 'page-templates/template-about-us.php', 'page-templates/template-services.php', 'page-templates/template-contact.php'],
    promptSections: ['02', '04', '05', '06', '11', '12', '13', '15'],
    focus: 'Create page-specific SCSS for homepage, contact, about, services, work, blog, and policy templates.'
  },
  {
    name: 'navigation-javascript',
    files: ['src/js/main.js'],
    readonly: ['header.php'],
    promptSections: ['07', '15'],
    focus: 'Create accessible header navigation behavior, dropdowns, mobile drawer, accordions, backdrop, body locking, Escape/outside-click handling, and ARIA state.'
  },
  {
    name: 'page-interaction-javascript',
    files: ['src/js/main.js'],
    readonly: ['header.php', 'footer.php', 'front-page.php'],
    readonlyDirectories: ['template-parts', 'page-templates'],
    promptSections: ['07', '11', '12', '13', '15'],
    focus: 'Preserve navigation behavior and add FAQ accordions, work filtering, carousels, before-after behavior, reduced motion handling, and content interactions.'
  },
  {
    name: 'brand-local-assets',
    files: [],
    optionalFiles: ['assets/icons/icon1.svg', 'assets/images/hero/brand-illustration.svg', 'assets/images/texture/subtle-grid.svg'],
    allowedPatterns: ['^assets/icons/[a-z0-9-]+\\.svg$', '^assets/images/(hero|portfolio|texture)/[a-z0-9-]+\\.(svg|png|webp|jpg|jpeg)$'],
    readonly: ['assets/images/asset-manifest.json', 'front-page.php', 'README.md'],
    promptSections: ['05', '13', '15'],
    focus: 'Create only original local SVG marks, icons, textures, and illustrations within declared asset paths.'
  },
  {
    name: 'theme-documentation',
    files: ['README.md', 'CHANGELOG.md', 'docs/getting-started.md', 'docs/customization.md', 'accessibility/README.md', 'assets/icons/README.md', 'blocks/README.md'],
    readonly: ['style.css', 'assets/images/asset-manifest.json'],
    readonlyDirectories: ['.generation'],
    promptSections: ['13', '14', '15'],
    focus: 'Create generated-theme documentation without inventing image provenance or licensing details.'
  }
];

function validateStagePlan(batches = BATCHES) {
  const errors = [];
  for (const batch of batches) {
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

module.exports = {
  BATCHES,
  creativePromptFromBrief,
  OUTPUT_FORMAT,
  SHARED_GENERATION_RULES,
  SHARED_GLOBAL_REQUIREMENTS,
  validateStagePlan
};
