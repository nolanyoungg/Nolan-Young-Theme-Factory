import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const themeRoot = fileURLToPath(new URL('..', import.meta.url));
const cssParts = [
  'src/scss/main.scss',
  'src/scss/abstracts/_variables.scss',
  'src/scss/abstracts/_functions.scss',
  'src/scss/abstracts/_mixins.scss',
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
  'src/scss/pages/_policy.scss',
];

const cssOutput = path.join(themeRoot, 'assets/css/bundle.css');
const jsOutput = path.join(themeRoot, 'assets/js/bundle.js');

const css = cssParts
  .map((relativePath) => {
    const filePath = path.join(themeRoot, relativePath);
    return `/* ${relativePath} */\n${fs.readFileSync(filePath, 'utf8').trim()}\n`;
  })
  .join('\n');

fs.mkdirSync(path.dirname(cssOutput), { recursive: true });
fs.mkdirSync(path.dirname(jsOutput), { recursive: true });

fs.writeFileSync(
  cssOutput,
  `${css}\n/* End of generated bundle for Nolan Showcase Theme 06 */\n`
);

const js = fs.readFileSync(path.join(themeRoot, 'src/js/main.js'), 'utf8');
fs.writeFileSync(
  jsOutput,
  `/*! Nolan Showcase Theme 06 */\n${js.trim()}\n`
);

console.log(`Built ${cssOutput}`);
console.log(`Built ${jsOutput}`);

