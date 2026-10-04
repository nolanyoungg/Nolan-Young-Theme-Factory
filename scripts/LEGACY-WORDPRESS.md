# Nolan Young Theme Factory

This repo is a template-first WordPress theme factory. It prepares a copied theme, installs its build dependencies, runs exactly one selected generation mode, then performs deterministic build, validation, preview, packaging, and reporting work.

## Core Rule

Generation and evaluation are separate jobs.

AI generation may edit only the prepared theme directory:

```text
wp-content/themes/NNN_nolan_young_theme_[description]/
```

The workflow owns template copying, dependency installation, build commands, validation, preview generation, ZIP packaging, cleanup, and reports.

## Modes

There are only three generation modes:

- `codex-only`: one Codex generation pass from the prepared theme directory.
- `ollama-only`: planned LocalModelAgent stages through Ollama's OpenAI-compatible HTTP API.
- `lmstudio-only`: the same planned LocalModelAgent stages through LM Studio's OpenAI-compatible HTTP API.

There is no `hybrid` mode, CLI generation path, provider fallback, validation-triggered AI pass, build-triggered AI pass, or repair pass.

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
npm run theme:assets
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

## Preparation Flow

`theme:run` and `theme:prepare` prepare a theme before any AI generation mode is called:

1. Resolve the selected template source. The default source is the packaged starter ZIP when it exists, with the checked-in starter directory used only as a fallback.
2. Stage the template ZIP under `wp-content/themes/`, unzip it, and copy the extracted WordPress theme into `wp-content/themes/{theme_slug}/`.
3. Update prepared identity fields such as theme name, text domain, and package name.
4. Run `npm ci` inside the prepared theme directory.
5. Acquire or copy the provider-neutral approved asset set and write its manifest before generation.
6. Verify the local build dependency binaries exist before Codex, Ollama, or LM Studio generation starts.

The asset phase is also callable independently with `npm run theme:assets`. Fair comparisons use equivalent per-theme manifests and the same byte-identical approved asset set in all three modes; compare the recorded `approvedAssetSetHash` because manifest timestamps and theme slugs intentionally differ.

`theme:build` does not install dependencies. If dependencies are missing, rerun preparation or run `npm ci` inside the prepared theme directory before building or resuming.

## Local Model Architecture

Ollama and LM Studio share one OpenAI-compatible provider contract. Ollama defaults to `http://127.0.0.1:11434/v1`; LM Studio defaults to `http://127.0.0.1:1234/v1`. Base URL, API key, temperature, and timeout are configurable per provider, but secrets are never included in metadata, errors, checkpoints, or reports.

Both `theme:model-check` and `theme:run` verify that the selected model is visible and can return a required structured tool call. Local generation stops before model work if that preflight fails.

LocalModelAgent runs these nine planned stages with separate read and write scopes:

1. `01-identity-copy`
2. `02-header-navigation`
3. `03-homepage-layout`
4. `04-page-templates`
5. `05-forms-admin`
6. `06-scss-design-system`
7. `07-js-interactions`
8. `08-footer-cleanup`
9. `09-docs-and-stale-copy-cleanup`

Each stage receives bounded actual source contents instead of a repository dump. The model can request only safe read-only file listing, reading, excerpt, and search tools within that stage's read scope. It never receives direct disk access.

The final stage response must contain one unified diff and no direct-write instructions. The runner validates paths against the write scope, rejects traversal, absolute paths, binary files, `node_modules`, and symlinks, applies the patch to a temporary candidate, runs stage checks, and replaces the prepared theme only after success. There is no alternate edit format and no repair pass after failure.

Stage write scopes exclude compiled CSS, compiled JavaScript, and `package-lock.json`. `npm run build` produces bundles deterministically after all accepted source stages finish.

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

Use the exact model id reported by `theme:model-check`; local model ids can differ by download source and quantization. If the server is not running, the model is not loaded, the endpoint is not OpenAI-compatible, the model id is wrong, or required tool calling is unavailable, `theme:model-check` fails before generation.

The runner prompts interactively for missing values when used from a TTY. Non-interactive runs must pass required options.

## Deterministic Steps

`theme:run` performs:

```text
copy template
-> acquire/copy approved assets
-> run selected AI generation mode
-> npm run build inside the copied theme
-> source validate
-> generate preview
-> rebuild preview index
-> package ZIP
-> artifact validate
-> write run report
```

`theme:resume` re-runs only the deterministic post-generation steps for an existing completed theme. Local-model stage continuation is explicit:

```sh
npm run theme:run -- --mode ollama-only --prompt prompts/pending/000-testing.md --ollama-model qwen2.5-coder:14b --resume-local
npm run theme:run -- --mode lmstudio-only --prompt prompts/pending/000-testing.md --lmstudio-model qwen/qwen2.5-coder-14b --resume-local --resume-from-stage 04-page-templates
```

Each successful local stage records hashes for the prompt, template, provider identity, model metadata, stage policy, and current theme tree. `--resume-local` and `--resume-from-stage` proceed only when every recorded hash matches and the completed stages form a valid policy prefix. A mismatch stops without changing the theme.

## Validation And Evidence

Validation is observational. Failed generated output is preserved as evidence. Do not patch a generated theme in place just to make checks pass. Improve the future prompt, template, validator, or deterministic workflow, then start a fresh run.

Source validation runs before preview and ZIP creation. Artifact validation runs after preview and packaging.

A generated theme is successful only when the generated source itself passes source validation, build, preview rendering, ZIP packaging, artifact validation, and visual preview inspection without repository-agent repairs.

Do not change the preview harness, validators, packaging, or generated theme source to hide a broken generation result. If generated PHP, helpers, data providers, files, assets, or naming contracts are missing or inconsistent, mark the generation failed and keep the evidence.

Reports should separate infrastructure success, generation success, validation success, preview publication success, and visual quality. Local-model evidence additionally records provider/model metadata, capability preflight, stage configuration, read/write scopes, context summaries, tool activity, raw responses, extracted diffs, applied paths, candidate checks, final status, and checkpoint hashes without secrets. A published preview is not proof that the generated theme succeeded if the preview required fallback code to render.

## Image Assets

Image acquisition happens before theme generation as a standalone workflow. Approved images must be local, copyright-safe, and recorded in an asset manifest before the model is called.

```sh
npm run theme:assets -- --prompt prompts/pending/000-testing.md --theme-slug 007_nolan_young_theme_example
```

During generation, the model may use only images already present in the prepared theme or explicitly listed in the approved asset manifest. It must not search for images, invent image URLs, invent licensing, or hotlink third-party files.

Prefer existing approved local assets first, then reusable copyright-safe stock, then newly acquired permissive stock. Use generated original images only when stock is unavailable or unsuitable.

Every approved image needs source, license, creator, acquisition date, allowed use, destination file, theme slug, alt text, and notes recorded in the manifest. If a prompt requires photography or image-backed design and no approved manifest exists, generation should stop before model invocation.

Asset acquisition is provider-neutral: Codex, Ollama, and LM Studio receive equivalent manifests and byte-identical copied files for the same prompt comparison. The run evidence records both the per-theme manifest hash and the cross-mode `approvedAssetSetHash`.

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
