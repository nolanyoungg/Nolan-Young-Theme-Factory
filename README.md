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

Legacy `nolan-showcase-theme-*` outputs may still exist in the repo from earlier runs, but new generated themes should use the numeric `NNN_nolan_young_theme_description` convention.

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

Generated themes must use local, copyright-safe demo images that fit the generated business category. A restaurant theme should use restaurant imagery; a landscaping theme should use landscaping imagery; a photography theme should use photography imagery. Store theme images in:

```text
wp-content/themes/<theme-slug>/assets/images/
```

Store static preview images in:

```text
docs/themes/<theme-slug>/assets/images/
```

Do not use hotlinked images, CDN images, random web images, watermarked stock, client photos, celebrity photos, or gray placeholder boxes. Do not force every theme into a photography, wedding, portrait, or MNY Photo-style visual direction.

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

## How to use

The factory can run all three supported generation modes from the same workflow script:

- `hybrid`: local Ollama planner/builder/preview stages, then one Codex final pass.
- `ollama-only`: local Ollama stages only. This is the local-only option and does not invoke Codex.
- `codex-only`: Codex handles the full generation workflow.

Before any run, create a prompt file in `prompts/pending/`. Do not paste the full creative brief directly into the terminal. The workflow reads `.txt` and `.md` files from that folder.

### macOS

Prerequisites:

- Git.
- Bash, included with macOS.
- Node.js and npm.
- PHP, recommended so validation can lint generated theme PHP.
- `zip` and `unzip`, usually available by default.
- Ollama, required for `hybrid` and `ollama-only`.
- A local Ollama model, recommended: `qwen2.5-coder:14b`.
- Codex CLI, required for `hybrid` and `codex-only`.
- GitHub CLI `gh`, optional but useful for checking CI after pushing.

Clone and enter the repo:

```bash
git clone https://github.com/nolanyoungg/Nolan-Young-Theme-Factory.git
cd Nolan-Young-Theme-Factory
```

Check local tools:

```bash
node --version
npm --version
php --version
ollama list
codex --version
```

Install the preferred local Ollama model if it is missing:

```bash
ollama pull qwen2.5-coder:14b
```

Add a prompt:

```bash
mkdir -p prompts/pending
nano prompts/pending/my-theme-brief.txt
```

Run interactively and choose a mode from the menu:

```bash
bash scripts/run-hybrid-theme-workflow.sh
```

Run Hybrid noninteractively:

```bash
THEME_FACTORY_MODE=hybrid \
THEME_PROMPT_FILE=prompts/pending/my-theme-brief.txt \
OLLAMA_MODEL=qwen2.5-coder:14b \
CODEX_COMMAND=codex \
bash scripts/run-hybrid-theme-workflow.sh
```

Run Ollama only:

```bash
THEME_FACTORY_MODE=ollama-only \
THEME_PROMPT_FILE=prompts/pending/my-theme-brief.txt \
OLLAMA_MODEL=qwen2.5-coder:14b \
bash scripts/run-hybrid-theme-workflow.sh
```

Run Codex only:

```bash
THEME_FACTORY_MODE=codex-only \
THEME_PROMPT_FILE=prompts/pending/my-theme-brief.txt \
CODEX_COMMAND=codex \
bash scripts/run-hybrid-theme-workflow.sh
```

Validate and package a generated theme:

```bash
bash scripts/validate-all.sh 001_nolan_young_theme_landscape_design
bash scripts/package-theme.sh 001_nolan_young_theme_landscape_design
```

After a successful run, review these outputs:

```text
wp-content/themes/<theme-slug>/
docs/themes/<theme-slug>/
dist/zipped-themes/<theme-slug>.zip
reports/runs/<theme-slug>/
```

### Windows PowerShell

Prerequisites:

- Git for Windows, including Git Bash. The PowerShell wrapper calls Bash internally.
- PowerShell 5+ or PowerShell 7+.
- Node.js and npm.
- PHP, recommended so validation can lint generated theme PHP.
- Ollama, required for `hybrid` and `ollama-only`.
- A local Ollama model, recommended: `qwen2.5-coder:14b`.
- Codex CLI, required for `hybrid` and `codex-only`.
- GitHub CLI `gh`, optional but useful for checking CI after pushing.

Clone and enter the repo:

```powershell
git clone https://github.com/nolanyoungg/Nolan-Young-Theme-Factory.git
Set-Location Nolan-Young-Theme-Factory
```

Check local tools:

```powershell
node --version
npm --version
php --version
bash --version
ollama list
codex --version
```

Install the preferred local Ollama model if it is missing:

```powershell
ollama pull qwen2.5-coder:14b
```

Add a prompt:

```powershell
New-Item -ItemType Directory -Force prompts\pending
notepad prompts\pending\my-theme-brief.txt
```

Run interactively and choose a mode from the menu:

```powershell
powershell.exe -ExecutionPolicy Bypass -File scripts\run-hybrid-theme-workflow.ps1
```

Run Hybrid noninteractively:

```powershell
$env:THEME_FACTORY_MODE = 'hybrid'
$env:THEME_PROMPT_FILE = 'prompts/pending/my-theme-brief.txt'
$env:OLLAMA_MODEL = 'qwen2.5-coder:14b'
$env:CODEX_COMMAND = 'codex'
powershell.exe -ExecutionPolicy Bypass -File scripts\run-hybrid-theme-workflow.ps1
```

Run Ollama only:

```powershell
$env:THEME_FACTORY_MODE = 'ollama-only'
$env:THEME_PROMPT_FILE = 'prompts/pending/my-theme-brief.txt'
$env:OLLAMA_MODEL = 'qwen2.5-coder:14b'
powershell.exe -ExecutionPolicy Bypass -File scripts\run-hybrid-theme-workflow.ps1
```

Run Codex only:

```powershell
$env:THEME_FACTORY_MODE = 'codex-only'
$env:THEME_PROMPT_FILE = 'prompts/pending/my-theme-brief.txt'
$env:CODEX_COMMAND = 'codex'
powershell.exe -ExecutionPolicy Bypass -File scripts\run-hybrid-theme-workflow.ps1
```

Validate and package a generated theme:

```powershell
bash scripts/validate-all.sh 001_nolan_young_theme_landscape_design
bash scripts/package-theme.sh 001_nolan_young_theme_landscape_design
```

Clear run environment variables when you are done:

```powershell
Remove-Item Env:\THEME_FACTORY_MODE -ErrorAction SilentlyContinue
Remove-Item Env:\THEME_PROMPT_FILE -ErrorAction SilentlyContinue
Remove-Item Env:\OLLAMA_MODEL -ErrorAction SilentlyContinue
Remove-Item Env:\CODEX_COMMAND -ErrorAction SilentlyContinue
Remove-Item Env:\THEME_SLUG -ErrorAction SilentlyContinue
```

### Choosing a mode

Use `ollama-only` when you want a local-only run and have the preferred model installed. Use `hybrid` when you want local generation plus one Codex finalization pass. Use `codex-only` when Ollama is unavailable or when you want Codex to handle the full generation.

For all modes, the final output is expected to include the WordPress theme, static preview, ZIP package, and run report. Every finished run should pass:

```bash
bash scripts/validate-all.sh <theme-slug>
```


