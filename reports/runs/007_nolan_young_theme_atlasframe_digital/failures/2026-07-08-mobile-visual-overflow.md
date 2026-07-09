# 007 Mobile Visual Overflow Failure

Attempted mode: `codex-only`

Attempted model: `gpt-5.5`

Attempted reasoning: `low`

Failure phase: visual preview inspection

The generated theme passed deterministic build, source validation, preview generation, ZIP packaging, and artifact validation, but manual mobile screenshot inspection showed horizontal header overflow at 390px width.

Observed issue:

- The desktop `Contact Us` CTA remained visible in the mobile header and was clipped off the right edge.
- The mobile header did not reduce cleanly to logo plus hamburger.

Evidence:

- `reports/runs/007_nolan_young_theme_atlasframe_digital/failures/2026-07-08-mobile-overflow.png`

Generated theme source was not repaired in place.
