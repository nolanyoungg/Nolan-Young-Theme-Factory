#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-common.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

validate_prompt_lifecycle_for_slug() {
  local slug="$1"
  local run_dir="$root_dir/reports/runs/$slug"
  local completed_dir="$root_dir/prompts/completed"
  local selected_prompt=""
  local matches=()
  local candidate

  [ -d "$run_dir" ] || theme_factory_fail "Missing run report for generated theme: reports/runs/$slug"

  if [ -f "$run_dir/selected-prompt.md" ]; then
    selected_prompt="$run_dir/selected-prompt.md"
  elif [ -f "$run_dir/selected-prompt.txt" ]; then
    selected_prompt="$run_dir/selected-prompt.txt"
  else
    theme_factory_fail "Missing selected prompt copy for $slug"
  fi

  [ -s "$selected_prompt" ] || theme_factory_fail "Selected prompt copy is empty for $slug"
  [ -d "$completed_dir" ] || theme_factory_fail "Missing prompts/completed directory"

  while IFS= read -r candidate; do
    [ -n "$candidate" ] && matches+=("$candidate")
  done < <(find "$completed_dir" -maxdepth 1 -type f \( -name "${slug}__*.txt" -o -name "${slug}__*.md" \) | sort)

  [ "${#matches[@]}" -gt 0 ] || theme_factory_fail "Missing completed prompt archive for $slug"

  for candidate in "${matches[@]}"; do
    if [ -s "$candidate" ] && diff -q <(tr -d '\r' < "$selected_prompt") <(tr -d '\r' < "$candidate") >/dev/null; then
      printf 'Prompt lifecycle validation passed for %s.\n' "$slug"
      return 0
    fi
  done

  theme_factory_fail "No completed prompt archive matches reports/runs/$slug/selected-prompt.*"
}

if [ "${1:-}" != "" ]; then
  validate_prompt_lifecycle_for_slug "$1"
  exit 0
fi

found=0
while IFS= read -r run_dir; do
  found=1
  validate_prompt_lifecycle_for_slug "$(basename "$run_dir")"
done < <(
  find "$root_dir/reports/runs" -mindepth 1 -maxdepth 1 -type d \
    -name '[0-9][0-9][0-9]_nolan_young_theme_*' | sort
)

if [ "$found" -eq 0 ]; then
  printf 'No run reports found; prompt lifecycle validation skipped.\n'
fi
