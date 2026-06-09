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
    'lorem ipsum|todo|placeholder text|coming soon|sample service|replace this|dummy content' \
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
  [ -f "$theme_dir/README.md" ] || fail "Missing theme README"
  [ -f "$theme_dir/CHANGELOG.md" ] || fail "Missing CHANGELOG"
fi

if [ -f "$root_dir/docs/index.html" ]; then
  grep -q "themes/$slug/index.html" "$root_dir/docs/index.html" || fail "docs/index.html does not link to $slug preview"
else
  fail "Missing docs/index.html"
fi

if [ "$failures" -gt 0 ]; then
  printf 'Quality validation failed for %s with %s issue(s).\n' "$slug" "$failures" >&2
  exit 1
fi

printf 'Quality validation passed for %s.\n' "$slug"
