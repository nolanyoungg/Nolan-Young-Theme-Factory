#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-common.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

slug="${1:-}"
[ -n "$slug" ] || theme_factory_fail "Usage: bash scripts/validate-preview.sh <theme-slug>"

preview_dir="$root_dir/docs/themes/$slug"
failures=0

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  failures=$((failures + 1))
}

[ -f "$preview_dir/index.html" ] || fail "Missing preview index.html"
[ -f "$preview_dir/assets/css/preview.css" ] || fail "Missing preview CSS"
[ -f "$preview_dir/assets/js/preview.js" ] || fail "Missing preview JS"
[ -f "$preview_dir/README.md" ] || fail "Missing preview README"

if [ -f "$preview_dir/index.html" ]; then
  [ -s "$preview_dir/index.html" ] || fail "Preview index.html is empty"
  grep -q 'assets/css/preview.css' "$preview_dir/index.html" || fail "Preview HTML does not reference preview CSS"
  grep -q 'assets/js/preview.js' "$preview_dir/index.html" || fail "Preview HTML does not reference preview JS"
fi

if [ -f "$preview_dir/assets/css/preview.css" ]; then
  [ -s "$preview_dir/assets/css/preview.css" ] || fail "Preview CSS is empty"
fi

if [ -f "$preview_dir/assets/js/preview.js" ]; then
  [ -s "$preview_dir/assets/js/preview.js" ] || fail "Preview JS is empty"
fi

if [ -f "$root_dir/docs/index.html" ]; then
  grep -q "themes/$slug/index.html" "$root_dir/docs/index.html" || fail "docs/index.html does not link to the preview"
else
  fail "Missing docs/index.html"
fi

if grep -R -I -n -E \
  --exclude='*.svg' \
  --exclude='*.png' \
  --exclude='*.jpg' \
  --exclude='*.jpeg' \
  --exclude='*.webp' \
  --exclude='*.gif' \
  '<(script|link|img|source|video|audio)[^>]+(src|href)=["'"'"'][^"'"'"']*https?://|@import[[:space:]]+url\(["'"'"']?https?://|url\(["'"'"']?https?://|//cdn\.|cdnjs|jsdelivr|unpkg|fonts\.google|gstatic' "$preview_dir" 2>/dev/null | grep -v 'https://www.w3.org' >/dev/null; then
  grep -R -I -n -E \
    --exclude='*.svg' \
    --exclude='*.png' \
    --exclude='*.jpg' \
    --exclude='*.jpeg' \
    --exclude='*.webp' \
    --exclude='*.gif' \
    '<(script|link|img|source|video|audio)[^>]+(src|href)=["'"'"'][^"'"'"']*https?://|@import[[:space:]]+url\(["'"'"']?https?://|url\(["'"'"']?https?://|//cdn\.|cdnjs|jsdelivr|unpkg|fonts\.google|gstatic' "$preview_dir" 2>/dev/null | grep -v 'https://www.w3.org' >&2
  fail "Preview uses remote runtime dependencies"
fi

if [ "$failures" -gt 0 ]; then
  printf 'Preview validation failed for %s with %s issue(s).\n' "$slug" "$failures" >&2
  exit 1
fi

printf 'Preview validation passed for %s.\n' "$slug"
