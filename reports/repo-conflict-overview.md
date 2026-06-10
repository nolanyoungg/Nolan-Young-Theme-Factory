# Repo Conflict Overview

This note records the prompt-related and naming-related surfaces in the repo that can confuse future runs.

## Removed

- `prompts/examples/premium-photography-theme.txt`

## Prompt Folder State

The `prompts/` folder should now be limited to:

- `prompts/README.md`
- `prompts/pending/`
- `prompts/completed/`

## Remaining Conflict Surfaces To Review

- Legacy showcase theme references still exist in historical reports and some generated theme artifacts.
- `docs/index.html` still lists the older `nolan-showcase-theme-01` and `nolan-showcase-theme-02` preview cards alongside the numeric `003` theme.
- Older run artifacts under `reports/runs/nolan-showcase-theme-01/` and `reports/runs/nolan-showcase-theme-02/` still use the showcase naming scheme.

## Recommendation

Keep the numeric slug convention for future generation work and avoid reintroducing example prompt folders or mixed naming in the prompt workflow.
