#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-common.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

run_validators() {
  local slug="$1"
  bash "$script_dir/validate-theme-structure.sh" "$slug"
  bash "$script_dir/validate-theme-quality.sh" "$slug"
  bash "$script_dir/validate-preview.sh" "$slug"
  bash "$script_dir/validate-nolan-menu.sh" "$slug"
  bash "$script_dir/validate-security.sh" "$slug"
  bash "$script_dir/validate-zip-freshness.sh" "$slug"
}

if [ "${1:-}" != "" ]; then
  run_validators "$1"
  exit 0
fi

found=0
while IFS= read -r theme_dir; do
  found=1
  run_validators "$(basename "$theme_dir")"
done < <(
  find "$root_dir/wp-content/themes" -mindepth 1 -maxdepth 1 -type d \
    -name '[0-9][0-9][0-9]_nolan_young_theme_*' | sort
)

if [ "$found" -eq 0 ]; then
  printf 'No generated themes found.\n'
fi
