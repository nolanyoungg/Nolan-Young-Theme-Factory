#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
theme_slug="${1:-}"

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

[ -n "$theme_slug" ] || fail "Usage: bash scripts/package-theme.sh <theme-slug>"
[[ "$theme_slug" =~ ^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$ ]] || fail "Invalid theme slug: $theme_slug"

theme_dir="$repo_root/wp-content/themes/$theme_slug"
zip_dir="$repo_root/dist/zipped-themes"
zip_path="$zip_dir/$theme_slug.zip"

[ -d "$theme_dir" ] || fail "Theme directory missing: wp-content/themes/$theme_slug"
mkdir -p "$zip_dir"
rm -f "$zip_path"

if command -v zip >/dev/null 2>&1; then
  (
    cd "$repo_root/wp-content/themes"
    zip -qr "../../dist/zipped-themes/$theme_slug.zip" "$theme_slug" \
      -x "$theme_slug/node_modules/*" \
      -x "$theme_slug/.git/*" \
      -x "$theme_slug/*.log" \
      -x "$theme_slug/**/*.log" \
      -x "$theme_slug/**/*.map"
  )
elif command -v powershell.exe >/dev/null 2>&1; then
  ps_theme_dir="$theme_dir"
  ps_zip_path="$zip_path"
  if command -v cygpath >/dev/null 2>&1; then
    ps_theme_dir="$(cygpath -w "$theme_dir")"
    ps_zip_path="$(cygpath -w "$zip_path")"
  fi
  THEME_FACTORY_PACKAGE_SOURCE="$ps_theme_dir" \
    THEME_FACTORY_PACKAGE_ZIP="$ps_zip_path" \
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command \
      "\$ErrorActionPreference='Stop'; Compress-Archive -LiteralPath \$env:THEME_FACTORY_PACKAGE_SOURCE -DestinationPath \$env:THEME_FACTORY_PACKAGE_ZIP -Force"
else
  fail "Packaging requires zip or powershell.exe"
fi

[ -f "$zip_path" ] || fail "ZIP was not created: dist/zipped-themes/$theme_slug.zip"
printf 'Created dist/zipped-themes/%s.zip\n' "$theme_slug"
