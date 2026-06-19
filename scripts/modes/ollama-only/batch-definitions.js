const OUTPUT_FORMAT = `Return only file blocks in this exact format:

---FILE: relative/path.php---
line 1
line 2
---END FILE---`;

const SHARED_GENERATION_RULES = [
  'Write complete file contents, not patches.',
  'Do not write style.css; WordPress theme metadata is prepared before this AI stage.',
  'Do not use absolute paths.',
  'Do not use ..',
  'Do not use CDN URLs, remote scripts, Google Fonts, remote images, or external links.',
  'Do not write http:// or https:// URLs anywhere. Use # for social links or inactive external labels.',
  'Use local assets, inline SVG, CSS-generated interface graphics, and theme files.',
  'Do not include secrets, tokens, passwords, or API keys.',
  'Replace Lorem ipsum in files you write.',
  'Do not write TODO comments, placeholder comments, "Add ... here" comments, empty cards, empty sections, or instructions for a future editor.',
  'Every section you create must include finished copy and visible content appropriate to the selected creative prompt.',
  'header.php and footer.php must not include a standalone ?> line after an inline PHP comment.',
  'header.php must use lowercase <!doctype html> and a valid full document wrapper.',
  'header.php and footer.php must not include site content sections such as content-hero, cta banners, brand statements, featured work, services, testimonials, blog previews, FAQs, or similar page sections.',
  'Preserve WordPress PHP syntax.',
  'Template-parts are fragments only: never call get_header(), get_footer(), wp_head(), wp_footer(), or output <!doctype>, <html>, <head>, or <body> wrappers inside template-parts files.',
  'header.php and footer.php are the only files that may contain full document wrappers; they must be complete and valid.',
  'If you reference an image or icon, ensure the file exists inside the theme. Prefer assets/images/placeholder.svg and assets/icons/icon1.svg when no custom media exists yet.',
  'Do not write broken partial anchors, truncated links, stray closing tags, or partial JSON fragments into PHP files.',
  'For PHP template files with HTML, start with <?php, call get_header(); while inside PHP, close PHP before HTML, reopen PHP only for WordPress function calls, and call get_footer(); at the end.',
  'Never write raw HTML while a PHP block is still open.',
  'Do not wrap the file blocks in markdown fences or JSON.'
];

const BATCHES = [
  {
    name: 'shell',
    files: ['README.md', 'header.php', 'footer.php', 'front-page.php'],
    focus: 'Create the brand shell described by the creative prompt. Build the responsive header, footer, README content, and homepage structure exactly around the requested business identity, navigation, dropdown behavior, page goals, sections, and calls to action; do not leave comments that ask someone to add those pieces later. Keep header.php and footer.php complete, and do not place fragment-only markup into template-parts files in this batch.'
  },
  {
    name: 'template-parts',
    files: [
      'template-parts/content-hero.php',
      'template-parts/content-brand-statement.php',
      'template-parts/content-featured-work.php',
      'template-parts/content-all-services.php',
      'template-parts/content-single-service-highlight.php',
      'template-parts/content-process.php',
      'template-parts/content-style-pillars.php',
      'template-parts/content-testimonials.php',
      'template-parts/content-blog-preview.php',
      'template-parts/content-cta-banner.php',
      'template-parts/content-footer-widgets.php'
    ],
    focus: 'Create reusable homepage and site sections that match the selected creative prompt, including the requested copy, services or offerings, proof, process, work examples, testimonials, FAQ-style content where appropriate, and CTAs. These files are fragments only; do not add get_header(), get_footer(), wp_head(), wp_footer(), <!doctype>, <html>, <head>, or <body> wrappers.'
  },
  {
    name: 'pages',
    files: [
      'page-templates/template-about-us.php',
      'page-templates/template-services.php',
      'page-templates/template-single-service.php',
      'page-templates/template-work.php',
      'page-templates/template-blog.php',
      'page-templates/template-contact.php',
      'page-templates/template-policy.php',
      'page.php',
      'single.php',
      'archive.php',
      'search.php',
      '404.php',
      '403.php'
    ],
    focus: 'Create page templates and standard WordPress templates with unique page intent for about, services, individual services, work/case studies, resources, contact, policy, search, archive, and error states. These are full page templates, so keep their document wrapper logic in the theme root files, not in template-parts.'
  },
  {
    name: 'assets',
    files: ['assets/css/bundle.css', 'assets/js/bundle.js', 'src/js/main.js', 'src/scss/main.scss', 'assets/icons/icon1.svg'],
    focus: 'Create the visual system, responsive layout, header interaction JavaScript, scroll animation hooks, local SVG logo/icon, and source mirrors requested by the creative prompt. Avoid starter CSS; write a complete responsive visual system that styles the actual generated sections. If the prompt needs imagery but no matching source asset exists yet, generate local SVG placeholders or reusable CSS shapes instead of inventing broken file paths.'
  },
  {
    name: 'forms-helpers',
    files: ['inc/forms.php', 'inc/newsletter.php', 'inc/helpers.php', 'inc/custom-post-types.php', 'inc/customizer.php', 'inc/policy-routing.php', 'comments.php', 'searchform.php'],
    focus: 'Create practical WordPress helper code, form handling/admin menu scaffolding, newsletter helper, custom post type setup, policy routing, comments, and search form code without external dependencies. Do not use Lorem ipsum in comments.php or searchform.php.'
  }
];

module.exports = {
  BATCHES,
  OUTPUT_FORMAT,
  SHARED_GENERATION_RULES
};
