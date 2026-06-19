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
- Workflow scripts: `scripts/`
- Workflow configuration: `config/workflow-modes.json` and `config/theme-factory.defaults.json`

**Common commands**

```bash
bash scripts/theme-factory.sh list-templates
bash scripts/theme-factory.sh prepare prompts/pending/example.md NOLAN-YOUNG-theme-000
bash scripts/theme-factory.sh brief 001_nolan_young_theme_example prompts/pending/example.md codex-only
bash scripts/theme-factory.sh run codex-only prompts/pending/example.md NOLAN-YOUNG-theme-000 qwen2.5-coder:14b gpt-5.5 low
bash scripts/theme-factory.sh check 001_nolan_young_theme_example
bash scripts/theme-factory.sh preview 001_nolan_young_theme_example
bash scripts/theme-factory.sh package 001_nolan_young_theme_example
bash scripts/theme-factory.sh preview-index
bash scripts/theme-factory.sh resume 001_nolan_young_theme_example
```

The prompt paths above are examples. Use the actual prompt file that matches the theme brief you want to generate.

**Repository layout**

- `prompts/` holds prompt inputs, pending briefs, and workflow-related prompt text.
- `wordpress-themplate-themes/` holds the source templates. The misspelling is intentional.
- `wp-content/themes/` holds generated themes.
- `dist/zipped-themes/` holds packaged theme ZIPs.
- `docs/Preview-Themes-Github/` holds GitHub Pages preview copies for each generated theme.
- `scripts/` holds the workflow automation.
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

I found one repo doc that is currently not referenced by any other tracked file:

- [`docs/AI-WORKFLOW.md`](/C:/Users/NolanYoung/codex-ggi-nolan-local/repos/Nolan-Young-Theme-Factory/docs/AI-WORKFLOW.md)

I did not find any other clearly dead source files that are both unreferenced and safely removable from the current repo state.

The things that look unreferenced at a glance beyond that are generated artifacts or dependency trees, not source files I would delete without a separate cleanup pass.

If you want, I can do a second pass focused only on pruning generated or compatibility files that are no longer needed.

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

```bash
bash scripts/theme-factory.sh run ollama-only prompts/pending/example.md NOLAN-YOUNG-theme-000 qwen2.5-coder:14b
```

### `codex-only`

Use this when you want Codex to handle the generation pass for the theme.

```bash
bash scripts/theme-factory.sh run codex-only prompts/pending/example.md NOLAN-YOUNG-theme-000 qwen2.5-coder:14b gpt-5.5 low
```

### `hybrid`

Use this when you want Ollama to draft the theme and Codex to finish it.

```bash
bash scripts/theme-factory.sh run hybrid prompts/pending/example.md NOLAN-YOUNG-theme-000 qwen2.5-coder:14b gpt-5.5 medium
```

After a run finishes, use the same workflow tools for preview, packaging, and validation as needed.
