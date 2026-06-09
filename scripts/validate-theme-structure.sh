#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-common.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

slug="${1:-}"
[ -n "$slug" ] || theme_factory_fail "Usage: bash scripts/validate-theme-structure.sh <theme-slug>"

theme_dir="$root_dir/wp-content/themes/$slug"
failures=0

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  failures=$((failures + 1))
}

check_file() {
  local path="$1"
  [ -f "$path" ] || fail "Missing file: ${path#$root_dir/}"
}

check_dir() {
  local path="$1"
  [ -d "$path" ] || fail "Missing directory: ${path#$root_dir/}"
}

[ -d "$theme_dir" ] || fail "Missing theme directory: wp-content/themes/$slug"

required_files=(
  style.css
  functions.php
  theme.json
  screenshot.png
  README.md
  .editorconfig
  .gitignore
  header.php
  footer.php
  front-page.php
  index.php
  page.php
  single.php
  archive.php
  search.php
  searchform.php
  404.php
  403.php
  comments.php
  package.json
  package-lock.json
  LICENSE.txt
  CHANGELOG.md
  build/webpack.config.js
  src/js/main.js
  src/scss/main.scss
  blocks/README.md
  docs/getting-started.md
  docs/customization.md
  accessibility/README.md
)

for file in "${required_files[@]}"; do
  check_file "$theme_dir/$file"
done

required_dirs=(
  inc
  assets/css
  assets/js
  assets/icons
  assets/images/hero
  assets/images/portfolio
  assets/images/texture
  src/js
  src/scss/abstracts
  src/scss/base
  src/scss/components
  src/scss/layout
  src/scss/pages
  template-parts
  page-templates
  blocks
  build
  docs
  accessibility
)

for dir in "${required_dirs[@]}"; do
  check_dir "$theme_dir/$dir"
done

required_inc_files=(
  inc/setup.php
  inc/enqueue.php
  inc/template-tags.php
  inc/helpers.php
  inc/custom-post-types.php
  inc/customizer.php
  inc/forms.php
  inc/newsletter.php
  inc/policy-routing.php
)

for file in "${required_inc_files[@]}"; do
  check_file "$theme_dir/$file"
done

required_template_parts=(
  template-parts/content-page.php
  template-parts/content-single.php
  template-parts/content-none.php
  template-parts/content-policy.php
  template-parts/content-search.php
  template-parts/content-hero.php
  template-parts/content-brand-statement.php
  template-parts/content-featured-work.php
  template-parts/content-all-services.php
  template-parts/content-single-service-highlight.php
  template-parts/content-process.php
  template-parts/content-style-pillars.php
  template-parts/content-testimonials.php
  template-parts/content-blog-preview.php
  template-parts/content-cta-banner.php
  template-parts/content-footer-widgets.php
  template-parts/content-home-hero.php
  template-parts/content-home-services.php
  template-parts/content-home-work.php
  template-parts/content-home-process.php
  template-parts/content-home-testimonials.php
  template-parts/content-home-cta.php
  template-parts/content-services.php
  template-parts/content-about.php
  template-parts/content-work.php
  template-parts/content-contact.php
  template-parts/content-blog.php
  template-parts/content-single-service.php
)

for file in "${required_template_parts[@]}"; do
  check_file "$theme_dir/$file"
done

required_page_templates=(
  page-templates/template-about-us.php
  page-templates/template-services.php
  page-templates/template-single-service.php
  page-templates/template-work.php
  page-templates/template-blog.php
  page-templates/template-contact.php
  page-templates/template-policy.php
)

for file in "${required_page_templates[@]}"; do
  check_file "$theme_dir/$file"
done

if [ -f "$theme_dir/style.css" ]; then
  grep -Eq '^[[:space:]]*Theme Name:[[:space:]]*.+' "$theme_dir/style.css" || fail "style.css has no Theme Name header"
fi

if [ -f "$theme_dir/functions.php" ]; then
  [ -s "$theme_dir/functions.php" ] || fail "functions.php is empty"
fi

if [ -f "$theme_dir/assets/css/bundle.css" ]; then
  [ -s "$theme_dir/assets/css/bundle.css" ] || fail "Compiled CSS is empty"
fi

if [ -f "$theme_dir/assets/js/bundle.js" ]; then
  [ -s "$theme_dir/assets/js/bundle.js" ] || fail "Compiled JS is empty"
fi

if [ -d "$theme_dir/assets/images" ]; then
  image_count="$(find "$theme_dir/assets/images" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) | wc -l | tr -d ' ')"
  [ "$image_count" -ge 6 ] || fail "Theme must include at least 6 local raster image assets"
else
  fail "Missing theme image directory"
fi

if command -v php >/dev/null 2>&1; then
  while IFS= read -r php_file; do
    php -l "$php_file" >/dev/null || fail "PHP syntax failed: ${php_file#$root_dir/}"
  done < <(find "$theme_dir" -type f -name '*.php' | sort)
else
  printf 'WARN: PHP is not installed; syntax lint skipped.\n' >&2
fi

if [ "$failures" -gt 0 ]; then
  printf 'Structure validation failed for %s with %s issue(s).\n' "$slug" "$failures" >&2
  exit 1
fi

printf 'Structure validation passed for %s.\n' "$slug"
