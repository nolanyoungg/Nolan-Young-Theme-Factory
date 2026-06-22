const fs = require('fs');
const path = require('path');

function findRepoRoot(startDir = __dirname) {
  let current = path.resolve(startDir);

  while (current !== path.dirname(current)) {
    if (
      fs.existsSync(path.join(current, 'config', 'theme-factory.defaults.json')) &&
      fs.existsSync(path.join(current, 'wordpress-themplate-themes'))
    ) {
      return current;
    }

    current = path.dirname(current);
  }

  throw new Error('Could not locate Nolan Young Theme Factory repository root.');
}

const root = findRepoRoot();

function scriptPath(...segments) {
  return path.join('scripts', ...segments).replace(/\\/g, '/');
}

module.exports = { findRepoRoot, root, scriptPath };
