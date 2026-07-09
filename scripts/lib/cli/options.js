'use strict';

const readline = require('node:readline/promises');

const {
  DEFAULT_LMSTUDIO_API_KEY,
  DEFAULT_LMSTUDIO_BASE_URL,
  DEFAULT_LMSTUDIO_TEMPERATURE,
  normalizeLmStudioBaseUrl
} = require('../providers/lmstudio');

function parseArgs(rawArgs) {
  const args = {};
  for (let i = 0; i < rawArgs.length; i += 1) {
    const token = rawArgs[i];
    if (!token.startsWith('--')) {
      args._ = args._ || [];
      args._.push(token);
      continue;
    }
    const without = token.slice(2);
    const eq = without.indexOf('=');
    if (eq !== -1) {
      args[toCamel(without.slice(0, eq))] = without.slice(eq + 1);
      args[without.slice(0, eq)] = without.slice(eq + 1);
      continue;
    }
    const key = toCamel(without);
    const originalKey = without;
    const next = rawArgs[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      args[originalKey] = true;
    } else {
      args[key] = next;
      args[originalKey] = next;
      i += 1;
    }
  }
  return args;
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

async function collectRunOptions(args, deps) {
  let options = {
    mode: args.mode,
    promptPath: args.prompt ? deps.resolvePromptPath(args.prompt) : null,
    templateSourcePath: args.templateSourcePath || args['template-source-path'] ? deps.resolveTemplateSource(args) : null,
    themeSlug: args.themeSlug || args['theme-slug'] || null,
    codexExecutable: args.codexExecutable || args['codex-executable'] || 'codex',
    codexModel: args.codexModel || args['codex-model'] || '',
    codexReasoning: args.codexReasoning || args['codex-reasoning'] || '',
    codexExtraArgs: splitExtraArgs(args.codexExtraArgs || args['codex-extra-args'] || ''),
    ollamaExecutable: args.ollamaExecutable || args['ollama-executable'] || 'ollama',
    ollamaModel: args.ollamaModel || args['ollama-model'] || '',
    lmstudioBaseUrl: normalizeLmStudioBaseUrl(args.lmstudioBaseUrl || args['lmstudio-base-url'] || process.env.LMSTUDIO_BASE_URL || DEFAULT_LMSTUDIO_BASE_URL),
    lmstudioModel: args.lmstudioModel || args['lmstudio-model'] || '',
    lmstudioApiKey: args.lmstudioApiKey || args['lmstudio-api-key'] || process.env.LMSTUDIO_API_KEY || DEFAULT_LMSTUDIO_API_KEY,
    lmstudioTemperature: args.lmstudioTemperature || args['lmstudio-temperature'] || DEFAULT_LMSTUDIO_TEMPERATURE,
    force: Boolean(args.force)
  };

  const interactive = process.stdin.isTTY && process.stdout.isTTY && (!options.mode || !options.promptPath || !options.themeSlug);
  if (interactive) {
    options = await askRunOptions(options, deps);
  }

  if (!deps.MODE_VALUES.has(options.mode)) {
    throw new Error(`Choose --mode codex-only, ollama-only, or lmstudio-only. Received: ${options.mode || '(missing)'}`);
  }
  if (!options.promptPath) {
    throw new Error('Missing --prompt.');
  }
  if (!options.templateSourcePath) {
    options.templateSourcePath = deps.resolveTemplateSource({});
  }
  if (!options.themeSlug) {
    options.themeSlug = deps.makeNextSlug(options.promptPath);
  }
  deps.requireSlug(options.themeSlug);
  if (options.mode === 'ollama-only' && !options.ollamaModel) {
    throw new Error('Missing --ollama-model for ollama-only mode.');
  }
  if (options.mode === 'lmstudio-only' && !options.lmstudioModel) {
    throw new Error('Missing --lmstudio-model for lmstudio-only mode.');
  }
  return options;
}

async function askRunOptions(options, deps) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    if (!options.mode) {
      options.mode = await askWithDefault(rl, 'Mode (codex-only, ollama-only, or lmstudio-only)', 'codex-only');
    }
    if (!options.promptPath) {
      const firstPrompt = deps.firstPromptPath();
      options.promptPath = deps.resolvePromptPath(await askWithDefault(rl, 'Prompt file', deps.relative(firstPrompt)));
    }
    if (!options.templateSourcePath) {
      options.templateSourcePath = deps.resolvePath(await askWithDefault(rl, 'Template source path', deps.relative(deps.DEFAULT_TEMPLATE_DIR)));
    }
    if (!options.themeSlug) {
      options.themeSlug = await askWithDefault(rl, 'Theme slug', deps.makeNextSlug(options.promptPath));
    }
    if (options.mode === 'codex-only') {
      options.codexExecutable = await askWithDefault(rl, 'Codex executable', options.codexExecutable);
      options.codexModel = await askWithDefault(rl, 'Codex model (blank uses Codex config)', options.codexModel);
      options.codexReasoning = await askWithDefault(rl, 'Codex reasoning (blank uses Codex config)', options.codexReasoning);
      options.codexExtraArgs = splitExtraArgs(await askWithDefault(rl, 'Codex extra args', options.codexExtraArgs.join(' ')));
    } else if (options.mode === 'ollama-only') {
      options.ollamaExecutable = await askWithDefault(rl, 'Ollama executable', options.ollamaExecutable);
      options.ollamaModel = await askWithDefault(rl, 'Ollama model', options.ollamaModel || 'llama3.1:8b');
    } else {
      options.lmstudioBaseUrl = normalizeLmStudioBaseUrl(await askWithDefault(rl, 'LM Studio base URL', options.lmstudioBaseUrl));
      options.lmstudioModel = await askWithDefault(rl, 'LM Studio model identifier', options.lmstudioModel);
      options.lmstudioTemperature = await askWithDefault(rl, 'LM Studio temperature', options.lmstudioTemperature);
    }
    const confirmation = await askWithDefault(rl, 'Type continue to start generation', '');
    if (confirmation !== 'continue') {
      throw new Error('Generation cancelled.');
    }
  } finally {
    rl.close();
  }
  return options;
}

async function askWithDefault(rl, label, defaultValue) {
  const suffix = defaultValue ? ` [${defaultValue}]` : '';
  const answer = await rl.question(`${label}${suffix}: `);
  return answer.trim() || defaultValue;
}

function splitExtraArgs(value) {
  if (!value) {
    return [];
  }
  return String(value).match(/(?:[^\s"]+|"[^"]*")+/g)?.map((item) => item.replace(/^"|"$/g, '')) || [];
}

function isPlannedLocalModelMode(mode) {
  return mode === 'ollama-only' || mode === 'lmstudio-only';
}

function localModelProviderLabel(mode) {
  if (mode === 'ollama-only') {
    return 'Ollama';
  }
  if (mode === 'lmstudio-only') {
    return 'LM Studio';
  }
  return 'Local model';
}

function providerForMode(mode) {
  if (mode === 'codex-only') {
    return 'codex';
  }
  if (mode === 'ollama-only') {
    return 'ollama';
  }
  if (mode === 'lmstudio-only') {
    return 'lmstudio';
  }
  throw new Error(`Unsupported mode: ${mode}`);
}

module.exports = {
  askRunOptions,
  collectRunOptions,
  isPlannedLocalModelMode,
  localModelProviderLabel,
  parseArgs,
  providerForMode,
  splitExtraArgs,
  toCamel
};
