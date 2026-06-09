# File Block Format

Use this exact protocol when a model output should be written to files:

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
