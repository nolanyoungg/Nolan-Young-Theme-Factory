# Nolan Young Theme Factory

This repository is a template-first WordPress theme factory. It prepares a template, runs a controlled generation pass, validates the result, generates previews, packages ZIPs, and publishes GitHub Pages previews from the same source tree.

The repo now has a known-good baseline in `main` from the latest successful run:

- Generated theme: `012_nolan_young_theme_master_template_prompt_filler_template_1`
- Workflow mode: `codex-only`
- Codex model used for the run: `gpt-5.5`
- Reasoning level used for the run: `low`
- Result: final validation passed, preview regenerated, ZIP created, and the branch merged back to `main`

That was the strongest run so far. The prompt structure used for that pass is the one I would carry forward.

**Current state**

- `main` contains the validated `012` Northstar Websites theme.
- The preview generator now renders the preview from the actual theme templates rather than from hand-built mock HTML.
- The generated theme includes the missing local SVGs required by the header and content templates.
- The build pipeline now produces the required `assets/css/bundle.css` and `assets/js/bundle.js` outputs.
- The repo is clean after the merge, and the local checkout is aligned with `origin/main`.

**How the factory works**

1. Pick a template from `wordpress-themplate-themes/`.
2. Prepare a generated theme under `wp-content/themes/NNN_nolan_young_theme_[description]/`.
3. Run a workflow mode such as `codex-only`.
4. Edit only the prepared theme folder during generation.
5. Validate against the selected template and the repo quality checks.
6. Build the theme assets.
7. Generate the static preview under `docs/Preview-Themes-Github/`.
8. Rebuild the preview gallery under `docs/index.html`.
9. Package the theme ZIP under `dist/zipped-themes/`.
10. Write the run reports under `reports/runs/{theme_slug}/`.

**Recommended prompt shape going forward**

- Use a single authoritative prompt file in `prompts/pending/`.
- Keep the creative brief explicit about business identity, content, and visual direction.
- Keep the workflow constraints separate from the creative brief.
- Avoid regex-sensitive wording in prompt-adjacent docs and README text.
- Prefer the prompt structure that produced the `012` run, because it was the most consistent so far.

**Important paths**

- Templates: `wordpress-themplate-themes/`
- Generated themes: `wp-content/themes/`
- ZIP outputs: `dist/zipped-themes/`
- Preview output: `docs/Preview-Themes-Github/`
- Run reports: `reports/runs/`
- Workflow scripts: `scripts/` (see `scripts/README.md` for the organized script map)
- Workflow configuration: `config/workflow-modes.json` and `config/theme-factory.defaults.json`

**Common commands**

```sh
npm run theme:env
npm run theme:prepare -- --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000
npm run theme:run -- --mode codex-only --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --codex-model gpt-5.5 --codex-reasoning low
npm run theme:validate -- --theme-slug 001_nolan_young_theme_example --template NOLAN-YOUNG-theme-000
npm run theme:preview -- --theme-slug 001_nolan_young_theme_example
npm run theme:zip -- --theme-slug 001_nolan_young_theme_example
npm run theme:preview:index
npm run theme:resume -- --theme-slug 001_nolan_young_theme_example
```

The prompt paths above are examples. Use the actual prompt file that matches the theme brief you want to generate.

**Repository layout**

- `prompts/` holds prompt inputs, pending briefs, and workflow-related prompt text.
- `wordpress-themplate-themes/` holds the source templates. The misspelling is intentional.
- `wp-content/themes/` holds generated themes.
- `dist/zipped-themes/` holds packaged theme ZIPs.
- `docs/Preview-Themes-Github/` holds GitHub Pages preview copies for each generated theme.
- `scripts/` holds the workflow automation, organized by mode and deterministic workflow responsibility.
- `config/` holds workflow mode and default settings.
- `reports/runs/` holds per-run logs, briefs, validation reports, and summaries.
- `accessibility/`, `blocks/`, `docs/`, `src/`, `inc/`, and `template-parts/` live inside each generated theme and define the actual WordPress deliverable.

**What the latest `012` run proved**

- The prompt structure can drive a full theme build without manual cleanup inside the theme folder.
- The header and theme assets are renderable in preview after the template-backed preview rewrite.
- The generated theme can pass the repo’s validation, build, preview, gallery, and packaging steps.
- The repo’s workflow is sensitive to wording and harness coverage, so prompt discipline matters.

**Validation and build expectations**

- `npm run build` must produce `assets/css/bundle.css` and `assets/js/bundle.js`.
- PHP files must lint cleanly.
- The theme must keep runtime paths portable and avoid external CDN dependencies.
- Preview generation must stay aligned with actual theme output.
- The theme must remain template-aware and preserve the selected template file tree.

**Notes on generated artifacts**

- The ZIPs in `dist/zipped-themes/` are generated outputs.
- The preview copies in `docs/Preview-Themes-Github/` are generated outputs.
- The theme install’s `node_modules/` directory is a build dependency tree, not a hand-authored source area.
- These are part of the workflow output, but they are not the place to make source edits.

**Unreferenced source files**

I did not find any clearly dead source files that are both unreferenced and safely removable from the current repo state.

The things that look unreferenced at a glance are generated artifacts, run reports, preview output, ZIP output, or dependency trees, not source files I would delete without a separate cleanup pass.

**HOW TO OPERATE AS COMMAND USER**

1. Set up the repo locally.
   - Clone the repository to your machine.
   - Change into the repository directory.
   - Confirm the working tree is clean and the tools you need are available.

2. Run the workflow from a prompt in `prompts/pending/`.
   - Pick the prompt file you want to use.
   - Use the matching workflow mode for the kind of run you want.
   - The theme slug and generated outputs are created by the workflow, not by hand.

### `ollama-only`

Use this when you want Ollama to do the generation pass and finish the theme in one run.

```sh
npm run theme:run -- --mode ollama-only --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --ollama-model qwen2.5-coder:14b
```

### `codex-only`

Use this when you want Codex to handle the generation pass for the theme.

```sh
npm run theme:run -- --mode codex-only --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --codex-model gpt-5.5 --codex-reasoning low
```

### `hybrid`

Use this when you want Ollama to draft the theme and Codex to finish it.

```sh
npm run theme:run -- --mode hybrid --prompt prompts/pending/example.md --template NOLAN-YOUNG-theme-000 --ollama-model qwen2.5-coder:14b --codex-model gpt-5.5 --codex-reasoning medium
```

After a run finishes, use the same workflow tools for preview, packaging, and validation as needed.
