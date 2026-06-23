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
  'Keep template parts as fragments.',
  'Keep document wrappers only in header.php and footer.php.',
  'Use consistent function prefixes.',
  'Reference only local files that exist or that this stage is explicitly allowed to create.',
  'Do not leave TODOs, Lorem Ipsum, placeholder comments, empty sections, or instructions for future implementation.',
  'Before responding, check that every assigned file is complete and that all braces, parentheses, quotes, PHP blocks, and HTML structures are balanced.'
];

const BATCHES = [
  {
    name: 'foundation',
    files: ['functions.php', 'theme.json', 'inc/setup.php', 'inc/enqueue.php', 'inc/template-tags.php'],
    readonly: ['style.css', 'package.json'],
    focus: 'Establish WordPress setup, local asset enqueueing, menus, theme support, function prefixes, and shared template functions.'
  },
  {
    name: 'header-footer-shell',
    files: ['header.php', 'footer.php', 'searchform.php'],
    readonly: ['functions.php', 'inc/setup.php', 'inc/enqueue.php', 'inc/template-tags.php', 'src/js/main.js'],
    focus: 'Build valid document structure, responsive navigation markup, complete header/footer markup, search form, and required WordPress hooks.'
  },
  {
    name: 'homepage-framework',
    files: ['front-page.php', 'template-parts/content-hero.php', 'template-parts/content-brand-statement.php', 'template-parts/content-featured-work.php'],
    readonly: ['header.php', 'footer.php', 'functions.php'],
    focus: 'Create the homepage framework, hero, brand statement, and featured work sections.'
  },
  {
    name: 'homepage-services-process',
    files: ['template-parts/content-all-services.php', 'template-parts/content-single-service-highlight.php', 'template-parts/content-process.php', 'template-parts/content-style-pillars.php'],
    readonly: ['front-page.php', 'functions.php', 'inc/template-tags.php'],
    focus: 'Create service, highlighted service, process, and style-pillar homepage sections.'
  },
  {
    name: 'homepage-proof-conversion',
    files: ['template-parts/content-testimonials.php', 'template-parts/content-blog-preview.php', 'template-parts/content-cta-banner.php', 'template-parts/content-footer-widgets.php'],
    readonly: ['front-page.php', 'functions.php', 'inc/template-tags.php'],
    focus: 'Create proof, blog preview, conversion, and footer widget sections.'
  },
  {
    name: 'primary-page-templates',
    files: ['page-templates/template-about-us.php', 'page-templates/template-services.php', 'page-templates/template-single-service.php', 'page-templates/template-work.php'],
    readonly: ['header.php', 'footer.php', 'functions.php', 'inc/template-tags.php'],
    focus: 'Create primary page templates for about, services, single service, and work pages.'
  },
  {
    name: 'blog-contact-policy-templates',
    files: ['page-templates/template-blog.php', 'page-templates/template-contact.php', 'page-templates/template-policy.php'],
    readonly: ['header.php', 'footer.php', 'functions.php', 'inc/forms.php', 'inc/newsletter.php'],
    focus: 'Create blog, contact, and policy page templates.'
  },
  {
    name: 'standard-wordpress-templates',
    files: ['page.php', 'single.php', 'archive.php', 'search.php', '404.php', '403.php', 'comments.php'],
    readonly: ['header.php', 'footer.php', 'functions.php', 'template-parts/content-page.php', 'template-parts/content-single.php', 'template-parts/content-search.php'],
    focus: 'Create standard WordPress templates and comments handling.'
  },
  {
    name: 'functional-helpers',
    files: ['inc/forms.php', 'inc/newsletter.php', 'inc/helpers.php', 'inc/custom-post-types.php', 'inc/customizer.php', 'inc/policy-routing.php'],
    readonly: ['functions.php', 'page-templates/template-contact.php', 'page-templates/template-policy.php'],
    focus: 'Create local helper code, form handling, newsletter support, customizer setup, custom post types, and policy routing.'
  },
  {
    name: 'scss-foundation',
    files: ['src/scss/main.scss', 'src/scss/abstracts/_variables.scss', 'src/scss/abstracts/_mixins.scss', 'src/scss/abstracts/_functions.scss', 'src/scss/base/_reset.scss', 'src/scss/base/_typography.scss', 'src/scss/base/_accessibility.scss', 'src/scss/base/_forms.scss', 'src/scss/base/_newsletter.scss'],
    readonly: ['header.php', 'footer.php', 'front-page.php'],
    focus: 'Create the SCSS entrypoint and foundational tokens, mixins, reset, typography, accessibility, forms, and newsletter styles.'
  },
  {
    name: 'scss-layout',
    files: ['src/scss/layout/_container.scss', 'src/scss/layout/_header.scss', 'src/scss/layout/_footer.scss', 'src/scss/layout/_grid.scss', 'src/scss/layout/_sections.scss'],
    readonly: ['src/scss/main.scss', 'header.php', 'footer.php', 'front-page.php'],
    focus: 'Create layout SCSS for containers, header, footer, grids, and sections.'
  },
  {
    name: 'scss-components',
    files: ['src/scss/components/_buttons.scss', 'src/scss/components/_cards.scss', 'src/scss/components/_forms.scss', 'src/scss/components/_badges.scss', 'src/scss/components/_accordion.scss', 'src/scss/components/_carousel.scss', 'src/scss/components/_portfolio-filter.scss', 'src/scss/components/_before-after.scss'],
    readonly: ['src/scss/main.scss', 'front-page.php', 'page-templates/template-work.php', 'page-templates/template-contact.php'],
    focus: 'Create component SCSS for buttons, cards, forms, badges, accordions, carousels, portfolio filters, and before-after elements.'
  },
  {
    name: 'scss-pages',
    files: ['src/scss/pages/_homepage.scss', 'src/scss/pages/_contact.scss', 'src/scss/pages/_about-us.scss', 'src/scss/pages/_services.scss', 'src/scss/pages/_work.scss', 'src/scss/pages/_blog.scss', 'src/scss/pages/_policy.scss'],
    readonly: ['src/scss/main.scss', 'front-page.php', 'page-templates/template-about-us.php', 'page-templates/template-services.php', 'page-templates/template-contact.php'],
    focus: 'Create page-specific SCSS for homepage, contact, about, services, work, blog, and policy templates.'
  },
  {
    name: 'javascript',
    files: ['src/js/main.js'],
    readonly: ['header.php', 'footer.php', 'front-page.php'],
    readonlyDirectories: ['template-parts'],
    focus: 'Create accessible JavaScript for mobile navigation, dropdowns, accordions, carousel behavior, filtering, and reduced-motion friendly controls.'
  },
  {
    name: 'local-assets-docs',
    files: ['assets/icons/icon1.svg', 'README.md', 'CHANGELOG.md'],
    readonly: ['style.css', 'front-page.php'],
    focus: 'Create local visual assets and generated-theme documentation. Only return the assigned files.'
  }
];

function creativePromptFromBrief(brief) {
  const marker = '\n## Creative Prompt\n';
  const markerIndex = brief.indexOf(marker);
  return markerIndex === -1 ? brief : brief.slice(markerIndex + marker.length).trim();
}

module.exports = {
  BATCHES,
  creativePromptFromBrief,
  OUTPUT_FORMAT,
  SHARED_GENERATION_RULES
};
