'use strict';

const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_MAX_CALLS = 12;
const DEFAULT_MAX_RESPONSE_BYTES = 40 * 1024;
const DEFAULT_MAX_CUMULATIVE_BYTES = 120 * 1024;
const DEFAULT_MAX_WALK_ENTRIES = 5000;
const DEFAULT_MAX_WALK_DEPTH = 32;
const DEFAULT_MAX_TEXT_FILE_BYTES = 5 * 1024 * 1024;
const DEFAULT_MAX_SEARCH_BYTES = 8 * 1024 * 1024;

const BLOCKED_PATH_SEGMENTS = new Set(['node_modules', '.git']);
const BINARY_EXTENSIONS = new Set([
  '.7z', '.avi', '.avif', '.bmp', '.bz2', '.class', '.dll', '.doc', '.docx',
  '.eot', '.exe', '.gif', '.gz', '.ico', '.jar', '.jpeg', '.jpg', '.mov',
  '.mp3', '.mp4', '.otf', '.pdf', '.png', '.psd', '.rar', '.so', '.tar',
  '.tif', '.tiff', '.ttf', '.wav', '.webm', '.webp', '.woff', '.woff2',
  '.xls', '.xlsx', '.zip'
]);

class LocalModelToolError extends Error {
  constructor(code, message, details = undefined) {
    super(message);
    this.name = 'LocalModelToolError';
    this.code = code;
    this.details = details;
  }
}

const TOOL_DEFINITIONS = [
  {
    type: 'function',
    function: {
      name: 'list_files',
      description: 'List readable theme files allowed by this stage. This tool never lists files outside the prepared theme or stage read scope.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Optional relative directory prefix inside the theme.' },
          limit: { type: 'integer', minimum: 1, maximum: 500, default: 200 }
        },
        additionalProperties: false
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Read one complete text file when it fits within the response limit. Use read_file_excerpt for larger files.',
      parameters: {
        type: 'object',
        required: ['path'],
        properties: {
          path: { type: 'string', description: 'Relative file path inside the theme and stage read scope.' }
        },
        additionalProperties: false
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'read_file_excerpt',
      description: 'Read a bounded line range from one text file in the stage read scope.',
      parameters: {
        type: 'object',
        required: ['path'],
        properties: {
          path: { type: 'string', description: 'Relative file path inside the theme and stage read scope.' },
          start_line: { type: 'integer', minimum: 1, default: 1 },
          end_line: { type: 'integer', minimum: 1, description: 'Inclusive end line. At most 400 lines may be requested.' }
        },
        additionalProperties: false
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_files',
      description: 'Search allowed text files for a literal string. Results are deterministic, bounded, and contain line excerpts only.',
      parameters: {
        type: 'object',
        required: ['query'],
        properties: {
          query: { type: 'string', minLength: 1, maxLength: 256, description: 'Literal text to find; regular expressions are not supported.' },
          path: { type: 'string', description: 'Optional relative directory prefix inside the theme.' },
          case_sensitive: { type: 'boolean', default: true },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 50 }
        },
        additionalProperties: false
      }
    }
  }
];

function normalizeRelativePath(input, options = {}) {
  const allowEmpty = options.allowEmpty === true;
  if (typeof input !== 'string') {
    throw new LocalModelToolError('INVALID_PATH', 'Path must be a string.');
  }
  if (input.includes('\0')) {
    throw new LocalModelToolError('INVALID_PATH', 'Path must not contain a null byte.');
  }
  if (input !== input.trim()) {
    throw new LocalModelToolError('INVALID_PATH', 'Path must not contain leading or trailing whitespace.');
  }
  if (!input) {
    if (allowEmpty) {
      return '';
    }
    throw new LocalModelToolError('INVALID_PATH', 'Path must not be empty.');
  }
  if (/^[a-zA-Z]:/.test(input) || /^[/\\]{2}/.test(input) || path.win32.isAbsolute(input) || path.posix.isAbsolute(input)) {
    throw new LocalModelToolError('UNSAFE_PATH', 'Absolute, drive-qualified, and UNC paths are not allowed.');
  }

  const normalized = input.replace(/\\/g, '/');
  const segments = normalized.split('/');
  if (segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    throw new LocalModelToolError('UNSAFE_PATH', 'Path traversal, dot segments, and empty path segments are not allowed.');
  }
  if (segments.some((segment) => segment.includes(':'))) {
    throw new LocalModelToolError('UNSAFE_PATH', 'Colon-qualified path segments are not allowed.');
  }
  if (segments.some((segment) => BLOCKED_PATH_SEGMENTS.has(segment.toLowerCase()))) {
    throw new LocalModelToolError('PATH_DENIED', 'node_modules and repository metadata are not readable by local-model tools.');
  }
  return segments.join('/');
}

function normalizeScopePattern(input) {
  if (typeof input !== 'string' || !input) {
    throw new LocalModelToolError('INVALID_SCOPE', 'Read-scope patterns must be non-empty strings.');
  }
  if (input.includes('\0') || input !== input.trim()) {
    throw new LocalModelToolError('INVALID_SCOPE', 'Read-scope patterns contain invalid characters or whitespace.');
  }
  if (/^[a-zA-Z]:/.test(input) || /^[/\\]{2}/.test(input) || path.win32.isAbsolute(input) || path.posix.isAbsolute(input)) {
    throw new LocalModelToolError('INVALID_SCOPE', 'Read-scope patterns must be relative to the theme root.');
  }
  const normalized = input.replace(/\\/g, '/');
  const segments = normalized.split('/');
  if (segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    throw new LocalModelToolError('INVALID_SCOPE', 'Read-scope patterns may not contain traversal, dot, or empty segments.');
  }
  if (segments.some((segment) => segment.includes(':'))) {
    throw new LocalModelToolError('INVALID_SCOPE', 'Read-scope patterns may not contain colon-qualified segments.');
  }
  if (segments.some((segment) => BLOCKED_PATH_SEGMENTS.has(segment.toLowerCase()))) {
    throw new LocalModelToolError('INVALID_SCOPE', 'Read scope may not include node_modules or repository metadata.');
  }
  return segments.join('/');
}

function globToRegExp(pattern, options = {}) {
  const normalized = normalizeScopePattern(pattern);
  let source = '^';
  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    if (char === '*') {
      if (normalized[index + 1] === '*') {
        index += 1;
        if (normalized[index + 1] === '/') {
          index += 1;
          source += '(?:.*/)?';
        } else {
          source += '.*';
        }
      } else {
        source += '[^/]*';
      }
    } else if (char === '?') {
      source += '[^/]';
    } else {
      source += char.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
    }
  }
  source += '$';
  return new RegExp(source, options.caseInsensitive ? 'i' : '');
}

function createScopeMatcher(readScope, options = {}) {
  if (!Array.isArray(readScope) || !readScope.length) {
    throw new LocalModelToolError('INVALID_SCOPE', 'A non-empty stage read scope is required.');
  }
  const normalized = [...new Set(readScope.map(normalizeScopePattern))];
  const caseInsensitive = options.caseInsensitive === undefined ? process.platform === 'win32' : Boolean(options.caseInsensitive);
  const regexes = normalized.map((pattern) => globToRegExp(pattern, { caseInsensitive }));
  return {
    patterns: normalized,
    matches(relPath) {
      const safePath = normalizeRelativePath(relPath);
      return regexes.some((regex) => regex.test(safePath));
    }
  };
}

function matchesScope(relPath, readScope, options = {}) {
  return createScopeMatcher(readScope, options).matches(relPath);
}

function prepareThemeRoot(themeDir) {
  if (typeof themeDir !== 'string' || !themeDir) {
    throw new LocalModelToolError('INVALID_THEME_DIR', 'themeDir must be a non-empty string.');
  }
  const rootPath = path.resolve(themeDir);
  let rootStat;
  try {
    rootStat = fs.lstatSync(rootPath);
  } catch (error) {
    throw new LocalModelToolError('INVALID_THEME_DIR', 'Prepared theme directory does not exist.', { cause: error.code });
  }
  if (rootStat.isSymbolicLink()) {
    throw new LocalModelToolError('SYMLINK_DENIED', 'Prepared theme directory may not be a symbolic link or junction.');
  }
  if (!rootStat.isDirectory()) {
    throw new LocalModelToolError('INVALID_THEME_DIR', 'Prepared theme path is not a directory.');
  }
  const rootRealPath = fs.realpathSync.native ? fs.realpathSync.native(rootPath) : fs.realpathSync(rootPath);
  return { rootPath, rootRealPath };
}

function isPathInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function assertNoSymlinkComponents(rootInfo, relPath) {
  const segments = normalizeRelativePath(relPath).split('/');
  let current = rootInfo.rootPath;
  for (const segment of segments) {
    current = path.join(current, segment);
    let stat;
    try {
      stat = fs.lstatSync(current);
    } catch (error) {
      throw new LocalModelToolError('FILE_NOT_FOUND', `Readable theme path does not exist: ${relPath}`, { path: relPath });
    }
    if (stat.isSymbolicLink()) {
      throw new LocalModelToolError('SYMLINK_DENIED', `Symbolic links and junctions are not readable: ${relPath}`, { path: relPath });
    }
  }
}

function resolveScopedFile(rootInfo, relPath, scopeMatcher) {
  const normalized = normalizeRelativePath(relPath);
  if (!scopeMatcher.matches(normalized)) {
    throw new LocalModelToolError('READ_SCOPE_DENIED', `Path is outside this stage's read scope: ${normalized}`, { path: normalized });
  }
  const targetPath = path.resolve(rootInfo.rootPath, ...normalized.split('/'));
  if (!isPathInside(rootInfo.rootPath, targetPath) || targetPath === rootInfo.rootPath) {
    throw new LocalModelToolError('UNSAFE_PATH', `Path escapes the prepared theme directory: ${normalized}`, { path: normalized });
  }
  assertNoSymlinkComponents(rootInfo, normalized);
  const stat = fs.lstatSync(targetPath);
  if (!stat.isFile()) {
    throw new LocalModelToolError('NOT_A_FILE', `Readable path is not a regular file: ${normalized}`, { path: normalized });
  }
  const realPath = fs.realpathSync.native ? fs.realpathSync.native(targetPath) : fs.realpathSync(targetPath);
  if (!isPathInside(rootInfo.rootRealPath, realPath) || realPath === rootInfo.rootRealPath) {
    throw new LocalModelToolError('SYMLINK_ESCAPE', `Resolved path escapes the prepared theme directory: ${normalized}`, { path: normalized });
  }
  return { path: normalized, absolutePath: targetPath, realPath, stat };
}

function walkThemeFiles(options) {
  const rootInfo = options.rootInfo || prepareThemeRoot(options.themeDir);
  const maxEntries = positiveInteger(options.maxEntries, DEFAULT_MAX_WALK_ENTRIES, 'maxEntries');
  const maxDepth = positiveInteger(options.maxDepth, DEFAULT_MAX_WALK_DEPTH, 'maxDepth');
  const files = [];
  const skipped = [];
  let visitedEntries = 0;

  function visit(directoryPath, relativeDirectory, depth) {
    if (depth > maxDepth) {
      skipped.push({ path: relativeDirectory || '.', reason: 'max-depth' });
      return;
    }
    let entries;
    try {
      entries = fs.readdirSync(directoryPath, { withFileTypes: true })
        .sort((left, right) => left.name.localeCompare(right.name, 'en'));
    } catch (error) {
      skipped.push({ path: relativeDirectory || '.', reason: 'unreadable-directory' });
      return;
    }

    for (const entry of entries) {
      visitedEntries += 1;
      if (visitedEntries > maxEntries) {
        throw new LocalModelToolError('WALK_LIMIT_EXCEEDED', `Theme walk exceeded ${maxEntries} entries. Narrow the stage read scope.`, { maxEntries });
      }
      const relPath = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
      const segments = relPath.split('/');
      if (segments.some((segment) => BLOCKED_PATH_SEGMENTS.has(segment.toLowerCase()))) {
        skipped.push({ path: relPath, reason: 'blocked-directory' });
        continue;
      }
      const absolutePath = path.join(directoryPath, entry.name);
      let stat;
      try {
        stat = fs.lstatSync(absolutePath);
      } catch (error) {
        skipped.push({ path: relPath, reason: 'unreadable-entry' });
        continue;
      }
      if (stat.isSymbolicLink()) {
        skipped.push({ path: relPath, reason: 'symlink' });
        continue;
      }
      if (stat.isDirectory()) {
        visit(absolutePath, relPath, depth + 1);
        continue;
      }
      if (!stat.isFile()) {
        skipped.push({ path: relPath, reason: 'non-regular-file' });
        continue;
      }
      const realPath = fs.realpathSync.native ? fs.realpathSync.native(absolutePath) : fs.realpathSync(absolutePath);
      if (!isPathInside(rootInfo.rootRealPath, realPath)) {
        skipped.push({ path: relPath, reason: 'realpath-escape' });
        continue;
      }
      files.push({ path: relPath.replace(/\\/g, '/'), absolutePath, realPath, size: stat.size, stat });
    }
  }

  visit(rootInfo.rootPath, '', 0);
  files.sort((left, right) => left.path.localeCompare(right.path, 'en'));
  return { ...rootInfo, files, skipped, visitedEntries };
}

function isProbablyBinaryBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || !buffer.length) {
    return false;
  }
  let suspicious = 0;
  for (const byte of buffer) {
    if (byte === 0) {
      return true;
    }
    if (byte < 7 || (byte > 13 && byte < 32)) {
      suspicious += 1;
    }
  }
  return suspicious / buffer.length > 0.3;
}

function isBinaryFile(filePath, options = {}) {
  if (BINARY_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
    return true;
  }
  const sampleBytes = positiveInteger(options.sampleBytes, 8192, 'sampleBytes');
  const descriptor = fs.openSync(filePath, 'r');
  try {
    const buffer = Buffer.alloc(sampleBytes);
    const bytesRead = fs.readSync(descriptor, buffer, 0, buffer.length, 0);
    return isProbablyBinaryBuffer(buffer.subarray(0, bytesRead));
  } finally {
    fs.closeSync(descriptor);
  }
}

function truncateUtf8(value, maxBytes) {
  if (Buffer.byteLength(value, 'utf8') <= maxBytes) {
    return value;
  }
  if (maxBytes <= 0) {
    return '';
  }
  const buffer = Buffer.from(value, 'utf8').subarray(0, maxBytes);
  return buffer.toString('utf8').replace(/\uFFFD$/, '');
}

function parseArguments(rawArguments) {
  if (rawArguments === undefined || rawArguments === null || rawArguments === '') {
    return {};
  }
  if (typeof rawArguments === 'string') {
    try {
      const parsed = JSON.parse(rawArguments);
      if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
        throw new Error('Tool arguments must be a JSON object.');
      }
      return parsed;
    } catch (error) {
      throw new LocalModelToolError('INVALID_ARGUMENTS_JSON', `Tool arguments are not valid JSON: ${error.message}`);
    }
  }
  if (Array.isArray(rawArguments) || typeof rawArguments !== 'object') {
    throw new LocalModelToolError('INVALID_ARGUMENTS', 'Tool arguments must be an object.');
  }
  return rawArguments;
}

function assertAllowedKeys(args, allowedKeys) {
  const unknown = Object.keys(args).filter((key) => !allowedKeys.includes(key));
  if (unknown.length) {
    throw new LocalModelToolError('INVALID_ARGUMENTS', `Unsupported tool argument(s): ${unknown.sort().join(', ')}`);
  }
}

function boundedInteger(value, fallback, minimum, maximum, name) {
  const selected = value === undefined ? fallback : value;
  if (!Number.isInteger(selected) || selected < minimum || selected > maximum) {
    throw new LocalModelToolError('INVALID_ARGUMENTS', `${name} must be an integer from ${minimum} to ${maximum}.`);
  }
  return selected;
}

function positiveInteger(value, fallback, name) {
  const selected = value === undefined ? fallback : value;
  if (!Number.isInteger(selected) || selected <= 0) {
    throw new LocalModelToolError('INVALID_CONFIGURATION', `${name} must be a positive integer.`);
  }
  return selected;
}

function normalizePrefix(value) {
  return value === undefined || value === '' ? '' : normalizeRelativePath(value);
}

function pathHasPrefix(relPath, prefix) {
  if (!prefix) {
    return true;
  }
  const insensitive = process.platform === 'win32';
  const candidate = insensitive ? relPath.toLowerCase() : relPath;
  const expected = insensitive ? prefix.toLowerCase() : prefix;
  return candidate === expected || candidate.startsWith(`${expected}/`);
}

function serializableError(toolName, error) {
  const known = error instanceof LocalModelToolError;
  return {
    ok: false,
    tool: toolName,
    error: {
      code: known ? error.code : 'TOOL_FAILURE',
      message: known ? error.message : 'The read-only tool failed without exposing filesystem internals.',
      ...(known && error.details ? { details: error.details } : {})
    }
  };
}

function byteLengthJson(value) {
  return Buffer.byteLength(JSON.stringify(value), 'utf8');
}

function fitCollectionResponse(baseResult, itemsKey, maxBytes) {
  const items = baseResult.result[itemsKey];
  while (items.length && byteLengthJson(baseResult) > maxBytes) {
    items.pop();
    baseResult.result.truncated = true;
  }
  if (byteLengthJson(baseResult) > maxBytes) {
    throw new LocalModelToolError('RESPONSE_TOO_LARGE', 'Tool metadata exceeds the configured response limit. Narrow the request.');
  }
  return baseResult;
}

function createReadOnlyTools(options) {
  if (!options || typeof options !== 'object') {
    throw new LocalModelToolError('INVALID_CONFIGURATION', 'createReadOnlyTools requires an options object.');
  }
  const rootInfo = prepareThemeRoot(options.themeDir);
  const scopeMatcher = createScopeMatcher(options.readScope);
  const maxCalls = positiveInteger(options.maxCalls, DEFAULT_MAX_CALLS, 'maxCalls');
  const maxResponseBytes = positiveInteger(options.maxResponseBytes, DEFAULT_MAX_RESPONSE_BYTES, 'maxResponseBytes');
  const maxCumulativeBytes = positiveInteger(options.maxCumulativeBytes, DEFAULT_MAX_CUMULATIVE_BYTES, 'maxCumulativeBytes');
  const maxWalkEntries = positiveInteger(options.maxWalkEntries, DEFAULT_MAX_WALK_ENTRIES, 'maxWalkEntries');
  const maxTextFileBytes = positiveInteger(options.maxTextFileBytes, DEFAULT_MAX_TEXT_FILE_BYTES, 'maxTextFileBytes');
  const maxSearchBytes = positiveInteger(options.maxSearchBytes, DEFAULT_MAX_SEARCH_BYTES, 'maxSearchBytes');
  const onRecord = typeof options.onRecord === 'function' ? options.onRecord : null;
  const state = { calls: 0, responseBytes: 0, exhausted: false };

  function scopedFiles() {
    const walk = walkThemeFiles({ rootInfo, maxEntries: maxWalkEntries });
    return {
      files: walk.files.filter((file) => scopeMatcher.matches(file.path)),
      skipped: walk.skipped
    };
  }

  function listFiles(args) {
    assertAllowedKeys(args, ['path', 'limit']);
    const prefix = normalizePrefix(args.path);
    const limit = boundedInteger(args.limit, 200, 1, 500, 'limit');
    const walk = scopedFiles();
    const matching = walk.files.filter((file) => pathHasPrefix(file.path, prefix));
    const result = {
      ok: true,
      tool: 'list_files',
      result: {
        path: prefix || '.',
        files: matching.slice(0, limit).map((file) => ({ path: file.path, bytes: file.size })),
        matched: matching.length,
        returned: Math.min(matching.length, limit),
        truncated: matching.length > limit,
        skippedUnsafeEntries: walk.skipped.filter((item) => item.reason === 'symlink' || item.reason === 'realpath-escape').length
      }
    };
    return fitCollectionResponse(result, 'files', maxResponseBytes);
  }

  function readFile(args) {
    assertAllowedKeys(args, ['path']);
    const resolved = resolveScopedFile(rootInfo, args.path, scopeMatcher);
    if (isBinaryFile(resolved.absolutePath)) {
      throw new LocalModelToolError('BINARY_FILE_DENIED', `Binary files cannot be read: ${resolved.path}`, { path: resolved.path });
    }
    if (resolved.stat.size > maxTextFileBytes) {
      throw new LocalModelToolError('FILE_SIZE_LIMIT', `Text file exceeds the ${maxTextFileBytes}-byte safety limit: ${resolved.path}`, { path: resolved.path, bytes: resolved.stat.size });
    }
    const content = fs.readFileSync(resolved.absolutePath, 'utf8').replace(/\r\n/g, '\n');
    const result = {
      ok: true,
      tool: 'read_file',
      result: {
        path: resolved.path,
        bytes: resolved.stat.size,
        lines: content ? content.split('\n').length : 0,
        content
      }
    };
    if (byteLengthJson(result) > maxResponseBytes) {
      throw new LocalModelToolError('FILE_TOO_LARGE_FOR_RESPONSE', `File does not fit in one tool response; use read_file_excerpt: ${resolved.path}`, { path: resolved.path, bytes: resolved.stat.size });
    }
    return result;
  }

  function readFileExcerpt(args) {
    assertAllowedKeys(args, ['path', 'start_line', 'end_line']);
    const resolved = resolveScopedFile(rootInfo, args.path, scopeMatcher);
    if (isBinaryFile(resolved.absolutePath)) {
      throw new LocalModelToolError('BINARY_FILE_DENIED', `Binary files cannot be read: ${resolved.path}`, { path: resolved.path });
    }
    if (resolved.stat.size > maxTextFileBytes) {
      throw new LocalModelToolError('FILE_SIZE_LIMIT', `Text file exceeds the ${maxTextFileBytes}-byte safety limit: ${resolved.path}`, { path: resolved.path, bytes: resolved.stat.size });
    }
    const content = fs.readFileSync(resolved.absolutePath, 'utf8').replace(/\r\n/g, '\n');
    const lines = content.split('\n');
    const startLine = boundedInteger(args.start_line, 1, 1, Math.max(1, lines.length), 'start_line');
    const defaultEnd = Math.min(lines.length, startLine + 199);
    const endLine = boundedInteger(args.end_line, defaultEnd, startLine, Math.min(lines.length, startLine + 399), 'end_line');
    const selected = lines.slice(startLine - 1, endLine);
    const result = {
      ok: true,
      tool: 'read_file_excerpt',
      result: {
        path: resolved.path,
        fileBytes: resolved.stat.size,
        totalLines: lines.length,
        startLine,
        endLine,
        content: selected.join('\n'),
        contentTruncated: false
      }
    };
    if (byteLengthJson(result) > maxResponseBytes) {
      const emptyBytes = byteLengthJson({ ...result, result: { ...result.result, content: '', contentTruncated: true } });
      const available = Math.max(0, maxResponseBytes - emptyBytes - 8);
      result.result.content = truncateUtf8(result.result.content, available);
      result.result.contentTruncated = true;
    }
    if (byteLengthJson(result) > maxResponseBytes) {
      throw new LocalModelToolError('RESPONSE_TOO_LARGE', 'Requested excerpt does not fit the response limit. Request a smaller line range.', { path: resolved.path });
    }
    return result;
  }

  function searchFiles(args) {
    assertAllowedKeys(args, ['query', 'path', 'case_sensitive', 'limit']);
    if (typeof args.query !== 'string' || !args.query || args.query.length > 256 || /[\0\r\n]/.test(args.query)) {
      throw new LocalModelToolError('INVALID_ARGUMENTS', 'query must be 1-256 characters and may not contain null bytes or line breaks.');
    }
    if (args.case_sensitive !== undefined && typeof args.case_sensitive !== 'boolean') {
      throw new LocalModelToolError('INVALID_ARGUMENTS', 'case_sensitive must be a boolean.');
    }
    const prefix = normalizePrefix(args.path);
    const caseSensitive = args.case_sensitive !== false;
    const limit = boundedInteger(args.limit, 50, 1, 100, 'limit');
    const needle = caseSensitive ? args.query : args.query.toLocaleLowerCase('en-US');
    const walk = scopedFiles();
    const matches = [];
    let scannedFiles = 0;
    let scannedBytes = 0;
    let skippedBinaryFiles = 0;
    let skippedLargeFiles = 0;
    let scanLimitReached = false;

    for (const file of walk.files) {
      if (!pathHasPrefix(file.path, prefix)) {
        continue;
      }
      if (file.size > maxTextFileBytes || scannedBytes + file.size > maxSearchBytes) {
        skippedLargeFiles += 1;
        if (scannedBytes + file.size > maxSearchBytes) {
          scanLimitReached = true;
        }
        continue;
      }
      if (isBinaryFile(file.absolutePath)) {
        skippedBinaryFiles += 1;
        continue;
      }
      const content = fs.readFileSync(file.absolutePath, 'utf8').replace(/\r\n/g, '\n');
      scannedFiles += 1;
      scannedBytes += file.size;
      const lines = content.split('\n');
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
        const haystack = caseSensitive ? lines[lineIndex] : lines[lineIndex].toLocaleLowerCase('en-US');
        const column = haystack.indexOf(needle);
        if (column === -1) {
          continue;
        }
        matches.push({
          path: file.path,
          line: lineIndex + 1,
          column: column + 1,
          excerpt: truncateUtf8(lines[lineIndex].trim(), 320)
        });
        if (matches.length >= limit) {
          break;
        }
      }
      if (matches.length >= limit) {
        break;
      }
    }

    const result = {
      ok: true,
      tool: 'search_files',
      result: {
        path: prefix || '.',
        caseSensitive,
        matches,
        returned: matches.length,
        truncated: matches.length >= limit || scanLimitReached,
        scannedFiles,
        scannedBytes,
        skippedBinaryFiles,
        skippedLargeFiles
      }
    };
    return fitCollectionResponse(result, 'matches', maxResponseBytes);
  }

  const handlers = {
    list_files: listFiles,
    read_file: readFile,
    read_file_excerpt: readFileExcerpt,
    search_files: searchFiles
  };

  function record(metadata) {
    if (!onRecord) {
      return;
    }
    try {
      onRecord(metadata);
    } catch (error) {
      // Evidence callbacks must not change tool behavior.
    }
  }

  function execute(toolName, rawArguments) {
    const startedAt = Date.now();
    state.calls += 1;
    let response;
    let parsedArgs = null;

    try {
      if (state.calls > maxCalls) {
        throw new LocalModelToolError('TOOL_CALL_LIMIT', `Stage tool-call limit of ${maxCalls} has been reached. Produce the final unified diff now.`);
      }
      if (state.exhausted) {
        throw new LocalModelToolError('CUMULATIVE_OUTPUT_LIMIT', 'Stage tool-output budget is exhausted. Produce the final unified diff now.');
      }
      if (typeof toolName !== 'string' || !handlers[toolName]) {
        throw new LocalModelToolError('UNKNOWN_TOOL', `Unknown read-only tool: ${String(toolName)}`);
      }
      parsedArgs = parseArguments(rawArguments);
      response = handlers[toolName](parsedArgs);
    } catch (error) {
      response = serializableError(typeof toolName === 'string' ? toolName : 'unknown', error);
    }

    let serialized = JSON.stringify(response);
    if (Buffer.byteLength(serialized, 'utf8') > maxResponseBytes) {
      serialized = JSON.stringify(serializableError(toolName, new LocalModelToolError('RESPONSE_TOO_LARGE', 'Tool response exceeded the configured byte limit. Narrow the request.')));
    }

    let responseBytes = Buffer.byteLength(serialized, 'utf8');
    const remainingBytes = Math.max(0, maxCumulativeBytes - state.responseBytes);
    if (responseBytes > remainingBytes) {
      const budgetResponse = serializableError(toolName, new LocalModelToolError('CUMULATIVE_OUTPUT_LIMIT', 'Stage tool-output budget is exhausted. Produce the final unified diff now.'));
      serialized = JSON.stringify(budgetResponse);
      responseBytes = Buffer.byteLength(serialized, 'utf8');
      state.exhausted = true;
      if (responseBytes > remainingBytes) {
        serialized = '';
        responseBytes = 0;
      }
    }
    state.responseBytes += responseBytes;

    let parsedResponse = null;
    if (serialized) {
      parsedResponse = JSON.parse(serialized);
      if (parsedResponse.error && parsedResponse.error.code === 'CUMULATIVE_OUTPUT_LIMIT') {
        state.exhausted = true;
      }
    }
    record({
      tool: typeof toolName === 'string' ? toolName : 'unknown',
      callIndex: state.calls,
      ok: Boolean(parsedResponse && parsedResponse.ok),
      errorCode: parsedResponse && parsedResponse.error ? parsedResponse.error.code : null,
      path: parsedArgs && typeof parsedArgs.path === 'string' ? parsedArgs.path : null,
      queryBytes: parsedArgs && typeof parsedArgs.query === 'string' ? Buffer.byteLength(parsedArgs.query, 'utf8') : 0,
      responseBytes,
      cumulativeResponseBytes: state.responseBytes,
      durationMs: Date.now() - startedAt
    });
    return serialized;
  }

  return {
    definitions: TOOL_DEFINITIONS,
    execute,
    getUsage() {
      return {
        calls: state.calls,
        maxCalls,
        responseBytes: state.responseBytes,
        maxResponseBytes,
        maxCumulativeBytes,
        exhausted: state.exhausted
      };
    }
  };
}

module.exports = {
  BINARY_EXTENSIONS,
  DEFAULT_MAX_CALLS,
  DEFAULT_MAX_CUMULATIVE_BYTES,
  DEFAULT_MAX_RESPONSE_BYTES,
  LocalModelToolError,
  TOOL_DEFINITIONS,
  createReadOnlyTools,
  createScopeMatcher,
  globToRegExp,
  isBinaryFile,
  isPathInside,
  isProbablyBinaryBuffer,
  matchesScope,
  normalizeRelativePath,
  normalizeScopePattern,
  prepareThemeRoot,
  resolveScopedFile,
  truncateUtf8,
  walkThemeFiles
};
