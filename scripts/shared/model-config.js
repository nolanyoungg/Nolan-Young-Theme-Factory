const validCodexReasoning = new Set(['low', 'medium', 'high', 'xhigh']);

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
  if (!/^[A-Za-z][A-Za-z0-9.-]*$/.test(value)) {
    const suggestion = suggestionForCodexModel(value);
    throw new Error(`Invalid or noncanonical Codex model identifier: "${value}".${suggestion ? ` Use the exact model identifier "${suggestion}".` : ''}`);
  }
  return value;
}

function validateCodexReasoning(reasoning) {
  const value = String(reasoning || '').trim();
  if (!validCodexReasoning.has(value)) {
    throw new Error(`Invalid Codex reasoning level: "${value}". Use one of: ${Array.from(validCodexReasoning).join(', ')}.`);
  }
  return value;
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
  validateCodexModel,
  validateCodexReasoning,
  validateOllamaModel
};
