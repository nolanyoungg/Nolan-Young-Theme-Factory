#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-common.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

slug="${1:-}"
prompt_file="${2:-}"

[ -n "$slug" ] || theme_factory_fail "Usage: bash scripts/run-codex-final-pass.sh <theme-slug> <prompt-file>"
[ -n "$prompt_file" ] || theme_factory_fail "Missing prompt file."
[ -f "$prompt_file" ] || theme_factory_fail "Prompt file not found: $prompt_file"

codex_command="${CODEX_COMMAND:-codex}"
theme_factory_require_cmd "${codex_command%% *}"

run_dir="$(cd "$(dirname "$prompt_file")" && pwd)"
last_message="$run_dir/codex-last-message.md"
raw_file="$run_dir/codex-final-raw.md"

printf 'Running Codex final pass with command: %s\n' "$codex_command"
printf 'Prompt: %s\n' "$prompt_file"
printf 'Last message: %s\n' "$last_message"

cmd="$codex_command --output-last-message \"$last_message\" \"$prompt_file\""
bash -lc "$cmd" 2>&1 | tee "$raw_file"
