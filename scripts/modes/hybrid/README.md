# Hybrid Mode

Hybrid mode does not have a standalone generation script. It composes:

- `scripts/modes/ollama-only/generate-theme.js` for the Ollama draft
- `scripts/modes/ollama-only/repair-theme.js` for targeted Ollama repair when validation requires it
- `scripts/modes/codex-only/create-codex-theme-brief.js` for the Codex finish brief
- `scripts/run-theme-workflow.js` for stage ordering, validation, preview, packaging, and reports

Keep hybrid behavior coordinated through the workflow runner so it stays consistent with `config/workflow-modes.json`.
