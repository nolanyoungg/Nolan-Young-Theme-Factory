# Repo Conflict Overview

This note records the prompt-related and naming-related surfaces in the repo after the cleanup pass.

## Removed

- `prompts/examples/premium-photography-theme.txt`
- Generated 003 and 004 theme outputs
- Legacy showcase-named 01/02 theme outputs were renamed to numeric slugs

## Prompt Folder State

The `prompts/` folder should now be limited to:

- `prompts/README.md`
- `prompts/pending/`
- `prompts/completed/`

## Current State

- The active generated themes now use numeric slugs only.
- `docs/index.html` links to the renamed 001 and 002 preview cards.
- The historical run outputs were renamed to the numeric convention so future runs stay consistent.

## Recommendation

Keep the numeric slug convention for future generation work and avoid reintroducing example prompt folders or mixed naming in the prompt workflow.