#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-common.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

theme_slug="${1:-}"
[ -n "$theme_slug" ] || theme_factory_fail "Usage: bash scripts/package-theme.sh <theme-slug>"
[[ "$theme_slug" =~ ^nolan-showcase-theme-[0-9][0-9]$ ]] || theme_factory_fail "Invalid theme slug: $theme_slug"

theme_dir="$root_dir/wp-content/themes/$theme_slug"
zip_dir="$root_dir/dist/zipped-themes"
zip_path="$zip_dir/$theme_slug.zip"

[ -d "$theme_dir" ] || theme_factory_fail "Theme directory is missing: $theme_dir"
theme_factory_require_cmd zip

mkdir -p "$zip_dir"
rm -f "$zip_path"

(
  cd "$root_dir/wp-content/themes"
  zip -qr "../../dist/zipped-themes/$theme_slug.zip" "$theme_slug" \
    -x "$theme_slug/node_modules/*" \
    -x "$theme_slug/.git/*" \
    -x "$theme_slug/.DS_Store" \
    -x "$theme_slug/**/*.map" \
    -x "$theme_slug/reports/*" \
    -x "$theme_slug/tmp/*" \
    -x "$theme_slug/*.log" \
    -x "$theme_slug/**/*.log"
)

[ -f "$zip_path" ] || theme_factory_fail "ZIP was not created: $zip_path"
size="$(wc -c < "$zip_path" | tr -d ' ')"
printf 'Created %s (%s bytes)\n' "$zip_path" "$size"
