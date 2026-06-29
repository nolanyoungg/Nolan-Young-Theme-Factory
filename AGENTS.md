# Nolan Young Theme Factory - Agent Policy

This repository is a template-first WordPress theme factory. Theme generation, preview generation, packaging, and evaluation are separate jobs and must stay separate.

## Boundaries

Theme source belongs only in `wp-content/themes/NNN_nolan_young_theme_[description]/`.

ZIP files belong only in `dist/zipped-themes/NNN_nolan_young_theme_[description].zip`.

GitHub Pages previews belong only in `docs/Preview-Themes-Github/NNN_nolan_young_theme_[description]/`.

Run reports belong only in `reports/runs/{theme_slug}/`.

Every completed or blocked workflow must write timing artifacts under `reports/runs/{theme_slug}/`: `run-timing.json` for machine-readable timing and `run-timing.md` for human review. These reports must include mode, requested and resolved model names, reasoning level when applicable, total duration, and per-step durations. Ollama provider stages must also write per-model-invocation timing under the run report.

The folder name `wordpress-themplate-themes` is intentionally spelled this way.

## Active Template

The active template at this point in time is only:

`wordpress-themplate-themes/nolan-young-theme-template-01`

Do not prepare, generate, validate, preview, or package new themes from `NOLAN-YOUNG-theme-000` unless the user explicitly changes that decision later.

## Recommended Skills

When available, use `$ollama-wordpress-theme-generation` before changing or running Ollama-only theme workflows. That skill exists to prevent duplicate-template runs and to keep local-model stage ownership visible and testable.

When available, use `$mobile-wordpress-theme-review` before accepting a generated theme preview. That skill exists to review mobile header/footer behavior, page-template completeness, touch targets, content density, and preview evidence.

Skill source repositories:

- `https://github.com/nolanyoungg/ollama-wordpress-theme-generation`
- `https://github.com/nolanyoungg/mobile-wordpress-theme-review`

## Generation Rules

The prep script copies the selected template into `wp-content/themes/{slug}` before AI generation starts.

During theme generation, the model may edit only `wp-content/themes/{slug}/`.

The model must not create the initial theme folder, copy templates, rename folders, generate previews, update docs, create ZIPs, edit scripts, edit prompts, or touch any file outside the prepared theme folder.

The repository agent must not patch a generated theme in place just to make a failed run look better. Failed output is evaluation evidence. If the output is bad, delete the bad run artifacts, fix the repo or generation pipeline, and run a fresh theme.

The repository agent may improve templates, scripts, validation, preview infrastructure, reports, and repo policy so future runs are better. Those fixes must be general and reusable. One-off helper functions or one-time repair code paths are forbidden.

## Completion Standard

A generated theme is not complete just because it has branded strings in a few places.

A successful generated theme must:

- replace starter scaffold content and placeholder copy in user-facing rendered files
- have a complete, styled header/footer and working asset wiring
- render as a coherent WordPress website from its own source
- survive source validation before preview generation starts

Leaving placeholder text, mixed branding, incomplete styling, or starter template sections in rendered pages means the run failed.

## Mode Rules

`codex-only` means one Codex generation pass.

`ollama-only` means Ollama generation only.

`hybrid` means Ollama draft plus one Codex finish pass.

Ollama-only uses multiple planned local-model stages. These stages are declared before generation starts and always run as part of the mode. Prompt count is not repair.

Every Ollama stage must declare its prompt-section ownership. Missing or nonexistent production prompt coverage blocks the run before model invocation.

Ollama file output must be normalized only by the shared model-output parser. The recurring `--FILE:` header typo, overlong trailing dashes in FILE headers, raw fenced code from exact one-file stages, leading code fences inside code FILE blocks, trailing lone delimiter lines inside code FILE blocks, and pure terminal spinner lines are known Ollama transport/envelope variants and must be handled generically before candidate application. Do not manually wrap, patch, or repair a generated theme to compensate for these issues.

Ollama stage contracts must keep required, optional, and pattern-created files separate from prompt construction through candidate application. Optional files are never promoted into required files just because they are listed in the stage contract. A model response that completes all required files and omits optional files is valid unless candidate checks fail.

Prepared asset systems and deterministic support files are not Ollama-owned source. `functions.php`, `style.css`, build scripts/config, package manifests, files under `assets/`, source stylesheets, source scripts, and compiled CSS/JS bundles must stay template/build-owned unless the repository policy is intentionally changed. Ollama stages must own explicitly declared visible PHP surfaces, not hidden one-file no-op surfaces.

Complex navigation panel scaffolding is template-owned. `inc/navigation.php` and `template-parts/header/mega-menu-*.php` should be improved in the active template, not rewritten during Ollama generation. Ollama may edit the simpler header shell/branding/navigation wrapper files only when they are explicitly stage-owned.

The theme foundation is template-owned. `theme.json`, foundation PHP includes, setup helpers, enqueue helpers, template tags, `functions.php`, `style.css`, README, changelog, and license files must not be exposed as Ollama outputs unless the stage plan is intentionally changed.

The current Ollama-only writable surface must include visible page composition files: `header.php`, `footer.php`, `front-page.php`, the simpler header/footer template parts, homepage/global section template parts, and the About, Services, Work, Blog, Contact, and service-detail page template files declared in `scripts/lib/ollama-batches.js`.

Future Ollama-only runs must produce visible variation from the active template. A run that only changes metadata, package files, `style.css` headers, or `searchform.php` is not a successful creative theme generation run.

Mobile design detail is part of the generation contract. Ollama-owned visible PHP stages must preserve responsive landmarks, mobile navigation controls, touch-friendly CTAs, sensible heading order, compact section density on narrow screens, and accessible form/search/navigation behavior.

Template preparation must normalize text file line endings deterministically after copying the template. Windows CRLF checkouts must not cause prepared JS, SCSS, config, PHP, JSON, or Markdown files to fail build linting.

There is no automatic model fallback, validation-triggered AI pass, build-triggered AI pass, or second AI cleanup pass.

A planned generation stage is declared before generation begins, owns a defined file allowlist, receives current theme context, and runs regardless of validation state.

A repair stage is triggered by a failed check or designed to make generated output pass after the fact. Repair stages are prohibited.

## Deterministic Work

Build, validation, preview generation, ZIP packaging, cleanup, and reports are deterministic post-generation work.

Validation is observational and read-only. Source validation runs before preview and ZIP creation. Artifact validation runs after preview and ZIP packaging. Validation must fail bad output; it must not rewrite the generated theme to save the run.

Model output is applied without semantic modification. The application layer may parse the documented file-block protocol, enforce the stage allowlist, write complete files through a candidate transaction, and run observational candidate checks. It must not fix PHP, rewrite SCSS, invent fallback CSS, replace URLs, salvage malformed output, or keep old source when generated code is invalid.

Codex must run from the prepared theme directory with a writable sandbox and ephemeral execution. Repository snapshots around Codex are required to detect out-of-bound changes.

## Preview Rules

Preview generation is a separate step from theme generation.

The preview must be an exact clone of how the generated WordPress website would look from the generated theme source. The preview layer must not substitute a prettier shell, patch branding, inject replacement copy, or hide generation defects.

Preview generation may read generated themes and write only under `docs/Preview-Themes-Github/` and `docs/index.html`. Preview replacement must be transactional and must preserve an existing preview when candidate rendering fails.

The preview set must consist of these pages:

- `index.html`
- `homepage_preview.html`
- `about-us_preview.html`
- `services_preview.html`
- `work_preview.html`
- `blog_preview.html`
- `contact_preview.html`
- `policy_preview.html`
- `single_services_preview.html`

If the preview looks bad, the default assumption is that the generated theme source is bad or incomplete, not that the preview should be cosmetically massaged.

## Assets And Packaging

Approved third-party image use must come from `assets/images/asset-manifest.json`. Models may create original local SVG marks, icons, textures, and illustrations, but must not invent provenance or describe illustrations as photographs.

Packaging must package from a temporary copy and must not modify generated theme source.

## Public Commands

Use npm scripts as the public command layer:

```text
npm run theme:run
npm run theme:resume
npm run theme:prepare
npm run theme:validate
npm run theme:build
npm run theme:preview
npm run theme:preview:index
npm run theme:zip
npm run theme:delete
npm run theme:env
npm run theme:model-check
npm run test:scripts
```
