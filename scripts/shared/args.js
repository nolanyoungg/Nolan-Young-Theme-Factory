function parseArgs(argv) {
  const args = { _: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith('--')) {
      args._.push(item);
      continue;
    }

    const eq = item.indexOf('=');
    if (eq !== -1) {
      args[item.slice(2, eq)] = item.slice(eq + 1);
      continue;
    }

    const key = item.slice(2);
    const next = argv[index + 1];
    if (next !== undefined && !next.startsWith('--')) {
      args[key] = next;
      index += 1;
    } else {
      args[key] = true;
    }
  }

  return args;
}

function arg(args, names, fallback = '') {
  for (const name of Array.isArray(names) ? names : [names]) {
    if (args[name] !== undefined && args[name] !== true) return args[name];
  }
  return fallback;
}

function flag(args, name) {
  return args[name] === true || args[name] === 'true' || args[name] === '1';
}

module.exports = { parseArgs, arg, flag };
