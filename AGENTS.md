# Nolan Young Theme Factory — Agent Policy

The primary product is a polished, multi-page static website sample and its local GitHub Pages gallery. WordPress conversion is a separate, explicitly selected operation. This policy supersedes the former WordPress-first generation policy for new runs; preserve all historical output and evidence.

## Boundaries and identities

- Static samples: `docs/Preview-Themes-Github/NNN_nolan_young_theme_description/`.
- Gallery: `docs/index.html`. Retain existing URLs, numbered slugs, and all nine legacy page filenames. Never renumber or overwrite samples.
- Static reports and local-model checkpoints: `reports/static/{sample_slug}/`, never public docs.
- Explicit converted WordPress themes: `wp-content/themes/{new_output_slug}/`.
- WordPress ZIPs: `dist/zipped-themes/{new_output_slug}.zip`.
- Conversion reports and private harness previews: `reports/conversions/{new_output_slug}/`.
- Historical `reports/runs/`, WordPress themes, ZIPs, assets, failed attempts, and `wordpress-themplate-themes` remain preserved. That spelling is intentional.

## Static generation

The default flow is brief → static scaffold → approved local assets/manifest → one selected generation mode → static validation → browser and screenshot review → local gallery update → artifact checks → report.

The runner prepares the sample. During generation, the model may write only HTML, browser CSS/JavaScript, content.json and README.md inside that sample. It must preserve sample.json, images, icons and the approved manifest unchanged. No PHP, WordPress starter, packages, build tools, ZIPs, private provider details, reports, gallery edits, repository edits, commits, or publication from generation. Static commands never invoke conversion, PHP rendering or WordPress packaging.

Codex runs one ephemeral generation pass in the prepared directory with its writable sandbox. The runner hashes repository files outside that output before/after generation and records boundary violations, including changes to already-dirty files. It also checks protected identity/assets after generation. No second AI cleanup or repair pass. Models may self-audit within the original pass.

## Local modes and integrity

Only `codex-only`, `ollama-only`, and `lmstudio-only` exist. Ollama defaults to `http://127.0.0.1:11434/v1`; LM Studio defaults to `http://127.0.0.1:1234/v1`. Use their shared OpenAI-compatible provider. No CLI generation, silent fallback, hybrid mode or model installation.

Before local generation, verify the exact model ID and required structured tool calling. Six declared stages cover identity/content, navigation, layouts/pages, plain CSS, browser interactions, and documentation. Each stage has explicit prompt ownership, bounded read/write scopes and checks. Missing prompt coverage blocks invocation. Planned overlap is documented; it is not a repair pass.

Keep bounded actual source context, read-only list/read/excerpt/search tools, at most 12 tool calls per stage, 40KB per response, one malformed-tool retry and a 30-minute stage timeout. The only accepted edit is one unified diff. Validate paths, reject traversal/absolute paths/symlinks/binary writes, apply in a candidate, run observational checks, and replace transactionally. Never invent missing source or salvage failed output.

Checkpoint version 2 binds prompt, scaffold implementation, provider, model, stage policy, asset manifest and current sample hashes. Explicit `--resume-local` continuation requires matching successful-stage evidence. Failed sessions cannot resume. Old WordPress checkpoint versions are incompatible; preserve them and start a new sample.

## Assets

Acquire and approve assets before generation. Prefer existing approved local files, then reusable permissive stock, new verified permissive stock, and original graphics when appropriate. Never use unverified search images, incompatible licenses, invented provenance or hotlinks. Models may use only supplied approved files; original inline interface SVG/CSS graphics may be authored, but are not photographs.

`theme:assets` is provider-neutral. Shared approved files live in `assets/approved-stock/`, `assets/generated-images/` or `assets/manifests/`. Copied files belong in the selected sample's assets directory. Record id, file, source, source_url, license, license_url, creator, creator_url, acquired_at, allowed_use, theme_slug (compatibility identity), alt_text and notes. Cross-mode comparisons use equivalent manifests and byte-identical asset sets. Missing required manifests block generation: `Missing approved asset manifest for theme generation.` Assets become immutable when generation begins.

## Validation and review

Preserve failed generated output and evidence. Do not repair it, change validators/harnesses to hide a source failure, or reclassify old failures under new policies. Improve future runs instead. Validation is read-only. Deterministic resume never invokes AI and requires an unchanged completed generation.

Check all required pages, nonempty files, internal links/fragments, CSS/JS/image references, approved provenance, browser navigation/interactions, console/request failures, desktop/mobile overflow and clipping. Inspect actual screenshots for layout, typography, spacing, imagery, content and meaningful differentiation. Code similarity is not visual proof. Unavailable checks are skipped, never passed. Reviews bind to the actual output hash; new static samples require browser and visual review before gallery inclusion. Legacy previews retain compatibility inclusion.

Reports separately record infrastructure, generation, technical validation, browser checks, visual review, gallery/artifact status and publication. Gallery creation is local artifact creation, not publication. No push/deploy unless separately authorized.

## Explicit WordPress conversion

Only `theme:convert:wordpress -- --sample-slug <existing-static-sample> --mode codex-only` initiates conversion. Reject other conversion modes. Reserve a new output identity; fail on collisions. Read the selected static sample unchanged, seed copied approved assets, then run one scoped Codex conversion pass.

Create genuine WordPress templates, metadata, enqueued assets and APIs, retaining the selected design/content/navigation/interactions. Document editable content, template content, page setup and demo-only forms. Reuse deterministic asset build, PHP lint, read-only preview harness and temporary-copy ZIP packaging. Compare original and converted output on desktop/mobile. A PHP harness is not an actual WordPress runtime: report activation, admin, routing, plugin and form behavior as unverified unless tested in an isolated installation. Never alter an existing live WordPress site for validation.

Generic WordPress-core harness compatibility changes must be justified independently. Missing generated symbols, files, assets or inconsistent names are failed conversion output; do not patch the harness to compensate.

## Public commands

Use `npm run theme:run`, `theme:prepare`, `theme:assets`, `theme:model-check`, `theme:validate`, `theme:preview`, `theme:preview:index`, `theme:resume`, `theme:build` (documented static no-op), `theme:convert:wordpress`, `theme:wordpress:zip`, `theme:env`, and `test:scripts`. Commands run at the repository root. `theme:zip` and destructive `theme:delete` are removed from the public surface. Historical implementation is labeled legacy and is not the normal static path.
