const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outCss = path.join(root, 'assets/css/bundle.css');
const outJs = path.join(root, 'assets/js/bundle.js');
const scssEntry = path.join(root, 'src/scss/main.scss');
const jsEntry = path.join(root, 'src/js/main.js');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function minifyJs(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

function compileCss() {
  const lines = read(scssEntry).split(/\r?\n/);
  const imports = lines
    .map((line) => line.match(/@use\s+"([^"]+)"/))
    .filter(Boolean)
    .map((match) => match[1]);

  const pieces = [];
  for (const importName of imports) {
    const candidatePaths = [
      path.join(root, 'src/scss', `${importName}.scss`),
      path.join(root, 'src/scss', `${importName}.css`),
    ];
    const parts = importName.split('/');
    const last = parts.pop();
    candidatePaths.push(path.join(root, 'src/scss', ...parts, `_${last}.scss`));
    candidatePaths.push(path.join(root, 'src/scss', ...parts, `_${last}.css`));
    const filePath = candidatePaths.find((candidate) => fs.existsSync(candidate));
    if (!filePath) {
      continue;
    }
    const source = read(filePath);
    if (/@mixin|@function/.test(source)) {
      continue;
    }
    const raw = source
      .split(/\r?\n/)
      .filter((line) => !line.trim().startsWith('@use '))
      .filter((line) => !line.trim().startsWith('$'))
      .join('\n');
    pieces.push(raw);
  }

  return pieces.join('\n\n');
}

function build(mode) {
  const css = compileCss();
  const js = read(jsEntry);
  ensureDir(outCss);
  ensureDir(outJs);
  fs.writeFileSync(outCss, mode === 'production' ? minifyCss(css) : css);
  fs.writeFileSync(outJs, mode === 'production' ? minifyJs(js) : js);
  console.log(`Built ${path.relative(root, outCss)} and ${path.relative(root, outJs)} in ${mode} mode.`);
}

function watch() {
  const rebuild = () => build('development');
  rebuild();
  const sources = [scssEntry, jsEntry];
  const watchDirs = [
    path.join(root, 'src/scss'),
    path.join(root, 'src/js'),
  ];
  for (const dir of watchDirs) {
    fs.watch(dir, { recursive: true }, () => {
      rebuild();
    });
  }
  console.log('Watching theme source files...');
}

if (process.argv.includes('--watch')) {
  watch();
} else {
  build(process.env.NODE_ENV === 'production' ? 'production' : 'production');
}
