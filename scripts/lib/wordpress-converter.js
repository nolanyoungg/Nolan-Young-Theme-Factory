'use strict';
// Loaded only by explicit conversion/WordPress packaging commands.
const { fs, path, ROOT, readJson, writeJson, requireSlug, sampleDir, nextSlug, treeHash, ensureDir, walk, relative, assertStatus, titleFromSlug } = require('./workspace');
const { validateStatic } = require('./static-validation');
const { runCodex } = require('./codex');
const { runNpm } = require('./npm');
const { spawnSync } = require('node:child_process');
const legacy = require('../legacy-wordpress');
function destinations(args) {
  if (args.mode !== 'codex-only') throw new Error('WordPress conversion supports only --mode codex-only. Static Ollama/LM Studio generation remains available.');
  const sampleSlug = requireSlug(args.sampleSlug); const source = sampleDir(sampleSlug);
  if (!fs.existsSync(path.join(source, 'sample.json')) || readJson(path.join(source, 'sample.json')).schema !== 'static-v1') throw new Error('Conversion requires an existing static-v1 sample. Historical rendered previews are not conversion sources.');
  const outputSlug = args.outputSlug ? requireSlug(args.outputSlug) : nextSlug(`${sampleSlug.replace(/^\d+_nolan_young_theme_/, '')}_wordpress`);
  const theme = path.join(ROOT, 'wp-content/themes', outputSlug);
  const zip = path.join(ROOT, 'dist/zipped-themes', `${outputSlug}.zip`);
  const report = path.join(ROOT, 'reports/conversions', outputSlug);
  for (const file of [theme, zip, report, sampleDir(outputSlug)]) if (fs.existsSync(file)) throw new Error(`Output collision: ${relative(file)}. Conversion never overwrites existing output.`);
  return { sampleSlug, source, outputSlug, theme, zip, report };
}
function validateConverted(theme) {
  const errors = [];
  const required = ['style.css', 'functions.php', 'index.php', 'page.php', 'header.php', 'footer.php', 'front-page.php', 'README.md', 'assets/css/bundle.css', 'assets/js/bundle.js', ...legacy.PREVIEW_PAGES.map(([, p]) => p)];
  for (const name of new Set(required)) if (!fs.existsSync(path.join(theme, name)) || !fs.statSync(path.join(theme, name)).size) errors.push(`Missing or empty conversion file: ${name}`);
  for (const file of walk(theme).filter(f => f.endsWith('.php'))) {
    const lint = spawnSync('php', ['-l', file], { encoding: 'utf8' });
    if (lint.status !== 0) errors.push(`PHP lint ${relative(file)}: ${lint.stderr || lint.stdout}`);
    if (/\b(?:include|require)(?:_once)?\s*\(?\s*['"][^'"]*\.html/.test(fs.readFileSync(file, 'utf8'))) errors.push('Conversion may not include HTML files as its implementation.');
  }
  const read = name => fs.existsSync(path.join(theme, name)) ? fs.readFileSync(path.join(theme, name), 'utf8') : '';
  for (const field of ['Theme Name', 'Description', 'Text Domain', 'Version']) if (!new RegExp(`^${field}:\\s*\\S`, 'm').test(read('style.css'))) errors.push(`Missing WordPress metadata: ${field}`);
  for (const api of ['wp_enqueue_style', 'wp_enqueue_script', 'add_action']) if (!read('functions.php').includes(api)) errors.push(`Missing WordPress asset integration: ${api}`);
  for (const [file, api] of [['header.php', 'wp_head'], ['footer.php', 'wp_footer'], ['page.php', 'the_content']]) if (!templateUses(theme, file, api)) errors.push(`${file} must use ${api}() directly or through an existing literal template part`);
  return { status: errors.length ? 'failed' : 'passed', errors, scope: 'PHP syntax, required files, metadata and WordPress integration contracts; not a WordPress runtime test' };
}
// Follow literal WordPress template-part edges, not unrelated PHP files. Dynamic
// dispatch still requires runtime review; missing parts cannot satisfy a contract.
function templateUses(theme, name, api, visited = new Set()) {
  const file = path.resolve(theme, name);
  if (!file.startsWith(path.resolve(theme) + path.sep) || visited.has(file) || !fs.existsSync(file)) return false;
  visited.add(file);
  const source = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  if (new RegExp(`\\b${api}\\s*\\(`).test(source)) return true;
  for (const match of source.matchAll(/\bget_template_part\s*\(\s*['"]([^'"]+)['"]\s*(?:,\s*['"]([^'"]*)['"])?\s*\)/g)) {
    const candidates = match[2] ? [`${match[1]}-${match[2]}.php`, `${match[1]}.php`] : [`${match[1]}.php`];
    const part = candidates.find(p => fs.existsSync(path.join(theme, p)));
    if (part && templateUses(theme, part, api, visited)) return true;
  }
  return false;
}
async function convert(args) {
  if (args.resumeChecks) return resumeChecks(args);
  const d = destinations(args); const inputValidation = validateStatic(d.source);
  if (inputValidation.errors.length) throw new Error(`Selected static sample is invalid: ${inputValidation.errors.join('; ')}`);
  const inputHash = treeHash(d.source);
  ensureDir(d.theme); ensureDir(d.report);
  fs.cpSync(path.join(d.source, 'assets'), path.join(d.theme, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(d.theme, 'style.css'), `/*\nTheme Name: ${titleFromSlug(d.outputSlug)}\nDescription: WordPress conversion of ${d.sampleSlug}\nVersion: 1.0.0\nText Domain: ${d.outputSlug}\nLicense: GPL-2.0-or-later\n*/\n`);
  writeJson(path.join(d.theme, 'package.json'), { name: d.outputSlug.replace(/_/g, '-'), private: true, scripts: { build: 'node build.cjs' } });
  fs.writeFileSync(path.join(d.theme, 'build.cjs'), "const fs=require('node:fs');\nfs.copyFileSync('assets/css/site.css','assets/css/bundle.css');\nfs.copyFileSync('assets/js/site.js','assets/js/bundle.js');\n");
  const result = { schema: 'wordpress-conversion-v1', sampleSlug: d.sampleSlug, outputSlug: d.outputSlug, sourceHash: inputHash, mode: 'codex-only', generation: { status: 'pending' }, technicalValidation: { status: 'pending' }, harnessChecks: { status: 'pending' }, browserComparison: { status: 'pending' }, wordpressRuntime: { status: 'skipped', reason: 'No isolated WordPress runtime was supplied. PHP harness is not WordPress; activation, admin editing, actual enqueues, routing and plugin behavior remain unverified.' }, publication: { status: 'not-published' } };
  writeJson(path.join(d.report, 'conversion.config.json'), { ...result, sourcePath: relative(d.source), outputPath: relative(d.theme) });
  try {
    runCodex(d.theme, `Convert the existing selected static website at ${d.source} into a real CLASSIC WordPress theme in the current prepared theme directory. Read every source HTML/CSS/JS page; preserve its design, copy, approved image assets, navigation and demo interactions. This is one conversion generation pass. Edit ONLY this prepared WordPress theme. Never change the original static sample or any outside file. Do not create reports, previews, ZIPs, branches, commits, network requests, subagents or install dependencies. The runner performs deterministic checks afterward.
The prepared style.css metadata is the NEW output identity; preserve it. Approved assets are already copied. Preserve all images and asset-manifest.json unchanged; their source sample attribution is intentional. Existing assets/css/site.css and assets/js/site.js contain the original design. The prepared dependency-free build copies them to bundle.css/bundle.js. Keep that build contract and run npm run build once at the end.
Create functions.php with prefixed helpers, after_setup_theme support and wp_enqueue_scripts using get_theme_file_uri and wp_enqueue_style/wp_enqueue_script for the bundles. Create header.php/footer.php using language_attributes, wp_head, wp_body_open, body_class, wp_footer. Use WordPress APIs for safe URLs (home_url/get_theme_file_uri), escaping and navigation (registered menu with an original-design fallback). Do not merely rename HTML to PHP or include HTML source. Share common header/footer and template parts. Avoid custom post types/taxonomies, automatic database mutation on activation or external form submissions.
Required templates: index.php, page.php (normal WordPress loop with the_content for editable pages), front-page.php, ${legacy.PREVIEW_PAGES.slice(2).map(([, p]) => p).join(', ')}. Give page templates WordPress Template Name headers. Home and the seven designed page templates retain original static content as initial template content. Make practical content editable through standard WordPress APIs, and document exactly what stays in templates. If using theme options, implement their real Customizer/admin registration and sanitize/escape values. Do not invent missing helpers.
The preview harness maps /, /about/, /services/, /work/, /blog/, /contact/, /privacy-policy/ and /services/featured/ to the existing HTML filenames. Use these WordPress paths consistently. In real WordPress document which pages/slugs/templates to create and how to assign front page and menus; never assume pages auto-exist. README.md must explain installation, editing, remaining static template content, demo-only forms, and runtime verification limitations. Use the original responsive CSS/JS unchanged wherever possible; update only necessary URL/integration differences. All source functions/files/assets must exist. No fallback fixes will be made by the repository agent.`, args, d.report);
    result.generation.status = 'passed';
    writeJson(path.join(d.report, 'source-checkpoint.json'), { themeHash: treeHash(d.theme), sourceHash: inputHash });
    await finishChecks(d, result);
  } catch (error) { result.status = 'failed'; result.error = error.message; if (result.generation.status === 'pending') result.generation.status = 'failed'; throw error;
  } finally {
    result.originalSampleUnchanged = treeHash(d.source) === inputHash;
    writeJson(path.join(d.report, 'conversion.result.json'), result);
  }
  console.log(`Converted locally: ${relative(d.theme)}\nZIP: ${relative(d.zip)}\nCompare desktop/mobile previews in ${relative(d.report)}. WordPress runtime checks remain separate.`);
  return result;
}

async function finishChecks(d, result) {
    if (treeHash(d.source) !== result.sourceHash) throw new Error('Original static sample changed during conversion.');
    const manifestPath = 'assets/images/asset-manifest.json';
    const approved = readJson(path.join(d.source, manifestPath));
    for (const name of [manifestPath, ...approved.assets.map(a => a.file)]) {
      if (!fs.existsSync(path.join(d.theme, name)) || !fs.readFileSync(path.join(d.source, name)).equals(fs.readFileSync(path.join(d.theme, name)))) throw new Error(`Conversion changed protected approved asset: ${name}`);
    }
    assertStatus(runNpm(['run', 'build'], { cwd: d.theme, encoding: 'utf8' }), 'Converted WordPress asset build');
    result.build = { status: 'passed', type: 'dependency-free asset copy' };
    result.technicalValidation = validateConverted(d.theme);
    if (result.technicalValidation.errors.length) throw new Error(result.technicalValidation.errors.join('\n'));
    const preview = path.join(d.report, 'preview'); ensureDir(preview);
    fs.cpSync(path.join(d.theme, 'assets'), path.join(preview, 'assets'), { recursive: true });
    for (const [name, template] of legacy.PREVIEW_PAGES) fs.writeFileSync(path.join(preview, name), legacy.renderTemplate(d.theme, template, { emptyDatabase: true }));
    result.harnessChecks = validateStatic(preview, { legacy: true });
    if (result.harnessChecks.errors.length) throw new Error(result.harnessChecks.errors.join('\n'));
    legacy.packageTheme(d.outputSlug);
    const entries = legacy.listZipEntries(d.zip);
    const missing = walk(d.theme).map(f => `${d.outputSlug}/${path.relative(d.theme, f).replace(/\\/g, '/')}`).filter(f => !entries.includes(f));
    if (missing.length) throw new Error(`ZIP is missing source files: ${missing.join(', ')}`);
    result.packaging = { status: 'passed', path: relative(d.zip), entries: entries.length };
    result.themePath = relative(d.theme); result.previewPath = relative(preview); result.themeHash = treeHash(d.theme);
    result.status = 'awaiting-browser-comparison';
}
async function resumeChecks(args) {
  if (args.mode !== 'codex-only' || !args.outputSlug) throw new Error('Deterministic conversion checks require --mode codex-only and --output-slug.');
  const outputSlug = requireSlug(args.outputSlug); const sampleSlug = requireSlug(args.sampleSlug);
  const d = { outputSlug, sampleSlug, source: sampleDir(sampleSlug), theme: path.join(ROOT, 'wp-content/themes', outputSlug), report: path.join(ROOT, 'reports/conversions', outputSlug), zip: path.join(ROOT, 'dist/zipped-themes', outputSlug + '.zip') };
  const file = path.join(d.report, 'conversion.result.json'); const result = readJson(file); const checkpoint = readJson(path.join(d.report, 'source-checkpoint.json'));
  if (result.generation.status !== 'passed' || result.sampleSlug !== sampleSlug || result.outputSlug !== outputSlug || treeHash(d.theme) !== checkpoint.themeHash || treeHash(d.source) !== checkpoint.sourceHash) throw new Error('Conversion checkpoint mismatch or incomplete generation; no checks resumed.');
  if (fs.existsSync(d.zip)) throw new Error('ZIP already exists; deterministic checks never overwrite packages.');
  writeJson(path.join(d.report, 'checks-before-' + Date.now() + '.json'), result);
  delete result.error;
  try { await finishChecks(d, result); }
  catch (error) { result.status = 'failed'; result.error = error.message; throw error; }
  finally { result.originalSampleUnchanged = treeHash(d.source) === result.sourceHash; result.checksResumedWithoutAI = true; writeJson(file, result); }
  console.log('Deterministic conversion checks complete: ' + outputSlug); return result;
}

function packageSelected(args) {
  const slug = requireSlug(args.themeSlug); const report = path.join(ROOT, 'reports/conversions', slug, 'conversion.result.json');
  if (!fs.existsSync(report)) throw new Error('WordPress packaging requires an explicit conversion record. Legacy ZIPs are preserved.');
  const result = readJson(report); const dir = path.join(ROOT, 'wp-content/themes', slug);
  if (result.themeHash !== treeHash(dir)) throw new Error('Converted source changed since validation.');
  if (fs.existsSync(path.join(ROOT, 'dist/zipped-themes', `${slug}.zip`))) throw new Error('ZIP already exists; refusing overwrite.');
  legacy.packageTheme(slug);
}
module.exports = { convert, destinations, validateConverted, packageSelected, templateUses };
