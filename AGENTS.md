# Nolan Young Theme Factory - Agent Policy

This repository is a template-first WordPress theme factory. Infrastructure work and generated-theme evaluation are separate jobs.

## Boundaries

Theme source belongs only in `wp-content/themes/NNN_nolan_young_theme_[description]/`.

ZIP files belong only in `dist/zipped-themes/NNN_nolan_young_theme_[description].zip`.

GitHub Pages previews belong only in `docs/Preview-Themes-Github/NNN_nolan_young_theme_[description]/`.

The folder name `wordpress-themplate-themes` is intentionally spelled this way.

## Generation Rules

The prep script copies the selected template into `wp-content/themes/{slug}` before AI generation starts.

During theme generation, the model may edit only `wp-content/themes/{slug}/`.

The model must not create the initial theme folder, copy templates, rename folders, generate previews, update docs, create ZIPs, edit scripts, edit prompts, or touch any file outside the prepared theme folder.

The repository agent must not modify generated themes to satisfy checks. Failed output is valid evaluation evidence and must be preserved.

## Evaluation Integrity

A generated theme is successful only when the generated source itself passes source validation, build, preview rendering, ZIP packaging, artifact validation, and visual preview inspection without repository-agent repairs.

Do not make infrastructure, harness, validation, preview, or packaging changes to compensate for failed generated theme output in the same run.

If preview fails because generated source references missing functions, classes, files, array keys, assets, invalid PHP, or inconsistent generated names, the generated theme has failed. Preserve the output and report the failure.

Preview harness changes are allowed only for generic WordPress core compatibility needs. They must be minimal, justified, and not specific to a brand, theme number, prompt, generated helper, generated data shape, or broken internal contract.

Never use a successful preview as proof of generation quality if that preview required post-generation harness fallbacks for missing generated source behavior.

Do not mark a generated theme complete if any generated PHP helper, template, data provider, class, asset reference, or required theme file is missing from generated source.

If local-model generation produces incomplete or inconsistent source, stop after deterministic validation or preview failure and classify the result as failed model output. Improve future prompts or planned stages in a new run; do not salvage the failed result in place.

Final reports must distinguish infrastructure success, generation success, validation success, preview publication success, and visual quality. A published preview of a failed generated theme is not a successful generated theme.

Hard rule: if generated theme preview fails because of missing generated source symbols, data, files, assets, or inconsistent generated naming, do not patch the preview harness. Mark the generated theme failed.

## Mode Rules

`ollama-only` means Ollama generation only through its OpenAI-compatible HTTP API at `http://127.0.0.1:11434/v1` by default.

`lmstudio-only` means LM Studio generation only through its OpenAI-compatible HTTP API at `http://127.0.0.1:1234/v1` by default.

Ollama-only and LM Studio-only use planned local-model stages. These stages are declared before generation starts and always run as part of the mode; prompt count is not repair.

Every local-model stage must declare its prompt-section ownership and separate read and write scopes. Missing production prompt coverage blocks the run before model invocation.

`codex-only` means one Codex generation pass.

There are only three generation modes: `ollama-only`, `lmstudio-only`, and `codex-only`.

There is no hybrid mode, automatic model fallback, validation-triggered AI pass, build-triggered AI pass, or second AI cleanup pass.

A planned generation stage is declared before generation begins, owns defined read and write scopes, receives bounded current theme context, and runs regardless of validation state.

A repair stage is triggered by a failed check or designed to make generated output pass after the fact. Repair stages are prohibited.

## Local Model Agent Rules

Ollama and LM Studio use the shared OpenAI-compatible provider abstraction. Each provider exposes model metadata, chat completion, model listing, model checking, normalized content and tool calls, normalized errors, timeouts, and capability metadata. API keys and authorization headers must never be written to logs or reports.

`theme:model-check` and `theme:run` must verify the selected model and perform a required structured tool-call probe before local generation begins. A provider or model that cannot complete the probe must fail before generation. Ollama has no CLI generation path, provider fallback, or alternate output path.

The local-model implementation is divided into:

- `scripts/lib/local-model/agent.js` for orchestration, limits, progress, reports, and checkpoints.
- `scripts/lib/local-model/context.js` for bounded actual source context.
- `scripts/lib/local-model/tools.js` for safe read-only inspection tools.
- `scripts/lib/local-model/patch.js` for path validation, candidate checks, and transactional patch application.
- `scripts/lib/local-model/stages.js` for planned stage policy and prompt-section ownership.
- `scripts/lib/local-model/protocols.js` for final-response and structured tool-call parsing.
- `scripts/lib/providers/openai-compatible.js`, `lmstudio.js`, and `ollama.js` for provider behavior.

The nine planned stages are `01-identity-copy`, `02-header-navigation`, `03-homepage-layout`, `04-page-templates`, `05-forms-admin`, `06-scss-design-system`, `07-js-interactions`, `08-footer-cleanup`, and `09-docs-and-stale-copy-cleanup`. Each stage has independent `read`, `write`, and `checks` declarations. Read scope controls context and tools; write scope controls patch paths.

The model receives bounded actual contents for relevant PHP, SCSS, JavaScript, JSON, Markdown, configuration, and build files. It may request only `list_files`, `read_file`, `read_file_excerpt`, and `search_files`. The Node runner owns every filesystem operation. Absolute paths, traversal, out-of-scope paths, binary reads, `node_modules`, symlinks, and oversized tool responses are rejected.

Each stage may make at most 12 tool calls. Each tool response is limited to 40 KB, malformed tool arguments receive at most one retry, and the default stage timeout is approximately 30 minutes.

The only accepted local-model edit is one unified diff. The runner validates every patch path against the stage write scope, rejects unsafe paths and symlinks, applies the diff to a temporary candidate, runs declared candidate checks, and replaces the prepared theme only after success. A failed response, patch, or candidate check is preserved as evidence and ends the run without a repair attempt.

Local-model stages must not write compiled bundles or `package-lock.json`. Compiled CSS and JavaScript are produced later by the deterministic build from accepted source changes.

Successful stages create detailed evidence and hash-bound checkpoints. Local generation may resume only with `--resume-local`; `--resume-from-stage` may select a stage only when the recorded prompt, template, provider, model, policy, and current theme hashes all match. A mismatch fails safely instead of replaying or skipping generation.

## Deterministic Work

Build, validation, preview generation, ZIP packaging, cleanup, and reports are deterministic post-generation work.

Validation is observational and read-only. Source validation runs before preview and ZIP creation. Artifact validation runs after preview and ZIP packaging. If a required template file is missing, validation reports it and does not copy it back.

Model output is applied without semantic modification. The application layer may parse one unified diff, enforce the declared write scope, apply it through a checked candidate transaction, and run observational candidate checks. It must not fix PHP, rewrite SCSS, invent fallback CSS, replace URLs, salvage malformed output, or keep old source when generated code is invalid.

Codex must run from the prepared theme directory with a writable sandbox and ephemeral execution. Repository snapshots around Codex are required to detect out-of-bound changes.

Preview generation renders actual generated theme templates through a read-only PHP harness. It may read generated themes and write only under `docs/Preview-Themes-Github/` and `docs/index.html`. Preview replacement must be transactional and must preserve an existing preview when candidate rendering fails.

Approved third-party image use must come from `assets/images/asset-manifest.json`. Models may create original local SVG marks, icons, textures, and illustrations, but must not invent provenance or describe illustrations as photographs.

Packaging must package from a temporary copy and must not modify generated theme source.

Run reports belong in `reports/runs/{theme_slug}/`. Do not store secrets there.

Local-model reports must include provider and model metadata, capability preflight, stage policy, read and write scopes, context summaries, tool activity, raw responses, extracted diffs, applied paths, candidate-check results, status, and checkpoint hashes without secrets.

Failed generated output must be preserved. Improving a failed result means improving a future prompt and starting a fresh run, not changing the failed result in place.

## Image Acquisition and Asset Seeding

Image acquisition is a standalone pre-generation process. Images must be gathered, generated, approved, copied, resized, optimized, attributed, and recorded before any AI theme generation call begins.

During generation, the model may reference only images already present in the prepared theme source or listed in the approved asset manifest. The model must not search for images, generate images, invent image URLs, invent provenance, or invent licensing.

Prefer image sources in this order:

1. Existing approved local assets.
2. Previously acquired reusable copyright-safe stock assets.
3. New copyright-safe stock assets from verified permissive sources.
4. Generated original local images only when stock is unavailable or unsuitable.

The asset acquisition process must be callable as a separate public workflow before theme generation, for example:

```text
npm run theme:assets -- --prompt <prompt-file> --theme-slug <theme-slug>
```

`theme:assets` is provider-neutral. A prompt/theme pair must receive the same approved manifest and copied asset set before `codex-only`, `ollama-only`, or `lmstudio-only` generation so provider comparisons do not use different visual inputs.

The asset workflow may write only approved asset folders, copied per-theme image files, and asset reports or manifests. It must not edit prompts, scripts, generated theme code outside the prepared image destination, previews, ZIPs, or validation results.

Shared approved assets belong under repository-controlled asset folders such as `assets/approved-stock/`, `assets/generated-images/`, and `assets/manifests/`.

Per-theme copied images belong under `wp-content/themes/{theme_slug}/assets/images/`.

Every approved image must have a manifest entry before generation starts. Manifest entries must include `id`, `file`, `source`, `source_url`, `license`, `license_url`, `creator`, `creator_url`, `acquired_at`, `allowed_use`, `theme_slug`, `alt_text`, and `notes`.

Do not use an image unless its source and license are recorded in the manifest. Do not use general search-result images unless the original source page confirms a compatible license.

Do not use images with unclear, missing, editorial-only, noncommercial-only, attribution-impossible, or incompatible licenses. Do not use copyrighted brand, product, venue, or person images unless they are owned by the project or explicitly permissioned for this use.

Do not hotlink third-party images. Copy every approved image file into a repository-controlled asset folder.

The repository runner owns image licensing decisions. The model does not decide whether an image is legally safe.

Reusable approved images may be used across multiple themes only when the manifest confirms their license still permits the intended use and they fit the prompt.

If no safe image can be found, the asset step must fail or use a generated original local graphic. It must never use unverified images.

Theme generation may start only after approved images exist locally, the manifest exists, required metadata is present, copied paths are available, and the prompt lists exactly which images the model may use.

If a prompt asks for photography or an image-backed visual design and no approved asset manifest exists, the runner must fail before model invocation with: `Missing approved asset manifest for theme generation.`

Missing assets are not a repair condition.

## Public Commands

Use npm scripts as the public command layer:

```text
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
