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

## 002 AstraGrid Test

The sanitized AstraGrid prompt was repo-agnostic and passed prompt hygiene validation. The first `002` run generated valid theme artifacts, but the workflow treated the missing completed prompt archive as a validation failure before the successful run had a chance to move the prompt. That triggered the Ollama review-fix stage unnecessarily, and the local model responded with Markdown prose instead of file blocks.

Fix applied:

1. In-progress workflow validation skips prompt lifecycle checks.
2. The prompt is archived to `prompts/completed/` only after generated artifacts pass validation.
3. Prompt lifecycle validation runs immediately after the archive is created.
4. Planner prompts were shortened and made business-facing so they do not feed repo paths, slugs, validation details, or implementation filenames into later stages.

The corrected `qwen2.5-coder:14b` rerun generated `002_nolan_young_theme_astragrid_systems`, built assets, packaged the ZIP, archived the prompt, and passed artifact plus prompt lifecycle validation.

## 003 Ironline Logistics Test

The Ironline prompt confirmed that prompt files can stay business-only and repo-agnostic. The first logistics run passed validators, but review of the normalized spec showed a factory issue: loose category matching treated substrings like `ai` inside ordinary words and generic planner headings like `Risks` as category signals. That incorrectly pushed a logistics brief toward the tech/finance fallback style.

Fix applied:

1. Category detection now uses explicit whole-word business terms.
2. Category precedence prevents one prompt from accumulating multiple visual systems.
3. Weak model specs are topped up from category-specific defaults so short or incomplete JSON does not under-deliver required page depth.
4. Logistics defaults now provide twelve customer scenario cards and twelve local project images.

The corrected rerun generated `003_nolan_young_theme_ironline_freight_systems` with logistics-specific copy, imagery direction, CSS, twelve work cards, a fresh ZIP, and completed prompt archival.

## 004 Harborview Insurance Test

The Harborview prompt was created from the 003 prompt shape but removed all logistics-specific language. The prompt described only the business, audience, design direction, page expectations, interactions, accessibility, and quality bar.

Result:

1. `qwen2.5-coder:14b` generated a compact business-facing plan and JSON spec.
2. The renderer correctly selected the insurance/financial advisory category.
3. The generated theme used the finance visual layer only.
4. The work page produced six client scenario cards as requested.
5. The prompt was moved from `prompts/pending/` to `prompts/completed/` after validation succeeded.

Token-efficiency note:

The optimized Ollama path is behaving better when the model only plans and emits compact JSON. The deterministic renderer should keep absorbing structure, validation, asset, and packaging requirements so prompt files do not need repo details and local models are not asked to stream thousands of file blocks.

## 005 FlowLedger CRM Test

The first FlowLedger CRM run completed validation, but post-run review showed the output was not acceptable. The normalized spec drifted into logistics/freight defaults because category detection saw the prompt's negative quality-bar phrase saying the site should not look like a logistics site. Since logistics was checked before CRM/SaaS/product language, the renderer topped up the model's partial CRM JSON with freight services, freight resources, freight proof, and logistics visual CSS.

Fix applied:

1. CRM/SaaS/product language now has category-detection priority over logistics.
2. Category detection ignores sentences containing negative steering phrases such as not, avoid, should not, must not, and without.
3. The bad `005_nolan_young_theme_flowledger_crm_platform` artifacts were removed through the repo removal utility.
4. The same FlowLedger prompt was restored to `prompts/pending/` for a clean rerun.

Final rerun result:

1. `qwen2.5-coder:14b` produced a CRM/product-focused plan and compact JSON spec.
2. The renderer normalized the spec to `FlowLedger CRM` and filled weak model sections with CRM-specific defaults instead of freight, lawn, restaurant, or insurance defaults.
3. Generated content now centers on pipeline management, contact/account records, task automation, reporting dashboards, role-based views, implementation support, CRM resources, customer stories, and export-ready form entries.
4. Legacy design-token names from older service-site output were neutralized before writing generated CSS and `theme.json`, so the final 005 artifacts use generic `--color-*` tokens and `primary`/`surface` palette slugs.
5. The prompt was archived to `prompts/completed/005_nolan_young_theme_flowledger_crm_platform__flowledger-crm-platform.md`, `prompts/pending/` returned to only `.gitkeep`, and full validation passed after ZIP packaging.
