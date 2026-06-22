# AI Workflow

The workflow is template-first. A template is copied into `wp-content/themes/{theme_slug}/` before AI generation starts, and AI may edit only that prepared folder.

Normal operation goes through npm scripts backed by `scripts/run-theme-workflow.js`.

## Sequence

```text
resolve arguments and defaults
check requested models and local commands
prepare the selected template
record the prepared-template baseline
run the selected generation mode
preserve raw generated output
build assets once
validate the generated theme
generate static preview
rebuild preview gallery
package ZIP
write final report
```

Validation, preview generation, and packaging are deterministic. They report failures but do not rewrite generated theme source to make checks pass.

## Modes

### `ollama-only`

Runs the Ollama provider batches against the prepared theme folder.

```sh
npm run theme:run -- --mode ollama-only --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --ollama-model qwen2.5-coder:14b
```

### `codex-only`

Runs one Codex generation pass against the prepared theme folder.

```sh
npm run theme:run -- --mode codex-only --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --codex-model gpt-5.5 --codex-reasoning medium
```

### `hybrid`

Runs an Ollama draft followed by one Codex finish pass.

```sh
npm run theme:run -- --mode hybrid --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --ollama-model qwen2.5-coder:14b --codex-model gpt-5.5 --codex-reasoning medium
```

Hybrid does not add a third AI pass.

## Dry Run

```sh
npm run theme:run -- --mode hybrid --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --dry-run
```

Dry run prints the resolved plan and output paths without copying templates, writing state, installing dependencies, creating previews, creating ZIPs, or invoking AI providers.

## Model Checks

Routine model checks validate executable availability, Ollama model tags, Codex CLI availability, model identifier format, and reasoning-level format.

Live provider checks require `--live-model-check`.

Default timeouts are intentionally conservative for local models:

```text
Ollama generation: 45 minutes per batch
Model checks: 5 minutes
Codex generation: 10 minutes
Build and deterministic commands: 2 minutes
```

Ollama runs five focused batches, so a slow full Ollama pass can run for several hours before the workflow times out. Override with `--ollama-timeout-ms` only when you intentionally want a different per-batch limit.

```sh
npm run theme:model-check -- --provider ollama --ollama-model qwen2.5-coder:14b
npm run theme:model-check -- --provider codex --codex-model gpt-5.5 --codex-reasoning high
```

The workflow never substitutes another model after a failure.

## Failure Handling

Generation failure means the provider process failed or could not start.

A generated theme can finish generation while failing build, validation, preview, or ZIP packaging. Those failures are recorded separately, and safe finalization steps continue where possible.

Final statuses are:

```text
completed
completed-with-failures
blocked
```

## Reports

Each run writes under:

```text
reports/runs/{theme_slug}/
```

Key files include `run.config.json`, `workflow.state.json`, provider raw outputs, `build.report.json`, `validation.final.json`, and `workflow.summary.json`.
