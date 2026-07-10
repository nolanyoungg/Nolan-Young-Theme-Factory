'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const { buildStageContext } = require('./context');
const { applyPatchTransaction } = require('./patch');
const { extractUnifiedDiff, normalizeToolCalls, ProtocolError } = require('./protocols');
const {
  LOCAL_MODEL_STAGES,
  buildLocalModelStagePrompt,
  validateStagePolicies
} = require('./stages');
const { createReadOnlyTools } = require('./tools');

const DEFAULT_STAGE_TIMEOUT_MS = 30 * 60 * 1000;
const DEFAULT_HEARTBEAT_INTERVAL_MS = 60 * 1000;
const DEFAULT_MAX_CONTEXT_BYTES = 64 * 1024;
const DEFAULT_MAX_TOOL_CALLS = 12;
const DEFAULT_MAX_TOOL_RESPONSE_BYTES = 40 * 1024;
const DEFAULT_MAX_CUMULATIVE_TOOL_BYTES = 48 * 1024;
const DEFAULT_MAX_MALFORMED_TOOL_RETRIES = 1;
const DEFAULT_MAX_OUTPUT_TOKENS = 8192;
const SESSION_VERSION = 1;

class LocalModelAgentError extends Error {
  constructor(message, options = {}) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = 'LocalModelAgentError';
    this.code = options.code || 'LOCAL_MODEL_AGENT_ERROR';
    if (options.details !== undefined) {
      this.details = options.details;
    }
  }
}

class LocalModelAgent {
  constructor(options = {}) {
    if (!options.provider || typeof options.provider.chatCompletion !== 'function') {
      throw new LocalModelAgentError('LocalModelAgent requires a provider with chatCompletion(request).', {
        code: 'MISSING_PROVIDER'
      });
    }
    if (!options.themeDir || !fs.existsSync(options.themeDir)) {
      throw new LocalModelAgentError(`Prepared theme directory does not exist: ${options.themeDir || '(missing)'}.`, {
        code: 'MISSING_THEME_DIRECTORY'
      });
    }
    if (!options.reportDir) {
      throw new LocalModelAgentError('LocalModelAgent requires a run report directory.', {
        code: 'MISSING_REPORT_DIRECTORY'
      });
    }
    this.provider = options.provider;
    this.themeDir = path.resolve(options.themeDir);
    this.reportDir = path.resolve(options.reportDir);
    this.localReportDir = path.join(this.reportDir, 'local-model');
    this.prompt = String(options.prompt || '');
    this.promptPath = options.promptPath ? path.resolve(options.promptPath) : null;
    this.templateSourcePath = options.templateSourcePath ? path.resolve(options.templateSourcePath) : null;
    this.assetManifestPath = options.assetManifestPath ? path.resolve(options.assetManifestPath) : null;
    this.modelId = String(options.modelId || this.provider.modelId || '').trim();
    this.stages = options.stages || LOCAL_MODEL_STAGES;
    this.maxContextBytes = positiveInteger(options.maxContextBytes, DEFAULT_MAX_CONTEXT_BYTES, 'maxContextBytes');
    this.maxToolCalls = positiveInteger(options.maxToolCalls, DEFAULT_MAX_TOOL_CALLS, 'maxToolCalls');
    this.maxToolResponseBytes = positiveInteger(options.maxToolResponseBytes, DEFAULT_MAX_TOOL_RESPONSE_BYTES, 'maxToolResponseBytes');
    this.maxCumulativeToolBytes = positiveInteger(options.maxCumulativeToolBytes, DEFAULT_MAX_CUMULATIVE_TOOL_BYTES, 'maxCumulativeToolBytes');
    this.maxMalformedToolRetries = nonNegativeInteger(options.maxMalformedToolRetries, DEFAULT_MAX_MALFORMED_TOOL_RETRIES, 'maxMalformedToolRetries');
    this.maxOutputTokens = positiveInteger(options.maxOutputTokens, DEFAULT_MAX_OUTPUT_TOKENS, 'maxOutputTokens');
    this.stageTimeoutMs = positiveInteger(options.stageTimeoutMs, DEFAULT_STAGE_TIMEOUT_MS, 'stageTimeoutMs');
    this.heartbeatIntervalMs = positiveInteger(options.heartbeatIntervalMs, DEFAULT_HEARTBEAT_INTERVAL_MS, 'heartbeatIntervalMs');
    this.resumeLocal = Boolean(options.resumeLocal || options.resumeFromStage);
    this.resumeFromStage = options.resumeFromStage ? String(options.resumeFromStage) : null;
    this.logger = typeof options.logger === 'function' ? options.logger : console.log;
    this.candidateChecks = options.runCandidateChecks || runCandidateChecks;
    this.applyPatch = options.applyPatchTransaction || applyPatchTransaction;
    this.contextBuilder = options.buildStageContext || buildStageContext;
    this.toolFactory = options.createReadOnlyTools || createReadOnlyTools;
    this.now = options.now || (() => new Date());
    this.progressEvents = [];
    this.sessionFile = path.join(this.localReportDir, 'session.json');
    this.checkpointFile = path.join(this.localReportDir, 'checkpoints.json');

    if (!this.prompt.trim()) {
      throw new LocalModelAgentError('Production prompt content is empty.', { code: 'EMPTY_PRODUCTION_PROMPT' });
    }
    if (!this.modelId) {
      throw new LocalModelAgentError('LocalModelAgent requires an exact model id.', { code: 'MISSING_MODEL_ID' });
    }
    validateStagePolicies(this.stages);
  }

  async run() {
    this.assertProviderPreflight();
    ensureDir(this.localReportDir);
    const identity = this.buildSessionIdentity();
    const resume = this.prepareSession(identity);
    const providerMetadata = safeProviderMetadata(this.provider);

    this.log(`[LocalModelAgent] Starting generation`);
    this.log(`[LocalModelAgent] Provider: ${this.provider.id}`);
    this.log(`[LocalModelAgent] Model: ${this.modelId}`);
    this.log(`[LocalModelAgent] Theme: ${path.basename(this.themeDir)}`);
    this.log(`[LocalModelAgent] Stages: ${this.stages.length}`);
    if (resume.startIndex > 0) {
      this.log(`[LocalModelAgent] Resuming at stage ${resume.startIndex + 1}/${this.stages.length}`);
    }

    for (let index = resume.startIndex; index < this.stages.length; index += 1) {
      const stage = this.stages[index];
      await this.runStage(stage, index, providerMetadata, identity);
    }

    const session = readJson(this.sessionFile);
    session.status = 'completed';
    session.completedAt = this.timestamp();
    session.finalThemeStateHash = hashThemeState(this.themeDir);
    writeJson(this.sessionFile, session);
    writeJson(path.join(this.localReportDir, 'progress.json'), this.progressEvents);
    this.log('[LocalModelAgent] All local-model stages completed');
    return {
      status: 'completed',
      completedStages: this.stages.length,
      sessionFile: this.sessionFile,
      checkpoints: readCheckpoints(this.checkpointFile)
    };
  }

  assertProviderPreflight() {
    const metadata = safeProviderMetadata(this.provider);
    if (!metadata.capabilities || metadata.capabilities.requiredToolCalling !== true) {
      throw new LocalModelAgentError(
        `BLOCKED: ${this.provider.label || this.provider.id} model ${this.modelId} has not passed the required structured tool-calling preflight. Run theme:model-check with this provider and model before generation.`,
        { code: 'TOOL_CAPABILITY_NOT_VERIFIED' }
      );
    }
    if (metadata.checkedModelId && metadata.checkedModelId !== this.modelId) {
      throw new LocalModelAgentError(`Provider preflight checked ${metadata.checkedModelId}, but generation requested ${this.modelId}.`, {
        code: 'MODEL_PREFLIGHT_MISMATCH'
      });
    }
  }

  buildSessionIdentity() {
    return {
      version: SESSION_VERSION,
      themeSlug: path.basename(this.themeDir),
      promptPath: portablePath(this.promptPath),
      promptHash: sha256(this.prompt),
      templateSourcePath: portablePath(this.templateSourcePath),
      templateSourceHash: this.templateSourcePath
        ? hashPath(this.templateSourcePath, { exclude: new Set(['node_modules']) })
        : null,
      provider: this.provider.id,
      modelId: this.modelId,
      stagePolicyHash: sha256(stableStringify(this.stages)),
      assetManifestPath: portablePath(this.assetManifestPath),
      assetManifestHash: this.assetManifestPath && fs.existsSync(this.assetManifestPath)
        ? hashPath(this.assetManifestPath)
        : null
    };
  }

  prepareSession(identity) {
    if (!this.resumeLocal) {
      if (fs.existsSync(this.sessionFile)) {
        throw new LocalModelAgentError('A local-model session already exists for this theme. Use --resume-local only for an interrupted successful-stage sequence.', {
          code: 'SESSION_ALREADY_EXISTS'
        });
      }
      const initialThemeStateHash = hashThemeState(this.themeDir);
      writeJson(this.sessionFile, {
        ...identity,
        initialThemeStateHash,
        status: 'running',
        startedAt: this.timestamp()
      });
      writeJson(this.checkpointFile, []);
      return { startIndex: 0 };
    }

    if (!fs.existsSync(this.sessionFile)) {
      throw new LocalModelAgentError('No local-model session exists to resume.', { code: 'MISSING_RESUME_SESSION' });
    }
    const session = readJson(this.sessionFile);
    if (session.status === 'failed') {
      throw new LocalModelAgentError('The prior local-model session contains a failed generated stage and cannot be resumed as a repair pass.', {
        code: 'FAILED_SESSION_NOT_RESUMABLE'
      });
    }
    for (const key of ['promptHash', 'templateSourceHash', 'provider', 'modelId', 'stagePolicyHash', 'assetManifestHash']) {
      if ((session[key] || null) !== (identity[key] || null)) {
        throw new LocalModelAgentError(`Resume rejected because ${key} no longer matches the recorded session.`, {
          code: 'RESUME_HASH_MISMATCH',
          details: { key, expected: session[key] || null, actual: identity[key] || null }
        });
      }
    }
    const checkpoints = readCheckpoints(this.checkpointFile);
    const latest = checkpoints.at(-1) || null;
    const expectedThemeHash = latest ? latest.resultingThemeStateHash : session.initialThemeStateHash;
    const currentThemeHash = hashThemeState(this.themeDir);
    if (expectedThemeHash !== currentThemeHash) {
      throw new LocalModelAgentError('Resume rejected because the prepared theme state differs from the last committed checkpoint.', {
        code: 'RESUME_THEME_HASH_MISMATCH',
        details: { expected: expectedThemeHash, actual: currentThemeHash }
      });
    }
    let startIndex = latest ? latest.stageIndex + 1 : 0;
    if (this.resumeFromStage) {
      const requestedIndex = this.stages.findIndex((stage) => stage.id === this.resumeFromStage);
      if (requestedIndex === -1) {
        throw new LocalModelAgentError(`Unknown --resume-from-stage id: ${this.resumeFromStage}.`, {
          code: 'UNKNOWN_RESUME_STAGE'
        });
      }
      if (requestedIndex !== startIndex) {
        throw new LocalModelAgentError(`Safe resume may start only at ${this.stages[startIndex]?.id || '(all stages already complete)'}, not ${this.resumeFromStage}.`, {
          code: 'UNSAFE_RESUME_STAGE'
        });
      }
      startIndex = requestedIndex;
    }
    return { startIndex };
  }

  async runStage(stage, index, providerMetadata, identity) {
    const stageDir = path.join(this.localReportDir, stage.id);
    ensureDir(stageDir);
    const startedAtMs = Date.now();
    let currentPhase = 'starting';
    const stageEvents = [];
    const providerResponses = [];
    const requestMetadata = [];
    const toolRecords = [];
    const toolRequests = [];
    let finalResponse = '';
    let extractedDiff = '';
    let timer;
    let heartbeat;
    const controller = new AbortController();

    const progress = (phase, message, details = {}) => {
      currentPhase = phase;
      const event = this.progress(stage, index, phase, message, details);
      stageEvents.push(event);
    };

    try {
      timer = setTimeout(() => controller.abort(new Error('stage timeout')), stage.timeoutMs || this.stageTimeoutMs);
      timer.unref?.();
      heartbeat = setInterval(() => {
        const elapsed = formatDuration(Date.now() - startedAtMs);
        this.log(`[${this.timestamp()}] [Stage ${index + 1}/${this.stages.length}] ${stage.id} heartbeat — ${currentPhase}; elapsed ${elapsed}`);
      }, this.heartbeatIntervalMs);
      heartbeat.unref?.();

      progress('starting', 'starting', {
        provider: this.provider.id,
        model: this.modelId
      });
      writeJson(path.join(stageDir, 'stage-config.json'), {
        stageNumber: index + 1,
        stageCount: this.stages.length,
        ...stage,
        provider: providerMetadata,
        startedAt: this.timestamp()
      });

      progress('context', 'Building bounded context');
      const maxContextBytes = Math.min(this.maxContextBytes, stage.contextBudgetBytes || this.maxContextBytes);
      const context = this.contextBuilder({
        themeDir: this.themeDir,
        stage,
        maxTotalBytes: maxContextBytes
      });
      writeJson(path.join(stageDir, 'context-summary.json'), context.summary);
      fs.writeFileSync(path.join(stageDir, 'initial-context.txt'), context.text);
      progress('context', `Context ready: ${context.summary.includedFiles.length} files, ${context.summary.totalBytes} bytes`, {
        files: context.summary.includedFiles.length,
        bytes: context.summary.totalBytes
      });

      const toolRuntime = this.toolFactory({
        themeDir: this.themeDir,
        readScope: stage.read,
        maxCalls: Math.min(stage.toolCallLimit || this.maxToolCalls, this.maxToolCalls),
        maxResponseBytes: this.maxToolResponseBytes,
        maxCumulativeBytes: this.maxCumulativeToolBytes,
        onRecord: (record) => toolRecords.push(record)
      });
      const stagePrompt = buildLocalModelStagePrompt({
        provider: this.provider.id,
        model: this.modelId,
        stage,
        stageIndex: index,
        stageCount: this.stages.length,
        context: context.text,
        productionPrompt: this.prompt
      });
      fs.writeFileSync(path.join(stageDir, 'stage-prompt.txt'), stagePrompt);
      const messages = [
        {
          role: 'system',
          content: 'You are a controlled local code-editing model. Inspect only supplied context or read-only tools. Your final answer must be exactly one unified diff with no prose.'
        },
        { role: 'user', content: stagePrompt }
      ];

      let malformedRetries = 0;
      let toolCallCount = 0;
      while (true) {
        assertNotAborted(controller.signal, stage.id);
        const requestStartedAt = Date.now();
        progress('provider-request', `Sending model request (round ${requestMetadata.length + 1})`);
        const response = await this.provider.chatCompletion({
          model: this.modelId,
          messages,
          tools: toolRuntime.definitions,
          tool_choice: 'auto',
          max_tokens: this.maxOutputTokens,
          signal: controller.signal,
          timeoutMs: remainingTime(startedAtMs, stage.timeoutMs || this.stageTimeoutMs)
        });
        const durationMs = Date.now() - requestStartedAt;
        providerResponses.push(response.raw || response);
        requestMetadata.push({
          round: requestMetadata.length + 1,
          startedAt: new Date(requestStartedAt).toISOString(),
          durationMs,
          requestMessageCount: messages.length,
          requestBytes: Buffer.byteLength(JSON.stringify(messages), 'utf8'),
          toolDefinitionCount: toolRuntime.definitions.length,
          finishReason: response.finishReason || null,
          responseModel: response.model || null,
          responseContentBytes: Buffer.byteLength(response.content || '', 'utf8'),
          responseToolCalls: Array.isArray(response.toolCalls) ? response.toolCalls.length : 0
        });
        progress('provider-response', `Model response received in ${formatDuration(durationMs)}`);

        const rawToolCalls = Array.isArray(response.toolCalls) ? response.toolCalls : [];
        if (rawToolCalls.length) {
          let calls;
          try {
            calls = normalizeToolCalls(rawToolCalls);
          } catch (error) {
            if (!(error instanceof ProtocolError) || !error.retryable || malformedRetries >= this.maxMalformedToolRetries) {
              throw error;
            }
            malformedRetries += 1;
            progress('protocol-retry', `Malformed tool-call JSON; retry ${malformedRetries}/${this.maxMalformedToolRetries}`);
            messages.push({ role: 'assistant', content: response.content || '' });
            messages.push({
              role: 'user',
              content: 'Your prior structured tool call was malformed. Retry once with valid JSON arguments for an available read-only tool, or return the final unified diff. This is not a source-repair retry.'
            });
            continue;
          }

          messages.push({
            role: 'assistant',
            content: response.content || '',
            tool_calls: calls.map((call) => ({
              id: call.id,
              type: 'function',
              function: {
                name: call.name,
                arguments: typeof call.rawArguments === 'string' ? call.rawArguments : JSON.stringify(call.arguments)
              }
            }))
          });
          for (const call of calls) {
            toolCallCount += 1;
            if (toolCallCount > Math.min(stage.toolCallLimit || this.maxToolCalls, this.maxToolCalls)) {
              throw new LocalModelAgentError(`Stage ${stage.id} exceeded the maximum of ${this.maxToolCalls} tool calls.`, {
                code: 'TOOL_CALL_LIMIT_EXCEEDED'
              });
            }
            progress('tool-call', `Tool call ${toolCallCount}/${Math.min(stage.toolCallLimit || this.maxToolCalls, this.maxToolCalls)}: ${call.name}`);
            const result = toolRuntime.execute(call.name, call.arguments);
            toolRequests.push({
              index: toolCallCount,
              id: call.id,
              name: call.name,
              arguments: call.arguments,
              responseBytes: Buffer.byteLength(result, 'utf8')
            });
            messages.push({
              role: 'tool',
              tool_call_id: call.id,
              name: call.name,
              content: result
            });
            progress('tool-result', `Tool result returned (${Buffer.byteLength(result, 'utf8')} bytes)`);
          }
          continue;
        }

        finalResponse = String(response.content || '');
        progress('protocol', 'Model final response received');
        break;
      }

      fs.writeFileSync(path.join(stageDir, 'raw-model-response.txt'), finalResponse);
      writeJson(path.join(stageDir, 'provider-responses.json'), providerResponses);
      writeJson(path.join(stageDir, 'provider-request-metadata.json'), requestMetadata);
      writeJson(path.join(stageDir, 'tool-calls.json'), {
        requests: toolRequests,
        resultMetadata: toolRecords,
        usage: toolRuntime.getUsage()
      });

      progress('patch-extraction', 'Extracting unified diff');
      extractedDiff = extractUnifiedDiff(finalResponse);
      fs.writeFileSync(path.join(stageDir, 'extracted.patch'), `${extractedDiff}\n`);
      progress('patch-extraction', 'Unified diff extracted');
      progress('patch-validation', 'Validating patch paths and git applicability');
      const transaction = await this.applyPatch({
        themeDir: this.themeDir,
        patch: extractedDiff,
        writeScope: stage.write,
        runCandidateChecks: async (candidateDir, patchInfo) => {
          progress('candidate-checks', 'Running candidate checks');
          return this.candidateChecks(candidateDir, stage, patchInfo);
        }
      });
      progress('patch-application', `Patch committed transactionally: ${transaction.changedPaths.join(', ')}`, {
        changedPaths: transaction.changedPaths
      });
      progress('candidate-checks', 'Candidate checks completed successfully');

      const checkpoint = {
        stageId: stage.id,
        stageIndex: index,
        completedAt: this.timestamp(),
        promptHash: identity.promptHash,
        templateSourceHash: identity.templateSourceHash,
        provider: identity.provider,
        modelId: identity.modelId,
        stagePolicyHash: identity.stagePolicyHash,
        assetManifestHash: identity.assetManifestHash,
        resultingThemeStateHash: hashThemeState(this.themeDir),
        changedPaths: transaction.changedPaths,
        reportPaths: {
          stage: this.reportRelative(path.join(stageDir, 'result.json')),
          patch: this.reportRelative(path.join(stageDir, 'extracted.patch')),
          rawResponse: this.reportRelative(path.join(stageDir, 'raw-model-response.txt'))
        }
      };
      const checkpoints = readCheckpoints(this.checkpointFile);
      checkpoints.push(checkpoint);
      writeJson(this.checkpointFile, checkpoints);
      const result = {
        status: 'completed',
        stageId: stage.id,
        stageNumber: index + 1,
        startedAt: new Date(startedAtMs).toISOString(),
        completedAt: this.timestamp(),
        durationMs: Date.now() - startedAtMs,
        changedPaths: transaction.changedPaths,
        patchCheck: transaction.gitCheck,
        patchApplication: transaction.gitApply,
        candidateChecks: transaction.checkResult,
        checkpoint,
        events: stageEvents
      };
      progress('completed', `completed successfully in ${formatDuration(Date.now() - startedAtMs)}`);
      result.events = stageEvents;
      writeJson(path.join(stageDir, 'result.json'), result);
      writeJson(path.join(this.localReportDir, 'progress.json'), this.progressEvents);
    } catch (error) {
      if (finalResponse && !fs.existsSync(path.join(stageDir, 'raw-model-response.txt'))) {
        fs.writeFileSync(path.join(stageDir, 'raw-model-response.txt'), finalResponse);
      }
      if (extractedDiff && !fs.existsSync(path.join(stageDir, 'extracted.patch'))) {
        fs.writeFileSync(path.join(stageDir, 'extracted.patch'), `${extractedDiff}\n`);
      }
      writeJson(path.join(stageDir, 'provider-responses.json'), providerResponses);
      writeJson(path.join(stageDir, 'provider-request-metadata.json'), requestMetadata);
      writeJson(path.join(stageDir, 'tool-calls.json'), {
        requests: toolRequests,
        resultMetadata: toolRecords
      });
      const failure = {
        status: 'failed',
        stageId: stage.id,
        stageNumber: index + 1,
        startedAt: new Date(startedAtMs).toISOString(),
        failedAt: this.timestamp(),
        durationMs: Date.now() - startedAtMs,
        error: serializeError(error),
        events: stageEvents
      };
      writeJson(path.join(stageDir, 'result.json'), failure);
      const session = readJson(this.sessionFile);
      session.status = 'failed';
      session.failedStage = stage.id;
      session.failedAt = failure.failedAt;
      session.failureReport = this.reportRelative(path.join(stageDir, 'result.json'));
      writeJson(this.sessionFile, session);
      progress('failed', `FAILED: ${error.message}. Report: ${this.reportRelative(path.join(stageDir, 'result.json'))}`);
      failure.events = stageEvents;
      writeJson(path.join(stageDir, 'result.json'), failure);
      writeJson(path.join(this.localReportDir, 'progress.json'), this.progressEvents);
      throw new LocalModelAgentError(`Local-model stage ${stage.id} failed: ${error.message}. No repair pass was started. Evidence: ${this.reportRelative(path.join(stageDir, 'result.json'))}`, {
        code: error.code || 'STAGE_FAILED',
        cause: error
      });
    } finally {
      clearTimeout(timer);
      clearInterval(heartbeat);
    }
  }

  progress(stage, index, phase, message, details = {}) {
    const event = {
      timestamp: this.timestamp(),
      stageId: stage.id,
      stageNumber: index + 1,
      stageCount: this.stages.length,
      phase,
      message,
      ...details
    };
    this.progressEvents.push(event);
    this.log(`[${event.timestamp}] [Stage ${index + 1}/${this.stages.length}] ${stage.id} ${message}`);
    return event;
  }

  timestamp() {
    return this.now().toISOString();
  }

  reportRelative(file) {
    return path.relative(this.reportDir, file).split(path.sep).join('/');
  }

  log(message) {
    this.logger(message);
  }
}

async function runLocalModelGeneration(provider, themeDir, options, reportDir, deps = {}) {
  const prompt = deps.prompt || fs.readFileSync(options.promptPath, 'utf8');
  const modelId = provider.id === 'ollama' ? options.ollamaModel : options.lmstudioModel;
  const agent = new LocalModelAgent({
    provider,
    themeDir,
    reportDir,
    prompt,
    promptPath: options.promptPath,
    templateSourcePath: options.templateSourcePath,
    assetManifestPath: path.join(themeDir, 'assets', 'images', 'asset-manifest.json'),
    modelId,
    resumeLocal: options.resumeLocal,
    resumeFromStage: options.resumeFromStage,
    maxContextBytes: options.localModelMaxContextBytes,
    maxToolCalls: options.localModelMaxToolCalls,
    maxCumulativeToolBytes: options.localModelMaxToolOutputBytes,
    maxOutputTokens: options.localModelMaxTokens,
    stageTimeoutMs: options.localModelStageTimeoutMs,
    heartbeatIntervalMs: options.localModelHeartbeatMs,
    runCandidateChecks: deps.runCandidateChecks
  });
  return agent.run();
}

function runCandidateChecks(candidateDir, stage, patchInfo = {}) {
  const results = [];
  const files = listCandidateFiles(candidateDir);
  for (const check of stage.checks) {
    const startedAt = Date.now();
    try {
      if (check === 'php-lint') {
        const phpFiles = files.filter((file) => file.endsWith('.php'));
        for (const relPath of phpFiles) {
          const result = spawnSync('php', ['-l', path.join(candidateDir, ...relPath.split('/'))], {
            cwd: candidateDir,
            encoding: 'utf8',
            timeout: 30000
          });
          assertCommand(result, `php -l ${relPath}`);
        }
      } else if (check === 'javascript-syntax') {
        const jsFiles = files.filter((file) => /^(?:src|build)\/.*\.(?:c?js|mjs)$/i.test(file));
        for (const relPath of jsFiles) {
          const result = spawnSync(process.execPath, ['--check', path.join(candidateDir, ...relPath.split('/'))], {
            cwd: candidateDir,
            encoding: 'utf8',
            timeout: 30000
          });
          assertCommand(result, `node --check ${relPath}`);
        }
      } else if (check === 'json-parse') {
        for (const relPath of files.filter((file) => file.endsWith('.json'))) {
          JSON.parse(fs.readFileSync(path.join(candidateDir, ...relPath.split('/')), 'utf8'));
        }
      } else if (check === 'no-inline-style') {
        const offenders = files.filter((file) => file.endsWith('.php'))
          .filter((relPath) => /<style[\s>]/i.test(fs.readFileSync(path.join(candidateDir, ...relPath.split('/')), 'utf8')));
        if (offenders.length) {
          throw new Error(`Inline <style> blocks found in: ${offenders.join(', ')}`);
        }
      } else if (check === 'scss-structure') {
        const main = path.join(candidateDir, 'src', 'scss', 'main.scss');
        if (!fs.existsSync(main) || !fs.readFileSync(main, 'utf8').trim()) {
          throw new Error('src/scss/main.scss is missing or empty.');
        }
        const emptyScss = files.filter((file) => file.endsWith('.scss'))
          .filter((relPath) => fs.statSync(path.join(candidateDir, ...relPath.split('/'))).size === 0);
        if (emptyScss.length) {
          throw new Error(`Empty SCSS files: ${emptyScss.join(', ')}`);
        }
      } else if (check === 'documentation-presence') {
        for (const relPath of ['README.md', 'CHANGELOG.md', 'LICENSE.txt', 'docs/getting-started.md', 'docs/customization.md', 'accessibility/README.md']) {
          const full = path.join(candidateDir, ...relPath.split('/'));
          if (!fs.existsSync(full) || !fs.readFileSync(full, 'utf8').trim()) {
            throw new Error(`Required documentation is missing or empty: ${relPath}`);
          }
        }
      } else {
        throw new Error(`Unknown candidate check: ${check}`);
      }
      results.push({ id: check, ok: true, durationMs: Date.now() - startedAt });
    } catch (error) {
      results.push({ id: check, ok: false, durationMs: Date.now() - startedAt, error: error.message });
      return {
        ok: false,
        errors: results.filter((result) => !result.ok).map((result) => `${result.id}: ${result.error}`),
        results,
        changedPaths: patchInfo.paths || []
      };
    }
  }
  return { ok: true, results, changedPaths: patchInfo.paths || [] };
}

function listCandidateFiles(root) {
  const files = [];
  function visit(dir, prefix = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      if (!prefix && entry.name === 'node_modules') {
        continue;
      }
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const fullPath = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) {
        continue;
      }
      if (entry.isDirectory()) {
        visit(fullPath, relPath);
      } else if (entry.isFile()) {
        files.push(relPath);
      }
    }
  }
  visit(root);
  return files;
}

function hashThemeState(themeDir) {
  return hashPath(themeDir, { exclude: new Set(['node_modules']) });
}

function hashPath(target, options = {}) {
  const resolved = path.resolve(target);
  if (!fs.existsSync(resolved)) {
    throw new LocalModelAgentError(`Cannot hash missing path: ${target}.`, { code: 'HASH_PATH_MISSING' });
  }
  const hash = crypto.createHash('sha256');
  const exclude = options.exclude || new Set();
  function visit(current, relative = '') {
    const stat = fs.lstatSync(current);
    const normalized = relative.replace(/\\/g, '/');
    if (stat.isSymbolicLink()) {
      hash.update(`L\0${normalized}\0${fs.readlinkSync(current)}\0`);
      return;
    }
    if (stat.isDirectory()) {
      hash.update(`D\0${normalized}\0`);
      for (const entry of fs.readdirSync(current).sort((a, b) => a.localeCompare(b, 'en'))) {
        if (exclude.has(entry)) {
          continue;
        }
        visit(path.join(current, entry), relative ? `${relative}/${entry}` : entry);
      }
      return;
    }
    if (stat.isFile()) {
      hash.update(`F\0${normalized}\0${stat.size}\0`);
      hash.update(fs.readFileSync(current));
      hash.update('\0');
    }
  }
  visit(resolved);
  return hash.digest('hex');
}

function safeProviderMetadata(provider) {
  const metadata = typeof provider.metadata === 'function' ? provider.metadata() : {
    id: provider.id,
    label: provider.label,
    baseUrl: provider.baseUrl,
    modelId: provider.modelId,
    temperature: provider.temperature,
    timeout: provider.timeout,
    capabilities: provider.capabilities
  };
  return JSON.parse(JSON.stringify(metadata));
}

function portablePath(file) {
  if (!file) {
    return null;
  }
  return path.relative(process.cwd(), file).split(path.sep).join('/') || '.';
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function readCheckpoints(file) {
  return fs.existsSync(file) ? readJson(file) : [];
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function serializeError(error) {
  return {
    name: error && error.name || 'Error',
    code: error && error.code || null,
    message: error && error.message || String(error),
    retryable: Boolean(error && error.retryable),
    details: error && error.details !== undefined ? error.details : null,
    cause: error && error.cause ? {
      name: error.cause.name || 'Error',
      code: error.cause.code || null,
      message: error.cause.message || String(error.cause),
      details: error.cause.details !== undefined ? error.cause.details : null
    } : null
  };
}

function assertCommand(result, label) {
  if (result.error) {
    throw new Error(`${label} failed: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`${label} failed: ${(result.stderr || result.stdout || '').trim()}`);
  }
}

function assertNotAborted(signal, stageId) {
  if (signal.aborted) {
    throw new LocalModelAgentError(`Stage ${stageId} exceeded its configured runtime.`, { code: 'STAGE_TIMEOUT' });
  }
}

function remainingTime(startedAt, timeoutMs) {
  return Math.max(1, timeoutMs - (Date.now() - startedAt));
}

function formatDuration(durationMs) {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

function positiveInteger(value, fallback, name) {
  const selected = value === undefined || value === null || value === '' ? fallback : Number(value);
  if (!Number.isInteger(selected) || selected <= 0) {
    throw new LocalModelAgentError(`${name} must be a positive integer.`, { code: 'INVALID_AGENT_CONFIGURATION' });
  }
  return selected;
}

function nonNegativeInteger(value, fallback, name) {
  const selected = value === undefined || value === null || value === '' ? fallback : Number(value);
  if (!Number.isInteger(selected) || selected < 0) {
    throw new LocalModelAgentError(`${name} must be a non-negative integer.`, { code: 'INVALID_AGENT_CONFIGURATION' });
  }
  return selected;
}

module.exports = {
  DEFAULT_HEARTBEAT_INTERVAL_MS,
  DEFAULT_MAX_CONTEXT_BYTES,
  DEFAULT_MAX_CUMULATIVE_TOOL_BYTES,
  DEFAULT_MAX_MALFORMED_TOOL_RETRIES,
  DEFAULT_MAX_OUTPUT_TOKENS,
  DEFAULT_MAX_TOOL_CALLS,
  DEFAULT_MAX_TOOL_RESPONSE_BYTES,
  DEFAULT_STAGE_TIMEOUT_MS,
  LocalModelAgent,
  LocalModelAgentError,
  formatDuration,
  hashPath,
  hashThemeState,
  listCandidateFiles,
  portablePath,
  runCandidateChecks,
  runLocalModelGeneration,
  safeProviderMetadata,
  serializeError,
  sha256,
  stableStringify
};
