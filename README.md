# Nolan Young Theme Factory

This repository is a controlled factory for generating complete, installable classic WordPress themes from prompt files in `prompts/pending/`.

The README describes the intended repo behavior. Scripts, contracts, validation, CI, and generated outputs should be kept aligned to this behavior.

## Supported Modes

The workflow supports three honest generation modes:

1. `ollama-only`: local Ollama planner plus compact builder-spec generation, deterministic local theme/preview rendering, build, package, validation, and optional local review/fix. This is a complete local-only workflow and must never invoke Codex.
2. `hybrid`: Ollama creates the local draft through the same planner/spec/render path, then Codex runs one senior-engineer final pass.
3. `codex-only`: Codex performs the full generation directly when selected. This path has a separate full-generation prompt because no Ollama draft exists.

No mode should silently replace another mode. Hybrid should not run a surprise second Codex pass.

## Ollama Efficiency Model

The Ollama-only path is optimized for local models such as `qwen2.5-coder:14b`.

The model is not asked to stream every WordPress, preview, CSS, JS, image, and documentation file as raw file blocks. That approach is slow, expensive in tokens, and unreliable for 14B local models.

Instead:

- the planner writes a concise implementation plan
- the builder writes one compact JSON site specification
- `scripts/renderer/render-theme-and-preview-from-site-specification.js` deterministically renders the required WordPress theme, static preview, local raster images, source files, compiled assets, docs, and gallery card from that specification
- validation remains deterministic and strict
- no Codex process is used in `ollama-only`

This keeps Ollama-only strong and local while making the model’s task clear and bounded.

## Canonical Outputs

Each generated run produces:

- `wp-content/themes/NNN_nolan_young_theme_<description>/`
- `docs/themes/NNN_nolan_young_theme_<description>/`
- `dist/zipped-themes/NNN_nolan_young_theme_<description>.zip`
- `reports/runs/NNN_nolan_young_theme_<description>/`

Generated slugs must use this pattern only:

```text
NNN_nolan_young_theme_<description>
```

The first generated theme after a clean reset is:

```text
000_nolan_young_theme_<description>
```

The description segment is derived from the selected prompt filename unless `THEME_SLUG` is explicitly supplied. For example:

```text
prompts/pending/premium-landscape-design-company.txt
000_nolan_young_theme_premium_landscape_design_company
```

The next number is determined across:

- `wp-content/themes/`
- `docs/themes/`
- `dist/zipped-themes/`
- `reports/runs/`

Existing generated slugs must not be overwritten or reused.

## Prompt Workflow

Prompt files must be `.txt` or `.md` files in `prompts/pending/`.

The selected prompt is the creative brief for the theme only. It should describe the business, audience, content, pages, design direction, interactions, accessibility expectations, and local asset style.

Prompt files must not know about this repository. Do not include repo paths, generated slugs, CI/check instructions, packaging instructions, GitHub Pages/gallery instructions, script names, or validation commands. The factory adds those technical requirements separately.

Reusable prompt starters live in `prompts/template prompts/`. Review `prompts/template prompts/wordpress-theme-generation-prompt-skeleton-template.md` before a run, copy it into `prompts/pending/`, rename it for the business, and replace the bracketed placeholders with specific business, audience, content, look, feel, form, page, and conversion details.

Prompt files must not contain secrets, API keys, tokens, passwords, private keys, or unpublished customer data.

After a successful run, the workflow moves the exact selected prompt to `prompts/completed/` using the generated slug as a filename prefix. It also records the prompt lifecycle in the run report. Completed prompt archives are never overwritten.

Example completed prompt archive:

```text
prompts/completed/002_nolan_young_theme_landscape_design__premium-landscape-design-company.txt
```

To reuse a prior creative brief, copy a completed prompt back into `prompts/pending/` with a new descriptive filename and edit it for the next run. Do not rerun stale completed prompt text by accident, and do not leave generated reports, ZIP notes, preview references, run notes, or other repo-generated cleanup items sitting in `prompts/pending/`.

## Required Theme Structure

Every final generated theme must include the minimum WordPress structure documented in:

```text
contracts/required-theme-structure.md
```

That includes required root PHP files, `inc/` files, compiled assets, local image folders, source SCSS and JS, template parts, page templates, build files, docs, and accessibility notes.

Generated themes may add extra files when useful:

- Extra page templates belong in `page-templates/`.
- Extra reusable PHP sections belong in `template-parts/`.
- Extra PHP helpers belong in `inc/`.
- Extra styles belong in `src/scss/` and compile into `assets/css/bundle.css`.
- Extra JavaScript belongs in `src/js/` and compiles into `assets/js/bundle.js`.
- Extra theme images belong in `assets/images/`.
- Extra static preview images belong in `docs/themes/<slug>/assets/images/`.

Required files must not be removed, renamed, or moved.

## Static Preview Requirements

Every generated theme must include a static preview at `docs/themes/<slug>/` with:

- `index.html`
- `homepage_preview.html`
- `services_preview.html`
- `about-us_preview.html`
- `contact_preview.html`
- `single_services_preview.html`
- `blog_preview.html`
- `work_preview.html`
- `assets/css/preview.css`
- `assets/js/preview.js`
- `assets/images/README.md`
- local raster images in `assets/images/`
- `README.md`

The preview must work without WordPress or PHP, use local assets only, link between all seven required pages, include Nolan-menu behavior, and visually match the WordPress templates as closely as possible.

`docs/index.html` is the GitHub Pages gallery shell. Generated runs add preview cards to that file.

## Nolan-Menu Header

Generated themes and static previews must implement the Nolan-menu header system:

- Desktop header layout: logo, primary nav, Contact Us CTA.
- Primary nav items: `Services`, `About`, `Work`, `Blog`.
- Contact is only the right-side CTA, not a primary nav item.
- Services, About, and Blog use dropdown panels with required `data-menu-item` and `data-menu-dropdown` attributes.
- Dropdown rails use matching `data-rail-item` and `data-rail-content` keys.
- Local JavaScript handles open/close, one active panel, Escape, outside click, scroll lock, backdrop, rail switching, and mobile drawer behavior.

See `contracts/nolan-menu-header.md`.

## Local Image Rules

Generated themes must use local, copyright-safe demo images that fit the generated business, product, or organization category.

Do not use:

- hotlinked images
- CDN images
- random web images
- watermarked stock photos
- celebrity photos
- client photos
- gray placeholder boxes

Theme images belong in `wp-content/themes/<slug>/assets/images/`. Preview images belong in `docs/themes/<slug>/assets/images/`.

See `contracts/local-image-rules.md`.

## Templates

The `templates/wordpress-theme/` and `templates/static-preview/` folders are optional reference blueprints. They document conventions for generated output, but the workflow does not copy them as a rigid scaffold.

Generated themes must still satisfy the required structure contract and validation scripts.

Prompt skeletons live separately in `prompts/template prompts/`. These are user-facing creative brief starters, not generated outputs. Fill in the skeleton, remove unused optional lines, then place the finished `.md` or `.txt` prompt in `prompts/pending/` for the next run.

## Environment Variables

- `THEME_FACTORY_MODE`: `ollama-only`, `hybrid`, or `codex-only`
- `THEME_PROMPT_FILE`: path to a prompt file in `prompts/pending/`
- `OLLAMA_MODEL`: installed Ollama model for Ollama modes, for example `qwen2.5-coder:14b`
- `CODEX_COMMAND`: full Codex automation command, default `codex exec`
- `THEME_SLUG`: optional explicit slug override using `NNN_nolan_young_theme_<description>`

If `CODEX_COMMAND` is supplied as `codex` or `codex --model ...`, the workflow normalizes it to `codex exec ...` for automated passes.

## Run Commands

Run interactively:

```bash
bash scripts/workflows/run-hybrid-ollama-codex-theme-generation.sh
```

Run Ollama-only:

```bash
THEME_FACTORY_MODE=ollama-only \
THEME_PROMPT_FILE=prompts/pending/premium-landscape-design-company.txt \
OLLAMA_MODEL=qwen2.5-coder:14b \
bash scripts/workflows/run-hybrid-ollama-codex-theme-generation.sh
```

Run Hybrid:

```bash
THEME_FACTORY_MODE=hybrid \
THEME_PROMPT_FILE=prompts/pending/my-theme-brief.txt \
OLLAMA_MODEL=qwen2.5-coder:14b \
CODEX_COMMAND="codex exec" \
bash scripts/workflows/run-hybrid-ollama-codex-theme-generation.sh
```

Run Codex-only:

```bash
THEME_FACTORY_MODE=codex-only \
THEME_PROMPT_FILE=prompts/pending/my-theme-brief.txt \
CODEX_COMMAND="codex exec" \
bash scripts/workflows/run-hybrid-ollama-codex-theme-generation.sh
```

Windows PowerShell wrapper:

```powershell
$env:THEME_FACTORY_MODE = 'ollama-only'
$env:THEME_PROMPT_FILE = 'prompts/pending/premium-landscape-design-company.txt'
$env:OLLAMA_MODEL = 'qwen2.5-coder:14b'
powershell.exe -ExecutionPolicy Bypass -File scripts\workflows\run-hybrid-ollama-codex-theme-generation.ps1
```

## Build, Package, Validate

Every generated theme must support:

```bash
npm install
npm run build
```

Package a generated theme:

```bash
bash scripts/packaging/package-generated-wordpress-theme-zip.sh 000_nolan_young_theme_premium_landscape_design_company
```

Validate a generated theme:

```bash
bash scripts/validation/validate-generated-theme-all.sh 000_nolan_young_theme_premium_landscape_design_company
```

Validate all generated themes:

```bash
bash scripts/validation/validate-generated-theme-all.sh
```

If no generated themes exist, validation exits cleanly with `No generated themes found.`

## CI

GitHub Actions run:

- `Validate Theme`
- `Check ZIP Freshness`
- `Deploy Preview`

Validation checks required theme files, compiled CSS and JS, local image presence, static preview structure, Nolan-menu attributes and behavior, no remote runtime dependencies, no obvious secrets, and ZIP freshness.

## First Fresh Run

After a full cleanup, the first local run should use:

```bash
THEME_FACTORY_MODE=ollama-only \
THEME_PROMPT_FILE=prompts/pending/premium-landscape-design-company.txt \
OLLAMA_MODEL=qwen2.5-coder:14b \
bash scripts/workflows/run-hybrid-ollama-codex-theme-generation.sh
```

Expected first outputs:

```text
wp-content/themes/000_nolan_young_theme_premium_landscape_design_company/
docs/themes/000_nolan_young_theme_premium_landscape_design_company/
dist/zipped-themes/000_nolan_young_theme_premium_landscape_design_company.zip
reports/runs/000_nolan_young_theme_premium_landscape_design_company/
```

## Remove A Generated Theme

Use the removal utility when one generated theme should be completely removed from the repo. The utility targets a single generated theme by either its three-digit number or its full generated slug.

Identify the theme from one of these locations:

- `wp-content/themes/<slug>/`
- `docs/themes/<slug>/`
- `dist/zipped-themes/<slug>.zip`
- `reports/runs/<slug>/`
- `prompts/completed/<slug>__<original-prompt-name>.md`
- `prompts/completed/<slug>__<original-prompt-name>.txt`
- the matching preview card in `docs/index.html`

Preview what would be removed by number:

```bash
bash scripts/repo/remove-generated-theme-and-artifacts.sh 005 --dry-run
```

Preview what would be removed by full slug:

```bash
bash scripts/repo/remove-generated-theme-and-artifacts.sh <full-theme-slug> --dry-run
```

Remove the generated theme artifacts:

```bash
bash scripts/repo/remove-generated-theme-and-artifacts.sh 005 --yes
```

PowerShell:

```powershell
powershell.exe -ExecutionPolicy Bypass -File scripts\repo\remove-generated-theme-and-artifacts.ps1 005 -DryRun
powershell.exe -ExecutionPolicy Bypass -File scripts\repo\remove-generated-theme-and-artifacts.ps1 005 -Yes
```

Theme removal deletes:

- `wp-content/themes/<slug>/`
- `docs/themes/<slug>/`
- `dist/zipped-themes/<slug>.zip`
- `reports/runs/<slug>/`
- `prompts/completed/<slug>__*.txt`
- `prompts/completed/<slug>__*.md`
- the matching preview card in `docs/index.html`

After deleting the known generated files, the utility scans the repo for lingering exact slug references. This catches leftover preview entries, report references, completed prompt references, ZIP references, metadata references, or other generated artifacts that still point to the removed theme. If any exact slug references remain, the removal fails and prints the files to inspect.

After removal, verify:

- the theme folder no longer exists in `wp-content/themes/`
- the static preview folder no longer exists in `docs/themes/`
- the ZIP is gone from `dist/zipped-themes/`
- the run report is gone from `reports/runs/`
- the completed prompt archive is gone from `prompts/completed/`
- the theme card is gone from `docs/index.html`
- `rg "<slug>"` returns no unintended references
- `bash scripts/validation/validate-generated-theme-all.sh` still passes for the remaining generated themes

Root-level scripts such as `scripts/remove-theme.sh`, `scripts/validate-all.sh`, and `scripts/run-hybrid-theme-workflow.sh` remain as compatibility wrappers. New work should use the role-based script names documented in `scripts/README.md`.

## Detailed Walkthrough

### 2026-06-11

The Nolan Young Theme Factory turns a user creative brief into a complete installable classic WordPress theme, a static preview site, a distributable ZIP, and run reports. The repo is not a loose prompt scratchpad. It is meant to behave like a controlled generation pipeline where prompt input, generated source, previews, ZIP artifacts, validation output, and archived prompts all stay organized.

A theme run starts with a `.md` or `.txt` prompt in `prompts/pending/`. That prompt is the business and website brief. It should explain the business name, industry, audience, visual style, brand voice, colors, navigation, pages, page purposes, service requirements, work or portfolio needs, form fields, homepage flow, footer expectations, accessibility needs, and quality bar. It should not carry generated artifacts, stale report notes, ZIP notes, preview cleanup notes, run logs, or repo-maintenance tasks. Those items belong in their generated output folders or in normal repo documentation, not in `/pending/`.

Before starting a new run, review `prompts/template prompts/wordpress-theme-generation-prompt-skeleton-template.md`. Copy it into `prompts/pending/`, rename the copy for the business concept, fill in the bracketed placeholders, and remove optional lines that do not apply. Template prompts matter because they give the AI enough structured information to build any kind of site, including a local service business, agency, ecommerce brand, restaurant, insurance firm, SaaS product, or full CRM-style product website. The prompt should describe pages by business purpose, not by PHP filenames or implementation paths. The generator decides the WordPress templates, page templates, template parts, routes, preview sections, assets, and navigation links.

The factory supports three workflow modes. `ollama-only` runs the local Ollama planner and builder-spec stages, then renders the theme and preview deterministically without Codex. `hybrid` runs the same Ollama draft/spec/render path, then runs one Codex senior-engineer final pass. `codex-only` lets Codex perform the complete generation directly. No mode should silently replace another mode, and Hybrid should not run extra Codex fixer passes without explicit approval.

Ollama is used as a focused local planning and specification engine. In Ollama modes, the workflow verifies the `ollama` command, checks the selected installed model such as `qwen2.5-coder:14b`, runs a planner stage, then asks the model for a compact JSON site specification. That specification captures the brand, category, tone, page map, services, work cards, resources, process, proof, testimonials, forms, image direction, and other creative decisions. The deterministic renderer then builds the WordPress theme, static preview pages, local raster images, source files, compiled assets, docs, and preview gallery card from the same normalized spec. This keeps local models from getting buried in raw file streaming while still preserving the selected prompt as the creative brief.

Codex is used for complete generation in `codex-only` mode or for one final engineering pass in `hybrid` mode. In a final pass, Codex should preserve the prompt direction and generated design intent while fixing broken PHP, missing required files, build errors, validation failures, security issues, preview mismatches, weak styling, and accessibility problems. Codex should not ignore the prompt, replace the site with a generic layout, or run repeated paid/final passes without user approval.

After generation, the workflow installs and builds the generated theme assets, packages the ZIP, validates the theme structure, validates preview pages, checks Nolan-menu behavior, checks local image usage, scans for obvious security problems, checks ZIP freshness, and checks prompt lifecycle behavior. A successful run moves the selected prompt from `prompts/pending/` into `prompts/completed/` with the generated slug as a prefix. The run report keeps the plan, model outputs, normalized spec, validation notes, and prompt lifecycle notes under `reports/runs/<slug>/`.

Generated content is organized by slug:

- prompt input starts in `prompts/pending/<brief>.md`
- completed prompt archives move to `prompts/completed/<slug>__<brief>.md`
- WordPress themes live in `wp-content/themes/<slug>/`
- static previews live in `docs/themes/<slug>/`
- preview gallery links live in `docs/index.html`
- ZIP packages live in `dist/zipped-themes/<slug>.zip`
- run reports live in `reports/runs/<slug>/`

If a generated theme needs to be removed, use `scripts/repo/remove-generated-theme-and-artifacts.sh` rather than manually deleting only one folder. The removal utility clears the theme folder, preview folder, ZIP, run report, completed prompt archive, gallery card, and lingering exact slug references so the repo does not keep half-removed generated content.
