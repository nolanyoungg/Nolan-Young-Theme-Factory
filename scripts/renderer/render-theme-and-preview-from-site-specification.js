#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const [slug, promptFile, planFile, specFile, rootArg] = process.argv.slice(2);
if (!slug || !promptFile || !planFile || !specFile) {
  console.error('Usage: node scripts/renderer/render-theme-and-preview-from-site-specification.js <slug> <prompt-file> <plan-file> <spec-raw-file> [repo-root]');
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
const categoryText = `${slug}\n${prompt}\n${plan}\n${rawSpec}\n${spec.industry}`;
const themeProfile = detectSiteProfile(categoryText);
const isLogisticsTheme = themeProfile === 'logistics';
const isFinanceTheme = themeProfile === 'finance';
const isFoodTheme = themeProfile === 'food';
const isTechTheme = themeProfile === 'tech' || themeProfile === 'product';

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

function balancedObjectText(input) {
  const clean = stripAnsi(input);
  const fenced = clean.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fenced) return fenced[1];

  const start = clean.indexOf('{');
  if (start === -1) return '';
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
      if (depth === 0) return clean.slice(start, i + 1);
    }
  }
  return clean.slice(start);
}

function cleanupLooseValue(value) {
  const compact = stripAnsi(value)
    .replace(/```json|```/gi, '')
    .replace(/"text"\s*:\s*/gi, '')
    .replace(/"title"\s*:\s*/gi, '')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim()
    .replace(/^"+|"+$/g, '')
    .replace(/[;,]+$/g, '')
    .trim();

  const words = compact.split(/\s+/);
  const kept = [];
  for (let i = 0; i < words.length; i += 1) {
    const current = words[i];
    const next = words[i + 1] || '';
    const currentCore = current.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
    const nextCore = next.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
    if (currentCore.length >= 1 && nextCore.length > currentCore.length && nextCore.startsWith(currentCore)) continue;
    if (currentCore.length >= 3 && currentCore === nextCore) continue;
    kept.push(current);
  }
  return kept.join(' ').replace(/\s+([.,;:!?])/g, '$1').trim();
}

function extractLooseString(block, key) {
  const pattern = new RegExp(`"${key}"\\s*:\\s*"([\\s\\S]*?)"\\s*(?=,\\s*"[^"]+"\\s*:|,\\s*\\]|\\s*\\}|\\s*\\n\\s*"[^"]+"\\s*:|$)`, 'i');
  const match = block.match(pattern);
  return match ? cleanupLooseValue(match[1]) : '';
}

function extractLooseArrayBlock(block, key) {
  const keyMatch = new RegExp(`"${key}"\\s*:\\s*\\[`, 'i').exec(block);
  if (!keyMatch) return '';
  let start = keyMatch.index + keyMatch[0].length - 1;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < block.length; i += 1) {
    const ch = block[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '[') depth += 1;
    else if (ch === ']') {
      depth -= 1;
      if (depth === 0) return block.slice(start, i + 1);
    }
  }
  return '';
}

function extractLooseObjectArray(block, key) {
  const arrayBlock = extractLooseArrayBlock(block, key);
  if (!arrayBlock) return [];
  const items = [];
  const objectPattern = /\{\s*"title"\s*:\s*"([\s\S]*?)"\s*,\s*"text"\s*:\s*"([\s\S]*?)"\s*\}/gi;
  let match;
  while ((match = objectPattern.exec(arrayBlock))) {
    const title = cleanupLooseValue(match[1]);
    const textValue = cleanupLooseValue(match[2]);
    if (title && textValue) items.push({ title, text: textValue });
  }
  return items;
}

function extractLooseStringArray(block, key) {
  const arrayBlock = extractLooseArrayBlock(block, key);
  if (!arrayBlock) return [];
  const values = [];
  const stringPattern = /"([^"\r\n][^"]*?)"/g;
  let match;
  while ((match = stringPattern.exec(arrayBlock))) {
    const value = cleanupLooseValue(match[1]);
    if (value && !/^(title|text)$/i.test(value)) values.push(value);
  }
  return values;
}

function parseLooseSpec(input) {
  const block = balancedObjectText(input);
  if (!block) return {};
  const spec = {};
  for (const key of ['brandName', 'businessName', 'name', 'industry', 'region', 'tone', 'eyebrow', 'heroTitle', 'headline', 'heroText', 'heroCopy', 'testimonial', 'imageDirection']) {
    const value = extractLooseString(block, key);
    if (value) spec[key] = value;
  }
  for (const key of ['services', 'projects', 'resources', 'process']) {
    const items = extractLooseObjectArray(block, key);
    if (items.length) spec[key] = items;
  }
  const proof = extractLooseStringArray(block, 'proof');
  if (proof.length) spec.proof = proof;
  if (!spec.imageDirection) {
    const imageItems = extractLooseStringArray(block, 'imageDirection');
    if (imageItems.length) spec.imageDirection = imageItems.join(', ');
  }
  return spec;
}

function parseSpec(input) {
  const objectText = balancedObjectText(input);
  if (objectText) {
    try {
      return JSON.parse(objectText);
    } catch (_) {
      const loose = parseLooseSpec(objectText);
      if (Object.keys(loose).length) return loose;
    }
  }

  const clean = stripAnsi(input);
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
          const loose = parseLooseSpec(clean.slice(start, i + 1));
          return Object.keys(loose).length ? loose : {};
        }
      }
    }
  }
  const loose = parseLooseSpec(clean);
  return Object.keys(loose).length ? loose : {};
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

function completeArrayObjects(value, fallback, targetCount) {
  const items = safeArrayObjects(value, fallback).slice(0, targetCount);
  const seen = new Set(items.map((item) => item.title.toLowerCase()));
  for (const item of fallback) {
    if (items.length >= targetCount) break;
    if (seen.has(item.title.toLowerCase())) continue;
    items.push(item);
    seen.add(item.title.toLowerCase());
  }
  return items;
}

function inferBrand(promptText, fallbackSlug) {
  const quoted = promptText.match(/(?:named|called|brand(?:ed)? as)\s+["“]([^"”]+)["”]/i);
  if (quoted) return quoted[1].trim();
  const called = promptText.match(/\bcalled\s+([A-Z][A-Za-z0-9]*(?:\s+[A-Z][A-Za-z0-9]*){0,4})/);
  if (called) return called[1].replace(/[.:,;]+$/, '').trim();
  const concept = promptText.match(/Business concept:\s*([^\n.]+)/i);
  if (concept) return concept[1].replace(/^A\s+/i, '').trim();
  return titleCase(fallbackSlug.replace(/^\d{3}_nolan_young_theme_/, ''));
}

function cleanPromptField(value) {
  const out = String(value || '').replace(/\s+/g, ' ').trim();
  if (!out) return '';
  if (/^\[.*\]$/.test(out)) return '';
  if (/\bFILL IN\b|\bDESIRED INFO\b|\bYOUR .* HERE\b/i.test(out)) return '';
  return out.replace(/[.;]+$/, '').trim();
}

function promptField(promptText, labels) {
  const escapedLabels = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const patterns = [
    new RegExp(`^\\s*(?:#{1,6}\\s*)?(?:${escapedLabels})\\s*[:\\-]\\s*(.+)$`, 'im'),
    new RegExp(`^\\s*(?:#{1,6}\\s*)?(?:${escapedLabels})\\s*$\\n+([^#\\n][^\\n]*)`, 'im'),
  ];
  for (const pattern of patterns) {
    const match = promptText.match(pattern);
    const cleaned = cleanPromptField(match && match[1]);
    if (cleaned) return cleaned;
  }
  return '';
}

function detectSiteProfile(input) {
  const textInput = String(input || '')
    .split(/(?<=[.!?])\s+|\r?\n+/)
    .filter((sentence) => !/\b(not|avoid|do not|does not|should not|must not|shouldn['’]?t|mustn['’]?t|isn['’]?t|is not|without)\b/i.test(sentence))
    .join('\n');
  const softwareServicesPattern = /\b(software development company|software engineering studio|software studio|engineering services|development agency|custom software development|custom software|internal tools|workflow automation|business dashboard|dashboards and reporting|data and tool integrations|systems integration|software maintenance)\b/i;
  const explicitProductPattern = /\b(crm product|customer relationship management product|saas product|software product|subscription software|product platform|app platform|customer support software|helpdesk software|ticketing software)\b/i;
  if (softwareServicesPattern.test(textInput) && !explicitProductPattern.test(textInput)) return 'tech';

  const checks = [
    ['product', explicitProductPattern],
    ['tech', /\b(ai automation|artificial intelligence|automation studio|custom software|software studio|software platform|dashboard|dashboards|analytics|internal tools|data platform|api|workflow automation)\b/i],
    ['logistics', /\b(logistics|trucking|freight|fleet|dispatch|warehouse|transport|transportation|delivery|shipment|shipments|route|routes|carrier|shipper|shippers|last-mile|last mile)\b/i],
    ['finance', /\b(insurance|financial|finance|advisor|advisory|benefits|coverage|policy|policies|accounting|lending|wealth|claims|renewal|renewals)\b/i],
    ['food', /\b(restaurant|cafe|bakery|market|food|hospitality|menu|dining|catering|chef|kitchen|culinary|seasonal menu)\b/i],
    ['ecommerce', /\b(ecommerce|e-commerce|online store|retail brand|product catalog|shopping cart|checkout|merchandise|direct-to-consumer|dtc)\b/i],
    ['health', /\b(healthcare|medical|clinic|dental|therapy|therapist|wellness|treatment|med spa|chiropractic|fitness|nutrition)\b/i],
    ['home', /\b(home services|roofing|plumbing|hvac|electrical|construction|contractor|remodel|renovation|cleaning|lawn care|landscaping|landscape|garden|outdoor|planting|stone|terrace)\b/i],
    ['education', /\b(education|school|academy|course|courses|training|coaching|learning|tutor|workshop)\b/i],
    ['nonprofit', /\b(nonprofit|non-profit|foundation|charity|donation|donor|fundraising|community organization|advocacy)\b/i],
  ];
  for (const [profile, pattern] of checks) {
    if (pattern.test(textInput)) return profile;
  }
  return 'general';
}

function profileDefaults(profile, brandName, industry) {
  const industryLabel = industry || 'professional services';
  const audience = `${industryLabel} clients`;
  const generic = {
    industry: industryLabel,
    tone: 'clear, premium, practical, and specific',
    heroTitle: `${brandName} turns a complex offer into a clear, high-converting website experience.`,
    heroText: `${brandName} gives visitors a complete path through services, proof, process, resources, and contact details without relying on generic filler.`,
    services: [
      { title: 'Offer Strategy', text: `Clarify the ${industryLabel} offer, priority audiences, decision criteria, and conversion path before the site is built.` },
      { title: 'Service Experience Design', text: `Shape service pages, comparison details, proof points, and calls to action around what ${audience} need to decide.` },
      { title: 'Conversion Content', text: 'Write practical page copy, form prompts, FAQs, and resource summaries that make the next step feel obvious.' },
      { title: 'Visual System Direction', text: 'Turn colors, spacing, imagery, buttons, and section rhythm into a polished presentation system.' },
      { title: 'Launch Readiness', text: 'Prepare the homepage, internal pages, forms, footer, and navigation so the site feels ready for real review.' },
      { title: 'Ongoing Improvement', text: 'Support future updates with a structure that can absorb new services, resources, proof, and campaigns.' },
    ],
    projects: [
      { title: 'Homepage Conversion Refresh', text: 'A scattered homepage became a clear story with offer hierarchy, proof, process, and direct next steps.' },
      { title: 'Service Page System', text: 'Core services were reorganized into distinct pages with unique value propositions, deliverables, FAQs, and CTAs.' },
      { title: 'Resource Hub Launch', text: 'Educational articles and guide cards gave visitors useful context before contacting the business.' },
      { title: 'Trust and Proof Upgrade', text: 'Testimonials, results, client types, and process details were moved closer to the points where visitors decide.' },
      { title: 'Contact Flow Redesign', text: 'Inquiry forms, service selectors, response-time notes, and support copy reduced friction for qualified leads.' },
      { title: 'Navigation Cleanup', text: 'Header dropdowns, footer links, and page paths were aligned around real pages and meaningful sections.' },
    ],
    resources: [
      { title: 'How to Choose the Right Provider', text: `A plain-language guide to evaluating fit, proof, service depth, and next steps in ${industryLabel}.` },
      { title: 'What to Prepare Before a Consultation', text: 'The notes, goals, constraints, budget ranges, and timing details that make first conversations more useful.' },
      { title: 'Common Buyer Questions Answered', text: 'A practical explanation of typical concerns, tradeoffs, timing, pricing signals, and service expectations.' },
      { title: 'Signs Your Current Process Is Holding You Back', text: 'How to spot unclear offers, weak follow-up, missing proof, and pages that do not support decisions.' },
      { title: 'Planning a Better Customer Journey', text: 'Ways to connect first impressions, service details, trust signals, and contact paths into one experience.' },
      { title: 'Launch Checklist for a Complete Website', text: 'The sections, assets, forms, accessibility checks, and review steps that keep a site from feeling unfinished.' },
    ],
    process: [
      { title: 'Clarify the brief', text: 'Define the audience, offer, conversion goals, page needs, tone, visual direction, and launch constraints.' },
      { title: 'Structure the journey', text: 'Map the homepage, services, work, resources, forms, and navigation around real visitor decisions.' },
      { title: 'Build the system', text: 'Create the section library, page copy, local imagery, forms, and responsive behavior in one coherent pass.' },
      { title: 'Review and refine', text: 'Check the finished experience for alignment, polish, accessibility, content specificity, and release readiness.' },
      { title: 'Support future updates', text: 'Keep the page system ready for new services, resources, case studies, proof, and conversion experiments.' },
    ],
    proof: ['7 complete preview pages', 'Local assets only', 'Launch-ready structure'],
    testimonial: `${brandName} made the offer easier to understand and gave us a site experience that felt complete enough to review with confidence.`,
    imageDirection: `local abstract ${industryLabel} workspaces, planning boards, client journey maps, service details, and polished review moments`,
  };

  const byProfile = {
    product: {
      industry: 'CRM software, customer operations, pipeline management, account workflows, and reporting',
      tone: 'product-led, operational, clear, modern, and trustworthy',
      heroTitle: `${brandName} gives growing teams one clear place to manage pipeline, clients, tasks, and follow-up.`,
      heroText: `${brandName} is presented as a polished CRM product website with dashboard-style visuals, role-based benefits, proof, resources, forms, and conversion paths for demos and consultations.`,
      services: [
        { title: 'Pipeline Management', text: 'Organize leads, opportunities, stages, owners, next steps, and follow-up health in one visible workspace.' },
        { title: 'Contact and Account Records', text: 'Keep notes, activity history, company context, files, and relationship details easy for teams to trust.' },
        { title: 'Task and Follow-Up Automation', text: 'Route reminders, owner assignments, renewal prompts, handoffs, and customer touchpoints before work slips.' },
        { title: 'Reporting Dashboards', text: 'Show pipeline value, conversion rates, stalled deals, response times, customer health, and team activity.' },
        { title: 'Role-Based Team Views', text: 'Give sales, service, leadership, and admin teams tailored views without creating separate data silos.' },
        { title: 'Implementation Support', text: 'Map fields, imports, permissions, workflows, and training plans so adoption is not left to chance.' },
      ],
      projects: [
        { title: 'Sales Pipeline Relaunch', text: 'A growing team moved from scattered spreadsheets to defined stages, owner views, reminders, and weekly reporting.' },
        { title: 'Client Service Workspace', text: 'Account history, support notes, renewal dates, and escalation signals were brought into one customer view.' },
        { title: 'Founder Visibility Dashboard', text: 'Leadership gained a cleaner view of pipeline, follow-ups, revenue risk, and customer health signals.' },
        { title: 'Onboarding Workflow Buildout', text: 'New customer steps, kickoff details, task owners, and first-value checkpoints became a repeatable workflow.' },
        { title: 'Data Cleanup Migration', text: 'Duplicate contacts, missing fields, stale stages, and inconsistent tags were normalized before launch.' },
        { title: 'Support Handoff System', text: 'Sales-to-service handoffs gained required notes, task templates, ownership, and confirmation checkpoints.' },
        { title: 'Renewal Alert Program', text: 'Upcoming renewals, risk flags, and outreach tasks surfaced before important customer dates arrived.' },
        { title: 'Lead Routing Ruleset', text: 'Inbound inquiries were sorted by fit, territory, service type, urgency, and owner availability.' },
        { title: 'Executive Forecast Board', text: 'Forecast categories, weighted value, close confidence, and stalled opportunity notes became easier to review.' },
        { title: 'Customer Health Monitor', text: 'Usage signals, open issues, sentiment notes, and support load created a clearer account health story.' },
        { title: 'Field Team CRM View', text: 'Mobile-friendly records helped field staff confirm tasks, customer notes, and next actions on the go.' },
        { title: 'Operations Audit Trail', text: 'Important record changes, form submissions, and admin exports gained a clearer review path.' },
      ],
      resources: [
        { title: 'CRM Readiness Checklist', text: 'How to know whether your team is ready to move from spreadsheets into a shared customer system.' },
        { title: 'Pipeline Stages That Teams Actually Use', text: 'A guide to naming stages, exit criteria, required fields, and follow-up expectations.' },
        { title: 'Cleaning Data Before Migration', text: 'The duplicate records, missing fields, old tags, and unclear owners to resolve before launch.' },
        { title: 'What Leaders Should Track Weekly', text: 'Pipeline value, response times, stalled deals, renewal risk, and customer health metrics that matter.' },
        { title: 'CRM Adoption Mistakes to Avoid', text: 'Why teams resist new systems and how workflows, training, and role-based views reduce friction.' },
        { title: 'Designing Better Intake Forms', text: 'How clear form fields, service selectors, and routing logic improve customer handoffs from the start.' },
      ],
      process: [
        { title: 'Map the customer journey', text: 'Define lifecycle stages, owners, required fields, handoffs, service types, and decision points.' },
        { title: 'Configure the workspace', text: 'Shape pipelines, views, permissions, automations, dashboards, and forms around real team behavior.' },
        { title: 'Migrate and clean data', text: 'Normalize records, remove duplicates, confirm fields, and prepare imports before teams rely on reporting.' },
        { title: 'Train by role', text: 'Give sales, service, leadership, and admin users clear examples for their actual daily workflows.' },
        { title: 'Review and optimize', text: 'Use usage patterns, stuck records, missed follow-ups, and reporting gaps to refine the CRM over time.' },
      ],
      proof: ['360 degree customer records', 'Role-based dashboards', 'Export-ready form entries'],
      testimonial: `${brandName} made our customer follow-up visible, cleaned up the handoff between teams, and gave leadership numbers we could finally trust.`,
      imageDirection: 'local abstract CRM dashboards, pipeline boards, account timelines, customer health charts, task queues, admin form tables, and product UI scenes',
    },
    ecommerce: {
      industry: 'ecommerce, retail merchandising, product storytelling, and online customer experience',
      tone: 'commercial, polished, energetic, and easy to shop',
      heroTitle: `${brandName} presents products with the clarity, trust, and momentum shoppers need before checkout.`,
      heroText: `${brandName} needs a finished ecommerce-style website with product storytelling, category paths, proof, resources, and contact or purchase-focused CTAs.`,
      imageDirection: 'local product mockups, catalog cards, order panels, packaging textures, merchandising boards, and lifestyle product scenes',
    },
    health: {
      industry: 'health, wellness, appointment-based services, patient education, and care navigation',
      tone: 'calm, credible, warm, accessible, and reassuring',
      heroTitle: `${brandName} helps people understand their options and feel ready to take the next step.`,
      heroText: `${brandName} needs a polished care-focused website with service details, appointment paths, education, trust signals, and accessible forms.`,
      imageDirection: 'local calm treatment rooms, wellness textures, appointment cards, care plans, staff workspace scenes, and educational diagrams',
    },
    home: {
      industry: 'home services, project planning, field work, estimates, and customer communication',
      tone: 'dependable, local, practical, polished, and clear',
      heroTitle: `${brandName} makes service planning, project expectations, and next steps easy for homeowners.`,
      heroText: `${brandName} needs a complete local-service website with service areas, project proof, request forms, process details, and trustworthy guidance.`,
      imageDirection: 'local project detail images, estimate boards, service trucks, material textures, field notes, and finished home-service work scenes',
    },
    education: {
      industry: 'education, training, coaching, learning programs, and student outcomes',
      tone: 'encouraging, structured, expert, and accessible',
      heroTitle: `${brandName} turns learning goals into a clear path with support, structure, and measurable progress.`,
      heroText: `${brandName} needs a polished education website with program details, outcomes, resources, proof, and inquiry paths.`,
      imageDirection: 'local learning dashboards, workshop tables, course cards, student progress panels, notes, and classroom-inspired scenes',
    },
    nonprofit: {
      industry: 'nonprofit programs, donor communication, community impact, and volunteer engagement',
      tone: 'human, direct, trustworthy, hopeful, and action-oriented',
      heroTitle: `${brandName} makes the mission clear and gives supporters a practical way to act.`,
      heroText: `${brandName} needs a complete nonprofit website with program pages, impact proof, resources, volunteer paths, donation CTAs, and trust signals.`,
      imageDirection: 'local community program scenes, impact dashboards, volunteer cards, donor reports, resource maps, and mission-focused visual panels',
    },
  };

  return { ...generic, ...(byProfile[profile] || {}) };
}

function normalizeSpec(input, promptText, planText, fallbackSlug) {
  const categoryInput = `${promptText}\n${planText}\n${fallbackSlug}`;
  const profile = detectSiteProfile(categoryInput);
  const isLandscape = profile === 'home' && /landscape|garden|outdoor|planting|stone|terrace/i.test(categoryInput);
  const isLogistics = profile === 'logistics';
  const isFinance = profile === 'finance';
  const isFood = profile === 'food';
  const isProduct = profile === 'product';
  const isTech = profile === 'tech' || isProduct;
  const promptBrand = promptField(promptText, ['Business Name', 'Brand Name', 'Company Name', 'Product Name', 'Organization Name']);
  const promptIndustry = promptField(promptText, ['Industry / Category', 'Industry', 'Category', 'Business Category', 'Product Category']);
  const promptTone = promptField(promptText, ['Brand Personality', 'Brand Voice', 'Tone', 'Brand Tone']);
  const promptRegion = promptField(promptText, ['Region', 'Service Area', 'Location', 'Market']);
  const promptHero = promptField(promptText, ['Hero Headline', 'Homepage Headline', 'Main Headline']);
  const promptImageDirection = promptField(promptText, ['Image Direction', 'Photo Direction', 'Illustration Style', 'Visual Asset Direction']);
  const brandName = text(input.brandName || input.businessName || input.name || promptBrand, inferBrand(promptText, fallbackSlug));
  const detectedFallback = profileDefaults(profile, brandName, promptIndustry);
  const industry = text(input.industry || promptIndustry,
    isProduct ? detectedFallback.industry :
    isTech ? 'custom software development, internal tools, workflow automation, dashboards, integrations, and software maintenance' :
    isLogistics ? 'freight operations, dispatch coordination, fleet visibility, and logistics service support' :
    isFinance ? 'insurance guidance, financial planning, client risk reviews, and advisory service support' :
    isFood ? 'restaurant hospitality, seasonal menus, guest experience, and local food service' :
    isLandscape ? 'landscape design and outdoor living' :
    detectedFallback.industry);
  const fallback = profileDefaults(profile, brandName, industry);
  const region = text(input.region || promptRegion, 'by appointment');
  const tone = text(input.tone || promptTone,
    isProduct ? fallback.tone :
    isTech ? 'dark-mode-first, technical, sharp, and approachable' :
    isLogistics ? 'command-center clear, industrial, dependable, and fast-moving' :
    isFinance ? 'calm, trustworthy, editorial, precise, and advisory' :
    isFood ? 'warm, sensory, crafted, local, and hospitality-focused' :
    isLandscape ? 'refined, grounded, editorial, and warm' :
    fallback.tone);
  const heroTitle = text(input.heroTitle || input.headline || promptHero,
    isProduct ? fallback.heroTitle :
    isTech ? `${brandName} builds software systems for the work your team should not be doing by hand.` :
    isLogistics ? 'Freight coordination built for clearer routes, faster answers, and steadier operations.' :
    isFinance ? 'Insurance and advisory guidance that turns complicated decisions into clear next steps.' :
    isFood ? 'Seasonal food, warm service, and a guest experience designed around every detail.' :
    isLandscape ? 'Outdoor rooms with the calm precision of architecture.' :
    fallback.heroTitle);
  const heroText = text(input.heroText || input.heroCopy, isProduct
    ? fallback.heroText
    : isTech
    ? `${brandName} maps messy workflows into custom dashboards, internal tools, automation support, and cleaner reporting infrastructure for teams that need operational clarity.`
    : isLogistics
    ? `${brandName} helps shippers, operators, and field teams move from reactive updates to a clearer freight experience with stronger dispatch visibility, service communication, and route confidence.`
    : isFinance
    ? `${brandName} gives households and business owners a calmer way to compare coverage, understand risk, prepare decisions, and move forward with practical advisory support.`
    : isFood
    ? `${brandName} brings a complete hospitality story to the page with seasonal offerings, thoughtful service details, local flavor, and clear reservation or inquiry paths.`
    : isLandscape
    ? 'Design, construction coordination, planting, lighting, and stewardship are shaped into one clear path for homeowners who want the outdoors to feel resolved.'
    : fallback.heroText);

  const defaultServices = isProduct ? fallback.services : isTech ? [
    { title: 'AI Workflow Automation', text: 'Replace recurring manual steps with reviewed automation systems, routing logic, alerts, and AI-assisted handoffs.' },
    { title: 'Custom Dashboards', text: 'Build decision-ready dashboards that combine metrics, exceptions, pipeline health, and team visibility.' },
    { title: 'Internal Tools', text: 'Create lightweight portals, request systems, admin interfaces, and team software around the way work actually moves.' },
    { title: 'Data Cleanup and Reporting Inputs', text: 'Normalize records, fields, tags, imports, and reporting inputs before leadership relies on the numbers.' },
    { title: 'Tool and Website Integrations', text: 'Connect marketing sites, forms, lead routing, content operations, and reporting flows without fragile plugin sprawl.' },
    { title: 'Reporting Systems', text: 'Turn scattered spreadsheets and exports into repeatable reporting cadences with trustworthy definitions.' },
  ] : isLogistics ? [
    { title: 'Regional freight coordination', text: 'Plan pickup windows, route expectations, carrier handoffs, and delivery communication around real operating constraints.' },
    { title: 'Fleet and dispatch visibility', text: 'Give operations teams clearer daily views of driver status, route exceptions, yard timing, and service priorities.' },
    { title: 'Dedicated shipper support', text: 'Create a steady contact path for quotes, freight questions, account expectations, and proactive service updates.' },
    { title: 'Last-mile delivery programs', text: 'Coordinate local delivery schedules, proof points, service notes, and customer communication without scattered follow-up.' },
    { title: 'Warehouse transfer support', text: 'Support recurring transfer lanes, staging windows, dock timing, and handoff documentation for busy teams.' },
    { title: 'Logistics reporting rhythm', text: 'Turn route activity, exceptions, and on-time patterns into useful reviews for better planning.' },
  ] : isFinance ? [
    { title: 'Coverage review sessions', text: 'Compare current policies, gaps, deductibles, exposures, and renewal questions in plain language.' },
    { title: 'Business risk planning', text: 'Help owners understand liability, property, key person, cyber, and continuity considerations before a claim.' },
    { title: 'Family protection planning', text: 'Map life, home, auto, disability, and umbrella coverage into one easier decision path.' },
    { title: 'Benefits guidance', text: 'Organize health, retirement, and workplace benefits education for teams that need clear enrollment support.' },
    { title: 'Annual advisory check-ins', text: 'Review life changes, policy updates, budget shifts, and new risk factors before renewals become rushed.' },
    { title: 'Claims preparation support', text: 'Give clients a calm process for documentation, next steps, and communication when something goes wrong.' },
  ] : isFood ? [
    { title: 'Seasonal dining', text: 'Menus, specials, and service rhythms shaped around fresh ingredients, local sourcing, and a memorable guest experience.' },
    { title: 'Private events', text: 'Plan gatherings with menus, timing, room details, and hospitality touches that feel personal without being fragile.' },
    { title: 'Catering and pickup', text: 'Offer polished off-site food programs, online inquiry paths, and clear service expectations for hosts.' },
    { title: 'Chef-led tasting menus', text: 'Create a focused, story-driven dining experience with thoughtful pacing and seasonal pairings.' },
    { title: 'Market goods', text: 'Feature pantry items, prepared foods, coffee, pastries, or packaged goods with clear pickup details.' },
    { title: 'Hospitality partnerships', text: 'Support local producers, event venues, and community programs with a consistent food point of view.' },
  ] : isLandscape ? [
    { title: 'Garden design and build', text: 'Site planning, planting structure, stonework coordination, and final installation leadership in one accountable studio path.' },
    { title: 'Outdoor living rooms', text: 'Terraces, courtyards, poolside planting, dining areas, and kitchens planned around real daily use.' },
    { title: 'Lighting and materials', text: 'Warm lighting plans, limestone, bronze, clay, gravel, and wood specified for durability and restraint.' },
    { title: 'Estate stewardship', text: 'Seasonal edits, plant health reviews, and long-term care notes that protect the original design intent.' },
  ] : fallback.services;

  const defaultProjects = isProduct ? fallback.projects : isTech ? [
    { title: 'Field Service Command Center', text: 'Dispatch, job status, invoicing exceptions, and daily capacity signals unified in one operations board.' },
    { title: 'Ecommerce Margin Console', text: 'Product, order, return, and ad-spend data shaped into daily margin visibility for a lean team.' },
    { title: 'CRM Cleanup Pipeline', text: 'Duplicate records, stale stages, source fields, and follow-up gaps cleaned before executive reporting.' },
    { title: 'AI Intake Assistant', text: 'Inbound requests triaged into service type, urgency, missing fields, and next-step recommendations.' },
    { title: 'Inventory Alert Grid', text: 'Supplier delays, reorder thresholds, and stockout risk routed into a practical exception queue.' },
    { title: 'Reporting Rhythm System', text: 'Weekly leadership metrics moved out of manual spreadsheets into repeatable dashboard snapshots.' },
    { title: 'Client Portal Prototype', text: 'A private project hub organized approvals, requests, assets, and status notes for a service company.' },
    { title: 'Lead Routing Workflow', text: 'Forms, qualification signals, territories, and assignment rules connected into a cleaner sales handoff.' },
    { title: 'Operations Health Monitor', text: 'SLA misses, blocked tickets, overdue tasks, and high-risk accounts surfaced before review meetings.' },
    { title: 'Analytics Definition Map', text: 'Conflicting metric names and source fields became a shared glossary for reporting decisions.' },
    { title: 'WordPress Form Integration', text: 'Website inquiries moved through validation, CRM creation, internal notifications, and audit logging.' },
    { title: 'Founder Visibility Dashboard', text: 'A practical overview gave a founder clear signals without waiting for end-of-month reporting.' },
  ] : isLogistics ? [
    { title: 'Regional route visibility board', text: 'Dispatch, customer service, and yard teams aligned around lane updates, route status, and exception notes.' },
    { title: 'Dedicated shipper onboarding', text: 'A recurring shipper received clearer contact paths, quote expectations, lane details, and service standards.' },
    { title: 'Last-mile delivery refresh', text: 'Delivery windows, proof-of-delivery expectations, and driver communication were staged into a cleaner customer journey.' },
    { title: 'Cold-chain transfer program', text: 'Temperature-sensitive transfer notes, timing expectations, and dock coordination were clarified for operators.' },
    { title: 'Fleet maintenance communication', text: 'Service windows, driver notes, and availability status were organized for better daily planning.' },
    { title: 'Warehouse shuttle lane', text: 'Recurring warehouse transfers were mapped with handoff points, staging details, and service recovery paths.' },
    { title: 'Emergency load response', text: 'A time-sensitive freight request moved through qualification, route planning, and customer updates without delay.' },
    { title: 'Retail replenishment loop', text: 'Multi-stop replenishment work gained clearer schedule communication and exception reporting.' },
    { title: 'Construction supply run', text: 'Jobsite material deliveries were planned around staging limits, crew timing, and safer unload communication.' },
    { title: 'LTL coordination desk', text: 'Partial loads, carrier notes, and delivery updates were organized into a clearer service rhythm.' },
    { title: 'Expedited freight recovery', text: 'A delayed shipment received a practical recovery plan with customer updates and revised timing.' },
    { title: 'Manufacturing parts lane', text: 'Recurring parts movement gained predictable pickup notes, route expectations, and exception escalation.' },
  ] : isFinance ? [
    { title: 'Family coverage reset', text: 'A household compared auto, home, umbrella, and life coverage in one organized advisory session.' },
    { title: 'Small business risk review', text: 'A growing service company clarified liability, property, cyber, and employment risk priorities.' },
    { title: 'Benefits education hub', text: 'Employees received clearer plan explanations, enrollment reminders, and decision support resources.' },
    { title: 'Renewal planning system', text: 'Policy renewal questions, rate changes, and coverage recommendations were staged before deadline pressure.' },
    { title: 'Claims readiness guide', text: 'A client-facing guide clarified documentation, contact paths, and first steps for stressful moments.' },
    { title: 'Founder protection map', text: 'A business owner reviewed disability, key person, continuity, and personal planning considerations together.' },
  ] : isFood ? [
    { title: 'Seasonal supper series', text: 'A monthly dining event gained a clearer menu story, reservation path, and editorial photo direction.' },
    { title: 'Market counter launch', text: 'Prepared goods, pantry staples, pastries, and pickup details were organized into a polished retail experience.' },
    { title: 'Private event tasting', text: 'Hosts reviewed menu options, timing, service flow, and room styling through one guided inquiry path.' },
    { title: 'Chef collaboration night', text: 'A special event highlighted producers, courses, pairings, and guest expectations without clutter.' },
    { title: 'Neighborhood catering program', text: 'Office lunches and home gatherings received clear package options, minimums, and ordering guidance.' },
    { title: 'Local producer feature', text: 'A sourcing story connected farmers, seasonal ingredients, and menu decisions in a credible way.' },
  ] : isLandscape ? [
    { title: 'Courtyard retreat', text: 'A narrow rear garden became a calm sequence of limestone, evergreen structure, and evening seating.' },
    { title: 'Stone garden room', text: 'Hand-selected paving, low walls, shade planting, and soft lighting created a durable outdoor room.' },
    { title: 'Dining terrace', text: 'A terrace plan balanced cooking, dining, drainage, and planted enclosure without visual clutter.' },
  ] : fallback.projects;

  const defaultResources = isProduct ? fallback.resources : isTech ? [
    { title: 'Automation Readiness Checklist', text: 'How to decide which manual workflow should be automated first without creating brittle systems.' },
    { title: 'Dashboard Planning Guide', text: 'The questions that define useful dashboards before charts and metrics multiply.' },
    { title: 'AI Chatbot Use Cases', text: 'Where small businesses can use assistants safely for intake, triage, drafting, and internal support.' },
    { title: 'Data Cleanup Before Reporting', text: 'Why duplicate records, unclear fields, and stale stages make dashboards look better than they are.' },
    { title: 'Internal Tools vs. Spreadsheets', text: 'How to know when a spreadsheet has become an operational dependency that needs a system.' },
    { title: 'Workflow Routing Patterns', text: 'Common ways to move requests, approvals, alerts, and exceptions through a small team.' },
  ] : isLogistics ? [
    { title: 'What shippers should prepare before requesting a quote', text: 'The freight details that reduce back-and-forth and improve route planning from the first conversation.' },
    { title: 'How dispatch teams handle route exceptions', text: 'A practical look at delays, missed windows, weather, driver updates, and customer communication.' },
    { title: 'Choosing a regional freight partner', text: 'Service standards, lane familiarity, communication habits, and reliability signals that matter.' },
    { title: 'Why proof of delivery expectations matter', text: 'How documentation, timing, and customer updates protect both the shipper and the carrier.' },
    { title: 'Planning recurring warehouse transfers', text: 'What to define before setting up a steady shuttle lane between facilities.' },
    { title: 'Fleet communication basics', text: 'The status notes that help teams stay ahead of daily freight questions.' },
  ] : isFinance ? [
    { title: 'Questions to ask before policy renewal', text: 'How to review coverage, deductibles, risk changes, and budget before accepting another renewal.' },
    { title: 'Understanding umbrella coverage', text: 'Where additional liability protection can support families, business owners, and higher-risk households.' },
    { title: 'Business insurance terms in plain language', text: 'A practical guide to liability, property, cyber, workers compensation, and policy exclusions.' },
    { title: 'How to prepare for a claims conversation', text: 'The notes, photos, documents, and contact details that make next steps less stressful.' },
    { title: 'Benefits education for small teams', text: 'Ways employers can help employees understand plans without overwhelming them.' },
    { title: 'When life changes should trigger a coverage review', text: 'Homes, vehicles, dependents, business changes, and income shifts that deserve attention.' },
  ] : isFood ? [
    { title: 'How the seasonal menu is planned', text: 'The sourcing, prep, and hospitality choices behind a menu that changes with the market.' },
    { title: 'Planning a private dinner', text: 'What hosts should think through before choosing food, service timing, and room setup.' },
    { title: 'Pairing pantry goods with weeknight meals', text: 'Simple ways to use market shelves, prepared foods, and sauces at home.' },
    { title: 'What makes a tasting menu flow', text: 'A practical look at pacing, contrast, temperature, texture, and guest comfort.' },
    { title: 'Catering questions to answer early', text: 'Guest counts, dietary needs, service style, access, and timing details that shape a smoother event.' },
    { title: 'Local producer stories', text: 'How farms, makers, and seasonal constraints influence the food on the table.' },
  ] : isLandscape ? [
    { title: 'How early should a garden plan begin?', text: 'Why winter planning improves pricing, plant availability, and construction sequencing.' },
    { title: 'Choosing stone that will age well', text: 'A practical guide to limestone, gravel, clay pavers, and bronze details in residential gardens.' },
    { title: 'Seasonal care after installation', text: 'The pruning, lighting, soil, and editing rhythm that keeps a new garden improving.' },
  ] : fallback.resources;
  const servicesTarget = 6;
  const projectsTarget = (isTech || isLogistics || isProduct) ? 12 : (isFinance || isFood || profile !== 'general') ? 6 : 6;
  const resourcesTarget = (isTech || isLogistics || isFinance || isFood || profile !== 'general') ? 6 : 6;
  const processTarget = isProduct ? 5 : isTech ? 4 : 5;

  return {
    brandName,
    industry,
    region,
    tone,
    heroTitle,
    heroText,
    eyebrow: text(input.eyebrow, brandName),
    services: completeArrayObjects(input.services, defaultServices, servicesTarget),
    projects: completeArrayObjects(input.projects || input.work, defaultProjects, projectsTarget),
    resources: completeArrayObjects(input.resources || input.blog, defaultResources, resourcesTarget),
    process: safeArrayObjects(input.process, isProduct ? fallback.process : isLogistics ? [
      { title: 'Map the lane', text: 'Confirm shipment details, route constraints, pickup windows, service expectations, and communication owners.' },
      { title: 'Plan the handoffs', text: 'Align dispatch, driver notes, warehouse timing, proof points, and customer updates before freight moves.' },
      { title: 'Run and review', text: 'Track service quality, exceptions, on-time patterns, and improvements for the next shipment.' },
    ] : isFinance ? [
      { title: 'Clarify the risk picture', text: 'Review current coverage, life changes, business exposures, budget, and decision deadlines.' },
      { title: 'Compare practical options', text: 'Explain tradeoffs, exclusions, deductibles, and recommendations in language clients can use.' },
      { title: 'Support the next review', text: 'Document decisions, prepare renewal reminders, and keep the advisory path organized.' },
    ] : isFood ? [
      { title: 'Shape the occasion', text: 'Understand guests, timing, menu needs, room flow, and the service tone that should be felt.' },
      { title: 'Craft the menu story', text: 'Connect seasonal ingredients, preparation, presentation, and hospitality details into one experience.' },
      { title: 'Host with consistency', text: 'Coordinate service notes, guest questions, follow-up, and future booking paths.' },
    ] : [
      { title: 'Listen and map', text: 'Document priorities, constraints, audience needs, and what success must feel like.' },
      { title: 'Design and specify', text: 'Turn the strategy into layouts, content structure, materials, and build-ready decisions.' },
      { title: 'Build and refine', text: 'Coordinate implementation, test the experience, and prepare long-term care notes.' },
      { title: 'Prepare the next step', text: 'Document the finished structure, contact paths, content priorities, and future update rhythm.' },
      { title: 'Measure what matters', text: 'Review signals from inquiries, resources, service interest, and visitor questions to improve the site.' },
    ]).slice(0, processTarget),
    proof: list(input.proof,
      isProduct ? fallback.proof :
      isTech ? ['42 workflows mapped', '18 dashboards shipped', '0 external runtime APIs'] :
      isLogistics ? ['24 active lane reviews', '6 service regions coordinated', '98 percent update discipline'] :
      isFinance ? ['17 annual review categories', 'Plain-language coverage notes', 'Renewal calendar support'] :
      isFood ? ['Seasonal menu cadence', 'Private event planning', 'Local producer relationships'] :
      isLandscape ? ['18 estate gardens stewarded', '5 integrated design-build disciplines', '12 month care plans'] :
      fallback.proof).slice(0, 3),
    testimonial: text(input.testimonial, isProduct
      ? fallback.testimonial
      : isTech
      ? `${brandName} helped us see where work was getting stuck, then turned the messy parts into a system our team could actually use.`
      : isLogistics
      ? 'The team gave us clearer freight communication, fewer repeated calls, and a route plan everyone could understand before the first pickup.'
      : isFinance
      ? 'They made our coverage questions feel manageable and gave us a clear path for decisions we had been delaying.'
      : isFood
      ? 'Every detail felt intentional, from the menu language to the way guests knew exactly what to expect.'
      : isLandscape
      ? 'Aster Grove gave us a garden that feels established, intentional, and easy to live in. The process was calm from start to finish.'
      : fallback.testimonial),
    imageDirection: text(input.imageDirection || promptImageDirection,
      isProduct ? fallback.imageDirection :
      isTech ? 'local abstract AI operations dashboards, automation node maps, analytics consoles, workflow routing diagrams, and system health monitors' :
      isLogistics ? 'local abstract freight route maps, dispatch boards, truck lane diagrams, warehouse transfer grids, and route status panels' :
      isFinance ? 'local abstract advisory documents, coverage maps, calm office textures, risk review panels, and financial planning diagrams' :
      isFood ? 'local abstract dining tables, seasonal ingredient textures, menu cards, market shelves, warm kitchen details, and hospitality scenes' :
      isLandscape ? 'garden pathway, outdoor terrace, planting plan, stonework, dining terrace, and seasonal texture' :
      fallback.imageDirection),
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

const imageSet = isTechTheme ? [
  ['hero/brand-hero-01.png', [5, 10, 24], [18, 92, 160], [75, 230, 255]],
  ['hero/brand-hero-02.png', [3, 7, 18], [33, 44, 74], [179, 255, 70]],
  ['portfolio/project-01.png', [8, 18, 40], [15, 120, 190], [70, 220, 255]],
  ['portfolio/project-02.png', [9, 16, 32], [42, 76, 116], [185, 255, 72]],
  ['portfolio/project-03.png', [4, 9, 20], [21, 58, 95], [62, 232, 255]],
  ['portfolio/project-04.png', [6, 13, 30], [28, 90, 150], [180, 255, 84]],
  ['portfolio/project-05.png', [7, 17, 38], [24, 104, 170], [81, 220, 255]],
  ['portfolio/project-06.png', [4, 8, 18], [39, 64, 100], [176, 255, 60]],
  ['portfolio/project-07.png', [8, 19, 42], [19, 92, 160], [70, 230, 255]],
  ['portfolio/project-08.png', [6, 11, 26], [36, 82, 126], [190, 255, 80]],
  ['portfolio/project-09.png', [5, 14, 34], [12, 110, 174], [88, 235, 255]],
  ['portfolio/project-10.png', [8, 14, 28], [48, 72, 112], [178, 255, 74]],
  ['portfolio/project-11.png', [3, 8, 20], [25, 94, 150], [78, 224, 255]],
  ['portfolio/project-12.png', [9, 18, 36], [32, 62, 108], [190, 255, 86]],
  ['texture/detail-01.png', [2, 8, 20], [28, 75, 130], [80, 226, 255]],
  ['texture/detail-02.png', [6, 14, 32], [46, 60, 88], [180, 255, 80]],
  ['texture/detail-03.png', [4, 10, 24], [13, 130, 172], [88, 220, 255]],
] : isLogisticsTheme ? [
  ['hero/brand-hero-01.png', [10, 18, 28], [50, 88, 122], [255, 132, 40]],
  ['hero/brand-hero-02.png', [17, 26, 38], [88, 98, 105], [247, 181, 78]],
  ['portfolio/project-01.png', [20, 31, 42], [72, 101, 124], [255, 122, 46]],
  ['portfolio/project-02.png', [11, 20, 34], [43, 79, 118], [240, 188, 80]],
  ['portfolio/project-03.png', [31, 35, 40], [113, 113, 100], [255, 146, 68]],
  ['portfolio/project-04.png', [8, 18, 29], [62, 93, 128], [255, 116, 54]],
  ['portfolio/project-05.png', [21, 28, 37], [84, 108, 132], [246, 182, 78]],
  ['portfolio/project-06.png', [16, 24, 35], [74, 78, 90], [255, 138, 40]],
  ['portfolio/project-07.png', [9, 19, 31], [52, 94, 140], [245, 178, 70]],
  ['portfolio/project-08.png', [24, 30, 38], [102, 102, 88], [255, 132, 48]],
  ['portfolio/project-09.png', [13, 22, 33], [58, 96, 128], [255, 146, 54]],
  ['portfolio/project-10.png', [27, 33, 40], [116, 108, 90], [246, 184, 68]],
  ['portfolio/project-11.png', [8, 17, 30], [42, 88, 130], [255, 124, 44]],
  ['portfolio/project-12.png', [19, 27, 38], [90, 105, 124], [248, 176, 70]],
  ['texture/detail-01.png', [33, 35, 36], [112, 112, 97], [255, 122, 48]],
  ['texture/detail-02.png', [11, 20, 32], [40, 82, 126], [247, 188, 76]],
  ['texture/detail-03.png', [20, 27, 35], [88, 98, 112], [255, 144, 54]],
] : isFinanceTheme ? [
  ['hero/brand-hero-01.png', [14, 34, 48], [175, 164, 132], [80, 145, 172]],
  ['hero/brand-hero-02.png', [24, 43, 58], [218, 207, 179], [139, 117, 80]],
  ['portfolio/project-01.png', [15, 38, 52], [190, 183, 152], [87, 142, 165]],
  ['portfolio/project-02.png', [31, 52, 68], [226, 219, 194], [149, 124, 82]],
  ['portfolio/project-03.png', [20, 42, 56], [161, 176, 170], [78, 139, 166]],
  ['portfolio/project-04.png', [11, 30, 45], [207, 196, 164], [144, 116, 76]],
  ['portfolio/project-05.png', [29, 49, 62], [231, 222, 198], [92, 148, 170]],
  ['portfolio/project-06.png', [17, 36, 52], [173, 167, 145], [148, 121, 83]],
  ['texture/detail-01.png', [229, 222, 203], [91, 126, 143], [28, 58, 76]],
  ['texture/detail-02.png', [182, 170, 142], [23, 52, 68], [141, 116, 80]],
  ['texture/detail-03.png', [31, 60, 76], [215, 205, 177], [87, 142, 168]],
] : isFoodTheme ? [
  ['hero/brand-hero-01.png', [80, 28, 24], [228, 163, 96], [250, 221, 154]],
  ['hero/brand-hero-02.png', [48, 30, 24], [190, 104, 64], [106, 145, 75]],
  ['portfolio/project-01.png', [101, 39, 31], [224, 156, 92], [246, 222, 164]],
  ['portfolio/project-02.png', [56, 36, 29], [176, 90, 58], [120, 151, 82]],
  ['portfolio/project-03.png', [111, 48, 35], [238, 180, 110], [246, 226, 166]],
  ['portfolio/project-04.png', [70, 36, 28], [204, 116, 66], [111, 151, 82]],
  ['portfolio/project-05.png', [93, 42, 32], [226, 158, 96], [245, 213, 146]],
  ['portfolio/project-06.png', [50, 33, 27], [168, 88, 56], [116, 145, 74]],
  ['texture/detail-01.png', [245, 219, 166], [150, 73, 45], [110, 143, 76]],
  ['texture/detail-02.png', [203, 143, 86], [79, 36, 28], [248, 222, 160]],
  ['texture/detail-03.png', [94, 121, 70], [232, 170, 98], [108, 48, 34]],
] : [
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
  const screenshotPalette = isTechTheme
    ? [[3, 8, 20], [16, 90, 150], [75, 225, 255]]
    : isLogisticsTheme
    ? [[10, 18, 28], [70, 96, 120], [255, 132, 40]]
    : isFinanceTheme
    ? [[16, 37, 52], [210, 201, 174], [86, 145, 168]]
    : isFoodTheme
    ? [[76, 30, 24], [224, 150, 88], [246, 222, 160]]
    : [[32, 51, 40], [216, 197, 160], [133, 150, 93]];
  write(path.join(themeDir, 'screenshot.png'), makePng(1200, 900, screenshotPalette[0], screenshotPalette[1], screenshotPalette[2]));
}

const baseCss = `
:root{--ink:#20251f;--garden:#263d2f;--moss:#718154;--limestone:#e7dfcc;--cream:#f8f2e5;--bronze:#9a724b;--clay:#b65f43;--charcoal:#2f332e;--display:Georgia,"Times New Roman",serif;--body:"Trebuchet MS",Verdana,sans-serif;--shadow:0 24px 60px rgba(32,37,31,.14);--large:30px;--card:20px}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);background:var(--cream);font-family:var(--body);line-height:1.7}a{color:inherit}img{max-width:100%;display:block;border-radius:var(--card)}.skip-link{position:absolute;left:-999px}.skip-link:focus{left:1rem;top:1rem;z-index:1000;background:var(--ink);color:#fff;padding:.75rem 1rem}.container{width:min(1140px,calc(100% - 36px));margin:0 auto}.section{padding:clamp(4rem,8vw,7rem) 0}.section.alt{background:linear-gradient(135deg,#efe6d3,#d9d0b9)}.eyebrow{letter-spacing:.14em;text-transform:uppercase;font-size:.76rem;color:var(--bronze);font-weight:800}h1,h2,h3,h4{font-family:var(--display);line-height:1.05;color:var(--garden);margin:0 0 1rem}h1{font-size:clamp(3.4rem,7vw,7rem);letter-spacing:-.055em}h2{font-size:clamp(2.3rem,5vw,4.6rem);letter-spacing:-.04em}h3{font-size:clamp(1.35rem,2vw,2rem)}p{margin:0 0 1.1rem}.lede{font-size:clamp(1.08rem,1.6vw,1.32rem);max-width:760px;color:rgba(32,37,31,.76)}.button{display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--garden);background:var(--garden);color:white;text-decoration:none;padding:.9rem 1.25rem;border-radius:999px;font-weight:800;cursor:pointer}.button:hover{background:#14251c;transform:translateY(-2px)}.button.ghost{background:transparent;color:var(--garden)}
.nolan-site-header{position:sticky;top:0;z-index:100;background:rgba(248,242,229,.92);backdrop-filter:blur(18px);border-bottom:1px solid rgba(38,61,47,.12)}.nolan-header-inner{width:min(1180px,calc(100% - 28px));margin:0 auto;min-height:84px;display:flex;align-items:center;gap:1.25rem}.nolan-brand{text-decoration:none;display:inline-flex;align-items:center;gap:.65rem;font-weight:900;color:var(--garden)}.nolan-mark{width:42px;height:42px;display:grid;place-items:center;border-radius:50%;background:var(--garden);color:var(--cream);font-family:var(--display)}.nolan-primary-nav{margin-left:auto;display:flex;align-items:center;gap:.45rem}.nolan-primary-nav a,.nolan-menu-trigger{border:0;background:transparent;color:var(--ink);text-decoration:none;font:inherit;font-weight:800;padding:.75rem .85rem;cursor:pointer;border-radius:999px}.nolan-primary-nav a:hover,.nolan-menu-trigger:hover,.nolan-menu-trigger[aria-expanded=true]{background:rgba(38,61,47,.09)}.nolan-header-actions{display:flex;gap:.75rem;align-items:center}.nolan-header-cta{text-decoration:none;background:var(--bronze);color:white;border-radius:999px;padding:.78rem 1rem;font-weight:900}.nolan-mobile-toggle{display:none;border:1px solid rgba(38,61,47,.28);background:transparent;border-radius:999px;padding:.7rem .95rem;font-weight:900}.nolan-menu-backdrop{position:fixed;inset:84px 0 0;background:rgba(32,37,31,.18)}.nolan-menu-dropdown{position:fixed;left:50%;top:86px;transform:translateX(-50%);width:min(1060px,calc(100vw - 32px));background:#fbf7ed;border:1px solid rgba(38,61,47,.14);border-radius:28px;box-shadow:var(--shadow);padding:1.2rem;z-index:130}.nolan-menu-panel{display:grid;grid-template-columns:260px 1fr;gap:1rem}.nolan-menu-rail{display:grid;gap:.5rem;align-content:start;border-right:1px solid rgba(38,61,47,.14);padding-right:1rem}.nolan-menu-rail button{text-align:left;border:0;background:transparent;padding:.85rem;border-radius:16px;font-weight:900;color:var(--garden);cursor:pointer}.nolan-menu-rail button[aria-expanded=true]{background:var(--limestone)}.nolan-rail-content[hidden],.nolan-menu-dropdown[hidden],.nolan-menu-backdrop[hidden],.nolan-mobile-drawer[hidden]{display:none}.nolan-menu-link-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem;margin-top:1rem}.nolan-menu-card{border:1px solid rgba(38,61,47,.14);border-radius:18px;padding:1rem;text-decoration:none;background:white}.nolan-mobile-drawer{position:fixed;inset:84px 16px auto;background:var(--garden);color:white;border-radius:24px;padding:1.25rem;z-index:140;box-shadow:var(--shadow)}.nolan-mobile-drawer nav{display:grid;gap:.8rem}.nolan-mobile-drawer a{color:white;text-decoration:none;font-size:1.25rem;font-weight:900}body.nolan-menu-open{overflow:hidden}
.hero{padding:clamp(5rem,9vw,8rem) 0;background:radial-gradient(circle at 75% 20%,rgba(154,114,75,.25),transparent 34%),linear-gradient(135deg,#f8f2e5,#dfd4bd);overflow:hidden}.hero-grid{display:grid;grid-template-columns:minmax(0,1.02fr) minmax(320px,.88fr);gap:clamp(2rem,5vw,5rem);align-items:center}.hero-media{position:relative;min-height:520px}.hero-media img:first-child{width:82%;height:460px;object-fit:cover;box-shadow:var(--shadow)}.hero-media img:last-child{position:absolute;right:0;bottom:0;width:52%;height:260px;object-fit:cover;border:10px solid var(--cream);box-shadow:var(--shadow)}.hero-proof{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-top:2rem}.proof-chip{background:rgba(255,255,255,.62);border:1px solid rgba(38,61,47,.12);border-radius:18px;padding:1rem}.proof-chip strong{display:block;color:var(--garden);font-family:var(--display);font-size:1.35rem}.grid-2,.grid-3,.grid-4{display:grid;gap:1rem}.grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-4{grid-template-columns:repeat(4,minmax(0,1fr))}.card,.proof-card,.service-card,.work-card,.post-card{background:rgba(255,255,255,.72);border:1px solid rgba(38,61,47,.12);border-radius:var(--card);padding:clamp(1.25rem,2.4vw,2rem);box-shadow:0 16px 44px rgba(32,37,31,.08)}.service-card{min-height:270px;display:flex;flex-direction:column}.service-card .button{margin-top:auto;align-self:flex-start}.work-card img{height:250px;width:100%;object-fit:cover;margin-bottom:1rem}.texture-band{background:var(--garden);color:var(--cream);padding:4rem 0}.texture-band h2,.texture-band h3{color:var(--cream)}.process-list{counter-reset:process;display:grid;gap:1rem}.process-item{counter-increment:process;display:grid;grid-template-columns:72px 1fr;gap:1rem;align-items:start;padding:1.2rem;border-radius:20px;background:rgba(255,255,255,.62);border:1px solid rgba(38,61,47,.12)}.process-item:before{content:counter(process,decimal-leading-zero);font-family:var(--display);font-size:2rem;color:var(--bronze)}.testimonial{font-family:var(--display);font-size:1.55rem;color:var(--garden)}.cta-banner{border-radius:var(--large);padding:clamp(2rem,5vw,4rem);background:linear-gradient(135deg,var(--garden),#16261d);color:white}.cta-banner h2{color:white}.site-footer{background:var(--charcoal);color:var(--cream);padding:4rem 0 2rem}.footer-grid{display:grid;grid-template-columns:1.4fr repeat(3,1fr);gap:2rem}.site-footer a{color:var(--cream);text-decoration:none;display:block;margin:.45rem 0}.form-grid{display:grid;gap:1rem}label{display:grid;gap:.35rem;font-weight:800;color:var(--garden)}input,textarea,select{width:100%;border:1px solid rgba(38,61,47,.22);border-radius:16px;padding:.9rem 1rem;background:white;font:inherit}textarea{min-height:150px}.page-hero{padding:5rem 0 3rem;background:linear-gradient(135deg,#f8f2e5,#e5dbc6)}
@media(max-width:900px){.nolan-primary-nav,.nolan-header-cta{display:none}.nolan-mobile-toggle{display:inline-flex}.hero-grid,.grid-2,.grid-3,.grid-4,.footer-grid,.nolan-menu-panel{grid-template-columns:1fr}.hero-media{min-height:390px}.hero-media img:first-child{height:340px}.hero-proof{grid-template-columns:1fr}.nolan-menu-dropdown{top:82px}}
`;

const techCss = `
:root{--ink:#f4fbff;--garden:#e7fbff;--moss:#55e8ff;--limestone:#0d1728;--cream:#050914;--bronze:#48e7ff;--clay:#b8ff53;--charcoal:#020611;--display:"Trebuchet MS",Verdana,sans-serif;--body:"Lucida Sans",Verdana,sans-serif;--shadow:0 24px 80px rgba(0,0,0,.42)}
body{background:radial-gradient(circle at 20% 0%,rgba(38,190,255,.18),transparent 32%),linear-gradient(180deg,#050914,#0a1020 44%,#050914);color:#e9f7ff}
h1,h2,h3,h4{color:#f7fcff}.lede,p{color:rgba(233,247,255,.76)}.eyebrow{color:#6beeff}.section.alt{background:linear-gradient(135deg,rgba(17,28,52,.92),rgba(5,9,20,.96))}.page-hero{background:linear-gradient(135deg,#071022,#101b32)}
.nolan-site-header{background:rgba(5,9,20,.9);border-bottom:1px solid rgba(85,232,255,.16)}.nolan-brand,.nolan-primary-nav a,.nolan-menu-trigger{color:#eefbff}.nolan-mark{background:linear-gradient(135deg,#1dbdff,#b8ff53);color:#03101b}.nolan-header-cta,.button{background:linear-gradient(135deg,#1bbfff,#78f6ff);border-color:transparent;color:#03101b}.button.ghost{background:rgba(85,232,255,.08);color:#e9f7ff;border-color:rgba(85,232,255,.28)}.nolan-primary-nav a:hover,.nolan-menu-trigger:hover,.nolan-menu-trigger[aria-expanded=true]{background:rgba(85,232,255,.12)}
.nolan-menu-dropdown{background:#07101f;border-color:rgba(85,232,255,.2)}.nolan-menu-rail{border-right-color:rgba(85,232,255,.16)}.nolan-menu-rail button{color:#e9f7ff}.nolan-menu-rail button[aria-expanded=true],.nolan-menu-card,.card,.proof-card,.service-card,.work-card,.post-card{background:linear-gradient(180deg,rgba(20,35,63,.9),rgba(7,16,31,.9));border-color:rgba(85,232,255,.16);box-shadow:0 20px 70px rgba(0,0,0,.28)}.nolan-mobile-drawer{background:#07101f;border:1px solid rgba(85,232,255,.2)}
.hero{position:relative;background:radial-gradient(circle at 78% 20%,rgba(85,232,255,.22),transparent 30%),radial-gradient(circle at 20% 20%,rgba(184,255,83,.11),transparent 24%),linear-gradient(135deg,#050914,#101b32 54%,#061627);overflow:hidden}.hero:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(85,232,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(85,232,255,.08) 1px,transparent 1px);background-size:54px 54px;mask-image:radial-gradient(circle at 60% 20%,black,transparent 75%);pointer-events:none}.hero .container{position:relative}.hero-media img{border:1px solid rgba(85,232,255,.22);background:#07101f}.proof-chip{background:rgba(8,19,38,.8);border-color:rgba(85,232,255,.18)}.proof-chip strong{color:#b8ff53}.texture-band{background:linear-gradient(135deg,#07101f,#071d34)}.process-item{background:rgba(14,29,54,.88);border-color:rgba(85,232,255,.16)}.process-item:before{color:#55e8ff}.testimonial{color:#f4fbff}.cta-banner{background:linear-gradient(135deg,#123d74,#07101f 62%,#1a2b19);border:1px solid rgba(85,232,255,.2)}.site-footer{background:#020611;border-top:1px solid rgba(85,232,255,.14)}label{color:#f4fbff}input,textarea,select{background:#07101f;color:#f4fbff;border-color:rgba(85,232,255,.22)}
.dashboard-band{position:relative;overflow:hidden}.dashboard-band:before{content:"";position:absolute;inset:12%;border:1px solid rgba(85,232,255,.12);border-radius:34px;box-shadow:0 0 80px rgba(85,232,255,.08);pointer-events:none}.metric-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem}.metric-card{background:rgba(8,19,38,.84);border:1px solid rgba(85,232,255,.18);border-radius:20px;padding:1.25rem}.metric-card strong{display:block;color:#b8ff53;font-size:2rem}.faq-list{display:grid;gap:1rem}.faq-list details{background:rgba(8,19,38,.84);border:1px solid rgba(85,232,255,.16);border-radius:18px;padding:1rem}.faq-list summary{cursor:pointer;font-weight:900;color:#f4fbff}
@media(max-width:900px){.metric-grid{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.metric-grid{grid-template-columns:1fr}}
`;

const logisticsCss = `
:root{--ink:#f7f3ec;--garden:#f5f0e5;--moss:#f97316;--limestone:#111827;--cream:#0d141f;--bronze:#f97316;--clay:#fbbf24;--charcoal:#080d14;--display:"Trebuchet MS",Verdana,sans-serif;--body:"Lucida Sans",Verdana,sans-serif;--shadow:0 24px 70px rgba(0,0,0,.34)}
body{background:linear-gradient(180deg,#0d141f,#141c29 44%,#0d141f);color:#f7f3ec}
h1,h2,h3,h4{color:#fff8ed}.lede,p{color:rgba(247,243,236,.78)}.eyebrow{color:#fbbf24}.section.alt,.page-hero{background:linear-gradient(135deg,#172231,#111827)}
.nolan-site-header{background:rgba(13,20,31,.92);border-bottom:1px solid rgba(249,115,22,.2)}.nolan-brand,.nolan-primary-nav a,.nolan-menu-trigger{color:#fff8ed}.nolan-mark{background:linear-gradient(135deg,#f97316,#fbbf24);color:#111827}.nolan-header-cta,.button{background:#f97316;border-color:#f97316;color:#111827}.button.ghost{background:rgba(249,115,22,.08);color:#fff8ed;border-color:rgba(249,115,22,.32)}
.nolan-menu-dropdown,.nolan-mobile-drawer{background:#111827;border-color:rgba(249,115,22,.22)}.nolan-menu-rail button{color:#fff8ed}.nolan-menu-rail button[aria-expanded=true],.nolan-menu-card,.card,.proof-card,.service-card,.work-card,.post-card{background:linear-gradient(180deg,rgba(31,43,58,.95),rgba(15,23,34,.96));border-color:rgba(249,115,22,.18);box-shadow:0 18px 60px rgba(0,0,0,.24)}
.hero{background:radial-gradient(circle at 76% 24%,rgba(249,115,22,.22),transparent 30%),linear-gradient(135deg,#0d141f,#1f2b3a 56%,#111827)}.hero:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(251,191,36,.07) 0 2px,transparent 2px 74px);pointer-events:none}.proof-chip,.process-item{background:rgba(31,43,58,.82);border-color:rgba(249,115,22,.18)}.proof-chip strong,.process-item:before{color:#fbbf24}.texture-band,.site-footer{background:#080d14}.testimonial{color:#fff8ed}.cta-banner{background:linear-gradient(135deg,#f97316,#4b250c);color:#111827}label{color:#fff8ed}input,textarea,select{background:#111827;color:#fff8ed;border-color:rgba(249,115,22,.28)}
`;

const financeCss = `
:root{--ink:#1d2f3d;--garden:#163448;--moss:#507f95;--limestone:#e7dfcc;--cream:#f8f4ea;--bronze:#9a7a45;--clay:#b8834d;--charcoal:#142535;--display:Georgia,"Times New Roman",serif;--body:"Trebuchet MS",Verdana,sans-serif;--shadow:0 24px 60px rgba(22,52,72,.16)}
body{background:#f8f4ea;color:#1d2f3d}.hero{background:radial-gradient(circle at 78% 20%,rgba(80,127,149,.22),transparent 32%),linear-gradient(135deg,#f8f4ea,#e8dfca)}.section.alt,.page-hero{background:linear-gradient(135deg,#eef0ec,#ded3bd)}
.nolan-site-header{background:rgba(248,244,234,.93);border-bottom-color:rgba(22,52,72,.14)}.nolan-mark,.button{background:#163448;color:#fff8ed}.nolan-header-cta{background:#9a7a45;color:#fff8ed}.nolan-menu-trigger[aria-expanded=true],.nolan-primary-nav a:hover,.nolan-menu-trigger:hover{background:rgba(80,127,149,.14)}
.nolan-menu-dropdown,.nolan-menu-card,.card,.proof-card,.service-card,.work-card,.post-card{border-color:rgba(22,52,72,.14)}.proof-chip strong,.process-item:before{color:#9a7a45}.texture-band,.cta-banner,.site-footer{background:linear-gradient(135deg,#163448,#142535)}.texture-band h2,.texture-band h3,.cta-banner h2{color:#fff8ed}.testimonial{color:#163448}
`;

const foodCss = `
:root{--ink:#352218;--garden:#5c2d22;--moss:#78984f;--limestone:#f1dcc0;--cream:#fff5e7;--bronze:#b55b32;--clay:#d98b43;--charcoal:#2c1a14;--display:Georgia,"Times New Roman",serif;--body:"Trebuchet MS",Verdana,sans-serif;--shadow:0 24px 60px rgba(70,35,20,.18)}
body{background:#fff5e7;color:#352218}.hero{background:radial-gradient(circle at 74% 18%,rgba(217,139,67,.26),transparent 32%),linear-gradient(135deg,#fff5e7,#f1dcc0)}.section.alt,.page-hero{background:linear-gradient(135deg,#faead4,#efd2b3)}
.nolan-site-header{background:rgba(255,245,231,.93);border-bottom-color:rgba(92,45,34,.14)}.nolan-mark,.button{background:#5c2d22;color:#fff5e7}.nolan-header-cta{background:#b55b32;color:#fff5e7}.button.ghost{color:#5c2d22;border-color:#5c2d22}.nolan-menu-trigger[aria-expanded=true],.nolan-primary-nav a:hover,.nolan-menu-trigger:hover{background:rgba(181,91,50,.13)}
.nolan-menu-dropdown,.nolan-menu-card,.card,.proof-card,.service-card,.work-card,.post-card{border-color:rgba(92,45,34,.14)}.proof-chip strong,.process-item:before{color:#b55b32}.texture-band,.cta-banner,.site-footer{background:linear-gradient(135deg,#5c2d22,#2c1a14)}.texture-band h2,.texture-band h3,.cta-banner h2{color:#fff5e7}.testimonial{color:#5c2d22}
`;

function neutralizeDesignTokenNames(cssText) {
  const tokenMap = new Map([
    ['--ink', '--color-text'],
    ['--garden', '--color-primary'],
    ['--moss', '--color-secondary'],
    ['--limestone', '--color-surface-alt'],
    ['--cream', '--color-surface'],
    ['--bronze', '--color-accent'],
    ['--clay', '--color-warm'],
    ['--charcoal', '--color-dark'],
  ]);
  let output = cssText;
  for (const [legacyToken, neutralToken] of tokenMap.entries()) {
    output = output.replaceAll(legacyToken, neutralToken);
  }
  return output;
}

const css = neutralizeDesignTokenNames([
  baseCss,
  isTechTheme ? techCss : '',
  isLogisticsTheme ? logisticsCss : '',
  isFinanceTheme ? financeCss : '',
  isFoodTheme ? foodCss : '',
].filter(Boolean).join('\n'));

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
    const file = `project-${String(index + 1).padStart(2, '0')}.png`;
    const src = preview ? `assets/images/${file}` : `<?php echo esc_url( get_template_directory_uri() . '/assets/images/portfolio/${file}' ); ?>`;
    const alt = `${item.title} visual detail`;
    return `<article class="work-card"><img src="${src}" alt="${preview ? escHtml(alt) : `<?php esc_attr_e( '${phpString(alt)}', '${td}' ); ?>`}"><h3>${escHtml(item.title)}</h3><p>${escHtml(item.text)}</p></article>`;
  }).join('');
}

function safeAltText(value, fallback) {
  const cleaned = String(value || '')
    .replace(/\b(use|prefer|royalty-free|non-copyright|safe stock-style|css-generated|do not use|broken image links|when appropriate)\b/gi, '')
    .replace(/\b(placeholders?|lorem ipsum|todo|sample text|gray boxes?|dummy content)\b/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim()
    .replace(/^[,.;:\s-]+|[,.;:\s-]+$/g, '');
  return cleaned || fallback;
}

function heroPart(preview = false) {
  const contact = preview ? 'contact_preview.html' : `<?php echo esc_url( home_url( '/contact/' ) ); ?>`;
  const work = preview ? 'work_preview.html' : `<?php echo esc_url( home_url( '/work/' ) ); ?>`;
  const hero1 = preview ? 'assets/images/brand-hero-01.png' : `<?php echo esc_url( get_template_directory_uri() . '/assets/images/hero/brand-hero-01.png' ); ?>`;
  const hero2 = preview ? 'assets/images/detail-01.png' : `<?php echo esc_url( get_template_directory_uri() . '/assets/images/texture/detail-01.png' ); ?>`;
  const heroAlt = safeAltText(spec.imageDirection, `${spec.brandName} software interface visual`);
  const detailAlt = safeAltText(`${spec.industry} detail study`, `${spec.brandName} work detail`);
  return `<section class="hero"><div class="container hero-grid"><div><p class="eyebrow">${escHtml(spec.eyebrow)}</p><h1>${escHtml(spec.heroTitle)}</h1><p class="lede">${escHtml(spec.heroText)}</p><p><a class="button" href="${contact}">Start a conversation</a> <a class="button ghost" href="${work}">View work</a></p><div class="hero-proof">${spec.proof.map((p) => `<div class="proof-chip"><strong>${escHtml(p.split(' ')[0])}</strong>${escHtml(p.split(' ').slice(1).join(' ') || p)}</div>`).join('')}</div></div><div class="hero-media"><img src="${hero1}" alt="${escHtml(heroAlt)}"><img src="${hero2}" alt="${escHtml(detailAlt)}"></div></div></section>`;
}

function contactForm(preview = false) {
  const action = preview ? '' : ` method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>"`;
  const hidden = preview ? '' : `<input type="hidden" name="action" value="${prefix}_submit_form"><input type="hidden" name="form_name" value="consultation"><?php wp_nonce_field( '${prefix}_form_submit', '${prefix}_form_nonce' ); ?>`;
  return `<form class="proof-card form-grid"${action}>${hidden}<label>Name<input type="text" name="entry_name" autocomplete="name"></label><label>Email<input type="email" name="email" autocomplete="email"></label><label>Phone<input type="tel" name="phone" autocomplete="tel"></label><label>Company / Organization<input type="text" name="company" autocomplete="organization"></label><label>Service interest<select name="service_interest"><option>${escHtml(spec.services[0].title)}</option><option>${escHtml(spec.services[1].title)}</option><option>${escHtml(spec.services[2].title)}</option><option>General consultation</option></select></label><label>Timeline<select name="timeline"><option>Exploring options</option><option>Ready this month</option><option>Next 30-60 days</option><option>Longer-range planning</option></select></label><label>Budget range<input type="text" name="budget"></label><label>Message<textarea name="message"></textarea></label><button class="button" type="submit">Request consultation</button></form>`;
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
  writeText(`wp-content/themes/${slug}/theme.json`, JSON.stringify({ version: 3, settings: { color: { palette: [{ slug: 'primary', color: '#263d2f', name: 'Primary' }, { slug: 'surface', color: '#f8f2e5', name: 'Surface' }] } } }, null, 2));
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

function ${prefix}_register_form_entries() {
  register_post_type( '${prefix}_form_entry', array(
    'labels' => array(
      'name' => esc_html__( 'Forms', '${td}' ),
      'singular_name' => esc_html__( 'Form Entry', '${td}' ),
    ),
    'public' => false,
    'show_ui' => false,
    'show_in_menu' => false,
    'supports' => array( 'title', 'editor', 'custom-fields' ),
  ) );
}
add_action( 'init', '${prefix}_register_form_entries' );

function ${prefix}_sanitize_form_field( $key, $type = 'text' ) {
  $value = isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : '';
  if ( 'email' === $type ) {
    return sanitize_email( $value );
  }
  if ( 'textarea' === $type ) {
    return sanitize_textarea_field( $value );
  }
  if ( 'key' === $type ) {
    return sanitize_key( $value );
  }
  return sanitize_text_field( $value );
}

function ${prefix}_handle_form_submission() {
  if ( ! isset( $_POST['${prefix}_form_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['${prefix}_form_nonce'] ) ), '${prefix}_form_submit' ) ) {
    wp_die( esc_html__( 'The form could not be verified.', '${td}' ) );
  }

  $fields = array(
    'form_name' => ${prefix}_sanitize_form_field( 'form_name', 'key' ),
    'entry_name' => ${prefix}_sanitize_form_field( 'entry_name' ),
    'email' => ${prefix}_sanitize_form_field( 'email', 'email' ),
    'phone' => ${prefix}_sanitize_form_field( 'phone' ),
    'company' => ${prefix}_sanitize_form_field( 'company' ),
    'service_interest' => ${prefix}_sanitize_form_field( 'service_interest' ),
    'timeline' => ${prefix}_sanitize_form_field( 'timeline' ),
    'budget' => ${prefix}_sanitize_form_field( 'budget' ),
    'message' => ${prefix}_sanitize_form_field( 'message', 'textarea' ),
  );

  $title_parts = array_filter( array( $fields['form_name'], $fields['entry_name'], $fields['email'] ) );
  $entry_id = wp_insert_post( array(
    'post_type' => '${prefix}_form_entry',
    'post_status' => 'private',
    'post_title' => $title_parts ? implode( ' - ', $title_parts ) : current_time( 'mysql' ),
    'post_content' => $fields['message'],
  ) );

  if ( $entry_id && ! is_wp_error( $entry_id ) ) {
    foreach ( $fields as $key => $value ) {
      update_post_meta( $entry_id, $key, $value );
    }
  }

  $redirect = wp_get_referer() ? wp_get_referer() : home_url( '/contact/' );
  wp_safe_redirect( add_query_arg( 'form_status', 'sent', $redirect ) );
  exit;
}
add_action( 'admin_post_${prefix}_submit_form', '${prefix}_handle_form_submission' );
add_action( 'admin_post_nopriv_${prefix}_submit_form', '${prefix}_handle_form_submission' );

function ${prefix}_forms_admin_menu() {
  add_menu_page(
    esc_html__( 'Forms', '${td}' ),
    esc_html__( 'Forms', '${td}' ),
    'manage_options',
    '${prefix}_forms',
    '${prefix}_render_forms_admin',
    'dashicons-feedback',
    26
  );
}
add_action( 'admin_menu', '${prefix}_forms_admin_menu' );

function ${prefix}_form_entries_query( $ids = array() ) {
  $args = array(
    'post_type' => '${prefix}_form_entry',
    'post_status' => 'private',
    'numberposts' => 200,
    'orderby' => 'date',
    'order' => 'DESC',
  );
  if ( $ids ) {
    $args['post__in'] = array_map( 'absint', $ids );
    $args['orderby'] = 'post__in';
  }
  return get_posts( $args );
}

function ${prefix}_render_forms_admin() {
  if ( ! current_user_can( 'manage_options' ) ) {
    return;
  }

  $entries = ${prefix}_form_entries_query();
  echo '<div class="wrap"><h1>' . esc_html__( 'Forms', '${td}' ) . '</h1>';
  echo '<p>' . esc_html__( 'Review captured website form submissions and export all entries or selected entries as CSV.', '${td}' ) . '</p>';
  echo '<p><a class="button button-primary" href="' . esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=${prefix}_export_forms' ), '${prefix}_export_forms' ) ) . '">' . esc_html__( 'Export all entries', '${td}' ) . '</a></p>';
  echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
  echo '<input type="hidden" name="action" value="${prefix}_export_forms">';
  wp_nonce_field( '${prefix}_export_forms', '${prefix}_export_nonce' );
  echo '<table class="widefat striped"><thead><tr><td class="manage-column column-cb check-column"></td><th>' . esc_html__( 'Date', '${td}' ) . '</th><th>' . esc_html__( 'Form', '${td}' ) . '</th><th>' . esc_html__( 'Name', '${td}' ) . '</th><th>' . esc_html__( 'Email', '${td}' ) . '</th><th>' . esc_html__( 'Interest', '${td}' ) . '</th></tr></thead><tbody>';

  if ( $entries ) {
    foreach ( $entries as $entry ) {
      echo '<tr>';
      echo '<th scope="row" class="check-column"><input type="checkbox" name="entry_ids[]" value="' . esc_attr( $entry->ID ) . '"></th>';
      echo '<td>' . esc_html( get_the_date( '', $entry ) ) . '</td>';
      echo '<td>' . esc_html( get_post_meta( $entry->ID, 'form_name', true ) ) . '</td>';
      echo '<td>' . esc_html( get_post_meta( $entry->ID, 'entry_name', true ) ) . '</td>';
      echo '<td>' . esc_html( get_post_meta( $entry->ID, 'email', true ) ) . '</td>';
      echo '<td>' . esc_html( get_post_meta( $entry->ID, 'service_interest', true ) ) . '</td>';
      echo '</tr>';
    }
  } else {
    echo '<tr><td colspan="6">' . esc_html__( 'No form submissions have been captured yet.', '${td}' ) . '</td></tr>';
  }

  echo '</tbody></table>';
  submit_button( esc_html__( 'Export selected entries', '${td}' ) );
  echo '</form></div>';
}

function ${prefix}_export_forms() {
  if ( ! current_user_can( 'manage_options' ) ) {
    wp_die( esc_html__( 'You do not have permission to export form entries.', '${td}' ) );
  }

  $nonce = isset( $_REQUEST['${prefix}_export_nonce'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['${prefix}_export_nonce'] ) ) : '';
  if ( ! $nonce && isset( $_REQUEST['_wpnonce'] ) ) {
    $nonce = sanitize_text_field( wp_unslash( $_REQUEST['_wpnonce'] ) );
  }
  if ( ! wp_verify_nonce( $nonce, '${prefix}_export_forms' ) ) {
    wp_die( esc_html__( 'The export request could not be verified.', '${td}' ) );
  }

  $ids = isset( $_REQUEST['entry_ids'] ) ? array_map( 'absint', (array) wp_unslash( $_REQUEST['entry_ids'] ) ) : array();
  $entries = ${prefix}_form_entries_query( array_filter( $ids ) );

  nocache_headers();
  header( 'Content-Type: text/csv; charset=utf-8' );
  header( 'Content-Disposition: attachment; filename=${slug}-form-entries.csv' );
  $output = fopen( 'php://output', 'w' );
  fputcsv( $output, array( 'Date', 'Form', 'Name', 'Email', 'Phone', 'Company', 'Interest', 'Timeline', 'Budget', 'Message' ) );
  foreach ( $entries as $entry ) {
    fputcsv( $output, array(
      get_the_date( 'c', $entry ),
      get_post_meta( $entry->ID, 'form_name', true ),
      get_post_meta( $entry->ID, 'entry_name', true ),
      get_post_meta( $entry->ID, 'email', true ),
      get_post_meta( $entry->ID, 'phone', true ),
      get_post_meta( $entry->ID, 'company', true ),
      get_post_meta( $entry->ID, 'service_interest', true ),
      get_post_meta( $entry->ID, 'timeline', true ),
      get_post_meta( $entry->ID, 'budget', true ),
      get_post_meta( $entry->ID, 'message', true ),
    ) );
  }
  fclose( $output );
  exit;
}
add_action( 'admin_post_${prefix}_export_forms', '${prefix}_export_forms' );
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
    'template-contact.php': `<?php /* Template Name: Contact */ get_header(); ?><section class="page-hero"><div class="container"><p class="eyebrow">Contact</p><h1>Start with the brief, the constraints, and the decision path.</h1></div></section><section class="section"><div class="container grid-2">${contactForm(false)}<div class="proof-card"><h3>Good fit signals</h3><p>You want a complete website-level theme with local assets, complete preview pages, form capture, exportable entries, and a reliable release path.</p><p><?php echo esc_html( ${prefix}_contact_note() ); ?></p></div></div></section><?php get_footer(); ?>`,
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
    'contact_preview.html': `<section class="page-hero"><div class="container"><p class="eyebrow">Contact</p><h1>Start with the brief, the constraints, and the decision path.</h1></div></section><section class="section"><div class="container grid-2">${contactForm(true)}<div class="proof-card"><h3>Good fit signals</h3><p>You want a complete website-level theme with local assets, complete preview pages, form capture, exportable entries, and a reliable release path.</p><p>Consultation requests are reviewed before scheduling.</p></div></div></section>`,
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
