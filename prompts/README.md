# Prompt Files

Place user theme prompts in `prompts/pending/` as `.txt` or `.md` files. The workflow reads from this folder and either lets you choose interactively or uses `THEME_PROMPT_FILE` when one is provided.

Prompt files are treated as the authoritative creative brief. They should describe the website/theme being generated, not the repository or workflow that generates it.

## What Belongs In A Prompt

Use prompts for:

- business name and category
- target audience
- brand positioning
- visual direction
- page goals
- content requirements
- navigation behavior
- homepage and internal page expectations
- asset style and image direction
- accessibility and interaction expectations that affect the theme itself

## What Does Not Belong In A Prompt

Do not put repository or factory mechanics in prompt files.

Prompts must not mention:

- repository paths such as `wp-content/`, `docs/themes/`, `dist/`, `reports/`, `contracts/`, or `scripts/`
- generated slugs or version numbers
- `THEME_SLUG`, `THEME_FACTORY_MODE`, `OLLAMA_MODEL`, or command-line environment variables
- CI, GitHub Actions, GitHub Pages, validation scripts, packaging scripts, or ZIP freshness
- `docs/index.html` gallery instructions
- internal contract names or factory-specific header names

The workflow enforces the full theme structure, required preview files, header contract, packaging, validation, and local-asset rules automatically. The prompt's job is only to describe the theme.

Strong prompts should still describe the desired brand, page content, visual style, image direction, interaction behavior, accessibility expectations, and conversion goals.

After a successful run, the workflow moves the selected prompt to `prompts/completed/` with the generated slug as a filename prefix. This keeps completed prompts aligned with generated previews, ZIPs, and run reports.

Example:

```text
prompts/completed/002_nolan_young_theme_landscape_design__premium-landscape-design-company.txt
```

Completed prompt files are never overwritten. To reuse a completed prompt, copy it back into `prompts/pending/` under a new descriptive filename and remove stale language before running generation again.

Do not place secrets, API keys, tokens, passwords, private keys, or unpublished customer data in prompt files.

## Template Prompts

Reusable starting prompts live in `prompts/template prompts/`.

The main skeleton is `prompts/template prompts/wordpress-theme-generation-prompt-skeleton-template.md`.

To use it, copy it into `prompts/pending/`, rename it for the new business concept, then replace the bracketed placeholders with specific business, page, form, design, accessibility, and conversion details. Keep generated reports, ZIP notes, preview cleanup notes, and other repo-maintenance items out of `prompts/pending/`.
