# Scripts

This directory contains the small Node.js build tool for the Nolan Young Theme Factory.

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

`ollama-only`: prepare the template, run the full predefined Ollama stage sequence, then build, validate, preview, package, and report. The Ollama sequence uses multiple planned prompts because smaller local models need narrower scope and complete current-file context.

`codex-only`: prepare the template, run one Codex generation pass, then build, validate, preview, package, and report.

`hybrid`: prepare the template, run the full predefined Ollama stage sequence, run one planned Codex creative finish pass, then build, validate, preview, package, and report.

There is no automatic fallback provider and no automatic model-driven cleanup after validation.

A planned generation stage is declared before generation starts, owns a file allowlist, receives current theme context, and always belongs to the selected mode. A repair stage is triggered by a failed check and is prohibited.

Hybrid does not run draft validation before Codex and does not pass validation failures to Codex.

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

## Validation

`validate-theme.js` is read-only. It checks containment, slug format, selected template file structure, required WordPress files, `style.css` headers, PHP syntax when PHP is available, duplicate PHP functions, unresolved SCSS imports, missing local assets, asset expectations, placeholder content, secrets, remote runtime dependencies, machine-specific paths, preview presence, gallery entry, and ZIP structure.

Extra files are allowed. Missing template files are reported and are not restored by validation.

## Artifacts

Generated themes: `wp-content/themes/{theme_slug}/`

Static previews: `docs/Preview-Themes-Github/{theme_slug}/`

Gallery index: `docs/index.html`

ZIP files: `dist/zipped-themes/{theme_slug}.zip`

Run reports: `reports/runs/{theme_slug}/`

Future run reports and ZIPs are ignored by default, with README placeholders allowed.

Preview generation renders actual generated PHP templates through a read-only harness. It fails when rendering fails instead of writing generic substitute pages.

## Adding a Provider or Mode

Add a provider only when it owns a real AI invocation boundary. Keep deterministic work in the top-level command files or `lib/`.

For a new mode, make the sequence obvious in `run-theme-workflow.js`, add dry-run coverage, and do not introduce a generic stage engine for a small fixed set of modes.
