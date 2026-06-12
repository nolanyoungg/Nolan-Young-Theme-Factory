# Repo Rebuild Plan

## Preserve

- `.git`
- `wp-content/themes/000-006`
- `dist/zipped-themes/000-006.zip`
- existing prompt assets, including `prompts/template prompts/wordpress-theme-generation-prompt-skeleton-template.md`
- clean required folders and scripts
- blank templates under `wordpress-themplate-themes/`

## Removed From Foundation

Legacy roleplay agents, contracts, instructions, reports, duplicate validators, and duplicate workflows are removed from the clean foundation. Existing generated themes, ZIPs, and prompt assets are preserved.

## Checkpoints

1. Repo audit: old repo was cleared except `.git`.
2. Cleanup: new foundation contains only necessary folders and scripts.
3. Blank template: created by `scripts/dev/create-blank-wordpress-template-theme.js`.
4. Prep script: copies selected template into a unique `wp-content/themes/{slug}` folder.
5. AI boundary: generation brief instructs AI to edit only the prepared theme folder.
6. Template validation: checks selected template file tree.
7. Quality validation: checks WordPress basics, PHP lint, secrets, CDN references, bad paths.
8. Preview: creates static preview and rebuilds interactive gallery.
9. ZIP: packages only the generated theme folder.
10. Documentation: README and AGENTS define the workflow.
11. QA: create `prompts/pending/000-testing.md` by filling `prompts/template prompts/wordpress-theme-generation-prompt-skeleton-template.md` for a software development company, then run the template-first workflow against that pending prompt.
