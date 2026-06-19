#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const [themeSlug, promptFile, model = 'qwen2.5-coder:14b'] = process.argv.slice(2);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', shell: process.platform === 'win32', ...options });
  if (result.stdout && options.echo !== false) process.stdout.write(result.stdout);
  if (result.stderr && options.echo !== false) process.stderr.write(result.stderr);
  return result;
}

function ensureModel() {
  const list = run('ollama', ['list'], { echo: false });
  if (list.status !== 0) fail('ollama command is unavailable or did not respond to ollama list.');
  const installed = (list.stdout || '').split(/\r?\n/).slice(1).map((line) => line.trim().split(/\s+/)[0]).filter(Boolean);
  if (!installed.includes(model)) fail(`Ollama model is not installed: ${model}`);
}

function createBrief() {
  const result = run('node', ['scripts/create-theme-generation-brief.js', themeSlug, promptFile, 'ollama-only'], { echo: false });
  if (result.status !== 0) fail('Generation brief creation failed.');
  return result.stdout.trim();
}

function applyOutput(rawOutput, themeTarget) {
  const result = run('node', ['scripts/apply-theme-file-blocks.js', rawOutput, themeTarget]);
  if (result.status !== 0) fail(`Could not apply Ollama output: ${rawOutput}`);
}

function batchPrompt(brief, batchName, files, focus) {
  return `You are editing a prepared WordPress theme folder.

Target folder:
wp-content/themes/${themeSlug}/

You must generate only files inside that folder. Paths in your response must be relative to that folder.

Creative brief:
${brief}

Batch focus:
${focus}

Return JSON only. Markdown fences are acceptable if they contain only JSON.

Schema:
{
  "files": [
    {
      "path": "relative/path.php",
      "content_lines": [
        "line 1",
        "line 2"
      ]
    }
  ]
}

Required files for this batch:
${files}

Rules:
- Write complete file contents, not patches.
- Keep paths relative to wp-content/themes/${themeSlug}/.
- Do not write style.css; WordPress theme metadata is prepared before this AI pass.
- Do not use absolute paths.
- Do not use ..
- Do not use CDN URLs, remote scripts, Google Fonts, remote images, or external links.
- Do not write http:// or https:// URLs anywhere. Use # for social links or inactive external labels.
- Use local assets, inline SVG, CSS-generated interface graphics, and theme files.
- Do not include secrets, tokens, passwords, or API keys.
- Replace Lorem ipsum in files you write.
- Do not write TODO comments, placeholder comments, "Add ... here" comments, empty cards, empty sections, or instructions for a future editor.
- Every section you create must include finished copy and visible content appropriate to the selected creative prompt.
- header.php and footer.php must not include a standalone ?> line after an inline PHP comment.
- Preserve WordPress PHP syntax.

Fragment rules:
- Template-parts are fragments only: never call get_header(), get_footer(), wp_head(), wp_footer(), or output <!doctype>, <html>, <head>, or <body> wrappers inside template-parts files.
- header.php and footer.php are the only files that may contain full document wrappers; they must be complete and valid.
- If you reference an image or icon, ensure the file exists inside the theme. Prefer assets/images/placeholder.svg and assets/icons/icon1.svg when no custom media exists yet.
- Do not write broken partial anchors, truncated links, stray closing tags, or partial JSON fragments into PHP files.

- For PHP template files with HTML, use this valid structure:
  1. Start with <?php and any template comments.
  2. Call get_header(); while inside PHP.
  3. Close PHP with ?> before writing HTML.
  4. Reopen <?php only for WordPress function calls.
  5. Reopen PHP at the end and call get_footer();.
- Never write raw HTML while a PHP block is still open.
- Never write stray words, labels, or partial JSON fragments into PHP files.
`;
}

function runBatch(brief, generationDir, batchName, files, focus) {
  const runPrompt = path.join(generationDir, `ollama-${batchName}-prompt.md`);
  const rawOutput = path.join(generationDir, `ollama-${batchName}-raw.md`);
  fs.writeFileSync(runPrompt, batchPrompt(brief, batchName, files, focus), 'utf8');
  console.log(`Running Ollama batch: ${batchName}`);
  const result = run('ollama', ['run', model, '--format', 'json', '--nowordwrap'], {
    input: fs.readFileSync(runPrompt, 'utf8'),
    echo: false,
    env: { ...process.env, OLLAMA_NOHISTORY: '1' }
  });
  fs.writeFileSync(rawOutput, `${result.stdout || ''}${result.stderr || ''}`, 'utf8');
  if (result.status !== 0) fail(`Ollama batch failed: ${batchName}`);
  applyOutput(rawOutput, `wp-content/themes/${themeSlug}`);
}

if (!themeSlug || !promptFile) fail('Usage: node scripts/run-ollama-theme-pass.js <theme-slug> <prompt-file> [model]');
if (!/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(themeSlug)) fail(`Invalid theme slug: ${themeSlug}`);
if (promptFile.includes('..')) fail('Unsafe prompt path.');
if (!fs.existsSync(path.join(root, 'wp-content', 'themes', themeSlug))) fail(`Theme folder missing: wp-content/themes/${themeSlug}`);
if (!fs.existsSync(path.join(root, promptFile))) fail(`Prompt file missing: ${promptFile}`);

ensureModel();
const briefPath = createBrief();
const brief = fs.readFileSync(path.join(root, briefPath), 'utf8');
const generationDir = path.join(root, 'reports', 'runs', themeSlug, 'ollama-generation');
fs.mkdirSync(generationDir, { recursive: true });

console.log(`Running Ollama model: ${model}`);
runBatch(brief, generationDir, 'shell',
  '- README.md\n- header.php\n- footer.php\n- front-page.php',
  'Create the brand shell described by the creative prompt. Build the responsive header, footer, README content, and homepage structure exactly around the requested business identity, navigation, dropdown behavior, page goals, sections, and calls to action; do not leave comments that ask someone to add those pieces later. Keep header.php and footer.php complete, and do not place fragment-only markup into template-parts files in this batch.');
runBatch(brief, generationDir, 'template-parts',
  '- template-parts/content-hero.php\n- template-parts/content-brand-statement.php\n- template-parts/content-featured-work.php\n- template-parts/content-all-services.php\n- template-parts/content-single-service-highlight.php\n- template-parts/content-process.php\n- template-parts/content-style-pillars.php\n- template-parts/content-testimonials.php\n- template-parts/content-blog-preview.php\n- template-parts/content-cta-banner.php\n- template-parts/content-footer-widgets.php',
  'Create reusable homepage and site sections that match the selected creative prompt, including the requested copy, services or offerings, proof, process, work examples, testimonials, FAQ-style content where appropriate, and CTAs. These files are fragments only; do not add get_header(), get_footer(), wp_head(), wp_footer(), <!doctype>, <html>, <head>, or <body> wrappers.');
runBatch(brief, generationDir, 'pages',
  '- page-templates/template-about-us.php\n- page-templates/template-services.php\n- page-templates/template-single-service.php\n- page-templates/template-work.php\n- page-templates/template-blog.php\n- page-templates/template-contact.php\n- page-templates/template-policy.php\n- page.php\n- single.php\n- archive.php\n- search.php\n- 404.php\n- 403.php',
  'Create page templates and standard WordPress templates with unique page intent for about, services, individual services, work/case studies, resources, contact, policy, search, archive, and error states. These are full page templates, so keep their document wrapper logic in the theme root files, not in template-parts.');
runBatch(brief, generationDir, 'assets',
  '- assets/css/bundle.css\n- assets/js/bundle.js\n- src/js/main.js\n- src/scss/main.scss\n- assets/icons/icon1.svg',
  'Create the visual system, responsive layout, header interaction JavaScript, scroll animation hooks, local SVG logo/icon, and source mirrors requested by the creative prompt. Avoid starter CSS; write a complete responsive visual system that styles the actual generated sections. If the prompt needs imagery but no matching source asset exists yet, generate local SVG placeholders or reusable CSS shapes instead of inventing broken file paths.');
runBatch(brief, generationDir, 'forms-helpers',
  '- inc/forms.php\n- inc/newsletter.php\n- inc/helpers.php\n- inc/custom-post-types.php\n- inc/customizer.php\n- inc/policy-routing.php\n- comments.php\n- searchform.php',
  'Create practical WordPress helper code, form handling/admin menu scaffolding, newsletter helper, custom post type setup, policy routing, comments, and search form code without external dependencies. Do not use Lorem ipsum in comments.php or searchform.php.');

console.log(`Ollama theme pass complete for ${themeSlug}`);
