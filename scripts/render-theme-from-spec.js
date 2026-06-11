#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const [slug, promptFile, planFile, specFile, rootArg] = process.argv.slice(2);
if (!slug || !promptFile || !planFile || !specFile) {
  console.error('Usage: node scripts/render-theme-from-spec.js <slug> <prompt-file> <plan-file> <spec-raw-file> [repo-root]');
  process.exit(1);
}

const root = path.resolve(rootArg || path.join(__dirname, '..'));
const themeDir = path.join(root, 'wp-content', 'themes', slug);
const previewDir = path.join(root, 'docs', 'themes', slug);
const prompt = readIfExists(promptFile);
const plan = readIfExists(planFile);
const rawSpec = readIfExists(specFile);
const spec = normalizeSpec(parseSpec(rawSpec), prompt, plan, slug);
const td = slug;
const prefix = `nytf_${slug.slice(0, 3)}`;

function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content);
}

function writeText(relativePath, content) {
  write(path.join(root, relativePath), `${String(content).trimStart().replace(/\r\n/g, '\n')}\n`);
}

function stripAnsi(input) {
  return String(input || '')
    .replace(/\u001B\[[0-9;?]*[ -/]*[@-~]/g, '')
    .replace(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]\s*/g, '');
}

function parseSpec(input) {
  const clean = stripAnsi(input);
  const fenced = clean.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1]);
    } catch (_) {
      // Fall through to balanced object extraction.
    }
  }

  const start = clean.indexOf('{');
  if (start === -1) return {};
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < clean.length; i += 1) {
    const ch = clean[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(clean.slice(start, i + 1));
        } catch (_) {
          return {};
        }
      }
    }
  }
  return {};
}

function text(value, fallback) {
  const out = String(value || '').replace(/\s+/g, ' ').trim();
  return out || fallback;
}

function list(value, fallback) {
  return Array.isArray(value) && value.length ? value.filter(Boolean).map(String) : fallback;
}

function titleCase(value) {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function safeArrayObjects(value, fallback) {
  if (!Array.isArray(value) || !value.length) return fallback;
  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry, index) => ({
      title: text(entry.title, fallback[index % fallback.length].title),
      text: text(entry.text || entry.description, fallback[index % fallback.length].text),
    }));
}

function inferBrand(promptText, fallbackSlug) {
  const quoted = promptText.match(/(?:named|called|brand(?:ed)? as)\s+["“]([^"”]+)["”]/i);
  if (quoted) return quoted[1].trim();
  const concept = promptText.match(/Business concept:\s*([^\n.]+)/i);
  if (concept) return concept[1].replace(/^A\s+/i, '').trim();
  return titleCase(fallbackSlug.replace(/^\d{3}_nolan_young_theme_/, ''));
}

function normalizeSpec(input, promptText, planText, fallbackSlug) {
  const isLandscape = /landscape|garden|outdoor|planting|stone|terrace/i.test(`${promptText}\n${planText}`);
  const brandName = text(input.brandName || input.businessName || input.name, inferBrand(promptText, fallbackSlug));
  const industry = text(input.industry, isLandscape ? 'landscape design and outdoor living' : 'premium professional services');
  const region = text(input.region, 'by appointment');
  const tone = text(input.tone, isLandscape ? 'refined, grounded, editorial, and warm' : 'clear, premium, and practical');
  const heroTitle = text(input.heroTitle, isLandscape ? 'Outdoor rooms with the calm precision of architecture.' : `${brandName} builds complete client experiences with quiet confidence.`);
  const heroText = text(input.heroText, isLandscape
    ? 'Design, construction coordination, planting, lighting, and stewardship are shaped into one clear path for homeowners who want the outdoors to feel resolved.'
    : 'A complete website system with services, proof, process, resources, and contact paths that feel finished from the first visit.');

  const defaultServices = isLandscape ? [
    { title: 'Garden design and build', text: 'Site planning, planting structure, stonework coordination, and final installation leadership in one accountable studio path.' },
    { title: 'Outdoor living rooms', text: 'Terraces, courtyards, poolside planting, dining areas, and kitchens planned around real daily use.' },
    { title: 'Lighting and materials', text: 'Warm lighting plans, limestone, bronze, clay, gravel, and wood specified for durability and restraint.' },
    { title: 'Estate stewardship', text: 'Seasonal edits, plant health reviews, and long-term care notes that protect the original design intent.' },
  ] : [
    { title: 'Strategic planning', text: 'Clarify priorities, audiences, offers, and execution phases before production begins.' },
    { title: 'Client experience systems', text: 'Create service paths, proof points, and follow-up rhythms that make decisions easier.' },
    { title: 'Implementation support', text: 'Turn strategy into a working website structure, visual system, and launch-ready content.' },
    { title: 'Ongoing refinement', text: 'Review performance signals and keep the experience aligned with client needs.' },
  ];

  const defaultProjects = isLandscape ? [
    { title: 'Courtyard retreat', text: 'A narrow rear garden became a calm sequence of limestone, evergreen structure, and evening seating.' },
    { title: 'Stone garden room', text: 'Hand-selected paving, low walls, shade planting, and soft lighting created a durable outdoor room.' },
    { title: 'Dining terrace', text: 'A terrace plan balanced cooking, dining, drainage, and planted enclosure without visual clutter.' },
  ] : [
    { title: 'Service system refresh', text: 'A complex offer became a clear set of paths, proof cards, and guided calls to action.' },
    { title: 'Resource hub launch', text: 'Editorial content, conversion pages, and trust signals were staged into a coherent client journey.' },
    { title: 'Operations-ready website', text: 'Page templates, forms, and documentation were prepared for launch and future updates.' },
  ];

  const defaultResources = isLandscape ? [
    { title: 'How early should a garden plan begin?', text: 'Why winter planning improves pricing, plant availability, and construction sequencing.' },
    { title: 'Choosing stone that will age well', text: 'A practical guide to limestone, gravel, clay pavers, and bronze details in residential gardens.' },
    { title: 'Seasonal care after installation', text: 'The pruning, lighting, soil, and editing rhythm that keeps a new garden improving.' },
  ] : [
    { title: 'When to rebuild a service page', text: 'Signals that a page needs clearer positioning, better proof, or a stronger conversion path.' },
    { title: 'How to organize resource content', text: 'A practical approach to categories, summaries, and calls to action.' },
    { title: 'What makes a homepage feel complete', text: 'The core sections that turn a concept into a credible business website.' },
  ];

  return {
    brandName,
    industry,
    region,
    tone,
    heroTitle,
    heroText,
    eyebrow: text(input.eyebrow, brandName),
    services: safeArrayObjects(input.services, defaultServices).slice(0, 4),
    projects: safeArrayObjects(input.projects || input.work, defaultProjects).slice(0, 3),
    resources: safeArrayObjects(input.resources || input.blog, defaultResources).slice(0, 3),
    process: safeArrayObjects(input.process, [
      { title: 'Listen and map', text: 'Document priorities, constraints, audience needs, and what success must feel like.' },
      { title: 'Design and specify', text: 'Turn the strategy into layouts, content structure, materials, and build-ready decisions.' },
      { title: 'Build and refine', text: 'Coordinate implementation, test the experience, and prepare long-term care notes.' },
    ]).slice(0, 3),
    proof: list(input.proof, isLandscape ? ['18 estate gardens stewarded', '5 integrated design-build disciplines', '12 month care plans'] : ['7 page preview system', 'Local assets only', 'Validation-ready output']).slice(0, 3),
    testimonial: text(input.testimonial, isLandscape
      ? 'Aster Grove gave us a garden that feels established, intentional, and easy to live in. The process was calm from start to finish.'
      : `${brandName} made the work clear, organized, and ready for review without losing the character of the business.`),
    imageDirection: text(input.imageDirection, isLandscape ? 'garden pathway, outdoor terrace, planting plan, stonework, dining terrace, and seasonal texture' : 'editorial workspace, service details, project boards, and client review moments'),
  };
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c >>> 0;
}

function crc32(buffers) {
  let crc = 0xffffffff;
  for (const buffer of buffers) {
    for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
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
      const n = x / Math.max(1, width - 1);
      const wave = (Math.sin(n * Math.PI * 4 + t * 5) + 1) / 2;
      const i = row + 1 + x * 4;
      raw[i] = Math.min(255, Math.round(start[0] * (1 - t) + end[0] * t + accent[0] * wave * 0.12));
      raw[i + 1] = Math.min(255, Math.round(start[1] * (1 - t) + end[1] * t + accent[1] * wave * 0.10));
      raw[i + 2] = Math.min(255, Math.round(start[2] * (1 - t) + end[2] * t + accent[2] * wave * 0.08));
      raw[i + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND'),
  ]);
}

const imageSet = [
  ['hero/brand-hero-01.png', [34, 55, 42], [210, 192, 160], [126, 151, 92]],
  ['hero/brand-hero-02.png', [25, 38, 34], [176, 137, 91], [96, 118, 77]],
  ['portfolio/project-01.png', [57, 75, 53], [217, 206, 178], [145, 114, 78]],
  ['portfolio/project-02.png', [92, 88, 76], [196, 184, 154], [57, 83, 57]],
  ['portfolio/project-03.png', [49, 65, 48], [190, 142, 94], [227, 209, 170]],
  ['texture/detail-01.png', [231, 224, 204], [109, 129, 82], [58, 72, 50]],
  ['texture/detail-02.png', [177, 166, 142], [83, 65, 48], [218, 199, 154]],
  ['texture/detail-03.png', [65, 91, 58], [206, 190, 126], [149, 80, 58]],
];

function createImages() {
  for (const [name, start, end, accent] of imageSet) {
    const buffer = makePng(1200, 820, start, end, accent);
    write(path.join(themeDir, 'assets', 'images', name), buffer);
    write(path.join(previewDir, 'assets', 'images', path.basename(name)), buffer);
  }
  write(path.join(themeDir, 'screenshot.png'), makePng(1200, 900, [32, 51, 40], [216, 197, 160], [133, 150, 93]));
}

const css = `
:root{--ink:#20251f;--garden:#263d2f;--moss:#718154;--limestone:#e7dfcc;--cream:#f8f2e5;--bronze:#9a724b;--clay:#b65f43;--charcoal:#2f332e;--display:Georgia,"Times New Roman",serif;--body:"Trebuchet MS",Verdana,sans-serif;--shadow:0 24px 60px rgba(32,37,31,.14);--large:30px;--card:20px}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);background:var(--cream);font-family:var(--body);line-height:1.7}a{color:inherit}img{max-width:100%;display:block;border-radius:var(--card)}.skip-link{position:absolute;left:-999px}.skip-link:focus{left:1rem;top:1rem;z-index:1000;background:var(--ink);color:#fff;padding:.75rem 1rem}.container{width:min(1140px,calc(100% - 36px));margin:0 auto}.section{padding:clamp(4rem,8vw,7rem) 0}.section.alt{background:linear-gradient(135deg,#efe6d3,#d9d0b9)}.eyebrow{letter-spacing:.14em;text-transform:uppercase;font-size:.76rem;color:var(--bronze);font-weight:800}h1,h2,h3,h4{font-family:var(--display);line-height:1.05;color:var(--garden);margin:0 0 1rem}h1{font-size:clamp(3.4rem,7vw,7rem);letter-spacing:-.055em}h2{font-size:clamp(2.3rem,5vw,4.6rem);letter-spacing:-.04em}h3{font-size:clamp(1.35rem,2vw,2rem)}p{margin:0 0 1.1rem}.lede{font-size:clamp(1.08rem,1.6vw,1.32rem);max-width:760px;color:rgba(32,37,31,.76)}.button{display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--garden);background:var(--garden);color:white;text-decoration:none;padding:.9rem 1.25rem;border-radius:999px;font-weight:800;cursor:pointer}.button:hover{background:#14251c;transform:translateY(-2px)}.button.ghost{background:transparent;color:var(--garden)}
.nolan-site-header{position:sticky;top:0;z-index:100;background:rgba(248,242,229,.92);backdrop-filter:blur(18px);border-bottom:1px solid rgba(38,61,47,.12)}.nolan-header-inner{width:min(1180px,calc(100% - 28px));margin:0 auto;min-height:84px;display:flex;align-items:center;gap:1.25rem}.nolan-brand{text-decoration:none;display:inline-flex;align-items:center;gap:.65rem;font-weight:900;color:var(--garden)}.nolan-mark{width:42px;height:42px;display:grid;place-items:center;border-radius:50%;background:var(--garden);color:var(--cream);font-family:var(--display)}.nolan-primary-nav{margin-left:auto;display:flex;align-items:center;gap:.45rem}.nolan-primary-nav a,.nolan-menu-trigger{border:0;background:transparent;color:var(--ink);text-decoration:none;font:inherit;font-weight:800;padding:.75rem .85rem;cursor:pointer;border-radius:999px}.nolan-primary-nav a:hover,.nolan-menu-trigger:hover,.nolan-menu-trigger[aria-expanded=true]{background:rgba(38,61,47,.09)}.nolan-header-actions{display:flex;gap:.75rem;align-items:center}.nolan-header-cta{text-decoration:none;background:var(--bronze);color:white;border-radius:999px;padding:.78rem 1rem;font-weight:900}.nolan-mobile-toggle{display:none;border:1px solid rgba(38,61,47,.28);background:transparent;border-radius:999px;padding:.7rem .95rem;font-weight:900}.nolan-menu-backdrop{position:fixed;inset:84px 0 0;background:rgba(32,37,31,.18)}.nolan-menu-dropdown{position:fixed;left:50%;top:86px;transform:translateX(-50%);width:min(1060px,calc(100vw - 32px));background:#fbf7ed;border:1px solid rgba(38,61,47,.14);border-radius:28px;box-shadow:var(--shadow);padding:1.2rem;z-index:130}.nolan-menu-panel{display:grid;grid-template-columns:260px 1fr;gap:1rem}.nolan-menu-rail{display:grid;gap:.5rem;align-content:start;border-right:1px solid rgba(38,61,47,.14);padding-right:1rem}.nolan-menu-rail button{text-align:left;border:0;background:transparent;padding:.85rem;border-radius:16px;font-weight:900;color:var(--garden);cursor:pointer}.nolan-menu-rail button[aria-expanded=true]{background:var(--limestone)}.nolan-rail-content[hidden],.nolan-menu-dropdown[hidden],.nolan-menu-backdrop[hidden],.nolan-mobile-drawer[hidden]{display:none}.nolan-menu-link-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem;margin-top:1rem}.nolan-menu-card{border:1px solid rgba(38,61,47,.14);border-radius:18px;padding:1rem;text-decoration:none;background:white}.nolan-mobile-drawer{position:fixed;inset:84px 16px auto;background:var(--garden);color:white;border-radius:24px;padding:1.25rem;z-index:140;box-shadow:var(--shadow)}.nolan-mobile-drawer nav{display:grid;gap:.8rem}.nolan-mobile-drawer a{color:white;text-decoration:none;font-size:1.25rem;font-weight:900}body.nolan-menu-open{overflow:hidden}
.hero{padding:clamp(5rem,9vw,8rem) 0;background:radial-gradient(circle at 75% 20%,rgba(154,114,75,.25),transparent 34%),linear-gradient(135deg,#f8f2e5,#dfd4bd);overflow:hidden}.hero-grid{display:grid;grid-template-columns:minmax(0,1.02fr) minmax(320px,.88fr);gap:clamp(2rem,5vw,5rem);align-items:center}.hero-media{position:relative;min-height:520px}.hero-media img:first-child{width:82%;height:460px;object-fit:cover;box-shadow:var(--shadow)}.hero-media img:last-child{position:absolute;right:0;bottom:0;width:52%;height:260px;object-fit:cover;border:10px solid var(--cream);box-shadow:var(--shadow)}.hero-proof{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-top:2rem}.proof-chip{background:rgba(255,255,255,.62);border:1px solid rgba(38,61,47,.12);border-radius:18px;padding:1rem}.proof-chip strong{display:block;color:var(--garden);font-family:var(--display);font-size:1.35rem}.grid-2,.grid-3,.grid-4{display:grid;gap:1rem}.grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-4{grid-template-columns:repeat(4,minmax(0,1fr))}.card,.proof-card,.service-card,.work-card,.post-card{background:rgba(255,255,255,.72);border:1px solid rgba(38,61,47,.12);border-radius:var(--card);padding:clamp(1.25rem,2.4vw,2rem);box-shadow:0 16px 44px rgba(32,37,31,.08)}.service-card{min-height:270px;display:flex;flex-direction:column}.service-card .button{margin-top:auto;align-self:flex-start}.work-card img{height:250px;width:100%;object-fit:cover;margin-bottom:1rem}.texture-band{background:var(--garden);color:var(--cream);padding:4rem 0}.texture-band h2,.texture-band h3{color:var(--cream)}.process-list{counter-reset:process;display:grid;gap:1rem}.process-item{counter-increment:process;display:grid;grid-template-columns:72px 1fr;gap:1rem;align-items:start;padding:1.2rem;border-radius:20px;background:rgba(255,255,255,.62);border:1px solid rgba(38,61,47,.12)}.process-item:before{content:counter(process,decimal-leading-zero);font-family:var(--display);font-size:2rem;color:var(--bronze)}.testimonial{font-family:var(--display);font-size:1.55rem;color:var(--garden)}.cta-banner{border-radius:var(--large);padding:clamp(2rem,5vw,4rem);background:linear-gradient(135deg,var(--garden),#16261d);color:white}.cta-banner h2{color:white}.site-footer{background:var(--charcoal);color:var(--cream);padding:4rem 0 2rem}.footer-grid{display:grid;grid-template-columns:1.4fr repeat(3,1fr);gap:2rem}.site-footer a{color:var(--cream);text-decoration:none;display:block;margin:.45rem 0}.form-grid{display:grid;gap:1rem}label{display:grid;gap:.35rem;font-weight:800;color:var(--garden)}input,textarea,select{width:100%;border:1px solid rgba(38,61,47,.22);border-radius:16px;padding:.9rem 1rem;background:white;font:inherit}textarea{min-height:150px}.page-hero{padding:5rem 0 3rem;background:linear-gradient(135deg,#f8f2e5,#e5dbc6)}
@media(max-width:900px){.nolan-primary-nav,.nolan-header-cta{display:none}.nolan-mobile-toggle{display:inline-flex}.hero-grid,.grid-2,.grid-3,.grid-4,.footer-grid,.nolan-menu-panel{grid-template-columns:1fr}.hero-media{min-height:390px}.hero-media img:first-child{height:340px}.hero-proof{grid-template-columns:1fr}.nolan-menu-dropdown{top:82px}}
`;

const js = `
(() => {
  const body = document.body;
  const triggers = Array.from(document.querySelectorAll('[data-menu-item]'));
  const dropdowns = Array.from(document.querySelectorAll('[data-menu-dropdown]'));
  const backdrop = document.querySelector('[data-menu-backdrop]');
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileDrawer = document.querySelector('[data-mobile-drawer]');
  function closeMenus() {
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    dropdowns.forEach((dropdown) => { dropdown.hidden = true; });
    if (backdrop) backdrop.hidden = true;
    body.classList.remove('nolan-menu-open');
  }
  function openMenu(name) {
    closeMenus();
    const trigger = document.querySelector('[data-menu-item="' + name + '"]');
    const dropdown = document.querySelector('[data-menu-dropdown="' + name + '"]');
    if (!trigger || !dropdown) return;
    trigger.setAttribute('aria-expanded', 'true');
    dropdown.hidden = false;
    if (backdrop) backdrop.hidden = false;
    body.classList.add('nolan-menu-open');
  }
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenus() : openMenu(trigger.dataset.menuItem);
    });
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nolan-site-header') && !event.target.closest('.nolan-menu-dropdown')) closeMenus();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenus();
      if (mobileDrawer) mobileDrawer.hidden = true;
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
  if (backdrop) backdrop.addEventListener('click', closeMenus);
  Array.from(document.querySelectorAll('[data-rail-item]')).forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('.nolan-menu-panel');
      if (!panel) return;
      panel.querySelectorAll('[data-rail-item]').forEach((item) => item.setAttribute('aria-expanded', String(item === button)));
      panel.querySelectorAll('[data-rail-content]').forEach((content) => {
        content.hidden = content.dataset.railContent !== button.dataset.railItem;
      });
    });
  });
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const open = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!open));
      mobileDrawer.hidden = open;
      body.classList.toggle('nolan-menu-open', !open);
    });
  }
})();
`;

function escHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function phpString(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function cards(items, className, link) {
  return items.map((item) => `<article class="${className}"><h3>${escHtml(item.title)}</h3><p>${escHtml(item.text)}</p>${link ? `<a class="button ghost" href="${link}">Learn more</a>` : ''}</article>`).join('');
}

function workCards(preview = false) {
  return spec.projects.map((item, index) => {
    const file = `project-0${index + 1}.png`;
    const src = preview ? `assets/images/${file}` : `<?php echo esc_url( get_template_directory_uri() . '/assets/images/portfolio/${file}' ); ?>`;
    const alt = `${item.title} visual detail`;
    return `<article class="work-card"><img src="${src}" alt="${preview ? escHtml(alt) : `<?php esc_attr_e( '${phpString(alt)}', '${td}' ); ?>`}"><h3>${escHtml(item.title)}</h3><p>${escHtml(item.text)}</p></article>`;
  }).join('');
}

function heroPart(preview = false) {
  const contact = preview ? 'contact_preview.html' : `<?php echo esc_url( home_url( '/contact/' ) ); ?>`;
  const work = preview ? 'work_preview.html' : `<?php echo esc_url( home_url( '/work/' ) ); ?>`;
  const hero1 = preview ? 'assets/images/brand-hero-01.png' : `<?php echo esc_url( get_template_directory_uri() . '/assets/images/hero/brand-hero-01.png' ); ?>`;
  const hero2 = preview ? 'assets/images/detail-01.png' : `<?php echo esc_url( get_template_directory_uri() . '/assets/images/texture/detail-01.png' ); ?>`;
  return `<section class="hero"><div class="container hero-grid"><div><p class="eyebrow">${escHtml(spec.eyebrow)}</p><h1>${escHtml(spec.heroTitle)}</h1><p class="lede">${escHtml(spec.heroText)}</p><p><a class="button" href="${contact}">Start a conversation</a> <a class="button ghost" href="${work}">View work</a></p><div class="hero-proof">${spec.proof.map((p) => `<div class="proof-chip"><strong>${escHtml(p.split(' ')[0])}</strong>${escHtml(p.split(' ').slice(1).join(' ') || p)}</div>`).join('')}</div></div><div class="hero-media"><img src="${hero1}" alt="${escHtml(spec.imageDirection)}"><img src="${hero2}" alt="${escHtml(spec.industry)} detail study"></div></div></section>`;
}

const brandPart = `<section class="section"><div class="container grid-2"><div><p class="eyebrow">${escHtml(spec.tone)}</p><h2>${escHtml(spec.brandName)} turns complex decisions into a finished, confident experience.</h2></div><p class="lede">${escHtml(spec.brandName)} serves ${escHtml(spec.industry)} clients ${escHtml(spec.region)} with clear planning, strong visual direction, practical production details, and a premium site structure built for review.</p></div></section>`;
const servicesPart = `<section class="section alt"><div class="container"><div class="section-heading"><p class="eyebrow">Services</p><h2>Focused services for a complete client journey.</h2></div><div class="grid-4">${cards(spec.services, 'service-card', '<?php echo esc_url( home_url( \'/single-service/\' ) ); ?>')}</div></div></section>`;
const processPart = `<section class="section alt"><div class="container grid-2"><div><p class="eyebrow">Process</p><h2>A guided path from first brief to finished launch.</h2><p class="lede">The workflow keeps strategy, content, design, assets, and implementation connected instead of scattering decisions across disconnected handoffs.</p></div><div class="process-list">${spec.process.map((item) => `<div class="process-item"><div><h3>${escHtml(item.title)}</h3><p>${escHtml(item.text)}</p></div></div>`).join('')}</div></div></section>`;
const pillarsPart = `<section class="texture-band"><div class="container grid-3"><article><p class="eyebrow">Positioning</p><h3>Specific language, proof, and services shaped around the brief.</h3></article><article><p class="eyebrow">Visual system</p><h3>Local imagery, refined spacing, and reusable components with a clear point of view.</h3></article><article><p class="eyebrow">Release readiness</p><h3>Installable theme files, compiled assets, matching previews, and deterministic validation.</h3></article></div></section>`;
const testimonialsPart = `<section class="section"><div class="container grid-2"><div><p class="eyebrow">Proof</p><p class="testimonial">"${escHtml(spec.testimonial)}"</p><p>${escHtml(spec.brandName)} client note</p></div><div class="proof-card"><h3>Built for confident review</h3><p>The theme includes complete pages, local assets, source files, compiled bundles, Nolan-menu behavior, and matching static previews.</p></div></div></section>`;
const blogPart = `<section class="section alt"><div class="container"><div class="section-heading"><p class="eyebrow">Resources</p><h2>Useful guidance that supports buyer confidence.</h2></div><div class="grid-3">${cards(spec.resources, 'post-card')}</div></div></section>`;
const ctaPart = `<section class="section"><div class="container"><div class="cta-banner"><p class="eyebrow">Next step</p><h2>Bring the brief, the constraints, and the decisions that need to become clear.</h2><p class="lede">The site is structured so visitors can understand the offer, evaluate proof, and take the next step without needing outside context.</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Request a consultation</a></div></div></section>`;

function menuPart(preview = false) {
  const href = (file, pathName) => preview ? file : `<?php echo esc_url( home_url( '${pathName}' ) ); ?>`;
  return `<header class="nolan-site-header" data-site-header><div class="nolan-header-inner"><a class="nolan-brand" href="${href('homepage_preview.html', '/')}"><span class="nolan-mark">${escHtml(spec.brandName.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase())}</span><span>${escHtml(spec.brandName)}</span></a><nav class="nolan-primary-nav" aria-label="Primary navigation"><button class="nolan-menu-trigger" type="button" data-menu-item="services" aria-controls="nolan-menu-services" aria-expanded="false">Services</button><button class="nolan-menu-trigger" type="button" data-menu-item="about" aria-controls="nolan-menu-about" aria-expanded="false">About</button><a href="${href('work_preview.html', '/work/')}">Work</a><button class="nolan-menu-trigger" type="button" data-menu-item="blog" aria-controls="nolan-menu-blog" aria-expanded="false">Blog</button></nav><div class="nolan-header-actions"><a class="nolan-header-cta" href="${href('contact_preview.html', '/contact/')}">Contact Us</a><button class="nolan-mobile-toggle" type="button" data-mobile-toggle aria-controls="nolan-mobile-drawer" aria-expanded="false">Menu</button></div></div><div class="nolan-menu-backdrop" data-menu-backdrop hidden></div>${dropdowns(preview)}<div class="nolan-mobile-drawer" id="nolan-mobile-drawer" data-mobile-drawer hidden><nav><a href="${href('homepage_preview.html', '/')}">Home</a><a href="${href('services_preview.html', '/services/')}">Services</a><a href="${href('about-us_preview.html', '/about/')}">About</a><a href="${href('work_preview.html', '/work/')}">Work</a><a href="${href('blog_preview.html', '/blog/')}">Blog</a><a href="${href('single_services_preview.html', '/single-service/')}">Single Service</a><a href="${href('contact_preview.html', '/contact/')}">Contact Us</a></nav></div></header>`;
}

function dropdowns(preview = false) {
  const href = (file, pathName) => preview ? file : `<?php echo esc_url( home_url( '${pathName}' ) ); ?>`;
  return `<div class="nolan-menu-dropdown" id="nolan-menu-services" data-menu-dropdown="services" hidden><div class="nolan-menu-panel"><div class="nolan-menu-rail"><button type="button" data-rail-item="services-overview" aria-controls="services-overview-panel" aria-expanded="true">Services</button><button type="button" data-rail-item="signature-service" aria-controls="signature-service-panel" aria-expanded="false">Signature</button></div><div class="nolan-menu-content"><div class="nolan-rail-content" id="services-overview-panel" data-rail-content="services-overview"><h3>${escHtml(spec.services[0].title)}</h3><p>${escHtml(spec.services[0].text)}</p><div class="nolan-menu-link-grid"><a class="nolan-menu-card" href="${href('services_preview.html', '/services/')}">Services overview</a><a class="nolan-menu-card" href="${href('single_services_preview.html', '/single-service/')}">Single service</a><a class="nolan-menu-card" href="${href('work_preview.html', '/work/')}">View work</a></div></div><div class="nolan-rail-content" id="signature-service-panel" data-rail-content="signature-service" hidden><h3>${escHtml(spec.services[1].title)}</h3><p>${escHtml(spec.services[1].text)}</p></div></div></div></div><div class="nolan-menu-dropdown" id="nolan-menu-about" data-menu-dropdown="about" hidden><div class="nolan-menu-panel"><div class="nolan-menu-rail"><button type="button" data-rail-item="studio" aria-controls="about-studio-panel" aria-expanded="true">Studio</button><button type="button" data-rail-item="standards" aria-controls="about-standards-panel" aria-expanded="false">Standards</button></div><div class="nolan-menu-content"><div class="nolan-rail-content" id="about-studio-panel" data-rail-content="studio"><h3>${escHtml(spec.brandName)} works with disciplined calm.</h3><p>Clear planning, complete pages, local assets, and premium presentation standards are handled together.</p><a class="button ghost" href="${href('about-us_preview.html', '/about/')}">Meet the studio</a></div><div class="nolan-rail-content" id="about-standards-panel" data-rail-content="standards" hidden><h3>Every generated output is built for validation.</h3><p>The required structure, preview pages, Nolan-menu behavior, and release artifacts are kept aligned.</p></div></div></div></div><div class="nolan-menu-dropdown" id="nolan-menu-blog" data-menu-dropdown="blog" hidden><div class="nolan-menu-panel"><div class="nolan-menu-rail"><button type="button" data-rail-item="resources" aria-controls="blog-resources-panel" aria-expanded="true">Resources</button><button type="button" data-rail-item="proof" aria-controls="blog-proof-panel" aria-expanded="false">Proof</button></div><div class="nolan-menu-content"><div class="nolan-rail-content" id="blog-resources-panel" data-rail-content="resources"><h3>${escHtml(spec.resources[0].title)}</h3><p>${escHtml(spec.resources[0].text)}</p><a class="button ghost" href="${href('blog_preview.html', '/blog/')}">Read resources</a></div><div class="nolan-rail-content" id="blog-proof-panel" data-rail-content="proof" hidden><h3>Proof belongs inside the journey.</h3><p>Testimonials, work cards, and process details support decisions without filler.</p></div></div></div></div>`;
}

function writeTheme() {
  createImages();
  writeText(`wp-content/themes/${slug}/style.css`, `/*
Theme Name: Nolan Young Theme ${slug.slice(0, 3)} - ${spec.brandName}
Author: Nolan Young
Description: Generated classic WordPress theme for ${spec.brandName}.
Version: 1.0.0
License: GPL-2.0-or-later
Text Domain: ${td}
*/`);
  writeText(`wp-content/themes/${slug}/functions.php`, `<?php
require get_template_directory() . '/inc/setup.php';
require get_template_directory() . '/inc/enqueue.php';
require get_template_directory() . '/inc/template-tags.php';
require get_template_directory() . '/inc/helpers.php';
require get_template_directory() . '/inc/custom-post-types.php';
require get_template_directory() . '/inc/customizer.php';
require get_template_directory() . '/inc/forms.php';
require get_template_directory() . '/inc/newsletter.php';
require get_template_directory() . '/inc/policy-routing.php';
`);
  writeText(`wp-content/themes/${slug}/theme.json`, JSON.stringify({ version: 3, settings: { color: { palette: [{ slug: 'garden', color: '#263d2f', name: 'Garden' }, { slug: 'cream', color: '#f8f2e5', name: 'Cream' }] } } }, null, 2));
  writeText(`wp-content/themes/${slug}/README.md`, `# ${spec.brandName}

A complete classic WordPress theme generated from a local Ollama site specification.`);
  writeText(`wp-content/themes/${slug}/.editorconfig`, `root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2`);
  writeText(`wp-content/themes/${slug}/.gitignore`, `node_modules/
*.log
.DS_Store`);
  writeText(`wp-content/themes/${slug}/header.php`, `<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#primary"><?php esc_html_e( 'Skip to content', '${td}' ); ?></a>
${menuPart(false)}
<main id="primary">`);
  writeText(`wp-content/themes/${slug}/footer.php`, `</main>
<?php get_template_part( 'template-parts/content', 'footer-widgets' ); ?>
<?php wp_footer(); ?>
</body>
</html>`);
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
  writeText(`wp-content/themes/${slug}/index.php`, `<?php get_header(); ?><section class="section"><div class="container"><h1><?php esc_html_e( 'Resources', '${td}' ); ?></h1><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/page.php`, `<?php get_header(); ?><section class="section"><div class="container"><?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'page' ); endwhile; ?></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/single.php`, `<?php get_header(); ?><section class="section"><div class="container"><?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'single' ); endwhile; ?></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/archive.php`, `<?php get_header(); ?><section class="page-hero"><div class="container"><h1><?php the_archive_title(); ?></h1></div></section><section class="section"><div class="container grid-3"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/search.php`, `<?php get_header(); ?><section class="page-hero"><div class="container"><h1><?php printf( esc_html__( 'Search results for %s', '${td}' ), esc_html( get_search_query() ) ); ?></h1><?php get_search_form(); ?></div></section><section class="section"><div class="container grid-3"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/searchform.php`, `<form role="search" method="get" class="search-form form-grid" action="<?php echo esc_url( home_url( '/' ) ); ?>"><label><span><?php esc_html_e( 'Search resources', '${td}' ); ?></span><input type="search" value="<?php echo esc_attr( get_search_query() ); ?>" name="s"></label><button class="button" type="submit"><?php esc_html_e( 'Search', '${td}' ); ?></button></form>`);
  writeText(`wp-content/themes/${slug}/404.php`, `<?php get_header(); ?><section class="section"><div class="container"><h1><?php esc_html_e( 'This path is not available.', '${td}' ); ?></h1><p><?php esc_html_e( 'Return to the homepage or start with the service overview.', '${td}' ); ?></p><a class="button" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Return home', '${td}' ); ?></a></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/403.php`, `<?php get_header(); ?><section class="section"><div class="container"><h1><?php esc_html_e( 'Access is restricted.', '${td}' ); ?></h1><p><?php esc_html_e( 'This page is not available for public viewing.', '${td}' ); ?></p></div></section><?php get_footer(); ?>`);
  writeText(`wp-content/themes/${slug}/comments.php`, `<?php if ( post_password_required() ) { return; } ?><section class="comments-area"><h2><?php esc_html_e( 'Discussion', '${td}' ); ?></h2><?php comment_form(); ?></section>`);
  writeText(`wp-content/themes/${slug}/package.json`, JSON.stringify({ name: slug, version: '1.0.0', scripts: { build: 'node build/webpack.config.js' }, dependencies: {}, devDependencies: {} }, null, 2));
  writeText(`wp-content/themes/${slug}/package-lock.json`, JSON.stringify({ name: slug, version: '1.0.0', lockfileVersion: 3, requires: true, packages: { '': { name: slug, version: '1.0.0' } } }, null, 2));
  writeText(`wp-content/themes/${slug}/LICENSE.txt`, 'GPL-2.0-or-later\n\nGenerated classic WordPress theme for distribution under the GPL.');
  writeText(`wp-content/themes/${slug}/CHANGELOG.md`, '# Changelog\n\n## 1.0.0\n\n- Initial local Ollama specification render.');

  writeIncFiles();
  writeTemplateParts();
  writePageTemplates();
  writeAssetsAndSource();
}

function writeIncFiles() {
  writeText(`wp-content/themes/${slug}/inc/setup.php`, `<?php
function ${prefix}_setup() {
  add_theme_support( 'title-tag' );
  add_theme_support( 'post-thumbnails' );
  add_theme_support( 'html5', array( 'search-form', 'comment-form', 'gallery', 'caption', 'style', 'script' ) );
  register_nav_menus( array( 'primary' => esc_html__( 'Primary Menu', '${td}' ) ) );
}
add_action( 'after_setup_theme', '${prefix}_setup' );
`);
  writeText(`wp-content/themes/${slug}/inc/enqueue.php`, `<?php
function ${prefix}_enqueue_assets() {
  $css = get_template_directory() . '/assets/css/bundle.css';
  $js = get_template_directory() . '/assets/js/bundle.js';
  wp_enqueue_style( '${td}', get_template_directory_uri() . '/assets/css/bundle.css', array(), file_exists( $css ) ? filemtime( $css ) : '1.0.0' );
  wp_enqueue_script( '${td}', get_template_directory_uri() . '/assets/js/bundle.js', array(), file_exists( $js ) ? filemtime( $js ) : '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', '${prefix}_enqueue_assets' );
`);
  writeText(`wp-content/themes/${slug}/inc/template-tags.php`, `<?php
function ${prefix}_posted_on() {
  printf( '<span class="posted-on">%s</span>', esc_html( get_the_date() ) );
}
`);
  writeText(`wp-content/themes/${slug}/inc/helpers.php`, `<?php
function ${prefix}_image_uri( $path ) {
  return esc_url( get_template_directory_uri() . '/assets/images/' . ltrim( $path, '/' ) );
}
`);
  writeText(`wp-content/themes/${slug}/inc/custom-post-types.php`, `<?php
function ${prefix}_register_work_type() {
  register_post_type( 'nytf_work', array(
    'public' => true,
    'label' => esc_html__( 'Work', '${td}' ),
    'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
    'show_in_rest' => true,
  ) );
}
add_action( 'init', '${prefix}_register_work_type' );
`);
  writeText(`wp-content/themes/${slug}/inc/customizer.php`, `<?php
function ${prefix}_customize_register( $wp_customize ) {
  $wp_customize->add_section( '${prefix}_brand', array(
    'title' => esc_html__( 'Brand Settings', '${td}' ),
    'priority' => 30,
  ) );
}
add_action( 'customize_register', '${prefix}_customize_register' );
`);
  writeText(`wp-content/themes/${slug}/inc/forms.php`, `<?php
function ${prefix}_contact_note() {
  return esc_html__( 'Consultation requests are reviewed before scheduling.', '${td}' );
}
`);
  writeText(`wp-content/themes/${slug}/inc/newsletter.php`, `<?php
function ${prefix}_newsletter_label() {
  return esc_html__( 'Receive practical planning notes.', '${td}' );
}
`);
  writeText(`wp-content/themes/${slug}/inc/policy-routing.php`, `<?php
function ${prefix}_policy_title() {
  return esc_html__( 'Studio Policy', '${td}' );
}
`);
}

function writeTemplateParts() {
  const parts = {
    'content-page.php': `<article <?php post_class( 'content-page' ); ?>><h1><?php the_title(); ?></h1><?php the_content(); ?></article>`,
    'content-single.php': `<article <?php post_class( 'content-single' ); ?>><p class="eyebrow"><?php ${prefix}_posted_on(); ?></p><h1><?php the_title(); ?></h1><?php the_content(); ?></article>`,
    'content-none.php': `<article class="proof-card"><h2><?php esc_html_e( 'No matching resources were found.', '${td}' ); ?></h2><p><?php esc_html_e( 'Try another search or visit the services overview.', '${td}' ); ?></p></article>`,
    'content-policy.php': `<section class="section"><div class="container"><h1><?php echo esc_html( ${prefix}_policy_title() ); ?></h1><p><?php esc_html_e( 'Project schedules, asset choices, and care recommendations are confirmed in writing for each engagement.', '${td}' ); ?></p></div></section>`,
    'content-search.php': `<article class="post-card"><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><?php the_excerpt(); ?></article>`,
    'content-hero.php': heroPart(false),
    'content-brand-statement.php': brandPart,
    'content-featured-work.php': `<section class="section"><div class="container"><div class="section-heading"><p class="eyebrow">Selected work</p><h2>Proof that the system can carry the whole story.</h2></div><div class="grid-3">${workCards(false)}</div></div></section>`,
    'content-all-services.php': servicesPart,
    'content-single-service-highlight.php': `<section class="page-hero"><div class="container"><p class="eyebrow">${escHtml(spec.services[0].title)}</p><h1>A complete path from first conversation to finished outcome.</h1><p class="lede">${escHtml(spec.services[0].text)}</p></div></section><section class="section"><div class="container grid-2"><div class="process-list">${spec.process.map((item) => `<div class="process-item"><div><h3>${escHtml(item.title)}</h3><p>${escHtml(item.text)}</p></div></div>`).join('')}</div><div class="proof-card"><h3>Best fit</h3><p>Clients who want strategy, content, visuals, source files, preview pages, and launch details connected in one reliable workflow.</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Discuss this service</a></div></div></section>`,
    'content-process.php': processPart,
    'content-style-pillars.php': pillarsPart,
    'content-testimonials.php': testimonialsPart,
    'content-blog-preview.php': blogPart,
    'content-cta-banner.php': ctaPart,
    'content-footer-widgets.php': `<footer class="site-footer"><div class="container footer-grid"><div><a class="nolan-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>"><span class="nolan-mark">${escHtml(spec.brandName.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase())}</span><span>${escHtml(spec.brandName)}</span></a><p>${escHtml(spec.industry)} website system with complete theme files and matching static previews.</p></div><div><h3>Studio</h3><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>">About</a><a href="<?php echo esc_url( home_url( '/work/' ) ); ?>">Work</a><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Resources</a></div><div><h3>Services</h3><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Services</a><a href="<?php echo esc_url( home_url( '/single-service/' ) ); ?>">Signature service</a><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact</a></div><div><h3>Contact</h3><p>${escHtml(spec.region)}</p><a class="button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact Us</a></div></div></footer>`,
  };
  for (const [file, content] of Object.entries(parts)) writeText(`wp-content/themes/${slug}/template-parts/${file}`, content);
}

function writePageTemplates() {
  const templates = {
    'template-about-us.php': `<?php /* Template Name: About Us */ get_header(); ?><section class="page-hero"><div class="container"><p class="eyebrow">About</p><h1>${escHtml(spec.brandName)} brings structure, taste, and execution discipline together.</h1><p class="lede">The site is shaped around ${escHtml(spec.tone)} communication for ${escHtml(spec.industry)}.</p></div></section>${pillarsPart}${testimonialsPart}<?php get_footer(); ?>`,
    'template-services.php': `<?php /* Template Name: Services */ get_header(); ?>${servicesPart}${processPart}${ctaPart}<?php get_footer(); ?>`,
    'template-single-service.php': `<?php /* Template Name: Single Service */ get_header(); ?><?php get_template_part( 'template-parts/content', 'single-service-highlight' ); ?><?php get_footer(); ?>`,
    'template-work.php': `<?php /* Template Name: Work */ get_header(); ?><?php get_template_part( 'template-parts/content', 'featured-work' ); ?>${brandPart}${ctaPart}<?php get_footer(); ?>`,
    'template-blog.php': `<?php /* Template Name: Blog */ get_header(); ?>${blogPart}${ctaPart}<?php get_footer(); ?>`,
    'template-contact.php': `<?php /* Template Name: Contact */ get_header(); ?><section class="page-hero"><div class="container"><p class="eyebrow">Contact</p><h1>Start with the brief, the constraints, and the decision path.</h1></div></section><section class="section"><div class="container grid-2"><form class="proof-card form-grid"><label>Name<input type="text" name="name"></label><label>Email<input type="email" name="email"></label><label>Project focus<input type="text" name="focus"></label><label>What needs to become clear?<textarea name="message"></textarea></label><button class="button" type="submit">Request consultation</button></form><div class="proof-card"><h3>Good fit signals</h3><p>You want a complete website-level theme with local assets, complete preview pages, and a reliable release path.</p><p><?php echo esc_html( ${prefix}_contact_note() ); ?></p></div></div></section><?php get_footer(); ?>`,
    'template-policy.php': `<?php /* Template Name: Policy */ get_header(); ?><?php get_template_part( 'template-parts/content', 'policy' ); ?><?php get_footer(); ?>`,
  };
  for (const [file, content] of Object.entries(templates)) writeText(`wp-content/themes/${slug}/page-templates/${file}`, content);
}

function writeAssetsAndSource() {
  writeText(`wp-content/themes/${slug}/assets/icons/icon1.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Nolan Young generated mark"><path fill="#263d2f" d="M32 4c15 8 24 20 24 34 0 12-9 22-24 22S8 50 8 38C8 24 17 12 32 4Z"/><path fill="#e7dfcc" d="M32 12c3 14 2 28-2 41 10-8 16-19 16-31-5-4-9-7-14-10Z"/></svg>`);
  writeText(`wp-content/themes/${slug}/assets/icons/README.md`, '# Icons\n\nLocal SVG icon assets for the generated theme.');
  writeText(`wp-content/themes/${slug}/assets/css/bundle.css`, css);
  writeText(`wp-content/themes/${slug}/assets/js/bundle.js`, js);
  writeText(`wp-content/themes/${slug}/src/js/main.js`, js);
  writeText(`wp-content/themes/${slug}/src/scss/main.scss`, css);
  [
    'abstracts/_variables.scss', 'abstracts/_mixins.scss', 'abstracts/_functions.scss',
    'base/_reset.scss', 'base/_typography.scss', 'base/_accessibility.scss', 'base/_forms.scss', 'base/_newsletter.scss',
    'components/_buttons.scss', 'components/_cards.scss', 'components/_forms.scss', 'components/_badges.scss', 'components/_accordion.scss', 'components/_carousel.scss', 'components/_portfolio-filter.scss', 'components/_before-after.scss',
    'layout/_container.scss', 'layout/_header.scss', 'layout/_footer.scss', 'layout/_grid.scss', 'layout/_sections.scss',
    'pages/_homepage.scss', 'pages/_contact.scss', 'pages/_about-us.scss', 'pages/_services.scss', 'pages/_work.scss', 'pages/_blog.scss', 'pages/_policy.scss',
  ].forEach((file) => writeText(`wp-content/themes/${slug}/src/scss/${file}`, `/* ${file} supports the compiled visual system. */`));
  writeText(`wp-content/themes/${slug}/build/webpack.config.js`, `const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
fs.mkdirSync(path.join(root, 'assets/css'), { recursive: true });
fs.mkdirSync(path.join(root, 'assets/js'), { recursive: true });
fs.copyFileSync(path.join(root, 'src/scss/main.scss'), path.join(root, 'assets/css/bundle.css'));
fs.copyFileSync(path.join(root, 'src/js/main.js'), path.join(root, 'assets/js/bundle.js'));
console.log('Built generated compiled assets.');
`);
  writeText(`wp-content/themes/${slug}/blocks/README.md`, '# Blocks\n\nThis classic theme uses PHP template hierarchy files and reusable template parts.');
  writeText(`wp-content/themes/${slug}/docs/getting-started.md`, '# Getting Started\n\nInstall the ZIP in WordPress, assign page templates, and run the asset build when editing source files.');
  writeText(`wp-content/themes/${slug}/docs/customization.md`, '# Customization\n\nAdjust colors, copy, and local image choices while preserving the Nolan-menu contract.');
  writeText(`wp-content/themes/${slug}/accessibility/README.md`, '# Accessibility\n\nThe header uses ARIA controls, expanded state updates, Escape handling, and local JavaScript only.');
}

function previewPage(title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escHtml(title)} | ${escHtml(spec.brandName)}</title><link rel="stylesheet" href="assets/css/preview.css"></head><body>${menuPart(true)}<main id="primary">${body}</main>${previewFooter()}<script src="assets/js/preview.js"></script></body></html>`;
}

function previewFooter() {
  return `<footer class="site-footer"><div class="container footer-grid"><div><a class="nolan-brand" href="homepage_preview.html"><span class="nolan-mark">${escHtml(spec.brandName.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase())}</span><span>${escHtml(spec.brandName)}</span></a><p>${escHtml(spec.industry)} website system with complete local previews.</p></div><div><h3>Studio</h3><a href="about-us_preview.html">About</a><a href="work_preview.html">Work</a><a href="blog_preview.html">Resources</a></div><div><h3>Services</h3><a href="services_preview.html">Services</a><a href="single_services_preview.html">Signature service</a><a href="contact_preview.html">Contact</a></div><div><h3>Contact</h3><p>${escHtml(spec.region)}</p><a class="button" href="contact_preview.html">Contact Us</a></div></div></footer>`;
}

function writePreview() {
  writeText(`docs/themes/${slug}/assets/css/preview.css`, css);
  writeText(`docs/themes/${slug}/assets/js/preview.js`, js);
  writeText(`docs/themes/${slug}/assets/images/README.md`, '# Preview Images\n\nLocal generated raster assets for the static preview.');
  writeText(`docs/themes/${slug}/README.md`, `# ${spec.brandName} Static Preview\n\nStandalone preview pages for the generated WordPress theme.`);
  const featuredWorkPreview = `<section class="section"><div class="container"><div class="section-heading"><p class="eyebrow">Selected work</p><h2>Proof that the system can carry the whole story.</h2></div><div class="grid-3">${workCards(true)}</div></div></section>`;
  const ctaPreview = ctaPart.replace(`<?php echo esc_url( home_url( '/contact/' ) ); ?>`, 'contact_preview.html');
  const servicesPreview = servicesPart.replaceAll(`<?php echo esc_url( home_url( '/single-service/' ) ); ?>`, 'single_services_preview.html');
  const pages = {
    'homepage_preview.html': heroPart(true) + brandPart + servicesPreview + featuredWorkPreview + processPart + pillarsPart + testimonialsPart + blogPart + ctaPreview,
    'services_preview.html': `<section class="page-hero"><div class="container"><p class="eyebrow">Services</p><h1>Focused services for a complete client journey.</h1><p class="lede">${escHtml(spec.heroText)}</p></div></section>` + servicesPreview + processPart,
    'about-us_preview.html': `<section class="page-hero"><div class="container"><p class="eyebrow">About</p><h1>${escHtml(spec.brandName)} brings structure, taste, and execution discipline together.</h1><p class="lede">The site is shaped around ${escHtml(spec.tone)} communication for ${escHtml(spec.industry)}.</p></div></section>` + pillarsPart + testimonialsPart,
    'contact_preview.html': `<section class="page-hero"><div class="container"><p class="eyebrow">Contact</p><h1>Start with the brief, the constraints, and the decision path.</h1></div></section><section class="section"><div class="container grid-2"><form class="proof-card form-grid"><label>Name<input type="text" name="name"></label><label>Email<input type="email" name="email"></label><label>Project focus<input type="text" name="focus"></label><label>What needs to become clear?<textarea name="message"></textarea></label><button class="button" type="submit">Request consultation</button></form><div class="proof-card"><h3>Good fit signals</h3><p>You want a complete website-level theme with local assets, complete preview pages, and a reliable release path.</p><p>Consultation requests are reviewed before scheduling.</p></div></div></section>`,
    'single_services_preview.html': `<section class="page-hero"><div class="container"><p class="eyebrow">${escHtml(spec.services[0].title)}</p><h1>A complete path from first conversation to finished outcome.</h1><p class="lede">${escHtml(spec.services[0].text)}</p></div></section><section class="section"><div class="container grid-2"><div class="process-list">${spec.process.map((item) => `<div class="process-item"><div><h3>${escHtml(item.title)}</h3><p>${escHtml(item.text)}</p></div></div>`).join('')}</div><div class="proof-card"><h3>Best fit</h3><p>Clients who want strategy, content, visuals, source files, preview pages, and launch details connected in one reliable workflow.</p><a class="button" href="contact_preview.html">Discuss this service</a></div></div></section>`,
    'blog_preview.html': `<section class="page-hero"><div class="container"><p class="eyebrow">Resources</p><h1>Useful guidance that supports buyer confidence.</h1><p class="lede">Practical notes that help visitors understand timing, fit, proof, and next steps.</p></div></section>` + blogPart,
    'work_preview.html': `<section class="page-hero"><div class="container"><p class="eyebrow">Work</p><h1>Project stories staged with local imagery and concrete proof.</h1></div></section>` + featuredWorkPreview + ctaPreview,
  };
  for (const [file, body] of Object.entries(pages)) writeText(`docs/themes/${slug}/${file}`, previewPage(file.replace('_preview.html', '').replace('-', ' '), body));
  writeText(`docs/themes/${slug}/index.html`, previewPage('Preview index', heroPart(true) + brandPart));
  updateGallery();
}

function updateGallery() {
  const galleryPath = path.join(root, 'docs', 'index.html');
  if (!fs.existsSync(galleryPath)) return;
  let gallery = fs.readFileSync(galleryPath, 'utf8');
  const href = `themes/${slug}/homepage_preview.html`;
  if (gallery.includes(href)) return;
  const card = `        <article class="theme-card">
          <p class="eyebrow">${slug}</p>
          <h3>Nolan Young Theme ${slug.slice(0, 3)} - ${escHtml(spec.brandName)}</h3>
          <p>Generated classic WordPress theme with a matching static preview.</p>
          <p><a href="${href}">Open preview</a></p>
        </article>
`;
  if (gallery.includes('data-empty-state')) {
    gallery = gallery.replace(/\s*<article class="empty-state" data-empty-state>[\s\S]*?<\/article>/, `\n${card}`);
  } else {
    gallery = gallery.replace(/\s*<\/section>\s*<\/main>/, `\n${card}      </section>\n    </main>`);
  }
  fs.writeFileSync(galleryPath, gallery, 'utf8');
}

writeTheme();
writePreview();
writeText(`reports/runs/${slug}/ollama-normalized-spec.json`, JSON.stringify(spec, null, 2));
console.log(`Rendered ${slug} from local Ollama site specification.`);
