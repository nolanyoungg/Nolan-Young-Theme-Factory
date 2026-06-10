const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname, '..', '..', '..');
const slug = '001_nolan_young_theme_meridian_strategy_group';
const themeDir = path.join(root, 'wp-content', 'themes', slug);
const previewDir = path.join(root, 'docs', 'themes', slug);
const specPath = path.join(__dirname, 'ollama-site-content.json');
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));

spec.tagline = 'Operating clarity for regulated service companies';
spec.heroHeadline = 'Build the operating system your next stage requires';
spec.heroCopy = 'Meridian Strategy Group designs the processes, compliance rhythms, client experience systems, and leadership dashboards that let founder-led healthcare, wellness, and professional-services teams scale with control.';
spec.primaryCta = { label: 'Book a readiness call', link: '/contact/' };
spec.secondaryCta = { label: 'View service model', link: '/services/' };
spec.services = [
  {
    title: 'Operating Model Design',
    kicker: 'Structure before scale',
    summary: 'Role clarity, decision rights, handoff maps, and operating cadences for teams that have outgrown founder memory.',
    detail: 'We map the work, remove ambiguous ownership, and install practical rhythms for intake, delivery, escalation, quality review, and leadership reporting.',
    outcomes: ['Clearer accountability across departments', 'Fewer stalled handoffs between teams', 'A leadership cadence that surfaces risk early']
  },
  {
    title: 'Compliance Readiness',
    kicker: 'Audit discipline without panic',
    summary: 'Policy review, control mapping, evidence routines, and readiness planning for regulated service organizations.',
    detail: 'Meridian turns compliance from a scramble into an operating habit with defensible documentation, review cycles, and issue ownership.',
    outcomes: ['Cleaner evidence trails', 'Defined control owners', 'Reduced remediation backlog']
  },
  {
    title: 'Client Experience Systems',
    kicker: 'Service that feels consistent',
    summary: 'Client journey design, onboarding standards, communication playbooks, and quality checkpoints that protect the brand.',
    detail: 'We translate premium service expectations into repeatable workflows that teams can run every week without improvising the basics.',
    outcomes: ['More consistent onboarding', 'Faster response standards', 'Service recovery paths before issues escalate']
  },
  {
    title: 'Leadership Dashboards',
    kicker: 'Signals executives can use',
    summary: 'Practical scorecards and operating dashboards that connect capacity, compliance, service quality, and financial pressure.',
    detail: 'We define the few metrics that matter, document how they are gathered, and create a review rhythm that drives decisions.',
    outcomes: ['Cleaner weekly visibility', 'Sharper capacity planning', 'Earlier risk detection']
  }
];
spec.metrics = [
  { value: '42%', label: 'average reduction in unresolved operating issues after two quarters' },
  { value: '18', label: 'control categories translated into weekly ownership routines' },
  { value: '6 weeks', label: 'typical time to a usable leadership operating dashboard' },
  { value: '31%', label: 'faster client onboarding cycle in recent implementation work' }
];
spec.process = [
  { step: '01', description: 'Diagnose operating friction, compliance exposure, and leadership reporting gaps with senior interviews and artifact review.' },
  { step: '02', description: 'Design the operating model, control routines, service standards, and dashboard architecture around how the team actually works.' },
  { step: '03', description: 'Install practical tools, meeting rhythms, owner maps, and documentation so managers can run the system without consultants in the room.' },
  { step: '04', description: 'Stabilize adoption with weekly review, executive readouts, and refinements tied to measurable operating outcomes.' }
];
spec.testimonials = [
  { quote: 'Meridian gave our leadership team the operating language we were missing. Decisions stopped circling and our compliance evidence finally had owners.', name: 'Avery Collins', title: 'Managing Partner, Northline Wellness Group' },
  { quote: 'The work was calm, direct, and immediately useful. Within a month we could see intake bottlenecks, staffing pressure, and policy gaps in one dashboard.', name: 'Priya Raman', title: 'Chief Operating Officer, Harborview Clinics' },
  { quote: 'They did not hand us theory. They built the cadence, templates, and escalation paths our managers needed to run a more consistent service business.', name: 'Marcus Ellison', title: 'Founder, Stonebridge Advisory' }
];
spec.caseStudies = [
  { title: 'Multi-location clinic operating reset', clientType: 'Regional healthcare group', summary: 'Mapped intake, provider handoffs, billing exceptions, and compliance evidence into one operating model for a seven-location clinic group.', outcome: 'Reduced unresolved weekly escalations by 42% and shortened leadership review meetings from two hours to 50 minutes.' },
  { title: 'Premium wellness client journey rebuild', clientType: 'Wellness membership brand', summary: 'Rebuilt onboarding, renewal, service recovery, and manager quality checks for a growing membership-based wellness company.', outcome: 'Improved first-visit completion by 31% and created consistent recovery paths for high-value member issues.' },
  { title: 'Compliance evidence cadence', clientType: 'Professional-services firm', summary: 'Installed control owners, evidence calendars, policy review cycles, and a board-ready compliance dashboard.', outcome: 'Cleared a 90-day evidence backlog and gave executives a repeatable monthly readiness review.' }
];
spec.blogPosts = [
  { title: 'The weekly operating review most teams are missing', category: 'Operating Rhythm', summary: 'A practical agenda for surfacing service risk, capacity pressure, and compliance work before they become executive surprises.' },
  { title: 'How to make compliance ownership visible', category: 'Compliance Readiness', summary: 'Why policy libraries fail without owner maps, evidence calendars, and a clear escalation path for overdue controls.' },
  { title: 'Client experience is an operating system', category: 'Service Design', summary: 'How premium service companies can turn tone, timing, and recovery standards into routines teams can actually run.' }
];
spec.contactIntro = 'Bring us the messy handoffs, the unclear ownership, and the dashboards no one trusts. We will help you decide what needs to be fixed first.';
spec.footerSummary = 'Meridian Strategy Group builds operating systems for regulated service companies that need clearer ownership, stronger compliance routines, and calmer growth.';

const imageFiles = [
  'advisory-work-session.png',
  'leadership-dashboard-review.png',
  'clinic-operations-map.png',
  'compliance-evidence-board.png',
  'client-experience-system.png',
  'process-workshop-table.png',
  'executive-scorecard-detail.png',
  'calm-office-materials.png'
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(relPath, content, base = root) {
  const full = path.isAbsolute(relPath) ? relPath : path.join(base, relPath);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, content.replace(/\r\n/g, '\n'), 'utf8');
}

function writeBin(relPath, buffer, base = root) {
  const full = path.isAbsolute(relPath) ? relPath : path.join(base, relPath);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, buffer);
}

function escHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i];
    for (let k = 0; k < 8; k += 1) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return ~c >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng(width, height, paletteSeed) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  const palettes = [
    [[22, 45, 47], [220, 188, 132], [245, 241, 231]],
    [[31, 56, 73], [118, 162, 164], [247, 244, 236]],
    [[42, 48, 40], [179, 141, 94], [238, 232, 219]],
    [[18, 61, 58], [144, 183, 158], [242, 238, 226]]
  ];
  const colors = palettes[paletteSeed % palettes.length];
  for (let y = 0; y < height; y += 1) {
    const row = y * (width * 3 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x += 1) {
      const idx = row + 1 + x * 3;
      const t = (x / width + y / height) / 2;
      const band = Math.sin((x + paletteSeed * 37) / 34) + Math.cos((y + paletteSeed * 21) / 41);
      const a = colors[0];
      const b = band > 0.45 ? colors[1] : colors[2];
      raw[idx] = Math.round(a[0] * (1 - t) + b[0] * t);
      raw[idx + 1] = Math.round(a[1] * (1 - t) + b[1] * t);
      raw[idx + 2] = Math.round(a[2] * (1 - t) + b[2] * t);
      if ((x + paletteSeed * 19) % 173 < 2 || (y + paletteSeed * 13) % 127 < 2) {
        raw[idx] = Math.min(255, raw[idx] + 34);
        raw[idx + 1] = Math.min(255, raw[idx + 1] + 28);
        raw[idx + 2] = Math.min(255, raw[idx + 2] + 18);
      }
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

function phpImage(folder, name) {
  return `<?php echo esc_url( get_template_directory_uri() . '/assets/images/${folder}/${name}' ); ?>`;
}

const menuJs = `(() => {
  const body = document.body;
  const triggers = Array.from(document.querySelectorAll('[data-menu-item]'));
  const panels = Array.from(document.querySelectorAll('[data-menu-dropdown]'));
  const backdrop = document.querySelector('[data-menu-backdrop]');
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileDrawer = document.querySelector('[data-mobile-drawer]');
  let active = null;

  const setRail = (scope, key) => {
    scope.querySelectorAll('[data-rail-item]').forEach((item) => {
      const on = item.dataset.railItem === key;
      item.classList.toggle('is-active', on);
      item.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    scope.querySelectorAll('[data-rail-content]').forEach((content) => {
      const on = content.dataset.railContent === key;
      content.hidden = !on;
      content.querySelectorAll('a, button, input, textarea, select').forEach((el) => {
        if (on) el.removeAttribute('tabindex');
        else el.setAttribute('tabindex', '-1');
      });
    });
  };

  const closePanels = () => {
    active = null;
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    panels.forEach((panel) => { panel.hidden = true; panel.setAttribute('aria-hidden', 'true'); });
    body.classList.remove('nolan-menu-open');
    if (backdrop) backdrop.hidden = true;
  };

  const openPanel = (key) => {
    closePanels();
    active = key;
    const trigger = triggers.find((item) => item.dataset.menuItem === key);
    const panel = panels.find((item) => item.dataset.menuDropdown === key);
    if (!trigger || !panel) return;
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    body.classList.add('nolan-menu-open');
    if (backdrop) backdrop.hidden = false;
    const firstRail = panel.querySelector('[data-rail-item]');
    if (firstRail) setRail(panel, firstRail.dataset.railItem);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const key = trigger.dataset.menuItem;
      if (active === key) closePanels();
      else openPanel(key);
    });
  });

  panels.forEach((panel) => {
    panel.querySelectorAll('[data-rail-item]').forEach((item) => {
      const update = () => setRail(panel, item.dataset.railItem);
      item.addEventListener('mouseenter', update);
      item.addEventListener('focus', update);
    });
  });

  document.addEventListener('click', (event) => {
    if (!active) return;
    if (event.target.closest('[data-menu-dropdown]') || event.target.closest('[data-menu-item]')) return;
    closePanels();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePanels();
      if (mobileDrawer) {
        mobileDrawer.hidden = true;
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nolan-mobile-open');
      }
    }
  });

  if (backdrop) backdrop.addEventListener('click', closePanels);
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      mobileDrawer.hidden = expanded;
      body.classList.toggle('nolan-mobile-open', !expanded);
      if (backdrop) backdrop.hidden = expanded && !active;
    });
  }
})();`;

const css = `:root {
  --ink: #142b2d;
  --muted: #657270;
  --paper: #f7f3ea;
  --panel: #fffdf7;
  --line: rgba(20,43,45,.16);
  --accent: #b8894f;
  --sage: #7fa69a;
  --deep: #102426;
  --shadow: 0 22px 60px rgba(16,36,38,.14);
}
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: var(--ink); background: var(--paper); line-height: 1.55; }
body.nolan-menu-open, body.nolan-mobile-open { overflow: hidden; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
.screen-reader-text { position: absolute; left: -9999px; }
.skip-link:focus { left: 1rem; top: 1rem; z-index: 10000; background: #fff; padding: .75rem 1rem; }
.nolan-site-header { position: sticky; top: 0; z-index: 1000; background: rgba(255,253,247,.98); border-bottom: 1px solid var(--line); box-shadow: 0 0 0 rgba(0,0,0,0); }
.nolan-site-header.is-scrolled { box-shadow: 0 14px 30px rgba(16,36,38,.08); }
.nolan-header-inner { min-height: 78px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; max-width: 1180px; margin: 0 auto; padding: 0 24px; gap: 20px; }
.nolan-brand { display: inline-flex; align-items: center; gap: 12px; font-weight: 800; letter-spacing: 0; }
.nolan-mark { width: 38px; height: 38px; display: grid; place-items: center; background: var(--deep); color: #fff; border-radius: 4px; }
.nolan-primary-nav { display: flex; align-items: center; gap: 8px; }
.nolan-primary-nav a, .nolan-menu-trigger { border: 0; background: transparent; color: var(--ink); font: inherit; font-weight: 700; padding: 12px 14px; cursor: pointer; border-radius: 4px; }
.nolan-primary-nav a:hover, .nolan-menu-trigger:hover, .nolan-menu-trigger[aria-expanded="true"] { background: #ece4d5; }
.nolan-header-actions { justify-self: end; display: flex; align-items: center; gap: 12px; }
.button, .nolan-header-cta { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 18px; border-radius: 4px; border: 1px solid var(--deep); background: var(--deep); color: #fff; font-weight: 800; }
.button.secondary { background: transparent; color: var(--deep); }
.nolan-mobile-toggle { display: none; border: 1px solid var(--line); background: var(--panel); padding: 10px 12px; border-radius: 4px; }
.nolan-menu-backdrop { position: fixed; inset: 78px 0 0; background: rgba(16,36,38,.28); z-index: 900; }
.nolan-dropdown { position: fixed; left: 50%; top: 78px; transform: translateX(-50%); width: min(1060px, calc(100vw - 32px)); background: var(--panel); border: 1px solid var(--line); box-shadow: var(--shadow); z-index: 1001; border-radius: 8px; padding: 22px; }
.nolan-dropdown-grid { display: grid; grid-template-columns: 280px 1fr; gap: 22px; }
.nolan-rail { display: grid; gap: 8px; align-content: start; }
.nolan-rail button { text-align: left; border: 1px solid var(--line); background: #f6efe2; padding: 12px; border-radius: 4px; color: var(--ink); font-weight: 800; }
.nolan-rail button.is-active, .nolan-rail button:focus-visible { outline: 3px solid rgba(184,137,79,.35); background: #fffaf0; }
.nolan-rail-content { min-height: 190px; padding: 12px 4px; }
.nolan-rail-content h3 { margin: 0 0 8px; font-size: 1.5rem; }
.nolan-mobile-drawer { position: fixed; inset: 78px 0 auto; z-index: 1002; background: var(--panel); border-bottom: 1px solid var(--line); padding: 24px; box-shadow: var(--shadow); }
.nolan-mobile-drawer nav { display: grid; gap: 14px; }
.section { padding: 84px 24px; }
.section.alt { background: #fffaf0; }
.container { max-width: 1180px; margin: 0 auto; }
.eyebrow { color: #80613a; text-transform: uppercase; font-size: .78rem; font-weight: 900; letter-spacing: .08em; }
.hero { padding: 96px 24px 72px; background: linear-gradient(90deg, #f7f3ea 0%, #fffdf7 100%); }
.hero-grid { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 1.04fr .96fr; gap: 44px; align-items: center; }
.hero h1 { font-size: clamp(2.6rem, 6vw, 5.65rem); line-height: .96; margin: 12px 0 20px; letter-spacing: 0; max-width: 850px; }
.hero p { font-size: 1.18rem; color: var(--muted); max-width: 680px; }
.hero-actions, .button-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.hero-card, .proof-card, .service-card, .case-card, .post-card, .testimonial-card, .process-card { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; box-shadow: 0 12px 28px rgba(16,36,38,.06); }
.hero-card { padding: 16px; }
.hero-card img { border-radius: 6px; aspect-ratio: 4 / 3; object-fit: cover; }
.grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 22px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 18px; }
.service-card, .case-card, .post-card, .testimonial-card, .process-card, .proof-card { padding: 24px; }
.service-card img, .case-card img, .post-card img { border-radius: 6px; margin-bottom: 18px; aspect-ratio: 16 / 10; object-fit: cover; }
.metric-value { display: block; font-size: 2.15rem; font-weight: 900; color: var(--deep); }
.section-heading { display: flex; justify-content: space-between; gap: 24px; align-items: end; margin-bottom: 32px; }
.section-heading h2 { font-size: clamp(2rem, 4vw, 3.4rem); line-height: 1; margin: 0; max-width: 760px; }
.section-heading p { color: var(--muted); max-width: 420px; }
.page-hero { padding: 86px 24px 54px; background: #fffaf0; border-bottom: 1px solid var(--line); }
.page-hero h1 { margin: 0; font-size: clamp(2.4rem, 5vw, 4.75rem); line-height: 1; }
.form-grid { display: grid; gap: 14px; }
label { font-weight: 800; display: grid; gap: 6px; }
input, textarea, select { width: 100%; border: 1px solid var(--line); border-radius: 4px; padding: 12px; font: inherit; background: #fff; }
textarea { min-height: 140px; }
.site-footer { background: var(--deep); color: #f7f3ea; padding: 54px 24px; }
.footer-grid { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 1.4fr repeat(3, 1fr); gap: 28px; }
.site-footer a { color: #f7f3ea; display: block; margin: 6px 0; }
:focus-visible { outline: 3px solid rgba(184,137,79,.55); outline-offset: 3px; }
@media (max-width: 860px) {
  .nolan-header-inner { grid-template-columns: 1fr auto; }
  .nolan-primary-nav, .nolan-header-cta { display: none; }
  .nolan-mobile-toggle { display: inline-flex; }
  .hero-grid, .grid-2, .grid-3, .grid-4, .footer-grid { grid-template-columns: 1fr; }
  .nolan-dropdown { display: none; }
  .section-heading { display: block; }
}`;

const headerPhp = `<?php
/**
 * Theme header.
 *
 * @package Nolan_Showcase_Theme_01
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
<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', '001_nolan_young_theme_meridian_strategy_group' ); ?></a>
<header class="nolan-site-header" data-site-header>
  <div class="nolan-header-inner">
    <a class="nolan-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
      <span class="nolan-mark">MS</span>
      <span>Meridian Strategy Group</span>
    </a>
    <nav class="nolan-primary-nav" aria-label="<?php esc_attr_e( 'Primary navigation', '001_nolan_young_theme_meridian_strategy_group' ); ?>">
      <button class="nolan-menu-trigger" type="button" data-menu-item="services" aria-controls="nolan-menu-services" aria-expanded="false">Services</button>
      <button class="nolan-menu-trigger" type="button" data-menu-item="about" aria-controls="nolan-menu-about" aria-expanded="false">About</button>
      <a href="<?php echo esc_url( home_url( '/work/' ) ); ?>">Work</a>
      <button class="nolan-menu-trigger" type="button" data-menu-item="blog" aria-controls="nolan-menu-blog" aria-expanded="false">Blog</button>
    </nav>
    <div class="nolan-header-actions">
      <a class="nolan-header-cta" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a>
      <button class="nolan-mobile-toggle" type="button" data-mobile-toggle aria-controls="nolan-mobile-drawer" aria-expanded="false">Menu</button>
    </div>
  </div>
  <div class="nolan-menu-backdrop" data-menu-backdrop hidden></div>
  <?php get_template_part( 'template-parts/content', 'mega-menu' ); ?>
  <div class="nolan-mobile-drawer" id="nolan-mobile-drawer" data-mobile-drawer hidden>
    <nav aria-label="<?php esc_attr_e( 'Mobile navigation', '001_nolan_young_theme_meridian_strategy_group' ); ?>">
      <a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Services</a>
      <a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>">About</a>
      <a href="<?php echo esc_url( home_url( '/work/' ) ); ?>">Work</a>
      <a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Blog</a>
      <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a>
    </nav>
  </div>
</header>
<main id="primary" class="site-main">`;

const footerPhp = `</main>
<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <p class="eyebrow">Meridian Strategy Group</p>
      <p>${escHtml(spec.footerSummary)}</p>
    </div>
    <div><h3>Services</h3><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Operating Model</a><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Compliance Readiness</a><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Client Systems</a></div>
    <div><h3>Company</h3><a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>">About</a><a href="<?php echo esc_url( home_url( '/work/' ) ); ?>">Work</a><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Blog</a></div>
    <div><h3>Contact</h3><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Book a readiness call</a><p>Chicago / Remote advisory</p></div>
  </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>`;

const megaMenuPhp = `<div class="nolan-dropdown" id="nolan-menu-services" data-menu-dropdown="services" aria-hidden="true" hidden>
  <div class="nolan-dropdown-grid">
    <div class="nolan-rail" role="tablist" aria-label="Services menu">
      <button type="button" data-rail-item="model" aria-selected="true">Operating Model</button>
      <button type="button" data-rail-item="compliance" aria-selected="false">Compliance Readiness</button>
      <button type="button" data-rail-item="experience" aria-selected="false">Client Systems</button>
    </div>
    <div>
      <section class="nolan-rail-content" data-rail-content="model"><h3>Operating Model Design</h3><p>Install ownership, handoff rules, and leadership cadence before growth adds more noise.</p><a class="button" href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Explore services</a></section>
      <section class="nolan-rail-content" data-rail-content="compliance" hidden><h3>Compliance Readiness</h3><p>Turn evidence, policy review, and remediation into repeatable operating routines.</p><a class="button" href="<?php echo esc_url( home_url( '/services/' ) ); ?>">See readiness work</a></section>
      <section class="nolan-rail-content" data-rail-content="experience" hidden><h3>Client Experience Systems</h3><p>Make premium service standards visible, teachable, and measurable across teams.</p><a class="button" href="<?php echo esc_url( home_url( '/single-service/' ) ); ?>">View service detail</a></section>
    </div>
  </div>
</div>
<div class="nolan-dropdown" id="nolan-menu-about" data-menu-dropdown="about" aria-hidden="true" hidden>
  <div class="nolan-dropdown-grid">
    <div class="nolan-rail"><button type="button" data-rail-item="firm" aria-selected="true">The Firm</button><button type="button" data-rail-item="principles" aria-selected="false">Principles</button></div>
    <div><section class="nolan-rail-content" data-rail-content="firm"><h3>Senior operators for serious service teams</h3><p>We combine compliance discipline with practical service-design work.</p><a class="button" href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>">Meet Meridian</a></section><section class="nolan-rail-content" data-rail-content="principles" hidden><h3>Calm systems, clear owners</h3><p>Every engagement leaves behind routines a client team can keep running.</p><a class="button" href="<?php echo esc_url( home_url( '/work/' ) ); ?>">Review outcomes</a></section></div>
  </div>
</div>
<div class="nolan-dropdown" id="nolan-menu-blog" data-menu-dropdown="blog" aria-hidden="true" hidden>
  <div class="nolan-dropdown-grid">
    <div class="nolan-rail"><button type="button" data-rail-item="latest" aria-selected="true">Latest</button><button type="button" data-rail-item="guides" aria-selected="false">Guides</button></div>
    <div><section class="nolan-rail-content" data-rail-content="latest"><h3>Operating notes for regulated growth</h3><p>Field-tested thinking on ownership, compliance, dashboards, and client experience.</p><a class="button" href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Read resources</a></section><section class="nolan-rail-content" data-rail-content="guides" hidden><h3>Practical leadership guides</h3><p>Short frameworks leaders can use in the next operating review.</p><a class="button" href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Browse guides</a></section></div>
  </div>
</div>`;

function serviceCardsPhp() {
  return spec.services.map((service, index) => `<article class="service-card">
  <img src="${phpImage(index === 0 ? 'portfolio' : index === 1 ? 'hero' : 'texture', imageFiles[(index + 1) % imageFiles.length])}" alt="">
  <p class="eyebrow">${escHtml(service.kicker)}</p>
  <h3>${escHtml(service.title)}</h3>
  <p>${escHtml(service.summary)}</p>
  <a class="button secondary" href="<?php echo esc_url( home_url( '/single-service/' ) ); ?>">View service detail</a>
</article>`).join('\n');
}

function homeSectionsPhp() {
  return `<section class="hero">
  <div class="hero-grid">
    <div>
      <p class="eyebrow">${escHtml(spec.tagline)}</p>
      <h1>${escHtml(spec.heroHeadline)}</h1>
      <p>${escHtml(spec.heroCopy)}</p>
      <div class="hero-actions"><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Book a readiness call</a><a class="button secondary" href="<?php echo esc_url( home_url( '/services/' ) ); ?>">View service model</a></div>
    </div>
    <div class="hero-card"><img src="${phpImage('hero', imageFiles[0])}" alt=""></div>
  </div>
</section>
<section class="section"><div class="container"><div class="section-heading"><h2>Advisory built for operators who need the business to run cleaner.</h2><p>Meridian installs the practical systems behind premium service, compliance confidence, and calmer executive decisions.</p></div><div class="grid-4">${serviceCardsPhp()}</div></div></section>
<section class="section alt"><div class="container"><div class="grid-4">${spec.metrics.map((metric) => `<article class="proof-card"><span class="metric-value">${escHtml(metric.value)}</span><p>${escHtml(metric.label)}</p></article>`).join('')}</div></div></section>
<section class="section"><div class="container"><div class="section-heading"><h2>Recent operating work</h2><p>Proof points from service teams that needed sharper ownership and steadier growth.</p></div><div class="grid-3">${caseCardsPhp()}</div></div></section>
<section class="section alt"><div class="container"><div class="section-heading"><h2>A process that leaves your team stronger.</h2><p>Every engagement is designed around adoption, not presentation theater.</p></div><div class="grid-4">${processCardsPhp()}</div></div></section>
<section class="section"><div class="container"><div class="grid-3">${testimonialCardsPhp()}</div></div></section>
<section class="section alt"><div class="container"><div class="section-heading"><h2>Resource notes for operating leaders</h2><a class="button secondary" href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Read the journal</a></div><div class="grid-3">${postCardsPhp()}</div></div></section>
<section class="section"><div class="container"><div class="proof-card"><p class="eyebrow">Next step</p><h2>Bring the operating questions your dashboard cannot answer.</h2><p>${escHtml(spec.contactIntro)}</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a></div></div></section>`;
}

function caseCardsPhp() {
  return spec.caseStudies.map((item, index) => `<article class="case-card"><img src="${phpImage('portfolio', imageFiles[(index + 2) % imageFiles.length])}" alt=""><p class="eyebrow">${escHtml(item.clientType)}</p><h3>${escHtml(item.title)}</h3><p>${escHtml(item.summary)}</p><strong>${escHtml(item.outcome)}</strong></article>`).join('');
}

function processCardsPhp() {
  return spec.process.map((item) => `<article class="process-card"><p class="eyebrow">${escHtml(item.step)}</p><p>${escHtml(item.description)}</p></article>`).join('');
}

function testimonialCardsPhp() {
  return spec.testimonials.map((item) => `<blockquote class="testimonial-card"><p>"${escHtml(item.quote)}"</p><cite>${escHtml(item.name)}<br>${escHtml(item.title)}</cite></blockquote>`).join('');
}

function postCardsPhp() {
  return spec.blogPosts.map((item, index) => `<article class="post-card"><img src="${phpImage('texture', imageFiles[(index + 4) % imageFiles.length])}" alt=""><p class="eyebrow">${escHtml(item.category)}</p><h3>${escHtml(item.title)}</h3><p>${escHtml(item.summary)}</p><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Read article</a></article>`).join('');
}

function pageHero(title, copy) {
  return `<section class="page-hero"><div class="container"><p class="eyebrow">Meridian Strategy Group</p><h1>${escHtml(title)}</h1><p>${escHtml(copy)}</p></div></section>`;
}

function previewHeader(activeTitle) {
  return `<header class="nolan-site-header" data-site-header>
  <div class="nolan-header-inner">
    <a class="nolan-brand" href="homepage_preview.html"><span class="nolan-mark">MS</span><span>Meridian Strategy Group</span></a>
    <nav class="nolan-primary-nav" aria-label="Primary navigation">
      <button class="nolan-menu-trigger" type="button" data-menu-item="services" aria-controls="preview-menu-services" aria-expanded="false">Services</button>
      <button class="nolan-menu-trigger" type="button" data-menu-item="about" aria-controls="preview-menu-about" aria-expanded="false">About</button>
      <a href="work_preview.html">Work</a>
      <button class="nolan-menu-trigger" type="button" data-menu-item="blog" aria-controls="preview-menu-blog" aria-expanded="false">Blog</button>
    </nav>
    <div class="nolan-header-actions"><a class="nolan-header-cta" href="contact_preview.html">Contact Us</a><button class="nolan-mobile-toggle" type="button" data-mobile-toggle aria-controls="preview-mobile-drawer" aria-expanded="false">Menu</button></div>
  </div>
  <div class="nolan-menu-backdrop" data-menu-backdrop hidden></div>
  ${previewMegaMenu()}
  <div class="nolan-mobile-drawer" id="preview-mobile-drawer" data-mobile-drawer hidden><nav><a href="homepage_preview.html">Home</a><a href="services_preview.html">Services</a><a href="about-us_preview.html">About</a><a href="work_preview.html">Work</a><a href="blog_preview.html">Blog</a><a href="contact_preview.html">Contact Us</a><a href="single_services_preview.html">Service detail</a></nav></div>
</header>`;
}

function previewMegaMenu() {
  return `<div class="nolan-dropdown" id="preview-menu-services" data-menu-dropdown="services" aria-hidden="true" hidden><div class="nolan-dropdown-grid"><div class="nolan-rail"><button type="button" data-rail-item="model" aria-selected="true">Operating Model</button><button type="button" data-rail-item="compliance" aria-selected="false">Compliance</button><button type="button" data-rail-item="experience" aria-selected="false">Client Systems</button></div><div><section class="nolan-rail-content" data-rail-content="model"><h3>Operating Model Design</h3><p>Install the ownership and cadence your next stage needs.</p><a class="button" href="services_preview.html">Explore services</a></section><section class="nolan-rail-content" data-rail-content="compliance" hidden><h3>Compliance Readiness</h3><p>Evidence routines, owner maps, and executive visibility.</p><a class="button" href="single_services_preview.html">Service detail</a></section><section class="nolan-rail-content" data-rail-content="experience" hidden><h3>Client Experience Systems</h3><p>Premium service standards your team can run consistently.</p><a class="button" href="single_services_preview.html">View system</a></section></div></div></div>
<div class="nolan-dropdown" id="preview-menu-about" data-menu-dropdown="about" aria-hidden="true" hidden><div class="nolan-dropdown-grid"><div class="nolan-rail"><button type="button" data-rail-item="firm" aria-selected="true">The Firm</button><button type="button" data-rail-item="principles" aria-selected="false">Principles</button></div><div><section class="nolan-rail-content" data-rail-content="firm"><h3>Senior operating advisors</h3><p>Built for regulated service companies with real execution pressure.</p><a class="button" href="about-us_preview.html">About Meridian</a></section><section class="nolan-rail-content" data-rail-content="principles" hidden><h3>Calm systems, clear owners</h3><p>Every recommendation is designed to survive normal operating weeks.</p><a class="button" href="work_preview.html">See work</a></section></div></div></div>
<div class="nolan-dropdown" id="preview-menu-blog" data-menu-dropdown="blog" aria-hidden="true" hidden><div class="nolan-dropdown-grid"><div class="nolan-rail"><button type="button" data-rail-item="latest" aria-selected="true">Latest</button><button type="button" data-rail-item="guides" aria-selected="false">Guides</button></div><div><section class="nolan-rail-content" data-rail-content="latest"><h3>Operating notes</h3><p>Short essays for leaders running regulated growth.</p><a class="button" href="blog_preview.html">Read resources</a></section><section class="nolan-rail-content" data-rail-content="guides" hidden><h3>Leadership guides</h3><p>Practical frameworks for your next review.</p><a class="button" href="blog_preview.html">Browse guides</a></section></div></div></div>`;
}

function previewShell(title, main) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escHtml(title)} | Meridian Strategy Group</title>
  <link rel="stylesheet" href="assets/css/preview.css">
</head>
<body>
  ${previewHeader(title)}
  <main id="primary">${main}</main>
  ${previewFooter()}
  <script src="assets/js/preview.js"></script>
</body>
</html>`;
}

function previewFooter() {
  return `<footer class="site-footer"><div class="footer-grid"><div><p class="eyebrow">Meridian Strategy Group</p><p>${escHtml(spec.footerSummary)}</p></div><div><h3>Services</h3><a href="services_preview.html">Services</a><a href="single_services_preview.html">Service detail</a></div><div><h3>Company</h3><a href="about-us_preview.html">About</a><a href="work_preview.html">Work</a><a href="blog_preview.html">Blog</a></div><div><h3>Contact</h3><a href="contact_preview.html">Contact Us</a><a href="homepage_preview.html">Home</a></div></div></footer>`;
}

function previewImg(name) {
  return `assets/images/${name}`;
}

function serviceCardsHtml() {
  return spec.services.map((service, index) => `<article class="service-card"><img src="${previewImg(imageFiles[(index + 1) % imageFiles.length])}" alt=""><p class="eyebrow">${escHtml(service.kicker)}</p><h3>${escHtml(service.title)}</h3><p>${escHtml(service.summary)}</p><a class="button secondary" href="single_services_preview.html">View service detail</a></article>`).join('');
}

function caseCardsHtml() {
  return spec.caseStudies.map((item, index) => `<article class="case-card"><img src="${previewImg(imageFiles[(index + 2) % imageFiles.length])}" alt=""><p class="eyebrow">${escHtml(item.clientType)}</p><h3>${escHtml(item.title)}</h3><p>${escHtml(item.summary)}</p><strong>${escHtml(item.outcome)}</strong></article>`).join('');
}

function postCardsHtml() {
  return spec.blogPosts.map((item, index) => `<article class="post-card"><img src="${previewImg(imageFiles[(index + 4) % imageFiles.length])}" alt=""><p class="eyebrow">${escHtml(item.category)}</p><h3>${escHtml(item.title)}</h3><p>${escHtml(item.summary)}</p><a href="blog_preview.html">Read article</a></article>`).join('');
}

function processCardsHtml() {
  return spec.process.map((item) => `<article class="process-card"><p class="eyebrow">${escHtml(item.step)}</p><p>${escHtml(item.description)}</p></article>`).join('');
}

function testimonialsHtml() {
  return spec.testimonials.map((item) => `<blockquote class="testimonial-card"><p>"${escHtml(item.quote)}"</p><cite>${escHtml(item.name)}<br>${escHtml(item.title)}</cite></blockquote>`).join('');
}

function homeHtml() {
  return `<section class="hero"><div class="hero-grid"><div><p class="eyebrow">${escHtml(spec.tagline)}</p><h1>${escHtml(spec.heroHeadline)}</h1><p>${escHtml(spec.heroCopy)}</p><div class="hero-actions"><a class="button" href="contact_preview.html">Book a readiness call</a><a class="button secondary" href="services_preview.html">View service model</a></div></div><div class="hero-card"><img src="${previewImg(imageFiles[0])}" alt=""></div></div></section>
<section class="section"><div class="container"><div class="section-heading"><h2>Advisory built for operators who need the business to run cleaner.</h2><p>Meridian installs the systems behind premium service and calmer growth.</p></div><div class="grid-4">${serviceCardsHtml()}</div></div></section>
<section class="section alt"><div class="container"><div class="grid-4">${spec.metrics.map((metric) => `<article class="proof-card"><span class="metric-value">${escHtml(metric.value)}</span><p>${escHtml(metric.label)}</p></article>`).join('')}</div></div></section>
<section class="section"><div class="container"><div class="section-heading"><h2>Recent operating work</h2><p>Proof points from teams that needed sharper ownership.</p></div><div class="grid-3">${caseCardsHtml()}</div></div></section>
<section class="section alt"><div class="container"><div class="section-heading"><h2>A process that leaves your team stronger.</h2><p>Every engagement is designed around adoption.</p></div><div class="grid-4">${processCardsHtml()}</div></div></section>
<section class="section"><div class="container"><div class="grid-3">${testimonialsHtml()}</div></div></section>
<section class="section alt"><div class="container"><div class="section-heading"><h2>Resource notes for operating leaders</h2><a class="button secondary" href="blog_preview.html">Read the journal</a></div><div class="grid-3">${postCardsHtml()}</div></div></section>
<section class="section"><div class="container"><div class="proof-card"><p class="eyebrow">Next step</p><h2>Bring the operating questions your dashboard cannot answer.</h2><p>${escHtml(spec.contactIntro)}</p><a class="button" href="contact_preview.html">Contact Us</a></div></div></section>`;
}

function writeTheme() {
  write(`${themeDir}/style.css`, `/*
Theme Name: Nolan Young Theme 001 - Meridian Strategy Group
Theme URI: https://nolan.local/
Author: Nolan Young
Description: Premium classic WordPress theme for Meridian Strategy Group, an operations and compliance consulting firm.
Version: 1.0.0
License: GPL-2.0-or-later
Text Domain: 001_nolan_young_theme_meridian_strategy_group
*/`);
  write(`${themeDir}/functions.php`, `<?php
/**
 * Theme bootstrap.
 *
 * @package Nolan_Showcase_Theme_01
 */

require_once get_template_directory() . '/inc/setup.php';
require_once get_template_directory() . '/inc/enqueue.php';
require_once get_template_directory() . '/inc/template-tags.php';
require_once get_template_directory() . '/inc/helpers.php';
require_once get_template_directory() . '/inc/custom-post-types.php';
require_once get_template_directory() . '/inc/customizer.php';
require_once get_template_directory() . '/inc/forms.php';
require_once get_template_directory() . '/inc/newsletter.php';
require_once get_template_directory() . '/inc/policy-routing.php';
`);
  write(`${themeDir}/theme.json`, JSON.stringify({ version: 2, settings: { color: { palette: [{ slug: 'ink', color: '#142b2d', name: 'Ink' }, { slug: 'accent', color: '#b8894f', name: 'Accent' }] } } }, null, 2));
  write(`${themeDir}/README.md`, `# Nolan Young Theme 001 - Meridian Strategy Group\n\nA premium classic WordPress theme for Meridian Strategy Group.\n\n## Build\n\nRun \`npm install\` and \`npm run build\` from this theme directory.\n`);
  write(`${themeDir}/.editorconfig`, `root = true\n[*]\ncharset = utf-8\nend_of_line = lf\ninsert_final_newline = true\nindent_style = space\nindent_size = 2\n`);
  write(`${themeDir}/.gitignore`, `node_modules/\n.DS_Store\n*.log\n`);
  write(`${themeDir}/header.php`, headerPhp);
  write(`${themeDir}/footer.php`, footerPhp);
  write(`${themeDir}/front-page.php`, `<?php get_header(); ?>\n<?php\n/* Template map: content-home-hero, content-home-services, content-home-work, content-home-process, content-home-testimonials, content-home-cta. */\n?>\n<?php get_template_part( 'template-parts/content', 'home-hero' ); ?>\n<?php get_template_part( 'template-parts/content', 'home-services' ); ?>\n<?php get_template_part( 'template-parts/content', 'home-work' ); ?>\n<?php get_template_part( 'template-parts/content', 'home-process' ); ?>\n<?php get_template_part( 'template-parts/content', 'home-testimonials' ); ?>\n<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>\n<?php get_template_part( 'template-parts/content', 'home-cta' ); ?>\n<?php get_footer(); ?>\n`);
  ['index', 'page', 'single', 'archive', 'search'].forEach((name) => write(`${themeDir}/${name}.php`, `<?php get_header(); ?>\n<section class="section"><div class="container"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', '${name === 'search' ? 'search' : name === 'single' ? 'single' : 'page'}' ); endwhile; else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div></section>\n<?php get_footer(); ?>\n`));
  write(`${themeDir}/searchform.php`, `<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>"><label><span class="screen-reader-text"><?php esc_html_e( 'Search for:', '001_nolan_young_theme_meridian_strategy_group' ); ?></span><input type="search" class="search-field" value="<?php echo esc_attr( get_search_query() ); ?>" name="s"></label><button class="button" type="submit"><?php esc_html_e( 'Search', '001_nolan_young_theme_meridian_strategy_group' ); ?></button></form>\n`);
  write(`${themeDir}/404.php`, `<?php get_header(); ?>${pageHero('Page not found', 'The resource may have moved. Use the navigation to continue exploring Meridian Strategy Group.')}<?php get_footer(); ?>\n`);
  write(`${themeDir}/403.php`, `<?php get_header(); ?>${pageHero('Access restricted', 'This resource is not available for public viewing.')}<?php get_footer(); ?>\n`);
  write(`${themeDir}/comments.php`, `<?php if ( post_password_required() ) { return; } ?><section class="comments-area"><h2><?php esc_html_e( 'Discussion', '001_nolan_young_theme_meridian_strategy_group' ); ?></h2><?php comment_form(); ?></section>\n`);
  write(`${themeDir}/LICENSE.txt`, `GPL-2.0-or-later\n\nThis generated theme is intended for WordPress distribution compatibility.\n`);
  write(`${themeDir}/CHANGELOG.md`, `# Changelog\n\n## 1.0.0\n\n- Initial Ollama baseline theme for Meridian Strategy Group.\n`);
  write(`${themeDir}/package.json`, JSON.stringify({ name: slug, version: '1.0.0', scripts: { build: 'node build/webpack.config.js' }, dependencies: {}, devDependencies: {} }, null, 2));
  write(`${themeDir}/package-lock.json`, JSON.stringify({ name: slug, version: '1.0.0', lockfileVersion: 3, requires: true, packages: { '': { name: slug, version: '1.0.0' } } }, null, 2));

  write(`${themeDir}/inc/setup.php`, `<?php\nfunction nolan_showcase_theme_01_setup() {\n  add_theme_support( 'title-tag' );\n  add_theme_support( 'post-thumbnails' );\n  add_theme_support( 'html5', array( 'search-form', 'comment-form', 'gallery', 'caption', 'style', 'script' ) );\n  register_nav_menus( array( 'primary' => esc_html__( 'Primary Menu', '001_nolan_young_theme_meridian_strategy_group' ) ) );\n}\nadd_action( 'after_setup_theme', 'nolan_showcase_theme_01_setup' );\n`);
  write(`${themeDir}/inc/enqueue.php`, `<?php\nfunction nolan_showcase_theme_01_enqueue_assets() {\n  $css = get_template_directory() . '/assets/css/bundle.css';\n  $js = get_template_directory() . '/assets/js/bundle.js';\n  wp_enqueue_style( '001_nolan_young_theme_meridian_strategy_group', get_template_directory_uri() . '/assets/css/bundle.css', array(), file_exists( $css ) ? filemtime( $css ) : '1.0.0' );\n  wp_enqueue_script( '001_nolan_young_theme_meridian_strategy_group', get_template_directory_uri() . '/assets/js/bundle.js', array(), file_exists( $js ) ? filemtime( $js ) : '1.0.0', true );\n}\nadd_action( 'wp_enqueue_scripts', 'nolan_showcase_theme_01_enqueue_assets' );\n`);
  write(`${themeDir}/inc/template-tags.php`, `<?php\nfunction nolan_showcase_theme_01_posted_on() {\n  echo '<span class="posted-on">' . esc_html( get_the_date() ) . '</span>';\n}\n`);
  write(`${themeDir}/inc/helpers.php`, `<?php\nfunction nolan_showcase_theme_01_asset_uri( $path ) {\n  return esc_url( get_template_directory_uri() . '/assets/' . ltrim( $path, '/' ) );\n}\n`);
  write(`${themeDir}/inc/custom-post-types.php`, `<?php\nfunction nolan_showcase_theme_01_register_work_type() {\n  register_post_type( 'meridian_work', array( 'public' => true, 'label' => esc_html__( 'Work', '001_nolan_young_theme_meridian_strategy_group' ), 'supports' => array( 'title', 'editor', 'thumbnail' ) ) );\n}\nadd_action( 'init', 'nolan_showcase_theme_01_register_work_type' );\n`);
  write(`${themeDir}/inc/customizer.php`, `<?php\nfunction nolan_showcase_theme_01_customize_register( $wp_customize ) {\n  $wp_customize->add_section( 'meridian_brand', array( 'title' => esc_html__( 'Meridian Brand', '001_nolan_young_theme_meridian_strategy_group' ) ) );\n}\nadd_action( 'customize_register', 'nolan_showcase_theme_01_customize_register' );\n`);
  write(`${themeDir}/inc/forms.php`, `<?php\nfunction nolan_showcase_theme_01_sanitize_message( $message ) {\n  return sanitize_textarea_field( $message );\n}\n`);
  write(`${themeDir}/inc/newsletter.php`, `<?php\nfunction nolan_showcase_theme_01_sanitize_signup_email( $email ) {\n  return sanitize_email( $email );\n}\n`);
  write(`${themeDir}/inc/policy-routing.php`, `<?php\nfunction nolan_showcase_theme_01_policy_title() {\n  return esc_html__( 'Policy Information', '001_nolan_young_theme_meridian_strategy_group' );\n}\n`);

  const rootTemplateParts = {
    'content-mega-menu.php': megaMenuPhp,
    'content-page.php': `<article <?php post_class(); ?>><h1><?php the_title(); ?></h1><div><?php the_content(); ?></div></article>`,
    'content-single.php': `<article <?php post_class(); ?>><h1><?php the_title(); ?></h1><?php nolan_showcase_theme_01_posted_on(); ?><div><?php the_content(); ?></div></article>`,
    'content-none.php': `<div class="proof-card"><h2><?php esc_html_e( 'No matching resources found', '001_nolan_young_theme_meridian_strategy_group' ); ?></h2><p><?php esc_html_e( 'Try a different search or return to the service overview.', '001_nolan_young_theme_meridian_strategy_group' ); ?></p></div>`,
    'content-policy.php': `<section class="section"><div class="container"><h1><?php echo esc_html( nolan_showcase_theme_01_policy_title() ); ?></h1><p>Meridian Strategy Group keeps policy language clear, operational, and aligned with the way service teams work.</p></div></section>`,
    'content-search.php': `<article <?php post_class(); ?>><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><div><?php the_excerpt(); ?></div></article>`,
    'content-hero.php': pageHero('Operating clarity for regulated growth', spec.heroCopy),
    'content-brand-statement.php': `<section class="section alt"><div class="container"><h2>Calm systems, clear owners, stronger service.</h2><p>${escHtml(spec.heroCopy)}</p></div></section>`,
    'content-featured-work.php': `<section class="section"><div class="container"><div class="grid-3">${caseCardsPhp()}</div></div></section>`,
    'content-all-services.php': `<section class="section"><div class="container"><div class="grid-4">${serviceCardsPhp()}</div></div></section>`,
    'content-single-service-highlight.php': pageHero('Operating Model Design', spec.services[0].detail),
    'content-process.php': `<section class="section alt"><div class="container"><div class="grid-4">${processCardsPhp()}</div></div></section>`,
    'content-style-pillars.php': `<section class="section"><div class="container"><div class="grid-3"><article class="proof-card"><h3>Specific</h3><p>Every recommendation names an owner, cadence, and operating artifact.</p></article><article class="proof-card"><h3>Senior</h3><p>The work is designed for leaders making decisions under pressure.</p></article><article class="proof-card"><h3>Usable</h3><p>Tools are built for weekly management, not shelfware.</p></article></div></div></section>`,
    'content-testimonials.php': `<section class="section"><div class="container"><div class="grid-3">${testimonialCardsPhp()}</div></div></section>`,
    'content-blog-preview.php': `<section class="section alt"><div class="container"><div class="grid-3">${postCardsPhp()}</div></div></section>`,
    'content-cta-banner.php': `<section class="section"><div class="container"><div class="proof-card"><h2>Ready to make the operating system visible?</h2><p>${escHtml(spec.contactIntro)}</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a></div></div></section>`,
    'content-footer-widgets.php': `<div class="footer-grid"><p>${escHtml(spec.footerSummary)}</p></div>`,
    'content-home-hero.php': homeSectionsPhp().split('<section class="section"><div class="container"><div class="section-heading"><h2>Advisory')[0],
    'content-home-services.php': `<section class="section"><div class="container"><div class="section-heading"><h2>Advisory built for operators who need the business to run cleaner.</h2><p>Meridian installs the practical systems behind premium service, compliance confidence, and calmer executive decisions.</p></div><div class="grid-4">${serviceCardsPhp()}</div></div></section>`,
    'content-home-work.php': `<section class="section alt"><div class="container"><div class="grid-4">${spec.metrics.map((metric) => `<article class="proof-card"><span class="metric-value">${escHtml(metric.value)}</span><p>${escHtml(metric.label)}</p></article>`).join('')}</div></div></section><section class="section"><div class="container"><div class="section-heading"><h2>Recent operating work</h2><p>Proof points from service teams that needed sharper ownership and steadier growth.</p></div><div class="grid-3">${caseCardsPhp()}</div></div></section>`,
    'content-home-process.php': `<section class="section alt"><div class="container"><div class="section-heading"><h2>A process that leaves your team stronger.</h2><p>Every engagement is designed around adoption, not presentation theater.</p></div><div class="grid-4">${processCardsPhp()}</div></div></section>`,
    'content-home-testimonials.php': `<section class="section"><div class="container"><div class="grid-3">${testimonialCardsPhp()}</div></div></section>`,
    'content-home-cta.php': `<section class="section"><div class="container"><div class="proof-card"><p class="eyebrow">Next step</p><h2>Bring the operating questions your dashboard cannot answer.</h2><p>${escHtml(spec.contactIntro)}</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a></div></div></section>`,
    'content-services.php': `${pageHero('Services for regulated growth', 'Four connected advisory tracks for service companies that need stronger systems before the next stage of scale.')}<section class="section"><div class="container"><div class="grid-4">${serviceCardsPhp()}</div></div></section>`,
    'content-about.php': `${pageHero('Senior operating counsel for serious service teams', 'Meridian works with leaders who need more than advice. They need routines, artifacts, and ownership that hold up in busy weeks.')}<section class="section"><div class="container"><div class="grid-3"><article class="proof-card"><h3>Operator-led</h3><p>We work from the realities of service delivery, staffing pressure, and compliance responsibility.</p></article><article class="proof-card"><h3>Evidence-minded</h3><p>Controls and policies are connected to proof, review, and issue ownership.</p></article><article class="proof-card"><h3>Calm by design</h3><p>The goal is fewer surprises, cleaner decisions, and less executive drag.</p></article></div></div></section>`,
    'content-work.php': `${pageHero('Work that turns pressure into operating clarity', 'Representative engagements across healthcare, wellness, and professional-services teams.')}<section class="section"><div class="container"><div class="grid-3">${caseCardsPhp()}</div></div></section>`,
    'content-contact.php': `${pageHero('Start with the operating friction', spec.contactIntro)}<section class="section"><div class="container grid-2"><form class="proof-card form-grid"><label>Name<input type="text" name="name"></label><label>Email<input type="email" name="email"></label><label>Company<select name="company-stage"><option>Multi-location service company</option><option>Regulated professional-services team</option><option>Founder-led growth business</option></select></label><label>What needs attention?<textarea name="message"></textarea></label><button class="button" type="submit">Request consultation</button></form><div class="proof-card"><h2>Good fit signals</h2><p>Your team has real demand, but ownership, compliance evidence, service standards, or reporting cadence are creating drag.</p><p>Remote advisory with focused onsite workshops when the work requires it.</p></div></div></section>`,
    'content-blog.php': `${pageHero('Operating notes', 'Brief field notes for leaders improving regulated service companies.')}<section class="section"><div class="container"><div class="grid-3">${postCardsPhp()}</div></div></section>`,
    'content-single-service.php': `${pageHero('Operating Model Design', spec.services[0].detail)}<section class="section"><div class="container grid-2"><div><h2>What gets built</h2><ul><li>Ownership map and decision rights</li><li>Handoff standards across departments</li><li>Weekly operating review agenda</li><li>Escalation and quality review path</li></ul></div><div class="proof-card"><h3>Best for</h3><p>Teams where growth has made informal coordination too expensive and too risky.</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Discuss this service</a></div></div></section>`
  };
  Object.entries(rootTemplateParts).forEach(([file, content]) => write(`${themeDir}/template-parts/${file}`, content + '\n'));

  const templates = {
    'template-about-us.php': ['About Us', 'about'],
    'template-services.php': ['Services', 'services'],
    'template-single-service.php': ['Single Service', 'single-service'],
    'template-work.php': ['Work', 'work'],
    'template-blog.php': ['Blog', 'blog'],
    'template-contact.php': ['Contact', 'contact'],
    'template-policy.php': ['Policy', 'policy']
  };
  Object.entries(templates).forEach(([file, data]) => write(`${themeDir}/page-templates/${file}`, `<?php\n/**\n * Template Name: ${data[0]}\n */\nget_header();\nget_template_part( 'template-parts/content', '${data[1]}' );\nget_footer();\n`));

  write(`${themeDir}/assets/css/bundle.css`, css);
  write(`${themeDir}/assets/js/bundle.js`, menuJs);
  write(`${themeDir}/assets/icons/icon1.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img"><rect width="64" height="64" rx="8" fill="#142b2d"/><path d="M16 44V20h7l9 13 9-13h7v24h-7V31L32 44 23 31v13z" fill="#f7f3ea"/></svg>\n`);
  write(`${themeDir}/assets/icons/README.md`, `# Icons\n\nLocal SVG icons created for this generated theme.\n`);
  write(`${themeDir}/src/js/main.js`, menuJs);
  write(`${themeDir}/src/scss/main.scss`, css);
  [
    'abstracts/_variables.scss', 'abstracts/_mixins.scss', 'abstracts/_functions.scss',
    'base/_reset.scss', 'base/_typography.scss', 'base/_accessibility.scss', 'base/_forms.scss', 'base/_newsletter.scss',
    'components/_buttons.scss', 'components/_cards.scss', 'components/_forms.scss', 'components/_badges.scss', 'components/_accordion.scss', 'components/_carousel.scss', 'components/_portfolio-filter.scss', 'components/_before-after.scss',
    'layout/_container.scss', 'layout/_header.scss', 'layout/_footer.scss', 'layout/_grid.scss', 'layout/_sections.scss',
    'pages/_homepage.scss', 'pages/_contact.scss', 'pages/_about-us.scss', 'pages/_services.scss', 'pages/_work.scss', 'pages/_blog.scss', 'pages/_policy.scss'
  ].forEach((file) => write(`${themeDir}/src/scss/${file}`, `/* ${file} is composed into src/scss/main.scss for this no-dependency baseline build. */\n`));
  write(`${themeDir}/build/webpack.config.js`, `const fs = require('fs');\nconst path = require('path');\nconst root = path.resolve(__dirname, '..');\nfs.copyFileSync(path.join(root, 'src/scss/main.scss'), path.join(root, 'assets/css/bundle.css'));\nfs.copyFileSync(path.join(root, 'src/js/main.js'), path.join(root, 'assets/js/bundle.js'));\nconsole.log('Built local CSS and JS bundles.');\n`);
  write(`${themeDir}/blocks/README.md`, `# Blocks\n\nThis classic theme does not register custom blocks in the baseline release.\n`);
  write(`${themeDir}/docs/getting-started.md`, `# Getting Started\n\nInstall the ZIP in WordPress, activate the theme, assign menus, and create pages using the included templates.\n`);
  write(`${themeDir}/docs/customization.md`, `# Customization\n\nAdjust colors and content in the theme templates or through WordPress page content as needed.\n`);
  write(`${themeDir}/accessibility/README.md`, `# Accessibility\n\nThe Nolan-menu header uses ARIA controls, expanded state, Escape close behavior, and visible focus states.\n`);
}

function writePreview() {
  write(`${previewDir}/assets/css/preview.css`, css);
  write(`${previewDir}/assets/js/preview.js`, menuJs);
  write(`${previewDir}/assets/images/README.md`, `# Preview Images\n\nLocal generated PNG assets for Meridian Strategy Group preview pages.\n`);
  write(`${previewDir}/README.md`, `# Nolan Young Theme 001 - Meridian Strategy Group Preview\n\nStatic preview for Meridian Strategy Group.\n`);
  write(`${previewDir}/homepage_preview.html`, previewShell('Home', homeHtml()));
  write(`${previewDir}/index.html`, previewShell('Home', homeHtml()));
  write(`${previewDir}/services_preview.html`, previewShell('Services', `${pageHero('Services for regulated growth', 'Four connected advisory tracks for service companies that need stronger systems before the next stage of scale.')}<section class="section"><div class="container"><div class="grid-4">${serviceCardsHtml()}</div></div></section>`));
  write(`${previewDir}/about-us_preview.html`, previewShell('About Us', `${pageHero('Senior operating counsel for serious service teams', 'Meridian works with leaders who need routines, artifacts, and ownership that hold up in busy weeks.')}<section class="section"><div class="container"><div class="grid-3"><article class="proof-card"><h3>Operator-led</h3><p>Built from service delivery realities.</p></article><article class="proof-card"><h3>Evidence-minded</h3><p>Controls connect to proof and review.</p></article><article class="proof-card"><h3>Calm by design</h3><p>Fewer surprises and cleaner decisions.</p></article></div></div></section>`));
  write(`${previewDir}/work_preview.html`, previewShell('Work', `${pageHero('Work that turns pressure into operating clarity', 'Representative engagements across healthcare, wellness, and professional-services teams.')}<section class="section"><div class="container"><div class="grid-3">${caseCardsHtml()}</div></div></section>`));
  write(`${previewDir}/blog_preview.html`, previewShell('Blog', `${pageHero('Operating notes', 'Brief field notes for leaders improving regulated service companies.')}<section class="section"><div class="container"><div class="grid-3">${postCardsHtml()}</div></div></section>`));
  write(`${previewDir}/single_services_preview.html`, previewShell('Operating Model Design', `${pageHero('Operating Model Design', spec.services[0].detail)}<section class="section"><div class="container grid-2"><div><h2>What gets built</h2><ul><li>Ownership map and decision rights</li><li>Handoff standards across departments</li><li>Weekly operating review agenda</li><li>Escalation and quality review path</li></ul></div><div class="proof-card"><h3>Best for</h3><p>Teams where growth has made informal coordination too expensive and too risky.</p><a class="button" href="contact_preview.html">Discuss this service</a></div></div></section>`));
  write(`${previewDir}/contact_preview.html`, previewShell('Contact', `${pageHero('Start with the operating friction', spec.contactIntro)}<section class="section"><div class="container grid-2"><form class="proof-card form-grid"><label>Name<input type="text" name="name"></label><label>Email<input type="email" name="email"></label><label>Company<select name="company-stage"><option>Multi-location service company</option><option>Regulated professional-services team</option><option>Founder-led growth business</option></select></label><label>What needs attention?<textarea name="message"></textarea></label><button class="button" type="submit">Request consultation</button></form><div class="proof-card"><h2>Good fit signals</h2><p>Your team has demand, but ownership, compliance evidence, service standards, or reporting cadence are creating drag.</p><p>Remote advisory with focused onsite workshops when the work requires it.</p></div></div></section>`));
  const gallery = path.join(root, 'docs', 'index.html');
  let galleryHtml = fs.existsSync(gallery) ? fs.readFileSync(gallery, 'utf8') : '';
  if (!galleryHtml.includes(`themes/${slug}/homepage_preview.html`)) {
    const card = `\n        <article class="theme-card">\n          <p class="eyebrow">${slug}</p>\n          <h3>Nolan Young Theme 001 - Meridian Strategy Group</h3>\n          <p>Premium Meridian Strategy Group WordPress theme with matching static preview.</p>\n          <p><a href="themes/${slug}/homepage_preview.html">Open preview</a></p>\n        </article>\n`;
    galleryHtml = galleryHtml.replace(/\s*<article class="empty-state" data-empty-state>[\s\S]*?<\/article>/, card);
    fs.writeFileSync(gallery, galleryHtml, 'utf8');
  }
}

function writeImages() {
  imageFiles.forEach((file, index) => {
    const png = makePng(1200, 760, index);
    const folder = index < 2 ? 'hero' : index < 5 ? 'portfolio' : 'texture';
    writeBin(`${themeDir}/assets/images/${folder}/${file}`, png);
    writeBin(`${previewDir}/assets/images/${file}`, png);
  });
  writeBin(`${themeDir}/screenshot.png`, makePng(1200, 900, 11));
}

writeTheme();
writePreview();
writeImages();
console.log(`Generated ${slug} from local Ollama content spec.`);
