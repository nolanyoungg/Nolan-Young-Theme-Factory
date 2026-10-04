'use strict';
const { spawnSync } = require('node:child_process');
const { fs, path, ROOT, walk, hash, relative, ensureDir, assertStatus } = require('./workspace');
function invocation(executable = 'codex', args = []) {
  const script = path.join(process.env.APPDATA || '', 'npm/node_modules/@openai/codex/bin/codex.js');
  return process.platform === 'win32' && executable === 'codex' && fs.existsSync(script)
    ? { command: process.execPath, args: [script, ...args] } : { command: executable, args };
}
function snapshot(root, excluded) {
  const isExcluded = file => excluded.some(dir => file === dir || file.startsWith(dir + path.sep));
  // Ignore only generated caches and the runner-owned report for this invocation.
  return Object.fromEntries(walk(root).filter(f => !isExcluded(f)).map(f => [relative(f), hash(fs.readFileSync(f))]));
}
function changed(before, after) { return [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(k => before[k] !== after[k]); }
function runCodex(dir, prompt, options, reportDir) {
  ensureDir(reportDir);
  if (options.codexExtraArgs) throw new Error('Arbitrary Codex arguments are disabled to preserve the output sandbox.');
  const args = ['exec', '--cd', dir, '--approve-for-me', '--ephemeral'];
  if (options.codexModel) args.push('--model', options.codexModel);
  if (options.codexReasoning) args.push('-c', `model_reasoning_effort="${options.codexReasoning}"`);
  args.push('-');
  const call = invocation(options.codexExecutable, args);
  const before = snapshot(ROOT, [dir, reportDir]);
  const log = fs.openSync(path.join(reportDir, 'codex.log'), 'wx');
  let result;
  try {
    result = spawnSync(call.command, call.args, { cwd: dir, input: 'Execution guidance: use small scoped edits. On Windows keep each shell command below 15KB; split multi-page writes. For apply_patch use Update File for existing files, not Delete plus Add of the same path. Verify all write paths stay inside the current prepared directory.\n\n' + prompt, encoding: 'utf8', stdio: ['pipe', log, log], timeout: 90 * 60 * 1000, windowsHide: true });
  } finally { fs.closeSync(log); }
  const violations = changed(before, snapshot(ROOT, [dir, reportDir]));
  fs.writeFileSync(path.join(reportDir, 'boundary-check.json'), JSON.stringify({ status: violations.length ? 'failed' : 'passed', violations }, null, 2));
  if (violations.length) throw new Error(`Generation changed files outside its prepared output: ${violations.join(', ')}`);
  assertStatus(result, 'Codex generation (see private codex.log)');
}
module.exports = { runCodex, invocation, snapshot, changed };
