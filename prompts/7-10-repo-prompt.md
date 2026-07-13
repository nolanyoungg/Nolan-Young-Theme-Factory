You are a senior Node.js software engineer performing a long-running architectural refactor and end-to-end validation of this repository:

https://github.com/nolanyoungg/Nolan-Young-Theme-Factory

# Primary Objective

Replace the failed local-model file-block generation system with a real, controlled `LocalModelAgent` architecture.

Ollama and LM Studio must become interchangeable OpenAI-compatible local-model providers behind a shared abstraction. Local models must receive useful source context, use bounded read-only repository tools, and return unified diff patches that the Node.js agent validates and applies transactionally.

The implementation must preserve the repository’s core philosophy:

- Generation and evaluation are separate operations.
- Generated output must not be repaired merely to pass validation.
- Failed generated output must be preserved as evidence.
- There is no hybrid generation mode.
- There is no automatic provider fallback.
- There is no validation-triggered AI repair pass.
- There is no build-triggered AI cleanup pass.
- There is no second AI repair pass.
- The Node.js application, not the model, owns filesystem access and patch application.

# Definition of Done

This work is complete only when all of the following are true:

1. The legacy `---FILE:` complete-file-block system has been removed from active runtime code.
2. Local-model generation accepts unified diff patches only.
3. Ollama and LM Studio use a shared OpenAI-compatible provider abstraction.
4. Local models receive bounded actual file contents rather than only a filename inventory.
5. Local models can use safe read-only tools to inspect the prepared theme.
6. Read and write scopes are independently enforced for every stage.
7. Patches are path-validated, checked, and applied to temporary candidate copies transactionally.
8. Failed patches or checks cannot partially modify the prepared theme.
9. Long-running generation prints clear stage progress and writes detailed reports.
10. Successful stages create resumable checkpoints.
11. Existing public commands and generation mode names remain stable.
12. Documentation and tests reflect the new architecture.
13. Three new benchmark themes are generated from the same creative brief and the same template:
    - Theme 007 using `codex-only`
    - Theme 008 using `ollama-only`
    - Theme 009 using `lmstudio-only`
14. Each benchmark theme passes the complete deterministic pipeline:
    - build
    - source validation
    - preview rendering
    - ZIP packaging
    - artifact validation
15. Each benchmark theme has:
    - generated source under `wp-content/themes/`
    - a static preview under `docs/Preview-Themes-Github/`
    - an entry in `docs/index.html`
    - a ZIP under `dist/zipped-themes/`
    - run evidence under `reports/runs/`
16. All approved implementation and benchmark artifacts are committed and pushed normally to `origin/main`.
17. Completion is not claimed unless the required commits are confirmed on `origin/main`.

# Failure and Blocking Rules

Do not fabricate successful results.

If an external dependency prevents completion—for example:

- Ollama is not installed or running
- the Ollama model is unavailable
- LM Studio is not running
- the LM Studio model is not loaded
- tool calling is unsupported by the selected model/runtime
- Codex is unavailable
- GitHub authentication is unavailable
- `origin/main` cannot be pushed
- one of the required theme numbers is already occupied

then:

1. Complete every preceding task that does not depend on the missing requirement.
2. Preserve all generated evidence.
3. Print a clear `BLOCKED` result.
4. State the exact failed prerequisite.
5. State the exact command or user action needed to continue.
6. Do not silently downgrade to a weaker protocol.
7. Do not use the old file-block protocol.
8. Do not fall back from HTTP to `ollama run`.
9. Do not overwrite existing theme artifacts with `--force` unless explicitly authorized.
10. Do not force-push or rewrite Git history.

# Phase 0 — Repository Inspection and Preflight

Before editing:

1. Read `AGENTS.md` and treat it as authoritative repository policy.
2. Inspect the repository structure and all relevant source, configuration, documentation, validation, provider, generation, and test files.
3. At minimum, inspect:
   - `README.md`
   - `AGENTS.md`
   - `package.json`
   - `scripts/theme-factory.js`
   - `scripts/lib/cli/options.js`
   - `scripts/lib/local-model/stages.js`
   - `scripts/lib/providers/lmstudio.js`
   - `scripts/lib/providers/ollama.js`
   - `scripts/lib/validation.js`
4. Search the entire repository for:
   - `applyFileBlocks`
   - `parseFileBlocks`
   - `---FILE:`
   - `ollama run`
   - local-model stage definitions
   - LM Studio-specific request handling
   - duplicated provider logic
5. Inspect Git state:
   - current branch
   - working-tree status
   - configured remotes
   - divergence from `origin/main`
6. Confirm that target theme numbers 007, 008, and 009 are unused across:
   - `wp-content/themes/`
   - `docs/Preview-Themes-Github/`
   - `dist/zipped-themes/`
   - `reports/runs/`
7. Check required executables and services.
8. Run existing script-layer tests before editing and record the baseline.
9. Convert Sections 1–10 below into a concrete ordered implementation plan.
10. Do not begin benchmark generation until the refactor and deterministic tests pass.

# Target Module Structure

Implement or refactor toward:

scripts/lib/local-model/
- agent.js
- context.js
- tools.js
- patch.js
- stages.js
- protocols.js

scripts/lib/providers/
- openai-compatible.js
- lmstudio.js
- ollama.js

Create a Codex provider module only if it improves real separation of responsibility. Do not overbuild or unnecessarily rewrite the existing Codex execution path.

Keep `scripts/theme-factory.js` as the public orchestration entry point, but move local-model responsibilities into focused modules.

# 1. Provider Abstraction

Create a shared OpenAI-compatible provider implementation.

Both Ollama and LM Studio must expose a consistent internal interface, including:

- `chatCompletion(request)`
- `listModels()`
- `checkModel(modelId)`
- provider identity and model metadata
- normalized message content
- normalized tool-call responses
- normalized timeout, HTTP, model, and protocol errors
- declared provider capabilities

Default endpoints:

LM Studio:

```text
http://127.0.0.1:1234/v1

Ollama:

http://127.0.0.1:11434/v1

Requirements:

LM Studio and Ollama generation must use their OpenAI-compatible HTTP APIs.
Remove ollama run <model> from the active generation path.
Do not silently fall back to the Ollama CLI.
Preserve configurable base URLs, model IDs, API keys, temperatures, and timeouts.
Never log authorization headers or API keys.
Validate model availability before generation.
Add a capability preflight for required tool calling.
If the selected provider/model cannot perform the required tool-call workflow, fail clearly before theme generation.
Keep provider-specific behavior inside provider modules rather than spreading conditionals throughout the agent.

Keep these public modes unchanged:

codex-only
ollama-only
lmstudio-only

Keep these public npm commands unchanged:

npm run theme:run
npm run theme:resume
npm run theme:prepare
npm run theme:validate
npm run theme:build
npm run theme:preview
npm run theme:preview:index
npm run theme:zip
npm run theme:delete
npm run theme:env
npm run theme:model-check
npm run test:scripts

New optional flags may be added when necessary, but existing command behavior must remain compatible.

2. LocalModelAgent

Replace the current local-model generation implementation with a real LocalModelAgent.

Required stage flow:

load stage policy
→ build bounded initial context
→ begin provider conversation
→ execute bounded read-only tool loop
→ receive final unified diff
→ extract and validate patch
→ copy current theme to candidate directory
→ check patch against candidate
→ apply patch to candidate
→ run stage-specific candidate checks
→ commit candidate transactionally
→ record checkpoint and report evidence

The agent, not the model, owns:

filesystem access
path normalization
tool execution
patch parsing
write-scope enforcement
candidate creation
candidate checks
transactional replacement
reporting
checkpoints

Hard limits:

maximum tool calls per stage: 12
maximum individual tool response: 40 KB
maximum malformed tool-call retry: 1
maximum stage runtime: configurable, default 30 minutes
maximum initial context size: configurable and bounded
maximum cumulative tool output per stage: bounded
no semantic repair retry after a failed generated patch
no provider fallback
no file-block fallback

A malformed tool-call retry is a protocol retry before patch application. It must not become a repair pass for failed generated source.

Each stage starts from the successfully committed output of the previous stage.

Overlapping write ownership between stages must be explicit and justified. A later stage must not revert unrelated changes from an earlier stage.

3. Context Builder

Create scripts/lib/local-model/context.js.

The context builder must provide actual relevant source contents, not merely filenames.

Context rules:

Build context from the stage’s read scope.
Include directly relevant PHP, SCSS, JavaScript, JSON, Markdown, and theme configuration files.
Include theme.json when design-system context is relevant.
Include package.json when build behavior is relevant.
Prefer source files over generated or compiled output.
Excerpt large files rather than dumping them in full.
Summarize compiled CSS, compiled JavaScript, and lockfiles unless an exact excerpt is necessary.
Exclude:
node_modules
ZIP archives
binary images
Git internals
reports
generated previews
unrelated themes
Include file paths, sizes, truncation status, and line ranges in context metadata.
Enforce total and per-file context budgets.
Produce a context summary for the run report.
Never silently truncate without recording it.
Never allow resolved paths to escape the prepared theme directory.
Reject or safely handle symlinks that could escape the prepared theme directory.

The model must be told not to assume the contents of files it has neither received nor read through a tool.

4. Stage Read/Write Policies

Replace the current broad local-model stages with smaller, explicit stages similar to:

01-identity-copy
02-header-navigation
03-homepage-layout
04-page-templates
05-forms-admin
06-scss-design-system
07-js-interactions
08-footer-cleanup
09-docs-and-stale-copy-cleanup

Each stage must define:

id
promptSections
read
write
checks
optional context budget
optional tool-call limit
optional timeout

Example:

{
  id: '02-header-navigation',
  promptSections: [
    'Header and Navigation',
    'Header Behavior',
    'Accessibility'
  ],
  read: [
    'header.php',
    'footer.php',
    'functions.php',
    'inc/**',
    'src/scss/layout/_header.scss',
    'src/js/main.js'
  ],
  write: [
    'header.php',
    'footer.php',
    'src/scss/layout/_header.scss',
    'src/js/main.js'
  ],
  checks: [
    'php-lint',
    'javascript-syntax',
    'no-inline-style'
  ]
}

Important ownership rule:

Local models should generally edit source files, not generated build artifacts.

Do not give the model write ownership of:

assets/css/bundle.css
assets/js/bundle.js

Those files must be regenerated deterministically by npm run build.

Do not allow local models to modify package-lock.json or add dependencies unless a specifically authorized stage requires it. Any lockfile update must be produced deterministically by npm, not written manually by the model.

Read scope controls inspection.
Write scope controls patch targets.
The write scope must always be equal to or narrower than the intended responsibility of the stage.

5. Safe Read-Only Tools

Create scripts/lib/local-model/tools.js.

Expose these tools through the OpenAI-compatible tools interface:

list_files
read_file
read_file_excerpt
search_files

Do not expose:

write_file
unrestricted shell execution
arbitrary command execution
direct Git commands
direct patch application

All changes must arrive through the final unified diff.

Tool safety requirements:

all paths must resolve inside the prepared theme directory
all reads must match the current stage read scope
reject absolute paths
reject ../ traversal
reject null bytes and malformed paths
exclude node_modules
reject binary files
enforce file-size and response-size limits
enforce cumulative stage output limits
protect against symlink escapes
return deterministic structured errors
record every tool request and result metadata in the stage report
redact secrets and sensitive environment values

search_files should use bounded searches. Avoid uncontrolled regular expressions or unbounded repository-wide output.

6. Unified Diff Patch Protocol

Create scripts/lib/local-model/patch.js.

Unified diff is the only accepted local-model edit payload.

The final response may contain either:

one raw unified diff, or
one fenced diff block containing a unified diff

It must not contain explanatory prose, multiple competing patches, complete-file blocks, or unrelated output.

Required patch flow:

Extract exactly one unified diff.
Parse all old and new paths.
Normalize paths.
Reject:
absolute paths
../ traversal
paths outside the prepared theme
paths outside the stage write scope
binary patches
unsafe symlink targets
unsupported mode-only changes
malformed headers
Permit safe textual create, modify, and delete operations when authorized by the write scope.
Copy the current theme into a temporary candidate directory.
Run git apply --check against the candidate.
Apply the patch using git apply.
Verify which paths actually changed.
Confirm all changed paths remain inside the write scope.
Run candidate checks.
Replace the prepared theme only after every step succeeds.
Preserve the original prepared theme when any step fails.
Save the raw response, extracted diff, changed paths, and failure evidence in the report directory.

Remove active reliance on:

applyFileBlocks()
parseFileBlocks()
---FILE:
---END FILE---

Remove obsolete runtime code and documentation for that protocol.

A negative regression test may contain the old marker solely to prove that the old protocol is rejected. It must not remain as supported runtime behavior or documented usage.

7. Protocol Handling

Create scripts/lib/local-model/protocols.js.

Centralize:

unified diff extraction
final-response validation
normalized tool-call parsing
malformed tool-call handling
provider-independent protocol errors
rejection of legacy file-block output

Do not duplicate protocol parsing in:

provider modules
stage definitions
the main orchestration script
patch application code

The provider adapter normalizes provider responses.
The protocol layer interprets normalized responses.
The tool layer executes authorized reads.
The patch layer validates and applies the final diff.

8. Local-Model Stage Prompts

Each stage prompt must clearly state:

current provider
current model
current stage number and ID
owned production-prompt sections
read scope
write scope
available tools
stage-specific checks
current bounded context
final unified-diff requirement

Each stage prompt must tell the model:

inspect relevant files before proposing changes
use tools when required information is absent
do not assume unseen file contents
do not claim direct filesystem access
do not modify files directly
return tool calls while gathering context
return exactly one unified diff as the final answer
do not return prose with the final patch
do not use complete-file markers
do not touch paths outside the write scope
do not modify compiled bundles manually
preserve changes made by earlier successful stages
do not create previews, reports, ZIPs, commits, or repository-level files

Do not dump the entire repository into a single prompt.

9. Reporting, Console Progress, Checkpoints, and Resume

For every stage, write evidence under the theme’s run-report directory.

Include:

stage configuration
stage number and total
prompt-section ownership
read scope
write scope
checks
context summary
included and truncated files
provider metadata
exact model identifier
model/runtime configuration
tool calls and bounded tool-result metadata
request timestamps and durations
raw model response
extracted unified diff
changed paths
patch-check result
patch-application result
candidate-check result
checkpoint information
final status

Do not store:

API keys
authorization headers
secrets
unrelated environment values

Add clear real-time console progress.

Example:

[2026-07-10T12:00:00Z] [LocalModelAgent] Starting generation
[LocalModelAgent] Provider: lmstudio
[LocalModelAgent] Model: qwen/qwen2.5-coder-14b
[LocalModelAgent] Theme: 009_nolan_young_theme_example
[LocalModelAgent] Stages: 9

[Stage 1/9] 01-identity-copy starting
[Stage 1/9] Building bounded context
[Stage 1/9] Context ready: 14 files, 86 KB
[Stage 1/9] Sending model request
[Stage 1/9] Tool call 1/12: read_file(header.php)
[Stage 1/9] Tool result returned
[Stage 1/9] Model final response received
[Stage 1/9] Extracting unified diff
[Stage 1/9] Validating patch paths
[Stage 1/9] Applying patch to candidate
[Stage 1/9] Running candidate checks
[Stage 1/9] Checkpoint committed
[Stage 1/9] Completed successfully in 00:08:42

Console requirements:

stage number and total
stage ID
provider
model
context progress
model request progress
tool-call count
patch extraction progress
patch validation progress
patch application progress
candidate-check progress
elapsed time
success, failure, or blocked state
report path on failure

Keep or improve heartbeat behavior.

During a long provider request, print a heartbeat at a reasonable configurable interval, such as every 60–120 seconds, including elapsed time. Do not print the same line continuously or expose raw secrets.

Add stage-level checkpoints.

After every successful stage, record:

completed stage ID
prompt hash
template/source hash
provider
model ID
stage-policy hash
resulting theme-state hash
report paths

Support operational resumption after interruption through an explicit flag such as:

--resume-local

or:

--resume-from-stage <stage-id>

Resume is allowed only when stored hashes still match the current:

prompt
prepared theme
template source
provider
model
stage policy

Operational resume after interruption is not an AI repair pass. Do not rerun or repair a completed failed-generation stage automatically.

10. Validation and Tests

Add focused unit and integration tests.

At minimum, test:

Provider layer
base URL normalization
model listing
model-check failures
timeout normalization
HTTP error normalization
normalized message content
normalized tool calls
secret redaction
Context layer
read-scope enforcement
context-size limits
deterministic truncation
binary exclusion
node_modules exclusion
path traversal rejection
symlink escape rejection
Tool layer
valid file listing
valid file reads
valid excerpts
valid bounded searches
denied out-of-scope paths
denied absolute paths
denied traversal
denied binary files
response-size enforcement
tool-call limit enforcement
Patch layer
valid modification
valid new text file
valid authorized deletion
malformed diff rejection
multiple-patch rejection
commentary rejection
file-block rejection
binary patch rejection
absolute-path rejection
traversal rejection
out-of-write-scope rejection
failed git apply --check
transactional preservation after failure
Stage and agent layer
prompt-section coverage
read/write policy validation
stage ordering
candidate-check failure behavior
progress-event generation
checkpoint creation
safe resume validation
resume hash mismatch rejection
no repair retry

Use a mocked OpenAI-compatible HTTP server for deterministic automated provider and tool-call tests.

The standard script test suite must not require Ollama or LM Studio to be running. Live-provider tests must be separate and explicitly requested.

Run:

node --check on all changed JavaScript files
npm run test:scripts
all new unit tests
all new integration tests
existing source validation
provider model checks before benchmark generation

Do not weaken validators, previews, or packaging to make generated output pass.

Cross-Cutting Requirement — Mode-Independent Asset Preparation

Asset preparation must be identical across generation modes.

The current workflow must not seed or prepare useful assets only for Codex.

Before each benchmark run:

Start from the same template source.
Use the same benchmark creative brief.
Use the same approved asset set.
Use equivalent copies of the same asset manifest.
Complete asset preparation before invoking Codex, Ollama, or LM Studio.
Do not let one provider receive photography or assets unavailable to the others.
Record the asset manifest hash in every benchmark report.

Asset preparation belongs to the deterministic pre-generation workflow, not to one provider branch.

Benchmark Generation

After the architecture, documentation, and tests pass, create one new benchmark creative brief under:

prompts/pending/

Use the exact same brief for all three modes.

Choose one business name and one normalized benchmark description slug. Use explicit theme slugs:

007_nolan_young_theme_<benchmark_description>
008_nolan_young_theme_<benchmark_description>
009_nolan_young_theme_<benchmark_description>

Do not use different creative briefs to make one mode easier.

Benchmark mapping:

Theme 007
mode: codex-only
theme number: 007
Theme 008
mode: ollama-only
theme number: 008
model: qwen2.5-coder:14b
transport: OpenAI-compatible HTTP
Theme 009
mode: lmstudio-only
theme number: 009
model: Qwen 2.5 Coder 14B equivalent
transport: OpenAI-compatible HTTP

For LM Studio, discover and use the exact model ID reported by the server.

Record:

provider
exact model ID
quantization where available
context configuration
temperature
timeout
tool support result
stage durations

Do not claim the Ollama and LM Studio models are byte-for-byte identical if their packaging or quantization differs.

Fair-comparison requirements:

same Git commit before each prepared copy
same template source
same creative brief
same approved assets
same stage policy
same checks
same local-model temperature where supported
fresh prepared theme for each mode
no output from one mode used as input to another

For each theme, run the normal public workflow rather than bypassing it.

Each theme must independently pass:

npm run build
source validation
preview rendering
preview-index generation
ZIP packaging
artifact validation

Do not manually patch a generated theme after model generation to make it pass.

If a generated theme fails, preserve it and its report as failed model output. Do not mark the benchmark complete.

Git and Delivery Requirements

Use normal Git operations only.

Before editing:

confirm the intended branch is main
confirm the working tree is clean or clearly account for existing user changes
fetch origin
confirm no unreviewed divergence

Do not:

force-push
rewrite published history
discard existing user changes
overwrite occupied theme numbers
commit secrets
commit node_modules

Use clear commits, preferably separated into:

LocalModelAgent architecture and provider refactor
Tests and documentation
Theme 007 Codex benchmark output
Theme 008 Ollama benchmark output
Theme 009 LM Studio benchmark output
Final preview index/report adjustments, if necessary

Before pushing:

rerun the complete deterministic test suite
inspect git diff
inspect staged files
confirm no secrets or unintended artifacts
confirm required ZIPs and reports are intentionally included
confirm all three previews are indexed
confirm the branch is not behind origin/main

Push normally to:

origin/main

If the remote advanced and cannot be reconciled safely, stop and report the conflict. Never force-push.

Final Response

At completion, provide:

Architectural summary
Files added, removed, and materially changed
Confirmation that the file-block runtime was removed
Provider abstraction summary
Tool and patch safety summary
Test commands and results
Exact benchmark prompt path
Exact three theme slugs
Exact provider/model IDs
Build, source validation, preview, ZIP, and artifact-validation results for each theme
Report paths
ZIP paths
Preview paths
Commit SHAs
Confirmation that commits are present on origin/main
Any remaining limitations

Do not state that the project is complete unless every mandatory completion criterion has been verified.
