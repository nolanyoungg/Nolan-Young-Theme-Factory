'use strict';

const assert = require('node:assert/strict');
const http = require('node:http');
const { test } = require('node:test');

const {
  OpenAICompatibleProviderError,
  createOpenAICompatibleProvider,
  normalizeOpenAICompatibleBaseUrl
} = require('../lib/providers/openai-compatible');
const {
  DEFAULT_LMSTUDIO_BASE_URL,
  createLmStudioProvider
} = require('../lib/providers/lmstudio');
const {
  DEFAULT_OLLAMA_BASE_URL,
  createOllamaProvider
} = require('../lib/providers/ollama');

test('normalizes OpenAI-compatible and provider base URLs to /v1', () => {
  assert.equal(normalizeOpenAICompatibleBaseUrl('http://127.0.0.1:9999'), 'http://127.0.0.1:9999/v1');
  assert.equal(normalizeOpenAICompatibleBaseUrl('http://127.0.0.1:9999/'), 'http://127.0.0.1:9999/v1');
  assert.equal(normalizeOpenAICompatibleBaseUrl('https://example.test/openai/v1/'), 'https://example.test/openai/v1');
  assert.equal(createLmStudioProvider({ lmstudioModel: 'model-a' }).baseUrl, DEFAULT_LMSTUDIO_BASE_URL);
  assert.equal(createOllamaProvider({ ollamaModel: 'model-a' }).baseUrl, DEFAULT_OLLAMA_BASE_URL);
  assert.throws(() => normalizeOpenAICompatibleBaseUrl('file:///tmp/models'), /http or https/);
  assert.throws(() => normalizeOpenAICompatibleBaseUrl('http://user:password@example.test'), /must not contain credentials/);
  assert.throws(() => normalizeOpenAICompatibleBaseUrl('http://example.test?api_key=secret'), /must not contain credentials/);
});

test('lists models deterministically and checks model success and failure', async () => {
  await withServer((request, response) => {
    assert.equal(request.method, 'GET');
    assert.equal(request.url, '/v1/models');
    sendJson(response, 200, {
      data: [
        { id: 'model-z' },
        { id: 'model-a' },
        { id: 'model-a' },
        { object: 'model-without-id' }
      ]
    });
  }, async (baseUrl) => {
    const provider = createOpenAICompatibleProvider({
      id: 'test-provider',
      label: 'Test Provider',
      baseUrl,
      modelId: 'model-a'
    });
    assert.deepEqual(await provider.listModels(), ['model-a', 'model-z']);
    assert.equal(await provider.checkModel(), 'model-a');
    assert.equal(provider.metadata().checkedModelId, 'model-a');
    await assert.rejects(
      () => provider.checkModel('missing-model'),
      (error) => {
        assert.ok(error instanceof OpenAICompatibleProviderError);
        assert.equal(error.code, 'model_not_found');
        assert.equal(error.provider, 'test-provider');
        assert.match(error.message, /Visible models: model-a, model-z/);
        return true;
      }
    );
  });
});

test('normalizes multipart content and vendor tool-call argument shapes', async () => {
  let receivedBody;
  await withServer(async (request, response) => {
    receivedBody = await readJsonBody(request);
    sendJson(response, 200, {
      model: 'model-a',
      choices: [
        {
          finish_reason: 'tool_calls',
          message: {
            content: [
              'alpha ',
              { type: 'text', text: 'beta ' },
              { content: 'gamma' },
              { type: 'image', image_url: 'ignored' }
            ],
            tool_calls: [
              {
                type: 'function',
                function: {
                  name: 'read_file',
                  arguments: { path: 'header.php' }
                }
              },
              {
                id: 'call-2',
                type: 'function',
                function: {
                  name: 'search_files',
                  arguments: '{"query":"navigation"}'
                }
              }
            ]
          }
        }
      ]
    });
  }, async (baseUrl) => {
    const provider = createOpenAICompatibleProvider({
      id: 'test-provider',
      label: 'Test Provider',
      baseUrl,
      modelId: 'model-a',
      temperature: 0.35
    });
    const result = await provider.chatCompletion({
      messages: [{ role: 'user', content: 'Inspect the theme.' }]
    });
    assert.equal(result.content, 'alpha beta gamma');
    assert.equal(result.finishReason, 'tool_calls');
    assert.equal(result.model, 'model-a');
    assert.deepEqual(result.toolCalls, [
      { id: 'tool-call-1', name: 'read_file', arguments: '{"path":"header.php"}' },
      { id: 'call-2', name: 'search_files', arguments: '{"query":"navigation"}' }
    ]);
    assert.equal(receivedBody.model, 'model-a');
    assert.equal(receivedBody.temperature, 0.35);
    assert.equal(receivedBody.stream, false);
  });
});

test('actively verifies required structured tool calling', async () => {
  let receivedBody;
  await withServer(async (request, response) => {
    receivedBody = await readJsonBody(request);
    sendJson(response, 200, {
      model: receivedBody.model,
      choices: [
        {
          finish_reason: 'tool_calls',
          message: {
            content: null,
            tool_calls: [
              {
                id: 'probe-call',
                type: 'function',
                function: {
                  name: 'local_model_agent_capability_probe',
                  arguments: '{"supported":true}'
                }
              }
            ]
          }
        }
      ]
    });
  }, async (baseUrl) => {
    const provider = createOpenAICompatibleProvider({
      id: 'test-provider',
      label: 'Test Provider',
      baseUrl,
      modelId: 'model-a'
    });
    assert.equal(await provider.checkToolCalling(), true);
    assert.equal(receivedBody.tool_choice, 'required');
    assert.equal(receivedBody.tools[0].function.name, 'local_model_agent_capability_probe');
    assert.equal(provider.capabilities.toolCalling, true);
    assert.equal(provider.capabilities.requiredToolCalling, true);
  });
});

test('rejects a content-only JSON pseudo-tool-call during capability probing', async () => {
  let receivedBody;
  await withServer(async (request, response) => {
    receivedBody = await readJsonBody(request);
    sendJson(response, 200, {
      model: receivedBody.model,
      choices: [
        {
          finish_reason: 'stop',
          message: {
            content: JSON.stringify({
              tool_calls: [
                {
                  id: 'fake-text-call',
                  type: 'function',
                  function: {
                    name: 'local_model_agent_capability_probe',
                    arguments: { supported: true }
                  }
                }
              ]
            })
          }
        }
      ]
    });
  }, async (baseUrl) => {
    const provider = createOpenAICompatibleProvider({
      id: 'text-shim-provider',
      label: 'Text Shim Provider',
      baseUrl,
      modelId: 'model-a'
    });

    await assert.rejects(
      () => provider.checkToolCalling(),
      (error) => {
        assert.ok(error instanceof OpenAICompatibleProviderError);
        assert.equal(error.code, 'required_tool_calling_unsupported');
        assert.equal(error.operation, 'checkToolCalling');
        assert.match(error.message, /did not return the required structured tool call/);
        return true;
      }
    );
    assert.equal(receivedBody.tool_choice, 'required');
    assert.equal(provider.capabilities.toolCalling, false);
    assert.equal(provider.capabilities.requiredToolCalling, false);
  });
});

test('normalizes provider timeouts', async () => {
  await withServer((request, response) => {
    setTimeout(() => sendJson(response, 200, { data: [] }), 100);
  }, async (baseUrl) => {
    const provider = createOpenAICompatibleProvider({
      id: 'slow-provider',
      label: 'Slow Provider',
      baseUrl,
      modelId: 'model-a',
      timeout: 20
    });
    await assert.rejects(
      () => provider.listModels(),
      (error) => {
        assert.ok(error instanceof OpenAICompatibleProviderError);
        assert.equal(error.code, 'provider_timeout');
        assert.equal(error.operation, 'listModels');
        assert.equal(error.retryable, true);
        assert.match(error.message, /timed out after 20 ms/);
        return true;
      }
    );
  });
});

test('normalizes HTTP errors with safe provider metadata', async () => {
  await withServer((request, response) => {
    sendJson(response, 429, {
      error: {
        code: 'rate_limit',
        message: 'Local server queue is full.'
      }
    });
  }, async (baseUrl) => {
    const provider = createOpenAICompatibleProvider({
      id: 'busy-provider',
      label: 'Busy Provider',
      baseUrl,
      modelId: 'model-a'
    });
    await assert.rejects(
      () => provider.listModels(),
      (error) => {
        assert.ok(error instanceof OpenAICompatibleProviderError);
        assert.equal(error.code, 'rate_limit');
        assert.equal(error.provider, 'busy-provider');
        assert.equal(error.operation, 'listModels');
        assert.equal(error.status, 429);
        assert.equal(error.retryable, true);
        assert.match(error.message, /Local server queue is full/);
        return true;
      }
    );
  });
});

test('redacts API keys from metadata, serialized providers, responses, and errors', async () => {
  const apiKey = 'test-api-key-that-must-never-leak';
  let requestCount = 0;
  let receivedAuthorization;
  await withServer(async (request, response) => {
    requestCount += 1;
    receivedAuthorization = request.headers.authorization;
    if (requestCount === 1) {
      await readJsonBody(request);
      sendJson(response, 200, {
        api_key: apiKey,
        model: 'model-a',
        choices: [
          {
            finish_reason: 'stop',
            message: {
              content: `Bearer ${apiKey}`,
              tool_calls: [
                {
                  id: 'call-1',
                  type: 'function',
                  function: {
                    name: 'read_file',
                    arguments: { secret: apiKey }
                  }
                }
              ]
            }
          }
        ]
      });
      return;
    }
    sendJson(response, 400, {
      error: {
        code: 'bad_request',
        message: `Rejected Bearer ${apiKey}`
      }
    });
  }, async (baseUrl) => {
    const provider = createOpenAICompatibleProvider({
      id: 'secret-provider',
      label: 'Secret Provider',
      baseUrl,
      modelId: 'model-a',
      apiKey
    });
    assert.equal(receivedAuthorization, undefined);
    assert.ok(!JSON.stringify(provider.metadata()).includes(apiKey));
    assert.ok(!JSON.stringify(provider).includes(apiKey));

    const result = await provider.chatCompletion({
      messages: [{ role: 'user', content: 'Return a response.' }]
    });
    assert.equal(receivedAuthorization, `Bearer ${apiKey}`);
    assert.ok(!JSON.stringify(result).includes(apiKey));
    assert.equal(result.content, 'Bearer [REDACTED]');
    assert.equal(result.raw.api_key, '[REDACTED]');
    assert.equal(result.toolCalls[0].arguments, '{"secret":"[REDACTED]"}');

    await assert.rejects(
      () => provider.listModels(),
      (error) => {
        assert.ok(!error.message.includes(apiKey));
        assert.ok(!JSON.stringify(error).includes(apiKey));
        assert.match(error.message, /Bearer \[REDACTED\]/);
        return true;
      }
    );
  });
});

async function withServer(handler, work) {
  const server = http.createServer((request, response) => {
    Promise.resolve(handler(request, response)).catch((error) => {
      sendJson(response, 500, { error: { message: error.message } });
    });
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  try {
    return await work(baseUrl);
  } finally {
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(resolve));
  }
}

function sendJson(response, status, payload) {
  if (response.destroyed || response.writableEnded) {
    return;
  }
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString('utf8');
  return body ? JSON.parse(body) : null;
}
