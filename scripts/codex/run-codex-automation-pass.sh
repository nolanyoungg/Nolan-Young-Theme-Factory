#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/../repo/theme-factory-shared-functions.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

slug="${1:-}"
prompt_file="${2:-}"

[ -n "$slug" ] || theme_factory_fail "Usage: bash scripts/codex/run-codex-automation-pass.sh <theme-slug> <prompt-file>"
[ -n "$prompt_file" ] || theme_factory_fail "Missing prompt file."
[ -f "$prompt_file" ] || theme_factory_fail "Prompt file not found: $prompt_file"

codex_command="$(theme_factory_normalize_codex_command "${CODEX_COMMAND:-codex exec}")"
theme_factory_require_cmd "${codex_command%% *}"

run_dir="$(cd "$(dirname "$prompt_file")" && pwd)"
last_message="$run_dir/codex-last-message.md"
raw_file="$run_dir/codex-final-raw.md"

printf 'Running Codex pass with command: %s\n' "$codex_command"
printf 'Prompt: %s\n' "$prompt_file"
printf 'Last message: %s\n' "$last_message"

quoted_last_message="$(printf '%q' "$last_message")"
cmd="$codex_command --output-last-message $quoted_last_message -"
bash -lc "$cmd" < "$prompt_file" 2>&1 | tee "$raw_file"
