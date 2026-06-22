# Script Architecture Audit

Date: 2026-06-22

This audit records the planning evidence for the Node-only `scripts/` architecture.
Current `main` already contains the prior Node-only refactor merged through PRs #9 and #10, so this pass verifies and tightens that architecture instead of recreating a second command layer.

## Current Counts

- Total files under `scripts/`: 30
- JavaScript files: 28
- Markdown files: 2
- Bash files: 0
- PowerShell, batch, or command files under `scripts/`: 0

## Fixed Decisions

- Node.js is the only supported repository automation runtime.
- `package.json` npm scripts are the public command layer.
- `scripts/run-theme-workflow.js` is the only public workflow entrypoint.
- No `scripts/theme-factory.js` exists or should be created.
- Mode folders contain only provider-specific AI behavior.
- Shared deterministic work stays outside mode folders.
- Exact model identifiers, reasoning levels, and explicit theme slugs are not substituted.
- Dry runs do not create, replace, delete, or invoke live AI models.

## Final Folder Structure

```text
scripts/
  README.md
  run-theme-workflow.js
  ai-output/
  briefs/
  build/
  environment/
  modes/
    codex-only/
    hybrid/
    ollama-only/
  shared/
  template-theme-copy/
  theme-preview/
  theme-zipping/
  validation/
  workflow/
```

## Public npm Commands

```text
npm run theme:run
npm run theme:resume
npm run theme:prepare
npm run theme:validate
npm run theme:build
npm run theme:preview
npm run theme:preview:index
npm run theme:zip
npm run theme:env
npm run theme:model-check
npm run test:scripts
```

## File-by-File Migration Table

### `scripts/run-theme-workflow.js`

Current purpose: public workflow entrypoint, stage orchestration, state, resume, finalization, model preflight, and reports.
Public entrypoint: yes.
Callers: `npm run theme:run`, `npm run theme:resume`, smoke tests, documentation.
Duplicates: historical `scripts/run-theme-workflow.sh` and `scripts/workflows/*` Bash runners.
Unique Bash behavior preserved: explicit stage order, model handoff, validation/finalization gates.
Decision: retain as the only public workflow entrypoint; keep internal workflow modules only when they remove real complexity.
Canonical replacement: same file.

### `scripts/ai-output/apply-theme-file-blocks.js`

Current purpose: parse AI file blocks, reject unsafe paths, validate generated PHP/CSS/SCSS, and apply complete file contents inside a prepared theme.
Public entrypoint: internal CLI.
Callers: Ollama generation and repair scripts.
Duplicates: none active.
Unique Bash behavior preserved: not applicable; this is the canonical deterministic safe-apply layer.
Decision: retain.
Canonical replacement: same file.

### `scripts/briefs/create-theme-generation-brief.js`

Current purpose: create the shared generation brief and hard edit boundary.
Public entrypoint: internal CLI.
Callers: workflow, Ollama generation, Ollama repair, Codex brief creation.
Duplicates: none active.
Unique Bash behavior preserved: historical prompt boundary text from shell runners is preserved and strengthened.
Decision: retain.
Canonical replacement: same file.

### `scripts/build/build-theme-assets.js`

Current purpose: install theme dependencies when needed, run theme-local build, run Sass fallback, verify required bundles.
Public entrypoint: `npm run theme:build`.
Callers: workflow, package scripts, smoke tests.
Duplicates: historical `scripts/build/build-theme-assets.sh`.
Unique Bash behavior preserved: `npm install --ignore-scripts --no-audit --no-fund`, `npm run build`, Sass fallback, bundle timestamp refresh, bundle existence checks.
Decision: retain Node implementation.
Canonical replacement: same file.

### `scripts/environment/check-environment.js`

Current purpose: mode-aware environment report for Node, npm, Git, PHP, Ollama, Codex, paths, and optional provider checks.
Public entrypoint: `npm run theme:env`.
Callers: user/automation and smoke tests.
Duplicates: historical shell environment checks.
Unique Bash behavior preserved: command availability checks; current Node adds cross-platform executable resolution.
Decision: retain and route optional provider checks through shared model-access logic.
Canonical replacement: same file plus `scripts/shared/model-access.js`.

### `scripts/environment/check-model-access.js`

Current purpose: standalone exact provider/model/reasoning validation.
Public entrypoint: `npm run theme:model-check`.
Callers: user/automation.
Duplicates: none active.
Unique Bash behavior preserved: exact Ollama installed-model check; current Node adds Codex CLI/help/live probe.
Decision: retain.
Canonical replacement: same file plus `scripts/shared/model-access.js`.

### `scripts/modes/codex-only/create-codex-theme-brief.js`

Current purpose: build Codex build, finish, and targeted repair briefs.
Public entrypoint: internal CLI.
Callers: workflow.
Duplicates: historical Codex shell runners.
Unique Bash behavior preserved: edit boundary, bounded command guidance, no packaging/gallery work inside Codex.
Decision: retain; preserve Theme 012 Codex-only contract.
Canonical replacement: same file.

### `scripts/modes/hybrid/README.md`

Current purpose: document hybrid composition.
Public entrypoint: no.
Callers: documentation only.
Duplicates: none.
Unique Bash behavior preserved: hybrid stage ownership from historical workflow runners.
Decision: retain.
Canonical replacement: same file.

### `scripts/modes/ollama-only/batch-definitions.js`

Current purpose: canonical Ollama batch definitions, shared output format, shared generation rules, and focused prompt section selection.
Public entrypoint: no.
Callers: Ollama generation and repair scripts.
Duplicates: historical inline batch prompt definitions in `run-ollama-theme-pass.sh`.
Unique Bash behavior preserved: five focused batches and core output rules; current Node adds more template-part, path, and SCSS safeguards.
Decision: retain.
Canonical replacement: same file.

### `scripts/modes/ollama-only/generate-theme.js`

Current purpose: run the exact selected Ollama model across canonical batches and apply safe output.
Public entrypoint: internal CLI.
Callers: workflow.
Duplicates: historical `run-ollama-theme-pass.sh` and old Node compatibility names.
Unique Bash behavior preserved: exact model tag check, `OLLAMA_NOHISTORY=1`, `ollama run <model> --nowordwrap`, raw outputs, batch prompts.
Decision: retain.
Canonical replacement: same file.

### `scripts/modes/ollama-only/repair-theme.js`

Current purpose: one deterministic-findings-driven Ollama targeted repair stage.
Public entrypoint: internal CLI.
Callers: workflow.
Duplicates: historical `run-ollama-quality-repair-pass.sh`.
Unique Bash behavior preserved: placeholder detection and targeted file context.
Changed deliberately: old two-pass per-file loop was replaced with one validation-driven repair stage, matching the current repair policy.
Decision: retain.
Canonical replacement: same file.

### `scripts/shared/args.js`

Current purpose: shared named argument parser.
Public entrypoint: no.
Callers: most CLI scripts.
Duplicates: old positional shell parsing.
Unique Bash behavior preserved: positional compatibility where still useful.
Decision: retain.
Canonical replacement: same file.

### `scripts/shared/command-runner.js`

Current purpose: command resolution, Windows `.cmd` handling, child process execution, redaction, diagnostics, and failure classification.
Public entrypoint: no.
Callers: workflow, build, model access, validation, preview, smoke tests.
Duplicates: historical direct shell command invocations.
Unique Bash behavior preserved: external tool execution; current Node adds structured diagnostics and cross-platform resolution.
Decision: retain.
Canonical replacement: same file.

### `scripts/shared/constants.js`

Current purpose: shared paths, required bundles, validation patterns, ZIP exclusions, and command failure codes.
Public entrypoint: no.
Callers: most deterministic scripts.
Duplicates: historical repeated regexes and file lists.
Unique Bash behavior preserved: required file, ZIP exclusion, and placeholder checks.
Decision: retain.
Canonical replacement: same file.

### `scripts/shared/model-access.js`

Current purpose: canonical Ollama and Codex executable/model/reasoning validation, live probes, and probe caching.
Public entrypoint: no.
Callers: workflow, environment, standalone model-check, Ollama generation/repair.
Duplicates: old inline Ollama list checks and direct Codex assumptions.
Unique Bash behavior preserved: exact Ollama tag matching.
Decision: retain.
Canonical replacement: same file.

### `scripts/shared/model-config.js`

Current purpose: exact model identifier and reasoning validation plus suggestions for common informal names.
Public entrypoint: no.
Callers: workflow, model-access, smoke tests.
Duplicates: none active.
Unique Bash behavior preserved: none; this is new canonical behavior.
Decision: retain.
Canonical replacement: same file.

### `scripts/shared/repo-root.js`

Current purpose: repository root and script path resolution.
Public entrypoint: no.
Callers: all scripts.
Duplicates: historical `dirname "${BASH_SOURCE[0]}"` root logic.
Unique Bash behavior preserved: repo-root discovery, now path-module based.
Decision: retain.
Canonical replacement: same file.

### `scripts/shared/theme-utils.js`

Current purpose: theme slug validation, template validation, safe relative paths, artifact planning/removal, walking, numbering, and slug generation.
Public entrypoint: no.
Callers: workflow, preparation, validation, smoke tests.
Duplicates: old slug regexes and artifact cleanup shell logic.
Unique Bash behavior preserved: next-number scan across themes, previews, ZIPs, and reports; exact artifact removal.
Decision: retain.
Canonical replacement: same file.

### `scripts/template-theme-copy/create-template-manifest.js`

Current purpose: canonical template manifest generation.
Public entrypoint: internal CLI.
Callers: workflow and smoke tests.
Duplicates: historical `scripts/templates/create-template-manifest.js` path.
Unique Bash behavior preserved: not applicable.
Decision: retain current location.
Canonical replacement: same file.

### `scripts/template-theme-copy/prepare-theme-from-template.js`

Current purpose: canonical template copy, slug selection, metadata update, template source recording, and copied scaffold completion.
Public entrypoint: `npm run theme:prepare`.
Callers: workflow and user/automation.
Duplicates: historical `scripts/templates/prepare-theme-from-template.sh` and old Node path.
Unique Bash behavior preserved: prompt slugification, next-number behavior, environment/positional compatibility, metadata updates, `.theme-template-source`.
Decision: retain Node implementation.
Canonical replacement: same file.

### `scripts/theme-preview/generate-static-preview.js`

Current purpose: canonical static preview generation through a PHP harness.
Public entrypoint: `npm run theme:preview`.
Callers: workflow.
Duplicates: historical preview shell scripts.
Unique Bash behavior preserved: PHP-based rendering and preview asset copy.
Decision: retain.
Canonical replacement: same file.

### `scripts/theme-preview/rebuild-preview-gallery.js`

Current purpose: rebuild `docs/index.html` preview gallery.
Public entrypoint: `npm run theme:preview:index`.
Callers: workflow and user/automation.
Duplicates: historical docs/gallery shell update paths.
Unique Bash behavior preserved: gallery card rebuild.
Decision: retain.
Canonical replacement: same file.

### `scripts/theme-preview/validate-preview-gallery.js`

Current purpose: validate preview folders and gallery entries.
Public entrypoint: internal CLI.
Callers: workflow and `theme:preview:index --validate`.
Duplicates: historical static preview validators.
Unique Bash behavior preserved: preview/gallery completeness checks.
Decision: retain.
Canonical replacement: same file.

### `scripts/theme-zipping/zip-theme.js`

Current purpose: canonical cross-platform ZIP creation with exclusions.
Public entrypoint: `npm run theme:zip`.
Callers: workflow and user/automation.
Duplicates: historical `package-theme.sh`, `package-theme.ps1`, and packaging shell/PowerShell scripts.
Unique Bash behavior preserved: top-level theme folder and exclusions for `node_modules`, `.git`, `.generation`, `reports`, logs, and maps.
Decision: retain Node `archiver` implementation.
Canonical replacement: same file.

### `scripts/validation/theme-quality-check.js`

Current purpose: human-readable deterministic WordPress quality check.
Public entrypoint: internal CLI.
Callers: workflow and aggregate validator.
Duplicates: historical shell quality validators.
Unique Bash behavior preserved: PHP syntax, required files, placeholders, secrets, remote runtime references, repo-local paths.
Decision: retain.
Canonical replacement: same file.

### `scripts/validation/validate-generated-theme-all.js`

Current purpose: aggregate generated theme validation including template, quality, preview, ZIP, and gallery checks.
Public entrypoint: `npm run theme:validate`.
Callers: user/automation.
Duplicates: historical shell aggregate validators.
Unique Bash behavior preserved: generated artifact completeness checks.
Decision: retain.
Canonical replacement: same file.

### `scripts/validation/validate-theme-from-template.js`

Current purpose: template-aware file preservation validation.
Public entrypoint: internal CLI.
Callers: workflow and aggregate validator.
Duplicates: historical `validate-theme-from-template.sh`.
Unique Bash behavior preserved: template source fallback, same-relative-path required file checks, path boundary check.
Decision: retain Node implementation.
Canonical replacement: same file.

### `scripts/validation/write-theme-validation-report.js`

Current purpose: machine-readable validation report for workflow state and repair decisions.
Public entrypoint: internal CLI.
Callers: workflow.
Duplicates: overlaps checks with `theme-quality-check.js` by design for report output.
Unique Bash behavior preserved: deterministic validation gate before AI repair.
Decision: retain; do not merge into the human CLI unless the report contract remains intact.
Canonical replacement: same file.

### `scripts/workflow/smoke-test-scripts.js`

Current purpose: script-level static, model-config, stale-reference, path, dry-run, and environment smoke tests.
Public entrypoint: `npm run test:scripts`.
Callers: user/automation and PR checks where configured.
Duplicates: historical smoke shell script.
Unique Bash behavior preserved: stale shell reference guard and workflow dry-run validation.
Decision: retain and expand.
Canonical replacement: same file.

## Historical Bash Comparison Summary

The named Bash counterparts were recoverable from commit `17c6433` and removed by the earlier Node-only refactor. Their useful behavior is already represented in the current Node implementations:

- `run-ollama-theme-pass.sh`: five batches, exact Ollama model tag check, `OLLAMA_NOHISTORY`, file-block format, and safe apply are preserved in `modes/ollama-only/generate-theme.js` plus `batch-definitions.js`.
- `run-ollama-quality-repair-pass.sh`: placeholder-targeted repair is preserved, but the old two-attempt loop is intentionally reduced to one targeted repair stage.
- `prepare-theme-from-template.sh`: numbering, slugification, copy, metadata, package rename, and `.theme-template-source` are preserved and expanded in `template-theme-copy/prepare-theme-from-template.js`.
- `build-theme-assets.sh`: npm install/build, Sass fallback, bundle freshness, and required bundle checks are preserved in `build/build-theme-assets.js`.
- `package-theme.sh`: top-level archive folder and exclusions are preserved in `theme-zipping/zip-theme.js`; shell `zip` and PowerShell fallback are removed.
- `validate-theme-from-template.sh`: slug validation, theme boundary check, template source fallback, and required file checks are preserved in `validation/validate-theme-from-template.js`.

## Model Validation Plan

- Validate syntax locally before execution.
- Use `scripts/shared/model-config.js` for canonical model/reasoning strings.
- Use `scripts/shared/model-access.js` for all Ollama and Codex executable, CLI, installed-model, and live access checks.
- Use exact argument arrays:
  - Ollama: `ollama run <exact-tag>`
  - Codex: `codex exec -m <model> -c model_reasoning_effort="<reasoning>" -`
- Never replace a requested model, reasoning level, or provider.
- Cache live provider probes by exact provider/model/reasoning combination in one process.
- Record requested and resolved values in run config, workflow state, model-check reports, and workflow summary.

## Cross-Platform Plan

- Use Node `fs`, `path`, `os`, and `child_process.spawnSync`.
- Resolve `.cmd` shims through `scripts/shared/command-runner.js`.
- Use `archiver`/`yauzl` for ZIP creation and validation.
- Keep forward slashes only for reports, archive paths, and AI relative paths.
- Test path handling for Windows separators, POSIX-style paths, spaces, and parentheses.
- Direct platform tested: Windows.
- macOS coverage: path and command-resolution tests plus Node APIs; physical macOS execution remains a residual risk unless run separately.

## PR Execution Plan

1. Branch `refactor/node-only-npm-script-architecture`
   - Scope: architecture hardening, docs, static/dry-run tests.
   - Validation: `npm run test:scripts`, stale shell searches, syntax checks.
2. Branch `test/ollama-only-theme-014`
   - Exact slug: `014_nolan_young_theme_premium_test014`.
   - Exact model: `qwen2.5-coder:14b`.
3. Branch `test/codex-only-theme-015`
   - Exact slug: `015_nolan_young_theme_premium_test015`.
   - Exact model/reasoning: `gpt-5.4-mini`, `low`.
4. Branch `test/hybrid-theme-016`
   - Exact slug: `016_nolan_young_theme_premium_test016`.
   - Exact models/reasoning: `qwen2.5-coder:14b`, `gpt-5.5`, `high`.

Each branch starts from updated `main`, opens one PR, waits for checks, merges with the repository's merge-commit convention, deletes remote/local branch, returns to `main`, and pulls before the next branch.
