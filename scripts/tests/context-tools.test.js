'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  createReadOnlyTools,
  normalizeRelativePath
} = require('../lib/local-model/tools');
const { buildStageContext } = require('../lib/local-model/context');

function writeFixture(root, relativePath, content) {
  const target = path.join(root, ...relativePath.split('/'));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function makeThemeFixture(t) {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'local-model-context-tools-'));
  const themeDir = path.join(baseDir, 'prepared-theme');
  const outsideDir = path.join(baseDir, 'outside-theme');
  fs.mkdirSync(themeDir, { recursive: true });
  fs.mkdirSync(outsideDir, { recursive: true });
  t.after(() => fs.rmSync(baseDir, { recursive: true, force: true }));

  writeFixture(themeDir, 'functions.php', "<?php\n// bootstrap needle.*literal\nrequire_once __DIR__ . '/inc/helpers.php';\n");
  writeFixture(themeDir, 'inc/helpers.php', Array.from({ length: 120 }, (_, index) => `function fixture_helper_${index}() { return ${index}; }`).join('\n'));
  writeFixture(themeDir, 'src/scss/main.scss', '$brand: #123456;\n.site { color: $brand; }\n');
  writeFixture(themeDir, 'src/js/main.js', "const label = 'Needle Case';\nconsole.log(label);\n");
  writeFixture(themeDir, 'theme.json', JSON.stringify({ version: 3, settings: { layout: { contentSize: '760px' } } }, null, 2));
  writeFixture(themeDir, 'package.json', JSON.stringify({ name: 'fixture-theme', scripts: { build: 'webpack' } }, null, 2));
  writeFixture(themeDir, 'package-lock.json', JSON.stringify({
    name: 'fixture-theme',
    lockfileVersion: 3,
    packages: {
      '': { name: 'fixture-theme', devDependencies: { webpack: '^5.0.0' } },
      'node_modules/webpack': { version: '5.99.0', resolved: 'https://registry.npmjs.org/webpack/-/webpack-5.99.0.tgz' }
    },
    dependencies: { webpack: { version: '5.99.0' } }
  }, null, 2));
  writeFixture(themeDir, 'assets/css/bundle.css', `.compiled{color:red}${'/* generated */'.repeat(500)}`);
  writeFixture(themeDir, 'assets/js/bundle.js', `(()=>{'compiled';})();${'/* generated */'.repeat(200)}`);
  writeFixture(themeDir, 'assets/images/pixel.png', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x01, 0x02]));
  writeFixture(themeDir, 'private/hidden.php', '<?php // must remain out of scope\n');
  writeFixture(themeDir, 'node_modules/secret.txt', 'never expose dependency content');
  writeFixture(themeDir, 'reports/run.json', '{"secret":"not context"}\n');
  writeFixture(themeDir, 'parts/a.php', '<?php // part a\n' + 'A'.repeat(500));
  writeFixture(themeDir, 'parts/b.php', '<?php // part b\n' + 'B'.repeat(500));
  writeFixture(themeDir, 'parts/c.php', '<?php // part c\n' + 'C'.repeat(500));
  writeFixture(outsideDir, 'outside.txt', 'outside secret');
  return { baseDir, themeDir, outsideDir };
}

function parseToolResult(tools, name, args) {
  const output = tools.execute(name, args);
  assert.notEqual(output, '', `expected structured ${name} output`);
  return { output, parsed: JSON.parse(output) };
}

test('buildStageContext includes actual scoped source and useful config', (t) => {
  const { themeDir } = makeThemeFixture(t);
  const result = buildStageContext({
    themeDir,
    stage: {
      id: 'scoped-context',
      read: ['functions.php', 'inc/**', 'theme.json', 'package.json'],
      write: ['inc/**']
    }
  });

  assert.match(result.text, /bootstrap needle\.\*literal/);
  assert.match(result.text, /fixture_helper_0/);
  assert.match(result.text, /"contentSize": "760px"/);
  assert.match(result.text, /"build": "webpack"/);
  assert.doesNotMatch(result.text, /must remain out of scope/);
  assert.deepEqual(result.summary.readScope, ['functions.php', 'inc/**', 'theme.json', 'package.json']);
  assert.equal(result.summary.stageId, 'scoped-context');
  assert.ok(result.summary.includedFiles.some((file) => file.path === 'functions.php' && file.mode === 'full'));
});

test('context truncation is deterministic and reports total, per-file, and line-range metadata', (t) => {
  const { themeDir } = makeThemeFixture(t);
  const options = {
    themeDir,
    stage: { id: 'bounded', read: ['inc/helpers.php', 'parts/**'], write: ['inc/helpers.php'] },
    maxTotalBytes: 1400,
    maxFileBytes: 300,
    maxInventoryBytes: 300,
    maxFiles: 10
  };
  const first = buildStageContext(options);
  const second = buildStageContext(options);

  assert.equal(first.text, second.text);
  assert.deepEqual(first.summary, second.summary);
  assert.ok(first.summary.totalBytes <= options.maxTotalBytes);
  assert.equal(first.summary.contextTruncated, true);
  const helper = first.summary.includedFiles.find((file) => file.path === 'inc/helpers.php');
  assert.ok(helper);
  assert.equal(helper.mode, 'excerpt');
  assert.equal(helper.truncated, true);
  assert.ok(helper.includedBytes <= options.maxFileBytes);
  assert.ok(helper.ranges.length >= 1);
  assert.match(first.text, /omitted lines/);
  assert.ok((first.summary.excludedCounts['total-context-budget'] || 0) >= 1);
});

test('compiled bundles and lockfiles are summarized instead of dumped', (t) => {
  const { themeDir } = makeThemeFixture(t);
  const result = buildStageContext({
    themeDir,
    readScope: ['package-lock.json', 'assets/css/bundle.css', 'assets/js/bundle.js'],
    maxTotalBytes: 16 * 1024,
    maxFileBytes: 8 * 1024
  });

  for (const expected of ['package-lock.json', 'assets/css/bundle.css', 'assets/js/bundle.js']) {
    const file = result.summary.includedFiles.find((entry) => entry.path === expected);
    assert.ok(file, `${expected} should be represented`);
    assert.equal(file.mode, 'summary');
    assert.equal(file.truncated, true);
  }
  assert.match(result.text, /dependency graph omitted/);
  assert.match(result.text, /Compiled artifact summary/);
  assert.ok(result.summary.includedFiles.find((file) => file.path === 'assets/css/bundle.css').includedBytes < 7520);
  assert.ok(result.summary.includedFiles.find((file) => file.path === 'assets/js/bundle.js').includedBytes < 3022);
});

test('context excludes binary files, node_modules, reports, and unrelated paths', (t) => {
  const { themeDir } = makeThemeFixture(t);
  const result = buildStageContext({ themeDir, readScope: ['**'] });

  assert.doesNotMatch(result.text, /never expose dependency content/);
  assert.doesNotMatch(result.text, /not context/);
  assert.doesNotMatch(result.text, /outside scope/);
  assert.ok((result.summary.excludedCounts.binary || 0) >= 1);
  assert.ok((result.summary.excludedCounts['blocked-directory'] || 0) >= 1);
  assert.ok((result.summary.excludedCounts['hard-excluded'] || 0) >= 1);
});

test('strict path validation rejects traversal, absolute, drive, UNC, and symlink escapes', (t) => {
  const { themeDir, outsideDir } = makeThemeFixture(t);
  for (const unsafe of ['../functions.php', '/etc/passwd', 'C:\\Windows\\win.ini', '\\\\server\\share\\file.txt']) {
    assert.throws(() => normalizeRelativePath(unsafe), /not allowed|traversal|Absolute/);
  }

  const linkPath = path.join(themeDir, 'linked-outside');
  try {
    fs.symlinkSync(outsideDir, linkPath, process.platform === 'win32' ? 'junction' : 'dir');
  } catch (error) {
    if (error.code === 'EPERM' || error.code === 'EACCES' || error.code === 'ENOTSUP') {
      t.skip(`host cannot create a symlink/junction fixture: ${error.code}`);
      return;
    }
    throw error;
  }

  const tools = createReadOnlyTools({ themeDir, readScope: ['linked-outside/**'] });
  const denied = parseToolResult(tools, 'read_file', { path: 'linked-outside/outside.txt' }).parsed;
  assert.equal(denied.ok, false);
  assert.equal(denied.error.code, 'SYMLINK_DENIED');

  const context = buildStageContext({ themeDir, readScope: ['linked-outside/**'] });
  assert.equal(context.summary.includedFiles.length, 0);
  assert.equal(context.summary.excludedCounts.symlink, 1);
  assert.doesNotMatch(context.text, /outside secret/);
});

test('read-only tools list, read, excerpt, and search literal text successfully', (t) => {
  const { themeDir } = makeThemeFixture(t);
  const records = [];
  const tools = createReadOnlyTools({
    themeDir,
    readScope: ['functions.php', 'inc/**', 'src/**'],
    onRecord: (record) => records.push(record)
  });

  const listed = parseToolResult(tools, 'list_files', { limit: 20 }).parsed;
  assert.equal(listed.ok, true);
  assert.deepEqual(listed.result.files.map((file) => file.path), [
    'functions.php',
    'inc/helpers.php',
    'src/js/main.js',
    'src/scss/main.scss'
  ]);

  const read = parseToolResult(tools, 'read_file', { path: 'functions.php' }).parsed;
  assert.equal(read.ok, true);
  assert.match(read.result.content, /require_once/);

  const excerpt = parseToolResult(tools, 'read_file_excerpt', {
    path: 'inc/helpers.php',
    start_line: 10,
    end_line: 14
  }).parsed;
  assert.equal(excerpt.ok, true);
  assert.equal(excerpt.result.startLine, 10);
  assert.equal(excerpt.result.endLine, 14);
  assert.match(excerpt.result.content, /fixture_helper_9/);
  assert.doesNotMatch(excerpt.result.content, /fixture_helper_15/);

  const literal = parseToolResult(tools, 'search_files', { query: 'needle.*literal' }).parsed;
  assert.equal(literal.ok, true);
  assert.equal(literal.result.matches.length, 1);
  assert.equal(literal.result.matches[0].path, 'functions.php');
  assert.equal(literal.result.matches[0].line, 2);

  const insensitive = parseToolResult(tools, 'search_files', {
    query: 'needle case',
    case_sensitive: false
  }).parsed;
  assert.equal(insensitive.result.matches[0].path, 'src/js/main.js');
  assert.ok(records.every((record) => !Object.hasOwn(record, 'content')));
  assert.ok(records.every((record) => !Object.hasOwn(record, 'query')));
});

test('read-only tools deny out-of-scope and binary reads', (t) => {
  const { themeDir } = makeThemeFixture(t);
  const tools = createReadOnlyTools({
    themeDir,
    readScope: ['functions.php', 'assets/images/**']
  });

  const outsideScope = parseToolResult(tools, 'read_file', { path: 'private/hidden.php' }).parsed;
  assert.equal(outsideScope.error.code, 'READ_SCOPE_DENIED');

  const binary = parseToolResult(tools, 'read_file', { path: 'assets/images/pixel.png' }).parsed;
  assert.equal(binary.error.code, 'BINARY_FILE_DENIED');

  const traversal = parseToolResult(tools, 'read_file', { path: '../functions.php' }).parsed;
  assert.equal(traversal.error.code, 'UNSAFE_PATH');
});

test('tool responses, cumulative output, and call count remain bounded', (t) => {
  const { themeDir } = makeThemeFixture(t);
  const perResponse = createReadOnlyTools({
    themeDir,
    readScope: ['inc/helpers.php'],
    maxResponseBytes: 512,
    maxCumulativeBytes: 4096
  });
  const oversized = parseToolResult(perResponse, 'read_file', { path: 'inc/helpers.php' });
  assert.equal(oversized.parsed.error.code, 'FILE_TOO_LARGE_FOR_RESPONSE');
  assert.ok(Buffer.byteLength(oversized.output) <= 512);
  const boundedExcerpt = parseToolResult(perResponse, 'read_file_excerpt', {
    path: 'inc/helpers.php',
    start_line: 1,
    end_line: 120
  });
  assert.ok(Buffer.byteLength(boundedExcerpt.output) <= 512);

  const cumulative = createReadOnlyTools({
    themeDir,
    readScope: ['functions.php'],
    maxCalls: 12,
    maxResponseBytes: 512,
    maxCumulativeBytes: 700
  });
  const cumulativeOutputs = [];
  let cumulativeLimit = null;
  for (let index = 0; index < 12; index += 1) {
    const output = cumulative.execute('read_file', { path: 'functions.php' });
    cumulativeOutputs.push(output);
    if (output) {
      const parsed = JSON.parse(output);
      if (parsed.error && parsed.error.code === 'CUMULATIVE_OUTPUT_LIMIT') {
        cumulativeLimit = parsed;
        break;
      }
    }
  }
  assert.ok(cumulativeLimit, 'expected a structured cumulative-output limit error');
  assert.ok(cumulativeOutputs.reduce((sum, output) => sum + Buffer.byteLength(output), 0) <= 700);
  assert.ok(cumulative.getUsage().responseBytes <= cumulative.getUsage().maxCumulativeBytes);

  const callLimited = createReadOnlyTools({
    themeDir,
    readScope: ['functions.php'],
    maxCalls: 2
  });
  parseToolResult(callLimited, 'list_files', {});
  parseToolResult(callLimited, 'read_file', { path: 'functions.php' });
  const limit = parseToolResult(callLimited, 'search_files', { query: 'bootstrap' }).parsed;
  assert.equal(limit.error.code, 'TOOL_CALL_LIMIT');
  assert.equal(callLimited.getUsage().calls, 3);
});
