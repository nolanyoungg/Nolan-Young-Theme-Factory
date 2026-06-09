# Security Instructions

- Reject secrets, tokens, private keys, and `.env` values.
- Reject `eval`, `shell_exec`, `passthru`, `system`, and similar unsafe execution patterns.
- Reject remote scripts, analytics snippets, and CDN dependencies unless explicitly required.
- Use escaping and sanitisation helpers in PHP.
