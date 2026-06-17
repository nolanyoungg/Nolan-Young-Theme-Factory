# Nolan Young Theme Factory

Clean template-first tooling for generating classic WordPress themes.

## Workflow

```text
1. Choose a template from `wordpress-themplate-themes/`
2. Prepare a generated theme folder in `wp-content/themes/NNN_nolan_young_theme_[description]/`
3. Run the selected AI mode inside the prepared folder
4. Validate against the selected template
5. Run WordPress quality checks
6. Build theme assets through the workflow build step
7. Generate or update the static preview
8. Rebuild the preview gallery
9. Package the ZIP
10. Write run reports
```

## Common Commands

```bash
bash scripts/theme-factory.sh list-templates
bash scripts/theme-factory.sh prepare prompts/pending/example.md NOLAN-YOUNG-theme-000
bash scripts/theme-factory.sh brief 001_nolan_young_theme_example prompts/pending/example.md codex-only
bash scripts/theme-factory.sh check 001_nolan_young_theme_example
bash scripts/theme-factory.sh preview 001_nolan_young_theme_example
bash scripts/theme-factory.sh package 001_nolan_young_theme_example
bash scripts/theme-factory.sh preview-index
bash scripts/theme-factory.sh run hybrid prompts/pending/000-testing.md NOLAN-YOUNG-theme-000 qwen2.5-coder:14b gpt-5.4 medium
bash scripts/theme-factory.sh resume 001_nolan_young_theme_example
```

The prompt paths above are examples. Use whichever file in `prompts/pending/` contains the creative brief for the theme you want to generate.

## Important Paths

Templates:

```text
wordpress-themplate-themes/
```

Generated themes:

```text
wp-content/themes/
```

ZIP files:

```text
dist/zipped-themes/
```

GitHub Pages previews:

```text
docs/Preview-Themes-Github/
```

## Adding Templates

Add a new blank or starter theme folder under `wordpress-themplate-themes/`. The validator will use that template's actual file tree, not a hardcoded global structure.

## AI Boundary

After `prepare`, the generated brief is written under `reports/runs/{theme_slug}/`. During theme generation, AI must edit only the prepared theme folder. Preview, ZIP, docs, and repo updates happen after generation through scripts.

See `docs/AI-WORKFLOW.md` for the three-mode workflow, run reports, dry-run behavior, and resume flow.
