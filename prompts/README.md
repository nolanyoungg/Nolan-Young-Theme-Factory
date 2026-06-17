# Prompt Files

Place user theme prompts in `prompts/pending/`. The main workflow reads the prompt file passed with `--prompt`; the lower-level prepare script can also read `THEME_PROMPT_FILE`.

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

- repository paths such as `wp-content/`, `docs/Preview-Themes-Github/`, `dist/`, `reports/`, `contracts/`, or `scripts/`
- generated slugs or version numbers
- `THEME_SLUG`, `THEME_FACTORY_MODE`, `OLLAMA_MODEL`, or command-line environment variables
- CI, GitHub Actions, GitHub Pages, validation scripts, packaging scripts, or ZIP freshness
- `docs/index.html` gallery instructions
- internal contract names or factory-specific header names

The workflow enforces the full theme structure, required preview files, header contract, packaging, validation, and local-asset rules automatically. The prompt's job is only to describe the theme.

Strong prompts should still describe the desired brand, page content, visual style, image direction, interaction behavior, accessibility expectations, and conversion goals.

The workflow records the selected prompt path in `reports/runs/{theme_slug}/run.config.json`. It does not move prompt files automatically.

If you want to reuse an older prompt, copy it back into `prompts/pending/` under a descriptive filename and remove stale language before running generation again.

Do not place secrets, API keys, tokens, passwords, private keys, or unpublished customer data in prompt files.

## Template Prompts

Reusable starting prompts live in `prompts/template prompts/`.

The main skeleton is `prompts/template prompts/wordpress-theme-generation-prompt-skeleton-template.md`.

To use it, copy it into `prompts/pending/`, rename it for the new business concept, then replace the bracketed placeholders with specific business, page, form, design, accessibility, and conversion details. Keep generated reports, ZIP notes, preview cleanup notes, and other repo-maintenance items out of `prompts/pending/`.
