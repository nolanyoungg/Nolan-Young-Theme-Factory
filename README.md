# Nolan Young Theme Factory

This repository is a template-first WordPress theme factory. It prepares a selected starter template, runs one selected AI generation mode, builds assets, validates the result, generates a static preview, packages a ZIP, and writes a run report.

The intended workflow is:

```text
copy template
-> run selected AI generation mode
-> build assets
-> source validate
-> generate preview
-> package ZIP
-> artifact validate
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

`ollama-only` runs one Ollama pass per planned batch and no Codex pass.

`codex-only` runs one Codex generation pass.

`hybrid` runs an Ollama draft followed by one Codex finish pass.

The prepare step can use the bundled template tree or a custom local template source path passed with `--template-source-path` or `THEME_TEMPLATE_SOURCE_PATH`.

The workflow does not run a validation-triggered cleanup pass and does not substitute a fallback model.

A planned generation stage is declared before generation starts and always belongs to the selected mode. A repair stage is triggered by a failed check and is prohibited.

Dry-run and run reports distinguish `planned_generation_operations` from provider invocations. `ollama-only` is one planned generation operation with one Ollama invocation per configured stage. `codex-only` is one planned operation with one Codex invocation. `hybrid` is two planned operations: all Ollama stages plus one Codex finish invocation.

## Production Prompt Contract

The primary planning fixture is `prompts/templates/NOLAN-YOUNG-PROMPT-6-19-2026.md`. The workflow parses every numbered `## NN.` section dynamically, including sections 14 and 15, and records subsections, feature headings, exact text, stable identifiers, and source line ranges. Ollama stages declare owned prompt sections, and coverage is written to `reports/runs/{theme_slug}/prompt-coverage.json`.

Each Ollama stage records a context-size manifest before provider invocation. If the configured prompt budget is exceeded, the stage fails before the model runs; requirements and current-file context are not truncated.

## Generated-Theme Boundary

During AI generation, only this folder may be edited:

```text
wp-content/themes/{theme_slug}/
```

The repository scripts handle template copying, builds, validation, preview generation, ZIP packaging, deletion, and reports. Generated themes are not rewritten by validation or infrastructure scripts to satisfy checks.

Model output is applied strictly: one documented file-block protocol, exact stage file allowlists, atomic writes, and no semantic source modification. Malformed output blocks the run rather than being salvaged.

Model output is applied transactionally. A complete candidate copy is created, returned files are applied to the candidate, stage checks run against the candidate, and the live theme is replaced only after checks pass. Failed candidates are preserved as evidence when configured, and the live theme remains at the last completed stage.

Codex runs with the prepared theme directory as its working directory using `codex exec --cd <theme-dir> --sandbox workspace-write --ephemeral`. The workflow snapshots the repository before and after Codex and blocks the run if anything outside the generated theme or run report changes.

Preview generation renders the actual generated PHP templates through a read-only harness into a temporary sibling directory. It replaces an existing preview only after all expected pages render without warnings. It does not substitute generic mock pages when rendering fails.

Validation has two phases. Source validation runs after build and does not require previews or ZIPs. Artifact validation runs after preview generation and packaging. `validation.final.json` combines the final state.

The starter template contains `assets/images/asset-manifest.json`. Models may select approved inventory assets or create original local SVG marks, icons, textures, and illustrations; they must not invent third-party photo provenance.

## Artifacts

Generated themes live in `wp-content/themes/`.

Static previews live in `docs/Preview-Themes-Github/`, and the gallery lives at `docs/index.html`.

ZIP files live in `dist/zipped-themes/`.

Run reports live in `reports/runs/{theme_slug}/`. Each workflow writes `run-timing.json` and `run-timing.md` with mode, requested and resolved model names, reasoning level when applicable, total duration, and per-step duration. Ollama runs also write `ollama-generation/ollama-stage-timing.json` with each local-model invocation duration.

Future ZIPs and run reports are ignored by default. Existing generated themes and public previews are preserved.
