#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const [slug] = process.argv.slice(2);
const root = path.resolve(__dirname, '..');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!slug) fail('Usage: node scripts/generate-static-preview.js <theme-slug>');
if (!/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(slug)) fail(`Invalid theme slug: ${slug}`);

const themeDir = path.join(root, 'wp-content', 'themes', slug);
const previewDir = path.join(root, 'docs', 'Preview-Themes-Github', slug);
if (!fs.existsSync(themeDir)) fail(`Theme folder missing: wp-content/themes/${slug}`);

function readStyle(field) {
  const file = path.join(themeDir, 'style.css');
  if (!fs.existsSync(file)) return '';
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(new RegExp(`^${field}:\\s*(.+)$`, 'mi'));
  return match ? match[1].trim() : '';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function titleFromSlug(value) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function copyIfExists(sourceRelative, targetRelative) {
  const source = path.join(themeDir, sourceRelative);
  if (!fs.existsSync(source)) return false;
  const target = path.join(previewDir, targetRelative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  return true;
}

function copyTreeIfExists(sourceRelative, targetRelative) {
  const source = path.join(themeDir, sourceRelative);
  if (!fs.existsSync(source)) return false;
  const target = path.join(previewDir, targetRelative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
  return true;
}

const themeName = readStyle('Theme Name') || titleFromSlug(slug);
const description = readStyle('Description') || 'Generated WordPress theme preview.';

const services = [
  {
    key: 'strategy',
    title: 'Website Strategy',
    image: 'assets/images/portfolio/service-strategy.svg',
    excerpt: 'Clarify goals, audience needs, content priorities, and conversion paths before design starts.',
  },
  {
    key: 'design',
    title: 'Modern WordPress Design',
    image: 'assets/images/portfolio/service-design.svg',
    excerpt: 'Create polished, responsive interfaces that make services easy to understand and act on.',
  },
  {
    key: 'development',
    title: 'Custom Theme Development',
    image: 'assets/images/portfolio/service-development.svg',
    excerpt: 'Build maintainable WordPress themes with clean templates, local assets, and practical editor support.',
  },
  {
    key: 'integration',
    title: 'Content and Tool Integration',
    image: 'assets/images/portfolio/service-integration.svg',
    excerpt: 'Connect forms, content flows, analytics-ready events, and operational pages without runtime clutter.',
  },
  {
    key: 'support',
    title: 'Launch and Support',
    image: 'assets/images/portfolio/service-support.svg',
    excerpt: 'Prepare the handoff, document key workflows, and support updates after the site goes live.',
  },
  {
    key: 'optimization',
    title: 'Conversion Improvement',
    image: 'assets/images/portfolio/service-results.svg',
    excerpt: 'Refine important pages so visitors can compare services, ask better questions, and contact with confidence.',
  },
];

const workItems = [
  { title: 'Service Firm Rebuild', category: 'Strategy', image: 'assets/images/portfolio/work-service-firm.svg', excerpt: 'A clearer service architecture with direct inquiry paths and easier editorial maintenance.' },
  { title: 'Consulting Resource Hub', category: 'Design', image: 'assets/images/portfolio/work-resource-hub.svg', excerpt: 'Editorial article cards, topic navigation, and structured calls to action for a knowledge-heavy team.' },
  { title: 'Local Services Conversion Pages', category: 'Development', image: 'assets/images/portfolio/work-conversion-pages.svg', excerpt: 'Reusable WordPress page sections for services, FAQs, proof, and contact flows.' },
  { title: 'Operations-Friendly Lead Flow', category: 'Integration', image: 'assets/images/portfolio/work-lead-flow.svg', excerpt: 'Private submission storage, admin review, exports, and owner notifications.' },
  { title: 'Launch Support System', category: 'Support', image: 'assets/images/portfolio/work-launch-support.svg', excerpt: 'Documentation, update routines, and practical handoff resources for site owners.' },
  { title: 'Inquiry Page Refinement', category: 'Results', image: 'assets/images/portfolio/work-inquiry-refinement.svg', excerpt: 'A focused contact experience that asks for useful context without overburdening visitors.' },
];

const articles = [
  { tag: 'Planning', title: 'What to Prepare Before a Website Redesign', image: 'assets/images/portfolio/article-planning.svg', excerpt: 'A practical list of goals, content, examples, and decision points that makes the first conversation more useful.' },
  { tag: 'WordPress', title: 'Choosing Pages for a Service Business Website', image: 'assets/images/portfolio/article-pages.svg', excerpt: 'How to organize services, proof, resources, and contact paths so visitors can move with less friction.' },
  { tag: 'Design', title: 'Why Reusable Sections Make Sites Easier to Maintain', image: 'assets/images/portfolio/article-sections.svg', excerpt: 'A compact guide to component thinking for teams that need a polished site they can keep current.' },
  { tag: 'Support', title: 'A Calm Launch Checklist for WordPress Projects', image: 'assets/images/portfolio/article-launch.svg', excerpt: 'The checks that help reduce surprises before a new service website goes live.' },
];

const faqs = [
  ['How does a project usually start?', 'Northstar Websites starts with a focused discovery conversation about goals, audiences, content, current pain points, and what the website needs to help visitors do.'],
  ['Can an existing WordPress site be improved instead of rebuilt?', 'Yes. Some projects are targeted improvements to structure, content, forms, accessibility, or design consistency rather than a full rebuild.'],
  ['What information is useful before requesting a quote?', 'Useful context includes your primary services, important pages, examples of sites you admire, current content status, preferred timeline, and any tools the site must support.'],
  ['Do you create content?', 'The theme is structured to support clear service content. Project work can include content planning, page outlines, and editing guidance without inventing unsupported business claims.'],
  ['Will the site work on mobile devices?', 'Layouts, navigation, forms, cards, and footer sections are designed mobile-first so the experience remains usable on small screens.'],
  ['What happens after launch?', 'Launch support can include handoff notes, editor guidance, small follow-up adjustments, and recommendations for responsible ongoing maintenance.'],
  ['How are contact and newsletter submissions handled?', 'Submissions are stored privately in WordPress admin areas with nonce validation, sanitization, exports, and owner notification support.'],
];

function imageTag(source, alt) {
  return `<img src="${escapeHtml(source)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">`;
}

function headerNav() {
  return [
    ['Homepage', 'homepage_preview.html'],
    ['Services', 'services_preview.html'],
    ['About', 'about-us_preview.html'],
    ['Contact', 'contact_preview.html'],
    ['Single Service', 'single_services_preview.html'],
    ['Blog', 'blog_preview.html'],
    ['Work', 'work_preview.html'],
  ].map(([label, file]) => `<a href="${file}">${escapeHtml(label)}</a>`).join('');
}

function serviceCards() {
  return services.map((service) => `
    <article class="service-card">
      <div class="service-card__media">${imageTag(service.image, service.title)}</div>
      <div class="service-card__body">
        <p class="eyebrow">${escapeHtml(service.key)}</p>
        <h3>${escapeHtml(service.title)}</h3>
        <p>${escapeHtml(service.excerpt)}</p>
      </div>
    </article>`).join('');
}

function workCards() {
  return workItems.map((item) => `
    <article class="work-card" data-category="${escapeHtml(item.category)}">
      <div class="work-card__media">${imageTag(item.image, item.title)}</div>
      <div class="work-card__content">
        <p class="eyebrow">${escapeHtml(item.category)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.excerpt)}</p>
      </div>
    </article>`).join('');
}

function articleCards() {
  return articles.map((article) => `
    <article class="blog-card">
      ${imageTag(article.image, article.title)}
      <div>
        <p class="eyebrow">${escapeHtml(article.tag)}</p>
        <h3>${escapeHtml(article.title)}</h3>
        <p>${escapeHtml(article.excerpt)}</p>
      </div>
    </article>`).join('');
}

function faqAccordion() {
  return `<section class="section faq-section" aria-labelledby="faq-title">
    <div class="container">
      <div class="section-heading">
        <p class="eyebrow">FAQ</p>
        <h2 id="faq-title">Questions businesses ask before starting.</h2>
      </div>
      <div class="accordion">
        ${faqs.map(([q, a]) => `
          <div class="accordion__item">
            <button class="accordion__trigger" type="button" aria-expanded="false">
              ${escapeHtml(q)}
              <span aria-hidden="true">+</span>
            </button>
            <div class="accordion__panel"><p>${escapeHtml(a)}</p></div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function contactForm() {
  return `<form class="northstar-form">
    <div class="form-grid">
      <label>Name<input type="text" value="" aria-label="Name"></label>
      <label>Email<input type="email" value="" aria-label="Email"></label>
    </div>
    <label>Phone<input type="tel" value="" aria-label="Phone"></label>
    <label>Message<textarea rows="6" aria-label="Message"></textarea></label>
    <button class="btn btn-primary" type="button">Send inquiry</button>
  </form>`;
}

function newsletterForm() {
  return `<form class="newsletter-form">
    <label>First name<input type="text" aria-label="First name"></label>
    <label>Email<input type="email" aria-label="Email"></label>
    <button class="btn btn-secondary btn-small" type="button">Subscribe</button>
  </form>`;
}

function workFilterSection() {
  const filters = ['All', 'Strategy', 'Design', 'Development', 'Integration', 'Support', 'Results']
    .map((label, index) => `<button class="filter-button${index === 0 ? ' is-active' : ''}" type="button">${escapeHtml(label)}</button>`)
    .join('');
  return `<section class="section section--soft portfolio-filter" aria-labelledby="featured-work-title">
    <div class="container">
      <div class="section-heading">
        <p class="eyebrow">Work in focus</p>
        <h2 id="featured-work-title">Filter examples by the kind of progress you need.</h2>
      </div>
      <div class="portfolio-filter__controls">${filters}</div>
      <div class="portfolio-filter__grid">${workCards()}</div>
    </div>
  </section>`;
}

function featuredWorkSection() {
  return `<section class="section featured-strip" aria-labelledby="featured-strip-title">
    <div class="container">
      <div class="section-heading section-heading--split">
        <div>
          <p class="eyebrow">Featured work</p>
          <h2 id="featured-strip-title">Practical site systems for real service workflows.</h2>
        </div>
      </div>
      <div class="featured-strip__track">${workItems.slice(0, 4).map((item) => `
        <article class="mini-work">
          <span>${escapeHtml(item.category)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.excerpt)}</p>
        </article>`).join('')}
      </div>
    </div>
  </section>`;
}

function heroSection(title, lead, image, imageAlt) {
  return `<section class="section hero hero--page" aria-labelledby="${escapeHtml(title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">
    <div class="container hero__grid">
      <div class="hero__content">
        <p class="eyebrow">Northstar Websites</p>
        <h1 id="${escapeHtml(title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">${escapeHtml(title)}</h1>
        <p>${escapeHtml(lead)}</p>
      </div>
      <div class="hero__visual">${imageTag(image, imageAlt)}</div>
    </div>
  </section>`;
}

function renderHomePage() {
  return `
    ${heroSection(
      'Modern WordPress websites for service businesses that need clarity.',
      'Northstar Websites plans, designs, builds, and supports polished WordPress sites with clear services, purposeful content, accessible interactions, and practical conversion paths.',
      'assets/images/hero/northstar-hero.svg',
      'Layered website planning board for Northstar Websites'
    )}
    ${featuredWorkSection()}
    <section class="section brand-statement" aria-labelledby="brand-statement-title">
      <div class="container brand-statement__grid">
        <div>
          <p class="eyebrow">Positioning</p>
          <h2 id="brand-statement-title">A website should explain the business before it decorates the screen.</h2>
        </div>
        <div>
          <p>Northstar Websites brings structure to service-business websites: concise messaging, direct navigation, clear service detail, useful resources, private inquiry handling, and a build system that keeps source files and production assets separated.</p>
          <p>The result is a calm, content-forward theme that can adapt to consultants, local providers, professional practices, and business-to-business teams.</p>
        </div>
      </div>
    </section>
    <section class="section" aria-labelledby="services-overview-title">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Services</p>
          <h2 id="services-overview-title">Six ways to move from unclear website to useful business tool.</h2>
          <p>Each service can stand alone or combine into a full planning, design, development, launch, and support engagement.</p>
        </div>
        <div class="card-grid card-grid--services">${serviceCards()}</div>
      </div>
    </section>
    <section class="section process" aria-labelledby="process-title">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Process</p>
          <h2 id="process-title">A steady sequence that keeps the project focused.</h2>
        </div>
        <div class="card-grid card-grid--three">
          <article class="info-card"><h3>Discover</h3><p>Clarify goals, audiences, current friction, and the pages that matter most.</p></article>
          <article class="info-card"><h3>Build</h3><p>Create reusable sections, accessible navigation, and a visual system that fits the business.</p></article>
          <article class="info-card"><h3>Launch</h3><p>Package the site, verify the build, and leave the owner with a maintainable content system.</p></article>
        </div>
      </div>
    </section>
    ${workFilterSection()}
    <section class="section case-study" aria-labelledby="case-study-title">
      <div class="container case-study__grid">
        <div>${imageTag('assets/images/portfolio/case-study-service-site.svg', 'Service website case study interface')}</div>
        <div>
          <p class="eyebrow">Case study pattern</p>
          <h2 id="case-study-title">A service website structured around better decisions.</h2>
          <p>The challenge is common: important services are spread across unclear pages, visitors do not know where to begin, and the owner needs a site that is easier to update.</p>
          <dl>
            <div><dt>Challenge</dt><dd>Simplify a complex service offer without hiding necessary detail.</dd></div>
            <div><dt>Solution</dt><dd>Reusable service cards, guided CTAs, article previews, and private inquiry records.</dd></div>
            <div><dt>Outcome</dt><dd>A maintainable WordPress structure that can support future pages and resources.</dd></div>
          </dl>
        </div>
      </div>
    </section>
    <section class="section section--soft before-after" aria-labelledby="comparison-title">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Before and after</p>
          <h2 id="comparison-title">Compare a scattered site with a guided service experience.</h2>
        </div>
        <div class="comparison-grid">
          <article><h3>Before</h3><ul><li>Services compete for attention.</li><li>Forms ask for context too late.</li><li>Resources feel disconnected from conversion paths.</li></ul></article>
          <article><h3>After</h3><ul><li>Pages guide visitors by need and readiness.</li><li>Inquiry forms carry service context into admin records.</li><li>Articles, proof, and process support the next step.</li></ul></article>
        </div>
      </div>
    </section>
    <section class="section packages" aria-labelledby="packages-title">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Engagement options</p>
          <h2 id="packages-title">Choose the level of help that fits the work ahead.</h2>
        </div>
        <div class="card-grid card-grid--three">
          <article class="package-card"><h3>Focused Improvement</h3><p>A clear scope can include planning, design, theme development, launch preparation, support, or a targeted mix of those services.</p></article>
          <article class="package-card"><h3>Complete Website Build</h3><p>A clear scope can include planning, design, theme development, launch preparation, support, or a targeted mix of those services.</p></article>
          <article class="package-card"><h3>Ongoing Support</h3><p>A clear scope can include planning, design, theme development, launch preparation, support, or a targeted mix of those services.</p></article>
        </div>
      </div>
    </section>
    <section class="section customer-experience" aria-labelledby="experience-title">
      <div class="container customer-experience__grid">
        <div>
          <p class="eyebrow">Customer experience</p>
          <h2 id="experience-title">Know what is happening before, during, and after the build.</h2>
        </div>
        <div class="card-grid">
          <article class="info-card"><h3>Before</h3><p>You gather goals, content, examples, and operational needs so early choices are grounded.</p></article>
          <article class="info-card"><h3>During</h3><p>The work moves through visible sections, reusable patterns, review points, and practical decisions.</p></article>
          <article class="info-card"><h3>After</h3><p>The site includes documentation, maintainable assets, and support-ready admin records.</p></article>
        </div>
      </div>
    </section>
    <section class="section testimonials" aria-labelledby="testimonials-title">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Proof</p>
          <h2 id="testimonials-title">Clear feedback from the work itself.</h2>
        </div>
        <div class="card-grid card-grid--three">
          <article class="info-card"><h3>Editorial clarity</h3><p>The pages make it easier to explain services without hiding detail or burying the contact step.</p></article>
          <article class="info-card"><h3>Faster updates</h3><p>Reusable sections reduce the amount of page-specific code and keep the theme easier to maintain.</p></article>
          <article class="info-card"><h3>Cleaner handoff</h3><p>Owners get a system they can understand, not just a design they can admire.</p></article>
        </div>
      </div>
    </section>
    <section class="section blog-preview" aria-labelledby="blog-preview-title">
      <div class="container">
        <div class="section-heading section-heading--split">
          <div>
            <p class="eyebrow">Resources</p>
            <h2 id="blog-preview-title">Helpful website planning notes for service businesses.</h2>
          </div>
        </div>
        <div class="card-grid card-grid--four">${articleCards()}</div>
      </div>
    </section>
    ${faqAccordion()}
    <section class="section final-cta" aria-labelledby="final-cta-title">
      <div class="container final-cta__inner">
        <p class="eyebrow">Next step</p>
        <h2 id="final-cta-title">Bring structure to the website your business depends on.</h2>
        <p>Use the contact form to share what is changing, what is confusing visitors, and what the next version of the site needs to support.</p>
        <div><a class="btn btn-primary" href="contact_preview.html">Contact Us</a><a class="btn btn-secondary" href="work_preview.html">Review Work</a></div>
      </div>
    </section>`;
}

function renderServicesPage() {
  return `
    ${heroSection(
      'Six focused services for better WordPress sites.',
      'Northstar Websites can plan, design, build, connect, launch, and support a website as a single engagement or through a focused set of improvements.',
      'assets/images/portfolio/service-design.svg',
      'Service design illustration'
    )}
    <section class="section section--soft">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Services</p>
          <h2>Six ways to move a business site from unclear to useful.</h2>
        </div>
        <div class="card-grid card-grid--services">${serviceCards()}</div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Process</p>
          <h2>How work stays organized from first conversation to launch.</h2>
        </div>
        <div class="card-grid card-grid--three">
          <article class="info-card"><h3>Discovery</h3><p>Find the real business problem the site must solve.</p></article>
          <article class="info-card"><h3>Implementation</h3><p>Shape the page system, visual patterns, and content structure.</p></article>
          <article class="info-card"><h3>Support</h3><p>Hand off a maintainable theme with clear next steps.</p></article>
        </div>
      </div>
    </section>
    ${faqAccordion()}
    <section class="section final-cta" aria-labelledby="services-cta-title">
      <div class="container final-cta__inner">
        <p class="eyebrow">Next step</p>
        <h2 id="services-cta-title">Bring structure to the site your business depends on.</h2>
        <p>Use the contact form to share what is changing, what is confusing visitors, and what the next version of the site needs to support.</p>
        <div><a class="btn btn-primary" href="contact_preview.html">Contact Us</a><a class="btn btn-secondary" href="work_preview.html">Review Work</a></div>
      </div>
    </section>`;
}

function renderAboutPage() {
  return `
    ${heroSection(
      'A website partner focused on clarity, not noise.',
      'Northstar Websites helps service businesses present their work clearly, route visitors toward the next step, and keep the content system easy to maintain after launch.',
      'assets/images/hero/northstar-hero.svg',
      'Northstar Websites planning board illustration'
    )}
    <section class="section brand-statement" aria-labelledby="brand-statement-title">
      <div class="container brand-statement__grid">
        <div><p class="eyebrow">Positioning</p><h2 id="brand-statement-title">A website should explain the business before it decorates the screen.</h2></div>
        <div><p>Northstar Websites brings structure to service-business websites: concise messaging, direct navigation, clear service detail, useful resources, private inquiry handling, and a build system that keeps source files and production assets separated.</p><p>The result is a calm, content-forward theme that can adapt to consultants, local providers, professional practices, and business-to-business teams.</p></div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-heading"><p class="eyebrow">Approach</p><h2>Structure first, then the visual system.</h2></div>
        <div class="card-grid card-grid--three">
          <article class="info-card"><h3>Discover</h3><p>Start with business goals, service priorities, content gaps, and the decisions visitors need to make.</p></article>
          <article class="info-card"><h3>Design</h3><p>Shape a reusable visual system that keeps navigation, sections, and calls to action consistent.</p></article>
          <article class="info-card"><h3>Launch</h3><p>Ship a WordPress site with maintainable templates, local assets, and a handoff that makes updates easier.</p></article>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container"><div class="section-heading"><p class="eyebrow">Process</p><h2>How a project moves from conversation to release.</h2></div><div class="card-grid card-grid--three"><article class="info-card"><h3>Plan</h3><p>Set the content map and structure.</p></article><article class="info-card"><h3>Build</h3><p>Make reusable components and page systems.</p></article><article class="info-card"><h3>Support</h3><p>Leave the site easy to manage after launch.</p></article></div></div>
    </section>
    <section class="section testimonials" aria-labelledby="proof-title">
      <div class="container"><div class="section-heading"><p class="eyebrow">Proof</p><h2 id="proof-title">Useful outcomes from the work itself.</h2></div><div class="card-grid card-grid--three"><article class="info-card"><h3>Better explanation</h3><p>The site gives services a clearer story and a better path to contact.</p></article><article class="info-card"><h3>Cleaner maintenance</h3><p>Reusable sections reduce the amount of page-specific code the owner has to keep track of.</p></article><article class="info-card"><h3>Less friction</h3><p>Navigation and calls to action stay consistent from page to page.</p></article></div></div>
    </section>
    ${faqAccordion()}
    <section class="section final-cta" aria-labelledby="about-cta-title">
      <div class="container final-cta__inner">
        <p class="eyebrow">Next step</p>
        <h2 id="about-cta-title">Bring structure to the website your business depends on.</h2>
        <p>Use the contact form to share what is changing, what is confusing visitors, and what the next version of the site needs to support.</p>
        <div><a class="btn btn-primary" href="contact_preview.html">Contact Us</a><a class="btn btn-secondary" href="work_preview.html">Review Work</a></div>
      </div>
    </section>`;
}

function renderContactPage() {
  return `
    ${heroSection(
      'Tell Northstar Websites what the site needs to do next.',
      'Share the project context, support needs, or page problems you want to solve. The inquiry form keeps the next step focused and manageable.',
      'assets/images/portfolio/work-lead-flow.svg',
      'Contact illustration'
    )}
    <section class="section">
      <div class="container content-grid">
        <div class="content-card">
          <h2>Project inquiry</h2>
          ${contactForm()}
        </div>
        <div class="content-card">
          <h2>Newsletter</h2>
          <p>Use this optional signup if you want a lightweight update channel for planning notes, launch reminders, or resource posts.</p>
          ${newsletterForm()}
        </div>
      </div>
    </section>
    ${faqAccordion()}
    <section class="section final-cta" aria-labelledby="contact-cta-title">
      <div class="container final-cta__inner">
        <p class="eyebrow">Next step</p>
        <h2 id="contact-cta-title">Bring structure to the website your business depends on.</h2>
        <p>Use the contact form to share what is changing, what is confusing visitors, and what the next version of the site needs to support.</p>
        <div><a class="btn btn-primary" href="contact_preview.html">Contact Us</a><a class="btn btn-secondary" href="work_preview.html">Review Work</a></div>
      </div>
    </section>`;
}

function renderSingleServicePage() {
  return `
    ${heroSection(
      'Custom Theme Development',
      'This template supports focused service pages with useful context, strong calls to action, and a form that carries the service name into the inquiry flow.',
      'assets/images/portfolio/service-development.svg',
      'Service detail illustration'
    )}
    <section class="section">
      <div class="container content-grid">
        <article class="content-card">
          <p>Build maintainable WordPress themes with clean templates, local assets, and practical editor support.</p>
          <p>The service detail page can explain deliverables, ideal fit, process, related services, and common questions without inventing claims or overloading the layout.</p>
        </article>
        <div class="content-card">
          <h2>Start the conversation</h2>
          ${contactForm()}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container"><div class="section-heading"><p class="eyebrow">Included</p><h2>Deliverables that keep the site easier to run.</h2></div><div class="card-grid card-grid--three"><article class="info-card"><h3>Templates</h3><p>Reusable page structures and modular content parts.</p></article><article class="info-card"><h3>Assets</h3><p>Local images, SVGs, and compiled bundles.</p></article><article class="info-card"><h3>Support</h3><p>Launch and handoff guidance after release.</p></article></div></div>
    </section>
    ${faqAccordion()}
    <section class="section final-cta" aria-labelledby="single-cta-title">
      <div class="container final-cta__inner">
        <p class="eyebrow">Next step</p>
        <h2 id="single-cta-title">Bring structure to the website your business depends on.</h2>
        <p>Use the contact form to share what is changing, what is confusing visitors, and what the next version of the site needs to support.</p>
        <div><a class="btn btn-primary" href="contact_preview.html">Contact Us</a><a class="btn btn-secondary" href="work_preview.html">Review Work</a></div>
      </div>
    </section>`;
}

function renderBlogPage() {
  return `
    ${heroSection(
      'Practical notes for planning and maintaining a service website.',
      'Use the blog to surface useful guidance, project planning ideas, and answers to common questions before a sales conversation begins.',
      'assets/images/portfolio/article-launch.svg',
      'Blog illustration'
    )}
    <section class="section blog-preview" aria-labelledby="blog-preview-title">
      <div class="container">
        <div class="section-heading section-heading--split">
          <div>
            <p class="eyebrow">Resources</p>
            <h2 id="blog-preview-title">Helpful website planning notes for service businesses.</h2>
          </div>
        </div>
        <div class="card-grid card-grid--four">${articleCards()}</div>
      </div>
    </section>
    <section class="section final-cta" aria-labelledby="blog-cta-title">
      <div class="container final-cta__inner">
        <p class="eyebrow">Next step</p>
        <h2 id="blog-cta-title">Bring structure to the website your business depends on.</h2>
        <p>Use the contact form to share what is changing, what is confusing visitors, and what the next version of the site needs to support.</p>
        <div><a class="btn btn-primary" href="contact_preview.html">Contact Us</a><a class="btn btn-secondary" href="work_preview.html">Review Work</a></div>
      </div>
    </section>`;
}

function renderWorkPage() {
  return `
    ${heroSection(
      'Examples of clearer service websites and better inquiry paths.',
      'This page brings together representative projects, categories, and outcome-focused cards so visitors can move from interest to action quickly.',
      'assets/images/portfolio/work-service-firm.svg',
      'Work example illustration'
    )}
    ${workFilterSection()}
    <section class="section featured-strip" aria-labelledby="featured-strip-title">
      <div class="container">
        <div class="section-heading section-heading--split">
          <div>
            <p class="eyebrow">Featured work</p>
            <h2 id="featured-strip-title">Practical site systems for real service workflows.</h2>
          </div>
        </div>
        <div class="featured-strip__track">${workItems.slice(0, 4).map((item) => `
          <article class="mini-work">
            <span>${escapeHtml(item.category)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.excerpt)}</p>
          </article>`).join('')}
        </div>
      </div>
    </section>
    <section class="section final-cta" aria-labelledby="work-cta-title">
      <div class="container final-cta__inner">
        <p class="eyebrow">Next step</p>
        <h2 id="work-cta-title">Bring structure to the website your business depends on.</h2>
        <p>Use the contact form to share what is changing, what is confusing visitors, and what the next version of the site needs to support.</p>
        <div><a class="btn btn-primary" href="contact_preview.html">Contact Us</a><a class="btn btn-secondary" href="homepage_preview.html">Back Home</a></div>
      </div>
    </section>`;
}

function renderDefaultPage(label) {
  return `<main id="primary" class="site-main">
    <section class="section hero">
      <div class="container">
        <h1>${escapeHtml(label)}</h1>
        <p>${escapeHtml(description)}</p>
      </div>
    </section>
  </main>`;
}

function pageBody(sourceRelative) {
  if (sourceRelative === 'front-page.php') return renderHomePage();
  if (sourceRelative === 'page-templates/template-services.php') return renderServicesPage();
  if (sourceRelative === 'page-templates/template-about-us.php') return renderAboutPage();
  if (sourceRelative === 'page-templates/template-contact.php') return renderContactPage();
  if (sourceRelative === 'page-templates/template-single-service.php') return renderSingleServicePage();
  if (sourceRelative === 'page-templates/template-blog.php') return renderBlogPage();
  if (sourceRelative === 'page-templates/template-work.php') return renderWorkPage();
  return renderDefaultPage(sourceRelative);
}

const pages = [
  ['index.html', 'Overview', 'front-page.php'],
  ['homepage_preview.html', 'Homepage', 'front-page.php'],
  ['services_preview.html', 'Services', 'page-templates/template-services.php'],
  ['about-us_preview.html', 'About', 'page-templates/template-about-us.php'],
  ['contact_preview.html', 'Contact', 'page-templates/template-contact.php'],
  ['single_services_preview.html', 'Single Service', 'page-templates/template-single-service.php'],
  ['blog_preview.html', 'Blog', 'page-templates/template-blog.php'],
  ['work_preview.html', 'Work', 'page-templates/template-work.php'],
];

const nav = headerNav();

const fallbackCss = `:root{--ink:#111827;--paper:#f7f8fb;--accent:#2563eb;--line:#dbe3ee}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:system-ui,sans-serif;line-height:1.55}.container,.wrap{width:min(1120px,calc(100% - 40px));margin:0 auto}.preview-header{position:sticky;top:0;z-index:20;background:#fff;border-bottom:1px solid var(--line)}.preview-header-inner{min-height:74px;display:flex;align-items:center;justify-content:space-between;gap:24px}.preview-brand{font-weight:800}.preview-nav{display:flex;flex-wrap:wrap;gap:12px}.preview-nav a{color:var(--accent);font-weight:700;text-decoration:none}.preview-footer{padding:32px 0;border-top:1px solid var(--line);background:#fff}.hero,section{padding:56px 0}.btn-primary,.btn-secondary,.button{display:inline-flex;align-items:center;gap:8px;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:800}@media(max-width:760px){.preview-header-inner{align-items:flex-start;flex-direction:column;padding:18px 0}}`;

fs.rmSync(previewDir, { recursive: true, force: true });
fs.mkdirSync(path.join(previewDir, 'assets', 'css'), { recursive: true });
fs.mkdirSync(path.join(previewDir, 'assets', 'js'), { recursive: true });
fs.mkdirSync(path.join(previewDir, 'assets', 'images'), { recursive: true });
fs.mkdirSync(path.join(previewDir, 'assets', 'icons'), { recursive: true });

if (!copyIfExists('assets/css/bundle.css', 'assets/css/preview.css')) {
  fs.writeFileSync(path.join(previewDir, 'assets', 'css', 'preview.css'), fallbackCss);
} else {
  fs.appendFileSync(path.join(previewDir, 'assets', 'css', 'preview.css'), `\n${fallbackCss}\n`);
}

copyIfExists('assets/js/bundle.js', 'assets/js/preview.js') || fs.writeFileSync(path.join(previewDir, 'assets', 'js', 'preview.js'), '');
copyTreeIfExists('assets/images', 'assets/images');
copyTreeIfExists('assets/icons', 'assets/icons');

fs.writeFileSync(path.join(previewDir, 'assets', 'images', 'README.md'), '# Preview Images\n\nPreview pages use generated theme CSS, local SVGs, and local theme assets.\n');
fs.writeFileSync(path.join(previewDir, 'README.md'), `# ${themeName}\n\nStatic preview for ${slug}.\n`);

function renderPage(file, label, sourceRelative) {
  const body = pageBody(sourceRelative);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(themeName)} - ${escapeHtml(label)}</title>
    <link rel="stylesheet" href="assets/css/preview.css">
  </head>
  <body>
    <header class="preview-header" data-nolan-menu-header>
      <div class="container preview-header-inner">
        <a class="preview-brand" href="homepage_preview.html">${escapeHtml(themeName)}</a>
        <nav class="preview-nav" aria-label="Preview navigation">${nav}</nav>
      </div>
    </header>
${body}
    <footer class="preview-footer">
      <div class="container">
        <strong>${escapeHtml(themeName)}</strong>
        <p>${escapeHtml(description)}</p>
      </div>
    </footer>
    <script src="assets/js/preview.js"></script>
  </body>
</html>`;
}

for (const [file, label, sourceRelative] of pages) {
  fs.writeFileSync(path.join(previewDir, file), renderPage(file, label, sourceRelative));
}

console.log(`Generated docs/Preview-Themes-Github/${slug}`);
