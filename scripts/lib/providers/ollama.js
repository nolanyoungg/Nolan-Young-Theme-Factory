'use strict';

const {
  DEFAULT_OPENAI_COMPATIBLE_TIMEOUT_MS,
  createOpenAICompatibleProvider,
  normalizeOpenAICompatibleBaseUrl,
  normalizeTemperature,
  normalizeTimeout
} = require('./openai-compatible');

const DEFAULT_OLLAMA_BASE_URL = 'http://127.0.0.1:11434/v1';
const DEFAULT_OLLAMA_API_KEY = 'ollama';
const DEFAULT_OLLAMA_TEMPERATURE = '0.2';
const DEFAULT_OLLAMA_TIMEOUT_MS = DEFAULT_OPENAI_COMPATIBLE_TIMEOUT_MS;

function createOllamaProvider(options = {}) {
  return createOpenAICompatibleProvider({
    id: 'ollama',
    label: 'Ollama',
    baseUrl: resolveOption(options, 'ollamaBaseUrl', 'ollama-base-url', 'OLLAMA_BASE_URL', DEFAULT_OLLAMA_BASE_URL),
    defaultBaseUrl: DEFAULT_OLLAMA_BASE_URL,
    apiKey: resolveOption(options, 'ollamaApiKey', 'ollama-api-key', 'OLLAMA_API_KEY', DEFAULT_OLLAMA_API_KEY),
    modelId: resolveOption(options, 'ollamaModel', 'ollama-model', 'OLLAMA_MODEL', ''),
    temperature: resolveOption(options, 'ollamaTemperature', 'ollama-temperature', 'OLLAMA_TEMPERATURE', DEFAULT_OLLAMA_TEMPERATURE),
    timeout: resolveOption(options, 'ollamaTimeoutMs', 'ollama-timeout-ms', 'OLLAMA_TIMEOUT_MS', DEFAULT_OLLAMA_TIMEOUT_MS),
    fetchImpl: options.fetchImpl,
    connectionHint: 'Start the Ollama OpenAI-compatible HTTP server and verify the configured base URL.',
    modelHint: 'Install or load the requested model, then pass the exact id reported by theme:model-check.'
  });
}

async function ollamaChatCompletion(options, messagesOrRequest) {
  const provider = createOllamaProvider(options);
  const request = Array.isArray(messagesOrRequest)
    ? { messages: messagesOrRequest }
    : messagesOrRequest;
  return provider.chatCompletion(request);
}

async function listOllamaModels(options = {}) {
  return createOllamaProvider(options).listModels();
}

async function checkOllamaProvider(options = {}) {
  const provider = createOllamaProvider(options);
  const modelId = resolveOption(options, 'ollamaModel', 'ollama-model', 'OLLAMA_MODEL', '');
  const modelIds = await provider.listModels();
  if (modelId) {
    await provider.checkModel(modelId);
  }
  return modelIds;
}

function normalizeOllamaBaseUrl(value) {
  return normalizeOpenAICompatibleBaseUrl(value, DEFAULT_OLLAMA_BASE_URL);
}

function parseOllamaTemperature(value) {
  return normalizeTemperature(value, 'Ollama temperature');
}

function parseOllamaTimeout(value) {
  return normalizeTimeout(value, 'Ollama timeout');
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
  DEFAULT_OLLAMA_API_KEY,
  DEFAULT_OLLAMA_BASE_URL,
  DEFAULT_OLLAMA_TEMPERATURE,
  DEFAULT_OLLAMA_TIMEOUT_MS,
  checkOllamaProvider,
  createOllamaProvider,
  listOllamaModels,
  normalizeOllamaBaseUrl,
  ollamaChatCompletion,
  parseOllamaTemperature,
  parseOllamaTimeout
};
