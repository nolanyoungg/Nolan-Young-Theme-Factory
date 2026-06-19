# Nolan Young Theme Factory - Agent Rules

This repo is a clean, template-first WordPress theme generator.

## Core Folders

```text
prompts/
wordpress-themplate-themes/
wp-content/themes/
dist/zipped-themes/
docs/
scripts/
```

The folder name `wordpress-themplate-themes` is intentionally spelled this way.

## Output Rules

Theme source belongs only in:

```text
wp-content/themes/NNN_nolan_young_theme_[description]/
```

ZIP files belong only in:

```text
dist/zipped-themes/NNN_nolan_young_theme_[description].zip
```

GitHub Pages previews belong only in:

```text
docs/Preview-Themes-Github/NNN_nolan_young_theme_[description]/
```

Do not put WordPress theme source in `docs/`.

## Strict Theme Generation Boundary

The prep script copies a selected template into `wp-content/themes/{slug}` before any AI generation pass starts.

During actual theme generation, AI may edit only:

```text
wp-content/themes/{slug}/
```

AI must not create the initial theme folder, copy templates, rename folders, generate previews, update docs, create ZIPs, edit scripts, edit prompts, or touch any file outside the prepared theme folder.

Codex usage is reserved for creative/code-heavy theme generation only. Deterministic setup, validation, preview indexing, and packaging must be handled by scripts.

## Validation

Validation is template-aware. A generated theme must contain every file from its selected template in the same relative path. Extra files are allowed.

Separate quality checks cover practical WordPress concerns: PHP syntax, required root files, secrets, CDN references, and bad repo-local paths.

## Workflow Contract

The shared workflow public entrypoint lives in `scripts/run-theme-workflow.js`, with the implementation under `scripts/workflow/`, and is driven by `config/workflow-modes.json` and `config/theme-factory.defaults.json`.

The supported first-class modes are:

* `ollama-only`
* `codex-only`
* `hybrid`

`bash scripts/theme-factory.sh run ...` and `node scripts/run-theme-workflow.js ...` are the primary entry points. Existing commands remain available for compatibility.

Run reports belong in `reports/runs/{theme_slug}/`. Do not store secrets there.
