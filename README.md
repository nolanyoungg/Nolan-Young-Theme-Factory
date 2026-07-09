# Nolan Young Theme Factory

This repo is a template-first WordPress theme factory. It prepares a copied theme, runs exactly one selected generation mode, then performs deterministic build, validation, preview, packaging, and reporting work.

## Core Rule

Generation and evaluation are separate jobs.

AI generation may edit only the prepared theme directory:

```text
wp-content/themes/NNN_nolan_young_theme_[description]/
```

The workflow owns template copying, build commands, validation, preview generation, ZIP packaging, cleanup, and reports.

## Modes

There are only three generation modes:

- `codex-only`: one Codex generation pass from the prepared theme directory.
- `ollama-only`: planned Ollama stages with declared prompt-section ownership and per-stage file allowlists.
- `lmstudio-only`: planned local-model stages sent to a running LM Studio OpenAI-compatible local API.

There is no `hybrid` mode, model fallback, validation-triggered AI pass, build-triggered AI pass, or repair pass.

## What Lives Where

- `AGENTS.md` holds the repository agent policy.
- `prompts/pending/` holds creative briefs waiting to be generated.
- `prompts/completed/` holds prior creative briefs retained for reference.
- `wp-content/themes/000_nolan_young_theme_master_template_prompt_filler_template_1/` is the current checked-in starter theme source.
- `wp-content/themes/NNN_nolan_young_theme_[description]/` holds prepared and generated theme source.
- `wordpress-themplate-themes/` keeps the intentionally spelled template artifact area.
- `dist/zipped-theme-templates/` holds template ZIPs.
- `dist/zipped-themes/` holds generated theme ZIP packages.
- `docs/Preview-Themes-Github/NNN_nolan_young_theme_[description]/` holds rendered static previews.
- `docs/index.html` is the preview gallery.
- `reports/runs/{theme_slug}/` holds run reports and validation evidence.
- `scripts/` holds the npm command implementation.

## Public Commands

Use npm scripts from the repository root:

```sh
npm run theme:run
npm run theme:resume
npm run theme:prepare
npm run theme:validate
npm run theme:build
npm run theme:preview
npm run theme:preview:index
npm run theme:zip
npm run theme:delete
npm run theme:env
npm run theme:model-check
npm run test:scripts
```

## Run Examples

Codex:

```sh
npm run theme:run -- --mode codex-only --prompt prompts/pending/000-testing.md
```

Ollama:

```sh
npm run theme:run -- --mode ollama-only --prompt prompts/pending/000-testing.md --ollama-model llama3.1:8b
```

Qwen 2.5 Coder 14B through Ollama:

```sh
ollama pull qwen2.5-coder:14b
npm run theme:model-check -- --provider ollama --ollama-model qwen2.5-coder:14b
npm run theme:run -- --mode ollama-only --prompt prompts/pending/000-testing.md --ollama-model qwen2.5-coder:14b
```

LM Studio:

```sh
npm run theme:run -- --mode lmstudio-only --prompt prompts/pending/000-testing.md --lmstudio-model qwen/qwen2.5-coder-14b
```

LM Studio mode expects the LM Studio desktop app or `lms`/`llmster` server to already be running with the OpenAI-compatible API enabled. The default base URL is `http://127.0.0.1:1234/v1`; override it with `--lmstudio-base-url` or `LMSTUDIO_BASE_URL`.

Qwen 2.5 Coder 14B through LM Studio:

```sh
npm run theme:model-check -- --provider lmstudio
npm run theme:model-check -- --provider lmstudio --lmstudio-model qwen/qwen2.5-coder-14b
npm run theme:run -- --mode lmstudio-only --prompt prompts/pending/000-testing.md --lmstudio-model qwen/qwen2.5-coder-14b
```

Use the exact model id reported by `theme:model-check`; LM Studio model ids can differ by download source and quantization. If the server is not running, the model is not loaded, the endpoint is not OpenAI-compatible, or the model id is wrong, `theme:model-check` fails before generation.

The runner prompts interactively for missing values when used from a TTY. Non-interactive runs must pass required options.

## Deterministic Steps

`theme:run` performs:

```text
copy template
-> run selected AI generation mode
-> npm run build inside the copied theme
-> source validate
-> generate preview
-> rebuild preview index
-> package ZIP
-> artifact validate
-> write run report
```

`theme:resume` re-runs only the deterministic post-generation steps for an existing theme.

## Validation And Evidence

Validation is observational. Failed generated output is preserved as evidence. Do not patch a generated theme in place just to make checks pass. Improve the future prompt, template, validator, or deterministic workflow, then start a fresh run.

Source validation runs before preview and ZIP creation. Artifact validation runs after preview and packaging.

A generated theme is successful only when the generated source itself passes source validation, build, preview rendering, ZIP packaging, artifact validation, and visual preview inspection without repository-agent repairs.

Do not change the preview harness, validators, packaging, or generated theme source to hide a broken generation result. If generated PHP, helpers, data providers, files, assets, or naming contracts are missing or inconsistent, mark the generation failed and keep the evidence.

Reports should separate infrastructure success, generation success, validation success, preview publication success, and visual quality. A published preview is not proof that the generated theme succeeded if the preview required fallback code to render.

## Image Assets

Image acquisition happens before theme generation as a standalone workflow. Approved images must be local, copyright-safe, and recorded in an asset manifest before the model is called.

During generation, the model may use only images already present in the prepared theme or explicitly listed in the approved asset manifest. It must not search for images, invent image URLs, invent licensing, or hotlink third-party files.

Prefer existing approved local assets first, then reusable copyright-safe stock, then newly acquired permissive stock. Use generated original images only when stock is unavailable or unsuitable.

Every approved image needs source, license, creator, acquisition date, allowed use, destination file, theme slug, alt text, and notes recorded in the manifest. If a prompt requires photography or image-backed design and no approved manifest exists, generation should stop before model invocation.

## Preview Expectations

Preview generation renders theme PHP templates through a lightweight read-only harness and writes static pages under `docs/Preview-Themes-Github/`.

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
