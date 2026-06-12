#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

slugify() {
  local input="$1"
  local base
  base="$(basename "$input")"
  base="${base%.*}"
  base="$(printf '%s' "$base" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/_/g; s/^_+//; s/_+$//; s/_+/_/g')"
  base="$(printf '%s' "$base" | sed -E 's/^[0-9]+_//; s/^nolan_young_theme_//')"
  [ -n "$base" ] || base="generated_theme"
  printf '%s\n' "$base"
}

next_number() {
  local max=-1 name number
  mkdir -p "$repo_root/wp-content/themes"
  while IFS= read -r name; do
    if [[ "$name" =~ ^([0-9][0-9][0-9])_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$ ]]; then
      number="$((10#${BASH_REMATCH[1]}))"
      [ "$number" -gt "$max" ] && max="$number"
    fi
  done < <(find "$repo_root/wp-content/themes" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' 2>/dev/null || true)
  printf '%03d\n' "$((max + 1))"
}

prompt_file="${1:-${THEME_PROMPT_FILE:-}}"
template_name="${2:-${THEME_TEMPLATE:-NOLAN-YOUNG-theme-000}}"

[ -n "$prompt_file" ] || fail "Usage: bash scripts/prepare-theme-from-template.sh <prompt-file> [template-name]"

case "$prompt_file" in
  /*) prompt_path="$prompt_file" ;;
  *) prompt_path="$repo_root/$prompt_file" ;;
esac

[ -f "$prompt_path" ] || fail "Prompt file not found: $prompt_file"

template_dir="$repo_root/wordpress-themplate-themes/$template_name"
[ -d "$template_dir" ] || fail "Template not found: wordpress-themplate-themes/$template_name"

if [ -n "${THEME_SLUG:-}" ]; then
  theme_slug="$THEME_SLUG"
else
  theme_slug="$(next_number)_nolan_young_theme_$(slugify "$prompt_path")"
fi

[[ "$theme_slug" =~ ^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$ ]] || fail "Invalid theme slug: $theme_slug"

theme_dir="$repo_root/wp-content/themes/$theme_slug"
[ ! -e "$theme_dir" ] || fail "Theme already exists: wp-content/themes/$theme_slug"

cp -R "$template_dir" "$theme_dir"

node - "$theme_dir" "$theme_slug" "$template_name" <<'NODE'
const fs = require('fs');
const path = require('path');
const themeDir = process.argv[2];
const slug = process.argv[3];
const templateName = process.argv[4];
const title = slug.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function updateJson(file, updater) {
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  updater(data);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

const stylePath = path.join(themeDir, 'style.css');
if (fs.existsSync(stylePath)) {
  let style = fs.readFileSync(stylePath, 'utf8');
  style = style.replace(/^Theme Name:.*$/m, `Theme Name: ${title}`);
  style = style.replace(/^Description:.*$/m, `Description: Generated WordPress theme prepared from ${templateName}.`);
  style = style.replace(/^Text Domain:.*$/m, `Text Domain: ${slug}`);
  fs.writeFileSync(stylePath, style);
}

updateJson(path.join(themeDir, 'package.json'), (pkg) => { pkg.name = slug.replace(/_/g, '-'); });
updateJson(path.join(themeDir, 'package-lock.json'), (lock) => {
  lock.name = slug.replace(/_/g, '-');
  if (lock.packages && lock.packages['']) lock.packages[''].name = slug.replace(/_/g, '-');
});

fs.writeFileSync(path.join(themeDir, '.theme-template-source'), `template=${templateName}\nprepared_slug=${slug}\n`);
NODE

printf 'Prepared theme folder: wp-content/themes/%s\n' "$theme_slug"
printf 'Template source: wordpress-themplate-themes/%s\n' "$template_name"
printf 'Theme generation must edit only: wp-content/themes/%s\n' "$theme_slug"
