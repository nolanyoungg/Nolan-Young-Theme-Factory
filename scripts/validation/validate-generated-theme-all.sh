#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

theme_slug="${1:-}"
template_name="${2:-${THEME_TEMPLATE:-NOLAN-YOUNG-theme-000}}"
failures=0

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  failures=$((failures + 1))
}

[ -n "$theme_slug" ] || {
  printf 'Usage: bash scripts/validation/validate-generated-theme-all.sh <theme-slug> [template-name]\n' >&2
  exit 1
}

bash scripts/validation/validate-theme-from-template.sh "$theme_slug" "$template_name"
bash scripts/validation/theme-quality-check.sh "$theme_slug"

preview_dir="docs/Preview-Themes-Github/$theme_slug"
zip_path="dist/zipped-themes/$theme_slug.zip"

[ -d "$preview_dir" ] || fail "Preview folder is missing: $preview_dir"

if [ -d "$preview_dir" ]; then
  for page in \
    index.html \
    homepage_preview.html \
    services_preview.html \
    about-us_preview.html \
    contact_preview.html \
    single_services_preview.html \
    blog_preview.html \
    work_preview.html; do
    [ -f "$preview_dir/$page" ] || fail "Preview page is missing: $preview_dir/$page"
  done

  for asset in assets/css/preview.css assets/js/preview.js assets/images/README.md; do
    [ -f "$preview_dir/$asset" ] || fail "Preview asset is missing: $preview_dir/$asset"
  done

  if ! grep -R -I -n -E '<header[[:space:]>]' "$preview_dir"/*.html >/dev/null 2>&1; then
    fail "Preview pages are missing header markup"
  fi

  if grep -R -I -n -E 'Lorem ipsum|TODO|FIXME|Generation should replace|Static preview generated from|prepared WordPress theme folder' \
    "$preview_dir" --include='*.html' --include='*.css' --include='*.js' >/dev/null 2>&1; then
    fail "Preview contains unfinished placeholder/runtime copy"
  fi

  if grep -R -I -n -E '<(script|link|img|source|video|audio)[^>]+(src|href)=["'"'"'][^"'"'"']*https?://|@import[[:space:]]+url\(["'"'"']?https?://|url\(["'"'"']?https?://|//cdn\.|cdnjs|jsdelivr|unpkg|fonts\.google|gstatic' \
    "$preview_dir" --include='*.html' --include='*.css' --include='*.js' >/dev/null 2>&1; then
    fail "Preview contains a remote runtime dependency or CDN reference"
  fi
fi

[ -f "$zip_path" ] || fail "Theme ZIP is missing: $zip_path"

if [ -f "$zip_path" ]; then
  if command -v unzip >/dev/null 2>&1; then
    zip_listing="$(unzip -l "$zip_path")"
  elif command -v tar >/dev/null 2>&1; then
    zip_listing="$(tar -tf "$zip_path")"
  else
    zip_listing=""
    printf 'WARNING: neither unzip nor tar is available; skipped ZIP content validation.\n' >&2
  fi

  if [ -n "$zip_listing" ]; then
    printf '%s\n' "$zip_listing" | grep -q "$theme_slug/style.css" || fail "ZIP does not contain $theme_slug/style.css"
    if printf '%s\n' "$zip_listing" | grep -E '(^|/)(node_modules|\.generation|reports)(/|$)' >/dev/null; then
      fail "ZIP contains excluded transient folders"
    fi
  fi
fi

grep -q "$theme_slug" docs/index.html || fail "Preview gallery does not link to $theme_slug"

node scripts/preview/validate-preview-gallery.js

if [ "$failures" -gt 0 ]; then
  printf 'Generated theme validation failed for %s with %s issue(s).\n' "$theme_slug" "$failures" >&2
  exit 1
fi

printf 'Generated theme validation passed for %s.\n' "$theme_slug"
