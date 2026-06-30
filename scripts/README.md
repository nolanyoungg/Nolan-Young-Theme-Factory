# Scripts

This directory contains the small Node.js build tool for the Nolan Young Theme Factory.

## Start Here

- [../README.md](../README.md) gives the repo overview and the main entry points.
- [../AGENTS.md](../AGENTS.md) is the repo policy and boundary contract.
- [../docs/REPO-STRUCTURE.md](../docs/REPO-STRUCTURE.md) maps the directory layout and artifact ownership.

## Public Commands

```text
npm run theme:run
npm run theme:resume
npm run theme:prepare
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

The npm command names are the compatibility surface. Internal script paths may change.

## Script Tree

```text
scripts/
  run-theme-workflow.js
  prepare-theme.js
  build-theme.js
  validate-theme.js
  preview-theme.js
  package-theme.js
  delete-theme.js
  check-environment.js
  check-model.js
  lib/
  providers/
  tests/
```

`lib/` contains shared argument, command, path, state, prompt, stage-plan, and model-output helpers. `providers/` contains only Ollama and Codex provider modules. `tests/` contains smoke coverage for the script layer.

## Workflow Modes

`ollama-only`: prepare the template, run one Ollama generation pass per planned batch, then build, validate, preview, package, and report.

`codex-only`: prepare the template, run one Codex generation pass, then build, validate, preview, package, and report.

`hybrid`: prepare the template, run one Ollama batch pass, run one planned Codex creative finish pass, then build, validate, preview, package, and report.

`prepare-theme` can use the bundled starter tree or a custom local template source via `--template-source-path` / `THEME_TEMPLATE_SOURCE_PATH`.

There is no automatic fallback provider and no automatic model-driven cleanup after validation.

A planned generation stage is declared before generation starts, owns a file allowlist, receives current theme context, and always belongs to the selected mode. A repair stage is triggered by a failed check and is prohibited.

Hybrid does not run draft validation before Codex and does not pass validation failures to Codex.

Dry runs report `planned_generation_operations`, `ollama_provider_invocations`, and `codex_provider_invocations`. The workflow does not use the older ambiguous `total_ai_passes` field.

## Prompt Coverage and Budgets

`scripts/lib/prompt-contract.js` parses the selected prompt into numbered sections, subsections, feature requirements, line ranges, stable identifiers, and exact text. Ollama stages in `scripts/lib/ollama-batches.js` declare `promptSections`; missing or nonexistent section coverage blocks Ollama before model invocation.

Each Ollama stage writes a size manifest with total prompt characters, estimated tokens, creative requirement characters, writable context characters, read-only context characters, and file counts. Stages that exceed the context budget fail before provider invocation with no truncation.

## Generated-Theme Boundary

The prepared theme folder is the only AI edit target:

```text
wp-content/themes/{theme_slug}/
```

AI must not create previews, ZIP files, reports, docs, scripts, prompts, or template copies. Deterministic scripts own that work.

Model output is applied through one strict protocol:

```text
---FILE: relative/path.ext---
complete file contents
---END FILE---
```

Every assigned file must be returned exactly once. Unassigned files, duplicate files, malformed formats, Markdown wrappers, JSON alternatives, partial file blocks, and omitted files fail the stage. The application layer does not repair PHP, rewrite SCSS, add fallback CSS, replace URLs, salvage malformed output, or keep starter files when generated files are invalid.

Stage application is transactional. Returned files are applied to a candidate copy first, stage checks run against that candidate, and the live theme directory is swapped only after all checks pass. Stage checks are observational only: PHP lint and duplicate function scans for PHP, import checks for SCSS, `node --check` for JavaScript, and assigned-file presence.

## Validation

`validate-theme.js` is read-only. `--phase source` checks containment, slug format, selected template file structure, required WordPress files, `style.css` headers, PHP syntax when PHP is available, duplicate PHP functions, unresolved SCSS imports, missing local assets, asset expectations, placeholder content, secrets, remote runtime dependencies, and machine-specific paths. `--phase artifacts` checks preview and ZIP artifacts after they are created. `--phase final` records the aggregate final state.

Extra files are allowed. Missing template files are reported and are not restored by validation.

## Artifacts

Generated themes: `wp-content/themes/{theme_slug}/`

Static previews: `docs/Preview-Themes-Github/{theme_slug}/`

Gallery index: `docs/index.html`

ZIP files: `dist/zipped-themes/{theme_slug}.zip`

Run reports: `reports/runs/{theme_slug}/`

Future run reports and ZIPs are ignored by default, with README placeholders allowed.

Every workflow writes `run-timing.json` and `run-timing.md` into the run report directory. These files record mode, model names, Codex reasoning when used, total elapsed time, and workflow step durations. Ollama generation additionally writes `ollama-generation/ollama-stage-timing.json` for per-stage local-model invocation timing.

Preview generation renders actual generated PHP templates through a read-only harness into a temporary sibling directory. It fails when rendering fails instead of writing generic substitute pages and replaces an existing preview only after the candidate is complete.

`theme:resume` is deterministic finalization only. It can rerun build, source validation, preview, package, artifact validation, and final validation. It never invokes AI.

## Adding a Provider or Mode

Add a provider only when it owns a real AI invocation boundary. Keep deterministic work in the top-level command files or `lib/`.

For a new mode, make the sequence obvious in `run-theme-workflow.js`, add dry-run coverage, and keep the orchestration explicit. Do not introduce a generic stage engine for a small fixed set of modes.
