#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-common.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

slug="${1:-}"
[ -n "$slug" ] || theme_factory_fail "Usage: bash scripts/validate-theme-quality.sh <theme-slug>"

theme_dir="$root_dir/wp-content/themes/$slug"
preview_dir="$root_dir/docs/themes/$slug"
failures=0

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  failures=$((failures + 1))
}

scan_patterns() {
  local path="$1"
  grep -R -I -n -i -E \
    --exclude='*.svg' \
    --exclude='*.png' \
    --exclude='*.jpg' \
    --exclude='*.jpeg' \
    --exclude='*.webp' \
    --exclude='*.gif' \
    'lorem ipsum|todo|placeholder|sample text|coming soon|sample service|example service|replace this|dummy content|image here|gray box|we are passionate about excellence|your success is our mission|we help businesses grow' \
    "$path" 2>/dev/null || true
}

if [ ! -d "$theme_dir" ]; then
  fail "Missing theme directory: wp-content/themes/$slug"
else
  theme_matches="$(scan_patterns "$theme_dir")"
  if [ -n "$theme_matches" ]; then
    printf '%s\n' "$theme_matches" >&2
    fail "Theme contains placeholder or filler copy"
  fi

  if [ -f "$theme_dir/assets/css/bundle.css" ]; then
    [ "$(wc -c < "$theme_dir/assets/css/bundle.css" | tr -d ' ')" -ge 1000 ] || fail "Compiled CSS is too small to be meaningful"
  else
    fail "Missing compiled CSS"
  fi

  if [ -f "$theme_dir/assets/js/bundle.js" ]; then
    [ "$(wc -c < "$theme_dir/assets/js/bundle.js" | tr -d ' ')" -ge 400 ] || fail "Compiled JS is too small to be meaningful"
  else
    fail "Missing compiled JS"
  fi

  grep -R -I -n -E 'wp_enqueue_style|wp_enqueue_script' "$theme_dir/inc" "$theme_dir/functions.php" >/dev/null 2>&1 || fail "Missing asset enqueue calls"
  grep -R -I -n -E 'wp_enqueue_style' "$theme_dir/inc" "$theme_dir/functions.php" >/dev/null 2>&1 || fail "Missing wp_enqueue_style call"
  grep -R -I -n -E 'wp_enqueue_script' "$theme_dir/inc" "$theme_dir/functions.php" >/dev/null 2>&1 || fail "Missing wp_enqueue_script call"
  grep -R -I -n -E 'front-page|content-home-hero|content-home-services|content-home-work|content-home-process|content-home-testimonials|content-home-cta' "$theme_dir/front-page.php" "$theme_dir/template-parts" >/dev/null 2>&1 || fail "Homepage template parts are missing or not referenced"
  grep -R -I -n -E '\.(jpg|jpeg|png|webp)' "$theme_dir" >/dev/null 2>&1 || fail "Theme does not reference local raster images"
  [ -f "$theme_dir/README.md" ] || fail "Missing theme README"
  [ -f "$theme_dir/CHANGELOG.md" ] || fail "Missing CHANGELOG"
fi

if [ -d "$preview_dir" ]; then
  preview_matches="$(scan_patterns "$preview_dir")"
  if [ -n "$preview_matches" ]; then
    printf '%s\n' "$preview_matches" >&2
    fail "Preview contains placeholder or filler copy"
  fi
fi

if [ -f "$root_dir/docs/index.html" ]; then
  grep -Eq "themes/$slug/(index|homepage_preview)\\.html" "$root_dir/docs/index.html" || fail "docs/index.html does not link to $slug preview"
else
  fail "Missing docs/index.html"
fi

if [ "$failures" -gt 0 ]; then
  printf 'Quality validation failed for %s with %s issue(s).\n' "$slug" "$failures" >&2
  exit 1
fi

printf 'Quality validation passed for %s.\n' "$slug"
