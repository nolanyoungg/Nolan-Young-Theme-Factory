'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const {
  LocalModelToolError,
  createScopeMatcher,
  isBinaryFile,
  prepareThemeRoot,
  truncateUtf8,
  walkThemeFiles
} = require('./tools');

const DEFAULT_MAX_TOTAL_BYTES = 96 * 1024;
const DEFAULT_MAX_FILE_BYTES = 24 * 1024;
const DEFAULT_MAX_FILES = 80;
const DEFAULT_MAX_INVENTORY_FILES = 200;
const DEFAULT_MAX_INVENTORY_BYTES = 12 * 1024;
const DEFAULT_MAX_WALK_ENTRIES = 5000;
const DEFAULT_MAX_READABLE_FILE_BYTES = 5 * 1024 * 1024;

const CONTEXT_TEXT_EXTENSIONS = new Set([
  '.css', '.html', '.js', '.json', '.jsx', '.md', '.markdown', '.mjs', '.cjs',
  '.php', '.sass', '.scss', '.svg', '.text', '.txt', '.xml', '.yaml', '.yml'
]);

const COMPILED_PATH_PATTERNS = [
  /^assets\/css\/(?:bundle|main|style)(?:\.min)?\.css$/i,
  /^assets\/js\/(?:bundle|main|script)(?:\.min)?\.js$/i,
  /(?:^|\/)dist\//i,
  /\.min\.(?:css|js)$/i
];

const LOCKFILE_NAMES = new Set(['package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'pnpm-lock.yaml']);

function positiveInteger(value, fallback, name) {
  const selected = value === undefined ? fallback : value;
  if (!Number.isInteger(selected) || selected <= 0) {
    throw new LocalModelToolError('INVALID_CONTEXT_CONFIGURATION', `${name} must be a positive integer.`);
  }
  return selected;
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function isContextTextPath(relPath) {
  const baseName = path.posix.basename(relPath).toLowerCase();
  if (LOCKFILE_NAMES.has(baseName)) {
    return true;
  }
  return CONTEXT_TEXT_EXTENSIONS.has(path.posix.extname(relPath).toLowerCase());
}

function isHardExcludedContextPath(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  const lower = normalized.toLowerCase();
  const segments = lower.split('/');
  if (segments.includes('node_modules') || segments.includes('.git') || segments.includes('reports')) {
    return true;
  }
  if (lower.startsWith('docs/preview-themes-github/') || lower.startsWith('previews/') || lower.startsWith('dist/')) {
    return true;
  }
  if (/\.(?:zip|7z|rar|tar|gz|bz2)$/i.test(lower)) {
    return true;
  }
  return false;
}

function classifyContextFile(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  const baseName = path.posix.basename(normalized).toLowerCase();
  if (LOCKFILE_NAMES.has(baseName)) {
    return 'lockfile';
  }
  if (COMPILED_PATH_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return 'compiled';
  }
  if (normalized === 'package.json' || normalized === 'theme.json') {
    return 'config';
  }
  if (/\.(?:md|markdown|txt|text)$/i.test(normalized)) {
    return 'documentation';
  }
  if (/\.svg$/i.test(normalized)) {
    return 'svg-source';
  }
  return 'source';
}

function contextPriority(file, writeMatcher = null) {
  if (writeMatcher && writeMatcher.matches(file.path)) {
    return 0;
  }
  if (file.path === 'theme.json' || file.path === 'package.json') {
    return 1;
  }
  const kind = classifyContextFile(file.path);
  if (kind === 'lockfile') {
    return 2;
  }
  if (/^(?:functions|header|footer|front-page|index|page|single|archive|search|searchform|403|404|comments)\.php$/i.test(file.path)) {
    return 3;
  }
  if (/^(?:inc|page-templates|template-parts|src)\//i.test(file.path)) {
    return 4;
  }
  if (kind === 'source' || kind === 'svg-source' || kind === 'config') {
    return 5;
  }
  if (kind === 'documentation') {
    return 6;
  }
  return 8;
}

function lineByteLength(line) {
  return Buffer.byteLength(`${line}\n`, 'utf8');
}

function takeHeadLines(lines, budget) {
  const selected = [];
  let bytes = 0;
  for (let index = 0; index < lines.length; index += 1) {
    const nextBytes = lineByteLength(lines[index]);
    if (selected.length && bytes + nextBytes > budget) {
      break;
    }
    if (!selected.length && nextBytes > budget) {
      selected.push(truncateUtf8(lines[index], Math.max(0, budget - 1)));
      bytes = lineByteLength(selected[0]);
      break;
    }
    selected.push(lines[index]);
    bytes += nextBytes;
  }
  return { lines: selected, bytes };
}

function takeTailLines(lines, budget, firstAvailableIndex) {
  const selected = [];
  let bytes = 0;
  for (let index = lines.length - 1; index >= firstAvailableIndex; index -= 1) {
    const nextBytes = lineByteLength(lines[index]);
    if (selected.length && bytes + nextBytes > budget) {
      break;
    }
    if (!selected.length && nextBytes > budget) {
      selected.unshift(truncateUtf8(lines[index], Math.max(0, budget - 1)));
      bytes = lineByteLength(selected[0]);
      break;
    }
    selected.unshift(lines[index]);
    bytes += nextBytes;
  }
  return { lines: selected, bytes };
}

function createTextExcerpt(content, maxBytes) {
  const normalized = content.replace(/\r\n/g, '\n');
  const totalBytes = Buffer.byteLength(normalized, 'utf8');
  const lines = normalized.split('\n');
  if (totalBytes <= maxBytes) {
    return {
      content: normalized,
      mode: 'full',
      truncated: false,
      totalLines: lines.length,
      ranges: lines.length ? [{ startLine: 1, endLine: lines.length }] : []
    };
  }

  const markerReserve = 120;
  const usableBytes = Math.max(1, maxBytes - markerReserve);
  const head = takeHeadLines(lines, Math.floor(usableBytes * 0.68));
  const tailStartIndex = Math.min(lines.length, head.lines.length);
  const tail = takeTailLines(lines, Math.ceil(usableBytes * 0.32), tailStartIndex);
  const omittedStart = head.lines.length + 1;
  const omittedEnd = Math.max(omittedStart - 1, lines.length - tail.lines.length);
  const marker = omittedEnd >= omittedStart
    ? `[... omitted lines ${omittedStart}-${omittedEnd}; use read_file_excerpt for exact source ...]`
    : '[... excerpt truncated; use read_file_excerpt for exact source ...]';
  const excerpt = [...head.lines, marker, ...tail.lines].join('\n');
  const ranges = [];
  if (head.lines.length) {
    ranges.push({ startLine: 1, endLine: head.lines.length });
  }
  if (tail.lines.length) {
    ranges.push({ startLine: lines.length - tail.lines.length + 1, endLine: lines.length });
  }
  return {
    content: truncateUtf8(excerpt, maxBytes),
    mode: 'excerpt',
    truncated: true,
    totalLines: lines.length,
    ranges
  };
}

function summarizePackageLock(content, fileBytes, digest) {
  try {
    const parsed = JSON.parse(content);
    const rootPackage = parsed && parsed.packages && parsed.packages[''] ? parsed.packages[''] : {};
    return {
      content: JSON.stringify({
        summary: 'package lock metadata; dependency graph omitted',
        name: parsed.name || rootPackage.name || null,
        version: parsed.version || rootPackage.version || null,
        lockfileVersion: parsed.lockfileVersion || null,
        packageCount: parsed.packages && typeof parsed.packages === 'object' ? Object.keys(parsed.packages).length : null,
        dependencyCount: parsed.dependencies && typeof parsed.dependencies === 'object' ? Object.keys(parsed.dependencies).length : null,
        rootDependencies: rootPackage.dependencies || {},
        rootDevDependencies: rootPackage.devDependencies || {},
        fileBytes,
        sha256: digest
      }, null, 2),
      mode: 'summary',
      truncated: true,
      totalLines: content.split('\n').length,
      ranges: []
    };
  } catch (error) {
    return createTextExcerpt(content, 2048);
  }
}

function summarizeTextLockfile(content, fileBytes, digest) {
  const excerpt = createTextExcerpt(content, 2048);
  return {
    ...excerpt,
    content: [
      `Lockfile summary: ${fileBytes} bytes; sha256=${digest}; full dependency graph omitted.`,
      excerpt.content
    ].join('\n'),
    mode: 'summary',
    truncated: true
  };
}

function summarizeCompiledFile(content, fileBytes, digest, maxBytes = 3072) {
  const excerptBudget = Math.max(256, Math.min(maxBytes - 180, 2048, Math.floor(fileBytes / 2)));
  const excerpt = createTextExcerpt(content, excerptBudget);
  return {
    ...excerpt,
    content: [
      `Compiled artifact summary: ${fileBytes} bytes; sha256=${digest}. Prefer editable source files when proposing patches.`,
      excerpt.content
    ].join('\n'),
    mode: 'summary',
    truncated: true
  };
}

function createFileRepresentation(file, maxBytes) {
  const buffer = fs.readFileSync(file.absolutePath);
  const digest = sha256(buffer);
  const content = buffer.toString('utf8').replace(/\r\n/g, '\n');
  const kind = classifyContextFile(file.path);
  let representation;
  if (kind === 'lockfile' && path.posix.basename(file.path).toLowerCase().endsWith('.json')) {
    representation = summarizePackageLock(content, file.size, digest);
  } else if (kind === 'lockfile') {
    representation = summarizeTextLockfile(content, file.size, digest);
  } else if (kind === 'compiled') {
    representation = summarizeCompiledFile(content, file.size, digest, Math.min(maxBytes, 4096));
  } else {
    representation = createTextExcerpt(content, maxBytes);
  }
  return { ...representation, kind, sha256: digest, fileBytes: file.size };
}

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatRanges(ranges) {
  return ranges.length ? ranges.map((range) => `${range.startLine}-${range.endLine}`).join(',') : 'summary';
}

function formatFileSection(file, representation) {
  const attributes = [
    `path="${escapeAttribute(file.path)}"`,
    `kind="${representation.kind}"`,
    `mode="${representation.mode}"`,
    `bytes="${file.size}"`,
    `lines="${representation.totalLines}"`,
    `included-lines="${formatRanges(representation.ranges)}"`,
    `sha256="${representation.sha256}"`
  ].join(' ');
  return `<source ${attributes}>\n${representation.content}\n</source>\n`;
}

function countReasons(items) {
  return items.reduce((counts, item) => {
    counts[item.reason] = (counts[item.reason] || 0) + 1;
    return counts;
  }, {});
}

function buildInventory(files, maxFiles, maxBytes) {
  const lines = ['Scoped readable file inventory (contents follow for the highest-priority files):'];
  let returned = 0;
  for (const file of files.slice(0, maxFiles)) {
    const line = `- ${file.path} (${file.size} bytes; ${classifyContextFile(file.path)})`;
    if (Buffer.byteLength([...lines, line].join('\n'), 'utf8') > maxBytes) {
      break;
    }
    lines.push(line);
    returned += 1;
  }
  if (returned < files.length) {
    lines.push(`- [... ${files.length - returned} additional scoped files available through list_files ...]`);
  }
  return { text: lines.join('\n'), returned, truncated: returned < files.length };
}

function buildStageContext(options) {
  if (!options || typeof options !== 'object') {
    throw new LocalModelToolError('INVALID_CONTEXT_CONFIGURATION', 'buildStageContext requires an options object.');
  }
  const stage = options.stage && typeof options.stage === 'object' ? options.stage : {};
  const readScope = options.readScope || stage.read;
  const writeScope = options.writeScope || stage.write || null;
  const rootInfo = prepareThemeRoot(options.themeDir);
  const readMatcher = createScopeMatcher(readScope);
  const writeMatcher = Array.isArray(writeScope) && writeScope.length ? createScopeMatcher(writeScope) : null;
  const maxTotalBytes = positiveInteger(options.maxTotalBytes, DEFAULT_MAX_TOTAL_BYTES, 'maxTotalBytes');
  const maxFileBytes = Math.min(positiveInteger(options.maxFileBytes, DEFAULT_MAX_FILE_BYTES, 'maxFileBytes'), maxTotalBytes);
  const maxFiles = positiveInteger(options.maxFiles, DEFAULT_MAX_FILES, 'maxFiles');
  const maxInventoryFiles = positiveInteger(options.maxInventoryFiles, DEFAULT_MAX_INVENTORY_FILES, 'maxInventoryFiles');
  const maxInventoryBytes = Math.min(positiveInteger(options.maxInventoryBytes, DEFAULT_MAX_INVENTORY_BYTES, 'maxInventoryBytes'), Math.max(512, Math.floor(maxTotalBytes / 3)));
  const maxWalkEntries = positiveInteger(options.maxWalkEntries, DEFAULT_MAX_WALK_ENTRIES, 'maxWalkEntries');
  const maxReadableFileBytes = positiveInteger(options.maxReadableFileBytes, DEFAULT_MAX_READABLE_FILE_BYTES, 'maxReadableFileBytes');

  const walk = walkThemeFiles({ rootInfo, maxEntries: maxWalkEntries });
  const excluded = walk.skipped.map((item) => ({ path: item.path, reason: item.reason }));
  const eligible = [];

  for (const file of walk.files) {
    if (!readMatcher.matches(file.path)) {
      continue;
    }
    if (isHardExcludedContextPath(file.path)) {
      excluded.push({ path: file.path, reason: 'hard-excluded' });
      continue;
    }
    if (isBinaryFile(file.absolutePath)) {
      excluded.push({ path: file.path, reason: 'binary' });
      continue;
    }
    if (!isContextTextPath(file.path)) {
      excluded.push({ path: file.path, reason: 'unsupported-text-type' });
      continue;
    }
    if (file.size > maxReadableFileBytes) {
      excluded.push({ path: file.path, reason: 'file-size-limit' });
      continue;
    }
    eligible.push(file);
  }

  eligible.sort((left, right) => {
    const priorityDelta = contextPriority(left, writeMatcher) - contextPriority(right, writeMatcher);
    return priorityDelta || left.path.localeCompare(right.path, 'en');
  });

  const inventory = buildInventory(eligible, maxInventoryFiles, maxInventoryBytes);
  const preamble = [
    'Bounded prepared-theme source context.',
    'Only files inside this stage read scope are represented. Treat excerpts and summaries as incomplete; use read-only tools for exact additional source.',
    inventory.text,
    ''
  ].join('\n');
  let text = truncateUtf8(preamble, maxTotalBytes);
  const includedFiles = [];

  for (const file of eligible) {
    if (includedFiles.length >= maxFiles) {
      excluded.push({ path: file.path, reason: 'included-file-count-limit' });
      continue;
    }
    const currentBytes = Buffer.byteLength(text, 'utf8');
    const remaining = maxTotalBytes - currentBytes;
    if (remaining < 384) {
      excluded.push({ path: file.path, reason: 'total-context-budget' });
      continue;
    }
    const representationBudget = Math.min(maxFileBytes, Math.max(128, remaining - 300));
    const representation = createFileRepresentation(file, representationBudget);
    let section = formatFileSection(file, representation);
    if (Buffer.byteLength(section, 'utf8') > remaining) {
      const tighterBudget = Math.max(64, representationBudget - (Buffer.byteLength(section, 'utf8') - remaining) - 32);
      const tighterRepresentation = createFileRepresentation(file, tighterBudget);
      section = formatFileSection(file, tighterRepresentation);
      if (Buffer.byteLength(section, 'utf8') > remaining) {
        excluded.push({ path: file.path, reason: 'total-context-budget' });
        continue;
      }
      Object.assign(representation, tighterRepresentation);
    }
    text += section;
    includedFiles.push({
      path: file.path,
      bytes: file.size,
      includedBytes: Buffer.byteLength(representation.content, 'utf8'),
      kind: representation.kind,
      mode: representation.mode,
      truncated: representation.truncated,
      totalLines: representation.totalLines,
      ranges: representation.ranges,
      sha256: representation.sha256
    });
  }

  if (Buffer.byteLength(text, 'utf8') > maxTotalBytes) {
    text = truncateUtf8(text, maxTotalBytes);
  }
  const summary = {
    stageId: stage.id || options.stageId || null,
    readScope: readMatcher.patterns,
    limits: {
      maxTotalBytes,
      maxFileBytes,
      maxFiles,
      maxInventoryFiles,
      maxInventoryBytes,
      maxWalkEntries,
      maxReadableFileBytes
    },
    discoveredFiles: walk.files.length,
    scopedTextFiles: eligible.length,
    inventoryFiles: inventory.returned,
    inventoryTruncated: inventory.truncated,
    includedFiles,
    excludedCounts: countReasons(excluded),
    excludedFiles: excluded.slice(0, 200),
    excludedFilesTruncated: excluded.length > 200,
    totalBytes: Buffer.byteLength(text, 'utf8'),
    contextTruncated: inventory.truncated || includedFiles.length < eligible.length || includedFiles.some((file) => file.truncated)
  };
  return { text, summary };
}

module.exports = {
  COMPILED_PATH_PATTERNS,
  CONTEXT_TEXT_EXTENSIONS,
  DEFAULT_MAX_FILE_BYTES,
  DEFAULT_MAX_FILES,
  DEFAULT_MAX_TOTAL_BYTES,
  buildStageContext,
  classifyContextFile,
  contextPriority,
  createFileRepresentation,
  createTextExcerpt,
  isContextTextPath,
  isHardExcludedContextPath,
  sha256,
  summarizeCompiledFile,
  summarizePackageLock
};
