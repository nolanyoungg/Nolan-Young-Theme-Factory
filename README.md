# Nolan Young Theme Factory

This repository is a controlled factory for generating installable classic WordPress themes from prompt files in `prompts/pending/`.

It supports three modes:

1. Hybrid: Ollama draft stages, then one Codex final pass.
2. Codex only: Codex handles the full generation.
3. Ollama only: local Ollama stages only, with no Codex invocation.

## Core Outputs

Each generated theme run should produce:

- `wp-content/themes/NNN_nolan_young_theme_description/`
- `docs/themes/NNN_nolan_young_theme_description/`
- `dist/zipped-themes/NNN_nolan_young_theme_description.zip`
- `reports/runs/NNN_nolan_young_theme_description/`

The next slug is determined across:

- `wp-content/themes/`
- `docs/themes/`
- `dist/zipped-themes/`
- `reports/runs/`

## Workflow Scripts

- `bash scripts/run-hybrid-theme-workflow.sh`
- `bash scripts/run-hybrid-theme-workflow.sh codex-only`
- `bash scripts/run-hybrid-theme-workflow.sh ollama-only`
- `powershell.exe -File scripts/run-hybrid-theme-workflow.ps1`

Legacy compatibility still works:

- `bash scripts/run-theme-workflow.sh`

## Environment Variables

- `THEME_FACTORY_MODE`: `hybrid`, `codex-only`, or `ollama-only`
- `THEME_PROMPT_FILE`: path to the prompt file in `prompts/pending/`
- `OLLAMA_MODEL`: required for Ollama modes; for example `qwen2.5-coder:14b`
- `CODEX_COMMAND`: full Codex command prefix, for example `codex` or `codex --model gpt-5.5 --reasoning high`
- `THEME_SLUG`: override the next versioned slug if you need to target a specific generated run

## Ollama-Only Example

```bash
THEME_FACTORY_MODE=ollama-only \
THEME_PROMPT_FILE=prompts/pending/web-dev-company-local-ollama-theme.txt \
OLLAMA_MODEL=qwen2.5-coder:14b \
bash scripts/run-hybrid-theme-workflow.sh
```

## Validation

Run validation for a generated theme with:

```bash
bash scripts/validate-all.sh NNN_nolan_young_theme_description
```

If you omit the slug, the validator scans all generated themes. If none exist, it reports that fact and exits cleanly.

## Packaging

Package a theme ZIP with:

```bash
bash scripts/package-theme.sh NNN_nolan_young_theme_description
```

The package script keeps the ZIP in `dist/zipped-themes/` and includes the theme folder itself.

## Preview Gallery

The gallery is served from `docs/index.html`. Each generated preview card links to `docs/themes/<theme-slug>/homepage_preview.html`.

Each generated preview directory must include:

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
- local raster images in `assets/images/`

The preview pages must visually match the WordPress templates. They should use the same header, footer, class names, section order, copy style, local images, button styles, cards, and responsive assumptions.

## Nolan-Menu Header

Generated themes must implement the Nolan-menu header system:

- Desktop header layout: logo, primary nav, Contact Us CTA.
- Primary nav items: `Services`, `About`, `Work`, `Blog`.
- Contact is only the right-side CTA, not a primary nav item.
- Services, About, and Blog use dropdown panels with the required `data-menu-item` and `data-menu-dropdown` attributes.
- Dropdown rails use matching `data-rail-item` and `data-rail-content` keys.
- JavaScript must handle open/close, one active panel, Escape, outside click, scroll lock, backdrop, rail switching, and mobile drawer behavior.

See `contracts/nolan-menu-header.md`.

## Image Assets

Generated themes must use local, copyright-safe demo photography. Store theme images in:

```text
wp-content/themes/<theme-slug>/assets/images/
```

Store static preview images in:

```text
docs/themes/<theme-slug>/assets/images/
```

Do not use hotlinked images, CDN images, random web images, watermarked stock, client photos, celebrity photos, or gray placeholder boxes.

## CI And Live Verification

Every pushed generated theme should pass these GitHub Actions workflows on `main`:

- `Validate Theme`
- `Check ZIP Freshness`
- `Deploy Preview`

After pushing, verify the live remote and workflow status:

```bash
git ls-remote origin refs/heads/main
gh run list --repo nolanyoungg/Nolan-Young-Theme-Factory --branch main --limit 10
```

The remote `main` SHA must match local `git rev-parse HEAD`. The latest validation and ZIP freshness runs must be green before treating the repository as updated. The Pages workflow deploys the `docs/` folder and can also be run manually from GitHub Actions.


