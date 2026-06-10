const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname, '..', '..', '..');
const slug = '002_nolan_young_theme_marlow_finch_studio';
const sourceSlug = '001_nolan_young_theme_meridian_strategy_group';
const themeDir = path.join(root, 'wp-content', 'themes', slug);
const previewDir = path.join(root, 'docs', 'themes', slug);
const sourceTheme = path.join(root, 'wp-content', 'themes', sourceSlug);
const sourcePreview = path.join(root, 'docs', 'themes', sourceSlug);
const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'ollama-site-content.json'), 'utf8'));

const imageFiles = [
  'editorial-wedding-candlelight.png',
  'cinematic-portrait-windowlight.png',
  'brand-session-studio-table.png',
  'gallery-wall-contact-sheet.png',
  'evening-event-reception.png',
  'album-proofing-desk.png',
  'studio-light-and-linen.png',
  'print-box-detail.png'
];

spec.tagline = 'Editorial photography with warmth, restraint, and cinematic polish';
spec.heroHeadline = 'Images that feel composed, intimate, and unmistakably yours';
spec.heroCopy = 'Marlow & Finch Studio creates editorial wedding, portrait, brand, and event photography for clients who want quiet luxury, human emotion, and a finished visual story with depth.';
spec.primaryCta = { text: 'Start an inquiry', link: '/contact/' };
spec.secondaryCta = { text: 'View the work', link: '/work/' };
spec.metrics = [
  { value: '18', description: 'select commissions accepted each season' },
  { value: '72 hr', description: 'curated preview gallery turnaround for weddings and events' },
  { value: '4', description: 'service tracks across weddings, portraits, brands, and gatherings' },
  { value: '11 yrs', description: 'of editorial image-making and production experience' }
];
spec.testimonials = [
  { quote: 'The photographs feel like the day actually felt: soft, alive, and beautifully observed. Nothing looked staged, but every frame felt intentional.', name: 'Clara and Theo', title: 'Editorial wedding clients' },
  { quote: 'Marlow & Finch translated our brand into images with texture and restraint. The campaign finally looked like the company we had been trying to describe.', name: 'Nina Patel', title: 'Founder, Vale Atelier' },
  { quote: 'They were calm in a room full of moving parts and still found the small moments that made the gala matter.', name: 'Elliot Reed', title: 'Director, Harrington Arts Trust' }
];
spec.caseStudies = [
  { title: 'A candlelit estate wedding', clientType: 'Editorial wedding', summary: 'A weekend celebration photographed with a restrained editorial rhythm: quiet getting-ready frames, sculptural florals, family portraits, and a cinematic evening reception.', outcome: 'Delivered a 640-image gallery, a 40-frame editorial selects set, and a print-ready heirloom album design.' },
  { title: 'A founder portrait and brand library', clientType: 'Brand photography', summary: 'A studio and location session for a design founder who needed portraits, process imagery, and tactile product details for a full site relaunch.', outcome: 'Created a 120-image brand library used across the website, launch emails, press kit, and social campaign.' },
  { title: 'Museum benefit evening', clientType: 'Event photography', summary: 'Discreet coverage of donor arrivals, room design, speeches, performances, and candid guest interactions at a black-tie arts benefit.', outcome: 'Produced next-morning press selects and a complete sponsor gallery within three business days.' }
];
spec.blogPosts = [
  { title: 'How to build a wedding timeline that leaves room for feeling', category: 'Wedding Planning', summary: 'A practical guide to creating space for portraits, family pictures, and the unscripted frames couples remember most.' },
  { title: 'What makes a brand image library useful', category: 'Brand Photography', summary: 'The difference between a folder of attractive images and a working visual system for launches, press, and campaigns.' },
  { title: 'Why printed photographs still change the work', category: 'Studio Notes', summary: 'A short note on proofing, album sequencing, and the discipline that comes from making images live outside a screen.' }
];
spec.contactIntro = 'Tell us what you are planning, what the images need to hold, and the kind of presence you want from the studio. We will respond with availability, fit, and a clear next step.';
spec.footerSummary = 'Marlow & Finch Studio creates warm cinematic photography for weddings, portraits, brands, and events with an editorial eye and a calm production process.';

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
    [[31, 25, 24], [176, 126, 91], [247, 226, 197]],
    [[44, 34, 39], [156, 111, 122], [238, 215, 204]],
    [[26, 29, 32], [196, 167, 124], [245, 238, 220]],
    [[43, 31, 27], [118, 86, 63], [232, 197, 163]]
  ];
  const colors = palettes[seed % palettes.length];
  for (let y = 0; y < height; y += 1) {
    const row = y * (width * 3 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x += 1) {
      const idx = row + 1 + x * 3;
      const v = (Math.sin((x + seed * 31) / 42) + Math.cos((y + seed * 17) / 38) + 2) / 4;
      const spotlight = Math.max(0, 1 - Math.hypot((x - width * .62) / width, (y - height * .38) / height) * 1.8);
      const a = colors[0];
      const b = v > .56 ? colors[1] : colors[2];
      raw[idx] = Math.min(255, Math.round(a[0] * (1 - v) + b[0] * v + spotlight * 38));
      raw[idx + 1] = Math.min(255, Math.round(a[1] * (1 - v) + b[1] * v + spotlight * 32));
      raw[idx + 2] = Math.min(255, Math.round(a[2] * (1 - v) + b[2] * v + spotlight * 22));
      if ((x + seed * 13) % 251 < 2 || (y + seed * 23) % 191 < 2) {
        raw[idx] = Math.max(0, raw[idx] - 32);
        raw[idx + 1] = Math.max(0, raw[idx + 1] - 26);
        raw[idx + 2] = Math.max(0, raw[idx + 2] - 20);
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
    throw new Error('Theme 01 scaffold is required before generating theme 02.');
  }
  fs.rmSync(themeDir, { recursive: true, force: true });
  fs.rmSync(previewDir, { recursive: true, force: true });
  fs.cpSync(sourceTheme, themeDir, { recursive: true });
  fs.cpSync(sourcePreview, previewDir, { recursive: true });
}

function replaceAllText(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) replaceAllText(full);
    else if (!/\.(png|jpg|jpeg|webp|gif|zip)$/i.test(entry.name)) {
      let text = fs.readFileSync(full, 'utf8');
      text = text
        .replaceAll('001_nolan_young_theme_meridian_strategy_group', '002_nolan_young_theme_marlow_finch_studio')
        .replaceAll('Nolan Young Theme 001 - Meridian Strategy Group', 'Nolan Young Theme 002 - Marlow & Finch Studio')
        .replaceAll('Meridian Strategy Group', 'Marlow & Finch Studio')
        .replaceAll('Meridian', 'Marlow & Finch')
        .replaceAll('operations and compliance consulting firm', 'boutique photography studio')
        .replaceAll('operations and compliance consulting', 'editorial photography');
      fs.writeFileSync(full, text, 'utf8');
    }
  }
}

const menuJs = fs.readFileSync(path.join(sourceTheme, 'assets', 'js', 'bundle.js'), 'utf8').replaceAll('001_nolan_young_theme_meridian_strategy_group', '002_nolan_young_theme_marlow_finch_studio');

const css = `:root {
  --ink: #211b19;
  --muted: #766862;
  --paper: #f6efe6;
  --panel: #fffaf3;
  --line: rgba(33,27,25,.16);
  --accent: #a96f4c;
  --rose: #b98b82;
  --deep: #171312;
  --shadow: 0 24px 70px rgba(33,27,25,.16);
}
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: var(--ink); background: var(--paper); line-height: 1.55; }
body.nolan-menu-open, body.nolan-mobile-open { overflow: hidden; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
.screen-reader-text { position: absolute; left: -9999px; }
.skip-link:focus { left: 1rem; top: 1rem; z-index: 10000; background: #fff; padding: .75rem 1rem; }
.nolan-site-header { position: sticky; top: 0; z-index: 1000; background: rgba(255,250,243,.98); border-bottom: 1px solid var(--line); }
.nolan-header-inner { min-height: 78px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; max-width: 1220px; margin: 0 auto; padding: 0 24px; gap: 20px; }
.nolan-brand { display: inline-flex; align-items: center; gap: 12px; font-weight: 800; }
.nolan-mark { width: 38px; height: 38px; display: grid; place-items: center; background: var(--deep); color: #fff; border-radius: 50%; font-size: .78rem; }
.nolan-primary-nav { display: flex; align-items: center; gap: 8px; }
.nolan-primary-nav a, .nolan-menu-trigger { border: 0; background: transparent; color: var(--ink); font: inherit; font-weight: 700; padding: 12px 14px; cursor: pointer; border-radius: 4px; }
.nolan-primary-nav a:hover, .nolan-menu-trigger:hover, .nolan-menu-trigger[aria-expanded="true"] { background: #eaded2; }
.nolan-header-actions { justify-self: end; display: flex; align-items: center; gap: 12px; }
.button, .nolan-header-cta { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 18px; border-radius: 4px; border: 1px solid var(--deep); background: var(--deep); color: #fff; font-weight: 800; }
.button.secondary { background: transparent; color: var(--deep); }
.nolan-mobile-toggle { display: none; border: 1px solid var(--line); background: var(--panel); padding: 10px 12px; border-radius: 4px; }
.nolan-menu-backdrop { position: fixed; inset: 78px 0 0; background: rgba(23,19,18,.34); z-index: 900; }
.nolan-dropdown { position: fixed; left: 50%; top: 78px; transform: translateX(-50%); width: min(1060px, calc(100vw - 32px)); background: var(--panel); border: 1px solid var(--line); box-shadow: var(--shadow); z-index: 1001; border-radius: 8px; padding: 22px; }
.nolan-dropdown-grid { display: grid; grid-template-columns: 280px 1fr; gap: 22px; }
.nolan-rail { display: grid; gap: 8px; align-content: start; }
.nolan-rail button { text-align: left; border: 1px solid var(--line); background: #f0e4d8; padding: 12px; border-radius: 4px; color: var(--ink); font-weight: 800; }
.nolan-rail button.is-active, .nolan-rail button:focus-visible { outline: 3px solid rgba(169,111,76,.32); background: #fff8ed; }
.nolan-rail-content { min-height: 190px; padding: 12px 4px; }
.nolan-mobile-drawer { position: fixed; inset: 78px 0 auto; z-index: 1002; background: var(--panel); border-bottom: 1px solid var(--line); padding: 24px; box-shadow: var(--shadow); }
.nolan-mobile-drawer nav { display: grid; gap: 14px; }
.section { padding: 88px 24px; }
.section.alt { background: #fff8ef; }
.container { max-width: 1220px; margin: 0 auto; }
.eyebrow { color: #8b5d42; text-transform: uppercase; font-size: .76rem; font-weight: 900; letter-spacing: .1em; }
.hero { min-height: calc(100vh - 78px); padding: 72px 24px 64px; background: radial-gradient(circle at 76% 18%, rgba(185,139,130,.24), transparent 30%), linear-gradient(115deg, #f6efe6 0%, #fff8ef 56%, #ead8ca 100%); display: grid; align-items: center; }
.hero-grid { max-width: 1220px; margin: 0 auto; display: grid; grid-template-columns: .9fr 1.1fr; gap: 42px; align-items: center; }
.hero h1 { font-size: clamp(3rem, 6.6vw, 6.8rem); line-height: .91; margin: 12px 0 20px; max-width: 900px; }
.hero p { font-size: 1.18rem; color: var(--muted); max-width: 690px; }
.hero-actions, .button-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.hero-card { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; box-shadow: var(--shadow); padding: 14px; transform: rotate(1deg); }
.hero-card img { border-radius: 6px; aspect-ratio: 5 / 4; object-fit: cover; }
.hero-proof { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 34px; max-width: 660px; }
.hero-proof span { display: block; font-size: 1.45rem; font-weight: 900; }
.grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 22px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 18px; }
.proof-card, .service-card, .case-card, .post-card, .testimonial-card, .process-card { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; box-shadow: 0 12px 28px rgba(33,27,25,.06); padding: 24px; }
.service-card img, .case-card img, .post-card img { border-radius: 6px; margin-bottom: 18px; aspect-ratio: 16 / 10; object-fit: cover; }
.metric-value { display: block; font-size: 2.05rem; font-weight: 900; color: var(--deep); }
.section-heading { display: flex; justify-content: space-between; gap: 24px; align-items: end; margin-bottom: 32px; }
.section-heading h2 { font-size: clamp(2rem, 4vw, 3.6rem); line-height: 1; margin: 0; max-width: 780px; }
.section-heading p { color: var(--muted); max-width: 430px; }
.page-hero { padding: 90px 24px 58px; background: #fff8ef; border-bottom: 1px solid var(--line); }
.page-hero h1 { margin: 0; font-size: clamp(2.4rem, 5vw, 4.8rem); line-height: 1; }
.form-grid { display: grid; gap: 14px; }
label { font-weight: 800; display: grid; gap: 6px; }
input, textarea, select { width: 100%; border: 1px solid var(--line); border-radius: 4px; padding: 12px; font: inherit; background: #fff; }
textarea { min-height: 140px; }
.site-footer { background: #171312; color: #f8efe6; padding: 68px 24px 36px; position: relative; overflow: hidden; }
.site-footer:before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 78% 10%, rgba(169,111,76,.28), transparent 32%); pointer-events: none; }
.footer-grid { position: relative; max-width: 1220px; margin: 0 auto; display: grid; grid-template-columns: 1.6fr repeat(3, 1fr); gap: 30px; }
.site-footer a { color: #f8efe6; display: block; margin: 7px 0; }
.footer-brand-note { font-size: 1.8rem; line-height: 1.12; max-width: 520px; }
:focus-visible { outline: 3px solid rgba(169,111,76,.55); outline-offset: 3px; }
@media (max-width: 900px) {
  .nolan-header-inner { grid-template-columns: 1fr auto; }
  .nolan-primary-nav, .nolan-header-cta { display: none; }
  .nolan-mobile-toggle { display: inline-flex; }
  .hero { min-height: auto; }
  .hero-grid, .grid-2, .grid-3, .grid-4, .footer-grid { grid-template-columns: 1fr; }
  .hero-proof { grid-template-columns: 1fr; }
  .nolan-dropdown { display: none; }
  .section-heading { display: block; }
}`;

function phpImage(folder, name) {
  return `<?php echo esc_url( get_template_directory_uri() . '/assets/images/${folder}/${name}' ); ?>`;
}

function pageHero(title, copy) {
  return `<section class="page-hero"><div class="container"><p class="eyebrow">Marlow & Finch Studio</p><h1>${esc(title)}</h1><p>${esc(copy)}</p></div></section>`;
}

function serviceCardsPhp() {
  return spec.services.map((service, index) => `<article class="service-card"><img src="${phpImage(index < 2 ? 'hero' : index < 4 ? 'portfolio' : 'texture', imageFiles[(index + 1) % imageFiles.length])}" alt=""><p class="eyebrow">${esc(service.kicker)}</p><h3>${esc(service.title)}</h3><p>${esc(service.summary)}</p><a class="button secondary" href="<?php echo esc_url( home_url( '/single-service/' ) ); ?>">View service detail</a></article>`).join('\n');
}

function caseCardsPhp() {
  return spec.caseStudies.map((item, index) => `<article class="case-card"><img src="${phpImage('portfolio', imageFiles[(index + 2) % imageFiles.length])}" alt=""><p class="eyebrow">${esc(item.clientType)}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><strong>${esc(item.outcome)}</strong></article>`).join('\n');
}

function postCardsPhp() {
  return spec.blogPosts.map((item, index) => `<article class="post-card"><img src="${phpImage('texture', imageFiles[(index + 5) % imageFiles.length])}" alt=""><p class="eyebrow">${esc(item.category)}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Read article</a></article>`).join('\n');
}

function processCardsPhp() {
  return spec.process.map((item, index) => `<article class="process-card"><p class="eyebrow">0${index + 1}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p></article>`).join('\n');
}

function testimonialCardsPhp() {
  return spec.testimonials.map((item) => `<blockquote class="testimonial-card"><p>"${esc(item.quote)}"</p><cite>${esc(item.name)}<br>${esc(item.title)}</cite></blockquote>`).join('\n');
}

function heroPhp() {
  return `<section class="hero"><div class="hero-grid"><div><p class="eyebrow">${esc(spec.tagline)}</p><h1>${esc(spec.heroHeadline)}</h1><p>${esc(spec.heroCopy)}</p><div class="hero-actions"><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Start an inquiry</a><a class="button secondary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>">View the work</a></div><div class="hero-proof">${spec.metrics.slice(0, 3).map((metric) => `<p><span>${esc(metric.value)}</span>${esc(metric.description)}</p>`).join('')}</div></div><div class="hero-card"><img src="${phpImage('hero', imageFiles[0])}" alt=""></div></div></section>`;
}

function writeThemeFiles() {
  write(path.join(themeDir, 'style.css'), `/*\nTheme Name: Nolan Young Theme 002 - Marlow & Finch Studio\nTheme URI: https://nolan.local/\nAuthor: Nolan Young\nDescription: Premium classic WordPress theme for Marlow & Finch Studio, a boutique editorial photography studio.\nVersion: 1.0.0\nLicense: GPL-2.0-or-later\nText Domain: 002_nolan_young_theme_marlow_finch_studio\n*/\n`);
  write(path.join(themeDir, 'header.php'), `<?php\n?><!doctype html>\n<html <?php language_attributes(); ?>>\n<head><meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>\n<body <?php body_class(); ?>><?php wp_body_open(); ?><a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', '002_nolan_young_theme_marlow_finch_studio' ); ?></a><header class="nolan-site-header" data-site-header><div class="nolan-header-inner"><a class="nolan-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>"><span class="nolan-mark">MF</span><span>Marlow &amp; Finch Studio</span></a><nav class="nolan-primary-nav" aria-label="<?php esc_attr_e( 'Primary navigation', '002_nolan_young_theme_marlow_finch_studio' ); ?>"><button class="nolan-menu-trigger" type="button" data-menu-item="services" aria-controls="nolan-menu-services" aria-expanded="false">Services</button><button class="nolan-menu-trigger" type="button" data-menu-item="about" aria-controls="nolan-menu-about" aria-expanded="false">About</button><a href="<?php echo esc_url( home_url( '/work/' ) ); ?>">Work</a><button class="nolan-menu-trigger" type="button" data-menu-item="blog" aria-controls="nolan-menu-blog" aria-expanded="false">Blog</button></nav><div class="nolan-header-actions"><a class="nolan-header-cta" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a><button class="nolan-mobile-toggle" type="button" data-mobile-toggle aria-controls="nolan-mobile-drawer" aria-expanded="false">Menu</button></div></div><div class="nolan-menu-backdrop" data-menu-backdrop hidden></div><?php get_template_part( 'template-parts/content', 'mega-menu' ); ?><div class="nolan-mobile-drawer" id="nolan-mobile-drawer" data-mobile-drawer hidden><nav><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Services</a><a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>">About</a><a href="<?php echo esc_url( home_url( '/work/' ) ); ?>">Work</a><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Blog</a><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a></nav></div></header><main id="primary" class="site-main">\n`);
  write(path.join(themeDir, 'footer.php'), `</main><footer class="site-footer"><div class="footer-grid"><div><p class="eyebrow">Marlow &amp; Finch Studio</p><p class="footer-brand-note">${esc(spec.footerSummary)}</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Start an inquiry</a></div><div><h3>Services</h3><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Editorial Weddings</a><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Portraits</a><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Brand Photography</a></div><div><h3>Studio</h3><a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>">About</a><a href="<?php echo esc_url( home_url( '/work/' ) ); ?>">Work</a><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Journal</a></div><div><h3>Inquiries</h3><p>Editorial weddings, portraits, brand stories, and events.</p><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a></div></div></footer><?php wp_footer(); ?></body></html>\n`);
  write(path.join(themeDir, 'front-page.php'), `<?php get_header(); ?>\n<?php /* Template map: content-home-hero, content-home-services, content-home-work, content-home-process, content-home-testimonials, content-home-cta. */ ?>\n<?php get_template_part( 'template-parts/content', 'home-hero' ); ?>\n<?php get_template_part( 'template-parts/content', 'home-services' ); ?>\n<?php get_template_part( 'template-parts/content', 'home-work' ); ?>\n<?php get_template_part( 'template-parts/content', 'home-process' ); ?>\n<?php get_template_part( 'template-parts/content', 'home-testimonials' ); ?>\n<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>\n<?php get_template_part( 'template-parts/content', 'home-cta' ); ?>\n<?php get_footer(); ?>\n`);
  write(path.join(themeDir, 'README.md'), `# Nolan Young Theme 002 - Marlow & Finch Studio\n\nPremium classic WordPress theme for Marlow & Finch Studio.\n\nRun \`npm install\` and \`npm run build\` before packaging.\n`);
  write(path.join(themeDir, 'CHANGELOG.md'), `# Changelog\n\n## 1.0.0\n\n- Initial local Ollama photography studio theme.\n`);
  write(path.join(themeDir, 'package.json'), JSON.stringify({ name: slug, version: '1.0.0', scripts: { build: 'node build/webpack.config.js' }, dependencies: {}, devDependencies: {} }, null, 2));
  write(path.join(themeDir, 'package-lock.json'), JSON.stringify({ name: slug, version: '1.0.0', lockfileVersion: 3, requires: true, packages: { '': { name: slug, version: '1.0.0' } } }, null, 2));
  write(path.join(themeDir, 'assets', 'css', 'bundle.css'), css);
  write(path.join(themeDir, 'assets', 'js', 'bundle.js'), menuJs);
  write(path.join(themeDir, 'src', 'scss', 'main.scss'), css);
  write(path.join(themeDir, 'src', 'js', 'main.js'), menuJs);
  write(path.join(themeDir, 'build', 'webpack.config.js'), `const fs = require('fs');\nconst path = require('path');\nconst root = path.resolve(__dirname, '..');\nfs.copyFileSync(path.join(root, 'src/scss/main.scss'), path.join(root, 'assets/css/bundle.css'));\nfs.copyFileSync(path.join(root, 'src/js/main.js'), path.join(root, 'assets/js/bundle.js'));\nconsole.log('Built local CSS and JS bundles.');\n`);

  const mega = `<div class="nolan-dropdown" id="nolan-menu-services" data-menu-dropdown="services" aria-hidden="true" hidden><div class="nolan-dropdown-grid"><div class="nolan-rail"><button type="button" data-rail-item="weddings" aria-selected="true">Editorial Weddings</button><button type="button" data-rail-item="portraits" aria-selected="false">Portraits</button><button type="button" data-rail-item="brands" aria-selected="false">Brand Stories</button></div><div><section class="nolan-rail-content" data-rail-content="weddings"><h3>Editorial Weddings</h3><p>Weekend stories with cinematic pacing, family care, and magazine-level finish.</p><a class="button" href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Explore services</a></section><section class="nolan-rail-content" data-rail-content="portraits" hidden><h3>Portrait Sessions</h3><p>Windowlight, studio direction, and careful editing for expressive portraits.</p><a class="button" href="<?php echo esc_url( home_url( '/single-service/' ) ); ?>">View service detail</a></section><section class="nolan-rail-content" data-rail-content="brands" hidden><h3>Brand Photography</h3><p>Image libraries for founders, campaigns, launches, and editorial press.</p><a class="button" href="<?php echo esc_url( home_url( '/work/' ) ); ?>">See work</a></section></div></div></div><div class="nolan-dropdown" id="nolan-menu-about" data-menu-dropdown="about" aria-hidden="true" hidden><div class="nolan-dropdown-grid"><div class="nolan-rail"><button type="button" data-rail-item="studio" aria-selected="true">Studio</button><button type="button" data-rail-item="approach" aria-selected="false">Approach</button></div><div><section class="nolan-rail-content" data-rail-content="studio"><h3>Warm, observant, editorial</h3><p>A boutique team for clients who want presence without spectacle.</p><a class="button" href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>">About the studio</a></section><section class="nolan-rail-content" data-rail-content="approach" hidden><h3>Direction with ease</h3><p>Careful planning, calm production, and finished images with emotional texture.</p><a class="button" href="<?php echo esc_url( home_url( '/work/' ) ); ?>">View galleries</a></section></div></div></div><div class="nolan-dropdown" id="nolan-menu-blog" data-menu-dropdown="blog" aria-hidden="true" hidden><div class="nolan-dropdown-grid"><div class="nolan-rail"><button type="button" data-rail-item="journal" aria-selected="true">Journal</button><button type="button" data-rail-item="guides" aria-selected="false">Guides</button></div><div><section class="nolan-rail-content" data-rail-content="journal"><h3>Notes from the studio</h3><p>Planning, image-making, print, and visual storytelling notes.</p><a class="button" href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Read journal</a></section><section class="nolan-rail-content" data-rail-content="guides" hidden><h3>Planning guides</h3><p>Practical guidance for wedding timelines, portrait prep, and brand libraries.</p><a class="button" href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Browse guides</a></section></div></div></div>`;
  write(path.join(themeDir, 'template-parts', 'content-mega-menu.php'), mega);

  const homeServices = `<section class="section"><div class="container"><div class="section-heading"><h2>Photographic work for people, places, and brands with a point of view.</h2><p>Each commission is planned with editorial structure and photographed with room for instinct.</p></div><div class="grid-4">${serviceCardsPhp()}</div></div></section>`;
  const homeWork = `<section class="section alt"><div class="container"><div class="grid-4">${spec.metrics.map((m) => `<article class="proof-card"><span class="metric-value">${esc(m.value)}</span><p>${esc(m.description)}</p></article>`).join('')}</div></div></section><section class="section"><div class="container"><div class="section-heading"><h2>Recent visual stories</h2><p>Wedding weekends, founder portraits, and events photographed with a cinematic editorial eye.</p></div><div class="grid-3">${caseCardsPhp()}</div></div></section>`;
  const homeProcess = `<section class="section alt"><div class="container"><div class="section-heading"><h2>A calm process for images with feeling.</h2><p>From first inquiry to final print, the studio keeps planning clear and the experience grounded.</p></div><div class="grid-4">${processCardsPhp()}</div></div></section>`;
  const cta = `<section class="section"><div class="container"><div class="proof-card"><p class="eyebrow">Inquiries</p><h2>Tell us what the photographs need to hold.</h2><p>${esc(spec.contactIntro)}</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a></div></div></section>`;
  const parts = {
    'content-home-hero.php': heroPhp(),
    'content-home-services.php': homeServices,
    'content-home-work.php': homeWork,
    'content-home-process.php': homeProcess,
    'content-home-testimonials.php': `<section class="section"><div class="container"><div class="grid-3">${testimonialCardsPhp()}</div></div></section>`,
    'content-blog-preview.php': `<section class="section alt"><div class="container"><div class="section-heading"><h2>Studio journal</h2><a class="button secondary" href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Read the journal</a></div><div class="grid-3">${postCardsPhp()}</div></div></section>`,
    'content-home-cta.php': cta,
    'content-services.php': `${pageHero('Photography services', 'Editorial wedding coverage, expressive portraits, brand libraries, and event storytelling with a calm high-touch process.')}<section class="section"><div class="container"><div class="grid-4">${serviceCardsPhp()}</div></div></section>`,
    'content-about.php': `${pageHero('A boutique studio for composed, human photographs', 'Marlow & Finch brings editorial discipline to emotionally alive image-making.')}<section class="section"><div class="container grid-3"><article class="proof-card"><h3>Warm direction</h3><p>Clients are guided with clarity while moments keep their natural shape.</p></article><article class="proof-card"><h3>Cinematic restraint</h3><p>Color, light, and sequencing are handled with quiet polish.</p></article><article class="proof-card"><h3>Finished delivery</h3><p>Galleries, selects, albums, and brand libraries are prepared for real use.</p></article></div></section>`,
    'content-work.php': `${pageHero('Selected work', 'A look at celebrations, portraits, campaigns, and gatherings shaped with editorial care.')}<section class="section"><div class="container"><div class="grid-3">${caseCardsPhp()}</div></div></section>`,
    'content-blog.php': `${pageHero('Studio journal', 'Planning notes and image-making essays from Marlow & Finch Studio.')}<section class="section"><div class="container"><div class="grid-3">${postCardsPhp()}</div></div></section>`,
    'content-contact.php': `${pageHero('Begin an inquiry', spec.contactIntro)}<section class="section"><div class="container grid-2"><form class="proof-card form-grid"><label>Name<input type="text" name="name"></label><label>Email<input type="email" name="email"></label><label>Commission type<select name="commission"><option>Editorial wedding</option><option>Portrait session</option><option>Brand photography</option><option>Event coverage</option></select></label><label>Tell us about the date, place, and feeling<textarea name="message"></textarea></label><button class="button" type="submit">Send inquiry</button></form><div class="proof-card"><h2>Studio availability</h2><p>The studio accepts a limited number of commissions each season so planning, photographing, and finishing receive proper attention.</p><p>Based in New York. Available for destination wedding weekends and select editorial brand work.</p></div></div></section>`,
    'content-single-service.php': `${pageHero('Editorial Wedding Photography', spec.services[0].detail)}<section class="section"><div class="container grid-2"><div><h2>What is included</h2><ul><li>Planning call and visual direction</li><li>Timeline review for light and family portraits</li><li>Full-day or weekend coverage options</li><li>Preview gallery, final gallery, and album guidance</li></ul></div><div class="proof-card"><h3>Best for</h3><p>Couples who want photographs that feel cinematic, intimate, and carefully sequenced.</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Discuss your date</a></div></div></section>`,
    'content-all-services.php': `<section class="section"><div class="container"><div class="grid-4">${serviceCardsPhp()}</div></div></section>`,
    'content-featured-work.php': `<section class="section"><div class="container"><div class="grid-3">${caseCardsPhp()}</div></div></section>`,
    'content-process.php': homeProcess,
    'content-testimonials.php': `<section class="section"><div class="container"><div class="grid-3">${testimonialCardsPhp()}</div></div></section>`,
    'content-cta-banner.php': cta,
    'content-single-service-highlight.php': pageHero('Editorial Wedding Photography', spec.services[0].summary),
    'content-hero.php': heroPhp(),
    'content-brand-statement.php': `<section class="section alt"><div class="container"><h2>Quiet luxury, human emotion, and editorial finish.</h2><p>${esc(spec.heroCopy)}</p></div></section>`,
    'content-style-pillars.php': `<section class="section"><div class="container grid-3"><article class="proof-card"><h3>Light</h3><p>Natural, sculpted, and cinematic without heavy-handed treatment.</p></article><article class="proof-card"><h3>Presence</h3><p>Direction that helps clients feel settled without losing spontaneity.</p></article><article class="proof-card"><h3>Sequence</h3><p>Final galleries are edited as complete visual stories.</p></article></div></section>`,
    'content-footer-widgets.php': `<div class="footer-grid"><p>${esc(spec.footerSummary)}</p></div>`
  };
  Object.entries(parts).forEach(([file, content]) => write(path.join(themeDir, 'template-parts', file), content + '\n'));
}

function previewHeader() {
  return `<header class="nolan-site-header" data-site-header><div class="nolan-header-inner"><a class="nolan-brand" href="homepage_preview.html"><span class="nolan-mark">MF</span><span>Marlow &amp; Finch Studio</span></a><nav class="nolan-primary-nav"><button class="nolan-menu-trigger" type="button" data-menu-item="services" aria-controls="preview-menu-services" aria-expanded="false">Services</button><button class="nolan-menu-trigger" type="button" data-menu-item="about" aria-controls="preview-menu-about" aria-expanded="false">About</button><a href="work_preview.html">Work</a><button class="nolan-menu-trigger" type="button" data-menu-item="blog" aria-controls="preview-menu-blog" aria-expanded="false">Blog</button></nav><div class="nolan-header-actions"><a class="nolan-header-cta" href="contact_preview.html">Contact Us</a><button class="nolan-mobile-toggle" type="button" data-mobile-toggle aria-controls="preview-mobile-drawer" aria-expanded="false">Menu</button></div></div><div class="nolan-menu-backdrop" data-menu-backdrop hidden></div>${previewMega()}<div class="nolan-mobile-drawer" id="preview-mobile-drawer" data-mobile-drawer hidden><nav><a href="homepage_preview.html">Home</a><a href="services_preview.html">Services</a><a href="about-us_preview.html">About</a><a href="work_preview.html">Work</a><a href="blog_preview.html">Blog</a><a href="contact_preview.html">Contact Us</a><a href="single_services_preview.html">Service detail</a></nav></div></header>`;
}

function previewMega() {
  return `<div class="nolan-dropdown" id="preview-menu-services" data-menu-dropdown="services" aria-hidden="true" hidden><div class="nolan-dropdown-grid"><div class="nolan-rail"><button type="button" data-rail-item="weddings" aria-selected="true">Editorial Weddings</button><button type="button" data-rail-item="portraits" aria-selected="false">Portraits</button><button type="button" data-rail-item="brands" aria-selected="false">Brand Stories</button></div><div><section class="nolan-rail-content" data-rail-content="weddings"><h3>Editorial Weddings</h3><p>Weekend stories with cinematic pacing and magazine-level finish.</p><a class="button" href="services_preview.html">Explore services</a></section><section class="nolan-rail-content" data-rail-content="portraits" hidden><h3>Portrait Sessions</h3><p>Expressive portrait direction with soft editorial restraint.</p><a class="button" href="single_services_preview.html">View service detail</a></section><section class="nolan-rail-content" data-rail-content="brands" hidden><h3>Brand Photography</h3><p>Image libraries for founders, launches, and campaigns.</p><a class="button" href="work_preview.html">See work</a></section></div></div></div><div class="nolan-dropdown" id="preview-menu-about" data-menu-dropdown="about" aria-hidden="true" hidden><div class="nolan-dropdown-grid"><div class="nolan-rail"><button type="button" data-rail-item="studio" aria-selected="true">Studio</button><button type="button" data-rail-item="approach" aria-selected="false">Approach</button></div><div><section class="nolan-rail-content" data-rail-content="studio"><h3>Warm, observant, editorial</h3><p>A boutique team for clients who want presence without spectacle.</p><a class="button" href="about-us_preview.html">About the studio</a></section><section class="nolan-rail-content" data-rail-content="approach" hidden><h3>Direction with ease</h3><p>Careful planning, calm production, and images with emotional texture.</p><a class="button" href="work_preview.html">View galleries</a></section></div></div></div><div class="nolan-dropdown" id="preview-menu-blog" data-menu-dropdown="blog" aria-hidden="true" hidden><div class="nolan-dropdown-grid"><div class="nolan-rail"><button type="button" data-rail-item="journal" aria-selected="true">Journal</button><button type="button" data-rail-item="guides" aria-selected="false">Guides</button></div><div><section class="nolan-rail-content" data-rail-content="journal"><h3>Notes from the studio</h3><p>Planning, image-making, print, and visual storytelling notes.</p><a class="button" href="blog_preview.html">Read journal</a></section><section class="nolan-rail-content" data-rail-content="guides" hidden><h3>Planning guides</h3><p>Practical guidance for timelines, portrait prep, and brand libraries.</p><a class="button" href="blog_preview.html">Browse guides</a></section></div></div></div>`;
}

function pimg(name) {
  return `assets/images/${name}`;
}

function serviceCardsHtml() {
  return spec.services.map((service, index) => `<article class="service-card"><img src="${pimg(imageFiles[(index + 1) % imageFiles.length])}" alt=""><p class="eyebrow">${esc(service.kicker)}</p><h3>${esc(service.title)}</h3><p>${esc(service.summary)}</p><a class="button secondary" href="single_services_preview.html">View service detail</a></article>`).join('\n');
}

function caseCardsHtml() {
  return spec.caseStudies.map((item, index) => `<article class="case-card"><img src="${pimg(imageFiles[(index + 2) % imageFiles.length])}" alt=""><p class="eyebrow">${esc(item.clientType)}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><strong>${esc(item.outcome)}</strong></article>`).join('\n');
}

function postCardsHtml() {
  return spec.blogPosts.map((item, index) => `<article class="post-card"><img src="${pimg(imageFiles[(index + 5) % imageFiles.length])}" alt=""><p class="eyebrow">${esc(item.category)}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><a href="blog_preview.html">Read article</a></article>`).join('\n');
}

function processCardsHtml() {
  return spec.process.map((item, index) => `<article class="process-card"><p class="eyebrow">0${index + 1}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p></article>`).join('\n');
}

function testimonialsHtml() {
  return spec.testimonials.map((item) => `<blockquote class="testimonial-card"><p>"${esc(item.quote)}"</p><cite>${esc(item.name)}<br>${esc(item.title)}</cite></blockquote>`).join('\n');
}

function heroHtml() {
  return `<section class="hero"><div class="hero-grid"><div><p class="eyebrow">${esc(spec.tagline)}</p><h1>${esc(spec.heroHeadline)}</h1><p>${esc(spec.heroCopy)}</p><div class="hero-actions"><a class="button" href="contact_preview.html">Start an inquiry</a><a class="button secondary" href="work_preview.html">View the work</a></div><div class="hero-proof">${spec.metrics.slice(0, 3).map((m) => `<p><span>${esc(m.value)}</span>${esc(m.description)}</p>`).join('')}</div></div><div class="hero-card"><img src="${pimg(imageFiles[0])}" alt=""></div></div></section>`;
}

function shell(title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} | Marlow & Finch Studio</title><link rel="stylesheet" href="assets/css/preview.css"></head><body>${previewHeader()}<main id="primary">${body}</main>${previewFooter()}<script src="assets/js/preview.js"></script></body></html>`;
}

function previewFooter() {
  return `<footer class="site-footer"><div class="footer-grid"><div><p class="eyebrow">Marlow &amp; Finch Studio</p><p class="footer-brand-note">${esc(spec.footerSummary)}</p><a class="button" href="contact_preview.html">Start an inquiry</a></div><div><h3>Services</h3><a href="services_preview.html">Editorial Weddings</a><a href="single_services_preview.html">Portraits</a><a href="services_preview.html">Brand Photography</a></div><div><h3>Studio</h3><a href="about-us_preview.html">About</a><a href="work_preview.html">Work</a><a href="blog_preview.html">Journal</a></div><div><h3>Inquiries</h3><p>Wedding weekends, portraits, brand stories, and events.</p><a href="contact_preview.html">Contact Us</a><a href="homepage_preview.html">Home</a></div></div></footer>`;
}

function writePreviewFiles() {
  write(path.join(previewDir, 'assets', 'css', 'preview.css'), css);
  write(path.join(previewDir, 'assets', 'js', 'preview.js'), menuJs);
  write(path.join(previewDir, 'README.md'), '# Nolan Young Theme 002 - Marlow & Finch Studio Preview\n\nStatic preview for Marlow & Finch Studio.\n');
  write(path.join(previewDir, 'assets', 'images', 'README.md'), '# Preview Images\n\nLocal generated raster assets for the photography studio preview.\n');
  const home = `${heroHtml()}<section class="section"><div class="container"><div class="section-heading"><h2>Photographic work for people, places, and brands with a point of view.</h2><p>Each commission is planned with editorial structure and photographed with room for instinct.</p></div><div class="grid-4">${serviceCardsHtml()}</div></div></section><section class="section alt"><div class="container"><div class="grid-4">${spec.metrics.map((m) => `<article class="proof-card"><span class="metric-value">${esc(m.value)}</span><p>${esc(m.description)}</p></article>`).join('')}</div></div></section><section class="section"><div class="container"><div class="section-heading"><h2>Recent visual stories</h2><p>Wedding weekends, founder portraits, and events photographed with a cinematic editorial eye.</p></div><div class="grid-3">${caseCardsHtml()}</div></div></section><section class="section alt"><div class="container"><div class="section-heading"><h2>A calm process for images with feeling.</h2><p>From first inquiry to final print, the studio keeps planning clear.</p></div><div class="grid-4">${processCardsHtml()}</div></div></section><section class="section"><div class="container"><div class="grid-3">${testimonialsHtml()}</div></div></section><section class="section alt"><div class="container"><div class="section-heading"><h2>Studio journal</h2><a class="button secondary" href="blog_preview.html">Read the journal</a></div><div class="grid-3">${postCardsHtml()}</div></div></section><section class="section"><div class="container"><div class="proof-card"><p class="eyebrow">Inquiries</p><h2>Tell us what the photographs need to hold.</h2><p>${esc(spec.contactIntro)}</p><a class="button" href="contact_preview.html">Contact Us</a></div></div></section>`;
  write(path.join(previewDir, 'homepage_preview.html'), shell('Home', home));
  write(path.join(previewDir, 'index.html'), shell('Home', home));
  write(path.join(previewDir, 'services_preview.html'), shell('Services', `${pageHero('Photography services', 'Editorial wedding coverage, expressive portraits, brand libraries, and event storytelling with a calm high-touch process.')}<section class="section"><div class="container"><div class="grid-4">${serviceCardsHtml()}</div></div></section>`));
  write(path.join(previewDir, 'about-us_preview.html'), shell('About Us', `${pageHero('A boutique studio for composed, human photographs', 'Marlow & Finch brings editorial discipline to emotionally alive image-making.')}<section class="section"><div class="container grid-3"><article class="proof-card"><h3>Warm direction</h3><p>Clients are guided with clarity while moments keep their natural shape.</p></article><article class="proof-card"><h3>Cinematic restraint</h3><p>Color, light, and sequencing are handled with quiet polish.</p></article><article class="proof-card"><h3>Finished delivery</h3><p>Galleries, selects, albums, and brand libraries are prepared for real use.</p></article></div></section>`));
  write(path.join(previewDir, 'work_preview.html'), shell('Work', `${pageHero('Selected work', 'A look at celebrations, portraits, campaigns, and gatherings shaped with editorial care.')}<section class="section"><div class="container"><div class="grid-3">${caseCardsHtml()}</div></div></section>`));
  write(path.join(previewDir, 'blog_preview.html'), shell('Blog', `${pageHero('Studio journal', 'Planning notes and image-making essays from Marlow & Finch Studio.')}<section class="section"><div class="container"><div class="grid-3">${postCardsHtml()}</div></div></section>`));
  write(path.join(previewDir, 'single_services_preview.html'), shell('Editorial Wedding Photography', `${pageHero('Editorial Wedding Photography', spec.services[0].detail)}<section class="section"><div class="container grid-2"><div><h2>What is included</h2><ul><li>Planning call and visual direction</li><li>Timeline review for light and family portraits</li><li>Full-day or weekend coverage options</li><li>Preview gallery, final gallery, and album guidance</li></ul></div><div class="proof-card"><h3>Best for</h3><p>Couples who want photographs that feel cinematic, intimate, and carefully sequenced.</p><a class="button" href="contact_preview.html">Discuss your date</a></div></div></section>`));
  write(path.join(previewDir, 'contact_preview.html'), shell('Contact', `${pageHero('Begin an inquiry', spec.contactIntro)}<section class="section"><div class="container grid-2"><form class="proof-card form-grid"><label>Name<input type="text" name="name"></label><label>Email<input type="email" name="email"></label><label>Commission type<select name="commission"><option>Editorial wedding</option><option>Portrait session</option><option>Brand photography</option><option>Event coverage</option></select></label><label>Tell us about the date, place, and feeling<textarea name="message"></textarea></label><button class="button" type="submit">Send inquiry</button></form><div class="proof-card"><h2>Studio availability</h2><p>The studio accepts a limited number of commissions each season so planning, photographing, and finishing receive proper attention.</p><p>Based in New York. Available for destination wedding weekends and select editorial brand work.</p></div></div></section>`));
}

function writeImages() {
  fs.rmSync(path.join(themeDir, 'assets', 'images'), { recursive: true, force: true });
  fs.rmSync(path.join(previewDir, 'assets', 'images'), { recursive: true, force: true });
  imageFiles.forEach((file, index) => {
    const png = makePng(1300, 820, index + 4);
    const folder = index < 2 ? 'hero' : index < 5 ? 'portfolio' : 'texture';
    writeBin(path.join(themeDir, 'assets', 'images', folder, file), png);
    writeBin(path.join(previewDir, 'assets', 'images', file), png);
  });
  write(path.join(previewDir, 'assets', 'images', 'README.md'), '# Preview Images\n\nLocal generated raster assets for Marlow & Finch Studio.\n');
  writeBin(path.join(themeDir, 'screenshot.png'), makePng(1200, 900, 42));
}

function updateGallery() {
  const gallery = path.join(root, 'docs', 'index.html');
  let html = fs.readFileSync(gallery, 'utf8');
  const href = `themes/${slug}/homepage_preview.html`;
  if (!html.includes(href)) {
    const card = `\n        <article class="theme-card">\n          <p class="eyebrow">${slug}</p>\n          <h3>Nolan Young Theme 002 - Marlow & Finch Studio</h3>\n          <p>Premium Marlow & Finch Studio WordPress theme with matching static preview.</p>\n          <p><a href="${href}">Open preview</a></p>\n        </article>\n`;
    html = html.replace(/(\s*<\/section>\s*<\/main>)/, `${card}$1`);
    fs.writeFileSync(gallery, html, 'utf8');
  }
}

copyScaffold();
replaceAllText(themeDir);
replaceAllText(previewDir);
writeThemeFiles();
writePreviewFiles();
writeImages();
updateGallery();
console.log(`Generated ${slug} from local Ollama photography spec.`);
