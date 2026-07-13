'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  LocalModelAgent,
  hashThemeState
} = require('../lib/local-model/agent');
const {
  COMPILED_WRITE_PATHS,
  LOCAL_MODEL_STAGES,
  buildLocalModelStagePrompt,
  extractPromptSections,
  scopeContains,
  scopesOverlap,
  validateLocalModelPlan,
  validateStagePolicies
} = require('../lib/local-model/stages');

const MODEL_ID = 'fixture-model';
const BENCHMARK_PROMPT_PATH = path.resolve(__dirname, '..', '..', 'prompts', 'pending', '007-009-cinderline-digital-systems-benchmark.md');
const EXPECTED_STAGE_IDS = [
  '01-identity-copy',
  '02-header-navigation',
  '03-homepage-layout',
  '04-page-templates',
  '05-forms-admin',
  '06-scss-design-system',
  '07-js-interactions',
  '08-footer-cleanup',
  '09-docs-and-stale-copy-cleanup'
];

function writeFile(root, relativePath, content) {
  const target = path.join(root, ...relativePath.split('/'));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function makeFixture(t) {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'local-model-stages-agent-'));
  const themeDir = path.join(baseDir, '001_nolan_young_theme_fixture');
  const reportDir = path.join(baseDir, 'reports', 'run');
  const templateSourcePath = path.join(baseDir, 'template-source.txt');
  const assetManifestPath = path.join(baseDir, 'asset-manifest.json');
  fs.mkdirSync(themeDir, { recursive: true });
  fs.mkdirSync(reportDir, { recursive: true });
  writeFile(themeDir, 'style.css', 'style-old\n');
  writeFile(themeDir, 'functions.php', 'functions-old\n');
  fs.writeFileSync(templateSourcePath, 'template-source-v1\n');
  fs.writeFileSync(assetManifestPath, '{"assets":[]}\n');
  t.after(() => fs.rmSync(baseDir, { recursive: true, force: true }));
  return { baseDir, themeDir, reportDir, templateSourcePath, assetManifestPath };
}

function identityStage(overrides = {}) {
  return {
    id: '01-identity-copy',
    promptSections: ['Business Identity'],
    read: ['style.css'],
    write: ['style.css'],
    checks: ['fixture-check'],
    ...overrides
  };
}

function headerStage(overrides = {}) {
  return {
    id: '02-header-navigation',
    promptSections: ['Header'],
    read: ['functions.php'],
    write: ['functions.php'],
    checks: ['fixture-check'],
    ...overrides
  };
}

function makeDiff(relativePath, before, after) {
  return [
    `diff --git a/${relativePath} b/${relativePath}`,
    `--- a/${relativePath}`,
    `+++ b/${relativePath}`,
    '@@ -1 +1 @@',
    `-${before}`,
    `+${after}`
  ].join('\n');
}

function finalResponse(diff, suffix = '') {
  return {
    content: diff,
    toolCalls: [],
    finishReason: 'stop',
    model: MODEL_ID,
    raw: { id: `fixture-response${suffix}`, model: MODEL_ID, kind: 'final' }
  };
}

function toolResponse(id, name, argumentsValue) {
  return {
    content: '',
    toolCalls: [{
      id,
      type: 'function',
      function: { name, arguments: argumentsValue }
    }],
    finishReason: 'tool_calls',
    model: MODEL_ID,
    raw: { id: `fixture-${id}`, model: MODEL_ID, kind: 'tool' }
  };
}

function makeProvider(responses, options = {}) {
  const queue = [...responses];
  const requests = [];
  const modelId = options.modelId || MODEL_ID;
  const provider = {
    id: options.id || 'fixture-provider',
    label: options.label || 'Fixture Provider',
    modelId,
    requests,
    metadata() {
      return {
        id: this.id,
        label: this.label,
        modelId,
        checkedModelId: modelId,
        capabilities: { requiredToolCalling: true }
      };
    },
    async chatCompletion(request) {
      requests.push({
        ...request,
        messages: JSON.parse(JSON.stringify(request.messages)),
        tools: JSON.parse(JSON.stringify(request.tools))
      });
      if (!queue.length) {
        throw new Error('Fixture provider response queue is empty.');
      }
      const next = queue.shift();
      return typeof next === 'function' ? next(request, requests.length) : next;
    }
  };
  return provider;
}

function makeContextBuilder(calls = []) {
  return (options) => {
    calls.push(options);
    return {
      text: '<source path="style.css">style-old</source>',
      summary: {
        stageId: options.stage.id,
        includedFiles: [{ path: options.stage.read[0], bytes: 10, mode: 'full' }],
        totalBytes: 49,
        contextTruncated: false
      }
    };
  };
}

function makeToolFactory(runtimeLog = {}) {
  runtimeLog.created = runtimeLog.created || [];
  return (options) => {
    const state = { calls: 0, options };
    runtimeLog.created.push(state);
    return {
      definitions: [{
        type: 'function',
        function: {
          name: 'read_file',
          description: 'Fixture read tool',
          parameters: { type: 'object', properties: { path: { type: 'string' } } }
        }
      }, {
        type: 'function',
        function: {
          name: 'list_files',
          description: 'Fixture list tool',
          parameters: { type: 'object', properties: {} }
        }
      }],
      execute(name, args) {
        state.calls += 1;
        options.onRecord?.({ tool: name, callIndex: state.calls, ok: true, responseBytes: 40 });
        return JSON.stringify({ ok: true, tool: name, result: { args, fixture: true } });
      },
      getUsage() {
        return {
          calls: state.calls,
          maxCalls: options.maxCalls,
          responseBytes: state.calls * 40,
          maxResponseBytes: options.maxResponseBytes,
          maxCumulativeBytes: options.maxCumulativeBytes,
          exhausted: false
        };
      }
    };
  };
}

function successfulTransaction(mutator, calls = []) {
  return async (input) => {
    calls.push(input);
    const changedPath = input.writeScope[0];
    const checkResult = await input.runCandidateChecks(input.themeDir, { paths: [changedPath] });
    assert.equal(checkResult.ok, true);
    mutator(input, calls.length);
    return {
      changedPaths: [changedPath],
      gitCheck: { ok: true, command: 'fixture check' },
      gitApply: { ok: true, command: 'fixture apply' },
      checkResult
    };
  };
}

function makeAgent(options) {
  const logs = options.logs || [];
  return new LocalModelAgent({
    provider: options.provider,
    themeDir: options.themeDir,
    reportDir: options.reportDir,
    prompt: options.prompt,
    promptPath: options.promptPath,
    templateSourcePath: options.templateSourcePath,
    assetManifestPath: options.assetManifestPath,
    modelId: options.modelId || MODEL_ID,
    stages: options.stages,
    buildStageContext: options.buildStageContext || makeContextBuilder(),
    createReadOnlyTools: options.createReadOnlyTools || makeToolFactory(),
    applyPatchTransaction: options.applyPatchTransaction,
    runCandidateChecks: options.runCandidateChecks || (() => ({
      ok: true,
      results: [{ id: 'fixture-check', ok: true }],
      changedPaths: []
    })),
    maxToolCalls: options.maxToolCalls,
    maxMalformedToolRetries: options.maxMalformedToolRetries,
    stageTimeoutMs: 5000,
    heartbeatIntervalMs: 60000,
    resumeLocal: options.resumeLocal,
    resumeFromStage: options.resumeFromStage,
    logger: (message) => logs.push(message),
    now: options.now || (() => new Date('2026-07-10T12:00:00.000Z'))
  });
}

test('production policy declares the ordered nine stages with required fields, coverage, safe writes, and justified overlaps', () => {
  assert.deepEqual(LOCAL_MODEL_STAGES.map((stage) => stage.id), EXPECTED_STAGE_IDS);
  assert.equal(validateStagePolicies(LOCAL_MODEL_STAGES), true);

  for (const stage of LOCAL_MODEL_STAGES) {
    for (const key of ['promptSections', 'read', 'write', 'checks']) {
      assert.ok(Array.isArray(stage[key]) && stage[key].length > 0, `${stage.id}.${key} is required`);
    }
    for (const forbidden of COMPILED_WRITE_PATHS) {
      assert.equal(
        stage.write.some((writeScope) => scopeContains(writeScope, forbidden)),
        false,
        `${stage.id} must not own ${forbidden}`
      );
    }
  }

  for (let laterIndex = 1; laterIndex < LOCAL_MODEL_STAGES.length; laterIndex += 1) {
    const later = LOCAL_MODEL_STAGES[laterIndex];
    const overlaps = LOCAL_MODEL_STAGES.slice(0, laterIndex).some((earlier) =>
      earlier.write.some((left) => later.write.some((right) => scopesOverlap(left, right)))
    );
    if (overlaps) {
      assert.ok(later.overlapJustification && later.overlapJustification.trim(), `${later.id} overlap needs justification`);
    }
  }

  const allOwnedHeadings = [...new Set(LOCAL_MODEL_STAGES.flatMap((stage) => stage.promptSections))];
  const plan = validateLocalModelPlan(allOwnedHeadings, 'Fixture Provider');
  assert.deepEqual(plan.map((stage) => stage.id), EXPECTED_STAGE_IDS);
  assert.ok(plan.every((stage) => stage.matchedSections.length > 0));
  assert.throws(
    () => validateLocalModelPlan(['Business Identity'], 'Fixture Provider'),
    /02-header-navigation.*no matching production prompt coverage/
  );

  const overlappingClone = LOCAL_MODEL_STAGES.map((stage) => ({ ...stage, read: [...stage.read], write: [...stage.write] }));
  delete overlappingClone[1].overlapJustification;
  assert.throws(() => validateStagePolicies(overlappingClone), /overlaps an earlier write scope without overlapJustification/);
});

test('the actual 007-009 benchmark prompt covers every stage and page-template policy owns 403.php', () => {
  const benchmarkPrompt = fs.readFileSync(BENCHMARK_PROMPT_PATH, 'utf8');
  const headings = benchmarkPrompt.split(/\r?\n/)
    .map((line) => line.match(/^#{1,6}\s+(.+?)\s*$/))
    .filter(Boolean)
    .map((match) => match[1]);
  const plan = validateLocalModelPlan(headings, 'Benchmark Fixture');

  assert.deepEqual(plan.map((stage) => stage.id), EXPECTED_STAGE_IDS);
  assert.ok(plan.every((stage) => stage.matchedSections.length > 0));
  const pageTemplates = LOCAL_MODEL_STAGES.find((stage) => stage.id === '04-page-templates');
  assert.ok(pageTemplates);
  assert.ok(pageTemplates.read.includes('403.php'), 'stage 04 must inspect 403.php');
  assert.ok(pageTemplates.write.includes('403.php'), 'stage 04 must own 403.php cleanup');
});

test('prompt extraction uses exact explicit ownership without adjacent or nested section capture', () => {
  const prompt = [
    '## Functionality',
    'Only the direct functionality body.',
    '### Webpack Build Requirements',
    'Nested webpack requirements.',
    '### WordPress Security Requirements',
    'Nested security requirements.',
    '## Accessibility',
    'Only generic accessibility guidance.',
    '## Accessibility and Motion',
    'Specialized motion guidance.',
    '## Accessibility and Visual Quality',
    'Specialized visual-quality guidance.'
  ].join('\n');

  const accessibility = extractPromptSections(prompt, ['Accessibility']);
  assert.match(accessibility, /Only generic accessibility guidance/);
  assert.doesNotMatch(accessibility, /Specialized motion guidance/);
  assert.doesNotMatch(accessibility, /Specialized visual-quality guidance/);

  const functionality = extractPromptSections(prompt, ['Functionality']);
  assert.match(functionality, /Only the direct functionality body/);
  assert.doesNotMatch(functionality, /Nested webpack requirements/);
  assert.doesNotMatch(functionality, /Nested security requirements/);

  const explicitlyOwned = extractPromptSections(prompt, [
    'Functionality',
    'Webpack Build Requirements',
    'WordPress Security Requirements'
  ]);
  assert.match(explicitlyOwned, /Only the direct functionality body/);
  assert.match(explicitlyOwned, /Nested webpack requirements/);
  assert.match(explicitlyOwned, /Nested security requirements/);
});

test('stage prompt enforces scoped inspection and final unified-diff-only contract', () => {
  const stage = LOCAL_MODEL_STAGES[1];
  const prompt = [
    '## Business Identity',
    'Cinderline Digital Systems.',
    '## Header',
    'Use a compact accessible header.',
    '### Header Behavior',
    'Escape closes disclosures.',
    '## Unowned Secret Section',
    'This text must not appear in the owned prompt.'
  ].join('\n');
  const rendered = buildLocalModelStagePrompt({
    provider: 'fixture-provider',
    model: MODEL_ID,
    stage,
    stageIndex: 1,
    stageCount: 9,
    context: '<source path="header.php">fixture</source>',
    productionPrompt: prompt
  });

  assert.match(rendered, /planned local-model stage 2\/9: 02-header-navigation/);
  assert.match(rendered, /Read scope \(inspection only\):/);
  assert.match(rendered, /Write scope \(the final patch may touch only these paths\):/);
  assert.match(rendered, /Available read-only tools: list_files, read_file, read_file_excerpt, search_files/);
  assert.match(rendered, /Do not assume file contents/);
  assert.match(rendered, /Return exactly one textual unified diff/);
  assert.match(rendered, /Return no explanation, preface, summary, or trailing prose/);
  assert.match(rendered, /Complete-file marker protocols are forbidden/);
  assert.match(rendered, /Do not modify compiled bundles or package-lock\.json/);
  assert.match(rendered, /Business identity reference/);
  assert.match(rendered, /Cinderline Digital Systems/);
  assert.match(rendered, /Use a compact accessible header/);
  assert.doesNotMatch(rendered, /This text must not appear/);
});

test('one-stage final diff writes reports, progress, and checkpoint after one transactional apply', async (t) => {
  const { themeDir, reportDir } = makeFixture(t);
  const stage = identityStage();
  const diff = makeDiff('style.css', 'style-old', 'style-new');
  const provider = makeProvider([finalResponse(diff)]);
  const contextCalls = [];
  const toolLog = {};
  const patchCalls = [];
  const logs = [];
  const agent = makeAgent({
    provider,
    themeDir,
    reportDir,
    prompt: '## Business Identity\nCinderline Digital Systems',
    stages: [stage],
    buildStageContext: makeContextBuilder(contextCalls),
    createReadOnlyTools: makeToolFactory(toolLog),
    applyPatchTransaction: successfulTransaction(() => writeFile(themeDir, 'style.css', 'style-new\n'), patchCalls),
    logs
  });

  const result = await agent.run();
  assert.equal(result.status, 'completed');
  assert.equal(provider.requests.length, 1);
  assert.equal(patchCalls.length, 1);
  assert.equal(patchCalls[0].patch, diff);
  assert.deepEqual(patchCalls[0].writeScope, ['style.css']);
  assert.equal(contextCalls.length, 1);
  assert.equal(toolLog.created.length, 1);
  assert.equal(fs.readFileSync(path.join(themeDir, 'style.css'), 'utf8'), 'style-new\n');

  const localReportDir = path.join(reportDir, 'local-model');
  const stageDir = path.join(localReportDir, stage.id);
  for (const file of [
    'stage-config.json',
    'context-summary.json',
    'initial-context.txt',
    'stage-prompt.txt',
    'raw-model-response.txt',
    'provider-responses.json',
    'provider-request-metadata.json',
    'tool-calls.json',
    'extracted.patch',
    'result.json'
  ]) {
    assert.equal(fs.existsSync(path.join(stageDir, file)), true, `${file} evidence is required`);
  }
  const session = readJson(path.join(localReportDir, 'session.json'));
  assert.equal(session.status, 'completed');
  assert.equal(session.finalThemeStateHash, hashThemeState(themeDir));
  const checkpoints = readJson(path.join(localReportDir, 'checkpoints.json'));
  assert.equal(checkpoints.length, 1);
  assert.equal(checkpoints[0].stageId, stage.id);
  assert.equal(checkpoints[0].resultingThemeStateHash, hashThemeState(themeDir));
  assert.deepEqual(checkpoints[0].changedPaths, ['style.css']);
  const stageResult = readJson(path.join(stageDir, 'result.json'));
  assert.equal(stageResult.status, 'completed');
  assert.deepEqual(stageResult.changedPaths, ['style.css']);
  assert.ok(stageResult.events.some((event) => event.phase === 'context'));
  assert.ok(stageResult.events.some((event) => event.phase === 'patch-extraction'));
  assert.ok(stageResult.events.some((event) => event.phase === 'candidate-checks'));
  assert.ok(stageResult.events.some((event) => event.phase === 'completed'));
  assert.ok(logs.some((message) => message.includes('[LocalModelAgent] Starting generation')));
  assert.ok(logs.some((message) => message.includes('All local-model stages completed')));
});

test('bounded tool loop returns tool results to the provider and stops at the final diff', async (t) => {
  const { themeDir, reportDir } = makeFixture(t);
  const diff = makeDiff('style.css', 'style-old', 'style-new');
  const provider = makeProvider([
    toolResponse('call-1', 'list_files', '{}'),
    toolResponse('call-2', 'read_file', '{"path":"style.css"}'),
    finalResponse(diff)
  ]);
  const toolLog = {};
  const agent = makeAgent({
    provider,
    themeDir,
    reportDir,
    prompt: '## Business Identity\nCinderline',
    stages: [identityStage()],
    createReadOnlyTools: makeToolFactory(toolLog),
    maxToolCalls: 2,
    applyPatchTransaction: successfulTransaction(() => writeFile(themeDir, 'style.css', 'style-new\n'))
  });

  await agent.run();
  assert.equal(provider.requests.length, 3);
  assert.equal(toolLog.created[0].calls, 2);
  assert.equal(provider.requests[1].messages.filter((message) => message.role === 'tool').length, 1);
  assert.equal(provider.requests[2].messages.filter((message) => message.role === 'tool').length, 2);
  const evidence = readJson(path.join(reportDir, 'local-model', '01-identity-copy', 'tool-calls.json'));
  assert.equal(evidence.requests.length, 2);
  assert.equal(evidence.usage.calls, 2);
});

test('tool-call count exceeding the bound fails without applying a patch', async (t) => {
  const { themeDir, reportDir } = makeFixture(t);
  const provider = makeProvider([{
    content: '',
    toolCalls: [
      toolResponse('call-1', 'list_files', '{}').toolCalls[0],
      toolResponse('call-2', 'read_file', '{"path":"style.css"}').toolCalls[0]
    ],
    finishReason: 'tool_calls',
    model: MODEL_ID,
    raw: { id: 'too-many-tools' }
  }]);
  const toolLog = {};
  let patchCalls = 0;
  const agent = makeAgent({
    provider,
    themeDir,
    reportDir,
    prompt: '## Business Identity\nCinderline',
    stages: [identityStage()],
    createReadOnlyTools: makeToolFactory(toolLog),
    maxToolCalls: 1,
    applyPatchTransaction: async () => { patchCalls += 1; }
  });

  await assert.rejects(agent.run(), (error) => error.code === 'TOOL_CALL_LIMIT_EXCEEDED');
  assert.equal(provider.requests.length, 1);
  assert.equal(toolLog.created[0].calls, 1);
  assert.equal(patchCalls, 0);
  assert.equal(fs.readFileSync(path.join(themeDir, 'style.css'), 'utf8'), 'style-old\n');
  assert.equal(readJson(path.join(reportDir, 'local-model', 'session.json')).status, 'failed');
});

test('malformed tool JSON receives exactly one protocol retry before a final diff', async (t) => {
  const { themeDir, reportDir } = makeFixture(t);
  const diff = makeDiff('style.css', 'style-old', 'style-new');
  const provider = makeProvider([
    toolResponse('bad-call', 'read_file', '{not-json'),
    finalResponse(diff)
  ]);
  const toolLog = {};
  const agent = makeAgent({
    provider,
    themeDir,
    reportDir,
    prompt: '## Business Identity\nCinderline',
    stages: [identityStage()],
    createReadOnlyTools: makeToolFactory(toolLog),
    maxMalformedToolRetries: 1,
    applyPatchTransaction: successfulTransaction(() => writeFile(themeDir, 'style.css', 'style-new\n'))
  });

  await agent.run();
  assert.equal(provider.requests.length, 2);
  assert.equal(toolLog.created[0].calls, 0);
  assert.ok(provider.requests[1].messages.some((message) =>
    message.role === 'user' && /prior structured tool call was malformed/.test(message.content)
  ));
  const result = readJson(path.join(reportDir, 'local-model', '01-identity-copy', 'result.json'));
  assert.equal(result.events.filter((event) => event.phase === 'protocol-retry').length, 1);
});

test('candidate or patch failure marks the session failed, preserves source, and starts no repair request', async (t) => {
  for (const failureType of ['candidate', 'patch']) {
    await t.test(failureType, async (subtest) => {
      const { themeDir, reportDir } = makeFixture(subtest);
      const diff = makeDiff('style.css', 'style-old', 'style-new');
      const provider = makeProvider([finalResponse(diff)]);
      let candidateChecks = 0;
      const applyPatchTransaction = failureType === 'candidate'
        ? async (input) => {
          const result = await input.runCandidateChecks(input.themeDir, { paths: ['style.css'] });
          assert.equal(result.ok, false);
          const error = new Error('candidate validation failed');
          error.code = 'CANDIDATE_CHECK_FAILED';
          throw error;
        }
        : async () => {
          const error = new Error('patch check failed');
          error.code = 'PATCH_CHECK_FAILED';
          throw error;
        };
      const agent = makeAgent({
        provider,
        themeDir,
        reportDir,
        prompt: '## Business Identity\nCinderline',
        stages: [identityStage()],
        applyPatchTransaction,
        runCandidateChecks: () => {
          candidateChecks += 1;
          return { ok: false, errors: ['fixture failure'], results: [{ id: 'fixture-check', ok: false }] };
        }
      });

      await assert.rejects(agent.run(), (error) => {
        assert.match(error.message, /No repair pass was started/);
        return error.code === (failureType === 'candidate' ? 'CANDIDATE_CHECK_FAILED' : 'PATCH_CHECK_FAILED');
      });
      assert.equal(provider.requests.length, 1, 'failure must not make a repair request');
      assert.equal(candidateChecks, failureType === 'candidate' ? 1 : 0);
      assert.equal(fs.readFileSync(path.join(themeDir, 'style.css'), 'utf8'), 'style-old\n');
      const session = readJson(path.join(reportDir, 'local-model', 'session.json'));
      assert.equal(session.status, 'failed');
      assert.equal(session.failedStage, '01-identity-copy');
      assert.equal(readJson(path.join(reportDir, 'local-model', 'checkpoints.json')).length, 0);
      const result = readJson(path.join(reportDir, 'local-model', '01-identity-copy', 'result.json'));
      assert.equal(result.status, 'failed');
    });
  }
});

test('safe resume accepts a matching completed-stage checkpoint and runs only the next stage', async (t) => {
  const { themeDir, reportDir } = makeFixture(t);
  const stages = [identityStage(), headerStage()];
  const prompt = '## Business Identity\nCinderline\n## Header\nAccessible navigation';
  const initialProvider = makeProvider([
    finalResponse(makeDiff('style.css', 'style-old', 'style-one'), '-1'),
    finalResponse(makeDiff('functions.php', 'functions-old', 'functions-two'), '-2')
  ]);
  const initialAgent = makeAgent({
    provider: initialProvider,
    themeDir,
    reportDir,
    prompt,
    stages,
    applyPatchTransaction: successfulTransaction((input) => {
      if (input.writeScope.includes('style.css')) {
        writeFile(themeDir, 'style.css', 'style-one\n');
      } else {
        writeFile(themeDir, 'functions.php', 'functions-two\n');
      }
    })
  });
  await initialAgent.run();

  const localReportDir = path.join(reportDir, 'local-model');
  const checkpoints = readJson(path.join(localReportDir, 'checkpoints.json'));
  assert.equal(checkpoints.length, 2);
  writeJson(path.join(localReportDir, 'checkpoints.json'), [checkpoints[0]]);
  writeFile(themeDir, 'style.css', 'style-one\n');
  writeFile(themeDir, 'functions.php', 'functions-old\n');
  assert.equal(hashThemeState(themeDir), checkpoints[0].resultingThemeStateHash);
  const session = readJson(path.join(localReportDir, 'session.json'));
  session.status = 'running';
  delete session.completedAt;
  delete session.finalThemeStateHash;
  writeJson(path.join(localReportDir, 'session.json'), session);

  const resumeProvider = makeProvider([
    finalResponse(makeDiff('functions.php', 'functions-old', 'functions-two'), '-resume')
  ]);
  const logs = [];
  const resumeAgent = makeAgent({
    provider: resumeProvider,
    themeDir,
    reportDir,
    prompt,
    stages,
    resumeLocal: true,
    resumeFromStage: '02-header-navigation',
    logs,
    applyPatchTransaction: successfulTransaction(() => writeFile(themeDir, 'functions.php', 'functions-two\n'))
  });
  const resumed = await resumeAgent.run();

  assert.equal(resumed.status, 'completed');
  assert.equal(resumeProvider.requests.length, 1);
  assert.equal(fs.readFileSync(path.join(themeDir, 'style.css'), 'utf8'), 'style-one\n');
  assert.equal(fs.readFileSync(path.join(themeDir, 'functions.php'), 'utf8'), 'functions-two\n');
  assert.equal(readJson(path.join(localReportDir, 'checkpoints.json')).length, 2);
  assert.ok(logs.some((message) => /Resuming at stage 2\/2/.test(message)));
});

test('a failed session cannot resume from its last successful checkpoint', async (t) => {
  const { themeDir, reportDir } = makeFixture(t);
  const stages = [identityStage(), headerStage()];
  const prompt = '## Business Identity\nCinderline\n## Header\nAccessible navigation';
  const provider = makeProvider([
    finalResponse(makeDiff('style.css', 'style-old', 'style-one'), '-checkpoint'),
    finalResponse(makeDiff('functions.php', 'functions-old', 'functions-two'), '-failed-stage')
  ]);
  let transactionCount = 0;
  const agent = makeAgent({
    provider,
    themeDir,
    reportDir,
    prompt,
    stages,
    applyPatchTransaction: async (input) => {
      transactionCount += 1;
      if (transactionCount === 1) {
        const checkResult = await input.runCandidateChecks(input.themeDir, { paths: ['style.css'] });
        writeFile(themeDir, 'style.css', 'style-one\n');
        return {
          changedPaths: ['style.css'],
          gitCheck: { ok: true },
          gitApply: { ok: true },
          checkResult
        };
      }
      const error = new Error('second stage patch failed');
      error.code = 'PATCH_CHECK_FAILED';
      throw error;
    }
  });

  await assert.rejects(agent.run(), (error) => error.code === 'PATCH_CHECK_FAILED');
  const localReportDir = path.join(reportDir, 'local-model');
  assert.equal(readJson(path.join(localReportDir, 'session.json')).status, 'failed');
  const checkpoints = readJson(path.join(localReportDir, 'checkpoints.json'));
  assert.equal(checkpoints.length, 1);
  assert.equal(checkpoints[0].stageId, '01-identity-copy');
  assert.equal(hashThemeState(themeDir), checkpoints[0].resultingThemeStateHash);

  const resumeProvider = makeProvider([]);
  const resumeAgent = makeAgent({
    provider: resumeProvider,
    themeDir,
    reportDir,
    prompt,
    stages,
    resumeLocal: true,
    resumeFromStage: '02-header-navigation',
    applyPatchTransaction: async () => { throw new Error('must not apply'); }
  });
  await assert.rejects(resumeAgent.run(), (error) => error.code === 'FAILED_SESSION_NOT_RESUMABLE');
  assert.equal(resumeProvider.requests.length, 0);
});

async function createResumeBaseline(t) {
  const fixture = makeFixture(t);
  const stage = identityStage();
  const prompt = '## Business Identity\nCinderline';
  const provider = makeProvider([finalResponse(makeDiff('style.css', 'style-old', 'style-one'))]);
  const agent = makeAgent({
    provider,
    themeDir: fixture.themeDir,
    reportDir: fixture.reportDir,
    prompt,
    templateSourcePath: fixture.templateSourcePath,
    assetManifestPath: fixture.assetManifestPath,
    stages: [stage],
    applyPatchTransaction: successfulTransaction(() => writeFile(fixture.themeDir, 'style.css', 'style-one\n'))
  });
  await agent.run();
  const sessionFile = path.join(fixture.reportDir, 'local-model', 'session.json');
  const session = readJson(sessionFile);
  session.status = 'running';
  delete session.completedAt;
  delete session.finalThemeStateHash;
  writeJson(sessionFile, session);
  return { ...fixture, stage, prompt };
}

test('resume rejects prompt, template, asset, provider, model, policy, and prepared-theme hash mismatches before provider use', async (t) => {
  await t.test('prompt hash', async (subtest) => {
    const baseline = await createResumeBaseline(subtest);
    const provider = makeProvider([]);
    const agent = makeAgent({
      provider,
      themeDir: baseline.themeDir,
      reportDir: baseline.reportDir,
      prompt: `${baseline.prompt}\nChanged requirement`,
      templateSourcePath: baseline.templateSourcePath,
      assetManifestPath: baseline.assetManifestPath,
      stages: [baseline.stage],
      resumeLocal: true,
      applyPatchTransaction: async () => { throw new Error('must not apply'); }
    });
    await assert.rejects(agent.run(), (error) =>
      error.code === 'RESUME_HASH_MISMATCH' && error.details.key === 'promptHash'
    );
    assert.equal(provider.requests.length, 0);
  });

  await t.test('template source hash', async (subtest) => {
    const baseline = await createResumeBaseline(subtest);
    fs.writeFileSync(baseline.templateSourcePath, 'template-source-v2\n');
    const provider = makeProvider([]);
    const agent = makeAgent({
      provider,
      themeDir: baseline.themeDir,
      reportDir: baseline.reportDir,
      prompt: baseline.prompt,
      templateSourcePath: baseline.templateSourcePath,
      assetManifestPath: baseline.assetManifestPath,
      stages: [baseline.stage],
      resumeLocal: true,
      applyPatchTransaction: async () => { throw new Error('must not apply'); }
    });
    await assert.rejects(agent.run(), (error) =>
      error.code === 'RESUME_HASH_MISMATCH' && error.details.key === 'templateSourceHash'
    );
    assert.equal(provider.requests.length, 0);
  });

  await t.test('asset manifest hash', async (subtest) => {
    const baseline = await createResumeBaseline(subtest);
    fs.writeFileSync(baseline.assetManifestPath, '{"assets":[{"id":"changed"}]}\n');
    const provider = makeProvider([]);
    const agent = makeAgent({
      provider,
      themeDir: baseline.themeDir,
      reportDir: baseline.reportDir,
      prompt: baseline.prompt,
      templateSourcePath: baseline.templateSourcePath,
      assetManifestPath: baseline.assetManifestPath,
      stages: [baseline.stage],
      resumeLocal: true,
      applyPatchTransaction: async () => { throw new Error('must not apply'); }
    });
    await assert.rejects(agent.run(), (error) =>
      error.code === 'RESUME_HASH_MISMATCH' && error.details.key === 'assetManifestHash'
    );
    assert.equal(provider.requests.length, 0);
  });

  await t.test('provider identity', async (subtest) => {
    const baseline = await createResumeBaseline(subtest);
    const provider = makeProvider([], { id: 'different-provider' });
    const agent = makeAgent({
      provider,
      themeDir: baseline.themeDir,
      reportDir: baseline.reportDir,
      prompt: baseline.prompt,
      templateSourcePath: baseline.templateSourcePath,
      assetManifestPath: baseline.assetManifestPath,
      stages: [baseline.stage],
      resumeLocal: true,
      applyPatchTransaction: async () => { throw new Error('must not apply'); }
    });
    await assert.rejects(agent.run(), (error) =>
      error.code === 'RESUME_HASH_MISMATCH' && error.details.key === 'provider'
    );
    assert.equal(provider.requests.length, 0);
  });

  await t.test('model identity', async (subtest) => {
    const baseline = await createResumeBaseline(subtest);
    const changedModel = 'fixture-model-v2';
    const provider = makeProvider([], { modelId: changedModel });
    const agent = makeAgent({
      provider,
      modelId: changedModel,
      themeDir: baseline.themeDir,
      reportDir: baseline.reportDir,
      prompt: baseline.prompt,
      templateSourcePath: baseline.templateSourcePath,
      assetManifestPath: baseline.assetManifestPath,
      stages: [baseline.stage],
      resumeLocal: true,
      applyPatchTransaction: async () => { throw new Error('must not apply'); }
    });
    await assert.rejects(agent.run(), (error) =>
      error.code === 'RESUME_HASH_MISMATCH' && error.details.key === 'modelId'
    );
    assert.equal(provider.requests.length, 0);
  });

  await t.test('stage policy hash', async (subtest) => {
    const baseline = await createResumeBaseline(subtest);
    const provider = makeProvider([]);
    const changedStage = identityStage({ checks: ['fixture-check', 'additional-check'] });
    const agent = makeAgent({
      provider,
      themeDir: baseline.themeDir,
      reportDir: baseline.reportDir,
      prompt: baseline.prompt,
      templateSourcePath: baseline.templateSourcePath,
      assetManifestPath: baseline.assetManifestPath,
      stages: [changedStage],
      resumeLocal: true,
      applyPatchTransaction: async () => { throw new Error('must not apply'); }
    });
    await assert.rejects(agent.run(), (error) =>
      error.code === 'RESUME_HASH_MISMATCH' && error.details.key === 'stagePolicyHash'
    );
    assert.equal(provider.requests.length, 0);
  });

  await t.test('theme state hash', async (subtest) => {
    const baseline = await createResumeBaseline(subtest);
    writeFile(baseline.themeDir, 'functions.php', 'out-of-band change\n');
    const provider = makeProvider([]);
    const agent = makeAgent({
      provider,
      themeDir: baseline.themeDir,
      reportDir: baseline.reportDir,
      prompt: baseline.prompt,
      templateSourcePath: baseline.templateSourcePath,
      assetManifestPath: baseline.assetManifestPath,
      stages: [baseline.stage],
      resumeLocal: true,
      applyPatchTransaction: async () => { throw new Error('must not apply'); }
    });
    await assert.rejects(agent.run(), (error) => error.code === 'RESUME_THEME_HASH_MISMATCH');
    assert.equal(provider.requests.length, 0);
  });
});
