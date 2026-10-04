#!/usr/bin/env node
'use strict';
const { parseArgs } = require('./lib/cli/options');
async function dispatch(command, args) {
  if (['run', 'prepare', 'assets', 'resume', 'preview:index', 'convert:wordpress', 'wordpress:zip'].includes(command)) {
    return require('./lib/run-lock').withRunLock(() => route(command, args));
  }
  return route(command, args);
}
async function route(command, args) {
  if (command === 'convert:wordpress') return require('./lib/wordpress-converter').convert(args);
  if (command === 'wordpress:zip') return require('./lib/wordpress-converter').packageSelected(args);
  return require('./lib/static-workflow').dispatch(command, args);
}
if (require.main === module) {
  const [command = 'help', ...raw] = process.argv.slice(2);
  Promise.resolve().then(() => dispatch(command, parseArgs(raw))).catch(error => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { dispatch };
