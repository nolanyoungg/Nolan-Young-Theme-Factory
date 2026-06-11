# Ollama Workflow Observations

Date: 2026-06-11

## Observed Problem

The old Ollama builder prompt asked `qwen2.5-coder:14b` to stream a complete WordPress theme and static preview as raw file blocks. In practice, the model produced long Markdown/code-fence output, duplicated and corrupted paths, invented unsupported files, included unfinished comments, and exceeded a 10-minute command timeout before producing parseable factory output.

## Fix Applied

Ollama-only now uses a smaller local-model task:

1. Planner writes a concise implementation plan.
2. Builder-spec writes one compact JSON site specification.
3. `scripts/render-theme-from-spec.js` deterministically renders the full WordPress theme, static preview, local raster images, source files, compiled assets, docs, and gallery card from the JSON.
4. Existing deterministic validators still enforce structure, quality, preview, Nolan-menu, security, and ZIP freshness.

## Result

The same `qwen2.5-coder:14b` model completed the optimized Ollama-only path and generated `001_nolan_young_theme_premium_landscape_design_company`, which built, packaged, and passed full validation.

## Remaining Note

The model still wrapped JSON in a fenced block even when instructed not to. The workflow tolerates this by extracting the first JSON object safely from the raw output.
