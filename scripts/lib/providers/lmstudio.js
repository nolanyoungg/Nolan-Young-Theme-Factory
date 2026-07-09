'use strict';

const DEFAULT_LMSTUDIO_BASE_URL = 'http://127.0.0.1:1234/v1';
const DEFAULT_LMSTUDIO_API_KEY = 'lm-studio';
const DEFAULT_LMSTUDIO_TEMPERATURE = '0.2';
const DEFAULT_LMSTUDIO_TIMEOUT_MS = 1000 * 60 * 30;

async function runLmStudioStage(stagePrompt, stage, options, reportDir, deps) {
  const { fs, path, withProgressHeartbeat } = deps;
  const startedAt = new Date().toISOString();
  console.log(`[${startedAt}] LM Studio stage ${stage.id} starting with model ${options.lmstudioModel} at ${options.lmstudioBaseUrl}`);
  const response = await withProgressHeartbeat(`LM Studio stage ${stage.id}`, () => lmStudioChatCompletion(options, [
    {
      role: 'system',
      content: 'You are a local code generation model. Return only the requested complete file blocks.'
    },
    {
      role: 'user',
      content: stagePrompt
    }
  ]));
  const content = extractLmStudioMessageContent(response);
  fs.writeFileSync(path.join(reportDir, `lmstudio-${stage.id}.json`), JSON.stringify({
    request: {
      baseUrl: options.lmstudioBaseUrl,
      model: options.lmstudioModel,
      stage: stage.id,
      startedAt
    },
    response
  }, null, 2));
  fs.writeFileSync(path.join(reportDir, `lmstudio-${stage.id}.log`), content);
  console.log(`[${new Date().toISOString()}] LM Studio stage ${stage.id} completed`);
  return content;
}

async function lmStudioChatCompletion(options, messages) {
  return requestJson(`${options.lmstudioBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${options.lmstudioApiKey || DEFAULT_LMSTUDIO_API_KEY}`
    },
    body: JSON.stringify({
      model: options.lmstudioModel,
      messages,
      temperature: parseLmStudioTemperature(options.lmstudioTemperature),
      stream: false
    })
  }, 'LM Studio chat completion');
}

async function requestJson(url, options, label) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(DEFAULT_LMSTUDIO_TIMEOUT_MS)
    });
  } catch (error) {
    throw new Error(formatHttpRequestError(label, url, error));
  }

  const text = await response.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch (error) {
      throw new Error(`${label} returned non-JSON response from ${url}: ${text.slice(0, 500)}`);
    }
  }

  if (!response.ok) {
    const detail = json && (json.error && (json.error.message || json.error) || json.message) || text || response.statusText;
    throw new Error(`${label} failed with HTTP ${response.status}: ${detail}`);
  }
  return json;
}

function formatHttpRequestError(label, url, error) {
  if (error.name === 'TimeoutError' || error.name === 'AbortError') {
    return `${label} timed out after ${Math.round(DEFAULT_LMSTUDIO_TIMEOUT_MS / 60000)} minutes while calling ${url}. Check that the local model is loaded and responding.`;
  }
  const causeCode = error.cause && error.cause.code;
  if (causeCode === 'ECONNREFUSED' || causeCode === 'ECONNRESET' || causeCode === 'ENOTFOUND') {
    return `${label} could not reach ${url} (${causeCode}). Start the LM Studio OpenAI-compatible server, verify the base URL, then run npm run theme:model-check -- --provider lmstudio.`;
  }
  return `${label} failed to reach ${url}: ${error.message}`;
}

function parseLmStudioTemperature(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 2) {
    throw new Error(`Invalid LM Studio temperature "${value}". Use a number from 0 to 2.`);
  }
  return parsed;
}

function extractLmStudioMessageContent(response) {
  if (!response || !Array.isArray(response.choices)) {
    throw new Error('LM Studio response was missing choices[]. Confirm that the endpoint is OpenAI-compatible and the selected model is loaded.');
  }
  const content = response
    && response.choices
    && response.choices[0]
    && response.choices[0].message
    && response.choices[0].message.content;
  if (Array.isArray(content)) {
    return content.map((part) => typeof part === 'string' ? part : part.text || '').join('');
  }
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('LM Studio response did not contain assistant message content. Check the selected model identifier and server compatibility.');
  }
  return content;
}

async function listLmStudioModels(args) {
  const baseUrl = normalizeLmStudioBaseUrl(args.lmstudioBaseUrl || args['lmstudio-base-url'] || process.env.LMSTUDIO_BASE_URL || DEFAULT_LMSTUDIO_BASE_URL);
  const apiKey = args.lmstudioApiKey || args['lmstudio-api-key'] || process.env.LMSTUDIO_API_KEY || DEFAULT_LMSTUDIO_API_KEY;
  return requestJson(`${baseUrl}/models`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  }, 'LM Studio model check');
}

async function checkLmStudioProvider(args) {
  const model = args.lmstudioModel || args['lmstudio-model'];
  const baseUrl = normalizeLmStudioBaseUrl(args.lmstudioBaseUrl || args['lmstudio-base-url'] || process.env.LMSTUDIO_BASE_URL || DEFAULT_LMSTUDIO_BASE_URL);
  const models = await listLmStudioModels({ ...args, lmstudioBaseUrl: baseUrl });
  const modelIds = Array.isArray(models && models.data) ? models.data.map((entry) => entry.id).filter(Boolean) : [];
  if (!Array.isArray(models && models.data)) {
    throw new Error(`LM Studio model check at ${baseUrl} returned an unexpected response. Expected an OpenAI-compatible { data: [...] } payload.`);
  }
  if (model && !modelIds.includes(model)) {
    const visible = modelIds.length ? modelIds.join(', ') : '(none)';
    throw new Error(`LM Studio model not visible at ${baseUrl}: ${model}. Visible models: ${visible}. Load the model in LM Studio or pass the exact id shown by npm run theme:model-check -- --provider lmstudio.`);
  }
  return modelIds;
}

function normalizeLmStudioBaseUrl(value) {
  const raw = String(value || DEFAULT_LMSTUDIO_BASE_URL).trim().replace(/\/+$/, '');
  try {
    const parsed = new URL(raw);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('LM Studio base URL must use http or https.');
    }
  } catch (error) {
    throw new Error(`Invalid LM Studio base URL "${value}": ${error.message}`);
  }
  return raw.endsWith('/v1') ? raw : `${raw}/v1`;
}

module.exports = {
  DEFAULT_LMSTUDIO_API_KEY,
  DEFAULT_LMSTUDIO_BASE_URL,
  DEFAULT_LMSTUDIO_TEMPERATURE,
  checkLmStudioProvider,
  extractLmStudioMessageContent,
  formatHttpRequestError,
  listLmStudioModels,
  lmStudioChatCompletion,
  normalizeLmStudioBaseUrl,
  parseLmStudioTemperature,
  requestJson,
  runLmStudioStage
};
