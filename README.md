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

Reusable repo-agnostic prompt starters live in `prompts/template prompts/`. Copy one into `prompts/pending/`, rename it, and customize only the business, audience, content, look, feel, and website goals.

Prompt files must not contain secrets, API keys, tokens, passwords, private keys, or unpublished customer data.

After a successful run, the workflow moves the exact selected prompt to `prompts/completed/` using the generated slug as a filename prefix. It also records the prompt lifecycle in the run report. Completed prompt archives are never overwritten.

Example completed prompt archive:

```text
prompts/completed/002_nolan_young_theme_landscape_design__premium-landscape-design-company.txt
```

To reuse a prior creative brief, copy a completed prompt back into `prompts/pending/` with a new descriptive filename and edit it for the next run. Do not rerun stale completed prompt text by accident.

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

Use the removal utility when a generated theme should be completely removed from the repo.

Preview what would be removed:

```bash
bash scripts/repo/remove-generated-theme-and-artifacts.sh 005_nolan_young_theme_example --dry-run
```

Remove the generated theme artifacts:

```bash
bash scripts/repo/remove-generated-theme-and-artifacts.sh 005_nolan_young_theme_example --yes
```

PowerShell:

```powershell
powershell.exe -ExecutionPolicy Bypass -File scripts\repo\remove-generated-theme-and-artifacts.ps1 005_nolan_young_theme_example -DryRun
powershell.exe -ExecutionPolicy Bypass -File scripts\repo\remove-generated-theme-and-artifacts.ps1 005_nolan_young_theme_example -Yes
```

The removal utility deletes:

- `wp-content/themes/<slug>/`
- `docs/themes/<slug>/`
- `dist/zipped-themes/<slug>.zip`
- `reports/runs/<slug>/`
- `prompts/completed/<slug>__*.txt`
- `prompts/completed/<slug>__*.md`
- the matching preview card in `docs/index.html`

Root-level scripts such as `scripts/remove-theme.sh`, `scripts/validate-all.sh`, and `scripts/run-hybrid-theme-workflow.sh` remain as compatibility wrappers. New work should use the role-based script names documented in `scripts/README.md`.

## Detailed Walkthrough

### 2026-06-11

The Nolan Young Theme Factory turns a creative brief into a complete installable classic WordPress theme, a static preview, a ZIP package, and run reports. The prompt belongs in `prompts/pending/` as a `.md` or `.txt` file. The prompt should describe the business, product, audience, page content, visual style, color system, navigation needs, forms, accessibility expectations, and conversion goals. It should not mention repo paths, commands, validation, packaging, generated slugs, workflow modes, CI, GitHub Pages, or implementation filenames. See `prompts/template prompts/` for fill-in skeletons.

The factory supports three modes:

- `ollama-only`: uses the selected local Ollama model for planning and compact JSON site-spec generation, then renders the theme deterministically without Codex.
- `hybrid`: uses Ollama for the local draft/spec/render path, then runs one Codex senior-engineer final pass.
- `codex-only`: uses Codex to generate the complete output directly when selected.

In Ollama modes, the workflow verifies Ollama is installed, asks for or validates an installed model such as `qwen2.5-coder:14b`, runs the planner stage, then asks Ollama for one compact JSON site specification. The local renderer reads that specification and creates the WordPress theme, static preview pages, local raster images, source files, compiled assets, docs, and gallery card. This keeps local models focused on creative and structural decisions instead of streaming hundreds of files.

The renderer is intentionally category-aware but must not be category-locked. It can use strong defaults for known categories such as software, CRM/SaaS, logistics, finance, food, local services, healthcare/wellness, ecommerce, education, nonprofit, and general business. If the prompt describes a CRM or full software product, the generated site should use product-specific copy, dashboard-style imagery, feature pages, customer stories, demo CTAs, and form-admin/export language rather than drifting into a lawn care, landscape, insurance, logistics, or generic agency website.

After rendering, the workflow runs the generated theme build with `npm install` and `npm run build`, packages the ZIP, and validates the result. Validation checks required theme structure, compiled assets, local image usage, preview pages, header/menu behavior, security, ZIP freshness, prompt hygiene, and prompt lifecycle. A successful run moves the selected prompt from `prompts/pending/` into `prompts/completed/` with the generated slug as a prefix, and records a lifecycle note in the run report.

Script naming is role-based:

- workflow scripts live in `scripts/workflows/`
- Ollama scripts live in `scripts/ollama/`
- Codex scripts live in `scripts/codex/`
- renderer scripts live in `scripts/renderer/`
- validators live in `scripts/validation/`
- packaging scripts live in `scripts/packaging/`
- repo utilities live in `scripts/repo/`
- release helpers live in `scripts/release/`

The normal local Ollama-only command is:

```bash
THEME_FACTORY_MODE=ollama-only \
THEME_PROMPT_FILE=prompts/pending/my-theme-brief.md \
OLLAMA_MODEL=qwen2.5-coder:14b \
bash scripts/workflows/run-hybrid-ollama-codex-theme-generation.sh
```

Before writing a new prompt from scratch, copy one of the skeletons from `prompts/template prompts/`, fill in the brackets, remove unused optional sections, and keep the brief focused on the website the user wants generated.
