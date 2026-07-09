# 007 Codex Build Validator Failure

Attempted mode: `codex-only`

Attempted model: `gpt-5.5`

Attempted reasoning: `low`

Failure phase: deterministic build validation

The Codex generation pass returned source, but `npm run build` failed during the generated theme's `build/validate.js` step.

Primary failure:

```text
Error: Theme architecture violation: register_post_type() found in inc/atlasframe-data.php.
```

The generated source also reported a known prompt conflict: the prompt allowed private custom post types for form/newsletter storage, while the theme validator prohibits `register_post_type()` and `register_taxonomy()` in theme source. The prompt and runner contract were updated after this failure so future runs must use theme-validator-compatible storage and must not create root-level `403.php`.

Generated theme source was not repaired in place.
