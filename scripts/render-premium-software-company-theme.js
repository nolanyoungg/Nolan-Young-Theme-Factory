#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const [themeSlug, variantInput = 'studio'] = process.argv.slice(2);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!themeSlug || !/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(themeSlug)) {
  fail('Usage: node scripts/render-premium-software-company-theme.js <theme-slug> [variant]');
}

const themeDir = path.join(root, 'wp-content', 'themes', themeSlug);
if (!fs.existsSync(themeDir)) fail(`Theme folder missing: wp-content/themes/${themeSlug}`);

const variants = {
  studio: {
    name: 'Northstar Codeworks',
    kicker: 'Senior software development for operators',
    headline: 'Reliable custom software for teams outgrowing spreadsheets and duct-taped SaaS.',
    intro: 'Northstar Codeworks designs and builds web applications, internal tools, API integrations, and automation systems for B2B teams that need dependable software without corporate drag.',
    primary: '#2563eb',
    secondary: '#14b8a6',
    accent: '#f97316',
    dark: '#101827',
    soft: '#f4f7fb'
  },
  systems: {
    name: 'Northstar Codeworks',
    kicker: 'Custom systems for growing service companies',
    headline: 'Turn disconnected operations into clear, maintainable software systems.',
    intro: 'From client portals to integration layers, Northstar Codeworks helps founders and operations leaders replace manual handoffs with tools their teams can trust every day.',
    primary: '#1f6feb',
    secondary: '#10b981',
    accent: '#f59e0b',
    dark: '#0f172a',
    soft: '#eef6ff'
  },
  product: {
    name: 'Northstar Codeworks',
    kicker: 'Product-minded engineering partner',
    headline: 'Design, build, and launch business software with senior technical judgment.',
    intro: 'Northstar Codeworks brings product thinking, clean implementation, and practical support to custom apps, workflow automation, and API-heavy software projects.',
    primary: '#3157d5',
    secondary: '#0ea5a4',
    accent: '#fb7185',
    dark: '#111827',
    soft: '#f6f7fb'
  }
};

const variant = variants[variantInput] || variants.studio;
const textDomain = themeSlug;

function write(relative, content) {
  const target = path.join(themeDir, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content.trimStart().replace(/\n/g, '\r\n'), 'utf8');
}

function phpPage(title, eyebrow, body, sections = '') {
  return `<?php
/**
 * Template for ${title}.
 *
 * @package ${textDomain}
 */
get_header();
?>
<main id="primary" class="site-main">
  <section class="page-hero">
    <div class="container page-hero__grid">
      <div>
        <p class="eyebrow"><?php esc_html_e( '${eyebrow}', '${textDomain}' ); ?></p>
        <h1><?php esc_html_e( '${title}', '${textDomain}' ); ?></h1>
        <p class="lede"><?php esc_html_e( '${body}', '${textDomain}' ); ?></p>
      </div>
      <div class="interface-card" aria-hidden="true">
        <span class="status-dot"></span>
        <strong>Project signal</strong>
        <div class="metric-row"><span>Risk map</span><b>Clear</b></div>
        <div class="metric-row"><span>Workflow fit</span><b>92%</b></div>
        <div class="metric-row"><span>Launch path</span><b>Ready</b></div>
      </div>
    </div>
  </section>
  ${sections}
</main>
<?php
get_footer();
`;
}

const serviceCards = `
<div class="card-grid cards-3">
  <article class="service-card"><span>01</span><h3>Custom Web Applications</h3><p>Secure portals, workflow apps, dashboards, and customer-facing tools built around the way your team actually works.</p></article>
  <article class="service-card"><span>02</span><h3>Internal Tools</h3><p>Admin panels, intake systems, reporting workspaces, and role-based tools that replace spreadsheet-driven operations.</p></article>
  <article class="service-card"><span>03</span><h3>API Integrations</h3><p>Reliable connections between CRM, billing, scheduling, inventory, and support platforms with clear monitoring and ownership.</p></article>
  <article class="service-card"><span>04</span><h3>Automation Systems</h3><p>Quote intake, project handoff, notifications, document routing, and approval workflows that reduce manual follow-up.</p></article>
  <article class="service-card"><span>05</span><h3>Legacy Modernization</h3><p>Practical rebuilds and staged migrations for brittle systems that still carry important operational knowledge.</p></article>
  <article class="service-card"><span>06</span><h3>Technical Discovery</h3><p>Architecture reviews, implementation roadmaps, integration planning, and project scoping before a major build begins.</p></article>
</div>`;

const workCards = `
<div class="case-grid">
  <article class="case-card"><p class="eyebrow">Operations dashboard</p><h3>Multi-location service visibility</h3><p>Unified job status, technician capacity, invoice readiness, and regional performance into one decision workspace.</p><b>Result: 18 hours saved weekly</b></article>
  <article class="case-card"><p class="eyebrow">Client portal</p><h3>Professional services onboarding</h3><p>Built a secure portal for file collection, task status, team messages, and approval checkpoints.</p><b>Result: 42% faster onboarding</b></article>
  <article class="case-card"><p class="eyebrow">Integration layer</p><h3>CRM, billing, and scheduling sync</h3><p>Replaced duplicate entry with audited data flows, retry handling, and exception reporting.</p><b>Result: fewer missed handoffs</b></article>
</div>`;

write('README.md', `# ${variant.name} Theme

Generated premium WordPress theme for a software development company. The theme includes responsive templates, local assets, compiled bundles, forms scaffolding, service pages, work previews, and static preview support.`);
write('CHANGELOG.md', `# Changelog

## 1.0.0

- Generated premium software company website theme.
- Added complete homepage, page templates, service content, form scaffolding, and responsive styling.`);
write('LICENSE.txt', 'Generated theme scaffold for client preview and WordPress installation. Replace licensing text with the final project license before distribution.');
write('accessibility/README.md', '# Accessibility\n\nThis theme uses semantic landmarks, visible focus states, responsive navigation, and reduced-motion support.');
write('assets/icons/README.md', '# Icons\n\nLocal SVG icons and interface marks used by the generated theme.');
write('blocks/README.md', '# Blocks\n\nClassic theme-ready area for future custom block patterns.');
write('docs/customization.md', '# Customization\n\nAdjust colors in `src/scss/main.scss`, rebuild assets, then package the theme.');
write('docs/getting-started.md', '# Getting Started\n\nInstall the theme in WordPress, activate it, assign page templates, and configure navigation.');

write('header.php', `<?php
/**
 * Header.
 *
 * @package ${textDomain}
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="site-header" data-nolan-menu-header>
  <div class="container header-inner">
    <a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( '${variant.name} home', '${textDomain}' ); ?>">
      <span class="brand-mark">NC</span>
      <span>${variant.name}</span>
    </a>
    <button class="menu-toggle" type="button" data-nolan-menu-toggle aria-expanded="false" aria-controls="primary-menu">
      <span>Menu</span>
    </button>
    <nav id="primary-menu" class="primary-nav" data-nolan-menu-panel aria-label="<?php esc_attr_e( 'Primary navigation', '${textDomain}' ); ?>">
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
      <a href="#services">Services</a>
      <a href="#work">Work</a>
      <a href="#process">Process</a>
      <a href="#resources">Resources</a>
      <a href="#contact">Contact</a>
    </nav>
    <a class="btn btn-primary header-action" href="#contact">Book a Consultation</a>
  </div>
</header>`);

write('footer.php', `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <a class="brand footer-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>"><span class="brand-mark">NC</span><span>${variant.name}</span></a>
      <p>Senior software development for custom apps, integrations, internal tools, and durable automation systems.</p>
    </div>
    <div><h2>Services</h2><a href="#services">Web applications</a><a href="#services">Internal tools</a><a href="#services">API integrations</a><a href="#services">Automation</a></div>
    <div><h2>Company</h2><a href="#work">Work</a><a href="#process">Process</a><a href="#resources">Resources</a><a href="#contact">Contact</a></div>
    <div><h2>Start a project</h2><p>Tell us what is slow, fragile, or disconnected. We will help map the right software path.</p><a class="btn btn-secondary" href="#contact">Plan the build</a></div>
  </div>
  <div class="container footer-bottom"><span>&copy; <?php echo esc_html( date( 'Y' ) ); ?> ${variant.name}.</span><span>Privacy and terms available on request.</span></div>
</footer>
<?php wp_footer(); ?>
</body>
</html>`);

write('front-page.php', `<?php
/**
 * Front page.
 *
 * @package ${textDomain}
 */
get_header();
?>
<main id="primary" class="site-main">
  <section class="hero-section">
    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">${variant.kicker}</p>
        <h1>${variant.headline}</h1>
        <p class="lede">${variant.intro}</p>
        <div class="button-row"><a class="btn btn-primary" href="#contact">Book a Consultation</a><a class="btn btn-secondary" href="#work">View Case Studies</a></div>
        <div class="trust-row"><span>12+ launches supported</span><span>API-first planning</span><span>Maintainable codebase handoff</span></div>
      </div>
      <div class="hero-product" aria-label="Software project dashboard illustration">
        <div class="product-topbar"><span></span><span></span><span></span><strong>Workflow OS</strong></div>
        <div class="product-grid">
          <div class="panel wide"><small>Lead intake</small><b>84 qualified requests</b><div class="bar"><i style="width:78%"></i></div></div>
          <div class="panel"><small>Integration health</small><b>99.8%</b><p>CRM, billing, scheduling</p></div>
          <div class="panel"><small>Automation queue</small><b>312</b><p>Tasks routed this month</p></div>
          <div class="panel wide dark-panel"><small>Architecture note</small><p>Replace duplicate entry with audited services, queue retries, and team-visible exceptions.</p></div>
        </div>
      </div>
    </div>
  </section>
  <section class="proof-strip"><div class="container proof-grid"><b>Built for B2B teams</b><b>Clear scope before code</b><b>Secure WordPress-ready output</b><b>Launch support included</b></div></section>
  <section id="services" class="section"><div class="container section-heading"><p class="eyebrow">Services</p><h2>Software work shaped around real operational pressure.</h2><p>Each engagement starts with workflow mapping, risk review, and a build path that keeps business value visible.</p></div>${serviceCards}</section>
  <section class="split-section"><div class="container split-grid"><div><p class="eyebrow">Problem and solution</p><h2>Stop forcing teams to bridge systems manually.</h2><p>Northstar Codeworks replaces brittle spreadsheets, duplicate entry, and disconnected subscriptions with focused software that fits the workflow, integrates cleanly, and can be maintained after launch.</p></div><div class="check-list"><p>Workflow mapping before implementation</p><p>Readable architecture notes</p><p>Role-aware interfaces</p><p>API error handling and monitoring</p><p>Documentation for internal ownership</p></div></div></section>
  <section id="process" class="section dark-section"><div class="container section-heading"><p class="eyebrow">Process</p><h2>A clear path from messy workflow to stable software.</h2></div><div class="container process-grid"><article><span>01</span><h3>Discover</h3><p>Map workflows, constraints, users, data sources, and the business result the software must create.</p></article><article><span>02</span><h3>Architect</h3><p>Define data model, integrations, permissions, release plan, and the simplest maintainable build path.</p></article><article><span>03</span><h3>Build</h3><p>Ship in visible increments with QA, stakeholder review, and clean source organization.</p></article><article><span>04</span><h3>Launch</h3><p>Deploy with documentation, training notes, monitoring, and a practical support plan.</p></article></div></section>
  <section id="work" class="section"><div class="container section-heading"><p class="eyebrow">Featured work</p><h2>Credible software outcomes for operational teams.</h2></div>${workCards}</section>
  <section class="section testimonials"><div class="container testimonial-grid"><blockquote>Northstar translated a messy internal process into software our team actually uses every day. The planning was clear, the build was calm, and the handoff made sense.</blockquote><div><b>Operations Director</b><span>Regional service company</span></div></div></section>
  <section id="resources" class="section resource-section"><div class="container section-heading"><p class="eyebrow">Resources</p><h2>Practical notes for planning better software projects.</h2></div><div class="card-grid cards-4"><article><h3>When custom software beats another SaaS subscription</h3><p>Signals that your workflow needs a system built around your business.</p></article><article><h3>How to plan an internal tool project</h3><p>Scope, permissions, data, and launch details to settle before coding starts.</p></article><article><h3>API integration mistakes to avoid</h3><p>Why retries, ownership, and observability matter for connected operations.</p></article><article><h3>What discovery should include</h3><p>A practical checklist for reducing risk before implementation.</p></article></div></section>
  <section id="contact" class="section contact-section"><div class="container contact-grid"><div><p class="eyebrow">Start</p><h2>Bring the workflow that needs to be simpler.</h2><p>Share the business process, the tools involved, and what a successful launch would change for your team.</p></div><form class="contact-form"><label>Name<input type="text" name="name"></label><label>Email<input type="email" name="email"></label><label>Project type<select name="project_type"><option>Custom web application</option><option>Internal tool</option><option>API integration</option><option>Automation system</option></select></label><label>Goals<textarea name="message" rows="5"></textarea></label><button class="btn btn-primary" type="submit">Request consultation</button></form></div></section>
</main>
<?php
get_footer();
`);

write('page-templates/template-about-us.php', phpPage('Senior engineering judgment without agency theater.', 'About Northstar', 'Northstar Codeworks is built around clarity, maintainability, and practical delivery for teams that need software to run the business, not just impress a launch meeting.', `<section class="section"><div class="container split-grid"><div><h2>What clients can expect</h2><p>Direct communication, plain-language technical tradeoffs, visible progress, and code organized for long-term ownership.</p></div><div class="check-list"><p>Calm senior technical guidance</p><p>Maintainable implementation choices</p><p>Documentation that supports handoff</p><p>Security and accessibility awareness</p></div></div></section>`));
write('page-templates/template-services.php', phpPage('Choose the right software path for the workflow.', 'Services', 'Explore focused services for custom applications, admin portals, integrations, automation, modernization, and discovery.', `<section id="services" class="section"><div class="container">${serviceCards}</div></section>`));
write('page-templates/template-single-service.php', phpPage('Custom software built around one high-value workflow.', 'Service detail', 'Each service page clarifies the value proposition, deliverables, process, frequently asked questions, and next step for a focused project.', `<section class="section"><div class="container split-grid"><div><h2>Deliverables</h2><p>Architecture map, implementation plan, responsive UI, WordPress-ready templates when needed, integration notes, QA checklist, and launch support.</p></div><div class="check-list"><p>Discovery workshop</p><p>Prototype and review</p><p>Implementation sprint</p><p>Testing and deployment</p><p>Support handoff</p></div></div></section>`));
write('page-templates/template-work.php', phpPage('Software case studies with operational outcomes.', 'Work', 'Review realistic examples of dashboards, portals, integration layers, and workflow systems built for service businesses and B2B teams.', `<section class="section"><div class="container">${workCards}</div></section>`));
write('page-templates/template-blog.php', phpPage('Useful guidance before you invest in custom software.', 'Resources', 'Educational notes for founders, operators, and technical buyers planning internal tools, integrations, and workflow automation.', `<section class="section"><div class="container card-grid cards-3"><article><h3>Planning an internal tool</h3><p>How to define users, decisions, permissions, and operational success.</p></article><article><h3>Integration risk checklist</h3><p>Questions to ask before connecting systems that run your business.</p></article><article><h3>Build versus buy</h3><p>A practical way to decide when custom software is worth the investment.</p></article></div></section>`));
write('page-templates/template-contact.php', phpPage('Start with the workflow that needs to change.', 'Contact', 'Tell Northstar Codeworks what is slow, fragile, duplicated, or disconnected. You will get a practical response about fit and next steps.', `<section class="section contact-section"><div class="container contact-grid"><div><h2>What to include</h2><p>Share current tools, team roles, timeline, budget range, and what the software must make easier.</p></div><form class="contact-form"><label>Name<input type="text"></label><label>Email<input type="email"></label><label>Company<input type="text"></label><label>Project goals<textarea rows="5"></textarea></label><button class="btn btn-primary" type="submit">Send project note</button></form></div></section>`));
write('page-templates/template-policy.php', phpPage('Clear project expectations and responsible data handling.', 'Policy', 'This page outlines practical privacy, communication, and project-operation expectations for generated theme previews.', `<section class="section"><div class="container prose"><h2>Privacy and project notes</h2><p>Do not submit sensitive credentials through public forms. Production policies should be reviewed before launch.</p></div></section>`));

write('index.php', phpPage('Northstar Codeworks', 'Software development company', 'Custom applications, integrations, and automation systems for teams that need reliable business software.'));
write('page.php', phpPage('Page', 'Northstar Codeworks', 'A flexible page template for software-company content and conversion sections.'));
write('single.php', phpPage('Insight detail', 'Resource', 'A readable template for long-form software planning notes and implementation guidance.'));
write('archive.php', phpPage('Resource archive', 'Insights', 'Browse practical software planning articles, case-study notes, and implementation guidance.'));
write('search.php', phpPage('Search Northstar resources', 'Search', 'Find services, case studies, and planning notes related to custom software and operations systems.'));
write('404.php', phpPage('This page is not available.', '404', 'The requested page could not be found. Use the navigation or search to continue exploring Northstar Codeworks.'));
write('403.php', phpPage('Access is restricted.', '403', 'This page is not available for public viewing. Return to the main site or contact the team for help.'));
write('comments.php', `<?php
/**
 * Comments template.
 *
 * @package ${textDomain}
 */
if ( post_password_required() ) {
  return;
}
?>
<section id="comments" class="comments-area">
  <h2><?php esc_html_e( 'Project discussion', '${textDomain}' ); ?></h2>
  <?php if ( have_comments() ) : ?>
    <ol class="comment-list"><?php wp_list_comments(); ?></ol>
  <?php endif; ?>
  <?php comment_form(); ?>
</section>`);
write('searchform.php', `<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
  <label>
    <span class="screen-reader-text"><?php esc_html_e( 'Search for:', '${textDomain}' ); ?></span>
    <input type="search" class="search-field" placeholder="<?php esc_attr_e( 'Search resources', '${textDomain}' ); ?>" value="<?php echo get_search_query(); ?>" name="s">
  </label>
  <button type="submit" class="btn btn-secondary"><?php esc_html_e( 'Search', '${textDomain}' ); ?></button>
</form>`);

const partMap = {
  'content-hero.php': `<section class="hero-section"><div class="container hero-grid"><div><p class="eyebrow">${variant.kicker}</p><h1>${variant.headline}</h1><p class="lede">${variant.intro}</p></div><div class="interface-card"><strong>Build clarity</strong><p>Workflow, data, roles, and launch risks mapped before implementation.</p></div></div></section>`,
  'content-brand-statement.php': `<section class="section"><div class="container split-grid"><h2>Premium software work without noise.</h2><p>Northstar Codeworks keeps the work direct: understand the process, design the system, build the useful parts, and leave the team with a maintainable result.</p></div></section>`,
  'content-featured-work.php': `<section class="section"><div class="container">${workCards}</div></section>`,
  'content-all-services.php': `<section class="section"><div class="container">${serviceCards}</div></section>`,
  'content-single-service-highlight.php': `<section class="section"><div class="container split-grid"><div><h2>Focused service engagement</h2><p>Clear deliverables, practical technical choices, and launch support for one high-value workflow.</p></div><div class="check-list"><p>Architecture</p><p>Prototype</p><p>Implementation</p><p>QA</p></div></div></section>`,
  'content-process.php': `<section class="section dark-section"><div class="container process-grid"><article><span>01</span><h3>Discover</h3><p>Map the workflow.</p></article><article><span>02</span><h3>Architect</h3><p>Plan the system.</p></article><article><span>03</span><h3>Build</h3><p>Ship useful increments.</p></article><article><span>04</span><h3>Support</h3><p>Launch with confidence.</p></article></div></section>`,
  'content-style-pillars.php': `<section class="section"><div class="container card-grid cards-3"><article><h3>Clear</h3><p>Readable scope and tradeoffs.</p></article><article><h3>Durable</h3><p>Maintainable code and assets.</p></article><article><h3>Useful</h3><p>Interfaces designed around decisions.</p></article></div></section>`,
  'content-testimonials.php': `<section class="section testimonials"><div class="container testimonial-grid"><blockquote>Northstar made a complex process understandable and shipped a system our team could own.</blockquote><div><b>Founder</b><span>B2B services firm</span></div></div></section>`,
  'content-blog-preview.php': `<section class="section"><div class="container card-grid cards-3"><article><h3>Build or buy?</h3><p>How to evaluate workflow software.</p></article><article><h3>Integration planning</h3><p>Reduce risk before connecting tools.</p></article><article><h3>Internal tool scope</h3><p>Define the smallest useful launch.</p></article></div></section>`,
  'content-cta-banner.php': `<section class="section cta-banner"><div class="container split-grid"><div><h2>Ready to plan the build?</h2><p>Bring the workflow, tools, and constraints. Northstar will help shape the path.</p></div><a class="btn btn-primary" href="#contact">Book a Consultation</a></div></section>`,
  'content-footer-widgets.php': `<div class="footer-widgets"><p>Custom web applications, integrations, internal tools, and automation systems for growing B2B teams.</p></div>`,
  'content-page.php': `<article class="content-card"><h2><?php the_title(); ?></h2><div><?php the_content(); ?></div></article>`,
  'content-single.php': `<article class="content-card"><h2><?php the_title(); ?></h2><div><?php the_content(); ?></div></article>`,
  'content-none.php': `<section class="content-card"><h2>No matching content found.</h2><p>Try a different search or return to the service overview.</p></section>`,
  'content-policy.php': `<section class="content-card"><h2>Policy information</h2><p>Use production-ready privacy and terms content before launch.</p></section>`,
  'content-search.php': `<article class="content-card"><h2><?php the_title(); ?></h2><p>Review this Northstar Codeworks resource for software planning guidance.</p></article>`
};
for (const [file, markup] of Object.entries(partMap)) {
  write(`template-parts/${file}`, `<?php
/**
 * Template part: ${file}
 *
 * @package ${textDomain}
 */
?>
${markup}`);
}

write('inc/template-tags.php', `<?php
/**
 * Template tags.
 *
 * @package ${textDomain}
 */
function nolan_young_theme_posted_on() {
  echo '<span class="posted-on">' . esc_html( get_the_date() ) . '</span>';
}

function nolan_young_theme_service_nav() {
  echo '<nav class="service-jump-links" aria-label="' . esc_attr__( 'Service links', '${textDomain}' ) . '"><a href="#services">' . esc_html__( 'Services', '${textDomain}' ) . '</a><a href="#work">' . esc_html__( 'Work', '${textDomain}' ) . '</a><a href="#contact">' . esc_html__( 'Contact', '${textDomain}' ) . '</a></nav>';
}`);
write('inc/forms.php', `<?php
/**
 * Lightweight form admin scaffolding.
 *
 * @package ${textDomain}
 */
function nolan_young_theme_register_forms_menu() {
  add_menu_page( __( 'Forms', '${textDomain}' ), __( 'Forms', '${textDomain}' ), 'manage_options', 'nolan-theme-forms', 'nolan_young_theme_render_forms_page', 'dashicons-feedback', 26 );
}
add_action( 'admin_menu', 'nolan_young_theme_register_forms_menu' );

function nolan_young_theme_render_forms_page() {
  echo '<div class="wrap"><h1>' . esc_html__( 'Form submissions', '${textDomain}' ) . '</h1><p>' . esc_html__( 'Connect production storage before launch. This generated theme includes the admin surface and export intent.', '${textDomain}' ) . '</p></div>';
}`);
write('inc/newsletter.php', `<?php
function nolan_young_theme_newsletter_label() {
  return esc_html__( 'Join the software operations newsletter', '${textDomain}' );
}`);
write('inc/helpers.php', `<?php
function nolan_young_theme_asset_version( $relative_path ) {
  $file = get_theme_file_path( $relative_path );
  return file_exists( $file ) ? (string) filemtime( $file ) : wp_get_theme()->get( 'Version' );
}`);
write('inc/custom-post-types.php', `<?php
function nolan_young_theme_register_case_study_type() {
  register_post_type( 'case_study', array(
    'label' => __( 'Case Studies', '${textDomain}' ),
    'public' => true,
    'show_in_rest' => true,
    'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
  ) );
}
add_action( 'init', 'nolan_young_theme_register_case_study_type' );`);
write('inc/customizer.php', `<?php
function nolan_young_theme_customize_register( $wp_customize ) {
  $wp_customize->add_section( 'nolan_theme_brand', array( 'title' => __( 'Brand Settings', '${textDomain}' ) ) );
}
add_action( 'customize_register', 'nolan_young_theme_customize_register' );`);
write('inc/policy-routing.php', `<?php
function nolan_young_theme_policy_link() {
  return home_url( '/privacy-policy/' );
}`);
write('inc/enqueue.php', `<?php
function nolan_young_theme_enqueue_assets() {
  wp_enqueue_style( '${textDomain}-bundle', get_theme_file_uri( 'assets/css/bundle.css' ), array(), nolan_young_theme_asset_version( 'assets/css/bundle.css' ) );
  wp_enqueue_script( '${textDomain}-bundle', get_theme_file_uri( 'assets/js/bundle.js' ), array(), nolan_young_theme_asset_version( 'assets/js/bundle.js' ), true );
}
add_action( 'wp_enqueue_scripts', 'nolan_young_theme_enqueue_assets' );`);

write('assets/icons/icon1.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="Northstar Codeworks mark"><rect width="96" height="96" rx="22" fill="${variant.dark}"/><path d="M23 63V24h10l30 42V24h10v48H63L33 30v33H23z" fill="${variant.secondary}"/><path d="M25 72h46" stroke="${variant.accent}" stroke-width="6" stroke-linecap="round"/></svg>`);

write('src/js/main.js', `(() => {
  const header = document.querySelector('[data-nolan-menu-header]');
  const toggle = document.querySelector('[data-nolan-menu-toggle]');
  const panel = document.querySelector('[data-nolan-menu-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-open', !open);
    });
  }
  const onScroll = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();`);
write('assets/js/bundle.js', fs.readFileSync(path.join(themeDir, 'src/js/main.js'), 'utf8'));

write('src/scss/main.scss', `
:root {
  --paper: #ffffff;
  --soft: ${variant.soft};
  --ink: #111827;
  --muted: #64748b;
  --line: #dce5f2;
  --primary: ${variant.primary};
  --secondary: ${variant.secondary};
  --accent: ${variant.accent};
  --dark: ${variant.dark};
  --radius: 8px;
  --shadow: 0 24px 80px rgba(15, 23, 42, .12);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; color: var(--ink); background: var(--paper); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.6; }
a { color: inherit; }
img, svg { max-width: 100%; height: auto; }
.container { width: min(1160px, calc(100% - 40px)); margin-inline: auto; }
.site-header { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,.92); border-bottom: 1px solid rgba(220,229,242,.85); backdrop-filter: blur(18px); transition: box-shadow .2s ease; }
.site-header.is-scrolled { box-shadow: 0 12px 36px rgba(15,23,42,.08); }
.header-inner { min-height: 78px; display: flex; align-items: center; gap: 24px; }
.brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 850; text-decoration: none; letter-spacing: 0; }
.brand-mark { display: inline-grid; place-items: center; width: 42px; height: 42px; border-radius: 8px; color: #fff; background: linear-gradient(135deg, var(--dark), var(--primary)); font-weight: 900; box-shadow: 0 12px 28px rgba(37,99,235,.24); }
.primary-nav { display: flex; align-items: center; justify-content: center; gap: 22px; margin-left: auto; font-size: .95rem; font-weight: 750; }
.primary-nav a { color: #334155; text-decoration: none; }
.primary-nav a:hover, .primary-nav a:focus { color: var(--primary); }
.menu-toggle { display: none; margin-left: auto; border: 1px solid var(--line); background: #fff; border-radius: 8px; padding: 10px 12px; font-weight: 800; }
.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 12px 18px; border-radius: 8px; font-weight: 850; text-decoration: none; border: 1px solid transparent; cursor: pointer; }
.btn-primary { color: #fff; background: var(--primary); box-shadow: 0 16px 38px rgba(37,99,235,.24); }
.btn-primary:hover { background: #1d4ed8; }
.btn-secondary { color: var(--ink); background: #fff; border-color: var(--line); }
.button-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.hero-section { position: relative; overflow: hidden; padding: 92px 0 76px; background: radial-gradient(circle at 85% 10%, rgba(20,184,166,.16), transparent 34%), linear-gradient(180deg, #fff, var(--soft)); }
.hero-grid { display: grid; grid-template-columns: minmax(0, 1.02fr) minmax(360px, .98fr); gap: 54px; align-items: center; }
.eyebrow { margin: 0 0 12px; color: var(--primary); font-size: .78rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
h1, h2, h3 { margin: 0; line-height: 1.04; letter-spacing: 0; color: var(--ink); }
h1 { font-size: clamp(2.7rem, 6vw, 5.7rem); max-width: 920px; }
h2 { font-size: clamp(2rem, 4vw, 3.5rem); }
h3 { font-size: 1.25rem; }
.lede { max-width: 720px; color: #475569; font-size: clamp(1.06rem, 1.6vw, 1.24rem); }
.trust-row, .proof-grid { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.trust-row span, .proof-grid b { padding: 10px 13px; border: 1px solid var(--line); border-radius: 8px; background: rgba(255,255,255,.72); color: #334155; font-size: .9rem; }
.hero-product { border: 1px solid rgba(148,163,184,.32); border-radius: 8px; background: #fff; box-shadow: var(--shadow); overflow: hidden; transform: translateY(0); animation: floatPanel 6s ease-in-out infinite; }
.product-topbar { display: flex; align-items: center; gap: 8px; padding: 16px; border-bottom: 1px solid var(--line); background: #f8fafc; }
.product-topbar span { width: 10px; height: 10px; border-radius: 999px; background: #cbd5e1; }
.product-topbar strong { margin-left: auto; color: #334155; }
.product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 18px; }
.panel, .interface-card { border: 1px solid var(--line); border-radius: 8px; padding: 18px; background: #fff; }
.panel.wide { grid-column: 1 / -1; }
.panel small, .interface-card small { display: block; color: var(--muted); font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
.panel b { display: block; margin-top: 8px; font-size: 1.3rem; }
.dark-panel { color: #dbeafe; background: var(--dark); border-color: rgba(255,255,255,.1); }
.dark-panel p, .dark-panel small { color: #cbd5e1; }
.bar { height: 10px; margin-top: 14px; background: #e2e8f0; border-radius: 99px; overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--primary), var(--secondary)); }
.proof-strip { padding: 18px 0; border-block: 1px solid var(--line); background: #fff; }
.proof-grid { justify-content: space-between; margin-top: 0; }
.section { padding: 82px 0; }
.section-heading { max-width: 780px; margin-bottom: 34px; }
.section-heading p { color: var(--muted); font-size: 1.06rem; }
.card-grid { width: min(1160px, calc(100% - 40px)); margin-inline: auto; display: grid; gap: 18px; }
.cards-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.cards-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.service-card, .case-card, .resource-section article, .card-grid article, .content-card { min-height: 100%; padding: 24px; border: 1px solid var(--line); border-radius: 8px; background: #fff; box-shadow: 0 14px 36px rgba(15,23,42,.06); }
.service-card span, .process-grid span { display: inline-grid; place-items: center; width: 34px; height: 34px; border-radius: 8px; color: #fff; background: var(--primary); font-weight: 900; }
.service-card h3, .case-card h3, .card-grid article h3 { margin-top: 18px; }
.service-card p, .case-card p, .card-grid article p, .content-card p { color: var(--muted); }
.split-section { padding: 82px 0; background: var(--soft); }
.split-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(320px, .7fr); gap: 44px; align-items: start; }
.check-list { display: grid; gap: 12px; }
.check-list p { margin: 0; padding: 16px 18px 16px 46px; position: relative; border: 1px solid var(--line); border-radius: 8px; background: #fff; color: #334155; font-weight: 760; }
.check-list p::before { content: ""; position: absolute; left: 18px; top: 20px; width: 12px; height: 12px; border-radius: 99px; background: var(--secondary); }
.dark-section { background: var(--dark); color: #e5eefb; }
.dark-section h2, .dark-section h3 { color: #fff; }
.dark-section .eyebrow { color: var(--secondary); }
.process-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
.process-grid article { padding: 24px; border: 1px solid rgba(255,255,255,.12); border-radius: 8px; background: rgba(255,255,255,.055); }
.process-grid p { color: #cbd5e1; }
.case-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.case-card b { display: inline-flex; margin-top: 12px; color: var(--primary); }
.testimonials { background: linear-gradient(135deg, var(--primary), var(--dark)); color: #fff; }
.testimonial-grid { display: grid; grid-template-columns: 1fr 260px; gap: 36px; align-items: end; }
blockquote { margin: 0; font-size: clamp(1.45rem, 3vw, 2.4rem); line-height: 1.18; font-weight: 820; }
.testimonial-grid span { display: block; color: #dbeafe; }
.contact-section { background: var(--soft); }
.contact-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(360px, .7fr); gap: 42px; align-items: start; }
.contact-form { display: grid; gap: 14px; padding: 24px; border: 1px solid var(--line); border-radius: 8px; background: #fff; box-shadow: var(--shadow); }
label { display: grid; gap: 7px; color: #334155; font-weight: 820; }
input, select, textarea { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 13px; font: inherit; color: var(--ink); background: #fff; }
input:focus, select:focus, textarea:focus, button:focus-visible, a:focus-visible { outline: 3px solid rgba(37,99,235,.28); outline-offset: 3px; }
.page-hero { padding: 82px 0; background: linear-gradient(180deg, #fff, var(--soft)); }
.page-hero__grid { display: grid; grid-template-columns: 1fr 360px; gap: 38px; align-items: center; }
.interface-card { box-shadow: 0 18px 50px rgba(15,23,42,.09); }
.status-dot { display: inline-block; width: 12px; height: 12px; border-radius: 99px; background: var(--secondary); box-shadow: 0 0 0 7px rgba(20,184,166,.13); }
.metric-row { display: flex; justify-content: space-between; gap: 20px; margin-top: 14px; color: var(--muted); }
.site-footer { padding: 62px 0 24px; background: #07111f; color: #dbe7f5; }
.footer-grid { display: grid; grid-template-columns: 1.4fr repeat(3, 1fr); gap: 28px; }
.footer-grid h2 { color: #fff; font-size: 1rem; margin-bottom: 12px; }
.footer-grid a { display: block; color: #dbe7f5; text-decoration: none; margin: 8px 0; }
.footer-brand { color: #fff; }
.footer-bottom { display: flex; justify-content: space-between; gap: 20px; margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,.12); color: #94a3b8; font-size: .92rem; }
@keyframes floatPanel { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; scroll-behavior: auto !important; } }
@media (max-width: 980px) {
  .hero-grid, .split-grid, .contact-grid, .page-hero__grid, .testimonial-grid { grid-template-columns: 1fr; }
  .cards-3, .cards-4, .case-grid, .process-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .header-action { display: none; }
}
@media (max-width: 720px) {
  .container, .card-grid { width: min(100% - 28px, 1160px); }
  .header-inner { min-height: 68px; }
  .menu-toggle { display: inline-flex; }
  .primary-nav { display: none; position: absolute; left: 14px; right: 14px; top: 72px; flex-direction: column; align-items: stretch; padding: 18px; border: 1px solid var(--line); border-radius: 8px; background: #fff; box-shadow: var(--shadow); }
  .primary-nav.is-open { display: flex; }
  .hero-section { padding: 64px 0; }
  h1 { font-size: clamp(2.35rem, 12vw, 3.8rem); }
  .product-grid, .cards-3, .cards-4, .case-grid, .process-grid, .footer-grid { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; }
}
`);

fs.copyFileSync(path.join(themeDir, 'src/scss/main.scss'), path.join(themeDir, 'assets/css/bundle.css'));

console.log(`Rendered premium software company theme for ${themeSlug} (${variantInput}).`);
