# AI Workflow

This repo uses one shared stage-based workflow for three modes:

* `ollama-only`
* `codex-only`
* `hybrid`

The workflow is template-first. A template is copied into `wp-content/themes/NNN_nolan_young_theme_[description]/` before any AI generation starts.

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

```bash
node scripts/run-theme-workflow.js --mode ollama-only --prompt prompts/pending/000-testing.md --template NOLAN-YOUNG-theme-000 --ollama-model qwen2.5-coder:14b
```

### `codex-only`

Scripts prepare the theme and generate Codex brief artifacts. The workflow records the Codex step honestly and resumes when Codex is available.

Example:

```bash
node scripts/run-theme-workflow.js --mode codex-only --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --codex-model gpt-5.4 --codex-reasoning medium
```

### `hybrid`

Scripts prepare the theme, Ollama drafts it, scripts validate, then Codex receives a focused finishing brief. The workflow can resume after Codex finishes.

Example:

```bash
node scripts/run-theme-workflow.js --mode hybrid --prompt prompts/pending/000-testing.md --template NOLAN-YOUNG-theme-000 --ollama-model qwen2.5-coder:14b --codex-model gpt-5.4 --codex-reasoning medium
```

## Dry Run

```bash
node scripts/run-theme-workflow.js --mode hybrid --prompt prompts/pending/000-testing.md --template NOLAN-YOUNG-theme-000 --dry-run
```

Dry run prints the resolved stage plan and output paths without mutating the repo.

## Resume

```bash
bash scripts/theme-factory.sh resume 001_nolan_young_theme_premium_landscape_design_company
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

* theme assets are built with `bash scripts/build-theme-assets.sh {theme_slug}`
* static preview is written to `docs/Preview-Themes-Github/{theme_slug}/`
* the gallery is rebuilt in `docs/index.html`
* the ZIP is written to `dist/zipped-themes/{theme_slug}.zip`

## Repair

If a run fails, inspect:

* `reports/runs/{theme_slug}/errors.log`
* `reports/runs/{theme_slug}/validation.before-finish.json`
* `reports/runs/{theme_slug}/validation.final.json`

Then resume or rerun the workflow with the same prompt and template.
