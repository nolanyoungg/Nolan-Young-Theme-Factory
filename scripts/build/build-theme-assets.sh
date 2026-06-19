#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
theme_slug="${1:-}"

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

[ -n "$theme_slug" ] || fail "Usage: bash scripts/build/build-theme-assets.sh <theme-slug>"
[[ "$theme_slug" =~ ^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$ ]] || fail "Invalid theme slug: $theme_slug"

theme_dir="$repo_root/wp-content/themes/$theme_slug"
[ -d "$theme_dir" ] || fail "Theme directory missing: wp-content/themes/$theme_slug"
[ -f "$theme_dir/package.json" ] || fail "Theme package.json missing"

command -v npm >/dev/null 2>&1 || fail "npm is required to build theme assets"

(
  cd "$theme_dir"

  if [ ! -d node_modules ]; then
    npm install --ignore-scripts --no-audit --no-fund
  fi

  npm run build

  if [ -f src/scss/main.scss ]; then
    npx sass --no-source-map src/scss/main.scss assets/css/bundle.css --style=compressed
  fi

  touch assets/js/bundle.js assets/css/bundle.css
)

[ -f "$theme_dir/assets/css/bundle.css" ] || fail "Build did not create assets/css/bundle.css"
[ -f "$theme_dir/assets/js/bundle.js" ] || fail "Build did not create assets/js/bundle.js"

printf 'Built assets for %s\n' "$theme_slug"
