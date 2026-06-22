# Nolan Young Theme Factory

This repository is a template-first WordPress theme factory. It prepares a selected starter template, runs one selected AI generation mode, builds assets, validates the result, generates a static preview, packages a ZIP, and writes a run report.

The intended workflow is:

```text
copy template
-> run selected AI generation mode
-> build assets
-> validate
-> generate preview
-> package ZIP
-> report results
```

## Repository Layout

```text
prompts/
wordpress-themplate-themes/
wp-content/themes/
dist/zipped-themes/
docs/
scripts/
config/
reports/
```

The folder name `wordpress-themplate-themes` is intentionally spelled this way.

## Public Commands

```sh
npm run theme:run -- --mode codex-only --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --codex-model gpt-5.5 --codex-reasoning low
npm run theme:prepare -- --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000
npm run theme:validate -- --theme-slug 001_nolan_young_theme_example
npm run theme:build -- --theme-slug 001_nolan_young_theme_example
npm run theme:preview -- --theme-slug 001_nolan_young_theme_example
npm run theme:preview:index
npm run theme:zip -- --theme-slug 001_nolan_young_theme_example
npm run theme:delete -- --theme-slug 001_nolan_young_theme_example --dry-run
npm run theme:env
npm run theme:model-check -- --provider codex --codex-model gpt-5.5 --codex-reasoning high
npm run test:scripts
```

## Workflow Modes

`ollama-only` runs Ollama generation batches and no Codex pass.

`codex-only` runs one Codex generation pass.

`hybrid` runs an Ollama draft followed by one Codex finish pass.

The workflow does not run a second AI cleanup pass and does not substitute a fallback model.

## Generated-Theme Boundary

During AI generation, only this folder may be edited:

```text
wp-content/themes/{theme_slug}/
```

The repository scripts handle template copying, builds, validation, preview generation, ZIP packaging, deletion, and reports. Generated themes are not rewritten by validation or infrastructure scripts to satisfy checks.

## Artifacts

Generated themes live in `wp-content/themes/`.

Static previews live in `docs/Preview-Themes-Github/`, and the gallery lives at `docs/index.html`.

ZIP files live in `dist/zipped-themes/`.

Run reports live in `reports/runs/{theme_slug}/`.

Future ZIPs and run reports are ignored by default. Existing generated themes and public previews are preserved.
