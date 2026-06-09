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

required_preview_files=(
  homepage_preview.html
  services_preview.html
  about-us_preview.html
  contact_preview.html
  single_services_preview.html
  blog_preview.html
  work_preview.html
)

required_preview_links=(
  homepage_preview.html
  services_preview.html
  about-us_preview.html
  contact_preview.html
  single_services_preview.html
  blog_preview.html
  work_preview.html
)

for file in "${required_preview_files[@]}"; do
  page="$preview_dir/$file"
  if [ ! -f "$page" ]; then
    fail "Missing required preview page: docs/themes/$slug/$file"
    continue
  fi

  [ -s "$page" ] || fail "Preview page is empty: docs/themes/$slug/$file"
  grep -q 'assets/css/preview.css' "$page" || fail "$file does not reference local preview CSS"
  grep -q 'assets/js/preview.js' "$page" || fail "$file does not reference local preview JS"

  for link in "${required_preview_links[@]}"; do
    grep -q "$link" "$page" || fail "$file does not link to $link"
  done

  grep -q 'data-menu-item="services"' "$page" || fail "$file missing data-menu-item=\"services\""
  grep -q 'data-menu-dropdown="services"' "$page" || fail "$file missing data-menu-dropdown=\"services\""
  grep -q 'data-menu-item="about"' "$page" || fail "$file missing data-menu-item=\"about\""
  grep -q 'data-menu-dropdown="about"' "$page" || fail "$file missing data-menu-dropdown=\"about\""
  grep -q 'data-menu-item="blog"' "$page" || fail "$file missing data-menu-item=\"blog\""
  grep -q 'data-menu-dropdown="blog"' "$page" || fail "$file missing data-menu-dropdown=\"blog\""
  grep -q 'data-rail-item=' "$page" || fail "$file missing data-rail-item controls"
  grep -q 'data-rail-content=' "$page" || fail "$file missing data-rail-content sections"
  grep -q 'aria-controls=' "$page" || fail "$file missing aria-controls on menu triggers"
  grep -q 'aria-expanded=' "$page" || fail "$file missing aria-expanded on menu triggers"
done

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
  grep -Eq "themes/$slug/(index|homepage_preview)\\.html" "$root_dir/docs/index.html" || fail "docs/index.html does not link to the preview"
else
  fail "Missing docs/index.html"
fi

if [ -d "$preview_dir/assets/images" ]; then
  image_count="$(find "$preview_dir/assets/images" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) | wc -l | tr -d ' ')"
  [ "$image_count" -ge 6 ] || fail "Preview must include at least 6 local raster image assets"
else
  fail "Missing preview image directory"
fi

if [ -f "$preview_dir/assets/js/preview.js" ]; then
  grep -q 'Escape' "$preview_dir/assets/js/preview.js" || fail "Preview JS does not handle Escape"
  grep -q 'aria-expanded' "$preview_dir/assets/js/preview.js" || fail "Preview JS does not update aria-expanded"
  grep -Eq 'body|document\.body|classList' "$preview_dir/assets/js/preview.js" || fail "Preview JS does not manage body/menu state"
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
