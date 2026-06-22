# Scripts

This directory contains the Node-only automation for the Nolan Young Theme Factory. Windows and macOS use the same implementation. Bash and platform-specific workflow scripts were removed because npm scripts are the public command layer and each operation should have one canonical Node implementation.

AI generation is limited to prepared theme source under `wp-content/themes/{theme_slug}/`. Deterministic tooling owns template copying, validation, build, preview generation, preview gallery rebuilds, ZIP creation, state, reports, environment checks, and model checks.

## Folder Map

| Folder | Purpose | Belongs here | Does not belong here | Public entrypoint |
| --- | --- | --- | --- | --- |
| `ai-output/` | Applies model output safely. | File-block parsing, JSON payload salvage, unsafe path rejection, PHP lint before write. | Provider invocation, template copy, ZIP or preview work. | Internal. |
| `briefs/` | Builds shared generation context. | Prompt loading, AI edit boundary, preview contract. | Provider-specific command execution. | Internal. |
| `build/` | Builds theme assets. | Theme-local npm install/build, Sass regeneration, bundle checks. | Theme generation or validation policy. | `npm run theme:build`. |
| `environment/` | Reports environment and model access. | Tool discovery, mode-aware dependency checks, provider/model probes. | Workflow orchestration. | `theme:env`, `theme:model-check`. |
| `modes/codex-only/` | Codex-specific behavior. | Codex build/finish brief construction and Codex prompt contract. | Template copy, preview, ZIP, shared validation. | Internal. |
| `modes/hybrid/` | Hybrid mode notes. | Composition documentation only. | Copied Ollama or Codex implementations. | Internal. |
| `modes/ollama-only/` | Ollama-specific behavior. | Ollama batch definitions, generation prompt construction, targeted repair. | Shared deterministic work. | Internal. |
| `shared/` | Reusable infrastructure. | Args, repo root, command runner, diagnostics, constants, path helpers, model validation/access. | One-off business logic or mode behavior. | Internal. |
| `template-theme-copy/` | Prepares a theme from a template. | Template selection, numbering, slugging, copy, metadata updates, template source, manifest. | AI generation. | `theme:prepare`. |
| `theme-cleanup/` | Deletes generated theme artifacts. | Exact-slug cleanup for theme source, static preview, ZIP, and run report. | Template source deletion, broad cleanup, AI repair. | `theme:delete`. |
| `theme-preview/` | Static previews and gallery. | PHP preview harness, preview folder generation, gallery rebuild/validation. | Theme generation or packaging. | `theme:preview`, `theme:preview:index`. |
| `theme-zipping/` | Cross-platform packaging. | Node ZIP creation, exclusions, top-level theme folder. | Shell `zip`, PowerShell archives, generation. | `theme:zip`. |
| `validation/` | Deterministic checks and reports. | Template-aware checks, WordPress quality, PHP syntax, preview/ZIP checks, reports. | Provider repair loops. | `theme:validate`, internal reports. |
| `workflow/` | Workflow support tests. | Script-level smoke tests and dry-run checks. | Public workflow runners. | `test:scripts`. |

`scripts/run-theme-workflow.js` is the only public workflow entrypoint. Files under `workflow/` are not competing workflow commands.

## Public npm Commands

### Complete Workflow

```text
npm run theme:run -- --mode <ollama-only|codex-only|hybrid> --prompt <prompt-file> [options]
```

Required: `--mode`, `--prompt`.

Common options: `--template`, `--theme-slug`, `--ollama-model`, `--codex-model`, `--codex-reasoning`, `--dry-run`, `--replace-existing-theme`, `--model-check-timeout-ms`, `--ollama-timeout-ms`, `--codex-timeout-ms`, `--command-timeout-ms`.

Examples:

```text
npm run theme:run -- --mode ollama-only --prompt "prompts/pending/example.md" --ollama-model "qwen2.5-coder:14b"
npm run theme:run -- --mode codex-only --prompt "prompts/pending/example.md" --codex-model "gpt-5.4-mini" --codex-reasoning "low"
npm run theme:run -- --mode hybrid --prompt "prompts/pending/example.md" --ollama-model "qwen2.5-coder:14b" --codex-model "gpt-5.5" --codex-reasoning "high"
```

Expected outputs: generated theme source, run report, preview folder, rebuilt gallery, ZIP, validation reports.

### Resume Workflow

```text
npm run theme:resume -- --theme-slug "000_nolan_young_theme_example"
```

Resumes a saved workflow state such as pending Codex or ready-for-finalization.

### Prepare Theme

```text
npm run theme:prepare -- --prompt "prompts/pending/example.md" [--template NOLAN-YOUNG-theme-000] [--theme-slug "000_nolan_young_theme_example"]
```

Copies the selected template into `wp-content/themes/{theme_slug}/`, updates deterministic metadata, and records template source.

### Validate Theme

```text
npm run theme:validate -- --theme-slug "000_nolan_young_theme_example" [--template NOLAN-YOUNG-theme-000]
```

Checks template structure, WordPress quality, PHP syntax when PHP is available, preview artifacts, gallery entry, and ZIP contents.

### Build Assets

```text
npm run theme:build -- --theme-slug "000_nolan_young_theme_example"
```

Installs theme-local dependencies only when `node_modules/` is absent, using `npm install --ignore-scripts --no-audit --no-fund`, runs the theme build, regenerates Sass when available, and requires `assets/css/bundle.css` plus `assets/js/bundle.js`.

### Preview

```text
npm run theme:preview -- --theme-slug "000_nolan_young_theme_example"
npm run theme:preview:index
```

`theme:preview` renders static pages from the actual theme PHP templates. `theme:preview:index` rebuilds and validates `docs/index.html`.

### ZIP

```text
npm run theme:zip -- --theme-slug "000_nolan_young_theme_example"
```

Creates `dist/zipped-themes/{theme_slug}.zip` with the theme folder as the top-level entry. Excludes `node_modules/`, `.git/`, `.generation/`, `reports/`, `*.log`, and `*.map`.

### Delete Theme Artifacts

```text
npm run theme:delete -- --theme-slug "000_nolan_young_theme_example" --yes
npm run theme:delete -- --theme-slug "000_nolan_young_theme_example" --dry-run
```

Deletes only the exact generated artifacts for one validated slug:

```text
wp-content/themes/{theme_slug}/
docs/Preview-Themes-Github/{theme_slug}/
dist/zipped-themes/{theme_slug}.zip
reports/runs/{theme_slug}/
```

The command prints the deletion plan first, requires `--yes` unless `--dry-run` is used, and rebuilds/validates the preview gallery afterward. Use `--skip-gallery` only when running a controlled batch and rebuilding the gallery separately.

### Environment

```text
npm run theme:env -- --mode <all|ollama-only|codex-only|hybrid|preview|build>
```

Reports operating system, Node, npm, Git, PHP, Ollama, Codex, installed Ollama models, and configured paths. Dependencies are mode-aware: preview and ZIP commands do not require AI tools.

Add `--model-check` to run the same shared static provider validation used by workflow startup and `theme:model-check`. This checks exact configured or supplied model identifiers without a live provider request unless `--live-model-check` is also supplied.

```text
npm run theme:env -- --mode codex-only --model-check --codex-model "gpt-5.5" --codex-reasoning "high"
npm run theme:env -- --mode ollama-only --model-check --ollama-model "qwen2.5-coder:14b"
```

### Model Check

```text
npm run theme:model-check -- --provider ollama --ollama-model "qwen2.5-coder:14b"
npm run theme:model-check -- --provider codex --codex-model "gpt-5.5" --codex-reasoning "high"
npm run theme:model-check -- --provider hybrid --ollama-model "qwen2.5-coder:14b" --codex-model "gpt-5.5" --codex-reasoning "high"
```

Validates exact provider/model/reasoning access. Codex runs `codex exec -m MODEL -c model_reasoning_effort="LEVEL" ... -` from a temporary directory with read-only sandbox and no Git-repo requirement. Ollama checks exact installed tags and runs the exact requested model. No fallback model is selected after failure.

Use `--dry-run` or `--skip-live` to skip live provider probes.

### Script Smoke Tests

```text
npm run test:scripts
```

Runs script syntax checks, JSON checks, dry-run checks for all modes, model/reasoning validation tests, command-failure classification tests, stale reference searches, path edge cases, and a mode-aware environment check. It does not invoke live AI providers.

## Existing Explicit Slugs

When `--theme-slug` is supplied, the workflow uses that exact slug. If the theme folder, preview folder, ZIP, or run report already exists, the workflow stops unless `--replace-existing-theme` is also supplied.

Replacement deletes only:

```text
wp-content/themes/{theme_slug}/
docs/Preview-Themes-Github/{theme_slug}/
dist/zipped-themes/{theme_slug}.zip
reports/runs/{theme_slug}/
```

Automatic next-number behavior applies only when `--theme-slug` is omitted.

## Workflow Modes

### Ollama-Only

1. Resolve configuration and exact Ollama model.
2. Validate Ollama executable, service, installed exact tag, `ollama show`, and live runtime probe.
3. Prepare theme from template.
4. Create generation brief and template manifest.
5. Run five focused Ollama generation batches: shell, template-parts, pages, assets, forms-helpers.
6. Build assets after generation.
7. Run pre-finish validation and quality checks.
8. Run one targeted Ollama repair only when deterministic validation identifies affected files.
9. Rebuild assets after repair when repair runs.
10. Generate preview, rebuild gallery, create ZIP, run final validation, write summary.

Normal AI invocation count: five Ollama generation invocations.
Maximum repair count: one targeted repair stage, with one invocation per affected file.

### Codex-Only

1. Resolve configuration and exact Codex model/reasoning.
2. Validate Codex executable, version, `codex exec --help`, CLI options, and live model/reasoning access.
3. Prepare theme from template.
4. Create generation brief, manifest, and pre-finish validation report.
5. Create one Codex build brief preserving the Theme 012 contract.
6. Run one Codex build invocation.
7. Build assets, generate preview, rebuild gallery, create ZIP, run final validation, write summary.

Normal AI invocation count: one Codex build invocation.
Routine finish or repair stages are not added as safety nets.

### Hybrid

1. Resolve exact Ollama model plus exact Codex model/reasoning.
2. Validate both providers before generation begins.
3. Prepare theme from template.
4. Create generation brief and manifest.
5. Ollama owns the draft using the five focused batches.
6. Deterministic validation evaluates the draft.
7. Codex owns one focused finish brief.
8. Build assets, generate preview, rebuild gallery, create ZIP, run final validation, write summary.

Normal AI invocation count: five Ollama generation invocations plus one Codex finish invocation.
Hybrid never downgrades to a single-provider mode after a provider check fails.

## AI Invocation Policy

Capability checks are reported separately from theme-generation invocations.

Generation stages are not retried with different models. A command retry may only repeat the exact same command after a classified transient failure, and command retries are currently disabled by default.

Targeted repair is allowed only after deterministic validation identifies a specific rule and affected file set. Repair is not used for template copying, paths, numbering, metadata, ZIP creation, asset compilation, gallery rebuilding, report writing, dependency installation, or state management.

## Cross-Platform Support

Required runtime: Node.js. External tools are invoked through the shared command runner with argument arrays.

Mode-specific tools:

- Ollama-only: Ollama and PHP for full validation/preview.
- Codex-only: Codex CLI and PHP for full validation/preview.
- Hybrid: Ollama, Codex CLI, and PHP.
- Preview/build/ZIP-only commands do not require AI tools.

Filesystem work uses Node `fs` and `path`. ZIP creation uses Node packages, not shell `zip` or PowerShell `Compress-Archive`. Windows `.cmd` executables are resolved in the shared command runner.

## Adding a Future Mode

Add mode-specific AI behavior under `scripts/modes/{mode-name}/`. Do not copy template preparation, validation, build, preview, ZIP, reporting, AI-output parsing, command execution, or resume logic. Update `config/workflow-modes.json`, teach `scripts/run-theme-workflow.js` the stage ordering if a new ownership pattern is required, and add dry-run/smoke coverage.
