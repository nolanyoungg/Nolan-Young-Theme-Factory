# AI Workflow

The workflow is template-first. A template is copied into `wp-content/themes/{theme_slug}/` before AI generation starts, and AI may edit only that prepared folder.

Normal operation goes through npm scripts backed by `scripts/run-theme-workflow.js`.

## Sequence

```text
resolve arguments and defaults
check requested models and local commands
prepare the selected template
record the prepared-template baseline
run the selected planned generation mode
preserve raw generated output
freeze generated hashes
build assets once
run source validation
generate static preview
rebuild preview gallery
package ZIP
run artifact validation
write final report
```

Validation, preview generation, and packaging are deterministic. They report failures but do not rewrite generated theme source to make checks pass.

Model output is applied without semantic modification. The output layer parses only the documented file-block protocol, enforces the stage file allowlist, requires every assigned file exactly once, rejects duplicates and unassigned files, writes atomically, and records hashes. It does not fix PHP, rewrite SCSS, invent CSS, replace URLs, salvage malformed formats, or retain starter files in place of invalid generated files.

Planned generation stages are declared before generation starts and always belong to the selected mode. Prompt count is not repair. A repair stage is any prompt or deterministic source rewrite triggered by build or validation failure; repair stages are prohibited.

The selected prompt is parsed before planning. Numbered `## NN.` sections, `###` subsections, `####` feature requirements, line ranges, stable identifiers, and exact text are recorded. Ollama stage plans declare prompt section ownership, and missing coverage blocks an Ollama run before provider invocation.

No prompt section is silently trimmed. Every Ollama stage records a context-budget manifest and fails before invoking the provider if the creative requirements plus writable and read-only file context exceed the configured budget.

## Modes

### `ollama-only`

Runs the full predefined Ollama stage sequence against the prepared theme folder. The local generation sequence uses smaller prompts because local models need reduced scope, exact writable-file allowlists, relevant dependency context, and complete current file contents.

```sh
npm run theme:run -- --mode ollama-only --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --ollama-model qwen2.5-coder:14b
```

### `codex-only`

Runs one Codex generation pass against the prepared theme folder.

```sh
npm run theme:run -- --mode codex-only --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --codex-model gpt-5.5 --codex-reasoning medium
```

### `hybrid`

Runs the full predefined Ollama stage sequence followed by one planned Codex creative finish pass.

```sh
npm run theme:run -- --mode hybrid --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --ollama-model qwen2.5-coder:14b --codex-model gpt-5.5 --codex-reasoning medium
```

Hybrid does not run draft validation before Codex, does not pass validation failures to Codex, and does not add a third AI pass.

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

Ollama runs the configured prompt-aware stage sequence, so a slow full Ollama pass can run for several hours before the workflow times out. Override with `--ollama-timeout-ms` only when you intentionally want a different per-stage limit.

```sh
npm run theme:model-check -- --provider ollama --ollama-model qwen2.5-coder:14b
npm run theme:model-check -- --provider codex --codex-model gpt-5.5 --codex-reasoning high
```

The workflow never substitutes another model after a failure.

## Failure Handling

Generation failure means the provider process failed or could not start.

A generated theme can finish generation while failing build, validation, preview, or ZIP packaging. Those failures are recorded separately, and safe finalization steps continue where possible.

Failed generated output is valid evidence. Improving a failed run requires improving prompts or stage definitions and starting a fresh run.

Ollama stage application is transactional: preserve the raw response, parse the complete file-block contract, apply files to a candidate copy, run stage checks on the candidate, and atomically replace the live theme only after checks pass. Failed candidate stages leave the live theme unchanged.

Codex runs from the prepared theme directory with `--cd`, `--sandbox workspace-write`, and `--ephemeral`. The workflow snapshots the repository around the Codex process and blocks on out-of-bound changes.

Preview generation is also transactional. It renders into a temporary sibling directory, verifies expected pages and warning-free output, then swaps the preview into place. An existing preview is not deleted before the candidate succeeds.

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

Key files include `run.config.json`, `workflow.state.json`, `prompt-coverage.json`, provider raw outputs, per-stage application manifests, context-size manifests, `generated-theme-hashes.json`, `build.report.json`, `validation.source.json`, `validation.artifacts.json`, `validation.final.json`, and `workflow.summary.json`.

The starter template includes `assets/images/asset-manifest.json`. Third-party asset provenance must come from that manifest; models may create original local SVG marks, icons, textures, and illustrations without claiming they are photographs.
