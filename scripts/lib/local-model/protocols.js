'use strict';

class ProtocolError extends Error {
  constructor(message, options = {}) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = 'ProtocolError';
    this.code = options.code || 'PROTOCOL_ERROR';
    this.retryable = Boolean(options.retryable);
    if (options.details !== undefined) {
      this.details = options.details;
    }
  }
}

const LEGACY_FILE_BLOCK_RE = /---\s*FILE\s*:|---\s*END\s+FILE\s*---/i;
const DIFF_FENCE_RE = /^```([a-zA-Z0-9_-]*)[ \t]*\r?\n([\s\S]*?)\r?\n```$/;
const HUNK_COUNTS_RE = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(?:.*)$/;

function parseFinalResponse(response) {
  const content = extractAssistantContent(response);
  rejectLegacyFileBlocks(content);

  const trimmed = content.trim();
  if (!trimmed) {
    throw new ProtocolError('The model final response was empty; expected one unified diff.', {
      code: 'EMPTY_FINAL_RESPONSE'
    });
  }

  if (trimmed.startsWith('```')) {
    const fenceMatches = [...trimmed.matchAll(/```/g)];
    if (fenceMatches.length !== 2) {
      throw new ProtocolError('The model final response must contain exactly one fenced unified diff and no other blocks.', {
        code: 'MULTIPLE_OR_MALFORMED_DIFF_BLOCKS'
      });
    }
    const match = trimmed.match(DIFF_FENCE_RE);
    if (!match) {
      throw new ProtocolError('The fenced unified diff must be the entire final response, with no prose before or after it.', {
        code: 'PROSE_OUTSIDE_DIFF'
      });
    }
    const language = match[1].toLowerCase();
    if (language && language !== 'diff' && language !== 'patch') {
      throw new ProtocolError(`Unsupported code-fence language "${match[1]}"; use diff or patch.`, {
        code: 'INVALID_DIFF_FENCE'
      });
    }
    const diff = normalizeDiffText(match[2]);
    assertDiffOnly(diff);
    return { content, diff, format: 'fenced' };
  }

  const diff = normalizeDiffText(trimmed);
  assertDiffOnly(diff);
  return { content, diff, format: 'raw' };
}

function extractUnifiedDiff(response) {
  return parseFinalResponse(response).diff;
}

function extractAssistantContent(response) {
  if (typeof response === 'string') {
    return response;
  }
  if (!response || typeof response !== 'object') {
    throw new ProtocolError('The model response must be a string or an OpenAI-compatible response object.', {
      code: 'INVALID_MODEL_RESPONSE'
    });
  }

  const message = response.message
    || response.choices?.[0]?.message
    || (Object.prototype.hasOwnProperty.call(response, 'content') ? response : null);
  if (!message || typeof message !== 'object') {
    throw new ProtocolError('The model response did not contain an assistant message.', {
      code: 'MISSING_ASSISTANT_MESSAGE'
    });
  }
  if ((Array.isArray(message.tool_calls) && message.tool_calls.length)
    || (Array.isArray(message.toolCalls) && message.toolCalls.length)) {
    throw new ProtocolError('The model returned tool calls instead of a final unified diff.', {
      code: 'UNEXPECTED_TOOL_CALLS_IN_FINAL_RESPONSE'
    });
  }

  const content = message.content;
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    const text = content.map((part, index) => {
      if (typeof part === 'string') {
        return part;
      }
      if (part && typeof part === 'object' && (part.type === 'text' || typeof part.text === 'string')) {
        return typeof part.text === 'string' ? part.text : '';
      }
      throw new ProtocolError(`Assistant content part ${index + 1} was not text.`, {
        code: 'NON_TEXT_ASSISTANT_CONTENT'
      });
    }).join('');
    return text;
  }
  throw new ProtocolError('The assistant message did not contain text content.', {
    code: 'MISSING_ASSISTANT_CONTENT'
  });
}

function rejectLegacyFileBlocks(content) {
  if (LEGACY_FILE_BLOCK_RE.test(String(content || ''))) {
    throw new ProtocolError('Legacy complete-file blocks are not accepted. Return one unified diff only.', {
      code: 'LEGACY_FILE_BLOCK_PROTOCOL'
    });
  }
}

function normalizeDiffText(value) {
  return String(value).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim();
}

function assertDiffOnly(diff) {
  rejectLegacyFileBlocks(diff);
  if (!diff.startsWith('diff --git ') && !diff.startsWith('--- ')) {
    throw new ProtocolError('The model final response must begin with a git or unified diff header.', {
      code: 'NO_UNIFIED_DIFF'
    });
  }
  if (/^```/m.test(diff)) {
    throw new ProtocolError('Nested or multiple code fences are not accepted.', {
      code: 'MULTIPLE_OR_MALFORMED_DIFF_BLOCKS'
    });
  }
  if (/^GIT binary patch$|^Binary files .+ differ$/m.test(diff)) {
    throw new ProtocolError('Binary patches are not accepted.', {
      code: 'BINARY_PATCH'
    });
  }

  const lines = diff.split('\n');
  let sawOldHeader = false;
  let sawNewHeader = false;
  let sawHunk = false;
  let inHunk = false;
  let oldRemaining = 0;
  let newRemaining = 0;
  let allowNoNewlineMarker = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (inHunk) {
      if (line === '\\ No newline at end of file') {
        continue;
      }
      const prefix = line[0];
      if (prefix === ' ') {
        oldRemaining -= 1;
        newRemaining -= 1;
      } else if (prefix === '-') {
        oldRemaining -= 1;
      } else if (prefix === '+') {
        newRemaining -= 1;
      } else {
        throw new ProtocolError(`Unexpected text in unified diff at line ${index + 1}.`, {
          code: 'PROSE_OUTSIDE_DIFF',
          details: { line: index + 1 }
        });
      }
      if (oldRemaining < 0 || newRemaining < 0) {
        throw new ProtocolError(`Unified diff hunk exceeds its declared line counts at line ${index + 1}.`, {
          code: 'MALFORMED_UNIFIED_DIFF',
          details: { line: index + 1 }
        });
      }
      if (oldRemaining === 0 && newRemaining === 0) {
        inHunk = false;
        allowNoNewlineMarker = true;
      }
      continue;
    }
    if (line === '\\ No newline at end of file' && allowNoNewlineMarker) {
      allowNoNewlineMarker = false;
      continue;
    }
    allowNoNewlineMarker = false;
    if (line.startsWith('diff --git ')) {
      continue;
    }
    if (line.startsWith('--- ') && !inHunk) {
      sawOldHeader = true;
      continue;
    }
    if (line.startsWith('+++ ') && !inHunk) {
      sawNewHeader = true;
      continue;
    }
    const hunk = line.match(HUNK_COUNTS_RE);
    if (hunk) {
      sawHunk = true;
      oldRemaining = hunk[2] === undefined ? 1 : Number(hunk[2]);
      newRemaining = hunk[4] === undefined ? 1 : Number(hunk[4]);
      inHunk = oldRemaining > 0 || newRemaining > 0;
      continue;
    }
    if (isAllowedDiffMetadata(line)) {
      continue;
    }
    throw new ProtocolError(`Unexpected prose or malformed diff content at line ${index + 1}.`, {
      code: 'PROSE_OUTSIDE_DIFF',
      details: { line: index + 1 }
    });
  }

  if (!sawOldHeader || !sawNewHeader || !sawHunk) {
    throw new ProtocolError('The model response did not contain a complete textual unified diff with file headers and a hunk.', {
      code: 'NO_UNIFIED_DIFF'
    });
  }
  if (inHunk || oldRemaining !== 0 || newRemaining !== 0) {
    throw new ProtocolError('The unified diff ended before its declared hunk line counts were satisfied.', {
      code: 'MALFORMED_UNIFIED_DIFF'
    });
  }
}

function isAllowedDiffMetadata(line) {
  return /^index [0-9a-f]+\.\.[0-9a-f]+(?: \d{6})?$/i.test(line)
    || /^(?:new file mode|deleted file mode|old mode|new mode) \d{6}$/.test(line)
    || /^(?:similarity|dissimilarity) index \d+%$/.test(line)
    || /^(?:rename|copy) (?:from|to) .+$/.test(line)
    || /^Index: .+$/.test(line)
    || /^={3,}$/.test(line);
}

function parseToolArguments(value, context = {}) {
  const toolName = context.toolName || context.name || 'unknown tool';
  let parsed = value;

  if (value === undefined) {
    parsed = {};
  } else if (typeof value === 'string') {
    if (!value.trim()) {
      throw malformedToolArguments(toolName, 'arguments were empty');
    }
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      throw malformedToolArguments(toolName, error.message, error);
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw malformedToolArguments(toolName, 'arguments must decode to a JSON object');
  }
  return parsed;
}

function malformedToolArguments(toolName, detail, cause) {
  return new ProtocolError(`Malformed JSON arguments for tool "${toolName}": ${detail}.`, {
    code: 'MALFORMED_TOOL_ARGUMENTS',
    retryable: true,
    details: { toolName },
    cause
  });
}

function normalizeToolCall(call, index = 0) {
  let value = call;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (error) {
      throw new ProtocolError(`Tool call ${index + 1} was not valid JSON: ${error.message}.`, {
        code: 'MALFORMED_TOOL_CALL',
        retryable: true,
        details: { index },
        cause: error
      });
    }
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ProtocolError(`Tool call ${index + 1} must be an object.`, {
      code: 'MALFORMED_TOOL_CALL',
      retryable: true,
      details: { index }
    });
  }
  if (value.type && value.type !== 'function') {
    throw new ProtocolError(`Tool call ${index + 1} used unsupported type "${value.type}".`, {
      code: 'UNSUPPORTED_TOOL_CALL_TYPE',
      details: { index, type: value.type }
    });
  }

  const fn = value.function && typeof value.function === 'object' ? value.function : value;
  const name = fn.name;
  if (typeof name !== 'string' || !name.trim()) {
    throw new ProtocolError(`Tool call ${index + 1} is missing a function name.`, {
      code: 'MALFORMED_TOOL_CALL',
      retryable: true,
      details: { index }
    });
  }
  const rawArguments = Object.prototype.hasOwnProperty.call(fn, 'arguments') ? fn.arguments : {};
  const args = parseToolArguments(rawArguments, { toolName: name });
  return {
    id: typeof value.id === 'string' && value.id ? value.id : `tool-call-${index + 1}`,
    type: 'function',
    name: name.trim(),
    arguments: args,
    rawArguments
  };
}

function normalizeToolCalls(input) {
  const calls = Array.isArray(input)
    ? input
    : input?.toolCalls
      || input?.tool_calls
      || input?.message?.tool_calls
      || input?.choices?.[0]?.message?.tool_calls
      || (input?.function_call ? [input.function_call] : []);
  if (!Array.isArray(calls)) {
    throw new ProtocolError('Tool calls must be an array.', {
      code: 'MALFORMED_TOOL_CALL',
      retryable: true
    });
  }
  const normalized = calls.map((call, index) => normalizeToolCall(call, index));
  const ids = new Set();
  for (const call of normalized) {
    if (ids.has(call.id)) {
      throw new ProtocolError(`Duplicate tool call id "${call.id}".`, {
        code: 'DUPLICATE_TOOL_CALL_ID',
        retryable: true,
        details: { id: call.id }
      });
    }
    ids.add(call.id);
  }
  return normalized;
}

module.exports = {
  LEGACY_FILE_BLOCK_RE,
  ProtocolError,
  assertDiffOnly,
  extractAssistantContent,
  extractUnifiedDiff,
  normalizeDiffText,
  normalizeToolCall,
  normalizeToolCalls,
  parseFinalResponse,
  parseToolArguments,
  rejectLegacyFileBlocks
};
