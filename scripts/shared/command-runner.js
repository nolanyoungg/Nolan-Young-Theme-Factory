const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { COMMAND_FAILURE_CODES } = require('./constants');
const { root } = require('./repo-root');

const TOKEN_PATTERN = /(gho_[A-Za-z0-9_]+|ghp_[A-Za-z0-9_]+|sk-[A-Za-z0-9_-]{20,}|Bearer\s+[A-Za-z0-9._~+/=-]+|Authorization:\s*[^\r\n]+)/gi;

function redact(value) {
  return String(value || '').replace(TOKEN_PATTERN, '[REDACTED]');
}

function pathCandidates(command) {
  if (!command) return [];
  if (/[\\/]/.test(command) || path.isAbsolute(command)) return [command];

  const pathParts = String(process.env.PATH || '').split(path.delimiter).filter(Boolean);
  const extensions = process.platform === 'win32'
    ? (process.env.PATHEXT || '.COM;.EXE;.BAT;.CMD').split(';').filter(Boolean)
    : [''];
  const hasExtension = path.extname(command) !== '';

  const candidates = [];
  for (const dir of pathParts) {
    if (hasExtension) {
      candidates.push(path.join(dir, command));
    } else {
      for (const extension of extensions) candidates.push(path.join(dir, `${command}${extension}`));
    }
  }
  return candidates;
}

function isExecutable(file) {
  try {
    const stat = fs.statSync(file);
    return stat.isFile();
  } catch (error) {
    return false;
  }
}

function resolveCommand(command) {
  for (const candidate of pathCandidates(command)) {
    if (isExecutable(candidate)) return candidate;
  }
  return command;
}

function hasCommand(command) {
  return resolveCommand(command) !== command || isExecutable(command);
}

function quoteWindowsArg(value) {
  const text = String(value);
  if (/^[A-Za-z0-9_:=./\\-]+$/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function nodeShimScript(resolved) {
  if (process.platform !== 'win32' || !/\.cmd$/i.test(resolved)) return '';
  try {
    const text = fs.readFileSync(resolved, 'utf8');
    const match = text.match(/%dp0%[\\/]+([^"]+?\.js)/i);
    if (!match) return '';
    const scriptPath = path.resolve(path.dirname(resolved), match[1].replace(/[\\/]/g, path.sep));
    return fs.existsSync(scriptPath) ? scriptPath : '';
  } catch (error) {
    return '';
  }
}

function commandForSpawn(resolved, args, command) {
  const shimScript = nodeShimScript(resolved);
  if (shimScript) {
    return {
      executable: resolveCommand('node'),
      args: [shimScript, ...args]
    };
  }

  if (process.platform === 'win32' && /\.(cmd|bat)$/i.test(resolved)) {
    const shimName = /[\\/]/.test(command) ? resolved : path.basename(resolved);
    const commandLine = [quoteWindowsArg(shimName), ...args.map(quoteWindowsArg)].join(' ');
    return {
      executable: process.env.ComSpec || 'cmd.exe',
      args: ['/d', '/s', '/c', commandLine]
    };
  }
  return { executable: resolved, args };
}

function classifyCommandFailure(result, context = {}) {
  const output = `${result.stderr || ''}\n${result.stdout || ''}\n${result.error || ''}`;
  if (result.timedOut) return COMMAND_FAILURE_CODES.PROCESS_TIMEOUT;
  if (result.errorCode === 'ENOENT') return COMMAND_FAILURE_CODES.COMMAND_NOT_FOUND;
  if (result.errorCode === 'ENOBUFS') return COMMAND_FAILURE_CODES.OUTPUT_INVALID;
  if (/not found|unknown model|model .* does not exist/i.test(output)) return COMMAND_FAILURE_CODES.MODEL_NOT_FOUND;
  if (/model .* not installed|pull .* first|not found, try pulling/i.test(output)) return COMMAND_FAILURE_CODES.MODEL_NOT_INSTALLED;
  if (/reasoning|model_reasoning_effort/i.test(output) && /unsupported|invalid|not supported/i.test(output)) return COMMAND_FAILURE_CODES.REASONING_LEVEL_UNSUPPORTED;
  if (/authentication|not authenticated|login required|unauthorized|401|expired/i.test(output)) return COMMAND_FAILURE_CODES.AUTHENTICATION_REQUIRED;
  if (/access denied|permission denied|forbidden|403|not have access/i.test(output)) return COMMAND_FAILURE_CODES.MODEL_ACCESS_DENIED;
  if (/quota|credit|billing|usage limit/i.test(output)) return COMMAND_FAILURE_CODES.QUOTA_EXCEEDED;
  if (/rate limit|too many requests|429/i.test(output)) return COMMAND_FAILURE_CODES.RATE_LIMITED;
  if (/network|timeout|ECONNRESET|ENOTFOUND|ETIMEDOUT|TLS|socket/i.test(output)) return COMMAND_FAILURE_CODES.NETWORK_FAILURE;
  if (/ollama.*not.*running|connection refused|could not connect/i.test(output)) return COMMAND_FAILURE_CODES.OLLAMA_SERVICE_UNAVAILABLE;
  if (/out of memory|insufficient memory|allocation/i.test(output)) return COMMAND_FAILURE_CODES.INSUFFICIENT_MEMORY;
  if (/load model|failed to load|corrupt/i.test(output)) return COMMAND_FAILURE_CODES.MODEL_LOAD_FAILED;
  if (context.expectedOutput && !String(result.stdout || '').includes(context.expectedOutput)) return COMMAND_FAILURE_CODES.OUTPUT_MISSING;
  if (result.status !== 0) return COMMAND_FAILURE_CODES.NONZERO_EXIT;
  return '';
}

function writeDebugReport(result, options = {}) {
  if (!options.debugDir || !options.stage) return '';
  fs.mkdirSync(options.debugDir, { recursive: true });
  const base = path.join(options.debugDir, `${options.stage}-failure`);
  const stdoutName = `${options.stage}-stdout.log`;
  const stderrName = `${options.stage}-stderr.log`;
  const stdoutPath = path.join(options.debugDir, stdoutName);
  const stderrPath = path.join(options.debugDir, stderrName);
  fs.writeFileSync(stdoutPath, redact(result.stdout), 'utf8');
  fs.writeFileSync(stderrPath, redact(result.stderr), 'utf8');

  const report = {
    provider: options.provider || '',
    stage: options.stage,
    workflow_mode: options.mode || '',
    theme_slug: options.themeSlug || '',
    requested_model: options.model || '',
    requested_reasoning: options.reasoning || '',
    executable_name: result.command,
    resolved_executable: result.resolvedCommand,
    sanitized_args: result.args.map(redact),
    cwd: result.cwd,
    started_at: result.startedAt,
    ended_at: result.endedAt,
    duration_ms: result.durationMs,
    exit_code: result.status,
    signal: result.signal,
    timed_out: result.timedOut,
    spawn_error_code: result.errorCode,
    classification: result.classification || classifyCommandFailure(result, options),
    stdout_log: stdoutName,
    stderr_log: stderrName
  };
  const reportPath = `${base}.json`;
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return reportPath;
}

function normalizeResult(raw, command, resolvedCommand, args, options, startedAt, startedTime) {
  const endedAt = new Date().toISOString();
  const status = raw.status ?? (raw.error ? 1 : 0);
  const result = {
    command,
    resolvedCommand,
    args,
    status,
    stdout: raw.stdout || '',
    stderr: raw.stderr || '',
    error: raw.error ? raw.error.message : '',
    errorCode: raw.error ? raw.error.code : '',
    signal: raw.signal || '',
    timedOut: Boolean(raw.error && raw.error.code === 'ETIMEDOUT'),
    cwd: options.cwd || root,
    startedAt,
    endedAt,
    durationMs: Date.now() - startedTime
  };
  result.classification = classifyCommandFailure(result, options);
  if (status !== 0 || result.error || result.timedOut) {
    result.debugReport = writeDebugReport(result, options);
  }
  return result;
}

function printSummary(prefix, result, options = {}) {
  if (options.echoSummary !== true) return;
  const label = options.provider ? `[${options.provider}]` : '[command]';
  const stage = options.stage ? ` stage=${options.stage}` : '';
  const model = options.model ? ` model=${options.model}` : '';
  const reasoning = options.reasoning ? ` reasoning=${options.reasoning}` : '';
  const status = prefix === 'start' ? 'Starting' : result.status === 0 ? 'Completed' : 'Failed';
  console.error(`${label} ${status}${stage}${model}${reasoning}`);
  if (prefix !== 'start' && result.status !== 0) {
    console.error(`${label} Classification: ${result.classification || COMMAND_FAILURE_CODES.UNKNOWN_PROVIDER_FAILURE}`);
    if (result.debugReport) console.error(`${label} Debug report: ${result.debugReport}`);
  }
}

function runCommand(command, args = [], options = {}) {
  const resolved = options.resolve === false ? command : resolveCommand(command);
  const startedAt = new Date().toISOString();
  const startedTime = Date.now();
  const spawnSpec = commandForSpawn(resolved, args, command);

  printSummary('start', null, options);
  const raw = spawnSync(spawnSpec.executable, spawnSpec.args, {
    cwd: options.cwd || root,
    encoding: options.encoding || 'utf8',
    input: options.input,
    maxBuffer: options.maxBuffer || 50 * 1024 * 1024,
    timeout: options.timeoutMs,
    stdio: options.stdio || 'pipe',
    env: { ...process.env, ...(options.env || {}) }
  });

  if (options.echo !== false) {
    if (raw.stdout) process.stdout.write(raw.stdout);
    if (raw.stderr) process.stderr.write(raw.stderr);
  }

  const result = normalizeResult(raw, command, resolved, args, options, startedAt, startedTime);
  printSummary('end', result, options);
  return result;
}

function runCommandLine(commandLine, args = [], options = {}) {
  return runCommand(commandLine, args, options);
}

module.exports = {
  classifyCommandFailure,
  hasCommand,
  redact,
  resolveCommand,
  runCommand,
  runCommandLine,
  writeDebugReport
};
