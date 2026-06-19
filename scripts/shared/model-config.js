const VALID_CODEX_REASONING_LEVELS = ['none', 'low', 'medium', 'high', 'xhigh'];
const validCodexReasoning = new Set(VALID_CODEX_REASONING_LEVELS);

const KNOWN_CODEX_REASONING_LEVELS = {
  'gpt-5.5': ['none', 'low', 'medium', 'high', 'xhigh'],
  'gpt-5.4': ['none', 'low', 'medium', 'high', 'xhigh'],
  'gpt-5.3-codex': ['low', 'medium', 'high', 'xhigh']
};

function suggestionForCodexModel(model) {
  const normalized = String(model || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const suggestions = {
    '5.5': 'gpt-5.5',
    '5.4': 'gpt-5.4',
    '5.4 mini': 'gpt-5.4-mini',
    'gpt 5.5': 'gpt-5.5',
    'gpt 5.4': 'gpt-5.4',
    'gpt 5.4 mini': 'gpt-5.4-mini'
  };
  return suggestions[normalized] || '';
}

function suggestionForOllamaModel(model) {
  const normalized = String(model || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const suggestions = {
    'qwen 7b': 'qwen2.5:7b',
    'qwen coder 7b': 'qwen2.5-coder:7b',
    'qwen coder 14b': 'qwen2.5-coder:14b',
    'qwen2.5 coder 7b': 'qwen2.5-coder:7b',
    'qwen2.5 coder 14b': 'qwen2.5-coder:14b'
  };
  return suggestions[normalized] || '';
}

function validateCodexModel(model) {
  const value = String(model || '').trim();
  if (
    !value ||
    value.startsWith('-') ||
    /[\s\\/"'`$;&|<>()[\]{}]/.test(value) ||
    !/^[A-Za-z][A-Za-z0-9._:-]*$/.test(value)
  ) {
    const suggestion = suggestionForCodexModel(value);
    throw new Error(`Invalid or noncanonical Codex model identifier: "${value}".${suggestion ? ` Use the exact model identifier "${suggestion}".` : ''}`);
  }
  return value;
}

function validateCodexReasoning(reasoning) {
  const raw = String(reasoning || '').trim();
  const value = raw.toLowerCase();
  if (!validCodexReasoning.has(value)) {
    throw new Error(`Invalid Codex reasoning level: "${raw}". Use one of: ${Array.from(validCodexReasoning).join(', ')}.`);
  }
  return value;
}

function validateKnownCodexReasoningCombination(model, reasoning) {
  const normalizedModel = validateCodexModel(model);
  const normalizedReasoning = validateCodexReasoning(reasoning);
  const knownLevels = KNOWN_CODEX_REASONING_LEVELS[normalizedModel];
  if (knownLevels && !knownLevels.includes(normalizedReasoning)) {
    throw new Error(`Codex model "${normalizedModel}" does not support reasoning "${normalizedReasoning}" in this repository's known capability map.`);
  }
  return {
    model: normalizedModel,
    reasoning: normalizedReasoning,
    known: Boolean(knownLevels)
  };
}

function validateOllamaModel(model) {
  const value = String(model || '').trim();
  if (!/^[A-Za-z0-9._-]+:[A-Za-z0-9._-]+$/.test(value)) {
    const suggestion = suggestionForOllamaModel(value);
    throw new Error(`Invalid or noncanonical Ollama model identifier: "${value}".${suggestion ? ` Use the exact model tag "${suggestion}".` : ' Include the exact installed model tag, such as "qwen2.5-coder:14b".'}`);
  }
  return value;
}

module.exports = {
  KNOWN_CODEX_REASONING_LEVELS,
  VALID_CODEX_REASONING_LEVELS,
  suggestionForCodexModel,
  suggestionForOllamaModel,
  validateCodexModel,
  validateCodexReasoning,
  validateKnownCodexReasoningCombination,
  validateOllamaModel
};
