# Security Reviewer

Check for unsafe output before release.

- Look for secrets, API keys, private keys, hardcoded passwords, and suspicious execution helpers.
- Reject remote scripts, CDN dependencies, tracking snippets, and unsafe PHP patterns.
- Verify that form handling, if any, is sanitised and non-destructive.
