# Nolan Young Theme Factory

Clean template-first tooling for generating classic WordPress themes.

## Workflow

```text
1. Choose a template from wordpress-themplate-themes/
2. Copy it into wp-content/themes/NNN_nolan_young_theme_[description]/
3. Run AI generation only inside that prepared folder
4. Validate against the selected template
5. Run practical WordPress quality checks
6. Generate/update the static preview
7. Package the ZIP
8. Rebuild the preview gallery
```

## Main Command

```bash
bash scripts/theme-factory.sh list-templates
bash scripts/theme-factory.sh prepare prompts/pending/example.md NOLAN-YOUNG-theme-000
bash scripts/theme-factory.sh brief 001_nolan_young_theme_example prompts/pending/example.md codex-only
bash scripts/theme-factory.sh check 001_nolan_young_theme_example
bash scripts/theme-factory.sh preview 001_nolan_young_theme_example
bash scripts/theme-factory.sh package 001_nolan_young_theme_example
bash scripts/theme-factory.sh preview-index
```

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

After `prepare`, give the AI the generated brief from inside the prepared theme folder. The AI must edit only the prepared theme folder. Preview, ZIP, docs, and repo updates happen after generation through scripts.
