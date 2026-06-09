# Nolan Young Theme Factory

This repository is a controlled factory for generating installable classic WordPress themes from prompt files in `prompts/pending/`.

It supports three modes:

1. Hybrid: Ollama draft stages, then one Codex final pass.
2. Codex only: Codex handles the full generation.
3. Ollama only: local Ollama stages only, with no Codex invocation.

## Core Outputs

Each generated theme run should produce:

- `wp-content/themes/NNN_nolan_young_theme_description/`
- `docs/themes/NNN_nolan_young_theme_description/`
- `dist/zipped-themes/NNN_nolan_young_theme_description.zip`
- `reports/runs/NNN_nolan_young_theme_description/`

The next slug is determined across:

- `wp-content/themes/`
- `docs/themes/`
- `dist/zipped-themes/`
- `reports/runs/`

## Workflow Scripts

- `bash scripts/run-hybrid-theme-workflow.sh`
- `bash scripts/run-hybrid-theme-workflow.sh codex-only`
- `bash scripts/run-hybrid-theme-workflow.sh ollama-only`
- `powershell.exe -File scripts/run-hybrid-theme-workflow.ps1`

Legacy compatibility still works:

- `bash scripts/run-theme-workflow.sh`

## Environment Variables

- `THEME_FACTORY_MODE`: `hybrid`, `codex-only`, or `ollama-only`
- `THEME_PROMPT_FILE`: path to the prompt file in `prompts/pending/`
- `OLLAMA_MODEL`: required for Ollama modes; for example `qwen2.5-coder:14b`
- `CODEX_COMMAND`: full Codex command prefix, for example `codex` or `codex --model gpt-5.5 --reasoning high`
- `THEME_SLUG`: override the next versioned slug if you need to target a specific generated run

## Ollama-Only Example

```bash
THEME_FACTORY_MODE=ollama-only \
THEME_PROMPT_FILE=prompts/pending/web-dev-company-local-ollama-theme.txt \
OLLAMA_MODEL=qwen2.5-coder:14b \
bash scripts/run-hybrid-theme-workflow.sh
```

## Validation

Run validation for a generated theme with:

```bash
bash scripts/validate-all.sh 001_nolan_young_theme_northstar_web_works
```

If you omit the slug, the validator scans all generated themes. If none exist, it reports that fact and exits cleanly.

## Packaging

Package a theme ZIP with:

```bash
bash scripts/package-theme.sh 001_nolan_young_theme_northstar_web_works
```

The package script keeps the ZIP in `dist/zipped-themes/` and includes the theme folder itself.

## Preview Gallery

The gallery is served from `docs/index.html`. Each generated preview must be linked there and use only local assets.


