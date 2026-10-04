'use strict';
const W = require('./workspace');
const { fs, path, ROOT, REPORTS, PAGES, readJson, writeJson, requireSlug, sampleDir, nextSlug, relative, treeHash, hash } = W;
const { scaffold, VERSION } = require('./static-scaffold');
const { prepareGeneratedAssets, recordAssetPreparation, hashApprovedAssetSet } = require('./assets');
const { validateStatic } = require('./static-validation');
const { updateGallery } = require('./static-gallery');
const { readReview } = require('./review');
const { runCodex, invocation } = require('./codex');
const { runLocalModelGeneration } = require('./local-model/agent');
const { validateLocalModelPlan } = require('./local-model/stages');
const { createOllamaProvider } = require('./providers/ollama');
const { createLmStudioProvider } = require('./providers/lmstudio');
const { spawnSync } = require('node:child_process');
const MODES = new Set(['codex-only', 'ollama-only', 'lmstudio-only']);
function slugArg(args) { if (args.themeSlug) console.warn('--theme-slug is a deprecated alias for --sample-slug in static commands.'); return requireSlug(args.sampleSlug || args.themeSlug); }
function promptPath(args) { if (!args.prompt) throw new Error('Missing --prompt.'); const file = path.resolve(ROOT, args.prompt); if (!fs.existsSync(file) || !fs.readFileSync(file, 'utf8').trim()) throw new Error('Brief is missing or empty.'); return file; }
function configFor(slug) {
  const file = path.join(REPORTS, slug, 'run.config.json');
  if (!fs.existsSync(file) || readJson(file).schema !== VERSION) throw new Error('No compatible static run configuration. Legacy WordPress runs/checkpoints cannot be resumed; choose a new sample.');
  return readJson(file);
}
function assertAssets(dir, config) {
  const manifest = path.join(dir, 'assets/images/asset-manifest.json');
  if (!fs.existsSync(manifest)) throw new Error('Missing approved asset manifest for theme generation.');
  if (hash(fs.readFileSync(manifest)) !== config.assetPreparation.manifestHash || hashApprovedAssetSet(dir, readJson(manifest)) !== config.assetPreparation.approvedAssetSetHash) throw new Error('Approved assets or manifest changed after preparation.');
  if (hash(fs.readFileSync(path.join(dir, 'sample.json'))) !== config.identityHash) throw new Error('Prepared sample identity changed.');
}
function prepare(args) {
  const brief = promptPath(args);
  const slug = args.sampleSlug || args.themeSlug || nextSlug(path.basename(brief, path.extname(brief)));
  const dir = sampleDir(slug); const reportDir = path.join(REPORTS, slug);
  const identities = [dir, reportDir, path.join(ROOT, 'wp-content/themes', slug), path.join(ROOT, 'dist/zipped-themes', `${slug}.zip`), path.join(ROOT, 'reports/runs', slug), path.join(ROOT, 'reports/conversions', slug)];
  if (identities.some(file => fs.existsSync(file))) throw new Error(`Output collision: ${slug}. Choose a new unused identity.`);
  if (args.dryRun) return console.log(JSON.stringify({ sampleSlug: slug, path: relative(dir), prompt: relative(brief), schema: VERSION }));
  scaffold(dir, slug);
  const config = { schema: VERSION, sampleSlug: slug, prompt: relative(brief), promptHash: hash(fs.readFileSync(brief)), assetCatalog: args.assetCatalog || null, identityHash: hash(fs.readFileSync(path.join(dir, 'sample.json'))), createdAt: new Date().toISOString() };
  writeJson(path.join(reportDir, 'run.config.json'), config);
  prepareGeneratedAssets(dir, { assetCatalog: args.assetCatalog, promptPath: brief });
  config.assetPreparation = recordAssetPreparation(dir, reportDir, { promptPath: brief });
  config.scaffoldHash = treeHash(dir);
  writeJson(path.join(reportDir, 'run.config.json'), config);
  console.log(`Prepared static sample: ${slug}`); return slug;
}
async function modelCheck(args) {
  if (args.provider === 'codex') { const call = invocation(args.codexExecutable, ['--version']); W.assertStatus(spawnSync(call.command, call.args, { encoding: 'utf8' }), 'Codex version'); console.log('Codex available'); return null; }
  if (!['ollama', 'lmstudio'].includes(args.provider)) throw new Error('Choose --provider codex, ollama, or lmstudio.');
  const provider = args.provider === 'ollama' ? createOllamaProvider(args) : createLmStudioProvider(args);
  const models = await provider.listModels(); console.log(`${args.provider} exact model IDs: ${models.join(', ') || '(none)'}`);
  if (provider.modelId) { await provider.checkModel(provider.modelId); await provider.checkToolCalling(provider.modelId); console.log('Required structured tool-call probe passed.'); }
  return provider;
}
function generationPrompt(dir, brief) {
  return `Generate one complete polished STATIC website sample in the current prepared directory only. This is the single generation pass.
The parent runner owns validation, browser review, reports and gallery updates. Do not run them or edit anything outside this directory. No PHP, WordPress, packages, builds, ZIPs, branches, commits or network/image acquisition. Do not spawn subagents.
Preserve sample.json, all supplied assets and assets/images/asset-manifest.json byte-for-byte. Reference only those approved images. Do not invent provenance, hotlink, or create new image files. Original CSS graphics and inline interface SVG are fine.
Write all nine required HTML pages: ${PAGES.join(', ')}. index.html and homepage_preview.html are the same home experience. Use assets/css/site.css and assets/js/site.js, plain browser code, system fonts. Every internal link and fragment must resolve inside this sample. Use relative URLs, no root-relative URLs. No placeholder # links unless returning to page top. All navigation must work inside a gallery iframe and without JavaScript. Do not set target=_top or target=_parent. Do not use inline onclick handlers.
Create meaningful distinct compositions, cohesive typography/spacing, visible approved photographs, full useful content on every page and a complete footer. At 390 and 1280px: no clipped text, horizontal overflow or dead space. Mobile menu opens/closes with aria-expanded, Escape and keyboard access. Respect reduced motion. Forms must be honest demos with local accessible feedback, no external submission or storage. Include details/FAQ or another useful working interaction.
Finish content.json as the content/identity plan and README.md describing pages and demo behavior. No implementation instructions in visible product copy.
You may self-audit within this one pass, but there is no second AI repair invocation.
Approved inventory:\n${JSON.stringify(readJson(path.join(dir, 'assets/images/asset-manifest.json')), null, 2)}
Creative brief (business/design requirements apply; any old WordPress/PHP/build instructions are superseded by this static contract):\n${brief}`;
}
async function run(args, deps = {}) {
  if (!MODES.has(args.mode)) throw new Error('Choose --mode codex-only, ollama-only, or lmstudio-only.');
  const local = args.mode !== 'codex-only'; const resuming = Boolean(args.resumeLocal || args.resumeFromStage);
  if (resuming && (!local || !(args.sampleSlug || args.themeSlug))) throw new Error('Local continuation requires an explicit existing sample and a local mode.');
  const briefPath = promptPath(args); const brief = fs.readFileSync(briefPath, 'utf8');
  if (Buffer.byteLength(brief) > 128 * 1024) throw new Error('Brief exceeds the 128KB bounded prompt limit.');
  const stages = local ? validateLocalModelPlan([...brief.matchAll(/^#{1,6}\s+(.+)$/gm)].map(m => m[1])) : [];
  const slug = args.sampleSlug || args.themeSlug;
  const sampleSlug = slug && fs.existsSync(sampleDir(slug)) ? slug : prepare(args);
  const dir = sampleDir(sampleSlug); const reportDir = path.join(REPORTS, sampleSlug); const config = configFor(sampleSlug);
  if (hash(fs.readFileSync(briefPath)) !== config.promptHash) throw new Error('Prepared brief hash mismatch. Start a new sample.');
  const attemptFile = path.join(reportDir, 'generation-attempt.json');
  if (fs.existsSync(attemptFile) && !resuming) throw new Error('Generation was already attempted. Preserve it; choose a new sample.');
  if (!resuming && treeHash(dir) !== config.scaffoldHash) throw new Error('Prepared scaffold changed before generation.');
  assertAssets(dir, config);
  let provider;
  const result = { schema: VERSION, sampleSlug, mode: args.mode, infrastructure: { status: 'pending' }, generation: { status: 'pending' }, technicalValidation: { status: 'pending' }, browserChecks: { status: 'skipped' }, visualReview: { status: 'pending' }, publication: { status: 'not-published' } };
  try {
    const providerName = args.mode.replace('-only', '');
    if (local && !(args[`${providerName}Model`] || process.env[`${providerName.toUpperCase()}_MODEL`])) throw new Error(`Missing exact --${providerName}-model.`);
    provider = await (deps.modelCheck || modelCheck)({ ...args, provider: providerName });
    writeJson(path.join(reportDir, 'provider-preflight.json'), { status: 'passed', metadata: provider?.metadata() || { provider: 'codex', model: args.codexModel || 'configured-default' } });
    result.infrastructure.status = 'passed';
    writeJson(attemptFile, { status: 'running', mode: args.mode, startedAt: new Date().toISOString() });
    config.mode = args.mode; config.stages = stages; writeJson(path.join(reportDir, 'run.config.json'), config);
    if (local) await runLocalModelGeneration(provider, dir, { ...args, promptPath: briefPath, templateSourcePath: path.join(__dirname, 'static-scaffold.js'), resumeLocal: resuming, [`${providerName}Model`]: provider.modelId }, reportDir);
    else (deps.runCodex || runCodex)(dir, generationPrompt(dir, brief), args, reportDir);
    assertAssets(dir, config);
    result.generation.status = 'passed'; result.sampleHash = treeHash(dir);
    writeJson(attemptFile, { status: 'completed', sampleHash: result.sampleHash, mode: args.mode });
    writeJson(path.join(reportDir, 'run.result.json'), result);
    return finish(sampleSlug, args);
  } catch (error) {
    if (result.generation.status === 'passed') throw error; // finish() already preserved detailed validation evidence.
    result.status = 'failed'; result.error = error.message;
    if (result.generation.status !== 'passed') { result.generation.status = result.infrastructure.status === 'passed' ? 'failed' : 'blocked'; writeJson(attemptFile, { status: result.generation.status, error: error.message }); }
    writeJson(path.join(reportDir, 'run.result.json'), result); throw error;
  }
}
function finish(slug, args) {
  const dir = sampleDir(slug); const reportDir = path.join(REPORTS, slug); const config = configFor(slug);
  const attempt = readJson(path.join(reportDir, 'generation-attempt.json'));
  if (attempt.status !== 'completed') throw new Error('Deterministic resume requires completed generation. Failed AI output cannot receive another pass.');
  if (attempt.sampleHash !== treeHash(dir)) throw new Error('Generated sample changed after generation. Preserve evaluation integrity; start a fresh run.');
  assertAssets(dir, config);
  const file = path.join(reportDir, 'run.result.json'); const result = readJson(file);
  result.technicalValidation = validateStatic(dir);
  result.sampleHash = treeHash(dir);
  Object.assign(result, readReview(args.reviewEvidence || result.reviewEvidence, dir));
  result.publication = { status: 'not-published', note: 'Commands update local artifacts only.' };
  result.status = [result.technicalValidation, result.browserChecks, result.visualReview].some(check => check.status === 'failed') ? 'failed' : result.browserChecks.status === 'passed' && result.visualReview.status === 'passed' ? 'reviewed' : 'awaiting-review';
  writeJson(file, result);
  if (result.technicalValidation.errors.length) throw new Error(`Static validation failed:\n${result.technicalValidation.errors.join('\n')}`);
  if (result.status === 'reviewed') {
    const themes = updateGallery();
    result.artifactChecks = { status: themes.some(t => t.slug === slug) ? 'passed' : 'failed', pageCount: result.technicalValidation.pages };
    result.gallery = { status: 'included-locally', path: 'docs/index.html' };
    writeJson(file, result);
  }
  console.log(`Static run ${result.status}: ${slug}`); return result;
}
async function dispatch(command, args) {
  if (args.force || args.templateSourcePath) throw new Error('--force and WordPress template options are not supported by static commands.');
  switch (command) {
    case 'run': return run(args);
    case 'prepare': return prepare(args);
    case 'resume': return finish(slugArg(args), args);
    case 'assets': {
      const slug = slugArg(args); const config = configFor(slug); const report = path.join(REPORTS, slug);
      if (fs.existsSync(path.join(report, 'generation-attempt.json'))) throw new Error('Assets are immutable after generation starts.');
      prepareGeneratedAssets(sampleDir(slug), { assetCatalog: args.assetCatalog || config.assetCatalog });
      config.assetPreparation = recordAssetPreparation(sampleDir(slug), report, {}); config.scaffoldHash = treeHash(sampleDir(slug)); writeJson(path.join(report, 'run.config.json'), config); return;
    }
    case 'validate': {
      const slug = slugArg(args); const dir = sampleDir(slug); const legacy = !fs.existsSync(path.join(dir, 'sample.json'));
      const result = { technicalValidation: validateStatic(dir, { legacy }), ...readReview(args.reviewEvidence, dir), compatibility: legacy ? 'legacy-rendered-preview; source untouched' : VERSION };
      writeJson(path.join(REPORTS, slug, 'validation.latest.json'), result); console.log(JSON.stringify(result, null, 2)); if (result.technicalValidation.errors.length) process.exitCode = 1; return result;
    }
    case 'build': console.log('Static build is a no-op: plain HTML/CSS/JavaScript is the deliverable. WordPress builds run only during explicit conversion.'); return;
    case 'preview': { const dir = args.sampleSlug || args.themeSlug ? sampleDir(slugArg(args)) : path.join(ROOT, 'docs'); if (!fs.existsSync(dir)) throw new Error('Preview does not exist.'); return require('./static-server').serve(dir, Number(args.port || 4174)); }
    case 'preview:index': return updateGallery();
    case 'model-check': return modelCheck(args);
    case 'env': console.log(`Node ${process.version}; static output: ${relative(W.PREVIEWS)}; no PHP or build dependencies required. Use theme:model-check to inspect providers.`); return;
    case 'help': console.log('Static-first Theme Factory\nrun --mode <codex-only|ollama-only|lmstudio-only> --prompt <brief> [--sample-slug <slug>] [--asset-catalog <approved-catalog>]\nprepare --prompt <brief> [--sample-slug <slug>]\nassets --sample-slug <slug> [--asset-catalog <catalog>]\nvalidate --sample-slug <slug> [--review-evidence reports/<file>.json]\nresume --sample-slug <slug> [--review-evidence reports/<file>.json]\npreview [--sample-slug <slug>] [--port 4174]\npreview:index | build (no-op) | env\nmodel-check --provider <codex|ollama|lmstudio> [--<provider>-model <exact-id>]\nconvert:wordpress --sample-slug <selected-static-slug> --mode codex-only [--output-slug <new-slug>] (or --resume-checks with recorded output slug)\nwordpress:zip --theme-slug <converted-slug>\nLocal continuation: run with the same brief, sample, mode, model and --resume-local [--resume-from-stage <id>]. No old WordPress checkpoint migration.'); return;
    default: throw new Error(`Unknown or removed command: ${command}. Run node scripts/theme-factory.js help.`);
  }
}
module.exports = { dispatch, prepare, run, finish, modelCheck, generationPrompt, assertAssets };
