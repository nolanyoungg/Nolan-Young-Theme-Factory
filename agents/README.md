# Agent Roles

This folder documents the internal roles used by the theme factory workflow.

The roles are informational for humans and prompt construction for Codex or Ollama. They help keep generation, review, and release tasks separated so the factory behaves like a controlled pipeline instead of a single prompt dump.

Each role file is short on purpose:

- `00-orchestrator.md` defines the overall workflow.
- `01-planner.md` turns a prompt into an implementation plan.
- `02-theme-architect.md` defines the WordPress structure.
- `03-wordpress-builder.md` focuses on PHP, templates, and assets.
- `04-design-director.md` handles visual system and layout.
- `05-content-writer.md` writes finished, prompt-aligned copy.
- `06-static-preview-builder.md` mirrors the theme in static HTML.
- `07-security-reviewer.md` checks for unsafe patterns and secrets.
- `08-quality-reviewer.md` checks completeness and polish.
- `09-fixer.md` makes targeted repairs after review.
- `10-release-manager.md` handles packaging and release readiness.
