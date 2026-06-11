# File Block Format

Use this exact protocol when a model output should be written directly to files.

Normal Ollama-only full generation does not ask the local model to emit the whole theme as file blocks. The builder-spec stage emits compact JSON, and `scripts/render-theme-from-spec.js` renders the required theme and preview deterministically.

Use file blocks for targeted fixer output or other small model-produced patches:

```text
---FILE: relative/path/from/repo/root---
file contents here
---END FILE---
```

Rules:

- Paths must be relative.
- Paths must not be empty.
- Paths must not be absolute.
- Paths must not contain `..`.
- Parent directories should be created automatically.
- File contents between markers must be preserved exactly.
