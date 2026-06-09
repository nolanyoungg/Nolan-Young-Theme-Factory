# AGENTS.md

# Nolan Young Theme Factory — AI Operating Instructions

## Current Repair Addendum

The factory must now favor direct prompt-following and premium finished output over loose multi-agent roleplay.

For every generated theme:

* The selected prompt remains the creative brief.
* The required repository structure is a scaffold, not the design.
* The result must look like a polished premium company website.
* The homepage must be complete and staged with hero, services, work, trust/proof, process, testimonials or proof, industry-appropriate imagery, blog/resource preview, CTA, and footer.
* The Nolan-menu header system is required.
* Local copyright-safe raster image assets are required.
* Static previews must include all seven required pages and visually match the WordPress templates.
* Validation must fail if preview pages, local images, Nolan-menu attributes, local assets, or required templates are missing.

Authoritative supporting contracts:

```text
contracts/premium-output-standard.md
contracts/nolan-menu-header.md
contracts/local-image-rules.md
contracts/required-preview-structure.md
contracts/quality-rules.md
```

## 1. Repository Purpose

This repository is the **Nolan Young Theme Factory**.

Its purpose is to generate complete, polished, installable classic WordPress themes from user-provided prompt files.

The system must support three generation modes:

1. **Hybrid Mode**

   * Ollama performs the local draft generation.
   * Codex performs one final senior-engineer pass.
   * Scripts build assets, package the ZIP, and validate the result.

2. **Codex-Only Mode**

   * Codex performs the complete theme generation.
   * This mode must still produce a full, polished, client-quality website.
   * This is the preferred fallback when Ollama is unavailable.

3. **Ollama-Only Mode**

   * Ollama performs the local generation workflow.
   * No Codex pass is used.
   * This mode is useful for local-only experimentation and lower-cost draft generation.

The repository must not behave like a loose prompt playground. It must behave like a controlled software factory:

```text
prompt file
↓
theme generation
↓
static preview generation
↓
asset build
↓
ZIP packaging
↓
validation
↓
optional finalization/fix pass
```

The expected final output for each theme generation run is:

```text
wp-content/themes/NNN_nolan_young_theme_description/
docs/themes/NNN_nolan_young_theme_description/
dist/zipped-themes/NNN_nolan_young_theme_description.zip
reports/runs/NNN_nolan_young_theme_description/
```

---

## 2. Core Operating Principle

The user’s prompt file is the authoritative creative brief.

Prompt files live in:

```text
prompts/pending/
```

The workflow must not ask the user to paste the main theme prompt directly into the terminal. The user must place a `.txt` or `.md` prompt file into `prompts/pending/`, then select that prompt from the terminal menu.

The prompt file may be:

* very short
* moderately detailed
* extremely detailed
* 50,000+ characters

The system must handle both short and long prompts.

### Short Prompt Behavior

If the user prompt is short, infer missing creative and content details intelligently.

Example:

```text
Create a premium photography website theme.
```

In this case, the system should infer an appropriate page map, brand tone, visual system, content direction, CTAs, portfolio layout, service structure, and static preview.

### Long Prompt Behavior

If the user prompt is long and highly detailed, preserve its intent closely.

Do not rewrite it.

Do not summarize it.

Do not compress it.

Do not replace it with a “better” version.

Do not ignore specific page, content, design, or layout requirements.

A long prompt should be treated as a detailed specification.

The model may only deviate from the user prompt when required by:

1. security rules
2. WordPress correctness
3. required theme structure
4. static preview requirements
5. release artifact requirements

---

## 3. Instruction Priority Order

If instructions conflict, follow this priority order:

1. **Security and safety**
2. **WordPress correctness**
3. **Required theme structure**
4. **Required static preview structure**
5. **Release artifact requirements**
6. **User prompt**
7. **Design/content defaults in this file**
8. **Model convenience**

The user prompt controls the website concept, creative direction, brand tone, layout goals, page content, special features, and stylistic preferences.

The user prompt may not override:

* security requirements
* required output paths
* required file structure
* WordPress runtime correctness
* ZIP packaging requirements
* local-only asset requirements
* validation requirements

---

## 4. Required Repository Structure

The repository should use this structure:

```text
Nolan-Young-Theme-Factory/
├── AGENTS.md
├── README.md
├── .editorconfig
├── .gitignore
│
├── agents/
│   ├── README.md
│   ├── 00-orchestrator.md
│   ├── 01-planner.md
│   ├── 02-theme-architect.md
│   ├── 03-wordpress-builder.md
│   ├── 04-design-director.md
│   ├── 05-content-writer.md
│   ├── 06-static-preview-builder.md
│   ├── 07-security-reviewer.md
│   ├── 08-quality-reviewer.md
│   ├── 09-fixer.md
│   └── 10-release-manager.md
│
├── instructions/
│   ├── 00-global-instructions.md
│   ├── 01-planning-instructions.md
│   ├── 02-theme-scaffolding-instructions.md
│   ├── 03-wordpress-build-instructions.md
│   ├── 04-design-style-instructions.md
│   ├── 05-content-instructions.md
│   ├── 06-static-preview-instructions.md
│   ├── 07-security-instructions.md
│   ├── 08-review-instructions.md
│   ├── 09-fix-instructions.md
│   └── 10-release-instructions.md
│
├── prompts/
│   ├── README.md
│   ├── examples/
│   ├── pending/
│   └── completed/
│
├── contracts/
│   ├── required-theme-structure.md
│   ├── required-preview-structure.md
│   ├── file-block-format.md
│   ├── theme-versioning.md
│   ├── security-rules.md
│   ├── quality-rules.md
│   ├── release-artifact-rules.md
│   ├── premium-output-standard.md
│   ├── nolan-menu-header.md
│   └── local-image-rules.md
│
├── codex/
│   ├── README.md
│   ├── codex-final-pass.md
│   └── codex-fixer-pass.md
│
├── templates/
│   ├── wordpress-theme/
│   └── static-preview/
│
├── wp-content/
│   └── themes/
│
├── docs/
│   ├── index.html
│   ├── assets/
│   └── themes/
│
├── dist/
│   └── zipped-themes/
│
├── reports/
│   ├── README.md
│   └── runs/
│
├── scripts/
│   ├── run-hybrid-theme-workflow.sh
│   ├── run-hybrid-theme-workflow.ps1
│   ├── run-ollama-stage.sh
│   ├── run-codex-final-pass.sh
│   ├── get-next-theme-version.sh
│   ├── validate-all.sh
│   ├── validate-theme-structure.sh
│   ├── validate-theme-quality.sh
│   ├── validate-preview.sh
│   ├── validate-nolan-menu.sh
│   ├── validate-security.sh
│   ├── validate-zip-freshness.sh
│   ├── package-theme.sh
│   └── package-theme.ps1
│
└── .github/
    └── workflows/
        ├── validate-theme.yml
        ├── check-zip-freshness.yml
        └── deploy-preview.yml
```

---

## 5. Generated Theme Versioning

Each generated theme must use the next available versioned slug:

```text
NNN_nolan_young_theme_description
```

Use three-digit numbering plus a short description:

```text
001_nolan_young_theme_landscape_design
002_nolan_young_theme_restaurant_group
003_nolan_young_theme_software_platform
```

The next version must be determined by checking all relevant output locations:

```text
wp-content/themes/
docs/themes/
dist/zipped-themes/
reports/runs/
```

Do not overwrite existing theme versions.

Do not reuse a previously generated slug.

Do not delete older generated themes unless explicitly requested.

A new prompt run should create a new theme version.

---

## 6. Required Generated Theme Output

For each theme slug:

```text
NNN_nolan_young_theme_description
```

the generated WordPress theme must be created at:

```text
wp-content/themes/NNN_nolan_young_theme_description/
```

The generated static preview must be created at:

```text
docs/themes/NNN_nolan_young_theme_description/
```

The generated ZIP must be created at:

```text
dist/zipped-themes/NNN_nolan_young_theme_description.zip
```

The run reports must be created at:

```text
reports/runs/NNN_nolan_young_theme_description/
```

The theme preview must be linked from:

```text
docs/index.html
```

---

## 7. Required WordPress Theme Structure

Every generated WordPress theme must follow this structure exactly:

```text
wp-content/themes/NNN_nolan_young_theme_description/
├── style.css
├── functions.php
├── theme.json
├── screenshot.png
├── README.md
├── .editorconfig
├── .gitignore
├── header.php
├── footer.php
├── front-page.php
├── index.php
├── page.php
├── single.php
├── archive.php
├── search.php
├── searchform.php
├── 404.php
├── 403.php
├── comments.php
├── package.json
├── package-lock.json
├── LICENSE.txt
├── CHANGELOG.md
│
├── inc/
│   ├── setup.php
│   ├── enqueue.php
│   ├── template-tags.php
│   ├── helpers.php
│   ├── custom-post-types.php
│   ├── customizer.php
│   ├── forms.php
│   ├── newsletter.php
│   └── policy-routing.php
│
├── assets/
│   ├── css/
│   │   └── bundle.css
│   ├── js/
│   │   └── bundle.js
│   ├── icons/
│   │   ├── icon1.svg
│   │   └── README.md
│   └── images/
│       ├── hero/
│       ├── portfolio/
│       └── texture/
│
├── src/
│   ├── js/
│   │   └── main.js
│   └── scss/
│       ├── main.scss
│       ├── abstracts/
│       │   ├── _variables.scss
│       │   ├── _mixins.scss
│       │   └── _functions.scss
│       ├── base/
│       │   ├── _reset.scss
│       │   ├── _typography.scss
│       │   ├── _accessibility.scss
│       │   ├── _forms.scss
│       │   └── _newsletter.scss
│       ├── components/
│       │   ├── _buttons.scss
│       │   ├── _cards.scss
│       │   ├── _forms.scss
│       │   ├── _badges.scss
│       │   ├── _accordion.scss
│       │   ├── _carousel.scss
│       │   ├── _portfolio-filter.scss
│       │   └── _before-after.scss
│       ├── layout/
│       │   ├── _container.scss
│       │   ├── _header.scss
│       │   ├── _footer.scss
│       │   ├── _grid.scss
│       │   └── _sections.scss
│       └── pages/
│           ├── _homepage.scss
│           ├── _contact.scss
│           ├── _about-us.scss
│           ├── _services.scss
│           ├── _work.scss
│           ├── _blog.scss
│           └── _policy.scss
│
├── template-parts/
│   ├── content-page.php
│   ├── content-single.php
│   ├── content-none.php
│   ├── content-policy.php
│   ├── content-search.php
│   ├── content-hero.php
│   ├── content-brand-statement.php
│   ├── content-featured-work.php
│   ├── content-all-services.php
│   ├── content-single-service-highlight.php
│   ├── content-process.php
│   ├── content-style-pillars.php
│   ├── content-testimonials.php
│   ├── content-blog-preview.php
│   ├── content-cta-banner.php
│   └── content-footer-widgets.php
│
├── page-templates/
│   ├── template-about-us.php
│   ├── template-services.php
│   ├── template-single-service.php
│   ├── template-work.php
│   ├── template-blog.php
│   ├── template-contact.php
│   └── template-policy.php
│
├── blocks/
│   └── README.md
│
├── build/
│   └── webpack.config.js
│
├── docs/
│   ├── getting-started.md
│   └── customization.md
│
└── accessibility/
    └── README.md
```

Required files must not be skipped.

Required files must not be renamed.

Required folders must not be moved.

Additional files may be added only when they support the generated theme and do not conflict with this structure.

---

## 8. Required Static Preview Structure

Every generated theme must include a static preview at:

```text
docs/themes/NNN_nolan_young_theme_description/
```

Minimum required structure:

```text
docs/themes/NNN_nolan_young_theme_description/
├── index.html
├── homepage_preview.html
├── services_preview.html
├── about-us_preview.html
├── contact_preview.html
├── single_services_preview.html
├── blog_preview.html
├── work_preview.html
├── assets/
│   ├── css/
│   │   └── preview.css
│   ├── js/
│   │   └── preview.js
│   └── images/
│       ├── README.md
│       ├── landscape-garden-pathway.jpg
│       ├── restaurant-plated-dish.jpg
│       ├── construction-framing-crew.jpg
│       ├── software-dashboard-interface.jpg
│       ├── wellness-treatment-room.jpg
│       └── real-estate-kitchen-detail.jpg
└── README.md
```

The static preview must:

* work without WordPress
* work without PHP
* use local assets only
* visually match the generated WordPress templates
* use the same header, footer, class names, section order, copy style, image assets, button styles, and card layouts as the WordPress theme
* include clickable header links between all seven preview pages
* implement the Nolan-menu header data attributes and behavior
* be linked from `docs/index.html`
* avoid CDN dependencies
* avoid remote image URLs
* avoid unfinished placeholder blocks

The preview must feel like a real preview, not a bare file checklist.

---

## 9. Prompt Folder Rules

User prompts must be stored in:

```text
prompts/pending/
```

After a successful run, the workflow may ask whether to move the selected prompt into:

```text
prompts/completed/
```

The default should be **no** unless the user confirms.

The workflow must not overwrite completed prompts.

If moving a prompt would overwrite an existing file, create a safe unique filename.

Prompt files may be `.txt` or `.md`.

Prompt files must not contain secrets, API keys, tokens, passwords, private keys, or credentials.

If a prompt appears to contain secrets, the workflow should warn the user and stop unless the user explicitly handles the issue.

---

## 10. Three Generation Modes

The terminal workflow must offer three modes:

```text
1) Hybrid: Ollama draft + Codex final pass
2) Codex only: Codex handles complete generation
3) Ollama only: Local Ollama generation only
```

The user must choose the mode in the terminal unless a valid noninteractive environment variable is supplied.

### Mode 1: Hybrid

Hybrid mode is the preferred power-user workflow.

It should:

1. select prompt file
2. select installed Ollama model
3. confirm Codex command
4. run Ollama planner stage
5. run Ollama builder stage
6. run npm build
7. run Ollama static preview stage
8. package ZIP
9. validate
10. run Ollama review/fix stage if needed or requested
11. rebuild, repackage, revalidate
12. run one Codex final pass
13. rebuild, repackage, revalidate
14. ask before any additional Codex fixer pass

Hybrid mode should usually use **one Codex run max** unless the user explicitly approves a second Codex fixer pass.

### Mode 2: Codex Only

Codex-only mode should:

1. select prompt file
2. confirm Codex command
3. run Codex full generation pass
4. run npm build
5. package ZIP
6. validate
7. if validation fails, ask the user before running a Codex fixer pass

Codex-only mode must still create a full, impressive, complete website. It must not be treated as a fallback that generates weaker output.

### Mode 3: Ollama Only

Ollama-only mode should:

1. select prompt file
2. select installed Ollama model
3. run Ollama planner stage
4. run Ollama builder stage
5. run npm build
6. run Ollama static preview stage
7. package ZIP
8. validate
9. run Ollama review/fix stage if validation fails
10. rebuild, repackage, revalidate

Ollama-only mode must never invoke Codex.

---

## 11. Model Selection Rules

### Ollama Model Selection

Before any Ollama mode starts, the workflow must:

1. check that the `ollama` command exists
2. check that Ollama responds to `ollama list`
3. display installed Ollama models
4. require the user to choose an installed model

Do not continue with Ollama if the selected model is not installed.

If the user supplied an environment variable:

```bash
OLLAMA_MODEL=<model-name>
```

the workflow must verify that this model appears in `ollama list`.

If Ollama is unavailable in Hybrid mode, the workflow must explain the issue and offer to switch to Codex-only mode.

Do not silently switch modes.

Do not silently pick a model.

### Codex Command Selection

Before any Codex mode starts, the workflow must:

1. check whether a `codex` command exists when possible
2. ask the user to confirm or enter the full Codex command
3. display the selected command before running it

Default Codex command:

```bash
codex
```

Advanced example:

```bash
codex --model gpt-5.5 --reasoning high
```

The exact Codex command must remain configurable per run.

The workflow must not hardcode only one Codex model.

The workflow must save the selected Codex command in the run metadata.

If the user supplied:

```bash
CODEX_COMMAND="codex --model gpt-5.5 --reasoning high"
```

the script may use it, but should still print it clearly.

In interactive mode, ask for confirmation before running Codex.

### No Surprise Usage Rule

Do not run a second Codex pass automatically.

If a Codex final pass fails validation, ask the user:

```text
Validation failed after Codex pass.

Choose next action:
1) Run Codex fixer pass
2) Run Ollama fixer pass if available
3) Stop and inspect manually
```

Default should be:

```text
3) Stop and inspect manually
```

---

## 12. Ollama Stage Design

Ollama generation is divided into local stages.

Supported stages:

```text
planner
builder
preview
review-fix
```

### Planner Stage

Purpose:

* read the user prompt
* read repository instructions
* create an implementation plan
* identify website concept, page map, content direction, design direction, assets, risks, and execution priorities

Inputs:

```text
AGENTS.md
agents/00-orchestrator.md
agents/01-planner.md
instructions/00-global-instructions.md
instructions/01-planning-instructions.md
contracts/theme-versioning.md
contracts/required-theme-structure.md
selected prompt file
```

Output:

```text
reports/runs/NNN_nolan_young_theme_description/plan.md
```

Planner output does not need file blocks.

The planner must not build the theme.

### Builder Stage

Purpose:

* create the WordPress theme
* create the full required file tree
* write PHP templates
* write `inc/` files
* write SCSS source
* write JS source
* write build tooling
* write real content
* create local visual assets
* create a complete client-quality theme draft

Inputs:

```text
AGENTS.md
agents/00-orchestrator.md
agents/02-theme-architect.md
agents/03-wordpress-builder.md
agents/04-design-director.md
agents/05-content-writer.md
instructions/00-global-instructions.md
instructions/02-theme-scaffolding-instructions.md
instructions/03-wordpress-build-instructions.md
instructions/04-design-style-instructions.md
instructions/05-content-instructions.md
contracts/required-theme-structure.md
contracts/file-block-format.md
reports/runs/NNN_nolan_young_theme_description/plan.md
selected prompt file
```

Output:

```text
wp-content/themes/NNN_nolan_young_theme_description/
```

Builder output must use file blocks.

### Preview Stage

Purpose:

* create a static GitHub Pages preview
* visually mirror the generated WordPress theme
* update the preview gallery

Inputs:

```text
AGENTS.md
agents/00-orchestrator.md
agents/06-static-preview-builder.md
instructions/00-global-instructions.md
instructions/06-static-preview-instructions.md
contracts/required-preview-structure.md
contracts/file-block-format.md
reports/runs/NNN_nolan_young_theme_description/plan.md
selected prompt file
generated theme summary/listing
```

Output:

```text
docs/themes/NNN_nolan_young_theme_description/
docs/index.html
```

Preview output must use file blocks.

### Review/Fix Stage

Purpose:

* review locally generated output
* apply local fixes where possible
* check prompt alignment
* check security
* check quality
* check release readiness

Inputs:

```text
AGENTS.md
agents/00-orchestrator.md
agents/07-security-reviewer.md
agents/08-quality-reviewer.md
agents/09-fixer.md
agents/10-release-manager.md
instructions/00-global-instructions.md
instructions/07-security-instructions.md
instructions/08-review-instructions.md
instructions/09-fix-instructions.md
instructions/10-release-instructions.md
contracts/security-rules.md
contracts/quality-rules.md
contracts/release-artifact-rules.md
reports/runs/NNN_nolan_young_theme_description/plan.md
validation output if present
selected prompt file
```

Output:

```text
reports/runs/NNN_nolan_young_theme_description/local-review.md
optional file blocks for fixes
```

File blocks are optional for review-fix, but if present, they must be parsed and applied.

---

## 13. Ollama File Block Protocol

Ollama builder, preview, and fixer outputs must use this exact file block protocol:

```text
---FILE: relative/path/from/repo/root---
file contents here
---END FILE---
```

Example:

```text
---FILE: wp-content/themes/001_nolan_young_theme_landscape_design/style.css---
/*
Theme Name: Nolan Young Theme 001 - Landscape Design
Theme URI: https://example.com/
Author: Nolan Young
Description: Generated classic WordPress theme.
Version: 1.0.0
Text Domain: 001_nolan_young_theme_landscape_design
*/
---END FILE---
```

The file block parser must:

* reject absolute paths
* reject paths containing `..`
* reject empty file paths
* create parent directories as needed
* preserve file contents exactly between markers
* overwrite target files intentionally
* report how many files were written
* fail if a stage expected file blocks but none were found

This protocol exists because Ollama cannot safely edit repo files directly unless the script parses and writes model output.

The planner stage may output normal Markdown.

The review-fix stage may output Markdown plus optional file blocks.

The builder and preview stages must output file blocks.

---

## 14. Codex Final Pass Rules

Codex is used in two ways:

1. finalization after Ollama draft
2. complete generation in Codex-only mode

### Codex Final Pass

When running after an Ollama draft, Codex must behave like a senior software engineer finalizing an existing implementation.

Codex should:

* preserve the user prompt direction
* preserve the generated design intent where reasonable
* avoid rebuilding from scratch unless the existing output is unrecoverable
* fix broken PHP
* fix missing required files
* fix invalid paths
* fix asset enqueueing
* fix build errors
* improve weak styling where clearly needed
* fix static preview mismatch
* remove placeholder/filler content
* fix accessibility issues
* fix security issues
* ensure validation passes
* ensure the theme is installable
* ensure the ZIP is ready to package
* ensure `docs/index.html` links to the preview

Codex should not:

* ignore the user prompt
* replace the design with a generic layout
* delete generated work without cause
* introduce CDN dependencies
* introduce secrets
* skip validation concerns
* run an additional paid/final pass without user confirmation

### Codex-Only Full Mode

In Codex-only mode, Codex must produce the full result:

```text
wp-content/themes/NNN_nolan_young_theme_description/
docs/themes/NNN_nolan_young_theme_description/
docs/index.html update
dist/zipped-themes/NNN_nolan_young_theme_description.zip after packaging
reports/runs/NNN_nolan_young_theme_description/
```

Codex-only mode must not be shallow.

It must create a complete, impressive website-level theme.

It must not only create a plan.

It must edit/create repository files directly.

### Codex Fixer Pass

The Codex fixer pass should be targeted.

It should run only when the user explicitly confirms.

It must:

* read validation output
* fix reported failures
* avoid unrelated redesign
* make minimal complete fixes
* preserve the existing direction
* aim for passing validation

---

## 15. Build Requirements

Every generated theme must support:

```bash
npm install
npm run build
```

The build must produce:

```text
assets/css/bundle.css
assets/js/bundle.js
```

The theme must include:

```text
package.json
package-lock.json
build/webpack.config.js
src/scss/main.scss
src/js/main.js
```

The theme must enqueue compiled files from:

```text
assets/css/bundle.css
assets/js/bundle.js
```

Do not enqueue SCSS source files.

Do not enqueue uncompiled source files.

Use local assets only.

Asset versioning should use `filemtime()` where practical.

If npm is unavailable, scripts must fail clearly and explain that Node/npm must be installed.

Do not fake successful builds.

---

## 16. ZIP Packaging Requirements

Generated ZIPs must be placed in:

```text
dist/zipped-themes/
```

ZIP path:

```text
dist/zipped-themes/NNN_nolan_young_theme_description.zip
```

The ZIP must contain the theme folder itself.

Correct internal ZIP structure:

```text
NNN_nolan_young_theme_description/
├── style.css
├── functions.php
└── ...
```

Incorrect internal ZIP structure:

```text
style.css
functions.php
...
```

Do not include:

```text
node_modules/
.git/
.DS_Store
reports/
temporary workflow outputs
```

Existing ZIPs for the same theme slug should be replaced during packaging.

Packaging must fail clearly if the theme directory is missing.

Packaging must fail clearly if the `zip` command is unavailable.

---

## 17. Validation Requirements

Validation scripts must be deterministic and must not use AI.

Main validator:

```bash
bash scripts/validate-all.sh NNN_nolan_young_theme_description
```

This must run:

```bash
bash scripts/validate-theme-structure.sh NNN_nolan_young_theme_description
bash scripts/validate-theme-quality.sh NNN_nolan_young_theme_description
bash scripts/validate-preview.sh NNN_nolan_young_theme_description
bash scripts/validate-nolan-menu.sh NNN_nolan_young_theme_description
bash scripts/validate-security.sh NNN_nolan_young_theme_description
bash scripts/validate-zip-freshness.sh NNN_nolan_young_theme_description
```

If no generated themes exist yet, repo-level validation should not fail the repository. It should clearly explain that no generated themes are present.

### Theme Structure Validation

Must check:

* theme directory exists
* required root files exist
* required `inc/` files exist
* required assets folders exist
* required SCSS files exist
* required template parts exist
* required page templates exist
* `build/webpack.config.js` exists
* compiled CSS exists
* compiled JS exists
* `style.css` contains a valid `Theme Name`
* `functions.php` exists and is non-empty
* `package.json` exists
* PHP syntax passes if PHP is installed

If PHP is unavailable, warn but do not produce a misleading PHP pass.

### Theme Quality Validation

Must check:

* no `Lorem ipsum`
* no `TODO`
* no “placeholder text”
* no “coming soon” in finished pages
* no “sample service”
* no empty compiled CSS
* no empty compiled JS
* CSS has meaningful size
* JS has meaningful size
* `wp_enqueue_style` exists
* `wp_enqueue_script` exists
* `docs/index.html` links to the preview
* README exists
* CHANGELOG exists

### Preview Validation

Must check:

* `docs/themes/<theme-slug>/index.html` exists
* all seven required preview files exist
* preview header links to every required preview file
* preview CSS exists
* preview JS exists
* preview is not empty
* preview uses local relative assets
* preview includes local raster image assets
* preview contains required Nolan-menu data attributes
* preview trigger buttons include ARIA controls and expanded state
* `docs/index.html` links to preview

### Security Validation

Must check for:

* `OPENAI_API_KEY`
* `sk-` style secret patterns
* private keys
* `.env` files with values
* `eval(`
* `shell_exec(`
* `passthru(`
* `system(`
* suspicious `base64_decode(`
* remote script tags
* CDN links
* obvious hardcoded password/token strings
* unknown analytics/tracking snippets

### ZIP Freshness Validation

Must check:

* ZIP exists
* ZIP contains `<theme-slug>/style.css`
* ZIP is newer than generated theme files
* ZIP does not contain `node_modules/`
* ZIP does not contain `.git/`

---

## 18. Security Requirements

Do not create, commit, or output secrets.

Never create files containing:

```text
OPENAI_API_KEY
API keys
access tokens
passwords
private keys
SSH keys
real .env values
```

Do not include hidden suspicious code.

Do not include unknown third-party JavaScript.

Do not include analytics snippets unless explicitly requested.

Do not include tracking scripts unless explicitly requested.

Do not use remote script tags.

Do not use remote stylesheet links.

Do not use CDN libraries.

Avoid unsafe PHP patterns:

```php
eval()
shell_exec()
exec()
passthru()
system()
```

Avoid suspicious hidden execution patterns such as unnecessary `base64_decode()`.

Use WordPress escaping functions for output:

```php
esc_html()
esc_attr()
esc_url()
wp_kses_post()
```

Use sanitization for input:

```php
sanitize_text_field()
sanitize_email()
sanitize_textarea_field()
```

If form handling is implemented in PHP, use:

* nonces
* sanitization
* validation
* safe redirects
* clear success/error states

Do not create insecure form handlers.

---

## 19. Content Quality Requirements

Generated themes must feel like finished websites.

Do not use:

```text
Lorem ipsum
Placeholder
Sample
Example project
Example service
TODO
Coming soon
Replace this
Dummy content
```

Avoid generic AI marketing filler such as:

```text
We are passionate about excellence.
We help businesses grow.
We provide innovative solutions.
Your success is our mission.
```

Content should be specific to the user prompt.

If the prompt describes a business, write realistic page copy for that business.

If the prompt provides exact copy, preserve it unless it conflicts with security, correctness, or required structure.

The site should include real-feeling sections, believable service descriptions, clear calls to action, and complete page content.

The result should not look like a skeleton.

---

## 20. Design Quality Requirements

Generated themes should be visually impressive and production-oriented.

The design should include:

* polished header
* responsive mobile navigation
* strong hero section
* clear page hierarchy
* finished footer
* styled forms
* styled buttons
* hover/focus states
* responsive cards/grids
* complete homepage sections
* useful archive/search styling
* styled 404 page
* styled 403 page
* styled policy page
* accessible color contrast
* consistent spacing
* consistent typography
* local visual assets or intentional generated visuals

Do not make gray-box placeholder designs.

Do not rely on remote image URLs.

Do not use CDN fonts.

Use:

* local SVGs
* CSS gradients
* CSS patterns
* locally generated visual blocks
* local image files
* texture treatments
* icon assets

The design should be creative, but not at the expense of usability.

---

## 21. WordPress Correctness Requirements

Generated themes must be classic WordPress themes.

They must use:

* valid `style.css` theme header
* `functions.php`
* `header.php`
* `footer.php`
* WordPress template hierarchy files
* page templates
* template parts
* organized `inc/` files
* enqueued assets
* registered menus
* theme support declarations
* proper escaping
* proper sanitization where applicable

Do not create a block-only theme.

Do not rely on a database import.

Do not rely on plugins to make the basic theme work.

The generated theme should be installable in WordPress as a normal theme ZIP.

---

## 22. GitHub Pages Preview Requirements

The static preview must be generated under:

```text
docs/themes/NNN_nolan_young_theme_description/
```

It must be linked from:

```text
docs/index.html
```

The preview should be visually close to the generated WordPress theme.

It must work without:

* WordPress
* PHP
* remote assets
* CDN scripts
* CDN styles

The preview should be useful enough to review the theme visually through GitHub Pages.

It should not be a blank or token preview.

---

## 23. Reports Requirements

Each run must create a reports folder:

```text
reports/runs/NNN_nolan_young_theme_description/
```

Reports may include:

```text
run-metadata.md
plan.md
ollama-planner-prompt.md
ollama-planner-raw.md
ollama-builder-prompt.md
ollama-builder-raw.md
ollama-preview-prompt.md
ollama-preview-raw.md
ollama-review-fix-prompt.md
ollama-review-fix-raw.md
local-review.md
codex-final-prompt.md
codex-fixer-prompt.md
validation-output.txt
release-summary.md
```

Reports should help debug failures.

Do not hide raw model output.

Do not hide validation output.

---

## 24. GitHub Actions Requirements

The repository must include:

```text
.github/workflows/validate-theme.yml
.github/workflows/check-zip-freshness.yml
.github/workflows/deploy-preview.yml
```

### validate-theme.yml

Must run on:

```text
pull_request
push to main
workflow_dispatch
```

It should:

* set up Node
* install needed tooling where practical
* detect changed theme slugs
* run validators for changed themes
* run lightweight repo validation if no generated themes changed

### check-zip-freshness.yml

Must run on:

```text
pull_request
push to main
workflow_dispatch
```

It should:

* detect changed theme slugs
* check only matching changed theme ZIPs
* not require every old ZIP to be rebuilt

### deploy-preview.yml

Must run on:

```text
push to main
workflow_dispatch
```

It should:

* deploy `docs/` to GitHub Pages
* use official GitHub Pages actions
* avoid deployment on pull requests

---

## 25. Script Quality Requirements

All Bash scripts must:

```bash
#!/usr/bin/env bash
set -Eeuo pipefail
```

Scripts must:

* validate inputs
* quote variables
* resolve repo root
* print clear progress messages
* print clear errors
* avoid fake success
* avoid destructive behavior
* fail clearly when tools are missing
* avoid relying on current directory unless explicitly set
* be usable from the repository root
* support interactive mode
* support noninteractive environment variables where appropriate

PowerShell scripts must:

* use strict error handling
* validate paths
* mirror Bash behavior where practical
* provide clear messages

---

## 26. Environment Variables

The main workflow may support:

```bash
THEME_FACTORY_MODE=hybrid|codex|ollama
THEME_PROMPT_FILE=prompts/pending/example.txt
OLLAMA_MODEL=<installed-model>
CODEX_COMMAND="codex --model gpt-5.5 --reasoning high"
SKIP_CODEX_FINAL=1
SKIP_OLLAMA_REVIEW_FIX=1
SKIP_NPM_BUILD=1
SKIP_PACKAGE=1
SKIP_VALIDATE=1
```

If environment variables are supplied, scripts may skip matching interactive prompts.

If required environment variables are invalid, fail clearly.

Do not silently pick defaults that could cause unexpected model usage.

---

## 27. Definition of Done

A theme generation run is complete only when all of these exist:

```text
wp-content/themes/NNN_nolan_young_theme_description/
docs/themes/NNN_nolan_young_theme_description/
dist/zipped-themes/NNN_nolan_young_theme_description.zip
reports/runs/NNN_nolan_young_theme_description/
```

The generated theme must:

* follow the required theme structure
* contain complete WordPress files
* contain complete source SCSS/JS
* contain compiled CSS/JS
* include a static GitHub Pages preview
* be linked from `docs/index.html`
* include a packaged ZIP
* avoid lorem ipsum
* avoid unfinished placeholders
* avoid CDN dependencies
* avoid remote assets
* avoid secrets
* pass basic validation

The workflow should print final paths:

```text
Theme:
wp-content/themes/NNN_nolan_young_theme_description/

Preview:
docs/themes/NNN_nolan_young_theme_description/

ZIP:
dist/zipped-themes/NNN_nolan_young_theme_description.zip

Reports:
reports/runs/NNN_nolan_young_theme_description/
```

It should also print suggested next commands:

```bash
git status
git add .
git commit -m "Add NNN_nolan_young_theme_description"
git push
```

---

## 28. No Surprise Codex Usage

Codex usage must be explicit.

Hybrid mode should run at most one Codex final pass by default.

Codex-only mode should run one Codex full pass by default.

A Codex fixer pass must require user confirmation unless a deliberate noninteractive setting says otherwise.

If validation fails after a Codex pass, ask:

```text
Validation failed after Codex pass.

Choose next action:
1) Run Codex fixer pass
2) Run Ollama fixer pass if available
3) Stop and inspect manually
```

Default:

```text
3) Stop and inspect manually
```

Do not silently run another Codex command.

---

## 29. Model Independence

The repository must not hardcode one permanent Ollama model.

The repository must not hardcode one permanent Codex model.

Every run should make model choice clear.

Ollama models must be selected from installed local models.

Codex command must be configurable.

The user must be able to run different themes with different model choices.

---

## 30. Final Operating Summary

This repository is a controlled AI-assisted WordPress theme factory.

It must be able to:

1. accept complex prompt files
2. preserve the user’s prompt exactly
3. generate complete classic WordPress themes
4. generate matching GitHub Pages previews
5. use Ollama locally when selected
6. use Codex for finalization or full generation when selected
7. avoid surprise Codex usage
8. build assets with npm
9. package installable ZIPs
10. validate structure, quality, security, preview, and ZIP freshness
11. produce polished, impressive, client-quality website themes

The goal is not to generate toy demos.

The goal is to generate complete, visually impressive, production-oriented WordPress themes with repeatable automation and clear quality gates.



