'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const {
  ProtocolError,
  normalizeDiffText,
  rejectLegacyFileBlocks
} = require('./protocols');
const { matchesScope: matchesSharedScope } = require('./tools');

const HUNK_RE = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(?:.*)$/;
const BINARY_RE = /^GIT binary patch$|^Binary files .+ differ$/m;
const FORBIDDEN_ROOTS = new Set(['.git', 'node_modules']);
const WINDOWS_RESERVED_NAME_RE = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i;

class PatchError extends ProtocolError {
  constructor(message, options = {}) {
    super(message, { ...options, code: options.code || 'PATCH_ERROR' });
    this.name = 'PatchError';
  }
}

function parseUnifiedDiffPaths(input) {
  const patch = normalizeDiffText(input);
  rejectLegacyFileBlocks(patch);
  if (!patch) {
    throw new PatchError('Unified diff is empty.', { code: 'EMPTY_PATCH' });
  }
  if (patch.includes('\0') || BINARY_RE.test(patch)) {
    throw new PatchError('Binary patches are not accepted.', { code: 'BINARY_PATCH' });
  }
  if (/^```/m.test(patch)) {
    throw new PatchError('Patch application expects an extracted raw unified diff, not a code fence.', {
      code: 'UNEXTRACTED_PATCH_FENCE'
    });
  }

  const lines = patch.split('\n');
  const files = lines[0].startsWith('diff --git ')
    ? parseGitSections(lines)
    : parsePlainSections(lines);
  if (!files.length) {
    throw new PatchError('Unified diff did not contain a file patch.', { code: 'MALFORMED_PATCH' });
  }

  const seen = new Map();
  for (const file of files) {
    const key = canonicalPathKey(file.path);
    if (seen.has(key)) {
      throw new PatchError(`Unified diff contains duplicate patches for "${file.path}".`, {
        code: 'DUPLICATE_PATCH_PATH',
        details: { path: file.path, firstSection: seen.get(key), section: file.section }
      });
    }
    seen.set(key, file.section);
  }
  return files;
}

function parseGitSections(lines) {
  const sections = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith('diff --git ')) {
      if (current) {
        sections.push(current);
      }
      current = [line];
      continue;
    }
    if (!current) {
      throw new PatchError('Unexpected content before the first diff --git header.', {
        code: 'MALFORMED_PATCH'
      });
    }
    current.push(line);
  }
  if (current) {
    sections.push(current);
  }
  return sections.map((section, index) => parseGitSection(section, index + 1));
}

function parseGitSection(lines, section) {
  const marker = parseDiffGitLine(lines[0], section);
  let cursor = 1;
  let newFileMode = null;
  let deletedFileMode = null;

  while (cursor < lines.length && !lines[cursor].startsWith('--- ')) {
    const line = lines[cursor];
    if (BINARY_RE.test(line)) {
      throw new PatchError(`Binary patch in section ${section} is not accepted.`, { code: 'BINARY_PATCH' });
    }
    if (/^(?:old mode|new mode) \d{6}$/.test(line)) {
      throw new PatchError(`File-mode changes are not supported in section ${section}.`, {
        code: 'UNSUPPORTED_MODE_CHANGE'
      });
    }
    if (/^(?:rename|copy) (?:from|to) /.test(line) || /^(?:similarity|dissimilarity) index /.test(line)) {
      throw new PatchError(`Rename and copy patches are not supported in section ${section}; use explicit create/delete patches.`, {
        code: 'UNSUPPORTED_RENAME_OR_COPY'
      });
    }
    let match = line.match(/^new file mode (\d{6})$/);
    if (match) {
      assertSafeRegularMode(match[1], section);
      newFileMode = match[1];
      cursor += 1;
      continue;
    }
    match = line.match(/^deleted file mode (\d{6})$/);
    if (match) {
      assertSafeRegularMode(match[1], section);
      deletedFileMode = match[1];
      cursor += 1;
      continue;
    }
    match = line.match(/^index [0-9a-f]+\.\.[0-9a-f]+(?: (\d{6}))?$/i);
    if (match) {
      if (match[1]) {
        assertSafeRegularMode(match[1], section);
      }
      cursor += 1;
      continue;
    }
    throw new PatchError(`Malformed or unsupported patch metadata in section ${section}: ${line || '(blank line)'}`, {
      code: 'MALFORMED_PATCH',
      details: { section, line: cursor + 1 }
    });
  }

  const headers = parseHeaderPair(lines, cursor, section);
  cursor = headers.next;
  const hunks = parseHunks(lines, cursor, section, false);
  const file = buildFileEntry(headers.oldPath, headers.newPath, section);
  file.hunks = hunks.count;
  file.gitOldPath = marker.oldPath;
  file.gitNewPath = marker.newPath;
  file.newFileMode = newFileMode;
  file.deletedFileMode = deletedFileMode;

  if (marker.oldPath !== file.path || marker.newPath !== file.path) {
    throw new PatchError(`diff --git paths do not match the unified headers in section ${section}.`, {
      code: 'MISMATCHED_PATCH_HEADERS',
      details: {
        section,
        gitOldPath: marker.oldPath,
        gitNewPath: marker.newPath,
        oldPath: file.oldPath,
        newPath: file.newPath
      }
    });
  }
  if (newFileMode && file.operation !== 'create') {
    throw new PatchError(`new file mode does not describe a create patch in section ${section}.`, {
      code: 'MISMATCHED_PATCH_HEADERS'
    });
  }
  if (deletedFileMode && file.operation !== 'delete') {
    throw new PatchError(`deleted file mode does not describe a delete patch in section ${section}.`, {
      code: 'MISMATCHED_PATCH_HEADERS'
    });
  }
  if (newFileMode && deletedFileMode) {
    throw new PatchError(`Section ${section} cannot both create and delete a file.`, {
      code: 'MISMATCHED_PATCH_HEADERS'
    });
  }
  return file;
}

function parsePlainSections(lines) {
  const files = [];
  let cursor = 0;
  let section = 1;
  while (cursor < lines.length) {
    const headers = parseHeaderPair(lines, cursor, section);
    const hunks = parseHunks(lines, headers.next, section, true);
    const file = buildFileEntry(headers.oldPath, headers.newPath, section);
    file.hunks = hunks.count;
    files.push(file);
    cursor = hunks.next;
    section += 1;
  }
  return files;
}

function parseHeaderPair(lines, cursor, section) {
  if (cursor >= lines.length || !lines[cursor].startsWith('--- ')) {
    throw new PatchError(`Section ${section} is missing its --- file header.`, {
      code: 'MALFORMED_PATCH',
      details: { section }
    });
  }
  if (cursor + 1 >= lines.length || !lines[cursor + 1].startsWith('+++ ')) {
    throw new PatchError(`Section ${section} is missing the matching +++ file header.`, {
      code: 'MALFORMED_PATCH',
      details: { section }
    });
  }
  return {
    oldPath: parseUnifiedHeaderPath(lines[cursor], 'old', section),
    newPath: parseUnifiedHeaderPath(lines[cursor + 1], 'new', section),
    next: cursor + 2
  };
}

function parseHunks(lines, cursor, section, allowNextSection) {
  let count = 0;
  while (cursor < lines.length) {
    if (allowNextSection && count && lines[cursor].startsWith('--- ')) {
      return { count, next: cursor };
    }
    const match = lines[cursor].match(HUNK_RE);
    if (!match) {
      throw new PatchError(`Expected a hunk header in section ${section}, found: ${lines[cursor] || '(blank line)'}`, {
        code: 'MALFORMED_PATCH',
        details: { section, line: cursor + 1 }
      });
    }
    let oldRemaining = match[2] === undefined ? 1 : Number(match[2]);
    let newRemaining = match[4] === undefined ? 1 : Number(match[4]);
    cursor += 1;
    count += 1;

    while (oldRemaining > 0 || newRemaining > 0) {
      if (cursor >= lines.length) {
        throw new PatchError(`Hunk ${count} in section ${section} ended before its declared line counts.`, {
          code: 'MALFORMED_PATCH'
        });
      }
      const line = lines[cursor];
      if (line === '\\ No newline at end of file') {
        cursor += 1;
        continue;
      }
      const prefix = line[0];
      if (prefix === ' ') {
        oldRemaining -= 1;
        newRemaining -= 1;
      } else if (prefix === '-') {
        oldRemaining -= 1;
      } else if (prefix === '+') {
        newRemaining -= 1;
      } else {
        throw new PatchError(`Invalid hunk line in section ${section} at line ${cursor + 1}.`, {
          code: 'MALFORMED_PATCH'
        });
      }
      if (oldRemaining < 0 || newRemaining < 0) {
        throw new PatchError(`Hunk ${count} in section ${section} exceeds its declared line counts.`, {
          code: 'MALFORMED_PATCH'
        });
      }
      cursor += 1;
    }
    if (cursor < lines.length && lines[cursor] === '\\ No newline at end of file') {
      cursor += 1;
    }
  }
  if (!count) {
    throw new PatchError(`Section ${section} contains no textual hunks.`, {
      code: 'UNSUPPORTED_MODE_ONLY_PATCH'
    });
  }
  return { count, next: cursor };
}

function buildFileEntry(oldPath, newPath, section) {
  if (oldPath === null && newPath === null) {
    throw new PatchError(`Section ${section} cannot use /dev/null for both file headers.`, {
      code: 'MISMATCHED_PATCH_HEADERS'
    });
  }
  if (oldPath === null) {
    return { section, operation: 'create', path: newPath, oldPath: null, newPath };
  }
  if (newPath === null) {
    return { section, operation: 'delete', path: oldPath, oldPath, newPath: null };
  }
  if (oldPath !== newPath) {
    throw new PatchError(`Section ${section} changes path "${oldPath}" to "${newPath}"; renames are not supported.`, {
      code: 'MISMATCHED_PATCH_HEADERS',
      details: { section, oldPath, newPath }
    });
  }
  return { section, operation: 'modify', path: oldPath, oldPath, newPath };
}

function parseDiffGitLine(line, section) {
  const body = line.slice('diff --git '.length);
  let oldRaw;
  let newRaw;
  if (body.startsWith('"')) {
    const first = parseQuotedToken(body, 0, section);
    let cursor = first.next;
    while (body[cursor] === ' ' || body[cursor] === '\t') cursor += 1;
    const second = body[cursor] === '"'
      ? parseQuotedToken(body, cursor, section)
      : parseBareToken(body, cursor, section);
    cursor = second.next;
    if (body.slice(cursor).trim()) {
      throw new PatchError(`Malformed diff --git header in section ${section}.`, { code: 'MALFORMED_PATCH' });
    }
    oldRaw = first.value;
    newRaw = second.value;
  } else {
    const separator = body.lastIndexOf(' b/');
    if (!body.startsWith('a/') || separator <= 1) {
      const tokens = body.trim().split(/\s+/);
      if (tokens.length !== 2) {
        throw new PatchError(`Malformed diff --git header in section ${section}.`, { code: 'MALFORMED_PATCH' });
      }
      [oldRaw, newRaw] = tokens;
    } else {
      oldRaw = body.slice(0, separator);
      newRaw = body.slice(separator + 1);
    }
  }
  return {
    oldPath: normalizePatchPath(oldRaw, 'old', { section, allowDevNull: false }),
    newPath: normalizePatchPath(newRaw, 'new', { section, allowDevNull: false })
  };
}

function parseUnifiedHeaderPath(line, side, section) {
  const body = line.slice(4);
  let raw;
  if (body.startsWith('"')) {
    const token = parseQuotedToken(body, 0, section);
    if (body.slice(token.next).trim() && !body.slice(token.next).startsWith('\t')) {
      throw new PatchError(`Malformed quoted ${side} path in section ${section}.`, { code: 'MALFORMED_PATCH' });
    }
    raw = token.value;
  } else {
    raw = body.split('\t', 1)[0].trimEnd();
  }
  return normalizePatchPath(raw, side, { section, allowDevNull: true });
}

function parseQuotedToken(value, start, section) {
  let result = '';
  let cursor = start + 1;
  while (cursor < value.length) {
    const char = value[cursor];
    if (char === '"') {
      return { value: result, next: cursor + 1 };
    }
    if (char !== '\\') {
      result += char;
      cursor += 1;
      continue;
    }
    cursor += 1;
    if (cursor >= value.length) break;
    const escaped = value[cursor];
    const simple = { '"': '"', '\\': '\\', t: '\t', n: '\n', r: '\r' };
    if (Object.prototype.hasOwnProperty.call(simple, escaped)) {
      result += simple[escaped];
      cursor += 1;
      continue;
    }
    const octal = value.slice(cursor).match(/^[0-7]{1,3}/);
    if (octal) {
      result += String.fromCharCode(Number.parseInt(octal[0], 8));
      cursor += octal[0].length;
      continue;
    }
    throw new PatchError(`Unsupported path escape in section ${section}.`, { code: 'MALFORMED_PATCH' });
  }
  throw new PatchError(`Unterminated quoted path in section ${section}.`, { code: 'MALFORMED_PATCH' });
}

function parseBareToken(value, start, section) {
  const match = value.slice(start).match(/^\S+/);
  if (!match) {
    throw new PatchError(`Missing path in diff --git header for section ${section}.`, { code: 'MALFORMED_PATCH' });
  }
  return { value: match[0], next: start + match[0].length };
}

function normalizePatchPath(input, side = 'new', options = {}) {
  const raw = String(input || '');
  if (options.allowDevNull && raw === '/dev/null') {
    return null;
  }
  if (!raw || raw.includes('\0') || /[\x00-\x1f\x7f]/.test(raw)) {
    throw unsafePath(input, options.section, 'path is empty or contains control characters');
  }
  if (raw.includes('\\')) {
    throw unsafePath(input, options.section, 'backslashes are not accepted in patch paths');
  }
  if (path.posix.isAbsolute(raw) || path.win32.isAbsolute(raw) || /^[A-Za-z]:/.test(raw)) {
    throw unsafePath(input, options.section, 'absolute paths are not accepted');
  }

  let normalized = raw;
  const expectedPrefix = side === 'old' ? 'a/' : 'b/';
  if (normalized.startsWith(expectedPrefix)) {
    normalized = normalized.slice(2);
  }
  if (path.posix.isAbsolute(normalized) || path.win32.isAbsolute(normalized) || /^[A-Za-z]:/.test(normalized)) {
    throw unsafePath(input, options.section, 'absolute paths are not accepted');
  }
  if (!normalized || normalized.endsWith('/')) {
    throw unsafePath(input, options.section, 'path must identify a file');
  }
  const segments = normalized.split('/');
  if (segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    throw unsafePath(input, options.section, 'path traversal and empty path segments are not accepted');
  }
  if (FORBIDDEN_ROOTS.has(segments[0].toLowerCase())) {
    throw unsafePath(input, options.section, `patches may not target ${segments[0]}`);
  }
  if (segments.some((segment) => /[:*?"<>|]/.test(segment) || /[. ]$/.test(segment) || WINDOWS_RESERVED_NAME_RE.test(segment))) {
    throw unsafePath(input, options.section, 'path contains a non-portable or reserved filename');
  }
  return segments.join('/').normalize('NFC');
}

function unsafePath(input, section, reason) {
  return new PatchError(`Unsafe patch path "${input}": ${reason}.`, {
    code: 'UNSAFE_PATCH_PATH',
    details: { path: input, section }
  });
}

function assertSafeRegularMode(mode, section) {
  if (mode === '120000') {
    throw new PatchError(`Symlink file mode is not accepted in section ${section}.`, {
      code: 'SYMLINK_PATCH'
    });
  }
  if (mode === '160000') {
    throw new PatchError(`Gitlink file mode is not accepted in section ${section}.`, {
      code: 'GITLINK_PATCH'
    });
  }
  if (mode !== '100644' && mode !== '100755') {
    throw new PatchError(`Unsupported file mode ${mode} in section ${section}.`, {
      code: 'UNSUPPORTED_MODE_CHANGE'
    });
  }
}

function validatePatchPaths(filesOrPatch, writeScope, options = {}) {
  const files = typeof filesOrPatch === 'string' ? parseUnifiedDiffPaths(filesOrPatch) : filesOrPatch;
  if (!Array.isArray(files) || !files.length) {
    throw new PatchError('No parsed patch files were provided.', { code: 'MALFORMED_PATCH' });
  }
  if (!writeScope || (Array.isArray(writeScope) && !writeScope.length)) {
    throw new PatchError('A non-empty stage write scope is required.', { code: 'MISSING_WRITE_SCOPE' });
  }
  for (const file of files) {
    if (!matchesWriteScope(file.path, writeScope, options.matchesPath)) {
      throw new PatchError(`Patch path "${file.path}" is outside the stage write scope.`, {
        code: 'PATCH_PATH_OUTSIDE_WRITE_SCOPE',
        details: { path: file.path, operation: file.operation }
      });
    }
  }
  return files;
}

function validatePatch(patch, writeScope, options = {}) {
  const files = validatePatchPaths(parseUnifiedDiffPaths(patch), writeScope, options);
  return { files, paths: files.map((file) => file.path) };
}

function matchesWriteScope(relPath, writeScope, matcher) {
  if (typeof matcher === 'function') {
    return Boolean(matcher(relPath, writeScope));
  }
  if (typeof writeScope === 'function') {
    return Boolean(writeScope(relPath));
  }
  const patterns = writeScope instanceof Set ? [...writeScope] : Array.isArray(writeScope) ? writeScope : [writeScope];
  try {
    return matchesSharedScope(relPath, patterns);
  } catch (error) {
    throw new PatchError(`Invalid stage write scope: ${error.message}`, {
      code: 'INVALID_WRITE_SCOPE',
      cause: error
    });
  }
}

async function applyPatchTransaction(input, patchArg, writeScopeArg, checkArg, extraOptions = {}) {
  const options = normalizeApplyOptions(input, patchArg, writeScopeArg, checkArg, extraOptions);
  if (typeof options.themeDir !== 'string' || !options.themeDir.trim()) {
    throw new PatchError('Theme directory is required.', { code: 'MISSING_THEME_DIRECTORY' });
  }
  const themeDir = path.resolve(options.themeDir);
  const patch = normalizeDiffText(options.patch || options.diff || '');
  const writeScope = options.writeScope || options.write || options.allow;
  const runCandidateChecks = options.runCandidateChecks || options.candidateCheck;
  if (!themeDir || !fs.existsSync(themeDir) || !fs.statSync(themeDir).isDirectory()) {
    throw new PatchError(`Theme directory does not exist: ${options.themeDir || '(missing)'}.`, {
      code: 'MISSING_THEME_DIRECTORY'
    });
  }
  if (fs.lstatSync(themeDir).isSymbolicLink()) {
    throw new PatchError('Theme directory may not be a symbolic link.', { code: 'SYMLINK_ESCAPE' });
  }
  if (typeof runCandidateChecks !== 'function') {
    throw new PatchError('Patch application requires an injected candidate-check callback.', {
      code: 'MISSING_CANDIDATE_CHECK'
    });
  }

  const validation = validatePatch(patch, writeScope, options);
  const parent = path.dirname(themeDir);
  const stagingRoot = fs.mkdtempSync(path.join(parent, `.${path.basename(themeDir)}-candidate-`));
  const candidateDir = path.join(stagingRoot, 'candidate');
  const backupDir = path.join(stagingRoot, 'original-backup');
  let committed = false;

  try {
    fs.cpSync(themeDir, candidateDir, {
      recursive: true,
      dereference: false,
      errorOnExist: true,
      preserveTimestamps: true,
      verbatimSymlinks: true
    });
    for (const file of validation.files) {
      assertNoSymlinkPath(candidateDir, file.path);
      assertTextPatchTarget(candidateDir, file);
    }

    const originalSnapshot = createTreeSnapshot(candidateDir);
    const gitCheck = runGitApply(candidateDir, patch, true, options);
    const gitApply = runGitApply(candidateDir, patch, false, options);
    const patchSnapshot = createTreeSnapshot(candidateDir);
    const appliedPaths = verifySnapshotChanges(originalSnapshot, patchSnapshot, validation.files, writeScope, options, false);

    const checkResult = await runCandidateChecks(candidateDir, {
      files: validation.files,
      paths: appliedPaths,
      patch
    });
    assertCandidateCheckResult(checkResult);
    const checkedSnapshot = createTreeSnapshot(candidateDir);
    const checkMutations = diffSnapshots(patchSnapshot, checkedSnapshot);
    if (checkMutations.length && !options.allowCandidateCheckChanges) {
      throw new PatchError(`Candidate checks modified files: ${checkMutations.join(', ')}.`, {
        code: 'CANDIDATE_CHECK_MUTATED_SOURCE',
        details: { paths: checkMutations }
      });
    }
    const changedPaths = verifySnapshotChanges(originalSnapshot, checkedSnapshot, validation.files, writeScope, options, Boolean(options.allowCandidateCheckChanges));

    replaceThemeWithRollback(themeDir, candidateDir, backupDir);
    committed = true;
    removeBestEffort(stagingRoot);
    return {
      applied: true,
      themeDir,
      files: validation.files,
      appliedPaths,
      changedPaths,
      checkResult,
      gitCheck,
      gitApply
    };
  } catch (error) {
    if (!committed && error?.code !== 'PATCH_ROLLBACK_FAILED') {
      removeBestEffort(stagingRoot);
    }
    if (error instanceof ProtocolError) throw error;
    throw new PatchError(`Patch transaction failed: ${error.message}`, {
      code: 'PATCH_TRANSACTION_FAILED',
      cause: error
    });
  }
}

function normalizeApplyOptions(input, patchArg, writeScopeArg, checkArg, extraOptions) {
  if (input && typeof input === 'object' && !Array.isArray(input)) return { ...input };
  return {
    ...extraOptions,
    themeDir: input,
    patch: patchArg,
    writeScope: writeScopeArg,
    runCandidateChecks: checkArg
  };
}

function runGitApply(candidateDir, patch, checkOnly, options = {}) {
  const args = ['apply'];
  if (checkOnly) args.push('--check');
  args.push('--whitespace=nowarn', '-');
  const result = (options.spawnSync || spawnSync)(options.gitExecutable || 'git', args, {
    cwd: candidateDir,
    env: {
      ...process.env,
      GIT_CEILING_DIRECTORIES: path.dirname(candidateDir),
      ...(options.gitEnv || {})
    },
    input: `${patch}\n`,
    encoding: 'utf8',
    maxBuffer: options.maxGitOutputBytes || 10 * 1024 * 1024,
    timeout: options.gitTimeoutMs || 120000
  });
  if (result.error || result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
    const detail = output || result.error?.message || '';
    throw new PatchError(`git apply${checkOnly ? ' --check' : ''} failed${detail ? `: ${detail}` : ''}.`, {
      code: checkOnly ? 'GIT_APPLY_CHECK_FAILED' : 'GIT_APPLY_FAILED',
      cause: result.error,
      details: { status: result.status }
    });
  }
  return { status: result.status, stdout: result.stdout || '', stderr: result.stderr || '' };
}

function replaceThemeWithRollback(themeDir, candidateDir, backupDir) {
  let originalMoved = false;
  try {
    fs.renameSync(themeDir, backupDir);
    originalMoved = true;
    fs.renameSync(candidateDir, themeDir);
  } catch (error) {
    let rollbackError = null;
    if (originalMoved) {
      try {
        if (fs.existsSync(themeDir)) {
          fs.renameSync(themeDir, path.join(path.dirname(candidateDir), 'failed-candidate'));
        }
        if (fs.existsSync(backupDir)) {
          fs.renameSync(backupDir, themeDir);
        }
      } catch (rollbackFailure) {
        rollbackError = rollbackFailure;
      }
    }
    throw new PatchError(`Could not replace the theme transactionally${rollbackError ? `; rollback also failed: ${rollbackError.message}` : ''}.`, {
      code: rollbackError ? 'PATCH_ROLLBACK_FAILED' : 'PATCH_REPLACE_FAILED',
      cause: error,
      details: { themeDir, backupDir }
    });
  }
  removeBestEffort(backupDir);
}

function assertNoSymlinkPath(root, relPath) {
  const rootStat = fs.lstatSync(root);
  if (rootStat.isSymbolicLink()) {
    throw new PatchError(`Candidate root is a symbolic link: ${root}.`, { code: 'SYMLINK_ESCAPE' });
  }
  let current = root;
  for (const segment of relPath.split('/')) {
    current = path.join(current, segment);
    if (!fs.existsSync(current)) continue;
    const stat = fs.lstatSync(current);
    if (stat.isSymbolicLink()) {
      throw new PatchError(`Patch path traverses a symbolic link: ${relPath}.`, {
        code: 'SYMLINK_ESCAPE',
        details: { path: relPath }
      });
    }
  }
}

function assertTextPatchTarget(root, file) {
  const target = path.join(root, ...file.path.split('/'));
  if (file.operation === 'create') {
    if (fs.existsSync(target)) {
      throw new PatchError(`Create patch target already exists: ${file.path}.`, { code: 'PATCH_OPERATION_MISMATCH' });
    }
    return;
  }
  if (!fs.existsSync(target) || !fs.lstatSync(target).isFile()) {
    throw new PatchError(`${file.operation} patch target is not a regular file: ${file.path}.`, {
      code: 'PATCH_OPERATION_MISMATCH'
    });
  }
  const sample = fs.readFileSync(target).subarray(0, 8192);
  if (sample.includes(0)) {
    throw new PatchError(`Patch target appears to be binary: ${file.path}.`, { code: 'BINARY_PATCH_TARGET' });
  }
}

function createTreeSnapshot(root) {
  const snapshot = new Map();
  function visit(dir, prefix = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!prefix && entry.name.toLowerCase() === 'node_modules') continue;
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      const full = path.join(dir, entry.name);
      const stat = fs.lstatSync(full);
      if (stat.isSymbolicLink()) {
        snapshot.set(canonicalPathKey(rel), { path: rel, signature: `link:${fs.readlinkSync(full)}` });
      } else if (stat.isDirectory()) {
        visit(full, rel);
      } else if (stat.isFile()) {
        const hash = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
        snapshot.set(canonicalPathKey(rel), { path: rel, signature: `file:${stat.mode & 0o777}:${hash}` });
      }
    }
  }
  visit(root);
  return snapshot;
}

function diffSnapshots(before, after) {
  const changed = [];
  const keys = new Set([...before.keys(), ...after.keys()]);
  for (const key of keys) {
    if (before.get(key)?.signature !== after.get(key)?.signature) {
      changed.push(after.get(key)?.path || before.get(key)?.path || key);
    }
  }
  return changed.sort();
}

function verifySnapshotChanges(before, after, files, writeScope, options, allowAdditional) {
  const changed = diffSnapshots(before, after);
  const changedKeys = new Set(changed.map(canonicalPathKey));
  const expectedKeys = new Set(files.map((file) => canonicalPathKey(file.path)));
  for (const relPath of changed) {
    normalizePatchPath(relPath, 'new', { allowDevNull: false });
    if (!matchesWriteScope(relPath, writeScope, options.matchesPath)) {
      throw new PatchError(`Patch actually changed "${relPath}" outside the stage write scope.`, {
        code: 'ACTUAL_CHANGE_OUTSIDE_WRITE_SCOPE',
        details: { path: relPath }
      });
    }
  }
  for (const file of files) {
    if (!changedKeys.has(canonicalPathKey(file.path))) {
      throw new PatchError(`Patch declared "${file.path}" but did not change it.`, {
        code: 'PATCH_DID_NOT_CHANGE_DECLARED_PATH',
        details: { path: file.path }
      });
    }
  }
  if (!allowAdditional) {
    const extra = changed.filter((relPath) => !expectedKeys.has(canonicalPathKey(relPath)));
    if (extra.length) {
      throw new PatchError(`Patch changed undeclared paths: ${extra.join(', ')}.`, {
        code: 'UNDECLARED_PATCH_CHANGE',
        details: { paths: extra }
      });
    }
  }
  return changed;
}

function assertCandidateCheckResult(result) {
  if (result === false || (result && typeof result === 'object'
    && (result.ok === false || result.success === false || result.status === 'failed'))) {
    const errors = result && Array.isArray(result.errors) ? `: ${result.errors.join('; ')}` : '';
    throw new PatchError(`Candidate checks failed${errors}.`, {
      code: 'CANDIDATE_CHECK_FAILED',
      details: result
    });
  }
}

function canonicalPathKey(value) {
  const normalized = String(value).replace(/\\/g, '/').normalize('NFC');
  return process.platform === 'win32' ? normalized.toLowerCase() : normalized;
}

function removeBestEffort(target) {
  try {
    fs.rmSync(target, { recursive: true, force: true });
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  PatchError,
  applyPatchTransaction,
  applyPatchTransactional: applyPatchTransaction,
  applyUnifiedDiffTransaction: applyPatchTransaction,
  assertNoSymlinkPath,
  createTreeSnapshot,
  diffSnapshots,
  matchesWriteScope,
  normalizePatchPath,
  parsePatchPaths: parseUnifiedDiffPaths,
  parseUnifiedDiffPaths,
  runGitApply,
  validatePatch,
  validatePatchPaths
};
