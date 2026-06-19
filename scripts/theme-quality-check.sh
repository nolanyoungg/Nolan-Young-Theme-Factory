#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
theme_slug="${1:-}"
failures=0

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  failures=$((failures + 1))
}

canonical_path() {
  local target="$1"
  if command -v cygpath >/dev/null 2>&1; then
    cygpath -m "$target"
  else
    (cd "$target" && pwd)
  fi
}

[ -n "$theme_slug" ] || {
  printf 'Usage: bash scripts/theme-quality-check.sh <theme-slug>\n' >&2
  exit 1
}

[[ "$theme_slug" =~ ^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$ ]] || fail "Invalid theme slug: $theme_slug"
theme_dir="$repo_root/wp-content/themes/$theme_slug"

[ -d "$theme_dir" ] || fail "Theme folder is missing: wp-content/themes/$theme_slug"

if [ -d "$theme_dir" ]; then
  themes_root="$(canonical_path "$repo_root/wp-content/themes")"
  resolved_theme_dir="$(canonical_path "$theme_dir")"
  case "$resolved_theme_dir" in
    "$themes_root"/*) ;;
    *) fail "Theme folder resolves outside wp-content/themes" ;;
  esac

  for file in style.css functions.php index.php header.php footer.php; do
    [ -f "$theme_dir/$file" ] || fail "Missing required WordPress file: $file"
  done

  if [ -f "$theme_dir/style.css" ]; then
    grep -q '^Theme Name:' "$theme_dir/style.css" || fail "style.css missing Theme Name header"
    grep -q '^Text Domain:' "$theme_dir/style.css" || fail "style.css missing Text Domain header"
  fi

  if [ -d "$theme_dir/template-parts" ]; then
    if grep -R -I -n -E --include='*.php' '(get_header\s*\(|get_footer\s*\(|<!doctype|<html|<body|</body>|</html>)' "$theme_dir/template-parts" >/dev/null 2>&1; then
      fail "Template parts must be fragments only and cannot include document wrappers"
    fi
  fi

  if [ -f "$theme_dir/header.php" ]; then
    grep -q '<!doctype html>' "$theme_dir/header.php" || fail "header.php missing <!doctype html>"
    grep -q 'wp_head()' "$theme_dir/header.php" || fail "header.php missing wp_head()"
    grep -q '<body' "$theme_dir/header.php" || fail "header.php missing opening body tag"
  fi

  if [ -f "$theme_dir/footer.php" ]; then
    grep -q 'wp_footer()' "$theme_dir/footer.php" || fail "footer.php missing wp_footer()"
    grep -q '</body>' "$theme_dir/footer.php" || fail "footer.php missing closing body tag"
    grep -q '</html>' "$theme_dir/footer.php" || fail "footer.php missing closing html tag"
  fi

  content_section_pattern='get_template_part\(.*template-parts/(content-hero|content-cta-banner|content-brand-statement|content-featured-work|content-all-services|content-single-service-highlight|content-process|content-style-pillars|content-testimonials|content-blog-preview|content-faqs)'
  if [ -f "$theme_dir/header.php" ] && grep -Eq "$content_section_pattern" "$theme_dir/header.php"; then
    fail "header.php must not include site content sections"
  fi
  if [ -f "$theme_dir/footer.php" ] && grep -Eq "$content_section_pattern" "$theme_dir/footer.php"; then
    fail "footer.php must not include site content sections"
  fi

  css_bundle="$theme_dir/assets/css/bundle.css"
  js_bundle="$theme_dir/assets/js/bundle.js"
  scss_entry="$theme_dir/src/scss/main.scss"
  js_entry="$theme_dir/src/js/main.js"
  [ -f "$css_bundle" ] || fail "Missing compiled CSS bundle: assets/css/bundle.css"
  [ -f "$js_bundle" ] || fail "Missing compiled JS bundle: assets/js/bundle.js"
  if [ -f "$css_bundle" ]; then
    css_size="$(wc -c < "$css_bundle" | tr -d '[:space:]')"
    [ "$css_size" -ge 2000 ] || fail "Compiled CSS bundle is too small to represent a finished styled theme"
  fi
  if [ -f "$scss_entry" ] && [ -f "$css_bundle" ] && [ "$scss_entry" -nt "$css_bundle" ]; then
    fail "Compiled CSS bundle is older than src/scss/main.scss; run npm run build"
  fi
  if [ -f "$js_entry" ] && [ -f "$js_bundle" ] && [ "$js_entry" -nt "$js_bundle" ]; then
    fail "Compiled JS bundle is older than src/js/main.js; run npm run build"
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

  if grep -R -I -n -E --exclude-dir=node_modules --exclude='package-lock.json' --exclude='npm-shrinkwrap.json' --exclude='*.svg' --exclude='*.png' --exclude='*.jpg' --exclude='*.jpeg' --exclude='*.webp' --exclude='*.gif' '<(script|link|img|source|video|audio)[^>]+(src|href)=["'"'"'][^"'"'"']*https?://|@import[[:space:]]+url\(["'"'"']?https?://|url\(["'"'"']?https?://|//cdn\.|cdnjs|jsdelivr|unpkg|fonts\.google|gstatic' "$theme_dir" 2>/dev/null | grep -v 'https://schemas.wp.org' | grep -v 'https://www.w3.org' | grep -v 'https://gmpg.org/xfn/11' >/dev/null; then
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
