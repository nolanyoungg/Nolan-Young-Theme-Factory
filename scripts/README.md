# Theme Factory Scripts

Use the npm script layer from the repository root. The script implementation lives in `scripts/theme-factory.js`.

## Main Flow

```sh
npm run theme:run -- --mode codex-only --prompt prompts/pending/000-testing.md
npm run theme:run -- --mode ollama-only --prompt prompts/pending/000-testing.md --ollama-model llama3.1:8b
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

There are only two modes: `codex-only` and `ollama-only`.

## File-Block Protocol For Ollama

Ollama stages must return complete files using this exact protocol:

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
npm run test:scripts
```
