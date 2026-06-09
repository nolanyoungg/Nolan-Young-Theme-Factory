#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-common.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

theme_slug="${1:-}"
[ -n "$theme_slug" ] || theme_factory_fail "Usage: bash scripts/package-theme.sh <theme-slug>"
theme_factory_validate_slug "$theme_slug"

theme_dir="$root_dir/wp-content/themes/$theme_slug"
zip_dir="$root_dir/dist/zipped-themes"
zip_path="$zip_dir/$theme_slug.zip"

[ -d "$theme_dir" ] || theme_factory_fail "Theme directory is missing: $theme_dir"

mkdir -p "$zip_dir"
rm -f "$zip_path"

if command -v zip >/dev/null 2>&1; then
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
elif command -v powershell.exe >/dev/null 2>&1; then
  if [ -d "$theme_dir/node_modules" ] || [ -d "$theme_dir/.git" ] || [ -d "$theme_dir/reports" ] || [ -d "$theme_dir/tmp" ]; then
    theme_factory_fail "PowerShell packaging fallback refuses to package excluded directories. Install zip or remove generated dependency/temp folders."
  fi

  ps_themes_dir="$root_dir/wp-content/themes"
  ps_zip_path="$zip_path"
  if command -v cygpath >/dev/null 2>&1; then
    ps_themes_dir="$(cygpath -w "$ps_themes_dir")"
    ps_zip_path="$(cygpath -w "$ps_zip_path")"
  fi

  THEME_FACTORY_PACKAGE_SLUG="$theme_slug" \
    THEME_FACTORY_PACKAGE_THEMES_DIR="$ps_themes_dir" \
    THEME_FACTORY_PACKAGE_ZIP_PATH="$ps_zip_path" \
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command \
      "\$ErrorActionPreference = 'Stop'; \$themeSlug = \$env:THEME_FACTORY_PACKAGE_SLUG; \$themesDir = \$env:THEME_FACTORY_PACKAGE_THEMES_DIR; \$zipPath = \$env:THEME_FACTORY_PACKAGE_ZIP_PATH; Push-Location -LiteralPath \$themesDir; try { Compress-Archive -LiteralPath \$themeSlug -DestinationPath \$zipPath -Force } finally { Pop-Location }"
else
  theme_factory_fail "Packaging requires zip or powershell.exe with Compress-Archive."
fi

[ -f "$zip_path" ] || theme_factory_fail "ZIP was not created: $zip_path"
size="$(wc -c < "$zip_path" | tr -d ' ')"
printf 'Created %s (%s bytes)\n' "$zip_path" "$size"
