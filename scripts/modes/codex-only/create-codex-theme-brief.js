#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { root } = require('../../shared/repo-root');

const [mode, themeSlug, templateName, promptFile, generationBriefPath, manifestPath, validationPath, codexModel, reasoning, outputPath] = process.argv.slice(2);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!mode || !themeSlug || !templateName || !promptFile || !generationBriefPath || !manifestPath || !validationPath || !codexModel || !reasoning || !outputPath) {
  fail('Usage: node scripts/modes/codex-only/create-codex-theme-brief.js <mode> <theme-slug> <template-name> <prompt-file> <generation-brief-path> <manifest-path> <validation-path> <codex-model> <reasoning> <output-md>');
}

function resolveRepoPath(file) {
  return path.isAbsolute(file) ? file : path.join(root, file);
}

function readText(file) {
  const resolved = resolveRepoPath(file);
  return fs.existsSync(resolved) ? fs.readFileSync(resolved, 'utf8').trim() : '';
}

function readGenerationBrief(pointerFile) {
  const pointerText = readText(pointerFile);
  const referenced = pointerText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)[0] || '';
  if (referenced && fs.existsSync(resolveRepoPath(referenced))) {
    return {
      path: referenced,
      content: readText(referenced)
    };
  }
  return {
    path: generationBriefPath,
    content: pointerText
  };
}

const themeDir = `wp-content/themes/${themeSlug}`;
const outputName = path.basename(outputPath).toLowerCase();
const passType = outputName.includes('build') ? 'build' : outputName.includes('repair') ? 'repair' : 'finish';
const selectedPrompt = readText(promptFile);
const generationBrief = readGenerationBrief(generationBriefPath);
const validationReport = readText(validationPath);

const passInstructions = {
  build: `## Codex-Only Build Pass

This is a full Codex-only theme generation pass.

You must:

- Inspect the prepared theme folder before editing.
- Work inside the prepared theme folder only.
- Implement the requested website theme completely.
- Replace all starter, Lorem ipsum, placeholder, TODO, and future-editor copy.
- Preserve every required file from the selected template.
- Add useful files only inside the generated theme folder.
- Build the requested website theme from the selected prompt.
- Use local assets, inline SVG, CSS interface graphics, and portable WordPress paths.
- Keep PHP, CSS, JavaScript, content, responsive behavior, forms, and accessibility coherent.
- Put authored styling in src/scss/main.scss and related source SCSS files, not only in assets/css/bundle.css.
- Keep src/js/main.js useful and compatible with the asset build.
- Do not package the ZIP.
- Do not rebuild the gallery.
- Do not move the generated theme.
- Do not add secrets, external API credentials, CDN dependencies, remote images, or machine-specific paths.
- Leave the theme ready for scripted validation, preview generation, gallery rebuild, and packaging.`,
  finish: `## Hybrid Finish Pass

This is a finish pass over an existing Ollama-generated theme.

You must:

- Inspect the current implementation before editing.
- Polish and repair the existing result; do not restart from scratch unless the current theme is unrecoverable and you document why.
- Preserve good work already completed.
- Fix PHP, CSS, JavaScript, content, design, accessibility, responsiveness, and integration issues.
- Put authored styling in src/scss/main.scss and related source SCSS files, not only in assets/css/bundle.css.
- Keep src/js/main.js useful and compatible with the asset build.
- Resolve relevant validation failures from the validation report.
- Preserve every required file from the selected template.
- If fixing styling, update src/scss/main.scss or source partials so npm run build reproduces the finished CSS.
- Do not rely on hand-editing assets/css/bundle.css without updating source SCSS.
- Keep edits focused inside the generated theme folder.
- Do not package the ZIP, rebuild the gallery, move the generated theme, or edit unrelated repo files.
- Do not add secrets, external API credentials, CDN dependencies, remote images, or machine-specific paths.
- Leave the theme ready for scripted final validation and packaging.`,
  repair: `## Validation Repair Pass

This is a targeted repair pass.

You must:

- Fix only the reported validation failures.
- Avoid unrelated redesign.
- Make the smallest complete changes that satisfy validation and prompt intent.
- Preserve every required file from the selected template.
- Keep edits focused inside the generated theme folder.
- Do not package the ZIP or rebuild the gallery.
- Document the relevant checks to rerun.`
}[passType];

const brief = `# Codex Theme Brief

Mode: ${mode}
Pass type: ${passType}
Theme slug: ${themeSlug}
Theme directory: ${themeDir}
Selected template: ${templateName}
Original prompt: ${promptFile}
Generation brief: ${generationBrief.path}
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

${passInstructions}

## Required Checks

- Preserve the selected template structure.
- Fix PHP, CSS, JS, content, accessibility, and integration issues relevant to the current validation report.
- Ensure npm run build can regenerate the final CSS and JS from source files.
- Do not leave source SCSS weaker than the compiled CSS.
- Keep local assets and portable paths.
- Remove secrets, CDN dependencies, and repo-local preview or dist paths from the theme.
- Remove all Lorem ipsum, placeholder, TODO, FIXME, "Add ... here", and future-editor copy.
- Use the selected prompt as the authoritative creative brief.
- Leave the theme ready for scripted validation and finalization.

## Selected Creative Prompt

${selectedPrompt || '(Prompt file could not be read.)'}

## Generated Theme Brief

${generationBrief.content || '(Generation brief could not be read.)'}

## Current Validation Report

${validationReport || '(Validation report is not available yet.)'}

## Completion Expectation

When finished, report what you changed and which checks you ran. Do not claim preview generation, gallery rebuild, or ZIP packaging is complete unless you actually ran those scripts.
`;

const resolved = path.isAbsolute(outputPath) ? outputPath : path.join(root, outputPath);
fs.mkdirSync(path.dirname(resolved), { recursive: true });
fs.writeFileSync(resolved, brief, 'utf8');
console.log(path.relative(root, resolved).replace(/\\/g, '/'));
