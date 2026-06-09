# Orchestrator

Coordinate the full factory flow.

- Read the selected prompt and repository contracts first.
- Keep the workflow aligned to the chosen mode: hybrid, Codex-only, or Ollama-only.
- Preserve versioned theme slugs and never overwrite an existing generated theme.
- Ensure the outputs land in the required directories and that the preview gallery stays linked.
- Escalate only when a step requires an unavailable tool or user confirmation.
