#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  GENERATED_DETAILED_PAGE_TEMPLATES,
  PAGE_TEMPLATE_MIN_BYTES,
  PAGE_TEMPLATE_MIN_STRUCTURAL_TAGS,
  PAGE_TEMPLATE_WITH_CONTENT_PAGE_MIN_STRUCTURAL_TAGS,
  PLACEHOLDER_PATTERN,
  THEME_SLUG_PATTERN,
  UNSUPPORTED_PREVIEW_PHP_CALLS
} = require('./constants');
const { parseExactFileBlocks, normalizeRelativePath } = require('./file-block-parser');
const { localAssetReferenceFailures } = require('./local-assets');
const { applyCheckedFiles, inferCheckTypes, stageChecks, writeStagedFiles } = require('./stage-checks');

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
  const requiredTemplateParts = (options.requiredTemplateParts || []).map((file) => normalizeRelativePath(file, themeSlug));
  if (requiredFiles.length + optionalFiles.length + allowedPatterns.length === 0) fail('A stage allowlist is required.');
  const raw = fs.readFileSync(sourceFile, 'utf8');
  const files = parseExactFileBlocks(raw, themeSlug, {
    allowNoChange: options.allowNoChange,
    allowDeclineAsNoChange: options.allowDeclineAsNoChange,
    requiredFiles,
    optionalFiles,
    allowedPatterns
  });
  assertContract(files, themeDir, { requiredFiles, optionalFiles, allowedPatterns });
  if (files.length === 0) {
    const manifest = {
      stage: options.stage || '',
      source_file: sourceFile,
      applied_at: new Date().toISOString(),
      allowed_files: requiredFiles,
      optional_files: optionalFiles,
      allowed_patterns: allowedPatterns,
      required_template_parts: requiredTemplateParts,
      required_files: requiredFiles,
      returned_files: [],
      hashes_before: [],
      files_written: [],
      stage_checks: [],
      transaction: {
        candidate_applied: false,
        live_theme_changed_after_checks: false,
        rollback_on_swap_failure: false
      }
    };
    if (options.manifestPath) {
      fs.mkdirSync(path.dirname(options.manifestPath), { recursive: true });
      fs.writeFileSync(options.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    }
    return { passed: true, status: 0, manifest };
  }
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
  try {
    copyDirectory(themeDir, candidateDir);
    const written = writeStagedFiles(candidateDir, tempRoot, files);
    const checks = stageChecks(candidateDir, files, inferCheckTypes(files, options.checkTypes || []), { requiredTemplateParts });
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
    applyCheckedFiles(themeDir, tempRoot, files);
    const manifest = {
      stage: options.stage || '',
      source_file: sourceFile,
      applied_at: new Date().toISOString(),
      allowed_files: requiredFiles,
      optional_files: optionalFiles,
      allowed_patterns: allowedPatterns,
      required_template_parts: requiredTemplateParts,
      required_files: requiredFiles,
      returned_files: files.map((file) => file.relativePath),
      hashes_before: hashesBefore,
      files_written: written,
      stage_checks: checks,
      transaction: {
        candidate_applied: false,
        candidate_checked: true,
        file_level_swap: true,
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
  parseExactFileBlocks
};
