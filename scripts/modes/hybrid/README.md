# Hybrid Mode

Hybrid mode does not have a standalone generation script. It composes:

- `scripts/modes/ollama-only/run-ollama-theme-pass.js` for the Ollama draft
- `scripts/modes/codex-only/create-codex-theme-brief.js` for the Codex finish brief
- `scripts/workflow/run-theme-workflow.js` for stage ordering, validation, preview, packaging, and reports

Keep hybrid behavior coordinated through the workflow runner so it stays consistent with `config/workflow-modes.json`.
