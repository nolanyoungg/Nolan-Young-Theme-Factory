const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const jsSource = path.join(root, 'src/js/main.js');
const cssOutput = path.join(root, 'assets/css/bundle.css');
const jsOutput = path.join(root, 'assets/js/bundle.js');
const scssOrder = [
  'src/scss/base/_reset.scss',
  'src/scss/base/_typography.scss',
  'src/scss/base/_accessibility.scss',
  'src/scss/base/_forms.scss',
  'src/scss/base/_newsletter.scss',
  'src/scss/components/_buttons.scss',
  'src/scss/components/_cards.scss',
  'src/scss/components/_forms.scss',
  'src/scss/components/_badges.scss',
  'src/scss/components/_accordion.scss',
  'src/scss/components/_carousel.scss',
  'src/scss/components/_portfolio-filter.scss',
  'src/scss/components/_before-after.scss',
  'src/scss/layout/_container.scss',
  'src/scss/layout/_header.scss',
  'src/scss/layout/_footer.scss',
  'src/scss/layout/_grid.scss',
  'src/scss/layout/_sections.scss',
  'src/scss/pages/_homepage.scss',
  'src/scss/pages/_contact.scss',
  'src/scss/pages/_about-us.scss',
  'src/scss/pages/_services.scss',
  'src/scss/pages/_work.scss',
  'src/scss/pages/_blog.scss',
  'src/scss/pages/_policy.scss'
];

const minifyCss = (input) => input
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*@use .*?;$/gm, '')
  .replace(/^\s*@mixin[\s\S]*?}\s*$/gm, '')
  .replace(/^\s*@function[\s\S]*?}\s*$/gm, '')
  .replace(/^\s*\$[a-zA-Z0-9_-]+:[^;]+;$/gm, '')
  .replace(/^\s*@include .*?;$/gm, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();

const minifyJs = (input) => input
  .replace(/^\s*import .*?;\s*$/gm, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/.*$/gm, '')
  .replace(/\n+/g, '\n')
  .trim();

const build = () => {
  const css = scssOrder.map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  const js = fs.readFileSync(jsSource, 'utf8');
  fs.mkdirSync(path.dirname(cssOutput), { recursive: true });
  fs.mkdirSync(path.dirname(jsOutput), { recursive: true });
  fs.writeFileSync(cssOutput, minifyCss(css));
  fs.writeFileSync(jsOutput, minifyJs(js));
};

const mode = process.argv[2] || 'build';

build();

if (mode === 'dev') {
  console.log('Watching theme sources...');
  const watchPaths = ['src/js', 'src/scss'];
  watchPaths.forEach((dir) => {
    fs.watch(path.join(root, dir), { recursive: true }, build);
  });
  setInterval(() => {}, 1 << 30);
}
