'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');

const { createOpenAICompatibleProvider } = require('../lib/providers/openai-compatible');

test('reports bounded selected-model metadata without exposing credentials', async () => {
  const apiKey = 'selected-model-metadata-secret';
  let authorization;
  const provider = createOpenAICompatibleProvider({
    id: 'metadata-provider',
    label: 'Metadata Provider',
    baseUrl: 'http://127.0.0.1:9999/v1',
    modelId: 'model-a',
    apiKey,
    fetchImpl: async (url, options) => {
      assert.equal(url, 'http://127.0.0.1:9999/v1/models');
      authorization = options.headers.Authorization;
      return jsonResponse({
        data: [{
          id: 'model-a',
          object: 'model',
          owned_by: 'local-runtime',
          quantization: 'Q4_K_M',
          context_length: 32768,
          notes: `${'bounded '.repeat(800)}${apiKey}`,
          api_key: apiKey,
          authorization: `Bearer ${apiKey}`,
          runtime: {
            format: 'gguf',
            password: apiKey,
            display: `loaded with ${apiKey}`
          }
        }]
      });
    }
  });

  assert.deepEqual(provider.metadata().selectedModelMetadata, {
    available: false,
    source: 'OpenAI-compatible GET /models response',
    reason: 'model-not-checked'
  });
  assert.equal(await provider.checkModel(), 'model-a');
  assert.equal(authorization, `Bearer ${apiKey}`);

  const selected = provider.metadata().selectedModelMetadata;
  assert.equal(selected.available, true);
  assert.equal(selected.source, 'OpenAI-compatible GET /models response');
  assert.equal(selected.truncated, true);
  assert.equal(selected.entry.id, 'model-a');
  assert.equal(selected.entry.quantization, 'Q4_K_M');
  assert.equal(selected.entry.context_length, 32768);
  assert.equal(selected.entry.runtime.format, 'gguf');
  assert.equal(selected.entry.api_key, undefined);
  assert.equal(selected.entry.authorization, undefined);
  assert.equal(selected.entry.runtime.password, undefined);
  assert.match(selected.entry.runtime.display, /\[REDACTED\]/);
  assert.ok(Buffer.byteLength(JSON.stringify(selected), 'utf8') <= 32 * 1024);
  assert.ok(!JSON.stringify(provider.metadata()).includes(apiKey));
  assert.ok(!JSON.stringify(provider).includes(apiKey));
});

test('records selected-model metadata as unavailable when /models returns ids only', async () => {
  const provider = createOpenAICompatibleProvider({
    id: 'id-only-provider',
    label: 'ID-only Provider',
    baseUrl: 'http://127.0.0.1:9998/v1',
    modelId: 'model-a',
    fetchImpl: async () => jsonResponse({ data: ['model-a'] })
  });

  assert.deepEqual(await provider.listModels(), ['model-a']);
  assert.equal(await provider.checkModel(), 'model-a');
  assert.deepEqual(provider.metadata().selectedModelMetadata, {
    available: false,
    source: 'OpenAI-compatible GET /models response',
    reason: 'selected-model-entry-contained-no-additional-metadata'
  });
});

function jsonResponse(payload) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
