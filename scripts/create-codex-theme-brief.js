#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const [mode, themeSlug, templateName, promptFile, generationBriefPath, manifestPath, validationPath, codexModel, reasoning, outputPath] = process.argv.slice(2);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!mode || !themeSlug || !templateName || !promptFile || !generationBriefPath || !manifestPath || !validationPath || !codexModel || !reasoning || !outputPath) {
  fail('Usage: node scripts/create-codex-theme-brief.js <mode> <theme-slug> <template-name> <prompt-file> <generation-brief-path> <manifest-path> <validation-path> <codex-model> <reasoning> <output-md>');
}

const themeDir = `wp-content/themes/${themeSlug}`;
const brief = `# Codex Theme Brief

Mode: ${mode}
Theme slug: ${themeSlug}
Theme directory: ${themeDir}
Selected template: ${templateName}
Original prompt: ${promptFile}
Generation brief: ${generationBriefPath}
Template manifest: ${manifestPath}
Validation report: ${validationPath}
Requested Codex model: ${codexModel}
Requested reasoning level: ${reasoning}

## Edit Boundary

Work only inside:

\`\`\`text
${themeDir}/
\`\`\`

Do not package the ZIP, rebuild the gallery, move the theme, or edit unrelated repo files.

## Required Checks

- Preserve the selected template structure.
- Fix PHP, CSS, JS, content, accessibility, and integration issues relevant to the current validation report.
- Keep local assets and portable paths.
- Remove secrets, CDN dependencies, and repo-local preview or dist paths from the theme.
- Leave the theme ready for scripted validation and finalization.
`;

const resolved = path.isAbsolute(outputPath) ? outputPath : path.join(root, outputPath);
fs.mkdirSync(path.dirname(resolved), { recursive: true });
fs.writeFileSync(resolved, brief, 'utf8');
console.log(path.relative(root, resolved).replace(/\\/g, '/'));
