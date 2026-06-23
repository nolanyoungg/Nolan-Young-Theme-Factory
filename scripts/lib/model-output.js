#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { THEME_SLUG_PATTERN } = require('./constants');

function fail(message) {
  throw new Error(message);
}

function repoRelative(file, rootDir) {
  return path.relative(rootDir, file).replace(/\\/g, '/');
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function parseCsv(value) {
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
}

function unwrapMarkdownFence(content) {
  const normalized = String(content || '').replace(/\r\n/g, '\n');
  const match = normalized.match(/(?:^|\n)```[a-zA-Z0-9_-]*\n([\s\S]*?)\n```(?:\n|$)/);
  if (!match) return content;
  return match[1];
}

function fileHash(file) {
  return fs.existsSync(file) ? sha256(fs.readFileSync(file)) : '';
}

function parseArgs(argv) {
  const parsed = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith('--')) {
      parsed._.push(item);
      continue;
    }
    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      parsed[key] = true;
    } else if (parsed[key]) {
      parsed[key] = `${parsed[key]},${next}`;
      index += 1;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

function normalizeRelativePath(input, themeSlug) {
  let value = String(input || '').trim().replace(/\\/g, '/').replace(/^\.\//, '');
  const themePrefix = `wp-content/themes/${themeSlug}/`;
  if (value.startsWith(themePrefix)) value = value.slice(themePrefix.length);
  if (!value) fail('Encountered an empty file path.');
  if (path.isAbsolute(value) || value.includes('..')) fail(`Rejected unsafe file path: ${value}`);
  return value;
}

function parseExactFileBlocks(raw, themeSlug, options = {}) {
  const normalized = raw.replace(/\r\n/g, '\n');
  if (options.allowNoChange && normalized.trim() === '---NO CHANGES---') return [];
  const blockPattern = /^---FILE: ([^\n]+)---$/gm;
  const files = [];
  const matches = [];
  let match;
  while ((match = blockPattern.exec(normalized)) !== null) {
    matches.push({ relativePath: match[1], contentStart: blockPattern.lastIndex, headerIndex: match.index });
  }
  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const nextHeaderIndex = index + 1 < matches.length ? matches[index + 1].headerIndex : normalized.length;
    let contentEnd = nextHeaderIndex;
    const explicitEndIndex = normalized.indexOf('\n---END FILE---', current.contentStart);
    if (explicitEndIndex !== -1 && explicitEndIndex < contentEnd) contentEnd = explicitEndIndex;
    let content = normalized.slice(current.contentStart, contentEnd).replace(/^\n+/, '').replace(/\n+$/, '');
    content = unwrapMarkdownFence(content);
    files.push({
      relativePath: normalizeRelativePath(current.relativePath, themeSlug),
      content: `${String(content || '').replace(/\n?$/, '\n')}`
    });
  }
  if (files.length === 0) fail('No documented file blocks were found.');
  return files;
}

function assertContract(files, themeDir, contract) {
  const requiredFiles = contract.requiredFiles || [];
  const optionalFiles = contract.optionalFiles || [];
  const allowedPatterns = contract.allowedPatterns || [];
  const overlap = requiredFiles.filter((file) => optionalFiles.includes(file));
  if (overlap.length) fail(`Required file is also optional: ${overlap.join(', ')}`);
  const required = new Set(requiredFiles);
  const optional = new Set(optionalFiles);
  const seen = new Set();
  const patterns = allowedPatterns.map((pattern) => new RegExp(pattern));
  for (const file of files) {
    if (seen.has(file.relativePath)) fail(`Duplicate file returned: ${file.relativePath}`);
    seen.add(file.relativePath);
    if (!required.has(file.relativePath) && !optional.has(file.relativePath) && !patterns.some((pattern) => pattern.test(file.relativePath))) fail(`Returned file is not in this stage allowlist: ${file.relativePath}`);
    const target = path.resolve(themeDir, file.relativePath);
    if (!target.startsWith(themeDir + path.sep)) fail(`Rejected path outside theme folder: ${file.relativePath}`);
  }
  const missing = [...required].filter((file) => !seen.has(file));
  if (missing.length > 0) fail(`Model response omitted required stage file(s): ${missing.join(', ')}`);
}

function stageFiles(themeDir, files) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-stage-output-'));
  for (const file of files) {
    const target = path.join(tempRoot, file.relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, file.content, 'utf8');
  }
  for (const file of files) {
    if (!fs.existsSync(path.join(tempRoot, file.relativePath))) fail(`Staged file missing: ${file.relativePath}`);
  }
  return tempRoot;
}

function copyDirectory(source, target) {
  fs.cpSync(source, target, { recursive: true, force: true });
}

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
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

function stageChecks(candidateDir, files, checkTypes = []) {
  const checks = [];
  const changed = files.map((file) => file.relativePath);
  if (checkTypes.includes('php')) {
    const phpFiles = changed.filter((file) => file.endsWith('.php'));
    for (const file of phpFiles) {
      const result = require('./command-runner').runCommand('php', ['-l', path.join(candidateDir, file)], { echo: false });
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
  }
  if (checkTypes.includes('assets')) {
    checks.push(...validateReturnedAssets(candidateDir, changed));
    checks.push(...validateAssetManifest(candidateDir));
  }
  if (checkTypes.includes('js')) {
    for (const file of changed.filter((item) => item.endsWith('.js'))) {
      const result = require('./command-runner').runCommand('node', ['--check', path.join(candidateDir, file)], { echo: false });
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

function applyModelOutput(options) {
  const sourceFile = options.sourceFile;
  const themeDir = path.resolve(options.themeDir);
  const themeSlug = path.basename(themeDir);
  if (!THEME_SLUG_PATTERN.test(themeSlug)) fail(`Invalid theme folder slug: ${themeSlug}`);
  if (!sourceFile || !fs.existsSync(sourceFile)) fail(`Raw model response not found: ${sourceFile}`);
  if (!fs.existsSync(themeDir)) fail(`Theme folder not found: ${themeDir}`);
  const optionalFiles = (options.optionalFiles || []).map((file) => normalizeRelativePath(file, themeSlug));
  const requiredFiles = (options.requiredFiles || []).map((file) => normalizeRelativePath(file, themeSlug));
  const allowedPatterns = options.allowedPatterns || [];
  if (requiredFiles.length + optionalFiles.length + allowedPatterns.length === 0) fail('A stage allowlist is required.');
  const raw = fs.readFileSync(sourceFile, 'utf8');
  const files = parseExactFileBlocks(raw, themeSlug, { allowNoChange: options.allowNoChange });
  assertContract(files, themeDir, { requiredFiles, optionalFiles, allowedPatterns });
  const hashesBefore = files.map((file) => {
    const target = path.join(themeDir, file.relativePath);
    return {
      path: file.relativePath,
      existed: fs.existsSync(target),
      sha256: fileHash(target)
    };
  });
  const tempRoot = stageFiles(themeDir, files);
  const parent = path.dirname(themeDir);
  const candidateDir = path.join(parent, `.${themeSlug}.${options.stage || 'stage'}.candidate-${process.pid}-${Date.now()}`);
  const backupDir = path.join(parent, `.${themeSlug}.${options.stage || 'stage'}.backup-${process.pid}-${Date.now()}`);
  try {
    copyDirectory(themeDir, candidateDir);
    const written = writeStagedFiles(candidateDir, tempRoot, files);
    const checks = stageChecks(candidateDir, files, inferCheckTypes(files, options.checkTypes || []));
    const failedChecks = checks.filter((check) => check.passed === false);
    if (failedChecks.length) {
      if (options.candidateEvidenceDir) {
        fs.mkdirSync(options.candidateEvidenceDir, { recursive: true });
        copyDirectory(candidateDir, path.join(options.candidateEvidenceDir, 'candidate'));
        fs.writeFileSync(path.join(options.candidateEvidenceDir, 'stage-checks.json'), `${JSON.stringify(checks, null, 2)}\n`, 'utf8');
      }
      const error = new Error(`Stage checks failed for ${options.stage || 'stage'}: ${failedChecks.map((check) => `${check.type}${check.file ? `:${check.file}` : ''}`).join(', ')}`);
      error.checks = checks;
      throw error;
    }
    fs.renameSync(themeDir, backupDir);
    try {
      fs.renameSync(candidateDir, themeDir);
    } catch (error) {
      if (fs.existsSync(themeDir)) fs.rmSync(themeDir, { recursive: true, force: true });
      fs.renameSync(backupDir, themeDir);
      throw error;
    }
    fs.rmSync(backupDir, { recursive: true, force: true });
    const manifest = {
      stage: options.stage || '',
      source_file: sourceFile,
      applied_at: new Date().toISOString(),
      allowed_files: requiredFiles,
      optional_files: optionalFiles,
      allowed_patterns: allowedPatterns,
      required_files: requiredFiles,
      returned_files: files.map((file) => file.relativePath),
      hashes_before: hashesBefore,
      files_written: written,
      stage_checks: checks,
      transaction: {
        candidate_applied: true,
        live_theme_changed_after_checks: true,
        rollback_on_swap_failure: true
      }
    };
    if (options.manifestPath) {
      fs.mkdirSync(path.dirname(options.manifestPath), { recursive: true });
      fs.writeFileSync(options.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    }
    return { passed: true, status: 0, manifest };
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
    fs.rmSync(candidateDir, { recursive: true, force: true });
  }
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  const [sourceFile, themeDir] = args._;
  applyModelOutput({
    sourceFile,
    themeDir,
    stage: args.stage || '',
    requiredFiles: parseCsv(args.required || args.allow || args.allowed || ''),
    optionalFiles: parseCsv(args.optional || ''),
    allowedPatterns: parseCsv(args.patterns || ''),
    manifestPath: args.manifest || ''
  });
  console.log('Applied model output.');
}

module.exports = {
  applyModelOutput,
  assertContract,
  validateAssetManifest,
  parseExactFileBlocks
};
