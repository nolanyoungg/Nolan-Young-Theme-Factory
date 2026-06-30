# Repo Structure

This document explains the current layout of the Nolan Young Theme Factory repo and what each top-level area is responsible for.

## Start Here

- [README.md](../README.md) gives the repo overview and the main workflow entry points.
- [AGENTS.md](../AGENTS.md) is the repository policy for agents.
- [scripts/README.md](../scripts/README.md) explains the script layer and workflow modes.

## Top-Level Map

- `.agents/` stores agent configuration and metadata used by local automation.
- `.github/` stores GitHub workflow and repository automation configuration.
- `config/` stores repo-level defaults consumed by workflow code.
- `prompts/` holds the prompt contract and prompt templates used for generation.
- `wordpress-themplate-themes/` holds the source templates that get copied before generation.
- `external-template-source/` is the active external template source for the current Ollama-only workflow.
- `wp-content/themes/` holds generated theme source for each theme slug.
- `docs/Preview-Themes-Github/` holds generated static previews for each theme slug.
- `docs/index.html` is the gallery page that lists published previews.
- `dist/zipped-themes/` holds packaged ZIP archives.
- `reports/runs/` holds run reports, timing files, validation output, and evidence artifacts.
- `scripts/` holds workflow code, validation code, preview code, packaging code, and tests.
- `reports/` holds run reports and other generated evidence artifacts.

## Artifact Boundaries

- Generated theme source belongs only in `wp-content/themes/{theme_slug}/`.
- GitHub Pages preview output belongs only in `docs/Preview-Themes-Github/{theme_slug}/`.
- ZIP files belong only in `dist/zipped-themes/{theme_slug}.zip`.
- Run reports belong only in `reports/runs/{theme_slug}/`.

## Workflow Files

- `scripts/run-theme-workflow.js` orchestrates the end-to-end mode flow.
- `scripts/prepare-theme.js` copies the selected template into a generated theme folder.
- `scripts/build-theme.js` builds deterministic assets.
- `scripts/validate-theme.js` runs source and artifact validation.
- `scripts/preview-theme.js` renders the preview site.
- `scripts/package-theme.js` creates the ZIP archive.
- `scripts/delete-theme.js` removes a generated theme and its disposable artifacts.
- `scripts/tests/smoke.js` guards the workflow contract with repo-level smoke coverage.

The public npm commands are the supported interface; examples should use placeholders instead of pinning a single theme slug in repo docs.
## Policy Files

- `AGENTS.md` is the canonical agent policy for generation boundaries, mode rules, and artifact rules.
- `README.md` is the human-oriented repo entry point.

## Maintenance Rule

If a future change creates a new top-level directory or changes where an artifact lives, update this file at the same time so the repo map stays accurate.
