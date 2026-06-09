# Codex Passes

This folder documents how Codex is used in the factory.

- `codex-final-pass.md` defines the final senior-engineer pass after local generation.
- `codex-fixer-pass.md` defines a targeted repair pass when validation fails and the user approves another Codex run.

The workflows write run-specific prompt files into `reports/runs/<theme-slug>/` so the exact prompts and outputs are preserved.
