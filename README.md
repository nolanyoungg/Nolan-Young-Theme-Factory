# Nolan Young Theme Factory

Generate polished multi-page **static website samples** first. Review them in `docs/index.html`, then explicitly choose a sample for WordPress conversion. Static generation never creates a WordPress theme, renders PHP, or packages a WordPress ZIP.

## Quick start

Run commands from the repository root (use `npm.cmd` in PowerShell if its npm shim drops flags):

```sh
npm run theme:run -- --mode codex-only --prompt prompts/pending/000-testing.md
```

The workflow reserves the next unused numbered identity across samples, themes, ZIPs and reports. It creates a plain HTML/CSS/JavaScript scaffold, seeds approved local images and a provenance manifest, runs one generation pass, validates the sample and writes private evidence. No static build dependencies are installed.

A focused architecture example with an already approved photographic catalog:

```sh
npm run theme:run -- --mode codex-only --prompt prompts/pending/012-common-ground-static.md --asset-catalog assets/manifests/007-form-and-field.json
```

The nine existing page filenames remain the navigation contract: `index.html`, `homepage_preview.html`, `about-us_preview.html`, `services_preview.html`, `work_preview.html`, `blog_preview.html`, `contact_preview.html`, `policy_preview.html`, `single_services_preview.html`. Index and homepage are equivalent entry points. Extra HTML pages can be discovered by the gallery.

## Review before gallery inclusion

```sh
npm run theme:preview -- --sample-slug <sample-slug> --port 4174
npm run theme:validate -- --sample-slug <sample-slug>
npm run theme:resume -- --sample-slug <sample-slug> --review-evidence reports/static/<sample-slug>/browser-review.json
npm run theme:preview:index
npm run theme:preview -- --port 4174
```

Preview is a localhost Node static server; stop it with Ctrl+C. Without `--sample-slug`, it serves the gallery. Nothing is deployed. Existing historical previews remain in the gallery. New samples require passing technical validation and hash-bound browser/screenshot review before inclusion. Until reviewed, the run says `awaiting-review`; unavailable browser checks say `skipped`, never passed. See [the command and evidence guide](scripts/README.md) for the review format.

Inspect desktop (at least 1200px) and mobile (at most 400px) screenshots. Check typography, spacing, images, content, distinct design, all pages, navigation, intended interactions, console errors, failed requests, overflow and clipping. Code similarity does not prove visual quality. Generated output is immutable after its pass: preserve failed output; improve a future brief and start a new number instead of repairing it.

## Local generation modes

Only `codex-only`, `ollama-only`, and `lmstudio-only` exist. Local modes retain bounded tools, declared stages, validated transactional diffs, capability probing and hash-bound checkpoints. They never fall back to Codex.

First discover exact IDs from an **already running** server:

```sh
npm run theme:model-check -- --provider ollama --ollama-base-url http://127.0.0.1:11434/v1
npm run theme:model-check -- --provider lmstudio --lmstudio-base-url http://127.0.0.1:1234/v1
```

Then use the exact returned ID, including its tag/quantization, in both commands. These examples use documented example IDs, **not a claim that these models are loaded here**:

```sh
npm run theme:model-check -- --provider ollama --ollama-base-url http://127.0.0.1:11434/v1 --ollama-model qwen2.5-coder:14b
npm run theme:run -- --mode ollama-only --prompt prompts/pending/012-common-ground-static.md --asset-catalog assets/manifests/007-form-and-field.json --ollama-base-url http://127.0.0.1:11434/v1 --ollama-model qwen2.5-coder:14b
npm run theme:model-check -- --provider lmstudio --lmstudio-base-url http://127.0.0.1:1234/v1 --lmstudio-model qwen/qwen2.5-coder-14b
npm run theme:run -- --mode lmstudio-only --prompt prompts/pending/012-common-ground-static.md --asset-catalog assets/manifests/007-form-and-field.json --lmstudio-base-url http://127.0.0.1:1234/v1 --lmstudio-model qwen/qwen2.5-coder-14b
```

At refactor verification time, both default endpoints returned `ECONNREFUSED`; no exact loaded model ID could be verified. No server settings or model installations were changed. See `reports/static-refactor/local-provider-availability.json` for the actual result. Equivalent commands above become reproducible once an existing server is available and its returned ID is supplied.

## Explicit WordPress conversion

```sh
npm run theme:convert:wordpress -- --sample-slug <existing-static-sample-slug> --mode codex-only
```

This separate command reserves a new output identity, copies the selected approved assets, and asks Codex to produce a real classic WordPress theme using the original sample as read-only design input. Optional `--output-slug <new-numbered-slug>` selects the output identity. Other conversion modes are rejected; local modes still generate static samples.

The converter performs a dependency-free asset build, PHP/source contract checks, legacy read-only PHP-harness rendering and temporary-copy ZIP packaging. It hashes the original sample before/after. The resulting theme README explains editable WordPress content, template-owned content, page/slugs/menu setup and demo forms. Compare the converted private preview with the original on desktop/mobile before calling conversion visually verified.

After an infrastructure interruption, deterministic conversion checks can resume with the same sample and `--output-slug <recorded-output> --mode codex-only --resume-checks`. This never invokes AI, requires an unchanged source checkpoint, preserves previous check reports, and refuses an existing ZIP. It does not permit repairing generated source.

A harness is **not WordPress**. Without an isolated WordPress runtime, theme activation, actual enqueue execution, admin editing, permalink routing, plugin interoperability and real form delivery remain unverified. Do not point tests at an existing live site.

## Output and migration

| Purpose | Location |
| --- | --- |
| Primary static samples | `docs/Preview-Themes-Github/<sample-slug>/` |
| Local gallery | `docs/index.html` |
| Static reports/checkpoints/screenshots | `reports/static/<sample-slug>/` |
| Selected WordPress conversion | `wp-content/themes/<new-output-slug>/` |
| WordPress package | `dist/zipped-themes/<new-output-slug>.zip` |
| Conversion reports/private preview | `reports/conversions/<new-output-slug>/` |

Historical samples, themes, ZIPs and failed runs are preserved. Existing preview URLs continue to work. `sample.json` distinguishes new static-v1 samples; old rendered previews have no such marker and are treated as legacy. New commands do not rewrite their source. Old WordPress-first code is isolated in `scripts/legacy-wordpress.js`; direct execution is disabled. The old guide is retained as historical reference in `scripts/LEGACY-WORDPRESS.md`.

`--sample-slug` replaces `--theme-slug` for static commands (the latter warns as a compatibility alias). `theme:build` is a documented static no-op. `theme:zip` and `theme:delete` have been removed; explicit `theme:wordpress:zip` packages a validated conversion only and refuses an existing ZIP. Old WordPress local checkpoints cannot resume under static checkpoint version 2. Deterministic `theme:resume` never invokes AI; explicit local continuation is separate.

Run `npm run test:scripts` for validation, provider, patch, checkpoint, isolation and command-contract checks. Publishing remains a separate human-authorized operation.
