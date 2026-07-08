# Theme Factory Scripts

Use the npm script layer from the repository root. The script implementation lives in `scripts/theme-factory.js`.

## Main Flow

```sh
npm run theme:run -- --mode codex-only --prompt prompts/pending/000-testing.md
npm run theme:run -- --mode ollama-only --prompt prompts/pending/000-testing.md --ollama-model llama3.1:8b
npm run theme:run -- --mode lmstudio-only --prompt prompts/pending/000-testing.md --lmstudio-model qwen/qwen2.5-coder-14b
```

`theme:run` performs:

```text
prepare copied theme
-> one selected AI generation mode
-> npm build inside the copied theme
-> source validation
-> preview generation
-> ZIP packaging
-> artifact validation
-> run report
```

There are only three modes: `codex-only`, `ollama-only`, and `lmstudio-only`.

LM Studio mode uses the OpenAI-compatible server exposed by the LM Studio desktop app, `lms`, or `llmster`. The default base URL is `http://127.0.0.1:1234/v1`; override it with `--lmstudio-base-url` or `LMSTUDIO_BASE_URL`.

## File-Block Protocol For Local Models

Ollama and LM Studio stages must return complete files using this exact protocol:

```text
---FILE: relative/path/from/theme/root.php---
complete file content
---END FILE---
```

The runner applies only files allowed by the declared stage allowlist. Paths outside the prepared theme are rejected.

## Useful Commands

```sh
npm run theme:prepare -- --prompt prompts/pending/000-testing.md
npm run theme:build -- --theme-slug 001_nolan_young_theme_example
npm run theme:validate -- --theme-slug 001_nolan_young_theme_example
npm run theme:preview -- --theme-slug 001_nolan_young_theme_example
npm run theme:zip -- --theme-slug 001_nolan_young_theme_example
npm run theme:resume -- --theme-slug 001_nolan_young_theme_example
npm run theme:env
npm run theme:model-check -- --provider codex
npm run theme:model-check -- --provider ollama --ollama-model llama3.1:8b
npm run theme:model-check -- --provider lmstudio --lmstudio-model qwen/qwen2.5-coder-14b
npm run test:scripts
```
