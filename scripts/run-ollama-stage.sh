#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-common.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

stage="${1:-}"
slug="${2:-}"
prompt_file="${3:-}"
target_root="${4:-$root_dir}"

[ -n "$stage" ] || theme_factory_fail "Usage: bash scripts/run-ollama-stage.sh <planner|builder|preview|review-fix> <theme-slug> <prompt-file> [target-root]"
[ -n "$slug" ] || theme_factory_fail "Missing theme slug."
[ -n "$prompt_file" ] || theme_factory_fail "Missing prompt file."
[ -f "$prompt_file" ] || theme_factory_fail "Prompt file not found: $prompt_file"

case "$stage" in
  planner|builder|preview|review-fix) ;;
  *) theme_factory_fail "Unsupported Ollama stage: $stage" ;;
esac

theme_factory_require_cmd ollama
ollama_model="$(theme_factory_select_ollama_model)"
run_dir="$(cd "$(dirname "$prompt_file")" && pwd)"
raw_file="$run_dir/ollama-$stage-raw.md"

printf 'Running Ollama stage %s with model %s\n' "$stage" "$ollama_model"
printf 'Prompt: %s\n' "$prompt_file"
printf 'Raw output: %s\n' "$raw_file"

if [ "$stage" = "planner" ]; then
  ollama run "$ollama_model" < "$prompt_file" 2>&1 | tee "$raw_file"
  cp "$raw_file" "$run_dir/plan.md"
  exit 0
fi

ollama run "$ollama_model" < "$prompt_file" 2>&1 | tee "$raw_file"
theme_factory_apply_file_blocks "$raw_file" "$target_root"
