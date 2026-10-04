# Static factory command and architecture guide

All commands run at repository root. `node scripts/theme-factory.js help` lists the public contract. In PowerShell prefer `npm.cmd`.

| Command | Flags and behavior |
| --- | --- |
| `theme:run` | Required `--mode`, `--prompt`; optional `--sample-slug`, `--asset-catalog`. Prepare → assets → selected AI → validate → review → gallery/artifacts/report. No automatic WordPress operation. |
| `theme:prepare` | Required `--prompt`; optional `--sample-slug`, `--asset-catalog`, `--dry-run`. Scaffold and approved assets; no AI. |
| `theme:assets` | Required `--sample-slug`; optional `--asset-catalog`. Acquires/copies approved assets before generation. Refuses after an attempt starts. |
| `theme:model-check` | Required `--provider codex|ollama|lmstudio`. Without a local model ID lists IDs; with one verifies availability and required structured tool calls. |
| `theme:validate` | Required `--sample-slug`; optional `--review-evidence reports/...json`. Read-only source/link/asset checks and explicitly supplied browser evidence. |
| `theme:preview` | Optional `--sample-slug`, `--port` (default 4174). Node localhost static server; no PHP rendering. No slug serves docs gallery. |
| `theme:preview:index` | Rebuild local gallery. Legacy pages preserved; new static samples require current passing review evidence. |
| `theme:resume` | Required `--sample-slug`; optional `--review-evidence`. Deterministic checks/report/gallery only; requires unchanged completed generation. |
| `theme:build` | No-op: static CSS and JavaScript are source and deliverables. No packages installed. |
| `theme:convert:wordpress` | Required `--sample-slug`, `--mode codex-only`; optional `--output-slug`, Codex model/reasoning/executable flags. Creates new theme, checks and ZIP. `--resume-checks --output-slug <recorded-output>` reruns only deterministic checks for unchanged checkpointed source; no AI, no existing ZIP overwrite. |
| `theme:wordpress:zip` | Required `--theme-slug`; only a validated unchanged conversion, never overwrite an existing ZIP. |
| `theme:env` | Static runtime paths and Node version. |

Codex flags: `--codex-executable`, `--codex-model`, `--codex-reasoning`. Omission retains user configuration. Arbitrary extra flags are rejected to protect output scope. Codex uses `exec --cd <prepared-output> --approve-for-me --ephemeral -`, a 90-minute bound and private log; the installed CLI's automatic approval mode includes workspace-write. Repository content hashes detect out-of-bound changes even to already-dirty files.

Provider flags (replace `<provider>` with `ollama` or `lmstudio`): `--<provider>-base-url`, `--<provider>-model`, `--<provider>-temperature`, `--<provider>-timeout-ms`. Prefer `OLLAMA_API_KEY` / `LMSTUDIO_API_KEY` environment variables to command-line secrets. Default API URLs are localhost ports 11434/1234 with `/v1`. Existing shared provider metadata/error redaction remains active. No private provider metadata goes under docs.

Local limits: `--local-model-max-context-bytes`, `--local-model-max-tool-calls`, `--local-model-max-tool-output-bytes`, `--local-model-max-tokens`, `--local-model-stage-timeout-ms`, `--local-model-heartbeat-ms`. Defaults retain 12 tool calls, 40KB per response and approximately 30 minutes per stage. Six static stages: `01-identity-content`, `02-navigation`, `03-layouts-pages`, `04-styles`, `05-interactions`, `06-documentation`. Read/write scopes and planned overlapping HTML ownership are declared before generation. Plain `site.css` and `site.js` are editable source, not compiled bundles.

Explicit local continuation uses `theme:run` with the same prompt, sample, provider/model, `--resume-local`, and optionally `--resume-from-stage <id>`. Only matching version-2 checkpoints and successful-stage prefixes resume. Failed output is not repaired. Old WordPress checkpoints fail clearly. Static and conversion evidence use different report roots.

## Browser review evidence

The CLI does not pretend that file validation is a browser. Open the local preview, inspect actual screenshots and exercise each page at desktop/mobile widths. Browser tooling may be supplied by the controlling agent or human. Store screenshots under the sample's private report folder. Capture source hash with:

```sh
node -e "console.log(require('./scripts/lib/workspace').treeHash(require('./scripts/lib/workspace').sampleDir(process.argv[1])))" <sample-slug>
```

Write `reports/static/<sample-slug>/browser-review.json` with this format, using truthful results and actual screenshot paths:

```json
{
  "sampleHash": "<current source SHA256>",
  "viewports": [{ "width": 1280, "height": 900 }, { "width": 390, "height": 844 }],
  "browserChecks": {
    "status": "passed",
    "navigation": "passed", "interactions": "passed", "console": "passed",
    "requests": "passed", "overflow": "passed", "clipping": "passed"
  },
  "visualReview": { "status": "passed", "notes": "Describe actual layout, typography, spacing, image and content observations; compare with existing designs." },
  "screenshots": ["reports/static/<sample-slug>/desktop.png", "reports/static/<sample-slug>/mobile.png"]
}
```

Use `failed` or `skipped` when appropriate, with reasons. The importer requires the exact current source hash, separate browser checks, desktop/mobile sizes, existing screenshot files and review notes. The runner cannot independently prove a human's claims: these are explicit inspection attestations, not automatically computed visual scores. Run `theme:resume -- --sample-slug ... --review-evidence ...` to consume them. No evidence means browser skipped and visual pending; the new sample is excluded from the gallery.

Conversion comparison evidence belongs under `reports/conversions/<output-slug>/`, with original/converted hashes, desktop/mobile screenshots and observed differences. Runtime checks must remain separately labeled from the PHP harness. No conversion preview is inserted into the public gallery or overwrites the original sample.

## Modules and checks

- `theme-factory.js`: small dispatcher; WordPress converter is lazily loaded only by explicit commands.
- `lib/static-workflow.js`: static orchestration, immutable generation attempts, preparation, deterministic resume.
- `lib/static-scaffold.js`: versioned nine-page plain scaffold.
- `lib/assets.js`: extracted provider-neutral approved acquisition/cache/manifests.
- `lib/static-validation.js`: required content, links/fragments, CSS resource URLs, HTML resource/srcset paths, JS syntax, provenance and public-file boundary checks. Dynamic JS-generated URLs/behavior require browser review.
- `lib/static-server.js`: localhost GET/HEAD static resource serving, no PHP execution.
- `lib/static-gallery.js`, `gallery.js`, `gallery-client.js`, `gallery.css`: legacy-compatible local inventory and preview-above-name gallery.
- `lib/review.js`: hash-bound explicit review evidence.
- `lib/codex.js`: scoped ephemeral runner and content-boundary checks.
- `lib/local-model/*`: bounded context, safe tools, patch transactions, stages, checkpoints; legacy policy retained for historical regression fixtures.
- `lib/wordpress-converter.js`: explicit selected-sample conversion, source checks, read-only harness, ZIP and source preservation evidence.
- `legacy-wordpress.js`: archived WordPress-first implementation; only appropriate rendering/packaging helpers are imported by conversion. Direct legacy runs are disabled.

Tests cover unchanged static output during validation, missing targets/fragments/resources, unapproved images, forbidden PHP/private files, scope/collision checks, provider preflight/redaction, candidate transactions, checkpoint compatibility and static/converter isolation. A static orchestration fixture checks that no wp-content/dist output is created and no WordPress module is loaded. Browser and runtime checks are reported independently.

Official contracts: [Codex non-interactive execution](https://learn.chatgpt.com/docs/non-interactive-mode), [WordPress asset APIs](https://developer.wordpress.org/themes/core-concepts/including-assets/), [classic template hierarchy](https://developer.wordpress.org/themes/classic-themes/basics/template-hierarchy/), [LM Studio OpenAI compatibility](https://lmstudio.ai/docs/developer/openai-compat), [Ollama OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility).
