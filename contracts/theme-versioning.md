# Theme Versioning

Generated themes use sequential three-digit slugs with a prompt-derived short description:

- `000_nolan_young_theme_landscape_design`
- `001_nolan_young_theme_restaurant_group`
- `002_nolan_young_theme_software_platform`

The first generated theme after a clean reset must use number `000`.

The generated slug must use this pattern only:

```text
NNN_nolan_young_theme_<description>
```

The description segment should come from the selected prompt filename unless `THEME_SLUG` is explicitly supplied. For example, `prompts/pending/landscape-design-company.txt` should generate a slug such as:

```text
000_nolan_young_theme_landscape_design_company
```

The next slug must be determined from all generated output locations:

- `wp-content/themes/`
- `docs/themes/`
- `dist/zipped-themes/`
- `reports/runs/`

Never overwrite or reuse an existing generated slug.
