# Scripts

This folder contains the Node-only automation for the Nolan Young Theme Factory. The public command layer is the root `package.json`; normal operation should use `npm run ...`.

## Public Commands

```sh
npm run theme:run -- --mode <ollama-only|codex-only|hybrid> --prompt <prompt-file> [--template <template-name>] [--theme-slug <theme-slug>]
npm run theme:resume -- --theme-slug <theme-slug>
npm run theme:prepare -- --prompt <prompt-file> [--template <template-name>] [--theme-slug <theme-slug>]
npm run theme:validate -- --theme-slug <theme-slug> [--template <template-name>]
npm run theme:build -- --theme-slug <theme-slug>
npm run theme:preview -- --theme-slug <theme-slug>
npm run theme:preview:index
npm run theme:zip -- --theme-slug <theme-slug>
npm run theme:env
npm run theme:model-check -- --provider <ollama|codex> ...
npm run test:scripts
```

`scripts/run-theme-workflow.js` is the single public workflow entrypoint behind `theme:run` and `theme:resume`.

## Folder Map

| Folder | Purpose |
| --- | --- |
| `ai-output/` | Parses model file blocks, rejects unsafe paths, strips malformed wrappers, validates PHP where possible, and applies complete file contents to the target theme only. |
| `briefs/` | Creates the shared generation brief from the selected prompt, mode, template source, and target theme. |
| `build/` | Builds generated theme assets with the theme-local npm tooling and confirms `assets/css/bundle.css` and `assets/js/bundle.js` exist. |
| `environment/` | Checks local tool availability and exact provider/model/reasoning access. |
| `modes/ollama-only/` | Contains Ollama-specific generation batches, prompt construction, and conditional quality repair. |
| `modes/codex-only/` | Contains Codex-specific brief construction. The Theme 012 Codex-only contract should not be changed casually. |
| `modes/hybrid/` | Documents the hybrid composition of Ollama draft plus Codex finish. |
| `shared/` | Holds reusable Node helpers for repo root detection, arguments, command execution, exact model validation, theme slug safety, and artifact replacement. |
| `template-theme-copy/` | Prepares a theme from a template, assigns the slug, updates deterministic metadata, records template source, and creates template manifests. |
| `theme-preview/` | Renders static previews from the actual WordPress theme, rebuilds `docs/index.html`, and validates gallery coverage. |
| `theme-zipping/` | Creates cross-platform ZIP files with Node dependencies and validates package exclusions through the validation layer. |
| `validation/` | Runs template-aware checks, WordPress quality checks, preview/ZIP checks, and JSON validation reports. |
| `workflow/` | Contains script-level smoke tests and may contain internal workflow helpers. It is not a public workflow command folder. |

## AI Pass Policy

Deterministic work stays in scripts: template copy, validation, asset builds, preview generation, gallery rebuilds, ZIP creation, reports, environment checks, and model checks.

Ollama-only currently uses five generation batches because the generated theme spans shell/templates, section fragments, pages, assets, and helpers. The Ollama repair pass is conditional and only runs after deterministic quality validation fails.

Codex-only preserves the Theme 012 shape: one Codex build brief over the prepared theme folder, followed by deterministic finalization.

Hybrid composes the Ollama draft with a Codex finish brief. It must not copy Ollama or Codex implementations into the hybrid folder.
