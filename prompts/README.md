# Prompt Files

Place user theme prompts in `prompts/pending/` as `.txt` or `.md` files. The workflow reads from this folder and either lets you choose interactively or uses `THEME_PROMPT_FILE` when one is provided.

Prompt files are treated as the authoritative creative brief. Long prompts are preserved verbatim. Short prompts are allowed and will be interpreted more flexibly by the generation stages.

The workflow enforces the full theme structure, seven required preview files, Nolan-menu header, and local-image rules even if the prompt does not mention them. Strong prompts should still describe the desired brand, page content, visual style, image direction, and conversion goals.

After a successful run, the workflow can move the selected prompt to `prompts/completed/`, but it asks first and will not overwrite an existing completed file.

Do not place secrets, API keys, tokens, passwords, private keys, or unpublished customer data in prompt files.
