const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname, '..', '..', '..');
const slug = 'nolan-showcase-theme-03';
const sourceSlug = 'nolan-showcase-theme-01';
const themeDir = path.join(root, 'wp-content', 'themes', slug);
const previewDir = path.join(root, 'docs', 'themes', slug);
const sourceTheme = path.join(root, 'wp-content', 'themes', sourceSlug);
const sourcePreview = path.join(root, 'docs', 'themes', sourceSlug);

const spec = {
  brand: 'Meridian Strategy Group',
  tagline: 'Systems for regulated teams that want to grow without losing control',
  heroHeadline: 'The operating system behind calm, compliant growth',
  heroCopy: 'Meridian Strategy Group designs operating models, compliance routines, client experience standards, and leadership dashboards for healthcare, wellness, and professional-services teams that need reliable scale.',
  metrics: [
    { value: '18', description: 'regulated growth engagements active each year' },
    { value: '95%', description: 'of roadmap actions completed on schedule' },
    { value: '4', description: 'core advisory tracks aligned to the same operating model' },
    { value: '15+', description: 'years of senior operational and compliance experience' }
  ],
  services: [
    {
      key: 'model',
      title: 'Operating Model Design',
      kicker: 'Structure before scale',
      summary: 'Roles, decision rights, handoffs, cadence, and team rhythm for companies that have outgrown founder memory.',
      detail: 'We map the decisions the business makes every week, then design a light operating system that makes ownership obvious and execution predictable.',
      outcomes: ['clear ownership', 'clean handoffs', 'fewer executive interruptions'],
      audience: ['Founder-led clinics', 'service operators', 'cross-functional leadership teams']
    },
    {
      key: 'compliance',
      title: 'Compliance Readiness',
      kicker: 'Audit discipline without panic',
      summary: 'Policy review, evidence routines, remediation plans, and readiness checkpoints for regulated service organizations.',
      detail: 'We translate compliance into a repeatable operating rhythm so evidence lives where the team already works instead of in a binder nobody opens.',
      outcomes: ['faster audits', 'more reliable evidence', 'lower risk exposure'],
      audience: ['Healthcare practices', 'wellness groups', 'professional-services firms']
    },
    {
      key: 'experience',
      title: 'Client Experience Systems',
      kicker: 'Service that feels consistent',
      summary: 'Client journey design, communication playbooks, and quality checkpoints that make premium service visible and repeatable.',
      detail: 'The goal is a service model that feels calm on the outside and is simple to train on the inside.',
      outcomes: ['better onboarding', 'consistent standards', 'stronger retention'],
      audience: ['Member services', 'patient experience teams', 'client success leaders']
    },
    {
      key: 'dashboards',
      title: 'Leadership Dashboards',
      kicker: 'Signals leaders can use',
      summary: 'Practical scorecards that connect capacity, quality, compliance, and financial pressure in one review cadence.',
      detail: 'We build dashboards that help operators decide what to do next, not just report what happened last month.',
      outcomes: ['faster decisions', 'fewer blind spots', 'better leadership cadence'],
      audience: ['COOs', 'operations directors', 'executive teams']
    }
  ],
  process: [
    { title: 'Observe', summary: 'We start by mapping how work actually moves, where it stalls, and where risk accumulates.' },
    { title: 'Design', summary: 'We create a practical operating model that your team can maintain without specialist support.' },
    { title: 'Install', summary: 'We turn the plan into playbooks, checklists, dashboards, and decision rules.' },
    { title: 'Train', summary: 'Leaders and team owners learn the routines, review cadence, and escalation points.' },
    { title: 'Harden', summary: 'We adjust after real use so the system survives busy seasons, audits, and growth surges.' }
  ],
  caseStudies: [
    {
      title: 'Regional care network',
      clientType: 'Healthcare organization',
      summary: 'A 16-location practice needed standard operating routines, a tighter audit trail, and leadership reporting that made issues visible before they became expensive.',
      outcome: 'Installed a new operating cadence, cut unresolved compliance actions by 58%, and reduced monthly executive review time by 40%.',
      metrics: [{ value: '58%', description: 'fewer unresolved actions' }, { value: '40%', description: 'less review time' }]
    },
    {
      title: 'Luxury wellness group',
      clientType: 'Wellness firm',
      summary: 'A premium wellness brand needed a more consistent intake, follow-up, and service quality standard across locations and service lines.',
      outcome: 'Rebuilt the client journey, improved handoffs, and lifted repeat-client bookings by 31% within two quarters.',
      metrics: [{ value: '31%', description: 'repeat-booking lift' }, { value: '2', description: 'quarters to impact' }]
    },
    {
      title: 'Boutique advisory firm',
      clientType: 'Professional-services firm',
      summary: 'The leadership team wanted dashboards, accountability, and a clearer method for tracking delivery quality without adding bureaucracy.',
      outcome: 'Launched a compact leadership dashboard, clarified decision rights, and reduced project slippage by 24%.',
      metrics: [{ value: '24%', description: 'less project slippage' }, { value: '1', description: 'shared leadership dashboard' }]
    }
  ],
  testimonials: [
    { quote: 'They gave our team a structure that finally matched the quality of the service we were trying to deliver. The change was immediate and still holds.', name: 'Dana Ellis', title: 'Managing Partner, Northlake Wellness' },
    { quote: 'The work was calm, sharp, and practical. We left with systems the team actually uses, not a deck that collects dust.', name: 'Avery Lin', title: 'COO, Meridian Care Collective' },
    { quote: 'They saw the operational blind spots quickly and turned them into routines our managers could own without extra overhead.', name: 'Jonah Patel', title: 'Executive Director, Vale Professional Services' }
  ],
  blogPosts: [
    { title: 'What a useful dashboard actually needs to show', category: 'Leadership Systems', summary: 'The difference between reporting and decision-making, and how to keep the executive view compact enough to use weekly.' },
    { title: 'How to install compliance routines people will keep using', category: 'Compliance', summary: 'A practical approach to evidence collection, review cadence, and accountability without creating busywork.' },
    { title: 'Why client experience breaks when ownership is unclear', category: 'Service Design', summary: 'How to turn a good service promise into a repeatable journey that the whole team can deliver consistently.' }
  ],
  contactIntro: 'Tell us what you are trying to stabilize, which teams are involved, and where the pressure is showing up. We will reply with fit, scope, and the most practical next step.',
  footerSummary: 'Meridian Strategy Group builds operating systems for regulated service companies that need clearer ownership, stronger compliance routines, and calmer growth.',
  menu: {
    services: [
      { title: 'Operating Model Design', description: 'Ownership, cadence, and handoffs', linkText: 'View service detail', link: 'single_services_preview.html' },
      { title: 'Compliance Readiness', description: 'Evidence routines and remediation', linkText: 'See services', link: 'services_preview.html' },
      { title: 'Client Experience Systems', description: 'Journey, touchpoints, standards', linkText: 'Explore work', link: 'work_preview.html' },
      { title: 'Leadership Dashboards', description: 'Signals leaders can use', linkText: 'Review outcomes', link: 'work_preview.html' }
    ],
    about: [
      { title: 'The firm', description: 'Senior operators for serious service teams', linkText: 'About the studio', link: 'about-us_preview.html' },
      { title: 'Our principles', description: 'Calm systems, clear owners, practical tools', linkText: 'Read more', link: 'work_preview.html' },
      { title: 'Industries served', description: 'Healthcare, wellness, and professional services', linkText: 'View services', link: 'services_preview.html' }
    ],
    blog: [
      { title: 'Latest writing', description: 'Operating notes on ownership and quality', linkText: 'Read the journal', link: 'blog_preview.html' },
      { title: 'Guides', description: 'Practical frameworks for team leaders', linkText: 'Browse guides', link: 'blog_preview.html' },
      { title: 'Field notes', description: 'Short observations from real engagements', linkText: 'Open insights', link: 'blog_preview.html' }
    ]
  }
};

const imageFiles = [
  'advisory-board-session.png',
  'compliance-evidence-board.png',
  'leadership-dashboard-review.png',
  'client-journey-whiteboard.png',
  'operating-playbook-stack.png',
  'clinic-operations-map.png',
  'executive-worktable.png',
  'team-review-table.png'
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content.replace(/\r\n/g, '\n'), 'utf8');
}

function writeBin(file, buffer) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, buffer);
}

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i];
    for (let k = 0; k < 8; k += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng(width, height, seed) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  const palettes = [
    [[16, 23, 21], [111, 137, 125], [235, 229, 221]],
    [[22, 28, 40], [112, 123, 145], [225, 221, 214]],
    [[32, 31, 27], [132, 109, 76], [243, 234, 216]],
    [[21, 33, 28], [150, 132, 104], [241, 238, 229]]
  ];
  const colors = palettes[seed % palettes.length];
  for (let y = 0; y < height; y += 1) {
    const row = y * (width * 3 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x += 1) {
      const idx = row + 1 + x * 3;
      const v = (Math.sin((x + seed * 19) / 41) + Math.cos((y + seed * 23) / 35) + 2) / 4;
      const glow = Math.max(0, 1 - Math.hypot((x - width * 0.64) / width, (y - height * 0.35) / height) * 1.7);
      const a = colors[0];
      const b = v > 0.53 ? colors[1] : colors[2];
      raw[idx] = Math.min(255, Math.round(a[0] * (1 - v) + b[0] * v + glow * 34));
      raw[idx + 1] = Math.min(255, Math.round(a[1] * (1 - v) + b[1] * v + glow * 28));
      raw[idx + 2] = Math.min(255, Math.round(a[2] * (1 - v) + b[2] * v + glow * 18));
      if ((x + seed * 17) % 223 < 2 || (y + seed * 29) % 177 < 2) {
        raw[idx] = Math.max(0, raw[idx] - 26);
        raw[idx + 1] = Math.max(0, raw[idx + 1] - 22);
        raw[idx + 2] = Math.max(0, raw[idx + 2] - 18);
      }
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

function copyScaffold() {
  if (!fs.existsSync(sourceTheme) || !fs.existsSync(sourcePreview)) {
    throw new Error('Theme 01 scaffold is required before generating theme 03.');
  }
  fs.rmSync(themeDir, { recursive: true, force: true });
  fs.rmSync(previewDir, { recursive: true, force: true });
  fs.cpSync(sourceTheme, themeDir, { recursive: true });
  fs.cpSync(sourcePreview, previewDir, { recursive: true });
}

function replaceTextInDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceTextInDir(full);
    } else if (!/\.(png|jpg|jpeg|webp|gif|zip)$/i.test(entry.name)) {
      let text = fs.readFileSync(full, 'utf8');
      text = text
        .replaceAll('nolan-showcase-theme-01', 'nolan-showcase-theme-03')
        .replaceAll('Nolan Showcase Theme 01', 'Nolan Showcase Theme 03')
        .replaceAll('Meridian Strategy Group', spec.brand)
        .replaceAll('nolan-showcase-theme-01', slug);
      fs.writeFileSync(full, text, 'utf8');
    }
  }
}

const baseJs = `(() => {
  const body = document.body;
  const header = document.querySelector('[data-site-header]');
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

  const setScrolled = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  const closePanels = () => {
    active = null;
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    panels.forEach((panel) => {
      panel.hidden = true;
      panel.setAttribute('aria-hidden', 'true');
    });
    body.classList.remove('nolan-menu-open');
    if (backdrop) backdrop.hidden = true;
  };

  const closeMobile = () => {
    if (!mobileDrawer || !mobileToggle) return;
    mobileDrawer.hidden = true;
    mobileToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('nolan-mobile-open');
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
      closeMobile();
    }
  });

  if (backdrop) backdrop.addEventListener('click', () => {
    closePanels();
    closeMobile();
  });
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      mobileDrawer.hidden = expanded;
      body.classList.toggle('nolan-mobile-open', !expanded);
      if (backdrop) backdrop.hidden = expanded && !active;
    });
  }

  window.addEventListener('scroll', setScrolled, { passive: true });
  setScrolled();
})();`;

const css = `:root {
  --ink: #16211d;
  --muted: #5e6764;
  --paper: #f6f0e7;
  --panel: #fffdf8;
  --panel-soft: #eef2ec;
  --line: rgba(22,33,29,.12);
  --accent: #7e6245;
  --accent-2: #4f6c5d;
  --deep: #0f1715;
  --shadow: 0 24px 60px rgba(16,24,22,.12);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  color: var(--ink);
  background: linear-gradient(180deg, #f5efe6 0%, #edf1eb 100%);
  font-family: "Aptos", "Segoe UI", "Helvetica Neue", sans-serif;
  line-height: 1.6;
}
body.nolan-menu-open, body.nolan-mobile-open { overflow: hidden; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
button, input, textarea, select { font: inherit; }
.screen-reader-text { position: absolute; left: -9999px; }
.skip-link:focus {
  left: 1rem;
  top: 1rem;
  z-index: 10000;
  background: #fff;
  color: var(--ink);
  padding: .75rem 1rem;
  border: 1px solid var(--line);
}
.nolan-site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(251,248,242,.98);
  border-bottom: 1px solid var(--line);
  transition: box-shadow .2s ease, background .2s ease, border-color .2s ease;
}
.nolan-site-header.is-scrolled {
  background: rgba(247,243,236,.99);
  box-shadow: 0 10px 28px rgba(16,24,22,.08);
}
.nolan-header-inner {
  min-height: 82px;
  display: grid;
  grid-template-columns: minmax(180px, 1fr) auto minmax(180px, 1fr);
  align-items: center;
  gap: 22px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}
.nolan-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  letter-spacing: 0;
}
.nolan-mark {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  background: var(--deep);
  color: #fff;
  border-radius: 50%;
  font-size: .78rem;
}
.nolan-primary-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}
.nolan-primary-nav a,
.nolan-menu-trigger {
  border: 0;
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-weight: 700;
  padding: 12px 14px;
  cursor: pointer;
  border-radius: 6px;
}
.nolan-primary-nav a:hover,
.nolan-menu-trigger:hover,
.nolan-menu-trigger[aria-expanded="true"] {
  background: #e6e0d6;
}
.nolan-header-actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 12px;
}
.button,
.nolan-header-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 6px;
  border: 1px solid var(--deep);
  background: var(--deep);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(15,23,21,.12);
}
.button.secondary {
  background: transparent;
  color: var(--deep);
}
.nolan-mobile-toggle {
  display: none;
  border: 1px solid var(--line);
  background: var(--panel);
  padding: 10px 12px;
  border-radius: 6px;
}
.nolan-menu-backdrop {
  position: fixed;
  inset: 82px 0 0;
  background: rgba(15,23,21,.42);
  z-index: 900;
}
.nolan-dropdown {
  position: fixed;
  left: 50%;
  top: 82px;
  transform: translateX(-50%);
  width: min(1120px, calc(100vw - 32px));
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  z-index: 1001;
  border-radius: 10px;
  padding: 22px;
}
.nolan-dropdown-shell {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 22px;
}
.nolan-dropdown-intro {
  background: linear-gradient(180deg, #f3efe8 0%, #edf3ee 100%);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 18px;
  display: grid;
  gap: 16px;
  align-content: start;
}
.menu-stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.menu-stat-grid div {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 12px;
}
.menu-stat-grid span {
  display: block;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--deep);
}
.nolan-dropdown-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
}
.nolan-rail {
  display: grid;
  gap: 8px;
  align-content: start;
}
.nolan-rail button {
  text-align: left;
  border: 1px solid var(--line);
  background: #f3eee7;
  padding: 12px 14px;
  border-radius: 6px;
  color: var(--ink);
  font-weight: 700;
}
.nolan-rail button.is-active,
.nolan-rail button:focus-visible {
  outline: 3px solid rgba(126,98,69,.28);
  background: #fff8ed;
}
.nolan-rail-content {
  min-height: 240px;
  padding: 0 2px;
}
.menu-panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.menu-card {
  background: #faf7f2;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 16px;
  display: grid;
  gap: 10px;
}
.menu-card h4,
.menu-card p,
.menu-card ul { margin: 0; }
.menu-card ul {
  padding-left: 18px;
  color: var(--muted);
}
.menu-card strong { color: var(--deep); }
.menu-link-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}
.nolan-mobile-drawer {
  position: fixed;
  inset: 82px 0 auto;
  z-index: 1002;
  background: var(--panel);
  border-bottom: 1px solid var(--line);
  padding: 22px 24px 28px;
  box-shadow: var(--shadow);
}
.nolan-mobile-drawer nav {
  display: grid;
  gap: 12px;
}
.nolan-mobile-drawer a {
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
  font-weight: 700;
}
.section {
  padding: 88px 24px;
}
.section.alt {
  background: linear-gradient(180deg, #f3efe7 0%, #edf1eb 100%);
}
.container {
  max-width: 1280px;
  margin: 0 auto;
}
.eyebrow {
  color: #7a604a;
  text-transform: uppercase;
  font-size: .77rem;
  font-weight: 700;
  letter-spacing: .1em;
  margin: 0 0 10px;
}
.hero {
  padding: 70px 24px 64px;
  background: linear-gradient(135deg, #f5efe6 0%, #edf1eb 58%, #e7ece7 100%);
}
.hero-grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  gap: 42px;
  align-items: center;
}
.hero h1 {
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 68px;
  line-height: .94;
  margin: 10px 0 18px;
  max-width: 820px;
}
.hero p {
  font-size: 1.12rem;
  color: var(--muted);
  max-width: 720px;
}
.hero-actions,
.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}
.hero-stack {
  display: grid;
  gap: 14px;
}
.hero-panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 10px;
  box-shadow: var(--shadow);
  padding: 16px;
}
.hero-panel img {
  border-radius: 8px;
  aspect-ratio: 5 / 4;
  object-fit: cover;
}
.hero-stack .hero-panel:first-child {
  transform: translateX(10px) rotate(1deg);
}
.hero-stack .hero-panel:last-child {
  transform: translateX(-8px);
}
.hero-proof {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 34px;
}
.hero-proof p,
.metric-card p,
.proof-card p,
.service-card p,
.case-card p,
.post-card p,
.testimonial-card p,
.process-card p {
  margin: 0;
}
.hero-proof span,
.metric-value {
  display: block;
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--deep);
  line-height: 1;
  margin-bottom: 6px;
}
.grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
.proof-card,
.service-card,
.case-card,
.post-card,
.testimonial-card,
.process-card,
.feature-panel,
.metric-card,
.contact-panel,
.content-panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(16,24,22,.05);
  padding: 22px;
}
.service-card img,
.case-card img,
.post-card img {
  border-radius: 8px;
  margin-bottom: 16px;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}
.service-card ul,
.case-card ul {
  margin: 14px 0 0;
  padding-left: 18px;
  color: var(--muted);
}
.section-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
  align-items: end;
  margin-bottom: 32px;
}
.section-header h2,
.split-title h2,
.content-panel h2,
.page-hero h1 {
  font-family: "Georgia", "Times New Roman", serif;
  margin: 0;
  line-height: .98;
}
.section-header h2 { font-size: 44px; max-width: 840px; }
.section-header p,
.split-title p,
.page-hero p {
  color: var(--muted);
  max-width: 440px;
  margin: 0;
}
.page-hero {
  padding: 94px 24px 60px;
  border-bottom: 1px solid var(--line);
  background: linear-gradient(180deg, #f6f1e8 0%, #eef2ec 100%);
}
.page-hero h1 { font-size: 58px; max-width: 860px; }
.split-grid {
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  gap: 24px;
  align-items: start;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.summary-grid .feature-panel,
.summary-grid .metric-card {
  min-height: 100%;
}
.feature-panel h3,
.metric-card h3,
.contact-panel h3,
.content-panel h3,
.process-card h3,
.testimonial-card cite,
.post-card h3,
.case-card h3,
.service-card h3 {
  margin: 0 0 10px;
}
.feature-panel p,
.metric-card p,
.contact-panel p,
.content-panel p,
.process-card p,
.testimonial-card p,
.post-card p,
.case-card p,
.service-card p {
  color: var(--muted);
}
.timeline {
  display: grid;
  gap: 14px;
}
.timeline-item {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 18px;
  align-items: start;
  padding: 18px 0;
  border-top: 1px solid var(--line);
}
.timeline-item:first-child { border-top: 0; padding-top: 0; }
.timeline-number {
  font-size: 1.65rem;
  font-weight: 700;
  color: var(--deep);
  line-height: 1;
}
.quote-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.testimonial-card {
  position: relative;
  display: grid;
  gap: 14px;
}
.testimonial-card p {
  color: var(--ink);
  font-size: 1.02rem;
}
.testimonial-card cite {
  font-style: normal;
  color: var(--muted);
}
.resource-grid {
  display: grid;
  grid-template-columns: 1.15fr repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.resource-feature {
  display: grid;
  gap: 16px;
}
.resource-feature img,
.resource-grid .post-card img {
  aspect-ratio: 16 / 10;
  object-fit: cover;
}
.resource-feature h3 {
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 30px;
  line-height: 1.05;
  margin: 0;
}
.callout-band {
  background: linear-gradient(135deg, #0f1715 0%, #1e2b27 100%);
  color: #f6efe7;
  padding: 30px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.08);
}
.callout-band .button { border-color: #f6efe7; background: #f6efe7; color: var(--deep); }
.callout-grid {
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  gap: 24px;
  align-items: center;
}
.form-grid {
  display: grid;
  gap: 14px;
}
label {
  font-weight: 700;
  display: grid;
  gap: 8px;
}
input,
textarea,
select {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 12px 13px;
  background: #fff;
  color: var(--ink);
}
textarea { min-height: 150px; resize: vertical; }
.footer-strap {
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 20px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  padding-bottom: 24px;
  margin-bottom: 24px;
}
.site-footer {
  background: #101817;
  color: #f5eee3;
  padding: 68px 24px 38px;
  position: relative;
  overflow: hidden;
}
.site-footer:before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, rgba(126,98,69,.24), transparent 34%, rgba(79,108,93,.16));
  pointer-events: none;
}
.footer-grid {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 28px;
}
.site-footer a { color: #f5eee3; display: block; margin: 8px 0; }
.footer-brand-note { max-width: 560px; font-size: 1.12rem; color: #f3e9db; }
.footer-meta { color: rgba(245,238,227,.76); }
.nolan-site-header a:focus-visible,
.nolan-site-header button:focus-visible,
.button:focus-visible,
.nolan-header-cta:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible,
.site-footer a:focus-visible {
  outline: 3px solid rgba(126,98,69,.38);
  outline-offset: 3px;
}
@media (max-width: 1120px) {
  .nolan-dropdown-shell,
  .nolan-dropdown-grid,
  .hero-grid,
  .callout-grid,
  .resource-grid,
  .split-grid,
  .footer-grid,
  .footer-strap {
    grid-template-columns: 1fr;
  }
  .hero-proof,
  .grid-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 900px) {
  .nolan-header-inner { grid-template-columns: 1fr auto; }
  .nolan-primary-nav,
  .nolan-header-cta {
    display: none;
  }
  .nolan-mobile-toggle { display: inline-flex; }
  .hero,
  .page-hero { padding-top: 58px; }
  .hero h1 { font-size: 46px; }
  .page-hero h1 { font-size: 40px; }
  .section-header { grid-template-columns: 1fr; }
  .grid-2,
  .grid-3,
  .grid-4,
  .quote-grid,
  .summary-grid,
  .hero-proof {
    grid-template-columns: 1fr;
  }
  .resource-feature h3 { font-size: 26px; }
  .timeline-item { grid-template-columns: 1fr; }
  .nolan-dropdown { display: none; }
}
@media (max-width: 640px) {
  .hero h1 { font-size: 38px; }
  .page-hero h1 { font-size: 34px; }
  .section { padding: 70px 20px; }
  .nolan-header-inner { padding: 0 18px; }
}`;

function heroImage(file) {
  return `<?php echo esc_url( get_template_directory_uri() . '/assets/images/hero/${file}' ); ?>`;
}

function previewImage(file) {
  return `assets/images/${file}`;
}

function previewify(html) {
  return html
    .replace(/<\?php echo esc_url\( get_template_directory_uri\(\) \. '\/assets\/images\/hero\/([^']+)' \); \?>/g, 'assets/images/$1')
    .replace(/<\?php echo esc_url\( get_template_directory_uri\(\) \. '\/assets\/images\/portfolio\/([^']+)' \); \?>/g, 'assets/images/$1')
    .replace(/<\?php echo esc_url\( get_template_directory_uri\(\) \. '\/assets\/images\/texture\/([^']+)' \); \?>/g, 'assets/images/$1')
    .replace(/<\?php echo esc_url\( home_url\( '\/services\/' \) \); \?>/g, 'services_preview.html')
    .replace(/<\?php echo esc_url\( home_url\( '\/about-us\/' \) \); \?>/g, 'about-us_preview.html')
    .replace(/<\?php echo esc_url\( home_url\( '\/work\/' \) \); \?>/g, 'work_preview.html')
    .replace(/<\?php echo esc_url\( home_url\( '\/blog\/' \) \); \?>/g, 'blog_preview.html')
    .replace(/<\?php echo esc_url\( home_url\( '\/contact\/' \) \); \?>/g, 'contact_preview.html')
    .replace(/<\?php echo esc_url\( home_url\( '\/single-service\/' \) \); \?>/g, 'single_services_preview.html')
    .replace(/<\?php echo esc_url\( home_url\( '\/' \) \); \?>/g, 'homepage_preview.html')
    .replace(/<\?php[^>]*\?>/g, '');
}

function pageHero(title, copy, eyebrow = 'Meridian Strategy Group') {
  return `<section class="page-hero"><div class="container"><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1><p>${esc(copy)}</p></div></section>`;
}

function menuServiceBlocks() {
  return spec.menu.services.map((item) => `<article class="menu-card"><p class="eyebrow">${esc(item.description)}</p><h4>${esc(item.title)}</h4><p>${esc(spec.services.find((service) => service.title === item.title)?.detail || item.description)}</p><strong>${esc(item.linkText)}</strong><a class="button secondary" href="<?php echo esc_url( home_url( '/${item.link.replace(/^\//, '')}' ) ); ?>"><?php echo esc_html__( 'Open preview', 'nolan-showcase-theme-03' ); ?></a></article>`).join('');
}

function serviceCardsPhp() {
  const imageMap = ['hero', 'hero', 'portfolio', 'portfolio'];
  return spec.services.map((service, index) => {
    const image = imageFiles[index];
    return `<article class="service-card"><img src="${heroImage(image)}" alt=""><p class="eyebrow">${esc(service.kicker)}</p><h3>${esc(service.title)}</h3><p>${esc(service.summary)}</p><ul>${service.outcomes.map((outcome) => `<li>${esc(outcome)}</li>`).join('')}</ul><p class="footer-meta">${esc(service.audience.join(', '))}</p><a class="button secondary" href="<?php echo esc_url( home_url( '/single-service/' ) ); ?>">View service detail</a></article>`;
  }).join('\n');
}

function caseCardsPhp() {
  return spec.caseStudies.map((item, index) => `<article class="case-card"><img src="${heroImage(imageFiles[index + 2])}" alt=""><p class="eyebrow">${esc(item.clientType)}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><ul>${item.metrics.map((metric) => `<li><strong>${esc(metric.value)}</strong> ${esc(metric.description)}</li>`).join('')}</ul><p>${esc(item.outcome)}</p></article>`).join('\n');
}

function postCardsPhp() {
  return spec.blogPosts.map((item, index) => `<article class="post-card"><img src="${heroImage(imageFiles[index + 4])}" alt=""><p class="eyebrow">${esc(item.category)}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Read article</a></article>`).join('\n');
}

function processCardsPhp() {
  return spec.process.map((item, index) => `<article class="process-card"><p class="eyebrow">0${index + 1}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p></article>`).join('\n');
}

function testimonialCardsPhp() {
  return spec.testimonials.map((item) => `<blockquote class="testimonial-card"><p>"${esc(item.quote)}"</p><cite>${esc(item.name)}<br>${esc(item.title)}</cite></blockquote>`).join('\n');
}

function heroPhp() {
  return `<section class="hero"><div class="hero-grid"><div><p class="eyebrow">${esc(spec.tagline)}</p><h1>${esc(spec.heroHeadline)}</h1><p>${esc(spec.heroCopy)}</p><div class="hero-actions"><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Book a readiness call</a><a class="button secondary" href="<?php echo esc_url( home_url( '/services/' ) ); ?>">View service model</a></div><div class="hero-proof">${spec.metrics.map((metric) => `<p><span>${esc(metric.value)}</span>${esc(metric.description)}</p>`).join('')}</div></div><div class="hero-stack"><div class="hero-panel"><img src="${heroImage(imageFiles[0])}" alt=""></div><div class="hero-panel"><p class="eyebrow">Operating snapshot</p><h3>Built for teams that need reliability under pressure.</h3><p>Every engagement leaves behind routines, dashboards, and a clear operating rhythm the team can actually maintain.</p></div></div></div></section>`;
}

function menuPanel(section, introTitle, introCopy, statValues, railButtons, railContent, imageFile) {
  return `<div class="nolan-dropdown" id="nolan-menu-${section}" data-menu-dropdown="${section}" aria-hidden="true" hidden><div class="nolan-dropdown-shell"><aside class="nolan-dropdown-intro"><p class="eyebrow">${esc(introTitle)}</p><h3>${esc(introCopy.title)}</h3><p>${esc(introCopy.copy)}</p><img src="${heroImage(imageFile)}" alt=""><div class="menu-stat-grid">${statValues.map((item) => `<div><span>${esc(item.value)}</span><p>${esc(item.label)}</p></div>`).join('')}</div></aside><div class="nolan-dropdown-grid"><div class="nolan-rail" role="tablist" aria-label="${esc(introTitle)} menu">${railButtons.map((button, index) => `<button type="button" data-rail-item="${esc(button.key)}" aria-selected="${index === 0 ? 'true' : 'false'}">${esc(button.label)}</button>`).join('')}</div><div>${railContent.map((sectionItem, index) => `<section class="nolan-rail-content" data-rail-content="${esc(sectionItem.key)}"${index === 0 ? '' : ' hidden'}><div class="section-header"><div><p class="eyebrow">${esc(sectionItem.kicker)}</p><h3>${esc(sectionItem.title)}</h3></div><p>${esc(sectionItem.lead)}</p></div><div class="menu-panel-grid">${sectionItem.cards.map((card) => `<article class="menu-card"><p class="eyebrow">${esc(card.eyebrow)}</p><h4>${esc(card.title)}</h4><p>${esc(card.copy)}</p><ul>${card.points.map((point) => `<li>${esc(point)}</li>`).join('')}</ul></article>`).join('')}</div><div class="menu-link-row">${sectionItem.links.map((link) => `<a class="button secondary" href="${link.href}">${esc(link.label)}</a>`).join('')}</div></section>`).join('')}</div></div></div></div>`;
}

function servicesMenu() {
  return menuPanel('services', 'Services', { title: 'Four advisory tracks, one operating logic.', copy: 'Each engagement is designed to reduce ambiguity and install routines the team can keep running after the project ends.' }, [
    { value: '4', label: 'core advisory tracks' },
    { value: '1', label: 'shared operating model' },
    { value: '5', label: 'steps in the install cadence' },
    { value: '15+', label: 'years of senior experience' }
  ], [
    { key: 'model', label: 'Operating Model' },
    { key: 'compliance', label: 'Compliance Readiness' },
    { key: 'experience', label: 'Client Systems' },
    { key: 'dashboards', label: 'Leadership Dashboards' }
  ], [
    {
      key: 'model',
      kicker: 'Design and ownership',
      title: 'Operating Model Design',
      lead: 'Clarify how decisions move, who owns what, and how the team keeps work moving when the founder is not in the room.',
      cards: [
        { eyebrow: 'What we change', title: 'Decision rights and cadence', copy: 'We reduce rework by defining who decides, who approves, and when leadership should review.', points: ['Role clarity for managers', 'Weekly and monthly rhythm', 'Escalation rules for edge cases'] },
        { eyebrow: 'What it looks like', title: 'Operating playbook', copy: 'A compact, readable playbook that turns the operating model into routines people can use immediately.', points: ['Meeting agenda templates', 'Team handoff rules', 'Decision log structure'] },
        { eyebrow: 'Outcome', title: 'Less noise, more accountability', copy: 'The team spends less time clarifying and more time executing with a shared standard.', points: ['Reduced executive interruption', 'Cleaner ownership map', 'Faster follow-through'] }
      ],
      links: [
        { label: 'Explore services', href: '<?php echo esc_url( home_url( \'/services/\' ) ); ?>' },
        { label: 'See work', href: '<?php echo esc_url( home_url( \'/work/\' ) ); ?>' }
      ]
    },
    {
      key: 'compliance',
      kicker: 'Audit readiness',
      title: 'Compliance Readiness',
      lead: 'Turn compliance into a practical operating routine with evidence, controls, and review points that fit the team’s actual workflow.',
      cards: [
        { eyebrow: 'What we map', title: 'Policies, evidence, and risk', copy: 'We identify the gaps, trace evidence collection, and put the highest-risk items into one review lane.', points: ['Policy gap scan', 'Evidence collection map', 'Risk-priority remediation'] },
        { eyebrow: 'What we install', title: 'Readiness cadence', copy: 'Regular check-ins, ownership lists, and simple audit prep make readiness sustainable instead of frantic.', points: ['Monthly checkpoints', 'Assigned evidence owners', 'Escalation workflow'] },
        { eyebrow: 'Outcome', title: 'Better audit posture', copy: 'You get a calmer operating environment and less last-minute scramble when outside review shows up.', points: ['Lower risk exposure', 'Faster response time', 'More stable controls'] }
      ],
      links: [
        { label: 'Readiness work', href: '<?php echo esc_url( home_url( \'/services/\' ) ); ?>' },
        { label: 'Contact us', href: '<?php echo esc_url( home_url( \'/contact/\' ) ); ?>' }
      ]
    },
    {
      key: 'experience',
      kicker: 'Service design',
      title: 'Client Experience Systems',
      lead: 'Create a premium service journey that feels consistent to the client and simple to train across the team.',
      cards: [
        { eyebrow: 'What we build', title: 'Journey and touchpoint map', copy: 'We chart the client path from inquiry to delivery and identify where standards drift.', points: ['Inquiry flow', 'Onboarding rhythm', 'Delivery checkpoints'] },
        { eyebrow: 'What we document', title: 'Communication playbooks', copy: 'Use short scripts and response rules so the brand voice stays calm and clear under pressure.', points: ['Response time standards', 'Message templates', 'Quality review points'] },
        { eyebrow: 'Outcome', title: 'Consistent premium service', copy: 'Clients feel the quality in every touchpoint because the whole team works from the same standard.', points: ['Better retention', 'Cleaner handoffs', 'Less service variance'] }
      ],
      links: [
        { label: 'View service detail', href: '<?php echo esc_url( home_url( \'/single-service/\' ) ); ?>' },
        { label: 'Review work', href: '<?php echo esc_url( home_url( \'/work/\' ) ); ?>' }
      ]
    },
    {
      key: 'dashboards',
      kicker: 'Leadership visibility',
      title: 'Leadership Dashboards',
      lead: 'Give leaders a compact view of capacity, quality, compliance, and financial pressure so decisions happen in the right room.',
      cards: [
        { eyebrow: 'What we surface', title: 'Useful metrics only', copy: 'We define the measures that matter and cut the noise that does not help the next decision.', points: ['Capacity and load', 'Risk and remediation', 'Quality and satisfaction'] },
        { eyebrow: 'What it supports', title: 'Weekly leadership review', copy: 'A short, predictable review cadence keeps the team aligned without turning into a reporting exercise.', points: ['Decision prompts', 'Escalation cues', 'Action ownership'] },
        { eyebrow: 'Outcome', title: 'Faster leadership response', copy: 'Executives can see the signal sooner and act with less friction.', points: ['More confident decisions', 'Fewer blind spots', 'Shared operational truth'] }
      ],
      links: [
        { label: 'Review outcomes', href: '<?php echo esc_url( home_url( \'/work/\' ) ); ?>' },
        { label: 'Read the journal', href: '<?php echo esc_url( home_url( \'/blog/\' ) ); ?>' }
      ]
    }
  ], imageFiles[1]);
}

function aboutMenu() {
  return menuPanel('about', 'About', { title: 'Senior operators with a calm point of view.', copy: 'We work with teams that need practical systems, sharper ownership, and a steady hand while the business keeps moving.' }, [
    { value: '3', label: 'guiding principles' },
    { value: '2', label: 'sectors served' },
    { value: '1', label: 'shared standard' },
    { value: '0', label: 'dramatic theatre' }
  ], [
    { key: 'firm', label: 'The Firm' },
    { key: 'principles', label: 'Principles' },
    { key: 'sectors', label: 'Sectors' }
  ], [
    {
      key: 'firm',
      kicker: 'Who we are',
      title: 'The firm behind the framework',
      lead: 'Meridian Strategy Group is a senior advisory practice for regulated service companies that want to scale with control.',
      cards: [
        { eyebrow: 'How we work', title: 'Small team, high leverage', copy: 'You work directly with senior operators who can see the system, not just one department.', points: ['Direct engagement', 'Opinionated structure', 'Clear deliverables'] },
        { eyebrow: 'How it feels', title: 'Calm and exacting', copy: 'We keep the work precise and useful so leaders can keep momentum while the operating model changes.', points: ['No theater', 'Practical cadence', 'Finished artifacts'] },
        { eyebrow: 'What stays behind', title: 'Tools the team keeps', copy: 'The engagement ends with artifacts that can be maintained internally without special help.', points: ['Playbooks', 'Dashboards', 'Checklists'] }
      ],
      links: [
        { label: 'About us', href: '<?php echo esc_url( home_url( \'/about-us/\' ) ); ?>' },
        { label: 'View work', href: '<?php echo esc_url( home_url( \'/work/\' ) ); ?>' }
      ]
    },
    {
      key: 'principles',
      kicker: 'How we think',
      title: 'Principles that shape the work',
      lead: 'We keep the advisory model simple enough to maintain and specific enough to change behavior.',
      cards: [
        { eyebrow: '1', title: 'Clear ownership', copy: 'If nobody owns it, the issue will return. Every system needs a human owner.', points: ['Named responsibility', 'Review cadence', 'Escalation path'] },
        { eyebrow: '2', title: 'No hidden process', copy: 'The best operating system is visible where the work already happens.', points: ['Shared tools', 'Visible standards', 'Repeatable routines'] },
        { eyebrow: '3', title: 'Action over theory', copy: 'We prefer a working checklist over a perfect concept deck.', points: ['Practical deliverables', 'Fast adoption', 'Simple maintenance'] }
      ],
      links: [
        { label: 'Service model', href: '<?php echo esc_url( home_url( \'/services/\' ) ); ?>' },
        { label: 'Journal', href: '<?php echo esc_url( home_url( \'/blog/\' ) ); ?>' }
      ]
    },
    {
      key: 'sectors',
      kicker: 'Industry focus',
      title: 'Where the practice fits best',
      lead: 'We work where process quality, compliance, and service consistency affect the brand and the bottom line.',
      cards: [
        { eyebrow: 'Healthcare', title: 'Clinical and administrative teams', copy: 'Multi-location practices, specialist clinics, and care groups that need clear operating standards.', points: ['Patient flow', 'Risk control', 'Reporting cadence'] },
        { eyebrow: 'Wellness', title: 'Premium service brands', copy: 'Wellness groups that want high-touch service to feel repeatable across providers and locations.', points: ['Client journey', 'Service consistency', 'Team training'] },
        { eyebrow: 'Professional services', title: 'Advisory and client firms', copy: 'Founders and operations leaders who want better dashboards, better ownership, and cleaner delivery.', points: ['Leadership cadence', 'Project visibility', 'Quality control'] }
      ],
      links: [
        { label: 'See services', href: '<?php echo esc_url( home_url( \'/services/\' ) ); ?>' },
        { label: 'Contact us', href: '<?php echo esc_url( home_url( \'/contact/\' ) ); ?>' }
      ]
    }
  ], imageFiles[2]);
}

function blogMenu() {
  return menuPanel('blog', 'Blog', { title: 'Notes from real advisory work.', copy: 'The journal is where we share practical observations on leadership, compliance, and service design without the jargon.' }, [
    { value: '3', label: 'recent essays' },
    { value: '6', label: 'planning guides' },
    { value: '1', label: 'shared editorial lens' },
    { value: '0', label: 'stock phrases allowed' }
  ], [
    { key: 'latest', label: 'Latest' },
    { key: 'guides', label: 'Guides' },
    { key: 'notes', label: 'Field Notes' }
  ], [
    {
      key: 'latest',
      kicker: 'Newest writing',
      title: 'Recent notes on operating discipline',
      lead: 'A concise set of essays on how to turn strategy into routines that teams can keep using.',
      cards: [
        { eyebrow: 'Leadership Systems', title: 'What a useful dashboard actually needs to show', copy: 'How to keep the executive view compact enough to use weekly and clear enough to drive action.', points: ['Decision-focused metrics', 'Weekly review cadence', 'Action ownership'] },
        { eyebrow: 'Compliance', title: 'How to install routines people will keep using', copy: 'Evidence, review, and escalation practices that work inside a real team calendar.', points: ['Low-friction routines', 'Clear evidence owners', 'Simple standards'] },
        { eyebrow: 'Service Design', title: 'Why client experience breaks when ownership is unclear', copy: 'How to turn the promise into a repeatable journey the whole team can deliver.', points: ['Journey mapping', 'Communication rules', 'Quality checkpoints'] }
      ],
      links: [
        { label: 'Read the journal', href: '<?php echo esc_url( home_url( \'/blog/\' ) ); ?>' }
      ]
    },
    {
      key: 'guides',
      kicker: 'Short frameworks',
      title: 'Practical guides for leaders',
      lead: 'Use these quick reads to sharpen meetings, handoffs, and operating reviews.',
      cards: [
        { eyebrow: 'Guide', title: 'Planning a better leadership meeting', copy: 'A short structure for reviews that produce decisions instead of summaries.', points: ['Pre-read format', 'Decision list', 'Action log'] },
        { eyebrow: 'Guide', title: 'Installing a workable compliance cadence', copy: 'A routine leaders can keep using after the project ends.', points: ['Monthly check-ins', 'Risk tracking', 'Evidence review'] },
        { eyebrow: 'Guide', title: 'Turning service standards into habits', copy: 'How to make premium service visible, teachable, and measurable.', points: ['Service checkpoints', 'Voice standards', 'Training cues'] }
      ],
      links: [
        { label: 'Browse guides', href: '<?php echo esc_url( home_url( \'/blog/\' ) ); ?>' }
      ]
    },
    {
      key: 'notes',
      kicker: 'Field notes',
      title: 'What we notice in the work',
      lead: 'Quick observations from real projects where the pressure is high and the time is limited.',
      cards: [
        { eyebrow: 'Observation', title: 'Good teams still need a shared definition of done', copy: 'Otherwise quality depends on who happened to be in the room.', points: ['Clear standard', 'Visible checklists', 'Shared finish line'] },
        { eyebrow: 'Observation', title: 'Dashboards work when they drive a decision', copy: 'If the metric does not change what happens next, it is probably not useful.', points: ['Decision relevance', 'Weekly use', 'Short format'] },
        { eyebrow: 'Observation', title: 'The calmest brands usually have the strictest systems', copy: 'Consistency reads as luxury when the operating model is doing its job.', points: ['Reliable service', 'Stable cadence', 'Less friction'] }
      ],
      links: [
        { label: 'Contact us', href: '<?php echo esc_url( home_url( \'/contact/\' ) ); ?>' }
      ]
    }
  ], imageFiles[3]);
}

function contentHomeHero() {
  return `<section class="hero"><div class="hero-grid"><div><p class="eyebrow">${esc(spec.tagline)}</p><h1>${esc(spec.heroHeadline)}</h1><p>${esc(spec.heroCopy)}</p><div class="hero-actions"><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Book a readiness call</a><a class="button secondary" href="<?php echo esc_url( home_url( '/services/' ) ); ?>">View service model</a></div><div class="hero-proof">${spec.metrics.slice(0, 4).map((metric) => `<p><span>${esc(metric.value)}</span>${esc(metric.description)}</p>`).join('')}</div></div><div class="hero-stack"><div class="hero-panel"><img src="${heroImage(imageFiles[0])}" alt=""></div><div class="hero-panel"><p class="eyebrow">Operating snapshot</p><h3>Built for teams that need reliability under pressure.</h3><p>Every engagement leaves behind routines, dashboards, and a clear operating rhythm the team can actually maintain.</p></div></div></div></section>`;
}

function contentHomeServices() {
  return `<section class="section"><div class="container"><div class="section-header"><div><p class="eyebrow">Services</p><h2>Four advisory tracks, one operating logic.</h2></div><p>Each track is specific enough to solve a real operational problem and connected enough to keep the team working from the same standard.</p></div><div class="grid-4">${serviceCardsPhp()}</div></div></section>`;
}

function contentHomeProof() {
  return `<section class="section alt"><div class="container"><div class="split-grid"><div class="content-panel"><p class="eyebrow">Why it works</p><h2>Practical systems for teams that need calm, not noise.</h2><p>We make the important parts visible, shorten the feedback loop, and leave behind tools the team can keep using after the engagement ends.</p><div class="summary-grid">${spec.metrics.map((metric) => `<article class="metric-card"><span class="metric-value">${esc(metric.value)}</span><p>${esc(metric.description)}</p></article>`).join('')}</div></div><div class="feature-panel"><p class="eyebrow">Sectors served</p><h3>Healthcare, wellness, and professional services.</h3><p>We work where quality, consistency, and compliance affect trust.</p><ul class="checklist"><li>Multi-location care and service organizations</li><li>Premium client-facing wellness brands</li><li>Founder-led professional services teams</li><li>Leadership groups needing clearer dashboards</li></ul></div></div></div></section>`;
}

function contentHomeWork() {
  return `<section class="section"><div class="container"><div class="section-header"><div><p class="eyebrow">Featured work</p><h2>Recent engagements with measurable outcomes.</h2></div><p>The case studies show how the advisory model changes the operating rhythm, not just the slide deck.</p></div><div class="grid-3">${caseCardsPhp()}</div></div></section>`;
}

function contentHomeProcess() {
  return `<section class="section alt"><div class="container"><div class="section-header"><div><p class="eyebrow">Process</p><h2>A five-step cadence that keeps the work practical.</h2></div><p>The process is designed to move quickly, land cleanly, and leave the team with a repeatable operating standard.</p></div><div class="timeline">${processCardsPhp()}</div></div></section>`;
}

function contentHomeTestimonials() {
  return `<section class="section"><div class="container"><div class="section-header"><div><p class="eyebrow">Proof</p><h2>What leaders say after the systems settle in.</h2></div><p>The strongest feedback is usually about clarity, calm, and how much easier the work becomes.</p></div><div class="quote-grid">${testimonialCardsPhp()}</div></div></section>`;
}

function contentBlogPreview() {
  return `<section class="section alt"><div class="container"><div class="section-header"><div><p class="eyebrow">Resources</p><h2>Recent journal entries.</h2></div><a class="button secondary" href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Read the journal</a></div><div class="resource-grid"><article class="resource-feature"><img src="${heroImage(imageFiles[4])}" alt=""><p class="eyebrow">Featured essay</p><h3>What a useful dashboard actually needs to show</h3><p>The fastest way to make a dashboard useful is to decide what it should change tomorrow morning. Everything else is noise.</p><a class="button secondary" href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Read article</a></article>${postCardsPhp()}</div></div></section>`;
}

function contentHomeCta() {
  return `<section class="section"><div class="container"><div class="callout-band"><div class="callout-grid"><div><p class="eyebrow">Next step</p><h2>Tell us what the team needs to stabilize.</h2><p>${esc(spec.contactIntro)}</p><div class="button-row"><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact us</a><a class="button secondary" href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Review services</a></div></div><div><p class="eyebrow">What to include</p><ul class="checklist"><li>The team or location that feels under pressure</li><li>The systems, handoffs, or reports that keep slipping</li><li>The outcome you need in the next quarter</li></ul></div></div></div></div></section>`;
}

function contentServices() {
  return `${pageHero('Services for regulated growth', 'Four connected advisory tracks for service companies that need stronger systems before the next stage of scale.')}<section class="section"><div class="container"><div class="section-header"><div><p class="eyebrow">Service model</p><h2>One operating logic, four practical tracks.</h2></div><p>Clients often begin with one focus area and expand once the first operating change is working. That keeps the work practical and the team engaged.</p></div><div class="grid-4">${serviceCardsPhp()}</div></div></section><section class="section alt"><div class="container"><div class="split-grid"><div class="content-panel"><p class="eyebrow">How it fits together</p><h2>The tracks are separate enough to be useful and connected enough to keep the system coherent.</h2><p>We design each engagement to be an improvement the leadership team can maintain without extra overhead.</p></div><div class="feature-panel"><p class="eyebrow">Best for</p><h3>Teams that need clarity before the next phase of growth.</h3><p>Founders and operators who want stronger oversight without unnecessary bureaucracy.</p><ul class="checklist"><li>Leadership teams that need clearer ownership</li><li>Compliance-sensitive service environments</li><li>Client-facing brands that want consistency</li></ul></div></div></div></section>`;
}

function contentAbout() {
  return `${pageHero('A senior advisory practice with a calm point of view.', 'Meridian Strategy Group helps healthcare, wellness, and professional-services teams build a working operating model, not just a strategy deck.')}<section class="section"><div class="container"><div class="split-grid"><div class="content-panel"><p class="eyebrow">The firm</p><h2>Small team. High leverage. Direct access.</h2><p>We work directly with leaders who need the system to hold under pressure. The style is practical, exacting, and designed to be used after the project ends.</p><div class="summary-grid"><article class="feature-panel"><h3>Calm systems</h3><p>We lower the temperature and tighten the operating rhythm without making the business feel rigid.</p></article><article class="feature-panel"><h3>Clear owners</h3><p>Each routine gets a human owner and a visible checkpoint so work does not disappear between meetings.</p></article></div></div><div class="feature-panel"><img src="${heroImage(imageFiles[5])}" alt=""><p class="eyebrow">Who we serve</p><h3>Healthcare, wellness, and professional services.</h3><p>Organizations where consistency, compliance, and service quality directly affect trust and growth.</p></div></div></div></section><section class="section alt"><div class="container"><div class="section-header"><div><p class="eyebrow">Principles</p><h2>What shapes the work.</h2></div><p>We stay practical, visible, and exact enough to be useful in the real operating rhythm.</p></div><div class="grid-3"><article class="proof-card"><p class="eyebrow">01</p><h3>Clear ownership</h3><p>Every recurring issue gets a named owner and a cadence that keeps it from disappearing.</p></article><article class="proof-card"><p class="eyebrow">02</p><h3>Visible process</h3><p>The tools live where the team works, not in a separate layer nobody remembers to open.</p></article><article class="proof-card"><p class="eyebrow">03</p><h3>Useful outputs</h3><p>We leave behind checklists, dashboards, and playbooks the team can keep using without us.</p></article></div></div></section>`;
}

function contentWork() {
  return `${pageHero('Selected work', 'A look at engagements shaped with editorial care, disciplined operations, and measurable outcomes.')}<section class="section"><div class="container"><div class="grid-3">${caseCardsPhp()}</div></div></section><section class="section alt"><div class="container"><div class="split-grid"><div class="content-panel"><p class="eyebrow">Outcomes</p><h2>What changed after the systems were installed.</h2><p>These projects improved ownership, reduced friction, and gave leadership a cleaner view of what was happening across the business.</p></div><div class="feature-panel"><p class="eyebrow">Project rhythm</p><h3>Short, clear, and measurable.</h3><ul class="checklist"><li>Assess the operating model</li><li>Build the right dashboard or playbook</li><li>Install the cadence and train the team</li><li>Review the results and harden the routines</li></ul></div></div></div></section>`;
}

function contentBlog() {
  return `${pageHero('Studio journal', 'Planning notes and leadership essays from Meridian Strategy Group.')}<section class="section"><div class="container"><div class="resource-grid">${postCardsPhp()}</div></div></section><section class="section alt"><div class="container"><div class="section-header"><div><p class="eyebrow">Why we write</p><h2>Short, practical frameworks for leaders.</h2></div><p>These essays are meant to be used, not admired from a distance.</p></div><div class="grid-3"><article class="proof-card"><h3>Better meetings</h3><p>How to structure a review so the room makes decisions instead of recapping the week.</p></article><article class="proof-card"><h3>Cleaner handoffs</h3><p>The small structural changes that reduce rework and prevent things from falling through the cracks.</p></article><article class="proof-card"><h3>Service consistency</h3><p>Why premium service only feels premium when the standard is visible and trainable.</p></article></div></div></section>`;
}

function contentContact() {
  return `${pageHero('Begin an inquiry', spec.contactIntro)}<section class="section"><div class="container"><div class="split-grid"><form class="contact-panel form-grid"><label>Name<input type="text" name="name"></label><label>Email<input type="email" name="email"></label><label>Organization<select name="organization"><option>Healthcare organization</option><option>Wellness group</option><option>Professional services firm</option><option>Other regulated service company</option></select></label><label>What needs to change?<textarea name="message"></textarea></label><button class="button" type="submit">Send inquiry</button></form><div class="content-panel"><p class="eyebrow">Response expectations</p><h2>What happens next</h2><p>We review the fit, the pressure points, and the scope before suggesting a path forward. If the project is right, you’ll get a concise reply with the next practical step.</p><div class="summary-grid"><article class="feature-panel"><h3>What to include</h3><p>The team size, the location or locations involved, and the pressure you want solved first.</p></article><article class="feature-panel"><h3>Typical fit</h3><p>Teams that need clearer ownership, better reporting, or a cleaner client experience model.</p></article></div><p class="footer-meta">Based in Chicago with remote advisory support.</p></div></div></div></section>`;
}

function contentSingleService() {
  return `${pageHero('Operating Model Design', spec.services[0].detail)}<section class="section"><div class="container"><div class="split-grid"><div class="content-panel"><p class="eyebrow">What is included</p><h2>The pieces we install.</h2><div class="grid-2"><article class="proof-card"><h3>Decision rights</h3><p>Who decides, who approves, and where escalation happens.</p></article><article class="proof-card"><h3>Cadence</h3><p>Weekly and monthly rhythms that keep leadership aligned.</p></article><article class="proof-card"><h3>Playbooks</h3><p>Short routines the team can use without extra explanation.</p></article><article class="proof-card"><h3>Dashboards</h3><p>Useful measures connected to the decisions leaders need to make.</p></article></div></div><div class="feature-panel"><p class="eyebrow">Best for</p><h3>${esc(spec.services[0].audience.join(', '))}</h3><p>${esc(spec.services[0].summary)}</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Discuss your date</a></div></div></div></section><section class="section alt"><div class="container"><div class="section-header"><div><p class="eyebrow">Deliverables</p><h2>What you leave with.</h2></div><p>Every deliverable is practical, trainable, and built to survive real use.</p></div><div class="grid-3"><article class="proof-card"><h3>Operating playbook</h3><p>Clear routines, meeting rhythms, and handoff rules.</p></article><article class="proof-card"><h3>Action tracker</h3><p>A compact view of owners, due dates, and status.</p></article><article class="proof-card"><h3>Review cadence</h3><p>A leadership rhythm that keeps the system current.</p></article></div></div></section>`;
}

function contentPolicy() {
  return `${pageHero('Policies', 'Practical policy content for the theme scaffold.')}<section class="section"><div class="container"><div class="grid-3"><article class="proof-card"><h3>Privacy</h3><p>Information shared through the contact form is used only to respond to the inquiry and assess fit.</p></article><article class="proof-card"><h3>Terms</h3><p>Site content is provided for preview and theme evaluation. Final client arrangements are governed by the project agreement.</p></article><article class="proof-card"><h3>Accessibility</h3><p>The theme aims to keep content readable, navigable, and keyboard-friendly across its preview pages.</p></article></div></div></section>`;
}

function footerContent() {
  return `<div class="footer-strap"><div><p class="eyebrow">Meridian Strategy Group</p><p class="footer-brand-note">${esc(spec.footerSummary)}</p></div><div><p class="eyebrow">Typical engagements</p><p class="footer-meta">Operating model design, compliance readiness, client experience systems, and leadership dashboards.</p></div></div><div class="footer-grid"><div><h3>What we do</h3><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Services</a><a href="<?php echo esc_url( home_url( '/work/' ) ); ?>">Work</a><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Journal</a></div><div><h3>Industries</h3><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Healthcare</a><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Wellness</a><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Professional services</a></div><div><h3>Company</h3><a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>">About</a><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact</a><a href="<?php echo esc_url( home_url( '/single-service/' ) ); ?>">Service detail</a></div><div><h3>Contact</h3><p class="footer-meta">Chicago / Remote advisory</p><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Book a readiness call</a></div></div>`;
}

function previewHeader() {
  return `<header class="nolan-site-header" data-site-header><div class="nolan-header-inner"><a class="nolan-brand" href="homepage_preview.html"><span class="nolan-mark">MS</span><span>${esc(spec.brand)}</span></a><nav class="nolan-primary-nav" aria-label="Primary navigation"><button class="nolan-menu-trigger" type="button" data-menu-item="services" aria-controls="preview-menu-services" aria-expanded="false">Services</button><button class="nolan-menu-trigger" type="button" data-menu-item="about" aria-controls="preview-menu-about" aria-expanded="false">About</button><a href="work_preview.html">Work</a><button class="nolan-menu-trigger" type="button" data-menu-item="blog" aria-controls="preview-menu-blog" aria-expanded="false">Blog</button></nav><div class="nolan-header-actions"><a class="nolan-header-cta" href="contact_preview.html">Contact Us</a><button class="nolan-mobile-toggle" type="button" data-mobile-toggle aria-controls="preview-mobile-drawer" aria-expanded="false">Menu</button></div></div><div class="nolan-menu-backdrop" data-menu-backdrop hidden></div>${servicesPreviewMenu()}${aboutPreviewMenu()}${blogPreviewMenu()}<div class="nolan-mobile-drawer" id="preview-mobile-drawer" data-mobile-drawer hidden><nav aria-label="Mobile navigation"><a href="homepage_preview.html">Home</a><a href="services_preview.html">Services</a><a href="about-us_preview.html">About</a><a href="work_preview.html">Work</a><a href="blog_preview.html">Blog</a><a href="contact_preview.html">Contact Us</a><a href="single_services_preview.html">Service detail</a></nav></div></header>`;
}

function servicesPreviewMenu() {
  return menuPanel('services', 'Services', { title: 'Four advisory tracks, one operating logic.', copy: 'Each engagement is designed to reduce ambiguity and install routines the team can keep running after the project ends.' }, [
    { value: '4', label: 'core advisory tracks' },
    { value: '1', label: 'shared operating model' },
    { value: '5', label: 'steps in the install cadence' },
    { value: '15+', label: 'years of senior experience' }
  ], [
    { key: 'model', label: 'Operating Model' },
    { key: 'compliance', label: 'Compliance Readiness' },
    { key: 'experience', label: 'Client Systems' },
    { key: 'dashboards', label: 'Leadership Dashboards' }
  ], [
    {
      key: 'model',
      kicker: 'Design and ownership',
      title: 'Operating Model Design',
      lead: 'Clarify how decisions move, who owns what, and how the team keeps work moving when the founder is not in the room.',
      cards: [
        { eyebrow: 'What we change', title: 'Decision rights and cadence', copy: 'We reduce rework by defining who decides, who approves, and when leadership should review.', points: ['Role clarity for managers', 'Weekly and monthly rhythm', 'Escalation rules for edge cases'] },
        { eyebrow: 'What it looks like', title: 'Operating playbook', copy: 'A compact, readable playbook that turns the operating model into routines people can use immediately.', points: ['Meeting agenda templates', 'Team handoff rules', 'Decision log structure'] },
        { eyebrow: 'Outcome', title: 'Less noise, more accountability', copy: 'The team spends less time clarifying and more time executing with a shared standard.', points: ['Reduced executive interruption', 'Cleaner ownership map', 'Faster follow-through'] }
      ],
      links: [
        { label: 'Explore services', href: 'services_preview.html' },
        { label: 'See work', href: 'work_preview.html' }
      ]
    },
    {
      key: 'compliance',
      kicker: 'Audit readiness',
      title: 'Compliance Readiness',
      lead: 'Turn compliance into a practical operating routine with evidence, controls, and review points that fit the team’s actual workflow.',
      cards: [
        { eyebrow: 'What we map', title: 'Policies, evidence, and risk', copy: 'We identify the gaps, trace evidence collection, and put the highest-risk items into one review lane.', points: ['Policy gap scan', 'Evidence collection map', 'Risk-priority remediation'] },
        { eyebrow: 'What we install', title: 'Readiness cadence', copy: 'Regular check-ins, ownership lists, and simple audit prep make readiness sustainable instead of frantic.', points: ['Monthly checkpoints', 'Assigned evidence owners', 'Escalation workflow'] },
        { eyebrow: 'Outcome', title: 'Better audit posture', copy: 'You get a calmer operating environment and less last-minute scramble when outside review shows up.', points: ['Lower risk exposure', 'Faster response time', 'More stable controls'] }
      ],
      links: [
        { label: 'Readiness work', href: 'services_preview.html' },
        { label: 'Contact us', href: 'contact_preview.html' }
      ]
    },
    {
      key: 'experience',
      kicker: 'Service design',
      title: 'Client Experience Systems',
      lead: 'Create a premium service journey that feels consistent to the client and simple to train across the team.',
      cards: [
        { eyebrow: 'What we build', title: 'Journey and touchpoint map', copy: 'We chart the client path from inquiry to delivery and identify where standards drift.', points: ['Inquiry flow', 'Onboarding rhythm', 'Delivery checkpoints'] },
        { eyebrow: 'What we document', title: 'Communication playbooks', copy: 'Use short scripts and response rules so the brand voice stays calm and clear under pressure.', points: ['Response time standards', 'Message templates', 'Quality review points'] },
        { eyebrow: 'Outcome', title: 'Consistent premium service', copy: 'Clients feel the quality in every touchpoint because the whole team works from the same standard.', points: ['Better retention', 'Cleaner handoffs', 'Less service variance'] }
      ],
      links: [
        { label: 'View service detail', href: 'single_services_preview.html' },
        { label: 'Review work', href: 'work_preview.html' }
      ]
    },
    {
      key: 'dashboards',
      kicker: 'Leadership visibility',
      title: 'Leadership Dashboards',
      lead: 'Give leaders a compact view of capacity, quality, compliance, and financial pressure so decisions happen in the right room.',
      cards: [
        { eyebrow: 'What we surface', title: 'Useful metrics only', copy: 'We define the measures that matter and cut the noise that does not help the next decision.', points: ['Capacity and load', 'Risk and remediation', 'Quality and satisfaction'] },
        { eyebrow: 'What it supports', title: 'Weekly leadership review', copy: 'A short, predictable review cadence keeps the team aligned without turning into a reporting exercise.', points: ['Decision prompts', 'Escalation cues', 'Action ownership'] },
        { eyebrow: 'Outcome', title: 'Faster leadership response', copy: 'Executives can see the signal sooner and act with less friction.', points: ['More confident decisions', 'Fewer blind spots', 'Shared operational truth'] }
      ],
      links: [
        { label: 'Review outcomes', href: 'work_preview.html' },
        { label: 'Read the journal', href: 'blog_preview.html' }
      ]
    }
  ], imageFiles[1]);
}

function aboutPreviewMenu() {
  return menuPanel('about', 'About', { title: 'Senior operators with a calm point of view.', copy: 'We work with teams that need practical systems, sharper ownership, and a steady hand while the business keeps moving.' }, [
    { value: '3', label: 'guiding principles' },
    { value: '2', label: 'sectors served' },
    { value: '1', label: 'shared standard' },
    { value: '0', label: 'dramatic theatre' }
  ], [
    { key: 'firm', label: 'The Firm' },
    { key: 'principles', label: 'Principles' },
    { key: 'sectors', label: 'Sectors' }
  ], [
    {
      key: 'firm',
      kicker: 'Who we are',
      title: 'The firm behind the framework',
      lead: 'Meridian Strategy Group is a senior advisory practice for regulated service companies that want to scale with control.',
      cards: [
        { eyebrow: 'How we work', title: 'Small team, high leverage', copy: 'You work directly with senior operators who can see the system, not just one department.', points: ['Direct engagement', 'Opinionated structure', 'Clear deliverables'] },
        { eyebrow: 'How it feels', title: 'Calm and exacting', copy: 'We keep the work precise and useful so leaders can keep momentum while the operating model changes.', points: ['No theater', 'Practical cadence', 'Finished artifacts'] },
        { eyebrow: 'What stays behind', title: 'Tools the team keeps', copy: 'The engagement ends with artifacts that can be maintained internally without special help.', points: ['Playbooks', 'Dashboards', 'Checklists'] }
      ],
      links: [
        { label: 'About us', href: 'about-us_preview.html' },
        { label: 'View work', href: 'work_preview.html' }
      ]
    },
    {
      key: 'principles',
      kicker: 'How we think',
      title: 'Principles that shape the work',
      lead: 'We keep the advisory model simple enough to maintain and specific enough to change behavior.',
      cards: [
        { eyebrow: '1', title: 'Clear ownership', copy: 'If nobody owns it, the issue will return. Every system needs a human owner.', points: ['Named responsibility', 'Review cadence', 'Escalation path'] },
        { eyebrow: '2', title: 'Visible process', copy: 'The best operating system is visible where the work already happens.', points: ['Shared tools', 'Visible standards', 'Repeatable routines'] },
        { eyebrow: '3', title: 'Action over theory', copy: 'We prefer a working checklist over a perfect concept deck.', points: ['Practical deliverables', 'Fast adoption', 'Simple maintenance'] }
      ],
      links: [
        { label: 'Service model', href: 'services_preview.html' },
        { label: 'Journal', href: 'blog_preview.html' }
      ]
    },
    {
      key: 'sectors',
      kicker: 'Industry focus',
      title: 'Where the practice fits best',
      lead: 'We work where process quality, compliance, and service consistency affect the brand and the bottom line.',
      cards: [
        { eyebrow: 'Healthcare', title: 'Clinical and administrative teams', copy: 'Multi-location practices, specialist clinics, and care groups that need clear operating standards.', points: ['Patient flow', 'Risk control', 'Reporting cadence'] },
        { eyebrow: 'Wellness', title: 'Premium service brands', copy: 'Wellness groups that want high-touch service to feel repeatable across providers and locations.', points: ['Client journey', 'Service consistency', 'Team training'] },
        { eyebrow: 'Professional services', title: 'Advisory and client firms', copy: 'Founders and operations leaders who want better dashboards, better ownership, and cleaner delivery.', points: ['Leadership cadence', 'Project visibility', 'Quality control'] }
      ],
      links: [
        { label: 'See services', href: 'services_preview.html' },
        { label: 'Contact us', href: 'contact_preview.html' }
      ]
    }
  ], imageFiles[2]);
}

function blogPreviewMenu() {
  return menuPanel('blog', 'Blog', { title: 'Notes from real advisory work.', copy: 'The journal is where we share practical observations on leadership, compliance, and service design without the jargon.' }, [
    { value: '3', label: 'recent essays' },
    { value: '6', label: 'planning guides' },
    { value: '1', label: 'shared editorial lens' },
    { value: '0', label: 'stock phrases allowed' }
  ], [
    { key: 'latest', label: 'Latest' },
    { key: 'guides', label: 'Guides' },
    { key: 'notes', label: 'Field Notes' }
  ], [
    {
      key: 'latest',
      kicker: 'Newest writing',
      title: 'Recent notes on operating discipline',
      lead: 'A concise set of essays on how to turn strategy into routines that teams can keep using.',
      cards: [
        { eyebrow: 'Leadership Systems', title: 'What a useful dashboard actually needs to show', copy: 'How to keep the executive view compact enough to use weekly and clear enough to drive action.', points: ['Decision-focused metrics', 'Weekly review cadence', 'Action ownership'] },
        { eyebrow: 'Compliance', title: 'How to install routines people will keep using', copy: 'Evidence, review, and escalation practices that work inside a real team calendar.', points: ['Low-friction routines', 'Clear evidence owners', 'Simple standards'] },
        { eyebrow: 'Service Design', title: 'Why client experience breaks when ownership is unclear', copy: 'How to turn the promise into a repeatable journey the whole team can deliver.', points: ['Journey mapping', 'Communication rules', 'Quality checkpoints'] }
      ],
      links: [
        { label: 'Read the journal', href: 'blog_preview.html' }
      ]
    },
    {
      key: 'guides',
      kicker: 'Short frameworks',
      title: 'Practical guides for leaders',
      lead: 'Use these quick reads to sharpen meetings, handoffs, and operating reviews.',
      cards: [
        { eyebrow: 'Guide', title: 'Planning a better leadership meeting', copy: 'A short structure for reviews that produce decisions instead of summaries.', points: ['Pre-read format', 'Decision list', 'Action log'] },
        { eyebrow: 'Guide', title: 'Installing a workable compliance cadence', copy: 'A routine leaders can keep using after the project ends.', points: ['Monthly check-ins', 'Risk tracking', 'Evidence review'] },
        { eyebrow: 'Guide', title: 'Turning service standards into habits', copy: 'How to make premium service visible, teachable, and measurable.', points: ['Service checkpoints', 'Voice standards', 'Training cues'] }
      ],
      links: [
        { label: 'Browse guides', href: 'blog_preview.html' }
      ]
    },
    {
      key: 'notes',
      kicker: 'Field notes',
      title: 'What we notice in the work',
      lead: 'Quick observations from real projects where the pressure is high and the time is limited.',
      cards: [
        { eyebrow: 'Observation', title: 'Good teams still need a shared definition of done', copy: 'Otherwise quality depends on who happened to be in the room.', points: ['Clear standard', 'Visible checklists', 'Shared finish line'] },
        { eyebrow: 'Observation', title: 'Dashboards work when they drive a decision', copy: 'If the metric does not change what happens next, it is probably not useful.', points: ['Decision relevance', 'Weekly use', 'Short format'] },
        { eyebrow: 'Observation', title: 'The calmest brands usually have the strictest systems', copy: 'Consistency reads as luxury when the operating model is doing its job.', points: ['Reliable service', 'Stable cadence', 'Less friction'] }
      ],
      links: [
        { label: 'Contact us', href: 'contact_preview.html' }
      ]
    }
  ], imageFiles[3]);
}

function previewFooter() {
  return previewify(`<footer class="site-footer">${footerContent()}</footer>`);
}

function shell(title, body, isPreview = false) {
  const header = isPreview ? previewify(previewHeader()) : '<?php get_header(); ?>';
  const footer = isPreview ? previewFooter() : '<?php get_footer(); ?>';
  const scriptTag = isPreview ? '<script src="assets/js/preview.js"></script>' : '';
  const renderedBody = isPreview ? previewify(body) : body;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} | Meridian Strategy Group</title><link rel="stylesheet" href="${isPreview ? 'assets/css/preview.css' : ''}"></head><body>${header}<main id="primary" class="site-main">${renderedBody}</main>${footer}${scriptTag}</body></html>`;
}

function writeThemeFiles() {
  write(path.join(themeDir, 'style.css'), `/*
Theme Name: Nolan Showcase Theme 03
Theme URI: https://nolan.local/
Author: Nolan Young
Description: Premium classic WordPress theme for Meridian Strategy Group, a boutique operations and compliance advisory firm.
Version: 1.0.0
License: GPL-2.0-or-later
Text Domain: nolan-showcase-theme-03
*/`);
  write(path.join(themeDir, 'header.php'), `<?php
/**
 * Theme header.
 *
 * @package Nolan_Showcase_Theme_03
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
<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'nolan-showcase-theme-03' ); ?></a>
<header class="nolan-site-header" data-site-header>
  <div class="nolan-header-inner">
    <a class="nolan-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
      <span class="nolan-mark">MS</span>
      <span>${spec.brand}</span>
    </a>
    <nav class="nolan-primary-nav" aria-label="<?php esc_attr_e( 'Primary navigation', 'nolan-showcase-theme-03' ); ?>">
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
    <nav aria-label="<?php esc_attr_e( 'Mobile navigation', 'nolan-showcase-theme-03' ); ?>">
      <a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Services</a>
      <a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>">About</a>
      <a href="<?php echo esc_url( home_url( '/work/' ) ); ?>">Work</a>
      <a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Blog</a>
      <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a>
      <a href="<?php echo esc_url( home_url( '/single-service/' ) ); ?>">Service detail</a>
    </nav>
  </div>
</header>
<main id="primary" class="site-main">`);
  write(path.join(themeDir, 'footer.php'), `</main>
<footer class="site-footer">
  ${footerContent()}
</footer>
<?php wp_footer(); ?>
</body>
</html>`);
  write(path.join(themeDir, 'front-page.php'), `<?php get_header(); ?>
<?php
/* Template map: content-home-hero, content-home-services, content-home-proof, content-home-work, content-home-process, content-home-testimonials, content-blog-preview, content-home-cta. */
?>
<?php get_template_part( 'template-parts/content', 'home-hero' ); ?>
<?php get_template_part( 'template-parts/content', 'home-services' ); ?>
<?php get_template_part( 'template-parts/content', 'home-proof' ); ?>
<?php get_template_part( 'template-parts/content', 'home-work' ); ?>
<?php get_template_part( 'template-parts/content', 'home-process' ); ?>
<?php get_template_part( 'template-parts/content', 'home-testimonials' ); ?>
<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>
<?php get_template_part( 'template-parts/content', 'home-cta' ); ?>
<?php get_footer(); ?>`);
  write(path.join(themeDir, 'index.php'), `<?php get_header(); ?><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', get_post_type() ); endwhile; else : get_template_part( 'template-parts/content', 'none' ); endif; get_footer(); ?>`);
  write(path.join(themeDir, 'page.php'), `<?php get_header(); ?><?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'page' ); endwhile; get_footer(); ?>`);
  write(path.join(themeDir, 'single.php'), `<?php get_header(); ?><?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'single' ); endwhile; get_footer(); ?>`);
  write(path.join(themeDir, 'archive.php'), `<?php get_header(); ?><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', get_post_type() ); endwhile; else : get_template_part( 'template-parts/content', 'none' ); endif; get_footer(); ?>`);
  write(path.join(themeDir, 'search.php'), `<?php get_header(); ?><?php get_template_part( 'template-parts/content', 'search' ); get_footer(); ?>`);
  write(path.join(themeDir, 'searchform.php'), `<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>"><label><span class="screen-reader-text"><?php esc_html_e( 'Search for:', 'nolan-showcase-theme-03' ); ?></span><input type="search" class="search-field" aria-label="<?php esc_attr_e( 'Search', 'nolan-showcase-theme-03' ); ?>" value="<?php echo get_search_query(); ?>" name="s"></label><button type="submit" class="button"><?php esc_html_e( 'Search', 'nolan-showcase-theme-03' ); ?></button></form>`);
  write(path.join(themeDir, '404.php'), `<?php get_header(); ?><section class="page-hero"><div class="container"><p class="eyebrow">Meridian Strategy Group</p><h1>Page not found</h1><p>That page does not exist in this preview theme. Use the navigation to return to the homepage or one of the internal pages.</p></div></section><?php get_footer(); ?>`);
  write(path.join(themeDir, '403.php'), `<?php get_header(); ?><section class="page-hero"><div class="container"><p class="eyebrow">Meridian Strategy Group</p><h1>Access restricted</h1><p>This page is not available in the current preview build.</p></div></section><?php get_footer(); ?>`);
  write(path.join(themeDir, 'comments.php'), `<?php if ( post_password_required() ) { return; } ?><section class="section"><div class="container"><div class="content-panel"><h2>Comments</h2><p>Comments are available when the WordPress content model requires them.</p></div></div></section>`);
  write(path.join(themeDir, 'functions.php'), `<?php
/**
 * Theme setup.
 *
 * @package Nolan_Showcase_Theme_03
 */

require_once get_template_directory() . '/inc/setup.php';
require_once get_template_directory() . '/inc/enqueue.php';
require_once get_template_directory() . '/inc/helpers.php';
require_once get_template_directory() . '/inc/template-tags.php';
require_once get_template_directory() . '/inc/custom-post-types.php';
require_once get_template_directory() . '/inc/customizer.php';
require_once get_template_directory() . '/inc/forms.php';
require_once get_template_directory() . '/inc/newsletter.php';
require_once get_template_directory() . '/inc/policy-routing.php';
`);
  write(path.join(themeDir, 'README.md'), `# Nolan Showcase Theme 03\n\nPremium classic WordPress theme for Meridian Strategy Group.\n`);
  write(path.join(themeDir, 'docs', 'getting-started.md'), `# Getting Started\n\nUse this theme as a premium advisory-company baseline.\n`);
  write(path.join(themeDir, 'docs', 'customization.md'), `# Customization\n\nUpdate the business name, services, and case studies to fit the client.\n`);
  write(path.join(themeDir, 'accessibility', 'README.md'), `# Accessibility\n\nKeyboard navigation, visible focus, and clear structure are built into the theme.\n`);
  write(path.join(themeDir, 'blocks', 'README.md'), '# Blocks\n\nClassic theme scaffold reference for the advisory theme.\n');
  write(path.join(themeDir, 'template-parts', 'content-home-hero.php'), contentHomeHero() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-home-services.php'), contentHomeServices() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-home-proof.php'), contentHomeProof() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-home-work.php'), contentHomeWork() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-home-process.php'), contentHomeProcess() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-home-testimonials.php'), contentHomeTestimonials() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-blog-preview.php'), contentBlogPreview() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-home-cta.php'), contentHomeCta() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-mega-menu.php'), `${servicesMenu()}${aboutMenu()}${blogMenu()}\n`);
  write(path.join(themeDir, 'template-parts', 'content-services.php'), contentServices() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-about.php'), contentAbout() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-work.php'), contentWork() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-blog.php'), contentBlog() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-contact.php'), contentContact() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-single-service.php'), contentSingleService() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-single-service-highlight.php'), pageHero('Operating Model Design', spec.services[0].summary) + '\n');
  write(path.join(themeDir, 'template-parts', 'content-brand-statement.php'), `<section class="section alt"><div class="container"><div class="content-panel"><p class="eyebrow">Operating clarity</p><h2>Calm systems, clear owners, measurable progress.</h2><p>${esc(spec.heroCopy)}</p></div></div></section>\n`);
  write(path.join(themeDir, 'template-parts', 'content-style-pillars.php'), `<section class="section"><div class="container"><div class="grid-3"><article class="proof-card"><h3>Clarity</h3><p>Every action has a clear owner, deadline, and review path.</p></article><article class="proof-card"><h3>Consistency</h3><p>Standards remain visible and usable where the work happens.</p></article><article class="proof-card"><h3>Control</h3><p>Leadership sees the signal early enough to act.</p></article></div></div></section>\n`);
  write(path.join(themeDir, 'template-parts', 'content-footer-widgets.php'), `<div class="footer-strap"><div><p class="eyebrow">${esc(spec.brand)}</p><p class="footer-brand-note">${esc(spec.footerSummary)}</p></div><div><p class="footer-meta">Operating model design, compliance readiness, client experience systems, and leadership dashboards.</p></div></div>\n`);
  write(path.join(themeDir, 'template-parts', 'content-featured-work.php'), `<section class="section"><div class="container"><div class="grid-3">${caseCardsPhp()}</div></div></section>\n`);
  write(path.join(themeDir, 'template-parts', 'content-all-services.php'), `<section class="section"><div class="container"><div class="grid-4">${serviceCardsPhp()}</div></div></section>\n`);
  write(path.join(themeDir, 'template-parts', 'content-cta-banner.php'), contentHomeCta() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-process.php'), `<section class="section alt"><div class="container"><div class="timeline">${processCardsPhp()}</div></div></section>\n`);
  write(path.join(themeDir, 'template-parts', 'content-testimonials.php'), `<section class="section"><div class="container"><div class="quote-grid">${testimonialCardsPhp()}</div></div></section>\n`);
  write(path.join(themeDir, 'template-parts', 'content-policy.php'), contentPolicy() + '\n');
  write(path.join(themeDir, 'template-parts', 'content-page.php'), `<section class="page-hero"><div class="container"><p class="eyebrow">${esc(spec.brand)}</p><h1><?php the_title(); ?></h1><p><?php the_excerpt(); ?></p></div></section><section class="section"><div class="container"><div class="content-panel"><?php the_content(); ?></div></div></section>\n`);
  write(path.join(themeDir, 'template-parts', 'content-single.php'), `<section class="page-hero"><div class="container"><p class="eyebrow">${esc(spec.brand)}</p><h1><?php the_title(); ?></h1><p><?php echo wp_kses_post( get_the_excerpt() ); ?></p></div></section><section class="section"><div class="container"><div class="content-panel"><?php the_content(); ?></div></div></section>\n`);
  write(path.join(themeDir, 'template-parts', 'content-none.php'), `<section class="section"><div class="container"><div class="content-panel"><p>No content found.</p></div></div></section>\n`);
  write(path.join(themeDir, 'template-parts', 'content-search.php'), `<section class="section"><div class="container"><div class="content-panel"><h2>Search results</h2><p><?php echo esc_html( get_search_query() ); ?></p></div></div></section>\n`);
  write(path.join(themeDir, 'template-parts', 'content-hero.php'), heroPhp() + '\n');
  write(path.join(themeDir, 'page-templates', 'template-about-us.php'), `<?php get_header(); ?><?php get_template_part( 'template-parts/content', 'about' ); ?><?php get_footer(); ?>`);
  write(path.join(themeDir, 'page-templates', 'template-services.php'), `<?php get_header(); ?><?php get_template_part( 'template-parts/content', 'services' ); ?><?php get_footer(); ?>`);
  write(path.join(themeDir, 'page-templates', 'template-single-service.php'), `<?php get_header(); ?><?php get_template_part( 'template-parts/content', 'single-service' ); ?><?php get_footer(); ?>`);
  write(path.join(themeDir, 'page-templates', 'template-work.php'), `<?php get_header(); ?><?php get_template_part( 'template-parts/content', 'work' ); ?><?php get_footer(); ?>`);
  write(path.join(themeDir, 'page-templates', 'template-blog.php'), `<?php get_header(); ?><?php get_template_part( 'template-parts/content', 'blog' ); ?><?php get_footer(); ?>`);
  write(path.join(themeDir, 'page-templates', 'template-contact.php'), `<?php get_header(); ?><?php get_template_part( 'template-parts/content', 'contact' ); ?><?php get_footer(); ?>`);
  write(path.join(themeDir, 'page-templates', 'template-policy.php'), `<?php get_header(); ?><?php get_template_part( 'template-parts/content', 'policy' ); ?><?php get_footer(); ?>`);
  write(path.join(themeDir, 'src', 'js', 'main.js'), baseJs);
  write(path.join(themeDir, 'src', 'scss', 'main.scss'), css);
}

function writePreviewFiles() {
  write(path.join(previewDir, 'assets', 'css', 'preview.css'), css);
  write(path.join(previewDir, 'assets', 'js', 'preview.js'), baseJs);
  write(path.join(previewDir, 'README.md'), '# Nolan Showcase Theme 03 Preview\n\nStatic preview for Meridian Strategy Group.\n');
  write(path.join(previewDir, 'assets', 'images', 'README.md'), '# Preview Images\n\nLocal generated raster assets for Meridian Strategy Group.\n');
  imageFiles.forEach((file, index) => {
    writeBin(path.join(previewDir, 'assets', 'images', file), makePng(1400, 900, index + 10));
  });
  const home = `${contentHomeHero()}${contentHomeServices()}${contentHomeProof()}${contentHomeWork()}${contentHomeProcess()}${contentHomeTestimonials()}${contentBlogPreview()}${contentHomeCta()}`;
  write(path.join(previewDir, 'homepage_preview.html'), shell('Home', home, true));
  write(path.join(previewDir, 'index.html'), shell('Home', home, true));
  write(path.join(previewDir, 'services_preview.html'), shell('Services', contentServices(), true));
  write(path.join(previewDir, 'about-us_preview.html'), shell('About Us', contentAbout(), true));
  write(path.join(previewDir, 'work_preview.html'), shell('Work', contentWork(), true));
  write(path.join(previewDir, 'blog_preview.html'), shell('Blog', contentBlog(), true));
  write(path.join(previewDir, 'single_services_preview.html'), shell('Single Service', contentSingleService(), true));
  write(path.join(previewDir, 'contact_preview.html'), shell('Contact', contentContact(), true));
}

function writeImages() {
  fs.rmSync(path.join(themeDir, 'assets', 'images'), { recursive: true, force: true });
  fs.rmSync(path.join(previewDir, 'assets', 'images'), { recursive: true, force: true });
  imageFiles.forEach((file, index) => {
    const png = makePng(1400, 900, index + 1);
    const folder = index < 2 ? 'hero' : index < 5 ? 'portfolio' : 'texture';
    writeBin(path.join(themeDir, 'assets', 'images', folder, file), png);
    writeBin(path.join(previewDir, 'assets', 'images', file), png);
  });
  writeBin(path.join(themeDir, 'screenshot.png'), makePng(1280, 960, 42));
}

function updateGallery() {
  const gallery = path.join(root, 'docs', 'index.html');
  let html = fs.readFileSync(gallery, 'utf8');
  const href = `themes/${slug}/homepage_preview.html`;
  if (!html.includes(href)) {
    const card = `\n        <article class="theme-card">\n          <p class="eyebrow">${slug}</p>\n          <h3>Nolan Showcase Theme 03</h3>\n          <p>Premium Meridian Strategy Group WordPress theme with richer homepage, templates, and menu details.</p>\n          <p><a href="${href}">Open preview</a></p>\n        </article>\n`;
    html = html.replace(/(\s*<\/section>\s*<\/main>)/, `${card}$1`);
    fs.writeFileSync(gallery, html, 'utf8');
  }
}

function writeReports() {
  const runDir = path.join(root, 'reports', 'runs', slug);
  ensureDir(runDir);
  write(path.join(runDir, 'ollama-site-content.json'), JSON.stringify(spec, null, 2));
  write(path.join(runDir, 'selected-prompt.txt'), fs.readFileSync(path.join(root, 'prompts', 'pending', '00-first-ollama-baseline-professional-services.txt'), 'utf8'));
  write(path.join(runDir, 'plan.md'), `# Theme 03 Plan\n\n1. Use the theme 01 scaffold as a base.\n2. Upgrade the homepage with layered sections and proof bands.\n3. Add deeper dropdown panels and more detailed internal page layouts.\n4. Keep the build local-only and validate the result.\n`);
  write(path.join(runDir, 'run-metadata.md'), `# Run Metadata\n\n- slug: ${slug}\n- source: ${sourceSlug}\n- model: qwen2.5-coder:14b\n- mode: ollama-only\n- brand: ${spec.brand}\n`);
  write(path.join(runDir, 'ollama-planner-prompt.md'), `Create a plan for a premium operations and compliance advisory theme.\n`);
  write(path.join(runDir, 'ollama-builder-prompt.md'), `Build a richer premium WordPress theme with deeper homepage, page templates, and menu detail.\n`);
}

copyScaffold();
replaceTextInDir(themeDir);
replaceTextInDir(previewDir);
writeThemeFiles();
writePreviewFiles();
writeImages();
updateGallery();
writeReports();
console.log(`Generated ${slug} from local Ollama-inspired advisory spec.`);
