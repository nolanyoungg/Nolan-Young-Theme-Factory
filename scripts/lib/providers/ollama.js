'use strict';

const { spawnSync } = require('node:child_process');

function runOllamaStage(stagePrompt, stage, themeDir, options, reportDir, deps) {
  const { fs, path, assertStatus } = deps;
  const executable = options.ollamaExecutable || 'ollama';
  const result = spawnSync(executable, ['run', options.ollamaModel], {
    cwd: themeDir,
    input: stagePrompt,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 100
  });
  fs.writeFileSync(path.join(reportDir, `ollama-${stage.id}.log`), [
    `$ ${executable} run ${options.ollamaModel}`,
    '',
    result.stdout || '',
    result.stderr || ''
  ].join('\n'));
  assertStatus(result, `Ollama stage ${stage.id}`);
  return result.stdout || '';
}

function checkOllamaProvider(args, deps) {
  const { ROOT, assertStatus } = deps;
  const executable = args.ollamaExecutable || args['ollama-executable'] || 'ollama';
  const version = spawnSync(executable, ['--version'], { cwd: ROOT, encoding: 'utf8' });
  assertStatus(version, `${executable} --version`);
  const model = args.ollamaModel || args['ollama-model'];
  if (!model) {
    return [];
  }
  const list = spawnSync(executable, ['list'], { cwd: ROOT, encoding: 'utf8' });
  assertStatus(list, `${executable} list`);
  const modelIds = parseOllamaModelList(list.stdout);
  if (!modelIds.includes(model)) {
    const installed = modelIds.length ? modelIds.join(', ') : '(none)';
    throw new Error(`Ollama model not found locally: ${model}. Installed models: ${installed}. Pull it with: ${executable} pull ${model}`);
  }
  return modelIds;
}

function parseOllamaModelList(output) {
  return output
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim().split(/\s+/)[0])
    .filter(Boolean);
}

module.exports = {
  checkOllamaProvider,
  parseOllamaModelList,
  runOllamaStage
};
