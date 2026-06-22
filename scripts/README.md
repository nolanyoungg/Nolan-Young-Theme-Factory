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

`lib/` contains shared argument, command, path, state, prompt, and model-output helpers. `providers/` contains only Ollama and Codex provider modules. `tests/` contains smoke coverage for the script layer.

## Workflow Modes

`ollama-only`: prepare the template, run Ollama generation batches, then build, validate, preview, package, and report.

`codex-only`: prepare the template, run one Codex generation pass, then build, validate, preview, package, and report.

`hybrid`: prepare the template, run an Ollama draft, run one Codex finish pass, then build, validate, preview, package, and report.

There is no automatic fallback provider and no automatic model-driven cleanup after validation.

## Generated-Theme Boundary

The prepared theme folder is the only AI edit target:

```text
wp-content/themes/{theme_slug}/
```

AI must not create previews, ZIP files, reports, docs, scripts, prompts, or template copies. Deterministic scripts own that work.

## Validation

`validate-theme.js` is read-only. It checks containment, slug format, selected template file structure, required WordPress files, `style.css` headers, PHP syntax when PHP is available, asset expectations, placeholder content, secrets, remote runtime dependencies, machine-specific paths, preview presence, gallery entry, and ZIP structure.

Extra files are allowed. Missing template files are reported and are not restored by validation.

## Artifacts

Generated themes: `wp-content/themes/{theme_slug}/`

Static previews: `docs/Preview-Themes-Github/{theme_slug}/`

Gallery index: `docs/index.html`

ZIP files: `dist/zipped-themes/{theme_slug}.zip`

Run reports: `reports/runs/{theme_slug}/`

Future run reports and ZIPs are ignored by default, with README placeholders allowed.

## Adding a Provider or Mode

Add a provider only when it owns a real AI invocation boundary. Keep deterministic work in the top-level command files or `lib/`.

For a new mode, make the sequence obvious in `run-theme-workflow.js`, add dry-run coverage, and do not introduce a generic stage engine for a small fixed set of modes.
