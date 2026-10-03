'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// Invoke npm's JavaScript entry point directly: Windows .cmd files are not executables.
function runNpm(args, options = {}) {
  const cli = [process.env.npm_execpath, path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js')]
    .find((file) => file && /npm-cli\.js$/i.test(file) && fs.existsSync(file));
  if (cli) return spawnSync(process.execPath, [cli, ...args], options);
  if (process.platform === 'win32') throw new Error('Run the factory through npm run so its npm CLI path is available.');
  return spawnSync('npm', args, options);
}

module.exports = { runNpm };
