const fs = require('fs');
const os = require('os');
const path = require('path');
const { runCommand } = require('./command-runner');
const { walkFiles } = require('./theme-utils');
const {
  validateDeclaredThemeHelperCalls,
  validateGeneratedTextContent,
  validateHeaderComposition,
  validatePageTemplateDetail,
  validateRequiredTemplatePartReferences,
  validateTemplatePartReferences
} = require('./generated-content-validation');

function fail(message) {
  throw new Error(message);
}

function validateAssetManifest(candidateDir) {
  const checks = [];
  const manifestPath = path.join(candidateDir, 'assets/images/asset-manifest.json');
  if (!fs.existsSync(manifestPath)) return [{ type: 'asset-manifest', passed: false, details: 'assets/images/asset-manifest.json is missing' }];
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    checks.push({ type: 'asset-manifest-json', passed: true, details: '' });
  } catch (error) {
    return [{ type: 'asset-manifest-json', passed: false, details: error.message }];
  }
  checks.push({ type: 'asset-manifest-version', passed: Boolean(parsed.manifest_version), details: 'manifest_version is required' });
  checks.push({ type: 'asset-manifest-assets-array', passed: Array.isArray(parsed.assets), details: 'assets must be an array' });
  if (!Array.isArray(parsed.assets)) return checks;
  for (const asset of parsed.assets) {
    const file = String(asset.file || '').replace(/\\/g, '/');
    const safe = file && !path.isAbsolute(file) && !file.includes('..');
    const target = path.resolve(candidateDir, 'assets/images', file);
    const inside = target.startsWith(path.resolve(candidateDir, 'assets/images') + path.sep);
    const original = /^original-|original/i.test(String(asset.kind || ''));
    const thirdParty = !original;
    checks.push({ type: 'asset-path-safe', file, passed: safe && inside, details: 'asset file must stay under assets/images' });
    checks.push({ type: 'asset-file-exists', file, passed: safe && inside && fs.existsSync(target), details: 'manifest asset must exist' });
    checks.push({ type: 'asset-kind-present', file, passed: Boolean(asset.kind), details: 'kind is required' });
    checks.push({ type: 'asset-original-not-photo', file, passed: !(original && /photo/i.test(String(asset.kind))), details: 'original assets must not be classified as photographs' });
    if (thirdParty) {
      checks.push({ type: 'asset-third-party-provenance', file, passed: Boolean(asset.source_url && asset.creator && asset.license && asset.downloaded_at), details: 'third-party assets require source_url, creator, license, downloaded_at' });
    }
  }
  return checks;
}

function validateReturnedAssets(candidateDir, changed) {
  const checks = [];
  for (const file of changed.filter((item) => item.endsWith('.svg'))) {
    const text = fs.existsSync(path.join(candidateDir, file)) ? fs.readFileSync(path.join(candidateDir, file), 'utf8').trim() : '';
    checks.push({ type: 'svg-basic-parse', file, passed: text.length > 0 && /<svg[\s>]/i.test(text) && /<\/svg>/i.test(text), details: 'SVG must be nonempty and contain svg root' });
  }
  for (const file of changed.filter((item) => /\.(png|jpe?g|webp|gif)$/i.test(item))) {
    const target = path.join(candidateDir, file);
    checks.push({ type: 'raster-nonempty', file, passed: fs.existsSync(target) && fs.statSync(target).size > 0, details: 'Raster asset must be nonempty' });
  }
  return checks;
}

function stageChecks(candidateDir, files, checkTypes = [], options = {}) {
  const checks = [];
  const changed = files.map((file) => file.relativePath);
  checks.push(...validateGeneratedTextContent(candidateDir, changed));
  if (checkTypes.includes('php')) {
    const phpFiles = changed.filter((file) => file.endsWith('.php'));
    for (const file of phpFiles) {
      const result = runCommand('php', ['-l', path.join(candidateDir, file)], { echo: false });
      checks.push({ type: 'php-lint', file, passed: result.status === 0, details: result.stderr || result.stdout || '' });
    }
    const declarations = new Map();
    for (const full of walkFiles(candidateDir).filter((file) => file.endsWith('.php'))) {
      const file = path.relative(candidateDir, full).replace(/\\/g, '/');
      const text = fs.readFileSync(path.join(candidateDir, file), 'utf8');
      let match;
      const pattern = /function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
      while ((match = pattern.exec(text)) !== null) {
        if (!declarations.has(match[1])) declarations.set(match[1], []);
        declarations.get(match[1]).push(file);
      }
    }
    const changedSet = new Set(phpFiles);
    const duplicates = [...declarations.entries()]
      .filter(([, owners]) => owners.length > 1)
      .map(([name, owners]) => ({ name, files: owners, includes_changed_file: owners.some((file) => changedSet.has(file)) }))
      .filter((item) => item.includes_changed_file);
    checks.push({ type: 'duplicate-functions', passed: duplicates.length === 0, details: duplicates.map((item) => `${item.name}: ${item.files.join(', ')}`).join('; '), duplicates });
    checks.push(...validateDeclaredThemeHelperCalls(candidateDir, phpFiles, declarations));
    checks.push(...validatePageTemplateDetail(candidateDir, phpFiles));
    checks.push(...validateHeaderComposition(candidateDir, phpFiles));
    checks.push(...validateTemplatePartReferences(candidateDir, phpFiles));
    checks.push(...validateRequiredTemplatePartReferences(candidateDir, phpFiles, options.requiredTemplateParts || []));
  }
  if (checkTypes.includes('assets')) {
    checks.push(...validateReturnedAssets(candidateDir, changed));
    checks.push(...validateAssetManifest(candidateDir));
  }
  if (checkTypes.includes('js')) {
    for (const file of changed.filter((item) => item.endsWith('.js'))) {
      const result = runCommand('node', ['--check', path.join(candidateDir, file)], { echo: false });
      checks.push({ type: 'node-check', file, passed: result.status === 0, details: result.stderr || result.stdout || '' });
    }
  }
  if (checkTypes.includes('scss')) {
    for (const file of changed.filter((item) => item.endsWith('.scss'))) {
      const text = fs.readFileSync(path.join(candidateDir, file), 'utf8');
      let match;
      const missing = [];
      const importPattern = /@(use|import)\s+["']([^"']+)["']/g;
      while ((match = importPattern.exec(text)) !== null) {
        const specifier = match[2];
        if (/^(?:http:|https:|sass:)/.test(specifier)) continue;
        const base = path.dirname(path.join(candidateDir, file));
        const parsed = path.posix.parse(specifier);
        const candidates = [
          path.resolve(base, specifier),
          path.resolve(base, `${specifier}.scss`),
          path.resolve(base, parsed.dir, `_${parsed.base}.scss`)
        ];
        if (!candidates.some((candidate) => fs.existsSync(candidate))) missing.push(specifier);
      }
      checks.push({ type: 'scss-imports', file, passed: missing.length === 0, details: missing.join(', ') });
    }
  }
  for (const file of files) {
    const target = path.join(candidateDir, file.relativePath);
    checks.push({ type: 'assigned-file-present', file: file.relativePath, passed: fs.existsSync(target), details: '' });
  }
  return checks;
}

function inferCheckTypes(files, explicit = []) {
  if (explicit.length) return explicit;
  const out = new Set();
  for (const file of files) {
    if (file.relativePath.endsWith('.php')) out.add('php');
    if (file.relativePath.endsWith('.js')) out.add('js');
    if (file.relativePath.endsWith('.scss')) out.add('scss');
    if (file.relativePath.startsWith('assets/')) out.add('assets');
  }
  return [...out];
}

function writeStagedFiles(candidateDir, tempRoot, files) {
  const written = [];
  for (const file of files) {
    const source = path.join(tempRoot, file.relativePath);
    const target = path.join(candidateDir, file.relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    written.push({
      path: file.relativePath,
      sha256: fileHash(target)
    });
  }
  return written;
}

function applyCheckedFiles(themeDir, tempRoot, files) {
  const backupRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-stage-backup-'));
  const restorePlan = [];
  try {
    for (const file of files) {
      const source = path.join(tempRoot, file.relativePath);
      const target = path.join(themeDir, file.relativePath);
      const backup = path.join(backupRoot, file.relativePath);
      const existed = fs.existsSync(target);
      fs.mkdirSync(path.dirname(backup), { recursive: true });
      if (existed) fs.copyFileSync(target, backup);
      restorePlan.push({ target, backup, existed });
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(source, target);
    }
  } catch (error) {
    for (const item of restorePlan.reverse()) {
      if (item.existed && fs.existsSync(item.backup)) {
        fs.mkdirSync(path.dirname(item.target), { recursive: true });
        fs.copyFileSync(item.backup, item.target);
      } else if (!item.existed && fs.existsSync(item.target)) {
        fs.rmSync(item.target, { force: true });
      }
    }
    throw error;
  } finally {
    fs.rmSync(backupRoot, { recursive: true, force: true });
  }
}

function fileHash(file) {
  return fs.existsSync(file) ? require('crypto').createHash('sha256').update(fs.readFileSync(file)).digest('hex') : '';
}

module.exports = {
  applyCheckedFiles,
  inferCheckTypes,
  validateAssetManifest,
  validateReturnedAssets,
  stageChecks,
  writeStagedFiles
};
