#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

temp_manifest="$(mktemp)"
temp_manifest="${temp_manifest%.tmp}.json"

node -e "JSON.parse(require('fs').readFileSync('config/workflow-modes.json','utf8')); JSON.parse(require('fs').readFileSync('config/theme-factory.defaults.json','utf8'));"
node scripts/create-template-manifest.js NOLAN-YOUNG-theme-000 "$temp_manifest" >/dev/null
[ -s "$temp_manifest" ] || fail "Template manifest was not created."
rm -f "$temp_manifest"

bash scripts/theme-factory.sh help >/dev/null
bash scripts/theme-factory.sh list-templates >/dev/null
node scripts/run-theme-workflow.js --help >/dev/null
node scripts/run-theme-workflow.js --mode hybrid --prompt prompts/pending/000-testing.md --template NOLAN-YOUNG-theme-000 --dry-run >/dev/null

printf 'Smoke test passed.\n'
