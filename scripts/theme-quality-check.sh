#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
theme_slug="${1:-}"
failures=0

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  failures=$((failures + 1))
}

[ -n "$theme_slug" ] || {
  printf 'Usage: bash scripts/theme-quality-check.sh <theme-slug>\n' >&2
  exit 1
}

[[ "$theme_slug" =~ ^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$ ]] || fail "Invalid theme slug: $theme_slug"
theme_dir="$repo_root/wp-content/themes/$theme_slug"

[ -d "$theme_dir" ] || fail "Theme folder is missing: wp-content/themes/$theme_slug"

if [ -d "$theme_dir" ]; then
  case "$(cd "$theme_dir" && pwd)" in
    "$repo_root/wp-content/themes/"*) ;;
    *) fail "Theme folder resolves outside wp-content/themes" ;;
  esac

  for file in style.css functions.php index.php header.php footer.php; do
    [ -f "$theme_dir/$file" ] || fail "Missing required WordPress file: $file"
  done

  if [ -f "$theme_dir/style.css" ]; then
    grep -q '^Theme Name:' "$theme_dir/style.css" || fail "style.css missing Theme Name header"
    grep -q '^Text Domain:' "$theme_dir/style.css" || fail "style.css missing Text Domain header"
  fi

  if command -v php >/dev/null 2>&1; then
    while IFS= read -r php_file; do
      php -l "$theme_dir/$php_file" >/dev/null || fail "PHP syntax failed: $php_file"
    done < <(cd "$theme_dir" && find . -type f -name '*.php' -printf '%P\n' | sort)
  else
    printf 'WARNING: php command not found; skipped PHP syntax lint.\n' >&2
  fi

  if grep -R -I -n -E --exclude-dir=node_modules --exclude='*.png' --exclude='*.jpg' --exclude='*.jpeg' --exclude='*.webp' --exclude='*.gif' --exclude='*.zip' 'OPENAI_API_KEY|sk-[A-Za-z0-9_-]{20,}|BEGIN [A-Z ]*PRIVATE KEY|ghp_[A-Za-z0-9]{20,}|AWS_SECRET_ACCESS_KEY|password[[:space:]]*[:=][[:space:]]*[^[:space:]]+|token[[:space:]]*[:=][[:space:]]*[^[:space:]]+' "$theme_dir" >/dev/null 2>&1; then
    fail "Potential secret or credential found in theme"
  fi

  if grep -R -I -n -E --exclude-dir=node_modules --exclude='*.svg' --exclude='*.png' --exclude='*.jpg' --exclude='*.jpeg' --exclude='*.webp' --exclude='*.gif' '<(script|link|img|source|video|audio)[^>]+(src|href)=["'"'"'][^"'"'"']*https?://|@import[[:space:]]+url\(["'"'"']?https?://|url\(["'"'"']?https?://|//cdn\.|cdnjs|jsdelivr|unpkg|fonts\.google|gstatic' "$theme_dir" 2>/dev/null | grep -v 'https://schemas.wp.org' | grep -v 'https://www.w3.org' >/dev/null; then
    fail "Remote runtime dependency or CDN reference found"
  fi

  if grep -R -I -n -E --exclude-dir=node_modules 'C:\\Users\\|/Users/|codex-ggi-nolan-local|docs/Preview-Themes-Github|dist/zipped-themes' "$theme_dir" >/dev/null 2>&1; then
    fail "Theme contains repo-local, preview, dist, or machine-specific paths"
  fi

  if grep -R -I -n -E \
    --include='*.php' --include='*.css' --include='*.js' --include='README.md' \
    --exclude-dir=node_modules --exclude-dir=.generation \
    'Lorem ipsum|TODO|FIXME|Add [A-Za-z0-9 _/-]+ here|add [A-Za-z0-9 _/-]+ here|Generation should replace|Static preview generated from|prepared WordPress theme folder' \
    "$theme_dir" >/dev/null 2>&1; then
    fail "Theme contains unfinished placeholder/runtime copy"
  fi
fi

if [ "$failures" -gt 0 ]; then
  printf 'Theme quality check failed for %s with %s issue(s).\n' "$theme_slug" "$failures" >&2
  exit 1
fi

printf 'Theme quality check passed for %s.\n' "$theme_slug"
