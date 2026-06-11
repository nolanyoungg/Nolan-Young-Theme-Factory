#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-shared-functions.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

theme_factory_require_cmd curl
theme_factory_require_cmd git
theme_factory_require_cmd node

commit_ref="${1:-HEAD}"
repo="${GITHUB_REPOSITORY:-nolanyoungg/Nolan-Young-Theme-Factory}"
commit_sha="$(git rev-parse "$commit_ref")"
api_url="https://api.github.com/repos/${repo}/commits/${commit_sha}/check-runs"
tmp_json="$(mktemp)"

cleanup() {
  rm -f "$tmp_json"
}
trap cleanup EXIT

curl -fsSL --noproxy '*' \
  -H 'Accept: application/vnd.github+json' \
  -H 'User-Agent: nolan-theme-factory-local-checks' \
  "$api_url" \
  -o "$tmp_json"

node - "$tmp_json" <<'NODE'
const fs = require('fs');

const inputPath = process.argv[2];
const payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const runs = Array.isArray(payload.check_runs) ? payload.check_runs : [];

if (runs.length === 0) {
  console.log('No check runs found for this commit.');
  process.exit(2);
}

for (const run of runs) {
  const conclusion = run.conclusion || 'pending';
  console.log(run.name + ': ' + run.status + ' / ' + conclusion);
}

const failed = runs.some((run) => run.status === 'completed' && run.conclusion !== 'success');
const pending = runs.some((run) => run.status !== 'completed');

if (failed) {
  process.exit(1);
}

if (pending) {
  process.exit(2);
}

process.exit(0);
NODE
