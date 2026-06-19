# AI Workflow

This repo uses one shared stage-based workflow for three modes:

* `ollama-only`
* `codex-only`
* `hybrid`

The workflow is template-first. A template is copied into `wp-content/themes/NNN_nolan_young_theme_[description]/` before any AI generation starts.

Script layout is documented in `scripts/README.md`. Normal operation should go through `npm run ...` commands backed by `scripts/run-theme-workflow.js`.

## Shared Stages

The runner resolves stages from `config/workflow-modes.json` and defaults from `config/theme-factory.defaults.json`.

Common stages:

* `prepare_theme`
* `create_generation_brief`
* `create_template_manifest`
* `ollama_generation_pass`
* `codex_generation_pass`
* `validate_before_finish`
* `codex_finish_pass`
* `build_theme_assets`
* `generate_preview`
* `rebuild_preview_gallery`
* `package_theme`
* `final_validate`
* `write_run_summary`

## Mode Summary

### `ollama-only`

Scripts prepare the theme, Ollama generates inside the prepared folder, scripts validate, build theme assets, build previews, rebuild the gallery, package the ZIP, and write the run summary.

Example:

```sh
npm run theme:run -- --mode ollama-only --prompt prompts/pending/000-testing.md --template NOLAN-YOUNG-theme-000 --ollama-model qwen2.5-coder:14b
```

### `codex-only`

Scripts prepare the theme and generate Codex brief artifacts. The workflow records the Codex step honestly and resumes when Codex is available.
The normal Codex-only workflow uses one Codex build invocation, preserving the Theme 012 prompt contract, followed by deterministic finalization.

Example:

```sh
npm run theme:run -- --mode codex-only --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --codex-model gpt-5.4 --codex-reasoning medium
```

The prompt path is only an example. Use the prompt file you want to generate from.

### `hybrid`

Scripts prepare the theme, Ollama drafts it, scripts validate, then Codex receives a focused finishing brief. The workflow can resume after Codex finishes.
Hybrid validates both providers before generation begins and does not downgrade to a single-provider run if either check fails.

Example:

```sh
npm run theme:run -- --mode hybrid --prompt prompts/pending/000-testing.md --template NOLAN-YOUNG-theme-000 --ollama-model qwen2.5-coder:14b --codex-model gpt-5.4 --codex-reasoning medium
```

## Dry Run

```sh
npm run theme:run -- --mode hybrid --prompt prompts/pending/000-testing.md --template NOLAN-YOUNG-theme-000 --dry-run
```

Dry run prints the resolved stage plan and output paths without mutating the repo.
It does not copy templates, write run state, create previews or ZIPs, install dependencies, or invoke live AI providers.

## Model Checks

```sh
npm run theme:model-check -- --provider ollama --ollama-model qwen2.5-coder:14b
npm run theme:model-check -- --provider codex --codex-model gpt-5.5 --codex-reasoning high
npm run theme:model-check -- --provider hybrid --ollama-model qwen2.5-coder:14b --codex-model gpt-5.5 --codex-reasoning high
```

Model names and reasoning levels must be exact. The workflow records requested and resolved values in `run.config.json`, `workflow.state.json`, and `workflow.summary.md`; it does not fall back to another model after a failure.

## Resume

```sh
npm run theme:resume -- --theme-slug 001_nolan_young_theme_example
```

Use resume after a Codex pending state has been written to the run report.

## Run Reports

Each run writes artifacts under:

```text
reports/runs/{theme_slug}/
```

Key files:

* `run.config.json`
* `workflow.state.json`
* `template.manifest.json`
* `validation.before-finish.json`
* `validation.final.json`
* `workflow.summary.md`

## Finalization

After generation and validation:

* theme assets are built by the workflow with `node scripts/build/build-theme-assets.js --theme-slug {theme_slug}`
* the build wrapper installs theme-local dependencies if needed and runs `npm run build` inside the generated theme folder
* static preview is written to `docs/Preview-Themes-Github/{theme_slug}/`
* the gallery is rebuilt in `docs/index.html`
* the ZIP is written to `dist/zipped-themes/{theme_slug}.zip`

## Repair

If a run fails, inspect:

* `reports/runs/{theme_slug}/errors.log`
* `reports/runs/{theme_slug}/validation.before-finish.json`
* `reports/runs/{theme_slug}/validation.final.json`

Then resume or rerun the workflow with the same prompt and template.
