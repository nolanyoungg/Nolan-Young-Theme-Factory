#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

canonical_path() {
  local target="$1"
  if command -v cygpath >/dev/null 2>&1; then
    cygpath -m "$target"
  else
    (cd "$target" && pwd)
  fi
}

theme_slug="${1:-}"
template_name="${2:-${THEME_TEMPLATE:-}}"

[ -n "$theme_slug" ] || fail "Usage: bash scripts/validate-theme-from-template.sh <theme-slug> [template-name]"
[[ "$theme_slug" =~ ^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$ ]] || fail "Invalid theme slug: $theme_slug"

theme_dir="$repo_root/wp-content/themes/$theme_slug"
[ -d "$theme_dir" ] || fail "Generated theme folder not found: wp-content/themes/$theme_slug"

themes_root="$(canonical_path "$repo_root/wp-content/themes")"
resolved_theme_dir="$(canonical_path "$theme_dir")"
case "$resolved_theme_dir" in
  "$themes_root"/*) ;;
  *) fail "Generated theme is outside wp-content/themes: $theme_dir" ;;
esac

if [ -z "$template_name" ] && [ -f "$theme_dir/.theme-template-source" ]; then
  template_name="$(sed -n 's/^template=//p' "$theme_dir/.theme-template-source" | head -n 1)"
fi

[ -n "$template_name" ] || template_name="NOLAN-YOUNG-theme-000"
template_dir="$repo_root/wordpress-themplate-themes/$template_name"
[ -d "$template_dir" ] || fail "Template not found: wordpress-themplate-themes/$template_name"

missing=0
while IFS= read -r template_file; do
  [ -f "$theme_dir/$template_file" ] || {
    printf 'Missing template file: %s\n' "$template_file" >&2
    missing=$((missing + 1))
  }
done < <(cd "$template_dir" && find . -type f ! -path './node_modules/*' -printf '%P\n' | sort)

[ "$missing" -eq 0 ] || fail "$missing template file(s) missing from wp-content/themes/$theme_slug"

printf 'Template-aware validation passed.\n'
printf 'Theme: %s\n' "$theme_slug"
printf 'Template: %s\n' "$template_name"
