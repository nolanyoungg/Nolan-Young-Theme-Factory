const { spawnSync } = require('child_process');
const path = require('path');
const { root } = require('./repo-root');

function normalizeResult(result, command, args) {
  return {
    command,
    args,
    status: result.status ?? 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    error: result.error ? result.error.message : '',
    signal: result.signal || ''
  };
}

function resolveCommand(command) {
  if (process.platform === 'win32') {
    if (!/\.(cmd|exe|bat)$/i.test(command)) {
      const cmdProbe = spawnSync('where.exe', [`${command}.cmd`], { cwd: root, encoding: 'utf8' });
      if (cmdProbe.status === 0) {
        return (cmdProbe.stdout || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean)[0] || `${command}.cmd`;
      }
    }
    const probe = spawnSync('where.exe', [command], { cwd: root, encoding: 'utf8' });
    if (probe.status === 0) {
      return (probe.stdout || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean)[0] || command;
    }
  }

  return command;
}

function hasCommand(command) {
  const resolved = resolveCommand(command);
  const probe = process.platform === 'win32'
    ? spawnSync('where.exe', [command], { cwd: root, encoding: 'utf8', stdio: 'ignore' })
    : spawnSync('sh', ['-lc', `command -v ${JSON.stringify(command)}`], { cwd: root, encoding: 'utf8', stdio: 'ignore' });
  return probe.status === 0 || resolved !== command;
}

function quoteWindowsArg(value) {
  const text = String(value);
  if (/^[A-Za-z0-9_:=./\\-]+$/.test(text)) return text;
  return `"${text.replace(/"/g, '\\"')}"`;
}

function quotePosixArg(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function runCommand(command, args = [], options = {}) {
  const resolved = options.resolve === false ? command : resolveCommand(command);
  const useCmd = process.platform === 'win32' && /\.(cmd|bat)$/i.test(resolved);
  const executable = useCmd ? (process.env.ComSpec || 'cmd.exe') : resolved;
  const commandName = useCmd ? path.basename(resolved) : resolved;
  const commandArgs = useCmd ? ['/d', '/c', [quoteWindowsArg(commandName), ...args.map(quoteWindowsArg)].join(' ')] : args;
  const result = spawnSync(executable, commandArgs, {
    cwd: options.cwd || root,
    encoding: 'utf8',
    input: options.input,
    timeout: options.timeoutMs,
    stdio: options.stdio || 'pipe',
    env: { ...process.env, ...(options.env || {}) }
  });

  if (options.echo !== false) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }

  return normalizeResult(result, resolved, args);
}

function runCommandLine(commandLine, args = [], options = {}) {
  if (!commandLine) {
    return { command: '', args, status: 1, stdout: '', stderr: 'Missing command line.', error: '', signal: '' };
  }

  const renderedArgs = process.platform === 'win32'
    ? args.map(quoteWindowsArg)
    : args.map(quotePosixArg);
  const shellCommand = [commandLine, ...renderedArgs].join(' ');
  const executable = process.platform === 'win32' ? (process.env.ComSpec || 'cmd.exe') : '/bin/sh';
  const shellArgs = process.platform === 'win32'
    ? ['/d', '/c', shellCommand]
    : ['-lc', shellCommand];

  const result = spawnSync(executable, shellArgs, {
    cwd: options.cwd || root,
    encoding: 'utf8',
    input: options.input,
    timeout: options.timeoutMs,
    stdio: options.stdio || 'pipe',
    env: { ...process.env, ...(options.env || {}) }
  });

  if (options.echo !== false) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }

  return normalizeResult(result, commandLine, args);
}

module.exports = { hasCommand, resolveCommand, runCommand, runCommandLine };
