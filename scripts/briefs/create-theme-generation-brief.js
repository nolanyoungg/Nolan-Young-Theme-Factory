#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('../shared/repo-root');

const [slug, promptFileArg, mode = 'codex-only'] = process.argv.slice(2);
if (!slug || !promptFileArg) {
  console.error('Usage: node scripts/briefs/create-theme-generation-brief.js <theme-slug> <prompt-file> [mode]');
  process.exit(1);
}

const themeDir = path.join(root, 'wp-content', 'themes', slug);
const promptFile = path.resolve(root, promptFileArg);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(slug)) fail(`Invalid theme slug: ${slug}`);
if (!fs.existsSync(themeDir)) fail(`Prepared theme folder does not exist: wp-content/themes/${slug}`);
if (!fs.existsSync(promptFile)) fail(`Prompt file does not exist: ${promptFileArg}`);

const source = path.join(themeDir, '.theme-template-source');
const templateSource = fs.existsSync(source) ? fs.readFileSync(source, 'utf8').trim() : 'template=unknown';
const prompt = fs.readFileSync(promptFile, 'utf8').trim();
const relTheme = `wp-content/themes/${slug}`;
const briefPath = path.join(root, 'reports', 'runs', slug, 'ollama-generation', 'theme-generation-brief.md');

const brief = `# Theme Generation Brief

Mode: ${mode}
Target folder: ${relTheme}
${templateSource}

## Absolute Boundary

You must edit only files inside:

\`\`\`text
${relTheme}/
\`\`\`

Do not create, modify, delete, rename, or move any file outside that folder.

Do not create the initial theme folder, copy templates, rename folders, generate previews, update docs, package ZIP files, update dist, edit scripts, edit prompts, or edit repo-wide files.

Inside \`${relTheme}/\`, fully code and fill the theme. Replace Lorem ipsum, add local images/SVGs/logos, improve PHP/CSS/JS, add extra files if needed, and preserve every file from the selected template.

Use local assets only. Do not use CDN dependencies. Do not add secrets or credentials. Keep WordPress PHP valid and paths portable.

## Preview Contract

The static preview step is read-only. It must render the completed theme as-is and must never require manual edits to the generated theme source.

That means the theme itself must already satisfy these requirements:

- template-parts files are fragments only and never include get_header(), get_footer(), or document wrappers
- header.php and footer.php are complete document wrappers
- any referenced local image or icon path exists inside the theme, or is replaced with a local placeholder asset
- homepage and section templates contain finished copy, not placeholder shells

## Creative Prompt

${prompt}
`;

fs.mkdirSync(path.dirname(briefPath), { recursive: true });
fs.writeFileSync(briefPath, brief, 'utf8');
console.log(path.relative(root, briefPath).replace(/\\/g, '/'));
