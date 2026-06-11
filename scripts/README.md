# Scripts

Canonical scripts are grouped by responsibility. Root-level scripts are compatibility wrappers for older commands.

## Workflows

- `workflows/run-hybrid-ollama-codex-theme-generation.sh` runs the main theme factory workflow for `ollama-only`, `hybrid`, and `codex-only` modes.
- `workflows/run-hybrid-ollama-codex-theme-generation.ps1` is the PowerShell wrapper for the main workflow.
- `workflows/run-theme-generation-workflow.sh` is a short dispatcher to the main workflow.

## Ollama

- `ollama/run-ollama-generation-stage.sh` runs one local Ollama stage such as planner, builder-spec, preview-spec, or review-fix.

## Codex

- `codex/run-codex-automation-pass.sh` runs one Codex automation pass against a prepared prompt file.

## Renderer

- `renderer/render-theme-and-preview-from-site-specification.js` converts the normalized site specification into the WordPress theme, static preview, local images, and gallery entry.

## Validation

- `validation/validate-generated-theme-all.sh` runs the full generated-theme validation suite.
- `validation/validate-wordpress-theme-required-structure.sh` checks required theme files and folders.
- `validation/validate-wordpress-theme-quality-bar.sh` checks filler copy, asset size, image use, enqueues, and homepage completeness signals.
- `validation/validate-static-preview-pages.sh` checks static preview pages, links, local assets, and preview scripts.
- `validation/validate-nolan-menu-header-contract.sh` checks the Nolan-menu header contract.
- `validation/validate-generated-theme-security.sh` checks for secrets, unsafe PHP calls, remote runtime dependencies, and env files.
- `validation/validate-theme-zip-is-fresh.sh` checks the ZIP artifact.
- `validation/validate-pending-and-template-prompt-files.sh` checks pending and template prompt hygiene.
- `validation/validate-prompt-lifecycle-archives.sh` checks completed prompt archives against run reports.

## Packaging

- `packaging/package-generated-wordpress-theme-zip.sh` packages a generated WordPress theme ZIP.
- `packaging/package-generated-wordpress-theme-zip.ps1` is the PowerShell ZIP packager.

## Repo Utilities

- `repo/theme-factory-shared-functions.sh` contains shared namespaced shell functions.
- `repo/print-next-generated-theme-slug.sh` prints the next available generated theme slug.
- `repo/remove-generated-theme-and-artifacts.sh` removes one generated theme and all known generated artifacts.
- `repo/remove-generated-theme-and-artifacts.ps1` is the PowerShell wrapper for removal.

## Release

- `release/create-github-pr-for-generated-theme.sh` validates, commits, pushes, and opens a PR for a generated theme.
