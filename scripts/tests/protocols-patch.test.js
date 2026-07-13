'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  extractUnifiedDiff,
  parseFinalResponse
} = require('../lib/local-model/protocols');
const {
  applyPatchTransaction,
  parseUnifiedDiffPaths,
  validatePatch
} = require('../lib/local-model/patch');

const MODIFY_DIFF = [
  'diff --git a/modify.txt b/modify.txt',
  'index 3367afd..3e75765 100644',
  '--- a/modify.txt',
  '+++ b/modify.txt',
  '@@ -1 +1 @@',
  '-old',
  '+new'
].join('\n');

const CREATE_DIFF = [
  'diff --git a/new.txt b/new.txt',
  'new file mode 100644',
  'index 0000000..ce01362',
  '--- /dev/null',
  '+++ b/new.txt',
  '@@ -0,0 +1 @@',
  '+created'
].join('\n');

const DELETE_DIFF = [
  'diff --git a/delete.txt b/delete.txt',
  'deleted file mode 100644',
  'index 71215ee..0000000',
  '--- a/delete.txt',
  '+++ /dev/null',
  '@@ -1 +0,0 @@',
  '-remove'
].join('\n');

const TRANSACTION_DIFF = [MODIFY_DIFF, CREATE_DIFF, DELETE_DIFF].join('\n');

test('accepts exactly one raw unified diff', () => {
  assert.equal(extractUnifiedDiff(MODIFY_DIFF), MODIFY_DIFF);
  assert.deepEqual(parseFinalResponse(MODIFY_DIFF), {
    content: MODIFY_DIFF,
    diff: MODIFY_DIFF,
    format: 'raw'
  });
});

test('accepts exactly one fenced unified diff', () => {
  const response = `\`\`\`diff\n${MODIFY_DIFF}\n\`\`\``;
  assert.equal(extractUnifiedDiff(response), MODIFY_DIFF);
  assert.equal(parseFinalResponse(response).format, 'fenced');
});

test('rejects malformed unified diffs', () => {
  assertProtocolCode(() => extractUnifiedDiff('not a diff'), 'NO_UNIFIED_DIFF');
  assertProtocolCode(() => extractUnifiedDiff(`${MODIFY_DIFF}\n+undeclared hunk line`), 'PROSE_OUTSIDE_DIFF');
  assertProtocolCode(() => parseUnifiedDiffPaths(MODIFY_DIFF.replace('@@ -1 +1 @@', '@@ -1,2 +1 @@')), 'MALFORMED_PATCH');
});

test('rejects multiple fenced blocks', () => {
  const response = `\`\`\`diff\n${MODIFY_DIFF}\n\`\`\`\n\`\`\`diff\n${CREATE_DIFF}\n\`\`\``;
  assertProtocolCode(() => extractUnifiedDiff(response), 'MULTIPLE_OR_MALFORMED_DIFF_BLOCKS');
});

test('rejects commentary before or after a diff', () => {
  assertProtocolCode(() => extractUnifiedDiff(`Here is the patch:\n${MODIFY_DIFF}`), 'NO_UNIFIED_DIFF');
  assertProtocolCode(() => extractUnifiedDiff(`${MODIFY_DIFF}\nPatch complete.`), 'PROSE_OUTSIDE_DIFF');
  assertProtocolCode(() => extractUnifiedDiff(`Explanation\n\`\`\`diff\n${MODIFY_DIFF}\n\`\`\``), 'NO_UNIFIED_DIFF');
});

test('rejects the legacy complete-file block protocol', () => {
  const legacy = [
    '---FILE: modify.txt---',
    'replacement content',
    '---END FILE---'
  ].join('\n');
  assertProtocolCode(() => extractUnifiedDiff(legacy), 'LEGACY_FILE_BLOCK_PROTOCOL');
  assertProtocolCode(
    () => extractUnifiedDiff(MODIFY_DIFF.replace('+new', '+---FILE: old-protocol.txt---')),
    'LEGACY_FILE_BLOCK_PROTOCOL'
  );
});

test('rejects binary patches', () => {
  const binary = [
    'diff --git a/image.png b/image.png',
    'index 1234567..7654321 100644',
    'Binary files a/image.png and b/image.png differ'
  ].join('\n');
  assertProtocolCode(() => parseUnifiedDiffPaths(binary), 'BINARY_PATCH');
});

test('rejects absolute and traversal patch paths', () => {
  const absolute = [
    '--- /etc/passwd',
    '+++ /etc/passwd',
    '@@ -1 +1 @@',
    '-old',
    '+new'
  ].join('\n');
  const traversal = MODIFY_DIFF.replaceAll('modify.txt', '../escape.txt');
  assertProtocolCode(() => parseUnifiedDiffPaths(absolute), 'UNSAFE_PATCH_PATH');
  assertProtocolCode(() => parseUnifiedDiffPaths(traversal), 'UNSAFE_PATCH_PATH');
});

test('rejects paths outside the stage write scope', () => {
  assertProtocolCode(() => validatePatch(MODIFY_DIFF, ['allowed/**']), 'PATCH_PATH_OUTSIDE_WRITE_SCOPE');
});

test('rejects mode-only patches', () => {
  const modeOnly = [
    'diff --git a/modify.txt b/modify.txt',
    'old mode 100644',
    'new mode 100755'
  ].join('\n');
  assertProtocolCode(() => parseUnifiedDiffPaths(modeOnly), 'UNSUPPORTED_MODE_CHANGE');
});

test('transactionally applies valid modify, create, and delete patches', async (t) => {
  const fixture = createThemeFixture(t);
  const git = createGitStub({
    apply(candidateDir) {
      fs.writeFileSync(path.join(candidateDir, 'modify.txt'), 'new\n');
      fs.writeFileSync(path.join(candidateDir, 'new.txt'), 'created\n');
      fs.rmSync(path.join(candidateDir, 'delete.txt'));
    }
  });

  const result = await applyPatchTransaction({
    themeDir: fixture.themeDir,
    patch: TRANSACTION_DIFF,
    writeScope: ['*.txt'],
    spawnSync: git.spawnSync,
    runCandidateChecks(candidateDir) {
      assert.equal(readNormalizedText(path.join(candidateDir, 'modify.txt')), 'new\n');
      assert.equal(readNormalizedText(path.join(candidateDir, 'new.txt')), 'created\n');
      assert.equal(fs.existsSync(path.join(candidateDir, 'delete.txt')), false);
      return { ok: true, checks: ['fixture-check'] };
    }
  });

  assert.equal(readNormalizedText(path.join(fixture.themeDir, 'modify.txt')), 'new\n');
  assert.equal(readNormalizedText(path.join(fixture.themeDir, 'new.txt')), 'created\n');
  assert.equal(fs.existsSync(path.join(fixture.themeDir, 'delete.txt')), false);
  assert.deepEqual(new Set(result.appliedPaths), new Set(['modify.txt', 'new.txt', 'delete.txt']));
  assert.deepEqual(new Set(result.changedPaths), new Set(['modify.txt', 'new.txt', 'delete.txt']));
  assert.deepEqual(git.calls.map((call) => call.checkOnly), [true, false]);
});

test('real Git transaction is isolated from a parent repository', async (t) => {
  if (!requireGit(t)) return;

  const fixture = createThemeFixture(t);
  const init = spawnSync('git', ['init', '--quiet', fixture.rootDir], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stderr || init.error?.message);
  const parentTrap = path.join(fixture.rootDir, 'modify.txt');
  fs.writeFileSync(parentTrap, 'parent repository file\n');

  const result = await applyPatchTransaction({
    themeDir: fixture.themeDir,
    patch: TRANSACTION_DIFF,
    writeScope: ['*.txt'],
    runCandidateChecks(candidateDir) {
      assert.equal(fs.existsSync(path.join(candidateDir, '.git')), false);
      assert.equal(readNormalizedText(path.join(candidateDir, 'modify.txt')), 'new\n');
      assert.equal(readNormalizedText(path.join(candidateDir, 'new.txt')), 'created\n');
      assert.equal(fs.existsSync(path.join(candidateDir, 'delete.txt')), false);
      return { ok: true };
    }
  });

  assert.equal(fs.readFileSync(parentTrap, 'utf8'), 'parent repository file\n');
  assert.equal(fs.existsSync(path.join(fixture.rootDir, 'new.txt')), false);
  assert.equal(readNormalizedText(path.join(fixture.themeDir, 'modify.txt')), 'new\n');
  assert.equal(readNormalizedText(path.join(fixture.themeDir, 'new.txt')), 'created\n');
  assert.equal(fs.existsSync(path.join(fixture.themeDir, 'delete.txt')), false);
  assert.deepEqual(new Set(result.changedPaths), new Set(['modify.txt', 'new.txt', 'delete.txt']));
  assertNoCandidateDirectories(fixture.rootDir);
});

test('git apply --check failure preserves the original theme', async (t) => {
  const fixture = createThemeFixture(t);
  const before = snapshotFixture(fixture.themeDir);
  const git = createGitStub({ checkFailure: 'patch does not apply' });

  await assert.rejects(
    applyPatchTransaction({
      themeDir: fixture.themeDir,
      patch: MODIFY_DIFF,
      writeScope: ['modify.txt'],
      spawnSync: git.spawnSync,
      runCandidateChecks: () => ({ ok: true })
    }),
    hasCode('GIT_APPLY_CHECK_FAILED')
  );

  assert.deepEqual(snapshotFixture(fixture.themeDir), before);
  assert.deepEqual(git.calls.map((call) => call.checkOnly), [true]);
  assertNoCandidateDirectories(fixture.rootDir);
});

test('candidate-check failure preserves the original theme', async (t) => {
  const fixture = createThemeFixture(t);
  const before = snapshotFixture(fixture.themeDir);
  const git = createGitStub({
    apply(candidateDir) {
      fs.writeFileSync(path.join(candidateDir, 'modify.txt'), 'new\n');
    }
  });

  await assert.rejects(
    applyPatchTransaction({
      themeDir: fixture.themeDir,
      patch: MODIFY_DIFF,
      writeScope: ['modify.txt'],
      spawnSync: git.spawnSync,
      runCandidateChecks: () => ({ ok: false, errors: ['fixture failure'] })
    }),
    hasCode('CANDIDATE_CHECK_FAILED')
  );

  assert.deepEqual(snapshotFixture(fixture.themeDir), before);
  assertNoCandidateDirectories(fixture.rootDir);
});

test('a rejected patch leaves the original theme unchanged', async (t) => {
  const fixture = createThemeFixture(t);
  const before = snapshotFixture(fixture.themeDir);

  await assert.rejects(
    applyPatchTransaction({
      themeDir: fixture.themeDir,
      patch: MODIFY_DIFF,
      writeScope: ['other.txt'],
      spawnSync() {
        throw new Error('git must not run for a rejected patch');
      },
      runCandidateChecks: () => ({ ok: true })
    }),
    hasCode('PATCH_PATH_OUTSIDE_WRITE_SCOPE')
  );

  assert.deepEqual(snapshotFixture(fixture.themeDir), before);
});

test('rejects a patch target that is a symbolic link', async (t) => {
  const fixture = createThemeFixture(t);
  const outsideTarget = path.join(fixture.rootDir, 'outside-target.txt');
  const linkPath = path.join(fixture.themeDir, 'modify.txt');
  fs.writeFileSync(outsideTarget, 'outside stays unchanged\n');
  fs.rmSync(linkPath);
  try {
    fs.symlinkSync(outsideTarget, linkPath, 'file');
  } catch (error) {
    if (['EPERM', 'EACCES', 'ENOTSUP', 'UNKNOWN'].includes(error.code)) {
      t.skip(`symbolic-link creation is unavailable: ${error.code}`);
      return;
    }
    throw error;
  }

  await assert.rejects(
    applyPatchTransaction({
      themeDir: fixture.themeDir,
      patch: MODIFY_DIFF,
      writeScope: ['modify.txt'],
      spawnSync() {
        throw new Error('git must not run for a symlink target');
      },
      runCandidateChecks: () => ({ ok: true })
    }),
    hasCode('SYMLINK_ESCAPE')
  );

  assert.equal(fs.lstatSync(linkPath).isSymbolicLink(), true);
  assert.equal(fs.readFileSync(outsideTarget, 'utf8'), 'outside stays unchanged\n');
  assertNoCandidateDirectories(fixture.rootDir);
});

test('verifies actual changed paths and rejects undeclared changes', async (t) => {
  const fixture = createThemeFixture(t);
  const before = snapshotFixture(fixture.themeDir);
  const git = createGitStub({
    apply(candidateDir) {
      fs.writeFileSync(path.join(candidateDir, 'modify.txt'), 'new\n');
      fs.writeFileSync(path.join(candidateDir, 'undeclared.txt'), 'unexpected\n');
    }
  });

  await assert.rejects(
    applyPatchTransaction({
      themeDir: fixture.themeDir,
      patch: MODIFY_DIFF,
      writeScope: ['*.txt'],
      spawnSync: git.spawnSync,
      runCandidateChecks: () => ({ ok: true })
    }),
    hasCode('UNDECLARED_PATCH_CHANGE')
  );

  assert.deepEqual(snapshotFixture(fixture.themeDir), before);
  assertNoCandidateDirectories(fixture.rootDir);
});

function createThemeFixture(t) {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'local-model-patch-test-'));
  const themeDir = path.join(rootDir, 'theme');
  fs.mkdirSync(themeDir);
  fs.writeFileSync(path.join(themeDir, 'modify.txt'), 'old\n');
  fs.writeFileSync(path.join(themeDir, 'delete.txt'), 'remove\n');
  fs.writeFileSync(path.join(themeDir, 'untouched.txt'), 'same\n');
  t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));
  return { rootDir, themeDir };
}

function createGitStub(options = {}) {
  const calls = [];
  return {
    calls,
    spawnSync(executable, args, spawnOptions) {
      assert.equal(executable, 'git');
      assert.equal(args[0], 'apply');
      assert.equal(args.at(-1), '-');
      assert.equal(spawnOptions.env.GIT_CEILING_DIRECTORIES, path.dirname(spawnOptions.cwd));
      const checkOnly = args.includes('--check');
      calls.push({ checkOnly, cwd: spawnOptions.cwd, input: spawnOptions.input });
      if (checkOnly && options.checkFailure) {
        return { status: 1, stdout: '', stderr: options.checkFailure };
      }
      if (!checkOnly && options.apply) {
        options.apply(spawnOptions.cwd, spawnOptions.input);
      }
      return { status: 0, stdout: '', stderr: '' };
    }
  };
}

function requireGit(t) {
  const probe = spawnSync('git', ['--version'], { encoding: 'utf8' });
  if (probe.error || probe.status !== 0) {
    const reason = probe.error?.code || probe.stderr?.trim() || `status ${probe.status}`;
    t.skip(`Git is unavailable to the test process: ${reason}`);
    return false;
  }
  return true;
}

function snapshotFixture(themeDir) {
  const result = {};
  for (const entry of fs.readdirSync(themeDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isFile()) {
      result[entry.name] = fs.readFileSync(path.join(themeDir, entry.name), 'utf8');
    }
  }
  return result;
}

function readNormalizedText(file) {
  return fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
}

function assertNoCandidateDirectories(rootDir) {
  const candidates = fs.readdirSync(rootDir).filter((name) => name.includes('-candidate-'));
  assert.deepEqual(candidates, []);
}

function assertProtocolCode(fn, code) {
  assert.throws(fn, hasCode(code));
}

function hasCode(code) {
  return (error) => {
    assert.equal(error && error.code, code, error && error.stack);
    return true;
  };
}
