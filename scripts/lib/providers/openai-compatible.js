'use strict';

const DEFAULT_OPENAI_COMPATIBLE_TIMEOUT_MS = 1000 * 60 * 30;
const DEFAULT_OPENAI_COMPATIBLE_TEMPERATURE = 0.2;
const TOOL_CAPABILITY_PROBE_NAME = 'local_model_agent_capability_probe';
const MODEL_METADATA_SOURCE = 'OpenAI-compatible GET /models response';
const MAX_SELECTED_MODEL_METADATA_BYTES = 32 * 1024;
const SENSITIVE_FIELD_RE = /^(authorization|api[_-]?key|access[_-]?token|secret|password|credential)$/i;

class OpenAICompatibleProviderError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'OpenAICompatibleProviderError';
    this.code = details.code || 'provider_error';
    this.provider = details.provider || 'openai-compatible';
    this.operation = details.operation || null;
    this.status = Number.isInteger(details.status) ? details.status : null;
    this.retryable = Boolean(details.retryable);
    if (details.cause) {
      this.cause = details.cause;
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      provider: this.provider,
      operation: this.operation,
      status: this.status,
      retryable: this.retryable,
      message: this.message
    };
  }
}

class OpenAICompatibleProvider {
  constructor(config = {}) {
    this.id = requireNonEmptyString(config.id, 'Provider id');
    this.label = requireNonEmptyString(config.label || config.id, 'Provider label');
    this.baseUrl = normalizeOpenAICompatibleBaseUrl(config.baseUrl, config.defaultBaseUrl);
    this.modelId = String(config.modelId || '').trim();
    this.temperature = normalizeTemperature(
      config.temperature === undefined ? DEFAULT_OPENAI_COMPATIBLE_TEMPERATURE : config.temperature,
      `${this.label} temperature`
    );
    this.timeout = normalizeTimeout(
      config.timeout === undefined ? config.timeoutMs : config.timeout,
      `${this.label} timeout`
    );
    this.capabilities = {
      chatCompletion: true,
      listModels: true,
      toolCalling: null,
      requiredToolCalling: null
    };

    Object.defineProperty(this, '_apiKey', {
      value: config.apiKey ? String(config.apiKey) : '',
      enumerable: false,
      configurable: false,
      writable: false
    });
    this._fetch = config.fetchImpl || globalThis.fetch;
    this._connectionHint = String(config.connectionHint || '').trim();
    this._modelHint = String(config.modelHint || '').trim();
    this._checkedModelId = null;
    Object.defineProperty(this, '_listedModelMetadata', {
      value: new Map(),
      enumerable: false,
      configurable: false,
      writable: false
    });
    Object.defineProperty(this, '_selectedModelMetadata', {
      value: unavailableModelMetadata('model-not-checked'),
      enumerable: false,
      configurable: false,
      writable: true
    });

    if (typeof this._fetch !== 'function') {
      throw this._error('HTTP fetch is unavailable in this Node.js runtime.', {
        code: 'fetch_unavailable',
        operation: 'createProvider'
      });
    }
  }

  metadata() {
    return {
      id: this.id,
      label: this.label,
      baseUrl: this.baseUrl,
      modelId: this.modelId || null,
      temperature: this.temperature,
      timeout: this.timeout,
      capabilities: { ...this.capabilities },
      checkedModelId: this._checkedModelId,
      selectedModelMetadata: cloneJsonValue(this._selectedModelMetadata)
    };
  }

  toJSON() {
    return this.metadata();
  }

  async chatCompletion(request = {}) {
    if (!request || typeof request !== 'object' || Array.isArray(request)) {
      throw this._error('chatCompletion(request) requires a request object.', {
        code: 'invalid_request',
        operation: 'chatCompletion'
      });
    }
    if (!Array.isArray(request.messages) || !request.messages.length) {
      throw this._error('chatCompletion(request) requires a non-empty messages array.', {
        code: 'invalid_request',
        operation: 'chatCompletion'
      });
    }

    const model = String(request.model || this.modelId || '').trim();
    if (!model) {
      throw this._error(`${this.label} chat completion requires a model id.`, {
        code: 'missing_model',
        operation: 'chatCompletion'
      });
    }
    if (request.stream === true) {
      throw this._error('Streaming responses are not supported by LocalModelAgent providers.', {
        code: 'streaming_unsupported',
        operation: 'chatCompletion'
      });
    }

    const {
      signal,
      timeout,
      timeoutMs,
      ...bodyFields
    } = request;
    const body = removeUndefinedValues({
      ...bodyFields,
      model,
      temperature: request.temperature === undefined
        ? this.temperature
        : normalizeTemperature(request.temperature, `${this.label} request temperature`),
      stream: false
    });

    const raw = await this._requestJson('chatCompletion', 'chat/completions', {
      method: 'POST',
      body,
      signal,
      timeout: timeout === undefined ? timeoutMs : timeout
    });
    return normalizeChatCompletionResponse(raw, {
      provider: this.id,
      fallbackModel: model,
      secrets: this._secrets()
    });
  }

  async listModels() {
    const raw = await this._requestJson('listModels', 'models', { method: 'GET' });
    if (!raw || !Array.isArray(raw.data)) {
      throw this._error(`${this.label} returned an invalid models response; expected { data: [...] }.`, {
        code: 'invalid_models_response',
        operation: 'listModels'
      });
    }
    this._listedModelMetadata.clear();
    const modelIds = new Set();
    for (const rawEntry of raw.data) {
      const id = String(typeof rawEntry === 'string' ? rawEntry : rawEntry && rawEntry.id || '').trim();
      if (!id) {
        continue;
      }
      modelIds.add(id);
      const candidate = sanitizeSelectedModelEntry(rawEntry, this._secrets());
      const current = this._listedModelMetadata.get(id) || null;
      if (modelMetadataScore(candidate) > modelMetadataScore(current)) {
        this._listedModelMetadata.set(id, candidate);
      } else if (!this._listedModelMetadata.has(id)) {
        this._listedModelMetadata.set(id, null);
      }
    }
    return [...modelIds].sort();
  }

  async checkModel(modelId = this.modelId) {
    const selected = String(modelId || '').trim();
    if (!selected) {
      throw this._error(`${this.label} model check requires a model id.`, {
        code: 'missing_model',
        operation: 'checkModel'
      });
    }
    const modelIds = await this.listModels();
    if (!modelIds.includes(selected)) {
      const visible = modelIds.length ? truncate(modelIds.join(', '), 2000) : '(none)';
      const hint = this._modelHint ? ` ${this._modelHint}` : '';
      throw this._error(`${this.label} model not visible at ${this.baseUrl}: ${selected}. Visible models: ${visible}.${hint}`, {
        code: 'model_not_found',
        operation: 'checkModel'
      });
    }
    this._checkedModelId = selected;
    const selectedMetadata = this._listedModelMetadata.get(selected) || null;
    this._selectedModelMetadata = selectedMetadata
      ? {
          available: true,
          source: MODEL_METADATA_SOURCE,
          truncated: selectedMetadata.truncated,
          entry: selectedMetadata.entry
        }
      : unavailableModelMetadata('selected-model-entry-contained-no-additional-metadata');
    return selected;
  }

  async checkToolCalling(modelId = this.modelId) {
    const selected = String(modelId || '').trim();
    if (!selected) {
      throw this._error(`${this.label} tool-calling check requires a model id.`, {
        code: 'missing_model',
        operation: 'checkToolCalling'
      });
    }

    const result = await this.chatCompletion({
      model: selected,
      temperature: 0,
      max_tokens: 64,
      messages: [
        {
          role: 'system',
          content: 'This is a capability probe. You must call the provided tool and must not answer with normal text.'
        },
        {
          role: 'user',
          content: 'Call the capability probe tool once with {"supported":true}.'
        }
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: TOOL_CAPABILITY_PROBE_NAME,
            description: 'Confirms required structured tool-call support.',
            parameters: {
              type: 'object',
              additionalProperties: false,
              properties: {
                supported: { type: 'boolean' }
              },
              required: ['supported']
            }
          }
        }
      ],
      tool_choice: 'required'
    });

    const probeCall = result.toolCalls.find((call) => call.name === TOOL_CAPABILITY_PROBE_NAME);
    if (!probeCall) {
      this.capabilities.toolCalling = false;
      this.capabilities.requiredToolCalling = false;
      throw this._error(`${this.label} model ${selected} did not return the required structured tool call.`, {
        code: 'required_tool_calling_unsupported',
        operation: 'checkToolCalling'
      });
    }
    try {
      const args = JSON.parse(probeCall.arguments);
      if (!args || args.supported !== true) {
        throw new Error('probe argument supported=true was missing');
      }
    } catch (error) {
      this.capabilities.toolCalling = false;
      this.capabilities.requiredToolCalling = false;
      throw this._error(`${this.label} model ${selected} returned malformed capability-probe arguments.`, {
        code: 'malformed_tool_arguments',
        operation: 'checkToolCalling',
        cause: error
      });
    }

    this.capabilities.toolCalling = true;
    this.capabilities.requiredToolCalling = true;
    return true;
  }

  async _requestJson(operation, endpoint, request) {
    const timeout = normalizeTimeout(
      request.timeout === undefined ? this.timeout : request.timeout,
      `${this.label} request timeout`
    );
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeout);
    timer.unref?.();

    const externalSignal = request.signal;
    const abortFromExternal = () => controller.abort(externalSignal.reason);
    if (externalSignal) {
      if (externalSignal.aborted) {
        abortFromExternal();
      } else {
        externalSignal.addEventListener('abort', abortFromExternal, { once: true });
      }
    }

    const url = `${this.baseUrl}/${String(endpoint).replace(/^\/+/, '')}`;
    const headers = { Accept: 'application/json' };
    if (request.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    if (this._apiKey) {
      headers.Authorization = `Bearer ${this._apiKey}`;
    }

    let response;
    let text;
    try {
      response = await this._fetch(url, {
        method: request.method,
        headers,
        body: request.body === undefined ? undefined : JSON.stringify(request.body),
        signal: controller.signal
      });
      text = await response.text();
    } catch (error) {
      if (timedOut) {
        throw this._error(`${this.label} ${operation} timed out after ${timeout} ms.`, {
          code: 'provider_timeout',
          operation,
          retryable: true,
          cause: error
        });
      }
      if (externalSignal && externalSignal.aborted) {
        throw this._error(`${this.label} ${operation} was aborted.`, {
          code: 'provider_aborted',
          operation,
          cause: error
        });
      }
      const causeCode = error && error.cause && error.cause.code || error && error.code;
      const hint = this._connectionHint ? ` ${this._connectionHint}` : '';
      throw this._error(`${this.label} ${operation} could not reach ${this.baseUrl}${causeCode ? ` (${causeCode})` : ''}.${hint}`, {
        code: 'provider_unreachable',
        operation,
        retryable: isRetryableConnectionCode(causeCode),
        cause: error
      });
    } finally {
      clearTimeout(timer);
      if (externalSignal) {
        externalSignal.removeEventListener?.('abort', abortFromExternal);
      }
    }

    let json = null;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch (error) {
        throw this._error(`${this.label} ${operation} returned non-JSON content: ${truncate(text, 500)}`, {
          code: 'non_json_response',
          operation,
          status: response.status,
          cause: error
        });
      }
    }

    if (!response.ok) {
      const detail = redactText(extractErrorDetail(json, text, response.statusText), this._secrets());
      throw this._error(`${this.label} ${operation} failed with HTTP ${response.status}${detail ? `: ${truncate(detail, 1000)}` : ''}`, {
        code: extractErrorCode(json) || 'provider_http_error',
        operation,
        status: response.status,
        retryable: isRetryableHttpStatus(response.status)
      });
    }
    return redactValue(json, this._secrets());
  }

  _error(message, details = {}) {
    return new OpenAICompatibleProviderError(redactText(message, this._secrets()), {
      ...details,
      provider: this.id
    });
  }

  _secrets() {
    return this._apiKey ? [this._apiKey] : [];
  }
}

function createOpenAICompatibleProvider(config) {
  return new OpenAICompatibleProvider(config);
}

function normalizeOpenAICompatibleBaseUrl(value, fallback) {
  const raw = String(value || fallback || '').trim();
  if (!raw) {
    throw new Error('OpenAI-compatible base URL is required.');
  }
  let parsed;
  try {
    parsed = new URL(raw);
  } catch (error) {
    throw new Error('Invalid OpenAI-compatible base URL.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('OpenAI-compatible base URL must use http or https.');
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error('OpenAI-compatible base URL must not contain credentials, query parameters, or a fragment.');
  }
  const pathname = parsed.pathname.replace(/\/+$/, '');
  parsed.pathname = pathname.endsWith('/v1') ? pathname : `${pathname}/v1`;
  return parsed.toString().replace(/\/$/, '');
}

function normalizeTemperature(value, label = 'Temperature') {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 2) {
    throw new Error(`${label} must be a number from 0 to 2.`);
  }
  return parsed;
}

function normalizeTimeout(value, label = 'Timeout') {
  const parsed = value === undefined || value === null || value === ''
    ? DEFAULT_OPENAI_COMPATIBLE_TIMEOUT_MS
    : Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive integer number of milliseconds.`);
  }
  return parsed;
}

function normalizeChatCompletionResponse(response, options = {}) {
  if (!response || !Array.isArray(response.choices) || !response.choices.length) {
    throw new OpenAICompatibleProviderError('OpenAI-compatible chat response was missing choices[].', {
      code: 'invalid_chat_response',
      provider: options.provider,
      operation: 'chatCompletion'
    });
  }
  const raw = redactValue(response, options.secrets || []);
  const choice = raw.choices[0] || {};
  const message = choice.message || {};
  return {
    content: normalizeMessageContent(message.content),
    toolCalls: normalizeToolCalls(message, options),
    finishReason: choice.finish_reason || choice.finishReason || null,
    model: raw.model || options.fallbackModel || null,
    raw
  };
}

function normalizeMessageContent(content) {
  if (typeof content === 'string') {
    return content;
  }
  if (content === null || content === undefined) {
    return '';
  }
  if (Array.isArray(content)) {
    return content.map((part) => {
      if (typeof part === 'string') {
        return part;
      }
      if (!part || typeof part !== 'object') {
        return '';
      }
      if (typeof part.text === 'string') {
        return part.text;
      }
      if (typeof part.content === 'string') {
        return part.content;
      }
      return '';
    }).join('');
  }
  return '';
}

function normalizeToolCalls(message, options = {}) {
  const calls = Array.isArray(message && message.tool_calls)
    ? message.tool_calls
    : Array.isArray(message && message.toolCalls)
      ? message.toolCalls
      : message && message.function_call
        ? [{ type: 'function', function: message.function_call }]
        : [];
  return calls.map((call, index) => {
    const fn = call && (call.function || call.function_call) || call || {};
    const name = String(fn.name || call && call.name || '').trim();
    if (!name) {
      throw new OpenAICompatibleProviderError('OpenAI-compatible response contained a tool call without a function name.', {
        code: 'invalid_tool_call',
        provider: options.provider,
        operation: 'chatCompletion'
      });
    }
    return {
      id: String(call && call.id || `tool-call-${index + 1}`),
      name,
      arguments: normalizeToolArguments(
        fn.arguments === undefined ? call && call.arguments : fn.arguments,
        options
      )
    };
  });
}

function normalizeToolArguments(value, options = {}) {
  if (typeof value === 'string') {
    return value;
  }
  if (value === undefined || value === null) {
    return '{}';
  }
  try {
    return JSON.stringify(value);
  } catch (error) {
    throw new OpenAICompatibleProviderError('OpenAI-compatible response contained unserializable tool arguments.', {
      code: 'invalid_tool_arguments',
      provider: options.provider,
      operation: 'chatCompletion',
      cause: error
    });
  }
}

function unavailableModelMetadata(reason) {
  return {
    available: false,
    source: MODEL_METADATA_SOURCE,
    reason
  };
}

function sanitizeSelectedModelEntry(rawEntry, secrets = []) {
  if (!rawEntry || typeof rawEntry !== 'object' || Array.isArray(rawEntry)) {
    return null;
  }
  const state = { truncated: false };
  let entry = sanitizeModelMetadataValue(rawEntry, secrets, state, 0);
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return null;
  }
  const informativeKeys = Object.keys(entry).filter((key) => key !== 'id');
  if (!informativeKeys.length) {
    return null;
  }
  if (Buffer.byteLength(JSON.stringify(entry), 'utf8') > MAX_SELECTED_MODEL_METADATA_BYTES) {
    state.truncated = true;
    entry = compactModelMetadata(entry);
  }
  return { entry, truncated: state.truncated };
}

function sanitizeModelMetadataValue(value, secrets, state, depth) {
  if (value === null || typeof value === 'boolean' || typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const redacted = redactText(value, secrets);
    if (redacted.length > 4096) {
      state.truncated = true;
      return `${redacted.slice(0, 4096)}...`;
    }
    return redacted;
  }
  if (depth >= 6) {
    state.truncated = true;
    return '[TRUNCATED]';
  }
  if (Array.isArray(value)) {
    if (value.length > 64) {
      state.truncated = true;
    }
    return value.slice(0, 64).map((item) => sanitizeModelMetadataValue(item, secrets, state, depth + 1));
  }
  if (!value || typeof value !== 'object') {
    return null;
  }
  const output = {};
  const entries = Object.entries(value);
  if (entries.length > 128) {
    state.truncated = true;
  }
  for (const [key, item] of entries.slice(0, 128)) {
    if (SENSITIVE_FIELD_RE.test(key)) {
      continue;
    }
    output[key] = sanitizeModelMetadataValue(item, secrets, state, depth + 1);
  }
  return output;
}

function compactModelMetadata(entry) {
  const keys = Object.keys(entry).sort((left, right) => {
    const score = (key) => key === 'id'
      ? 0
      : /(quant|context)/i.test(key)
        ? 1
        : /(object|created|owner|publisher|family|format|parameter|architecture|capabil|status|state|type)/i.test(key)
          ? 2
          : 3;
    return score(left) - score(right);
  });
  const compact = {};
  for (const key of keys) {
    const candidate = { ...compact, [key]: entry[key] };
    if (Buffer.byteLength(JSON.stringify(candidate), 'utf8') <= MAX_SELECTED_MODEL_METADATA_BYTES) {
      compact[key] = entry[key];
    }
  }
  return compact;
}

function modelMetadataScore(metadata) {
  return metadata ? Buffer.byteLength(JSON.stringify(metadata.entry), 'utf8') : 0;
}

function cloneJsonValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function redactValue(value, secrets = []) {
  if (typeof value === 'string') {
    return redactText(value, secrets);
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, secrets));
  }
  if (!value || typeof value !== 'object') {
    return value;
  }
  const redacted = {};
  for (const [key, item] of Object.entries(value)) {
    if (SENSITIVE_FIELD_RE.test(key)) {
      redacted[key] = '[REDACTED]';
    } else {
      redacted[key] = redactValue(item, secrets);
    }
  }
  return redacted;
}

function redactText(value, secrets = []) {
  let output = String(value || '').replace(/Bearer\s+[^\s,;]+/gi, 'Bearer [REDACTED]');
  for (const secret of secrets.filter(Boolean)) {
    output = output.split(String(secret)).join('[REDACTED]');
  }
  return output;
}

function extractErrorDetail(json, text, statusText) {
  if (json && json.error) {
    if (typeof json.error === 'string') {
      return json.error;
    }
    if (typeof json.error.message === 'string') {
      return json.error.message;
    }
    return safeStringify(json.error);
  }
  if (json && typeof json.message === 'string') {
    return json.message;
  }
  return text || statusText || '';
}

function extractErrorCode(json) {
  const value = json && json.error && typeof json.error === 'object'
    ? json.error.code || json.error.type
    : json && json.code;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function isRetryableHttpStatus(status) {
  return status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
}

function isRetryableConnectionCode(code) {
  return ['ECONNREFUSED', 'ECONNRESET', 'ENETUNREACH', 'EPIPE', 'ETIMEDOUT'].includes(code);
}

function removeUndefinedValues(value) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
}

function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
}

function requireNonEmptyString(value, label) {
  const normalized = String(value || '').trim();
  if (!normalized) {
    throw new Error(`${label} is required.`);
  }
  return normalized;
}

function truncate(value, maxLength) {
  const text = String(value || '');
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
}

module.exports = {
  DEFAULT_OPENAI_COMPATIBLE_TEMPERATURE,
  DEFAULT_OPENAI_COMPATIBLE_TIMEOUT_MS,
  OpenAICompatibleProvider,
  OpenAICompatibleProviderError,
  TOOL_CAPABILITY_PROBE_NAME,
  createOpenAICompatibleProvider,
  normalizeChatCompletionResponse,
  normalizeMessageContent,
  normalizeOpenAICompatibleBaseUrl,
  normalizeTemperature,
  normalizeTimeout,
  normalizeToolArguments,
  normalizeToolCalls,
  redactText,
  redactValue
};
