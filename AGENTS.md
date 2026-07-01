# Nolan Young Theme Factory - Agent Policy

This repository is a template-first WordPress theme factory. Infrastructure work and generated-theme evaluation are separate jobs.

## Boundaries

Theme source belongs only in `wp-content/themes/NNN_nolan_young_theme_[description]/`.

ZIP files belong only in `dist/zipped-themes/NNN_nolan_young_theme_[description].zip`.

GitHub Pages previews belong only in `docs/Preview-Themes-Github/NNN_nolan_young_theme_[description]/`.

The folder name `wordpress-themplate-themes` is intentionally spelled this way.

## Generation Rules

The prep script copies the selected template into `wp-content/themes/{slug}` before AI generation starts.

During theme generation, the model may edit only `wp-content/themes/{slug}/`.

The model must not create the initial theme folder, copy templates, rename folders, generate previews, update docs, create ZIPs, edit scripts, edit prompts, or touch any file outside the prepared theme folder.

The repository agent must not modify generated themes to satisfy checks. Failed output is valid evaluation evidence and must be preserved.

## Mode Rules

`ollama-only` means Ollama generation only.

Ollama-only uses planned local-model stages. These stages are declared before generation starts and always run as part of the mode; prompt count is not repair.

Every Ollama stage must declare its prompt-section ownership. Missing production prompt coverage blocks the run before model invocation.

`codex-only` means one Codex generation pass.

There are only two generation modes: `ollama-only` and `codex-only`.

There is no hybrid mode, automatic model fallback, validation-triggered AI pass, build-triggered AI pass, or second AI cleanup pass.

A planned generation stage is declared before generation begins, owns a defined file allowlist, receives current theme context, and runs regardless of validation state.

A repair stage is triggered by a failed check or designed to make generated output pass after the fact. Repair stages are prohibited.

## Deterministic Work

Build, validation, preview generation, ZIP packaging, cleanup, and reports are deterministic post-generation work.

Validation is observational and read-only. Source validation runs before preview and ZIP creation. Artifact validation runs after preview and ZIP packaging. If a required template file is missing, validation reports it and does not copy it back.

Model output is applied without semantic modification. The application layer may parse the documented file-block protocol, enforce the stage allowlist, write complete files through a candidate transaction, and run observational candidate checks. It must not fix PHP, rewrite SCSS, invent fallback CSS, replace URLs, salvage malformed output, or keep old source when generated code is invalid.

Codex must run from the prepared theme directory with a writable sandbox and ephemeral execution. Repository snapshots around Codex are required to detect out-of-bound changes.

Preview generation renders actual generated theme templates through a read-only PHP harness. It may read generated themes and write only under `docs/Preview-Themes-Github/` and `docs/index.html`. Preview replacement must be transactional and must preserve an existing preview when candidate rendering fails.

Approved third-party image use must come from `assets/images/asset-manifest.json`. Models may create original local SVG marks, icons, textures, and illustrations, but must not invent provenance or describe illustrations as photographs.

Packaging must package from a temporary copy and must not modify generated theme source.

Run reports belong in `reports/runs/{theme_slug}/`. Do not store secrets there.

Failed generated output must be preserved. Improving a failed result means improving a future prompt and starting a fresh run, not changing the failed result in place.

## Public Commands

Use npm scripts as the public command layer:

```text
npm run theme:run
npm run theme:resume
npm run theme:prepare
npm run theme:validate
npm run theme:build
npm run theme:preview
npm run theme:preview:index
npm run theme:zip
npm run theme:delete
npm run theme:env
npm run theme:model-check
npm run test:scripts
```
