'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const { scaffold } = require('../lib/static-scaffold');
const { validateStatic } = require('../lib/static-validation');
const { LOCAL_MODEL_STAGES, validateStagePolicies, validateLocalModelPlan } = require('../lib/local-model/stages');
const { LocalModelAgent } = require('../lib/local-model/agent');
const { PAGES, treeHash, writeJson } = require('../lib/workspace');
const { readReview } = require('../lib/review');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'static-factory-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const dir = path.join(root, '001_nolan_young_theme_fixture'); scaffold(dir, path.basename(dir));
  fs.mkdirSync(path.join(dir, 'assets/images'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'assets/images/mark.svg'), '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  const a = Object.fromEntries(['id','source','source_url','license','license_url','creator','creator_url','acquired_at','allowed_use','theme_slug','alt_text','notes'].map(k => [k, 'fixture']));
  a.file = 'assets/images/mark.svg'; writeJson(path.join(dir, 'assets/images/asset-manifest.json'), { assets: [a] });
  for (const page of PAGES) fs.writeFileSync(path.join(dir, page), `<!doctype html><html lang="en"><head><title>Fixture</title><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="assets/css/site.css"></head><body><nav><a href="about-us_preview.html#team">About</a></nav><main><h1 id="team">Team</h1><img src="assets/images/mark.svg" alt="Mark"></main><script src="assets/js/site.js"></script></body></html>`);
  return { root, dir };
}
test('static validator resolves required pages, resources and fragments without modifying output', t => {
  const { dir } = fixture(t); const before = treeHash(dir);
  assert.equal(validateStatic(dir).status, 'passed'); assert.equal(treeHash(dir), before);
  fs.appendFileSync(path.join(dir, 'index.html'), '<a href="about-us_preview.html#missing">Bad fragment</a><img src="missing.jpg" alt="Missing"><link rel="stylesheet" href="https://example.test/x.css"><a href="../escape.html">Escape</a>');
  const failures = validateStatic(dir).errors.join('\n');
  assert.match(failures, /Missing fragment/); assert.match(failures, /Missing or empty target/); assert.match(failures, /Unapproved remote resource/); assert.match(failures, /escapes/);
});
test('static validator rejects PHP/private artifacts, unapproved images, broken srcset and CSS URLs', t => {
  const { dir } = fixture(t);
  fs.writeFileSync(path.join(dir, 'functions.php'), '<?php');
  fs.writeFileSync(path.join(dir, 'provider.json'), '{"model":"private"}');
  fs.writeFileSync(path.join(dir, 'assets/images/unapproved.svg'), '<svg/>');
  fs.appendFileSync(path.join(dir, 'index.html'), '<img src="assets/images/unapproved.svg" srcset="missing.jpg 2x" alt="Example">');
  fs.appendFileSync(path.join(dir, 'assets/css/site.css'), 'body{background:url(no.jpg)}');
  const errors = validateStatic(dir).errors.join('\n');
  assert.match(errors, /Forbidden static output: functions.php/); assert.match(errors, /Unexpected public static file: provider.json/); assert.match(errors, /absent from approved manifest/); assert.match(errors, /missing.jpg/); assert.match(errors, /no.jpg/);
});
test('static scaffold collisions preserve previous output and stages have complete bounded ownership', t => {
  const { dir } = fixture(t); const before = treeHash(dir);
  assert.throws(() => scaffold(dir, path.basename(dir)), /collision/); assert.equal(treeHash(dir), before);
  assert.equal(LOCAL_MODEL_STAGES.length, 6); assert.equal(validateStagePolicies(), true);
  const brief = fs.readFileSync(path.resolve(__dirname, '../../prompts/pending/012-common-ground-static.md'), 'utf8');
  assert.equal(validateLocalModelPlan([...brief.matchAll(/^#{1,6}\s+(.+)$/gm)].map(m => m[1])).length, 6);
  assert.throws(() => validateLocalModelPlan(['Business Identity']), /no matching production prompt/);
  for (const stage of LOCAL_MODEL_STAGES) assert.ok(stage.write.every(p => !/php|scss|sample.json|manifest|images/.test(p)));
});
test('old local checkpoints fail clearly before provider invocation', t => {
  const { dir, root } = fixture(t); const reportDir = path.join(root, 'reports');
  writeJson(path.join(reportDir, 'local-model/session.json'), { version: 1, status: 'running' });
  const agent = new LocalModelAgent({ themeDir: dir, reportDir, prompt: 'brief', modelId: 'fixture', provider: { chatCompletion() { throw new Error('must not invoke'); } }, resumeLocal: true });
  assert.throws(() => agent.prepareSession(agent.buildSessionIdentity()), /Incompatible legacy checkpoint/);
});
test('missing browser tooling is skipped, never implicitly passed', t => {
  const { dir } = fixture(t); const review = readReview(null, dir);
  assert.equal(review.browserChecks.status, 'skipped'); assert.equal(review.visualReview.status, 'pending');
});
test('default static run cannot create WordPress artifacts or load PHP/conversion modules; resume is deterministic', async t => {
  const { root } = fixture(t);
  fs.cpSync(path.resolve(__dirname, '..'), path.join(root, 'scripts'), { recursive: true });
  const workflow = require(path.join(root, 'scripts/lib/static-workflow'));
  const workspace = require(path.join(root, 'scripts/lib/workspace'));
  const slug = '017_nolan_young_theme_static_contract';
  fs.writeFileSync(path.join(root, 'brief.md'), '# Business Identity\nFixture');
  writeJson(path.join(root, 'assets/manifests/test.json'), { approved: true, assets: [{ path: 'assets/icons/mark.svg', kind: 'local-svg-icon', role: 'Brand mark', alt: 'Brand mark' }] });
  let calls = 0;
  const result = await workflow.run({ mode: 'codex-only', prompt: 'brief.md', sampleSlug: slug, assetCatalog: 'assets/manifests/test.json' }, {
    modelCheck: async () => null,
    runCodex(dir) { calls++; for (const page of PAGES) fs.writeFileSync(path.join(dir, page), fs.readFileSync(path.join(dir, page), 'utf8').replace('<p data-scaffold>Replace this scaffold with a complete designed page.</p>', '<p>Completed example content</p>')); }
  });
  assert.equal(result.status, 'awaiting-review'); assert.equal(result.technicalValidation.status, 'passed');
  assert.equal(fs.existsSync(path.join(root, 'wp-content')), false); assert.equal(fs.existsSync(path.join(root, 'dist')), false);
  assert.ok(!Object.keys(require.cache).some(f => f.startsWith(root) && /wordpress|validation\.js$/.test(f) && !f.endsWith('static-validation.js')));
  await workflow.dispatch('resume', { sampleSlug: slug }); assert.equal(calls, 1);
  await assert.rejects(workflow.run({ mode: 'codex-only', prompt: 'brief.md', sampleSlug: slug }), /already attempted/);
  fs.appendFileSync(path.join(workspace.sampleDir(slug), 'index.html'), '<p>Changed</p>');
  assert.throws(() => workflow.finish(slug, {}), /changed after generation/);
});
test('conversion rejects local modes and historical previews; WordPress command names are explicit', () => {
  const { destinations } = require('../lib/wordpress-converter');
  assert.throws(() => destinations({ mode: 'ollama-only', sampleSlug: '001_nolan_young_theme_fixture' }), /supports only/);
  assert.throws(() => destinations({ mode: 'codex-only', sampleSlug: '000_nolan_young_theme_master_template_prompt_filler_template_1' }), /existing static-v1/);
  const pkg = require('../../package.json'); assert.equal(pkg.scripts['theme:zip'], undefined); assert.ok(pkg.scripts['theme:convert:wordpress']);
});
test('conversion reserves a separate identity and rejects theme, report, sample and ZIP collisions without source changes', t => {
  const { root, dir } = fixture(t);
  fs.cpSync(path.resolve(__dirname, '..'), path.join(root, 'scripts'), { recursive: true });
  const converter = require(path.join(root, 'scripts/lib/wordpress-converter'));
  const slug = path.basename(dir); const dest = path.join(root, 'docs/Preview-Themes-Github', slug);
  fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.cpSync(dir, dest, { recursive: true });
  const before = treeHash(dest);
  const plan = converter.destinations({ mode: 'codex-only', sampleSlug: slug });
  assert.notEqual(plan.outputSlug, slug); assert.equal(treeHash(dest), before);
  for (const collision of [plan.theme, plan.report, path.join(root, 'docs/Preview-Themes-Github', plan.outputSlug)]) {
    fs.mkdirSync(collision, { recursive: true });
    assert.throws(() => converter.destinations({ mode: 'codex-only', sampleSlug: slug, outputSlug: plan.outputSlug }), /collision/);
    fs.rmdirSync(collision);
  }
  fs.mkdirSync(path.dirname(plan.zip), { recursive: true }); fs.writeFileSync(plan.zip, 'existing');
  assert.throws(() => converter.destinations({ mode: 'codex-only', sampleSlug: slug, outputSlug: plan.outputSlug }), /collision/);
  assert.equal(treeHash(dest), before);
});
test('all infrastructure JavaScript parses', () => {
  const { walk } = require('../lib/workspace');
  for (const file of walk(path.resolve(__dirname, '..')).filter(f => f.endsWith('.js'))) { const r = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' }); assert.equal(r.status, 0, `${file}: ${r.stderr}`); }
});

test('WordPress content contracts follow existing template parts and reject missing, unrelated or cyclic parts', t => {
  const { root } = fixture(t); const { templateUses } = require('../lib/wordpress-converter');
  fs.mkdirSync(path.join(root, 'parts'));
  fs.writeFileSync(path.join(root, 'page.php'), "<?php get_template_part('parts/content', 'page');");
  fs.writeFileSync(path.join(root, 'unrelated.php'), '<?php the_content();');
  assert.equal(templateUses(root, 'page.php', 'the_content'), false);
  fs.writeFileSync(path.join(root, 'parts/content-page.php'), '<?php the_content();');
  assert.equal(templateUses(root, 'page.php', 'the_content'), true);
  fs.writeFileSync(path.join(root, 'parts/content-page.php'), "<?php get_template_part('page'); /* the_content(); */");
  assert.equal(templateUses(root, 'page.php', 'the_content'), false);
});

test('static preparation preserves identities already used only by a ZIP or historical report', t => {
  const { root } = fixture(t);
  fs.cpSync(path.resolve(__dirname, '..'), path.join(root, 'scripts'), { recursive: true });
  const workflow = require(path.join(root, 'scripts/lib/static-workflow'));
  const slug = '099_nolan_young_theme_reserved';
  fs.writeFileSync(path.join(root, 'brief.md'), 'Fixture');
  fs.mkdirSync(path.join(root, 'dist/zipped-themes'), { recursive: true });
  fs.writeFileSync(path.join(root, 'dist/zipped-themes', slug + '.zip'), 'historical');
  assert.throws(() => workflow.prepare({ prompt: 'brief.md', sampleSlug: slug }), /collision/);
  assert.equal(fs.existsSync(path.join(root, 'docs/Preview-Themes-Github', slug)), false);
});

test('conversion check continuation rejects changed source before generation or packaging', async t => {
  const { root, dir } = fixture(t);
  fs.cpSync(path.resolve(__dirname, '..'), path.join(root, 'scripts'), { recursive: true });
  const converter = require(path.join(root, 'scripts/lib/wordpress-converter'));
  const sampleSlug = path.basename(dir); const outputSlug = '098_nolan_young_theme_conversion';
  const sample = path.join(root, 'docs/Preview-Themes-Github', sampleSlug);
  fs.mkdirSync(path.dirname(sample), { recursive: true }); fs.cpSync(dir, sample, { recursive: true });
  const theme = path.join(root, 'wp-content/themes', outputSlug); fs.mkdirSync(theme, { recursive: true }); fs.writeFileSync(path.join(theme, 'style.css'), 'original');
  const report = path.join(root, 'reports/conversions', outputSlug);
  writeJson(path.join(report, 'conversion.result.json'), { sampleSlug, outputSlug, generation: { status: 'passed' } });
  writeJson(path.join(report, 'source-checkpoint.json'), { themeHash: treeHash(theme), sourceHash: treeHash(sample) });
  fs.appendFileSync(path.join(theme, 'style.css'), 'changed');
  await assert.rejects(converter.convert({ mode: 'codex-only', sampleSlug, outputSlug, resumeChecks: true }), /checkpoint mismatch/);
  assert.equal(fs.existsSync(path.join(report, 'codex.log')), false);
  assert.equal(fs.existsSync(path.join(root, 'dist')), false);
});
