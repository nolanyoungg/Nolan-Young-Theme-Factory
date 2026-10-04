# Static-first refactor verification — October 3, 2026

Implemented locally. No commit, push, deployment, publication, historical deletion, model installation, server setting change, or live WordPress change was performed in this refactor.

## Outcome

The primary workflow now writes plain HTML/CSS/JavaScript directly into `docs/Preview-Themes-Github/<sample-slug>/`. It prepares approved assets before AI, validates source and links, records browser/screenshot evidence, and includes reviewed samples in the local gallery. Static commands do not load WordPress conversion/rendering/packaging modules. New static output requires a hash-bound review; historical previews keep compatibility inclusion and their URLs.

The gallery contains 13 samples. Cards retain the website above the name, nine page selectors, desktop/mobile preview controls, and search. Common Ground's Home and Contact selectors were exercised inside the gallery at desktop/mobile widths. Mobile gallery overflow measured zero at 390px.

## Demonstrations and artifacts

| Demonstration | Result | Artifact |
| --- | --- | --- |
| Codex static generation | One generation pass; technical, browser and visual checks passed | `docs/Preview-Themes-Github/017_nolan_young_theme_common_ground/index.html` |
| Local model static generation | Blocked before generation: both endpoints refused connections | `reports/static-refactor/local-provider-availability.json` |
| Explicit Codex WordPress conversion | One conversion pass; build, PHP contracts, harness, browser comparison and ZIP checks passed; actual WordPress runtime skipped | `wp-content/themes/018_nolan_young_theme_common_ground_wordpress/` |
| WordPress package | 49 ZIP entries; all source files accounted for | `dist/zipped-themes/018_nolan_young_theme_common_ground_wordpress.zip` |

Local preview servers left available for review:

- Gallery: http://127.0.0.1:4176/
- Original static sample: http://127.0.0.1:4174/
- Converted PHP-harness output: http://127.0.0.1:4175/

These are local servers, not published URLs. The converted preview is private report output and is not added to the public gallery.

## Exact commands exercised

Commands run from the repository root. `npm.cmd` avoids PowerShell shim flag handling on this machine.

```powershell
npm.cmd run theme:run -- --mode codex-only --prompt prompts/pending/012-common-ground-static.md --sample-slug 017_nolan_young_theme_common_ground --asset-catalog assets/manifests/007-form-and-field.json
npm.cmd run theme:resume -- --sample-slug 017_nolan_young_theme_common_ground --review-evidence reports/static/017_nolan_young_theme_common_ground/browser-review.json
npm.cmd run theme:convert:wordpress -- --sample-slug 017_nolan_young_theme_common_ground --mode codex-only
npm.cmd run theme:convert:wordpress -- --sample-slug 017_nolan_young_theme_common_ground --output-slug 018_nolan_young_theme_common_ground_wordpress --mode codex-only --resume-checks
npm.cmd run theme:model-check -- --provider lmstudio
npm.cmd run theme:model-check -- --provider ollama
npm.cmd run test:scripts
git diff --check
```

The conversion check continuation was deterministic and did not invoke AI. Both Codex passes used the configured default model, reported as gpt-6-astra by the CLI. No Ollama or LM Studio generation ran and no fallback substituted for it.

The requested default entry point remains `npm run theme:run -- --mode codex-only --prompt prompts/pending/000-testing.md`. The static contract explicitly supersedes legacy PHP/build instructions in older briefs. See the root README and `scripts/README.md` for all command flags, review evidence and local-provider commands. Exact loaded local model IDs could not be obtained: `127.0.0.1:1234/v1` and `127.0.0.1:11434/v1` both returned `ECONNREFUSED`, including read-only checks outside the restricted sandbox. Discover a returned ID with `theme:model-check`, then use that exact ID with `--lmstudio-model` or `--ollama-model` and the same Common Ground brief/catalog. Example IDs in the README are explicitly not claims of loaded models.

## Changed-file and architecture guide

| Files | Responsibility |
| --- | --- |
| `scripts/theme-factory.js`, `scripts/lib/run-lock.js` | Public command routing and exclusive mutation lock |
| `scripts/lib/static-workflow.js`, `static-scaffold.js`, `workspace.js` | Static orchestration, nine-page scaffold, immutable identities, safe paths, hashing, next-unused numbering |
| `scripts/lib/assets.js` | Provider-neutral approved acquisition, copied assets and manifests |
| `scripts/lib/static-validation.js`, `review.js` | Observational source/link/asset checks; separate hash-bound browser and screenshot evidence |
| `scripts/lib/static-server.js`, `static-gallery.js`, `gallery.js`, `docs/index.html` | Local static serving and review-gated gallery; preview above title; all page navigation |
| `scripts/lib/codex.js` | One ephemeral scoped Codex pass, private log, repository boundary snapshot |
| `scripts/lib/local-model/stages.js`, `agent.js` | Six bounded static stages; version-2 checkpoint integrity; existing provider/tool/transactional patch contracts retained |
| `scripts/lib/wordpress-converter.js`, `wordpress-core-preview.php` | Explicit selected-sample conversion, independent identities/reports, source checks, deterministic continuation and isolated packaging |
| `scripts/legacy-wordpress.js`, `scripts/lib/local-model/legacy-stages.js`, `scripts/LEGACY-WORDPRESS.md` | Labeled historical code/docs, isolated from normal static commands |
| `scripts/tests/static-workflow.test.js`, `preview-urls.test.js`, `stages-agent.test.js` | Static isolation, references, collisions, checkpoints, generic WP contracts and retained regression fixtures |
| `AGENTS.md`, `README.md`, `scripts/README.md`, `prompts/README.md`, `package.json` | Updated policy, architecture, command contract, migration and test entry point |
| `prompts/pending/012-common-ground-static.md` | New focused static demonstration brief |

## Integrity and infrastructure corrections

All 12 historical preview trees, 17 pre-existing WordPress theme trees and 12 original ZIPs matched the saved baseline. Existing untracked failed attempts were preserved. The static sample hash remained unchanged through conversion, and the converted theme remained unchanged after its generation pass (including deterministic checks). See `preservation-audit.json`, both boundary-check reports, and the conversion source checkpoint.

The first conversion check incorrectly required `the_content()` to appear literally in `page.php`. The source correctly loads an existing shared template part that calls it. The validator now follows literal template-part references, with regression tests rejecting missing, unrelated and cyclic parts. This corrects a validator false positive; no generated helper or content was supplied by the runner. The initial failed check is retained in `reports/conversions/018_nolan_young_theme_common_ground_wordpress/initial-check-failure.json`.

The generic empty-database harness now returns no posts, rather than the old synthetic post. It also supports default theme settings, unassigned-menu callbacks and setup/title-tag behavior. These changes model generic core contracts and do not supply generated theme symbols. Historical rendering defaults are retained. Official references: [get_template_part](https://developer.wordpress.org/reference/functions/get_template_part/), [have_posts](https://developer.wordpress.org/reference/functions/have_posts/), [add_theme_support](https://developer.wordpress.org/reference/functions/add_theme_support/), [get_theme_mod](https://developer.wordpress.org/reference/functions/get_theme_mod/), [wp_nav_menu](https://developer.wordpress.org/reference/functions/wp_nav_menu/).

No generated static or WordPress source was repaired, and no second AI pass ran. Failed generated symbols still fail the harness. Deterministic continuation requires matching source hashes and refuses existing ZIPs.

## Verification and limits

Final test run: **76 tests, 75 passed, 0 failed, 1 skipped**. The skipped symlink test could not create a Windows symlink (`EPERM`). Full TAP output: `reports/static-refactor-tests.txt`. `git diff --check` passed. Isolation tests demonstrate that a static run/resume cannot create wp-content/dist output, load the converter or invoke a second AI pass.

Original static screenshots were inspected at 1280×900 and 390×844: home, seven inner pages and homepage alias; navigation, mobile menu/Escape, journal fragments, FAQ disclosures and demo inquiry feedback were exercised. Technical checks cover all nine pages, local references and fragments. No measured horizontal overflow or captured console warnings/errors. Approved photographs render, including lazy images after scrolling. Resource evidence combines deterministic reference validation and observed browser rendering/logs; no full network HAR was available.

Converted output was opened across all eight unique experiences at both widths; all nine rendered files passed validation. Actual home, services, work, studio and contact screenshots were compared with the source. Typography, spacing, palette, imagery and initial content composition match. Navigation, mobile menu/Escape, FAQ and form feedback passed. Screenshot evidence and measurements live in `reports/conversions/018_nolan_young_theme_common_ground_wordpress/`; the original review lives in `reports/static/017_nolan_young_theme_common_ground/`.

**No real WordPress runtime was available.** PHP harness output uses an empty database, fallback navigation, a generic title and fixed bundle inclusion. Actual activation, populated database content, assigned menus, enqueue execution/additional WordPress styles, editor patterns/admin permissions, permalinks, plugins and password-protected content remain unverified. No form delivery is intended. The generated theme README explains installation, page setup, editor replacement/pattern behavior, and template-owned content. The final conversion status is `validated-harness-only`, not production/runtime approval.

## Migration

Static `--sample-slug` replaces `--theme-slug` (deprecated alias remains). `theme:build` is a documented no-op. Ambiguous `theme:zip` and destructive `theme:delete` are removed; `theme:wordpress:zip` is explicitly conversion-only and refuses overwrites. Legacy checkpoint version 1 cannot resume as a static run. Historical output and URLs remain intact. Static deterministic resume and explicit local-stage continuation remain separate. Publishing requires a separate request.
