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

function parseExactFileBlocks(raw, themeSlug) {
  const normalized = raw.replace(/\r\n/g, '\n');
  const blockPattern = /---FILE: ([^\n]+)---\n([\s\S]*?)\n---END FILE---/g;
  const files = [];
  let cursor = 0;
  let match;
  while ((match = blockPattern.exec(normalized)) !== null) {
    const between = normalized.slice(cursor, match.index);
    if (between.trim()) fail('Model response contains text outside documented file blocks.');
    files.push({
      relativePath: normalizeRelativePath(match[1], themeSlug),
      content: `${match[2].replace(/\n?$/, '\n')}`
    });
    cursor = blockPattern.lastIndex;
  }
  if (normalized.slice(cursor).trim()) fail('Model response contains trailing text outside documented file blocks.');
  if (files.length === 0) fail('No documented file blocks were found.');
  return files;
}

function assertContract(files, themeDir, allowedFiles, requiredFiles) {
  const allowed = new Set(allowedFiles);
  const required = new Set(requiredFiles.length ? requiredFiles : allowedFiles);
  const seen = new Set();
  for (const file of files) {
    if (seen.has(file.relativePath)) fail(`Duplicate file returned: ${file.relativePath}`);
    seen.add(file.relativePath);
    if (!allowed.has(file.relativePath)) fail(`Returned file is not in this stage allowlist: ${file.relativePath}`);
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

function writeStagedFiles(themeDir, tempRoot, files) {
  const written = [];
  for (const file of files) {
    const source = path.join(tempRoot, file.relativePath);
    const target = path.join(themeDir, file.relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    written.push({
      path: file.relativePath,
      sha256: sha256(fs.readFileSync(target, 'utf8'))
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
  const allowedFiles = (options.allowedFiles || []).map((file) => normalizeRelativePath(file, themeSlug));
  const requiredFiles = (options.requiredFiles || []).map((file) => normalizeRelativePath(file, themeSlug));
  if (allowedFiles.length === 0) fail('A stage allowlist is required.');
  const raw = fs.readFileSync(sourceFile, 'utf8');
  const files = parseExactFileBlocks(raw, themeSlug);
  assertContract(files, themeDir, allowedFiles, requiredFiles);
  const hashesBefore = files.map((file) => {
    const target = path.join(themeDir, file.relativePath);
    return {
      path: file.relativePath,
      existed: fs.existsSync(target),
      sha256: fs.existsSync(target) ? sha256(fs.readFileSync(target, 'utf8')) : ''
    };
  });
  const tempRoot = stageFiles(themeDir, files);
  try {
    const written = writeStagedFiles(themeDir, tempRoot, files);
    const manifest = {
      stage: options.stage || '',
      source_file: sourceFile,
      applied_at: new Date().toISOString(),
      allowed_files: allowedFiles,
      required_files: requiredFiles.length ? requiredFiles : allowedFiles,
      returned_files: files.map((file) => file.relativePath),
      hashes_before: hashesBefore,
      files_written: written
    };
    if (options.manifestPath) {
      fs.mkdirSync(path.dirname(options.manifestPath), { recursive: true });
      fs.writeFileSync(options.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    }
    return { passed: true, status: 0, manifest };
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  const [sourceFile, themeDir] = args._;
  applyModelOutput({
    sourceFile,
    themeDir,
    stage: args.stage || '',
    allowedFiles: parseCsv(args.allow || args.allowed || ''),
    requiredFiles: parseCsv(args.required || ''),
    manifestPath: args.manifest || ''
  });
  console.log('Applied model output.');
}

module.exports = {
  applyModelOutput,
  parseExactFileBlocks
};
