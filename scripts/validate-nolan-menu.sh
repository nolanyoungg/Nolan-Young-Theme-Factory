#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-common.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

slug="${1:-}"
[ -n "$slug" ] || theme_factory_fail "Usage: bash scripts/validate-nolan-menu.sh <theme-slug>"

theme_dir="$root_dir/wp-content/themes/$slug"
preview_dir="$root_dir/docs/themes/$slug"
failures=0

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  failures=$((failures + 1))
}

require_pattern() {
  local label="$1"
  local pattern="$2"
  shift 2
  grep -R -I -n -E "$pattern" "$@" >/dev/null 2>&1 || fail "$label"
}

for path in "$theme_dir" "$preview_dir"; do
  [ -d "$path" ] || {
    fail "Missing path for Nolan-menu validation: ${path#$root_dir/}"
    continue
  }

  require_pattern "Missing Services menu trigger in ${path#$root_dir/}" 'data-menu-item=["'\'']services["'\'']' "$path"
  require_pattern "Missing Services dropdown in ${path#$root_dir/}" 'data-menu-dropdown=["'\'']services["'\'']' "$path"
  require_pattern "Missing About menu trigger in ${path#$root_dir/}" 'data-menu-item=["'\'']about["'\'']' "$path"
  require_pattern "Missing About dropdown in ${path#$root_dir/}" 'data-menu-dropdown=["'\'']about["'\'']' "$path"
  require_pattern "Missing Blog menu trigger in ${path#$root_dir/}" 'data-menu-item=["'\'']blog["'\'']' "$path"
  require_pattern "Missing Blog dropdown in ${path#$root_dir/}" 'data-menu-dropdown=["'\'']blog["'\'']' "$path"
  require_pattern "Missing Nolan-menu rail controls in ${path#$root_dir/}" 'data-rail-item=' "$path"
  require_pattern "Missing Nolan-menu rail content in ${path#$root_dir/}" 'data-rail-content=' "$path"
  require_pattern "Missing aria-controls in ${path#$root_dir/}" 'aria-controls=' "$path"
  require_pattern "Missing aria-expanded in ${path#$root_dir/}" 'aria-expanded=' "$path"
done

if [ -d "$theme_dir" ]; then
  if grep -R -I -n -E 'data-menu-item=["'\'']contact["'\'']|<a[^>]*class=["'\''][^"'\'']*(nav|menu)[^"'\'']*["'\''][^>]*>\s*Contact\s*</a>' "$theme_dir" >/dev/null 2>&1; then
    grep -R -I -n -E 'data-menu-item=["'\'']contact["'\'']|<a[^>]*class=["'\''][^"'\'']*(nav|menu)[^"'\'']*["'\''][^>]*>\s*Contact\s*</a>' "$theme_dir" >&2
    fail "Contact must not be a primary desktop nav item"
  fi

  require_pattern "Theme JS must handle Escape key" 'Escape' "$theme_dir/assets/js" "$theme_dir/src/js"
  require_pattern "Theme JS must update aria-expanded" 'aria-expanded' "$theme_dir/assets/js" "$theme_dir/src/js"
  require_pattern "Theme JS must handle outside click or pointer close behavior" 'contains\(|closest\(|addEventListener\(["'\'']click' "$theme_dir/assets/js" "$theme_dir/src/js"
  require_pattern "Theme JS must manage body scroll/menu state" 'body|document\.body|classList' "$theme_dir/assets/js" "$theme_dir/src/js"
fi

if [ -d "$preview_dir" ]; then
  require_pattern "Preview must link Work to work_preview.html" 'href=["'\'']work_preview\.html["'\'']' "$preview_dir"
  require_pattern "Preview must link Contact CTA to contact_preview.html" 'href=["'\'']contact_preview\.html["'\'']' "$preview_dir"
  require_pattern "Preview must link service details to single_services_preview.html" 'href=["'\'']single_services_preview\.html["'\'']' "$preview_dir"
fi

if [ "$failures" -gt 0 ]; then
  printf 'Nolan-menu validation failed for %s with %s issue(s).\n' "$slug" "$failures" >&2
  exit 1
fi

printf 'Nolan-menu validation passed for %s.\n' "$slug"
