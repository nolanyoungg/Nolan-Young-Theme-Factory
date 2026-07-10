'use strict';

const {
  DEFAULT_OPENAI_COMPATIBLE_TIMEOUT_MS,
  createOpenAICompatibleProvider,
  normalizeChatCompletionResponse,
  normalizeOpenAICompatibleBaseUrl,
  normalizeTemperature,
  normalizeTimeout
} = require('./openai-compatible');

const DEFAULT_LMSTUDIO_BASE_URL = 'http://127.0.0.1:1234/v1';
const DEFAULT_LMSTUDIO_API_KEY = 'lm-studio';
const DEFAULT_LMSTUDIO_TEMPERATURE = '0.2';
const DEFAULT_LMSTUDIO_TIMEOUT_MS = DEFAULT_OPENAI_COMPATIBLE_TIMEOUT_MS;

function createLmStudioProvider(options = {}) {
  return createOpenAICompatibleProvider({
    id: 'lmstudio',
    label: 'LM Studio',
    baseUrl: resolveOption(options, 'lmstudioBaseUrl', 'lmstudio-base-url', 'LMSTUDIO_BASE_URL', DEFAULT_LMSTUDIO_BASE_URL),
    defaultBaseUrl: DEFAULT_LMSTUDIO_BASE_URL,
    apiKey: resolveOption(options, 'lmstudioApiKey', 'lmstudio-api-key', 'LMSTUDIO_API_KEY', DEFAULT_LMSTUDIO_API_KEY),
    modelId: resolveOption(options, 'lmstudioModel', 'lmstudio-model', 'LMSTUDIO_MODEL', ''),
    temperature: resolveOption(options, 'lmstudioTemperature', 'lmstudio-temperature', 'LMSTUDIO_TEMPERATURE', DEFAULT_LMSTUDIO_TEMPERATURE),
    timeout: resolveOption(options, 'lmstudioTimeoutMs', 'lmstudio-timeout-ms', 'LMSTUDIO_TIMEOUT_MS', DEFAULT_LMSTUDIO_TIMEOUT_MS),
    fetchImpl: options.fetchImpl,
    connectionHint: 'Start the LM Studio OpenAI-compatible server and verify the configured base URL.',
    modelHint: 'Load the model in LM Studio or pass the exact id reported by theme:model-check.'
  });
}

async function lmStudioChatCompletion(options, messagesOrRequest) {
  const provider = createLmStudioProvider(options);
  const request = Array.isArray(messagesOrRequest)
    ? { messages: messagesOrRequest }
    : messagesOrRequest;
  return provider.chatCompletion(request);
}

async function listLmStudioModels(options = {}) {
  return createLmStudioProvider(options).listModels();
}

async function checkLmStudioProvider(options = {}) {
  const provider = createLmStudioProvider(options);
  const modelId = resolveOption(options, 'lmstudioModel', 'lmstudio-model', 'LMSTUDIO_MODEL', '');
  const modelIds = await provider.listModels();
  if (modelId) {
    await provider.checkModel(modelId);
  }
  return modelIds;
}

function normalizeLmStudioBaseUrl(value) {
  return normalizeOpenAICompatibleBaseUrl(value, DEFAULT_LMSTUDIO_BASE_URL);
}

function parseLmStudioTemperature(value) {
  return normalizeTemperature(value, 'LM Studio temperature');
}

function parseLmStudioTimeout(value) {
  return normalizeTimeout(value, 'LM Studio timeout');
}

function extractLmStudioMessageContent(response) {
  if (response && typeof response.content === 'string' && Array.isArray(response.toolCalls)) {
    return response.content;
  }
  return normalizeChatCompletionResponse(response, { provider: 'lmstudio' }).content;
}

function resolveOption(options, camelName, dashedName, envName, fallback) {
  if (options[camelName] !== undefined && options[camelName] !== '') {
    return options[camelName];
  }
  if (options[dashedName] !== undefined && options[dashedName] !== '') {
    return options[dashedName];
  }
  if (process.env[envName] !== undefined && process.env[envName] !== '') {
    return process.env[envName];
  }
  return fallback;
}

module.exports = {
  DEFAULT_LMSTUDIO_API_KEY,
  DEFAULT_LMSTUDIO_BASE_URL,
  DEFAULT_LMSTUDIO_TEMPERATURE,
  DEFAULT_LMSTUDIO_TIMEOUT_MS,
  checkLmStudioProvider,
  createLmStudioProvider,
  extractLmStudioMessageContent,
  listLmStudioModels,
  lmStudioChatCompletion,
  normalizeLmStudioBaseUrl,
  parseLmStudioTemperature,
  parseLmStudioTimeout
};
