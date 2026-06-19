# Scripts

This folder contains the deterministic tooling around theme generation. AI generation is allowed to edit only the prepared theme folder under `wp-content/themes/{theme_slug}/`; setup, validation, preview generation, gallery rebuilds, packaging, and reports stay in scripts.

## Public Entry Points

Use these commands first:

```bash
bash scripts/theme-factory.sh run <ollama-only|codex-only|hybrid> <prompt-file> [template-name] [ollama-model] [codex-model] [codex-reasoning]
node scripts/run-theme-workflow.js --mode <ollama-only|codex-only|hybrid> --prompt <prompt-file> --template <template-name>
```

`scripts/theme-factory.sh` is the command-user wrapper. `scripts/run-theme-workflow.js` is a compatibility wrapper that loads the implementation in `scripts/workflow/run-theme-workflow.js`.

## Folder Map

| Folder | Purpose |
| --- | --- |
| `ai-output/` | Applies model output file blocks into a prepared theme folder and rejects unsafe paths, malformed PHP, remote URLs, and invalid file payloads. |
| `briefs/` | Builds the shared theme generation brief from a prompt, selected mode, template source, and target theme slug. |
| `build/` | Installs theme-local Node dependencies when needed and builds `assets/css/bundle.css` and `assets/js/bundle.js` from the generated theme source. |
| `lib/` | Shared script helpers. `repo-root.js` locates the repository root after scripts were moved into subfolders and formats script paths for child processes. |
| `modes/` | Mode-specific AI workflow support grouped by generation strategy. |
| `modes/ollama-only/` | Runs the Ollama generation batches and the conditional Ollama repair pass used only when quality validation fails. |
| `modes/codex-only/` | Creates Codex build/finish briefs. The Theme 012 `codex-only` workflow depends on this prompt contract, so avoid changing it without a focused generation-quality test. |
| `modes/hybrid/` | Documents the hybrid path. Hybrid uses the Ollama draft scripts plus the Codex brief builder for the finish pass. |
| `packaging/` | Creates distributable theme ZIP files under `dist/zipped-themes/` while excluding transient folders and build logs. |
| `preview/` | Generates static previews from the completed WordPress theme, rebuilds the GitHub Pages gallery, and validates gallery coverage. |
| `templates/` | Copies a selected template into `wp-content/themes/{theme_slug}/`, updates deterministic metadata, and creates template manifests. |
| `validation/` | Runs template-aware validation, WordPress quality checks, preview/ZIP checks, and JSON validation reports. |
| `workflow/` | Contains the stage runner and smoke test for the complete factory workflow. |

## Mode Responsibilities

`ollama-only` prepares the theme, runs Ollama batches, validates, optionally runs the Ollama repair pass only if quality validation fails, builds assets, generates previews, rebuilds the gallery, packages the ZIP, and writes reports.

`codex-only` prepares the theme and creates the Codex build brief. Codex is responsible for the creative/code-heavy theme generation inside the prepared theme folder. The deterministic scripts then build, preview, package, and validate. This preserves the successful Theme 012 workflow shape.

`hybrid` prepares the theme, lets Ollama draft the implementation, validates the result, then creates a Codex finish brief for targeted polish. It should not add extra AI passes unless a validation failure proves they are necessary.

## Pass Policy

Do not add model passes as a default response to quality problems. Prefer stronger initial briefs, stricter deterministic validation, and better preview rendering first. The only automatic repair behavior currently allowed is the existing conditional Ollama quality repair pass, and it runs only after `theme-quality-check` fails in `ollama-only`.

## Direct Utility Commands

These commands are useful for focused checks:

```bash
bash scripts/templates/prepare-theme-from-template.sh prompts/pending/example.md NOLAN-YOUNG-theme-000
node scripts/briefs/create-theme-generation-brief.js 012_nolan_young_theme_master_template_prompt_filler_template_1 prompts/pending/example.md codex-only
bash scripts/validation/validate-theme-from-template.sh 012_nolan_young_theme_master_template_prompt_filler_template_1 NOLAN-YOUNG-theme-000
bash scripts/validation/theme-quality-check.sh 012_nolan_young_theme_master_template_prompt_filler_template_1
node scripts/build/build-theme-assets.js 012_nolan_young_theme_master_template_prompt_filler_template_1
node scripts/preview/generate-static-preview.js 012_nolan_young_theme_master_template_prompt_filler_template_1
bash scripts/packaging/package-theme.sh 012_nolan_young_theme_master_template_prompt_filler_template_1
bash scripts/validation/validate-generated-theme-all.sh 012_nolan_young_theme_master_template_prompt_filler_template_1 NOLAN-YOUNG-theme-000
```

Prefer `bash scripts/theme-factory.sh ...` for normal operation so path changes stay hidden behind the public wrapper.
