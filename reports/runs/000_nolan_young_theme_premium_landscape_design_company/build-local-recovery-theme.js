const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname, '..', '..', '..');
const slug = '000_nolan_young_theme_premium_landscape_design_company';
const themeDir = path.join(root, 'wp-content', 'themes', slug);
const previewDir = path.join(root, 'docs', 'themes', slug);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function writeText(relativePath, content) {
  write(path.join(root, relativePath), content.trimStart());
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c >>> 0;
}

function crc32(buffers) {
  let crc = 0xffffffff;
  for (const buffer of buffers) {
    for (const byte of buffer) {
      crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data = Buffer.alloc(0)) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32([typeBuffer, data]), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function makePng(width, height, start, end, accent) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    const t = y / Math.max(1, height - 1);
    for (let x = 0; x < width; x += 1) {
      const wave = (Math.sin((x / width) * Math.PI * 3 + t * 5) + 1) / 2;
      const n = x / Math.max(1, width - 1);
      const i = row + 1 + x * 4;
      raw[i] = Math.round(start[0] * (1 - t) + end[0] * t + accent[0] * wave * 0.16 * n);
      raw[i + 1] = Math.round(start[1] * (1 - t) + end[1] * t + accent[1] * wave * 0.12);
      raw[i + 2] = Math.round(start[2] * (1 - t) + end[2] * t + accent[2] * wave * 0.1);
      raw[i + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND'),
  ]);
}

const images = [
  ['hero/garden-pathway-dawn.png', [34, 55, 42], [210, 192, 160], [126, 151, 92]],
  ['hero/outdoor-terrace-evening.png', [25, 38, 34], [176, 137, 91], [96, 118, 77]],
  ['portfolio/courtyard-retreat.png', [57, 75, 53], [217, 206, 178], [145, 114, 78]],
  ['portfolio/stonework-garden-room.png', [92, 88, 76], [196, 184, 154], [57, 83, 57]],
  ['portfolio/outdoor-dining-terrace.png', [49, 65, 48], [190, 142, 94], [227, 209, 170]],
  ['texture/planting-plan-detail.png', [231, 224, 204], [109, 129, 82], [58, 72, 50]],
  ['texture/limestone-bronze-texture.png', [177, 166, 142], [83, 65, 48], [218, 199, 154]],
  ['texture/seasonal-planting-texture.png', [65, 91, 58], [206, 190, 126], [149, 80, 58]],
];

function createImages() {
  for (const [name, start, end, accent] of images) {
    const buffer = makePng(1200, 820, start, end, accent);
    write(path.join(themeDir, 'assets', 'images', name), buffer);
    write(path.join(previewDir, 'assets', 'images', path.basename(name)), buffer);
  }
  write(path.join(themeDir, 'screenshot.png'), makePng(1200, 900, [32, 51, 40], [216, 197, 160], [133, 150, 93]));
}

const css = `
:root {
  --color-ink: #20251f;
  --color-garden: #263d2f;
  --color-moss: #6f7f4e;
  --color-limestone: #e7dfcc;
  --color-cream: #f8f2e5;
  --color-bronze: #9a724b;
  --color-clay: #b65f43;
  --color-charcoal: #2f332e;
  --font-display: Georgia, "Times New Roman", serif;
  --font-body: "Trebuchet MS", Verdana, sans-serif;
  --shadow-soft: 0 24px 60px rgba(32, 37, 31, 0.14);
  --radius-large: 30px;
  --radius-card: 20px;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; color: var(--color-ink); background: var(--color-cream); font-family: var(--font-body); line-height: 1.7; }
a { color: inherit; }
img { max-width: 100%; display: block; border-radius: var(--radius-card); }
.skip-link { position: absolute; left: -999px; top: auto; }
.skip-link:focus { left: 1rem; top: 1rem; z-index: 10000; background: var(--color-ink); color: white; padding: .75rem 1rem; }
.container { width: min(1140px, calc(100% - 36px)); margin: 0 auto; }
.section { padding: clamp(4rem, 8vw, 7rem) 0; position: relative; }
.section.alt { background: linear-gradient(135deg, #efe6d3, #d9d0b9); }
.section-heading { max-width: 760px; margin-bottom: 2.5rem; }
.eyebrow { letter-spacing: .14em; text-transform: uppercase; font-size: .76rem; color: var(--color-bronze); font-weight: 700; }
h1, h2, h3, h4 { font-family: var(--font-display); line-height: 1.05; color: var(--color-garden); margin: 0 0 1rem; }
h1 { font-size: clamp(3.6rem, 8vw, 7.5rem); letter-spacing: -.055em; }
h2 { font-size: clamp(2.4rem, 5vw, 4.8rem); letter-spacing: -.04em; }
h3 { font-size: clamp(1.45rem, 2.1vw, 2.1rem); }
p { margin: 0 0 1.15rem; }
.lede { font-size: clamp(1.1rem, 1.6vw, 1.34rem); max-width: 760px; color: rgba(32, 37, 31, .76); }
.button, button.button { display: inline-flex; align-items: center; justify-content: center; gap: .45rem; border: 1px solid var(--color-garden); background: var(--color-garden); color: white; text-decoration: none; padding: .9rem 1.25rem; border-radius: 999px; font-weight: 700; cursor: pointer; transition: transform .2s ease, background .2s ease; }
.button:hover, button.button:hover { transform: translateY(-2px); background: #14251c; }
.button.ghost { background: transparent; color: var(--color-garden); }
.nolan-site-header { position: sticky; top: 0; z-index: 100; background: rgba(248, 242, 229, .92); backdrop-filter: blur(18px); border-bottom: 1px solid rgba(38, 61, 47, .12); }
.nolan-header-inner { width: min(1180px, calc(100% - 28px)); margin: 0 auto; min-height: 84px; display: flex; align-items: center; gap: 1.25rem; }
.nolan-brand { text-decoration: none; display: inline-flex; align-items: center; gap: .65rem; font-weight: 800; color: var(--color-garden); }
.nolan-mark { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; background: var(--color-garden); color: var(--color-cream); font-family: var(--font-display); }
.nolan-primary-nav { margin-left: auto; display: flex; align-items: center; gap: .45rem; }
.nolan-primary-nav a, .nolan-menu-trigger { border: 0; background: transparent; color: var(--color-ink); text-decoration: none; font: inherit; font-weight: 700; padding: .75rem .85rem; cursor: pointer; border-radius: 999px; }
.nolan-primary-nav a:hover, .nolan-menu-trigger:hover, .nolan-menu-trigger[aria-expanded="true"] { background: rgba(38, 61, 47, .09); }
.nolan-header-actions { display: flex; gap: .75rem; align-items: center; }
.nolan-header-cta { text-decoration: none; background: var(--color-bronze); color: white; border-radius: 999px; padding: .78rem 1rem; font-weight: 800; }
.nolan-mobile-toggle { display: none; border: 1px solid rgba(38, 61, 47, .28); background: transparent; border-radius: 999px; padding: .7rem .95rem; font-weight: 800; }
.nolan-menu-backdrop { position: fixed; inset: 84px 0 0; background: rgba(32, 37, 31, .18); }
.nolan-menu-dropdown { position: fixed; left: 50%; top: 86px; transform: translateX(-50%); width: min(1060px, calc(100vw - 32px)); background: #fbf7ed; border: 1px solid rgba(38, 61, 47, .14); border-radius: 28px; box-shadow: var(--shadow-soft); padding: 1.2rem; z-index: 130; }
.nolan-menu-panel { display: grid; grid-template-columns: 260px 1fr; gap: 1rem; }
.nolan-menu-rail { display: grid; gap: .5rem; align-content: start; border-right: 1px solid rgba(38, 61, 47, .14); padding-right: 1rem; }
.nolan-menu-rail button { text-align: left; border: 0; background: transparent; padding: .85rem; border-radius: 16px; font-weight: 800; color: var(--color-garden); cursor: pointer; }
.nolan-menu-rail button[aria-expanded="true"] { background: var(--color-limestone); }
.nolan-rail-content[hidden], .nolan-menu-dropdown[hidden], .nolan-menu-backdrop[hidden], .nolan-mobile-drawer[hidden] { display: none; }
.nolan-menu-content { padding: .4rem .8rem; }
.nolan-menu-link-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .8rem; margin-top: 1rem; }
.nolan-menu-card { border: 1px solid rgba(38, 61, 47, .14); border-radius: 18px; padding: 1rem; text-decoration: none; background: white; }
.nolan-mobile-drawer { position: fixed; inset: 84px 16px auto; background: var(--color-garden); color: white; border-radius: 24px; padding: 1.25rem; z-index: 140; box-shadow: var(--shadow-soft); }
.nolan-mobile-drawer nav { display: grid; gap: .8rem; }
.nolan-mobile-drawer a { color: white; text-decoration: none; font-size: 1.25rem; font-weight: 800; }
body.nolan-menu-open { overflow: hidden; }
.hero { padding: clamp(5rem, 9vw, 8rem) 0; background: radial-gradient(circle at 75% 20%, rgba(154, 114, 75, .25), transparent 34%), linear-gradient(135deg, #f8f2e5, #dfd4bd); overflow: hidden; }
.hero-grid { display: grid; grid-template-columns: minmax(0, 1.02fr) minmax(320px, .88fr); gap: clamp(2rem, 5vw, 5rem); align-items: center; }
.hero-media { position: relative; min-height: 520px; }
.hero-media img:first-child { width: 82%; height: 460px; object-fit: cover; box-shadow: var(--shadow-soft); }
.hero-media img:last-child { position: absolute; right: 0; bottom: 0; width: 52%; height: 260px; object-fit: cover; border: 10px solid var(--color-cream); box-shadow: var(--shadow-soft); }
.hero-proof { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; margin-top: 2rem; }
.proof-chip { background: rgba(255,255,255,.62); border: 1px solid rgba(38, 61, 47, .12); border-radius: 18px; padding: 1rem; }
.proof-chip strong { display: block; color: var(--color-garden); font-family: var(--font-display); font-size: 1.4rem; }
.grid-2, .grid-3, .grid-4 { display: grid; gap: 1rem; }
.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.card, .proof-card, .service-card, .work-card, .post-card { background: rgba(255,255,255,.72); border: 1px solid rgba(38, 61, 47, .12); border-radius: var(--radius-card); padding: clamp(1.25rem, 2.4vw, 2rem); box-shadow: 0 16px 44px rgba(32,37,31,.08); }
.service-card { min-height: 270px; display: flex; flex-direction: column; }
.service-card .button { margin-top: auto; align-self: flex-start; }
.work-card img { height: 250px; width: 100%; object-fit: cover; margin-bottom: 1rem; }
.texture-band { background: var(--color-garden); color: var(--color-cream); padding: 4rem 0; }
.texture-band h2, .texture-band h3 { color: var(--color-cream); }
.process-list { counter-reset: process; display: grid; gap: 1rem; }
.process-item { counter-increment: process; display: grid; grid-template-columns: 72px 1fr; gap: 1rem; align-items: start; padding: 1.2rem; border-radius: 20px; background: rgba(255,255,255,.62); border: 1px solid rgba(38,61,47,.12); }
.process-item::before { content: counter(process, decimal-leading-zero); font-family: var(--font-display); font-size: 2rem; color: var(--color-bronze); }
.testimonial { font-family: var(--font-display); font-size: 1.55rem; color: var(--color-garden); }
.cta-banner { border-radius: var(--radius-large); padding: clamp(2rem, 5vw, 4rem); background: linear-gradient(135deg, var(--color-garden), #16261d); color: white; overflow: hidden; }
.cta-banner h2 { color: white; }
.site-footer { background: var(--color-charcoal); color: var(--color-cream); padding: 4rem 0 2rem; }
.footer-grid { display: grid; grid-template-columns: 1.4fr repeat(3, 1fr); gap: 2rem; }
.site-footer a { color: var(--color-cream); text-decoration: none; display: block; margin: .45rem 0; }
.form-grid { display: grid; gap: 1rem; }
label { display: grid; gap: .35rem; font-weight: 800; color: var(--color-garden); }
input, textarea, select { width: 100%; border: 1px solid rgba(38, 61, 47, .22); border-radius: 16px; padding: .9rem 1rem; background: white; font: inherit; }
textarea { min-height: 150px; }
.page-hero { padding: 5rem 0 3rem; background: linear-gradient(135deg, #f8f2e5, #e5dbc6); }
@media (max-width: 900px) {
  .nolan-primary-nav, .nolan-header-cta { display: none; }
  .nolan-mobile-toggle { display: inline-flex; }
  .hero-grid, .grid-2, .grid-3, .grid-4, .footer-grid, .nolan-menu-panel { grid-template-columns: 1fr; }
  .hero-media { min-height: 390px; }
  .hero-media img:first-child { height: 340px; }
  .hero-proof { grid-template-columns: 1fr; }
  .nolan-menu-dropdown { top: 82px; }
}
`;

const js = `
(() => {
  const body = document.body;
  const header = document.querySelector('[data-site-header]');
  const triggers = Array.from(document.querySelectorAll('[data-menu-item]'));
  const dropdowns = Array.from(document.querySelectorAll('[data-menu-dropdown]'));
  const backdrop = document.querySelector('[data-menu-backdrop]');
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileDrawer = document.querySelector('[data-mobile-drawer]');

  function closeMenus() {
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    dropdowns.forEach((dropdown) => dropdown.hidden = true);
    if (backdrop) backdrop.hidden = true;
    body.classList.remove('nolan-menu-open');
  }

  function openMenu(key) {
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', String(trigger.dataset.menuItem === key)));
    dropdowns.forEach((dropdown) => dropdown.hidden = dropdown.dataset.menuDropdown !== key);
    if (backdrop) backdrop.hidden = false;
    body.classList.add('nolan-menu-open');
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const key = trigger.dataset.menuItem;
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenus() : openMenu(key);
    });
  });

  document.addEventListener('click', (event) => {
    if (header && !header.contains(event.target) && !event.target.closest('[data-menu-dropdown]')) {
      closeMenus();
      closeMobile();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenus();
      closeMobile();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenus);
  }

  function closeMobile() {
    if (!mobileDrawer || !mobileToggle) return;
    mobileDrawer.hidden = true;
    mobileToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('nolan-menu-open');
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileDrawer.hidden = expanded;
      mobileToggle.setAttribute('aria-expanded', String(!expanded));
      body.classList.toggle('nolan-menu-open', !expanded);
    });
  }

  document.querySelectorAll('[data-rail-item]').forEach((railButton) => {
    railButton.addEventListener('mouseenter', () => activateRail(railButton));
    railButton.addEventListener('focus', () => activateRail(railButton));
    railButton.addEventListener('click', () => activateRail(railButton));
  });

  function activateRail(button) {
    const panel = button.closest('[data-menu-dropdown]');
    if (!panel) return;
    const key = button.dataset.railItem;
    panel.querySelectorAll('[data-rail-item]').forEach((item) => {
      item.setAttribute('aria-expanded', String(item === button));
    });
    panel.querySelectorAll('[data-rail-content]').forEach((content) => {
      content.hidden = content.dataset.railContent !== key;
    });
  }
})();
`;

const phpHeader = `<?php
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#primary"><?php esc_html_e( 'Skip to content', '${slug}' ); ?></a>
<header class="nolan-site-header" data-site-header>
  <div class="nolan-header-inner">
    <a class="nolan-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
      <span class="nolan-mark">AG</span>
      <span><?php esc_html_e( 'Aster Grove', '${slug}' ); ?></span>
    </a>
    <nav class="nolan-primary-nav" aria-label="<?php esc_attr_e( 'Primary navigation', '${slug}' ); ?>">
      <button class="nolan-menu-trigger" type="button" data-menu-item="services" aria-controls="nolan-menu-services" aria-expanded="false"><?php esc_html_e( 'Services', '${slug}' ); ?></button>
      <button class="nolan-menu-trigger" type="button" data-menu-item="about" aria-controls="nolan-menu-about" aria-expanded="false"><?php esc_html_e( 'About', '${slug}' ); ?></button>
      <a href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', '${slug}' ); ?></a>
      <button class="nolan-menu-trigger" type="button" data-menu-item="blog" aria-controls="nolan-menu-blog" aria-expanded="false"><?php esc_html_e( 'Blog', '${slug}' ); ?></button>
    </nav>
    <div class="nolan-header-actions">
      <a class="nolan-header-cta" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '${slug}' ); ?></a>
      <button class="nolan-mobile-toggle" type="button" data-mobile-toggle aria-controls="nolan-mobile-drawer" aria-expanded="false"><?php esc_html_e( 'Menu', '${slug}' ); ?></button>
    </div>
  </div>
  <div class="nolan-menu-backdrop" data-menu-backdrop hidden></div>
  <?php get_template_part( 'template-parts/content', 'nolan-menu' ); ?>
  <div class="nolan-mobile-drawer" id="nolan-mobile-drawer" data-mobile-drawer hidden>
    <nav aria-label="<?php esc_attr_e( 'Mobile navigation', '${slug}' ); ?>">
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', '${slug}' ); ?></a>
      <a href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php esc_html_e( 'Services', '${slug}' ); ?></a>
      <a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>"><?php esc_html_e( 'About', '${slug}' ); ?></a>
      <a href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', '${slug}' ); ?></a>
      <a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php esc_html_e( 'Blog', '${slug}' ); ?></a>
      <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '${slug}' ); ?></a>
    </nav>
  </div>
</header>
<main id="primary" class="site-main">
`;

const footer = `</main>
<?php get_template_part( 'template-parts/content', 'footer-widgets' ); ?>
<?php wp_footer(); ?>
</body>
</html>
`;

const menuPart = `<?php
$menu_cards = array(
  'services' => array(
    'Complete Garden Design', 'Outdoor Living Rooms', 'Estate Stewardship'
  ),
  'about' => array(
    'Studio Story', 'Design Standards', 'Working Rhythm'
  ),
  'blog' => array(
    'Planning Notes', 'Material Guides', 'Seasonal Care'
  ),
);
?>
<div class="nolan-menu-dropdown" id="nolan-menu-services" data-menu-dropdown="services" hidden>
  <div class="nolan-menu-panel">
    <div class="nolan-menu-rail">
      <button type="button" data-rail-item="design-build" aria-controls="services-design-build" aria-expanded="true"><?php esc_html_e( 'Design Build', '${slug}' ); ?></button>
      <button type="button" data-rail-item="stewardship" aria-controls="services-stewardship" aria-expanded="false"><?php esc_html_e( 'Stewardship', '${slug}' ); ?></button>
    </div>
    <div class="nolan-menu-content">
      <div class="nolan-rail-content" id="services-design-build" data-rail-content="design-build">
        <h3><?php esc_html_e( 'Outdoor rooms planned with architectural calm.', '${slug}' ); ?></h3>
        <p><?php esc_html_e( 'Move from first site walk to planting, stonework, lighting, and final handoff with one accountable studio.', '${slug}' ); ?></p>
        <div class="nolan-menu-link-grid">
          <a class="nolan-menu-card" href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php esc_html_e( 'Services overview', '${slug}' ); ?></a>
          <a class="nolan-menu-card" href="<?php echo esc_url( home_url( '/single-service/' ) ); ?>"><?php esc_html_e( 'Garden design build', '${slug}' ); ?></a>
          <a class="nolan-menu-card" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'View project work', '${slug}' ); ?></a>
        </div>
      </div>
      <div class="nolan-rail-content" id="services-stewardship" data-rail-content="stewardship" hidden>
        <h3><?php esc_html_e( 'Care plans for landscapes that improve with age.', '${slug}' ); ?></h3>
        <p><?php esc_html_e( 'Seasonal visits, planting edits, lighting reviews, and estate guidance keep the design intentional year after year.', '${slug}' ); ?></p>
      </div>
    </div>
  </div>
</div>
<div class="nolan-menu-dropdown" id="nolan-menu-about" data-menu-dropdown="about" hidden>
  <div class="nolan-menu-panel">
    <div class="nolan-menu-rail">
      <button type="button" data-rail-item="studio" aria-controls="about-studio" aria-expanded="true"><?php esc_html_e( 'Studio', '${slug}' ); ?></button>
      <button type="button" data-rail-item="standards" aria-controls="about-standards" aria-expanded="false"><?php esc_html_e( 'Standards', '${slug}' ); ?></button>
    </div>
    <div class="nolan-menu-content">
      <div class="nolan-rail-content" id="about-studio" data-rail-content="studio">
        <h3><?php esc_html_e( 'A design-build studio for measured outdoor living.', '${slug}' ); ?></h3>
        <p><?php esc_html_e( 'Aster Grove pairs thoughtful planning with careful build management and long-term stewardship.', '${slug}' ); ?></p>
        <a class="button ghost" href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>"><?php esc_html_e( 'Meet the studio', '${slug}' ); ?></a>
      </div>
      <div class="nolan-rail-content" id="about-standards" data-rail-content="standards" hidden>
        <h3><?php esc_html_e( 'Built around clarity, craft, and durable materials.', '${slug}' ); ?></h3>
        <p><?php esc_html_e( 'Every proposal includes the practical details owners and builders need before work begins.', '${slug}' ); ?></p>
      </div>
    </div>
  </div>
</div>
<div class="nolan-menu-dropdown" id="nolan-menu-blog" data-menu-dropdown="blog" hidden>
  <div class="nolan-menu-panel">
    <div class="nolan-menu-rail">
      <button type="button" data-rail-item="planning" aria-controls="blog-planning" aria-expanded="true"><?php esc_html_e( 'Planning', '${slug}' ); ?></button>
      <button type="button" data-rail-item="care" aria-controls="blog-care" aria-expanded="false"><?php esc_html_e( 'Care', '${slug}' ); ?></button>
    </div>
    <div class="nolan-menu-content">
      <div class="nolan-rail-content" id="blog-planning" data-rail-content="planning">
        <h3><?php esc_html_e( 'Field notes for better outdoor decisions.', '${slug}' ); ?></h3>
        <p><?php esc_html_e( 'Read practical guidance on garden planning, stone selection, planting structure, and lighting.', '${slug}' ); ?></p>
        <a class="button ghost" href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php esc_html_e( 'Read resources', '${slug}' ); ?></a>
      </div>
      <div class="nolan-rail-content" id="blog-care" data-rail-content="care" hidden>
        <h3><?php esc_html_e( 'Seasonal stewardship that protects the design.', '${slug}' ); ?></h3>
        <p><?php esc_html_e( 'Keep plantings edited, lighting adjusted, and outdoor rooms ready for daily use.', '${slug}' ); ?></p>
      </div>
    </div>
  </div>
</div>
`;

const heroPart = `<section class="hero"><div class="container hero-grid"><div><p class="eyebrow">Aster Grove Landscape Design</p><h1>Outdoor rooms with the calm precision of architecture.</h1><p class="lede">We design and build garden environments for homes where stone, planting, lighting, and daily rituals need to feel resolved from the first step outside.</p><p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Start a garden plan</a> <a class="button ghost" href="<?php echo esc_url( home_url( '/work/' ) ); ?>">View work</a></p><div class="hero-proof"><div class="proof-chip"><strong>18</strong>estate gardens stewarded</div><div class="proof-chip"><strong>5</strong>integrated design-build disciplines</div><div class="proof-chip"><strong>12 mo</strong>care plans after install</div></div></div><div class="hero-media"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/hero/garden-pathway-dawn.png' ); ?>" alt="<?php esc_attr_e( 'Layered garden pathway at dawn', '${slug}' ); ?>"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/texture/planting-plan-detail.png' ); ?>" alt="<?php esc_attr_e( 'Planting plan and material study', '${slug}' ); ?>"></div></div></section>`;
const brandPart = `<section class="section"><div class="container grid-2"><div><p class="eyebrow">Practical elegance</p><h2>Landscapes planned clearly, built carefully, and cared for over time.</h2></div><p class="lede">Aster Grove works with homeowners, architects, builders, and estate managers who want a complete outdoor environment without fragmented handoffs. We align concept, materials, construction sequencing, planting, lighting, and maintenance from the beginning.</p></div></section>`;
const servicesPart = `<section class="section alt"><div class="container"><div class="section-heading"><p class="eyebrow">Services</p><h2>Design-build services for complete outdoor environments.</h2></div><div class="grid-4"><article class="service-card"><h3>Garden design and build</h3><p>Site planning, layouts, planting structure, stonework coordination, and final installation leadership.</p><a class="button ghost" href="<?php echo esc_url( home_url( '/single-service/' ) ); ?>">Explore service</a></article><article class="service-card"><h3>Outdoor living rooms</h3><p>Terraces, dining spaces, courtyards, poolside planting, and kitchens shaped for daily use.</p><a class="button ghost" href="<?php echo esc_url( home_url( '/services/' ) ); ?>">View services</a></article><article class="service-card"><h3>Lighting and materials</h3><p>Warm lighting plans, limestone, bronze, clay, gravel, and planting textures specified with restraint.</p><a class="button ghost" href="<?php echo esc_url( home_url( '/work/' ) ); ?>">See details</a></article><article class="service-card"><h3>Estate stewardship</h3><p>Seasonal edits, plant health reviews, and long-term care plans that protect the original design intent.</p><a class="button ghost" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Plan care</a></article></div></div></section>`;
const featuredWorkPart = `<section class="section"><div class="container"><div class="section-heading"><p class="eyebrow">Selected work</p><h2>Garden rooms shaped around architecture, season, and use.</h2></div><div class="grid-3"><article class="work-card"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/portfolio/courtyard-retreat.png' ); ?>" alt="<?php esc_attr_e( 'Courtyard retreat with layered planting', '${slug}' ); ?>"><h3>Courtyard retreat</h3><p>A narrow rear garden became a calm sequence of limestone, evergreen structure, and evening seating.</p></article><article class="work-card"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/portfolio/stonework-garden-room.png' ); ?>" alt="<?php esc_attr_e( 'Stonework garden room', '${slug}' ); ?>"><h3>Stone garden room</h3><p>Hand-selected paving, low walls, and shade planting created a durable outdoor room for a historic home.</p></article><article class="work-card"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/portfolio/outdoor-dining-terrace.png' ); ?>" alt="<?php esc_attr_e( 'Outdoor dining terrace', '${slug}' ); ?>"><h3>Dining terrace</h3><p>A terrace plan balanced cooking, dining, and soft planting with careful lighting and drainage decisions.</p></article></div></div></section>`;
const processPart = `<section class="section alt"><div class="container grid-2"><div><p class="eyebrow">Process</p><h2>A guided path from site walk to settled garden.</h2><p class="lede">Every engagement creates clear decisions before crews arrive, then protects those decisions through construction and seasonal care.</p></div><div class="process-list"><div class="process-item"><div><h3>Listen and survey</h3><p>We document site conditions, architecture, routines, constraints, and long-term care expectations.</p></div></div><div class="process-item"><div><h3>Design and specify</h3><p>Plans, planting palettes, materials, lighting, and budgets are refined into a practical build path.</p></div></div><div class="process-item"><div><h3>Build and steward</h3><p>Installation is coordinated with careful sequencing, then supported with care notes and seasonal visits.</p></div></div></div></div></section>`;
const pillarsPart = `<section class="texture-band"><div class="container grid-3"><article><p class="eyebrow">Material restraint</p><h3>Limestone, bronze, clay, gravel, and wood chosen for aging well.</h3></article><article><p class="eyebrow">Planting structure</p><h3>Evergreen bones, seasonal movement, and texture that supports the architecture.</h3></article><article><p class="eyebrow">Daily use</p><h3>Outdoor rooms planned around coffee, dinner, shade, gathering, and quiet maintenance.</h3></article></div></section>`;
const testimonialsPart = `<section class="section"><div class="container grid-2"><div><p class="eyebrow">Client proof</p><p class="testimonial">"Aster Grove gave us a garden that feels established, intentional, and easy to live in. The process was calm from start to finish."</p><p>Private residence, North Shore</p></div><div class="proof-card"><h3>Trusted by architects and estate managers</h3><p>Clear drawings, reliable communication, disciplined material choices, and stewardship plans make complex outdoor projects easier to approve and maintain.</p></div></div></section>`;
const blogPart = `<section class="section alt"><div class="container"><div class="section-heading"><p class="eyebrow">Resources</p><h2>Field notes for planning a better outdoor room.</h2></div><div class="grid-3"><article class="post-card"><h3>How early should a garden plan begin?</h3><p>Why winter planning creates better pricing, plant availability, and construction sequencing.</p></article><article class="post-card"><h3>Choosing stone that will age well</h3><p>A practical guide to limestone, gravel, clay pavers, and bronze details in residential gardens.</p></article><article class="post-card"><h3>Seasonal care after installation</h3><p>The pruning, lighting, soil, and editing rhythm that keeps a new garden improving.</p></article></div></div></section>`;
const ctaPart = `<section class="section"><div class="container"><div class="cta-banner"><p class="eyebrow">Begin with the site</p><h2>Bring the survey, the wish list, and the parts of the property that never quite worked.</h2><p class="lede">We will help you decide whether the right next step is a focused garden plan, a complete design-build engagement, or a stewardship review.</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Request a consultation</a></div></div></section>`;
const footerPart = `<footer class="site-footer"><div class="container footer-grid"><div><a class="nolan-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>"><span class="nolan-mark">AG</span><span><?php esc_html_e( 'Aster Grove', '${slug}' ); ?></span></a><p>Landscape design, build, and stewardship for outdoor rooms with architectural calm.</p></div><div><h3><?php esc_html_e( 'Studio', '${slug}' ); ?></h3><a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>">About</a><a href="<?php echo esc_url( home_url( '/work/' ) ); ?>">Work</a><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Resources</a></div><div><h3><?php esc_html_e( 'Services', '${slug}' ); ?></h3><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Design build</a><a href="<?php echo esc_url( home_url( '/single-service/' ) ); ?>">Garden planning</a><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Stewardship</a></div><div><h3><?php esc_html_e( 'Contact', '${slug}' ); ?></h3><p>Serving discerning homes across the region by appointment.</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a></div></div><div class="container"><p>&copy; <?php echo esc_html( date( 'Y' ) ); ?> Aster Grove Landscape Design.</p></div></footer>`;

function writeTheme() {
  createImages();
  writeText(`wp-content/themes/${slug}/style.css`, `/*
Theme Name: Nolan Young Theme 000 - Premium Landscape Design Company
Theme URI: https://nolan.local/themes/${slug}
Author: Nolan Young
Description: Premium classic WordPress theme for Aster Grove Landscape Design.
Version: 1.0.0
License: GPL-2.0-or-later
Text Domain: ${slug}
*/`);
  writeText(`wp-content/themes/${slug}/functions.php`, `<?php
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
  writeText(`wp-content/themes/${slug}/theme.json`, JSON.stringify({ version: 2, settings: { color: { palette: [{ slug: 'garden', color: '#263d2f', name: 'Garden' }, { slug: 'limestone', color: '#e7dfcc', name: 'Limestone' }, { slug: 'bronze', color: '#9a724b', name: 'Bronze' }] }, layout: { contentSize: '760px', wideSize: '1140px' } } }, null, 2));
  writeText(`wp-content/themes/${slug}/README.md`, `# Nolan Young Theme 000 - Premium Landscape Design Company

A complete classic WordPress theme for Aster Grove Landscape Design.

## Build

Run \`npm install\` and \`npm run build\` from this theme directory.`);
  writeText(`wp-content/themes/${slug}/.editorconfig`, `root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2`);
  writeText(`wp-content/themes/${slug}/.gitignore`, `node_modules/
*.log
dist/
.DS_Store`);
  writeText(`wp-content/themes/${slug}/header.php`, phpHeader);
  writeText(`wp-content/themes/${slug}/footer.php`, footer);
  writeText(`wp-content/themes/${slug}/front-page.php`, `<?php get_header(); ?>
<?php get_template_part( 'template-parts/content', 'hero' ); ?>
<?php get_template_part( 'template-parts/content', 'brand-statement' ); ?>
<?php get_template_part( 'template-parts/content', 'all-services' ); ?>
<?php get_template_part( 'template-parts/content', 'featured-work' ); ?>
<?php get_template_part( 'template-parts/content', 'process' ); ?>
<?php get_template_part( 'template-parts/content', 'style-pillars' ); ?>
<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>
<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
<?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/index.php`, `<?php get_header(); ?><section class="section"><div class="container"><h1><?php esc_html_e( 'Aster Grove Notes', '${slug}' ); ?></h1><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?><article class="post-card"><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><?php the_excerpt(); ?></article><?php endwhile; else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/page.php`, `<?php get_header(); ?><section class="section"><div class="container"><?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'page' ); endwhile; ?></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/single.php`, `<?php get_header(); ?><section class="section"><div class="container"><?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'single' ); endwhile; ?></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/archive.php`, `<?php get_header(); ?><section class="page-hero"><div class="container"><h1><?php the_archive_title(); ?></h1></div></section><section class="section"><div class="container grid-3"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/search.php`, `<?php get_header(); ?><section class="page-hero"><div class="container"><h1><?php printf( esc_html__( 'Search results for %s', '${slug}' ), esc_html( get_search_query() ) ); ?></h1><?php get_search_form(); ?></div></section><section class="section"><div class="container grid-3"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/searchform.php`, `<form role="search" method="get" class="search-form form-grid" action="<?php echo esc_url( home_url( '/' ) ); ?>"><label><span><?php esc_html_e( 'Search resources', '${slug}' ); ?></span><input type="search" value="<?php echo esc_attr( get_search_query() ); ?>" name="s"></label><button class="button" type="submit"><?php esc_html_e( 'Search', '${slug}' ); ?></button></form>`);
  writeText(`wp-content/themes/${slug}/404.php`, `<?php get_header(); ?><section class="section"><div class="container"><h1><?php esc_html_e( 'This garden path does not continue.', '${slug}' ); ?></h1><p><?php esc_html_e( 'Return to the homepage or start with the service overview.', '${slug}' ); ?></p><a class="button" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Return home', '${slug}' ); ?></a></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/403.php`, `<?php get_header(); ?><section class="section"><div class="container"><h1><?php esc_html_e( 'Access is restricted.', '${slug}' ); ?></h1><p><?php esc_html_e( 'This page is not available for public viewing.', '${slug}' ); ?></p></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/comments.php`, `<?php if ( post_password_required() ) { return; } ?><section class="comments-area"><h2><?php esc_html_e( 'Discussion', '${slug}' ); ?></h2><?php comment_form(); ?></section>`);
  writeText(`wp-content/themes/${slug}/package.json`, JSON.stringify({ name: slug, version: '1.0.0', scripts: { build: 'node build/webpack.config.js' }, dependencies: {}, devDependencies: {} }, null, 2));
  writeText(`wp-content/themes/${slug}/package-lock.json`, JSON.stringify({ name: slug, version: '1.0.0', lockfileVersion: 3, requires: true, packages: { '': { name: slug, version: '1.0.0' } } }, null, 2));
  writeText(`wp-content/themes/${slug}/LICENSE.txt`, `GPL-2.0-or-later

This generated theme is intended for WordPress distribution under the GPL.`);
  writeText(`wp-content/themes/${slug}/CHANGELOG.md`, `# Changelog

## 1.0.0

- Initial premium landscape design company theme.`);
  writeText(`wp-content/themes/${slug}/inc/setup.php`, `<?php
function aster_grove_setup() {
  add_theme_support( 'title-tag' );
  add_theme_support( 'post-thumbnails' );
  add_theme_support( 'html5', array( 'search-form', 'comment-form', 'gallery', 'caption', 'style', 'script' ) );
  register_nav_menus( array( 'primary' => esc_html__( 'Primary Menu', '${slug}' ) ) );
}
add_action( 'after_setup_theme', 'aster_grove_setup' );
`);
  writeText(`wp-content/themes/${slug}/inc/enqueue.php`, `<?php
function aster_grove_enqueue_assets() {
  $css = get_template_directory() . '/assets/css/bundle.css';
  $js = get_template_directory() . '/assets/js/bundle.js';
  wp_enqueue_style( '${slug}', get_template_directory_uri() . '/assets/css/bundle.css', array(), file_exists( $css ) ? filemtime( $css ) : '1.0.0' );
  wp_enqueue_script( '${slug}', get_template_directory_uri() . '/assets/js/bundle.js', array(), file_exists( $js ) ? filemtime( $js ) : '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'aster_grove_enqueue_assets' );
`);
  writeText(`wp-content/themes/${slug}/inc/template-tags.php`, `<?php
function aster_grove_posted_on() {
  printf( '<span class="posted-on">%s</span>', esc_html( get_the_date() ) );
}
`);
  writeText(`wp-content/themes/${slug}/inc/helpers.php`, `<?php
function aster_grove_image_uri( $path ) {
  return esc_url( get_template_directory_uri() . '/assets/images/' . ltrim( $path, '/' ) );
}
`);
  writeText(`wp-content/themes/${slug}/inc/custom-post-types.php`, `<?php
function aster_grove_register_work_type() {
  register_post_type( 'aster_work', array(
    'public' => true,
    'label' => esc_html__( 'Landscape Work', '${slug}' ),
    'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
    'show_in_rest' => true,
  ) );
}
add_action( 'init', 'aster_grove_register_work_type' );
`);
  writeText(`wp-content/themes/${slug}/inc/customizer.php`, `<?php
function aster_grove_customize_register( $wp_customize ) {
  $wp_customize->add_section( 'aster_grove_brand', array(
    'title' => esc_html__( 'Aster Grove Brand', '${slug}' ),
    'priority' => 30,
  ) );
}
add_action( 'customize_register', 'aster_grove_customize_register' );
`);
  writeText(`wp-content/themes/${slug}/inc/forms.php`, `<?php
function aster_grove_contact_note() {
  return esc_html__( 'Consultation requests are reviewed by the studio before scheduling.', '${slug}' );
}
`);
  writeText(`wp-content/themes/${slug}/inc/newsletter.php`, `<?php
function aster_grove_newsletter_label() {
  return esc_html__( 'Receive seasonal garden planning notes.', '${slug}' );
}
`);
  writeText(`wp-content/themes/${slug}/inc/policy-routing.php`, `<?php
function aster_grove_policy_title() {
  return esc_html__( 'Studio Policy', '${slug}' );
}
`);

  const parts = {
    'content-page.php': `<article <?php post_class( 'content-page' ); ?>><h1><?php the_title(); ?></h1><?php the_content(); ?></article>`,
    'content-single.php': `<article <?php post_class( 'content-single' ); ?>><p class="eyebrow"><?php aster_grove_posted_on(); ?></p><h1><?php the_title(); ?></h1><?php the_content(); ?></article>`,
    'content-none.php': `<article class="proof-card"><h2><?php esc_html_e( 'No matching garden notes were found.', '${slug}' ); ?></h2><p><?php esc_html_e( 'Try another search or visit the services overview.', '${slug}' ); ?></p></article>`,
    'content-policy.php': `<section class="section"><div class="container"><h1><?php echo esc_html( aster_grove_policy_title() ); ?></h1><p><?php esc_html_e( 'Project schedules, material availability, and care recommendations are confirmed in writing for each engagement.', '${slug}' ); ?></p></div></section>`,
    'content-search.php': `<article class="post-card"><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><?php the_excerpt(); ?></article>`,
    'content-hero.php': heroPart,
    'content-brand-statement.php': brandPart,
    'content-featured-work.php': featuredWorkPart,
    'content-all-services.php': servicesPart,
    'content-single-service-highlight.php': `<section class="page-hero"><div class="container"><p class="eyebrow">Complete garden design and build</p><h1>One accountable studio from concept through settled planting.</h1><p class="lede">Aster Grove aligns design, stone, planting, lighting, and construction sequencing so the final garden feels intentional from the first season.</p></div></section><section class="section"><div class="container grid-2"><div class="process-list"><div class="process-item"><div><h3>Deliverables</h3><p>Site plan, planting palette, material schedule, lighting direction, phasing, and stewardship notes.</p></div></div><div class="process-item"><div><h3>Timeline</h3><p>Most complete gardens move from discovery to installation planning over eight to fourteen weeks.</p></div></div></div><div class="proof-card"><h3>Best fit</h3><p>Homeowners who want one team responsible for the complete outdoor environment.</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Discuss this service</a></div></div></section>`,
    'content-process.php': processPart,
    'content-style-pillars.php': pillarsPart,
    'content-testimonials.php': testimonialsPart,
    'content-blog-preview.php': blogPart,
    'content-cta-banner.php': ctaPart,
    'content-footer-widgets.php': footerPart,
    'content-nolan-menu.php': menuPart,
  };
  for (const [file, content] of Object.entries(parts)) {
    writeText(`wp-content/themes/${slug}/template-parts/${file}`, content);
  }

  const templates = {
    'template-about-us.php': `<?php /* Template Name: About Us */ get_header(); ?><section class="page-hero"><div class="container"><p class="eyebrow">About the studio</p><h1>Measured design, careful building, and stewardship after the last plant is placed.</h1><p class="lede">Aster Grove was built for clients who want outdoor spaces that respect the architecture, the site, and the way a family actually lives.</p></div></section>${pillarsPart}${testimonialsPart}<?php get_footer(); ?>`,
    'template-services.php': `<?php /* Template Name: Services */ get_header(); ?>${servicesPart}${processPart}${ctaPart}<?php get_footer(); ?>`,
    'template-single-service.php': `<?php /* Template Name: Single Service */ get_header(); ?><?php get_template_part( 'template-parts/content', 'single-service-highlight' ); ?><?php get_footer(); ?>`,
    'template-work.php': `<?php /* Template Name: Work */ get_header(); ?>${featuredWorkPart}${brandPart}${ctaPart}<?php get_footer(); ?>`,
    'template-blog.php': `<?php /* Template Name: Blog */ get_header(); ?>${blogPart}${ctaPart}<?php get_footer(); ?>`,
    'template-contact.php': `<?php /* Template Name: Contact */ get_header(); ?><section class="page-hero"><div class="container"><p class="eyebrow">Contact</p><h1>Start with the site, the routines, and the moments you want outside.</h1></div></section><section class="section"><div class="container grid-2"><form class="proof-card form-grid"><label>Name<input type="text" name="name"></label><label>Email<input type="email" name="email"></label><label>Project address<input type="text" name="address"></label><label>What should change outside?<textarea name="message"></textarea></label><button class="button" type="submit">Request consultation</button></form><div class="proof-card"><h3>Good fit signals</h3><p>You want a complete outdoor room, have architectural or site constraints, value durable material decisions, and want long-term care guidance.</p><p><?php echo esc_html( aster_grove_contact_note() ); ?></p></div></div></section><?php get_footer(); ?>`,
    'template-policy.php': `<?php /* Template Name: Policy */ get_header(); ?><?php get_template_part( 'template-parts/content', 'policy' ); ?><?php get_footer(); ?>`,
  };
  for (const [file, content] of Object.entries(templates)) {
    writeText(`wp-content/themes/${slug}/page-templates/${file}`, content);
  }

  writeText(`wp-content/themes/${slug}/assets/icons/icon1.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Aster Grove leaf mark"><path fill="#263d2f" d="M32 4c15 8 24 20 24 34 0 12-9 22-24 22S8 50 8 38C8 24 17 12 32 4Z"/><path fill="#e7dfcc" d="M32 12c3 14 2 28-2 41 10-8 16-19 16-31-5-4-9-7-14-10Z"/></svg>`);
  writeText(`wp-content/themes/${slug}/assets/icons/README.md`, `# Icons

Local SVG icon assets for Aster Grove Landscape Design.`);
  writeText(`wp-content/themes/${slug}/assets/css/bundle.css`, css);
  writeText(`wp-content/themes/${slug}/assets/js/bundle.js`, js);
  writeText(`wp-content/themes/${slug}/src/js/main.js`, js);
  writeText(`wp-content/themes/${slug}/src/scss/main.scss`, css);
  const partials = [
    'abstracts/_variables.scss', 'abstracts/_mixins.scss', 'abstracts/_functions.scss',
    'base/_reset.scss', 'base/_typography.scss', 'base/_accessibility.scss', 'base/_forms.scss', 'base/_newsletter.scss',
    'components/_buttons.scss', 'components/_cards.scss', 'components/_forms.scss', 'components/_badges.scss', 'components/_accordion.scss', 'components/_carousel.scss', 'components/_portfolio-filter.scss', 'components/_before-after.scss',
    'layout/_container.scss', 'layout/_header.scss', 'layout/_footer.scss', 'layout/_grid.scss', 'layout/_sections.scss',
    'pages/_homepage.scss', 'pages/_contact.scss', 'pages/_about-us.scss', 'pages/_services.scss', 'pages/_work.scss', 'pages/_blog.scss', 'pages/_policy.scss',
  ];
  partials.forEach((file) => writeText(`wp-content/themes/${slug}/src/scss/${file}`, `/* ${file} supports the compiled Aster Grove visual system. */`));
  writeText(`wp-content/themes/${slug}/build/webpack.config.js`, `const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
fs.mkdirSync(path.join(root, 'assets/css'), { recursive: true });
fs.mkdirSync(path.join(root, 'assets/js'), { recursive: true });
fs.copyFileSync(path.join(root, 'src/scss/main.scss'), path.join(root, 'assets/css/bundle.css'));
fs.copyFileSync(path.join(root, 'src/js/main.js'), path.join(root, 'assets/js/bundle.js'));
console.log('Built Aster Grove compiled assets.');
`);
  writeText(`wp-content/themes/${slug}/blocks/README.md`, `# Blocks

This classic theme uses template hierarchy files and reusable template parts.`);
  writeText(`wp-content/themes/${slug}/docs/getting-started.md`, `# Getting Started

Install the theme ZIP in WordPress, assign page templates, and run the asset build when editing source files.`);
  writeText(`wp-content/themes/${slug}/docs/customization.md`, `# Customization

Adjust colors, copy, and image choices in the theme files while preserving the Nolan-menu contract.`);
  writeText(`wp-content/themes/${slug}/accessibility/README.md`, `# Accessibility

The header uses ARIA controls, expanded state updates, keyboard Escape handling, focusable controls, and visible focus states.`);
}

function navHtml() {
  return `<header class="nolan-site-header" data-site-header><div class="nolan-header-inner"><a class="nolan-brand" href="homepage_preview.html"><span class="nolan-mark">AG</span><span>Aster Grove</span></a><nav class="nolan-primary-nav" aria-label="Primary navigation"><button class="nolan-menu-trigger" type="button" data-menu-item="services" aria-controls="nolan-menu-services" aria-expanded="false">Services</button><button class="nolan-menu-trigger" type="button" data-menu-item="about" aria-controls="nolan-menu-about" aria-expanded="false">About</button><a href="work_preview.html">Work</a><button class="nolan-menu-trigger" type="button" data-menu-item="blog" aria-controls="nolan-menu-blog" aria-expanded="false">Blog</button></nav><div class="nolan-header-actions"><a class="nolan-header-cta" href="contact_preview.html">Contact Us</a><button class="nolan-mobile-toggle" type="button" data-mobile-toggle aria-controls="nolan-mobile-drawer" aria-expanded="false">Menu</button></div></div><div class="nolan-menu-backdrop" data-menu-backdrop hidden></div>${previewMenus()}<div class="nolan-mobile-drawer" id="nolan-mobile-drawer" data-mobile-drawer hidden><nav><a href="homepage_preview.html">Home</a><a href="services_preview.html">Services</a><a href="about-us_preview.html">About</a><a href="work_preview.html">Work</a><a href="blog_preview.html">Blog</a><a href="single_services_preview.html">Single Service</a><a href="contact_preview.html">Contact Us</a></nav></div></header>`;
}

function previewMenus() {
  return `<div class="nolan-menu-dropdown" id="nolan-menu-services" data-menu-dropdown="services" hidden><div class="nolan-menu-panel"><div class="nolan-menu-rail"><button type="button" data-rail-item="design-build" aria-controls="p-services-design" aria-expanded="true">Design Build</button><button type="button" data-rail-item="stewardship" aria-controls="p-services-care" aria-expanded="false">Stewardship</button></div><div class="nolan-menu-content"><div class="nolan-rail-content" id="p-services-design" data-rail-content="design-build"><h3>Outdoor rooms planned with architectural calm.</h3><p>Concept, planting, stonework, lighting, and build leadership in one path.</p><div class="nolan-menu-link-grid"><a class="nolan-menu-card" href="services_preview.html">Services overview</a><a class="nolan-menu-card" href="single_services_preview.html">Garden design build</a><a class="nolan-menu-card" href="work_preview.html">View project work</a></div></div><div class="nolan-rail-content" id="p-services-care" data-rail-content="stewardship" hidden><h3>Care plans for landscapes that improve with age.</h3><p>Seasonal visits, planting edits, and long-term care notes.</p></div></div></div></div><div class="nolan-menu-dropdown" id="nolan-menu-about" data-menu-dropdown="about" hidden><div class="nolan-menu-panel"><div class="nolan-menu-rail"><button type="button" data-rail-item="studio" aria-controls="p-about-studio" aria-expanded="true">Studio</button><button type="button" data-rail-item="standards" aria-controls="p-about-standards" aria-expanded="false">Standards</button></div><div class="nolan-menu-content"><div class="nolan-rail-content" id="p-about-studio" data-rail-content="studio"><h3>A design-build studio for measured outdoor living.</h3><p>Thoughtful planning, careful build management, and long-term stewardship.</p><a class="button ghost" href="about-us_preview.html">Meet the studio</a></div><div class="nolan-rail-content" id="p-about-standards" data-rail-content="standards" hidden><h3>Built around clarity, craft, and durable materials.</h3><p>Every proposal includes practical details before work begins.</p></div></div></div></div><div class="nolan-menu-dropdown" id="nolan-menu-blog" data-menu-dropdown="blog" hidden><div class="nolan-menu-panel"><div class="nolan-menu-rail"><button type="button" data-rail-item="planning" aria-controls="p-blog-planning" aria-expanded="true">Planning</button><button type="button" data-rail-item="care" aria-controls="p-blog-care" aria-expanded="false">Care</button></div><div class="nolan-menu-content"><div class="nolan-rail-content" id="p-blog-planning" data-rail-content="planning"><h3>Field notes for better outdoor decisions.</h3><p>Garden planning, stone selection, planting structure, and lighting notes.</p><a class="button ghost" href="blog_preview.html">Read resources</a></div><div class="nolan-rail-content" id="p-blog-care" data-rail-content="care" hidden><h3>Seasonal stewardship that protects the design.</h3><p>Keep plantings edited, lighting adjusted, and outdoor rooms ready for daily use.</p></div></div></div></div>`;
}

function page(title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | Aster Grove</title><link rel="stylesheet" href="assets/css/preview.css"></head><body>${navHtml()}<main id="primary">${body}</main>${footerHtml()}<script src="assets/js/preview.js"></script></body></html>`;
}

function footerHtml() {
  return `<footer class="site-footer"><div class="container footer-grid"><div><a class="nolan-brand" href="homepage_preview.html"><span class="nolan-mark">AG</span><span>Aster Grove</span></a><p>Landscape design, build, and stewardship for outdoor rooms with architectural calm.</p></div><div><h3>Studio</h3><a href="about-us_preview.html">About</a><a href="work_preview.html">Work</a><a href="blog_preview.html">Resources</a></div><div><h3>Services</h3><a href="services_preview.html">Design build</a><a href="single_services_preview.html">Garden planning</a><a href="contact_preview.html">Stewardship</a></div><div><h3>Contact</h3><p>Serving discerning homes across the region by appointment.</p><a class="button" href="contact_preview.html">Contact Us</a></div></div></footer>`;
}

const heroHtml = `<section class="hero"><div class="container hero-grid"><div><p class="eyebrow">Aster Grove Landscape Design</p><h1>Outdoor rooms with the calm precision of architecture.</h1><p class="lede">We design and build garden environments for homes where stone, planting, lighting, and daily rituals need to feel resolved from the first step outside.</p><p><a class="button" href="contact_preview.html">Start a garden plan</a> <a class="button ghost" href="work_preview.html">View work</a></p><div class="hero-proof"><div class="proof-chip"><strong>18</strong>estate gardens stewarded</div><div class="proof-chip"><strong>5</strong>integrated design-build disciplines</div><div class="proof-chip"><strong>12 mo</strong>care plans after install</div></div></div><div class="hero-media"><img src="assets/images/garden-pathway-dawn.png" alt="Layered garden pathway at dawn"><img src="assets/images/planting-plan-detail.png" alt="Planting plan and material study"></div></div></section>`;
const previewFeaturedWork = featuredWorkPart;
const previewBody = {
  'homepage_preview.html': heroHtml + brandPart.replaceAll('<?php echo esc_url( home_url( \'/contact/\' ) ); ?>', 'contact_preview.html').replaceAll('<?php echo esc_url( home_url( \'/work/\' ) ); ?>', 'work_preview.html') + servicesPart.replaceAll('<?php echo esc_url( home_url( \'/single-service/\' ) ); ?>', 'single_services_preview.html').replaceAll('<?php echo esc_url( home_url( \'/services/\' ) ); ?>', 'services_preview.html').replaceAll('<?php echo esc_url( home_url( \'/work/\' ) ); ?>', 'work_preview.html').replaceAll('<?php echo esc_url( home_url( \'/contact/\' ) ); ?>', 'contact_preview.html') + previewFeaturedWork + processPart + pillarsPart + testimonialsPart + blogPart + ctaPart.replaceAll('<?php echo esc_url( home_url( \'/contact/\' ) ); ?>', 'contact_preview.html'),
  'services_preview.html': `<section class="page-hero"><div class="container"><p class="eyebrow">Services</p><h1>Design-build services for complete outdoor environments.</h1><p class="lede">From first site walk through stewardship, Aster Grove gives owners one clear path for refined outdoor rooms.</p></div></section>` + servicesPart.replaceAll('<?php echo esc_url( home_url( \'/single-service/\' ) ); ?>', 'single_services_preview.html').replaceAll('<?php echo esc_url( home_url( \'/services/\' ) ); ?>', 'services_preview.html').replaceAll('<?php echo esc_url( home_url( \'/work/\' ) ); ?>', 'work_preview.html').replaceAll('<?php echo esc_url( home_url( \'/contact/\' ) ); ?>', 'contact_preview.html') + processPart,
  'about-us_preview.html': `<section class="page-hero"><div class="container"><p class="eyebrow">About the studio</p><h1>Measured design, careful building, and stewardship after the last plant is placed.</h1><p class="lede">Aster Grove was built for clients who want outdoor spaces that respect the architecture, the site, and the way a family actually lives.</p></div></section>` + pillarsPart + testimonialsPart,
  'contact_preview.html': `<section class="page-hero"><div class="container"><p class="eyebrow">Contact</p><h1>Start with the site, the routines, and the moments you want outside.</h1></div></section><section class="section"><div class="container grid-2"><form class="proof-card form-grid"><label>Name<input type="text" name="name"></label><label>Email<input type="email" name="email"></label><label>Project address<input type="text" name="address"></label><label>What should change outside?<textarea name="message"></textarea></label><button class="button" type="submit">Request consultation</button></form><div class="proof-card"><h3>Good fit signals</h3><p>You want a complete outdoor room, have architectural or site constraints, value durable material decisions, and want long-term care guidance.</p><p>Consultation requests are reviewed by the studio before scheduling.</p></div></div></section>`,
  'single_services_preview.html': `<section class="page-hero"><div class="container"><p class="eyebrow">Complete garden design and build</p><h1>One accountable studio from concept through settled planting.</h1><p class="lede">Aster Grove aligns design, stone, planting, lighting, and construction sequencing so the final garden feels intentional from the first season.</p></div></section><section class="section"><div class="container grid-2"><div class="process-list"><div class="process-item"><div><h3>Deliverables</h3><p>Site plan, planting palette, material schedule, lighting direction, phasing, and stewardship notes.</p></div></div><div class="process-item"><div><h3>Timeline</h3><p>Most complete gardens move from discovery to installation planning over eight to fourteen weeks.</p></div></div></div><div class="proof-card"><h3>Best fit</h3><p>Homeowners who want one team responsible for the complete outdoor environment.</p><a class="button" href="contact_preview.html">Discuss this service</a></div></div></section>`,
  'blog_preview.html': `<section class="page-hero"><div class="container"><p class="eyebrow">Resources</p><h1>Field notes for better outdoor decisions.</h1><p class="lede">Practical guidance on garden planning, material selection, seasonal care, and outdoor room design.</p></div></section>` + blogPart,
  'work_preview.html': `<section class="page-hero"><div class="container"><p class="eyebrow">Work</p><h1>Garden rooms shaped around architecture, season, and use.</h1></div></section>` + previewFeaturedWork + ctaPart.replaceAll('<?php echo esc_url( home_url( \'/contact/\' ) ); ?>', 'contact_preview.html'),
};

function cleanPreviewMarkup(html) {
  return html
    .replace(/<\?php\s+esc_attr_e\(\s*'([^']+)'\s*,\s*'[^']+'\s*\);\s*\?>/g, '$1')
    .replace(/<\?php\s+esc_html_e\(\s*'([^']+)'\s*,\s*'[^']+'\s*\);\s*\?>/g, '$1')
    .replaceAll('<?php echo esc_url( get_template_directory_uri() . \'/assets/images/portfolio/', 'assets/images/')
    .replaceAll('<?php echo esc_url( get_template_directory_uri() . \'/assets/images/hero/', 'assets/images/')
    .replaceAll('<?php echo esc_url( get_template_directory_uri() . \'/assets/images/texture/', 'assets/images/')
    .replaceAll("' ); ?>", '')
    .replaceAll('<?php echo esc_url( home_url( \'/contact/\' ) ); ?>', 'contact_preview.html')
    .replaceAll('<?php echo esc_url( home_url( \'/work/\' ) ); ?>', 'work_preview.html')
    .replaceAll('<?php echo esc_url( home_url( \'/services/\' ) ); ?>', 'services_preview.html')
    .replaceAll('<?php echo esc_url( home_url( \'/single-service/\' ) ); ?>', 'single_services_preview.html');
}

function writePreview() {
  writeText(`docs/themes/${slug}/assets/css/preview.css`, css);
  writeText(`docs/themes/${slug}/assets/js/preview.js`, js);
  writeText(`docs/themes/${slug}/assets/images/README.md`, `# Preview Images

Local generated raster assets for the Aster Grove static preview.`);
  writeText(`docs/themes/${slug}/README.md`, `# Aster Grove Static Preview

Standalone preview pages for the generated WordPress theme.`);
  for (const [file, body] of Object.entries(previewBody)) {
    writeText(`docs/themes/${slug}/${file}`, page(file.replace('_preview.html', '').replace('-', ' '), cleanPreviewMarkup(body)));
  }
  writeText(`docs/themes/${slug}/index.html`, page('Preview index', cleanPreviewMarkup(heroHtml + brandPart)));
  const galleryPath = path.join(root, 'docs', 'index.html');
  let gallery = fs.readFileSync(galleryPath, 'utf8');
  const card = `        <article class="theme-card">
          <p class="eyebrow">${slug}</p>
          <h3>Nolan Young Theme 000 - Aster Grove Landscape Design</h3>
          <p>Premium landscape design company theme with matching static preview.</p>
          <p><a href="themes/${slug}/homepage_preview.html">Open preview</a></p>
        </article>`;
  if (gallery.includes('data-empty-state')) {
    gallery = gallery.replace(/\s*<article class="empty-state" data-empty-state>[\s\S]*?<\/article>/, `\n${card}`);
  } else if (!gallery.includes(`themes/${slug}/homepage_preview.html`)) {
    gallery = gallery.replace(/\s*<\/section>\s*<\/main>/, `\n${card}\n      </section>\n    </main>`);
  }
  fs.writeFileSync(galleryPath, gallery, 'utf8');
}

writeTheme();
writePreview();
console.log(`Generated ${slug} with local recovery generator after invalid Ollama file blocks.`);
