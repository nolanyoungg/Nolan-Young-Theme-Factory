# Security policy

## Supported version

Security corrections are applied to the current `main` branch and the newest released theme version. Older site-specific forks must be updated or patched separately.

## Reporting a vulnerability

Do not publish exploitable details in a public issue. Contact the repository owner privately through an established internal channel and include:

- Affected file and version.
- Reproduction steps.
- Expected and observed behavior.
- Potential impact.
- A proposed correction when available.

## Security requirements for changes

- Escape dynamic output at the point of output.
- Sanitize and validate input before use or storage.
- Use nonces and capability checks for state-changing operations.
- Use WordPress APIs for URLs, files, HTTP requests, scripts, styles, database access, and redirects.
- Do not commit secrets, tokens, production credentials, personal data, or environment files.
- Keep persistent and privileged application logic in a plugin rather than in presentation templates.
- Preserve least-privilege GitHub Actions permissions.

The companion plugin must be reviewed separately because it owns form processing, stored records, access rules, and other persistent behavior.
