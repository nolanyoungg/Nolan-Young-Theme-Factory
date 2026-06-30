# Nolan Young Theme Factory

This repo is a template-first WordPress theme factory.

It is organized around one rule: source generation, preview generation, packaging, and evaluation are separate jobs and should not blur together.

## What Lives Where

- `prompts/` holds the production prompt contract and prompt templates.
- `wordpress-themplate-themes/` holds the starter templates that get copied before generation.
- `wp-content/themes/{theme_slug}/` holds the generated theme source for an active run.
- `docs/Preview-Themes-Github/{theme_slug}/` holds the static GitHub Pages preview for that theme.
- `docs/index.html` is the preview gallery that links all published previews.
- `dist/zipped-themes/{theme_slug}.zip` holds packaged theme archives.
- `reports/runs/{theme_slug}/` holds run logs, validation output, timing data, and other evidence.
- `scripts/` holds the workflow, validation, preview, packaging, and test code.
- `external-template-source/` is the active external template source used for the current Ollama-only workflow.

The folder name `wordpress-themplate-themes` is intentionally spelled that way.

## Current Workflow

The current generation flow is:

```text
copy template
-> run selected AI generation mode
-> build assets
-> source validate
-> generate preview
-> package ZIP
-> artifact validate
-> write run report
```

Generated themes are not patched in place to hide failures. If a run is bad, the bad artifacts should be removed and the pipeline or template should be improved.

## Public Commands

Use the npm script layer for all normal work:

```sh
npm run theme:run -- --mode ollama-only --prompt prompts/templates/NOLAN-YOUNG-PROMPT-6-19-2026.md --template nolan-young-theme-template-01 --template-source-path external-template-source --theme-slug 005_nolan_young_theme_mobile_detail --ollama-model qwen2.5-coder:14b
npm run theme:resume -- --theme-slug 005_nolan_young_theme_mobile_detail
npm run theme:prepare -- --prompt prompts/templates/NOLAN-YOUNG-PROMPT-6-19-2026.md --template nolan-young-theme-template-01
npm run theme:validate -- --theme-slug 005_nolan_young_theme_mobile_detail
npm run theme:build -- --theme-slug 005_nolan_young_theme_mobile_detail
npm run theme:preview -- --theme-slug 005_nolan_young_theme_mobile_detail
npm run theme:preview:index
npm run theme:zip -- --theme-slug 005_nolan_young_theme_mobile_detail
npm run theme:delete -- --theme-slug 005_nolan_young_theme_mobile_detail --yes
npm run theme:env
npm run theme:model-check -- --provider ollama --ollama-model qwen2.5-coder:14b
npm run test:scripts
```

## Workflow Modes

- `ollama-only` runs the planned Ollama stages only.
- `codex-only` runs one Codex generation pass.
- `hybrid` runs an Ollama draft followed by one Codex finish pass.

Ollama-only runs should stay within the repo policy limits for stage count and file ownership. The stage planner and validation code are the source of truth for those limits.

## Validation And Evidence

Validation is observational.

- Source validation runs before preview generation.
- Artifact validation runs after preview generation and packaging.
- Run reports record timing, model selection, and per-step durations.
- Failed candidates are evidence, not something to repair in place.

## Preview Expectations

The preview should reflect the generated theme source as rendered by the preview harness.

Required preview pages:

- `index.html`
- `homepage_preview.html`
- `about-us_preview.html`
- `services_preview.html`
- `work_preview.html`
- `blog_preview.html`
- `contact_preview.html`
- `policy_preview.html`
- `single_services_preview.html`

## Repo Maintenance Notes

- Keep the top-level docs concrete and current.
- Keep repo policy in `AGENTS.md`.
- See `docs/REPO-STRUCTURE.md` for the directory and artifact map.
- See `scripts/README.md` for the workflow and script-layer contract.
- Keep workflow changes reusable and deterministic.
- Keep generated themes, previews, ZIPs, and reports separated by path.
