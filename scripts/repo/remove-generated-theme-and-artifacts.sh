#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/../repo/theme-factory-shared-functions.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

usage() {
  cat <<'EOF'
Usage:
  bash scripts/repo/remove-generated-theme-and-artifacts.sh <theme-slug> [--yes]
  bash scripts/repo/remove-generated-theme-and-artifacts.sh <theme-slug> --dry-run

Removes generated artifacts for one theme slug:
- wp-content/themes/<slug>/
- docs/themes/<slug>/
- dist/zipped-themes/<slug>.zip
- reports/runs/<slug>/
- prompts/completed/<slug>__*.txt
- prompts/completed/<slug>__*.md
- the matching card in docs/index.html
EOF
}

slug="${1:-}"
[ -n "$slug" ] || { usage; theme_factory_fail "Theme slug is required."; }
shift || true

dry_run=0
yes=0
for arg in "$@"; do
  case "$arg" in
    --dry-run)
      dry_run=1
      ;;
    --yes|-y)
      yes=1
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      theme_factory_fail "Unknown option: $arg"
      ;;
  esac
done

theme_factory_validate_slug "$slug"

targets=(
  "$root_dir/wp-content/themes/$slug"
  "$root_dir/docs/themes/$slug"
  "$root_dir/dist/zipped-themes/$slug.zip"
  "$root_dir/reports/runs/$slug"
)

while IFS= read -r prompt_archive; do
  [ -n "$prompt_archive" ] && targets+=("$prompt_archive")
done < <(
  find "$root_dir/prompts/completed" -maxdepth 1 -type f \
    \( -name "${slug}__*.txt" -o -name "${slug}__*.md" \) 2>/dev/null | sort
)

existing=()
for target in "${targets[@]}"; do
  [ -e "$target" ] && existing+=("$target")
done

if [ "${#existing[@]}" -eq 0 ]; then
  printf 'No generated files found for %s.\n' "$slug"
else
  printf 'Theme removal targets for %s:\n' "$slug"
  for target in "${existing[@]}"; do
    printf '  - %s\n' "${target#$root_dir/}"
  done
fi

if [ -f "$root_dir/docs/index.html" ] && grep -q "$slug" "$root_dir/docs/index.html"; then
  printf '  - docs/index.html gallery card for %s\n' "$slug"
fi

if [ "$dry_run" -eq 1 ]; then
  printf 'Dry run only. No files removed.\n'
  exit 0
fi

if [ "$yes" -ne 1 ]; then
  if theme_factory_is_interactive; then
    theme_factory_prompt_yes_no "Remove these generated artifacts?" "n" || theme_factory_fail "Removal cancelled."
  else
    theme_factory_fail "Noninteractive removal requires --yes."
  fi
fi

for target in "${existing[@]}"; do
  case "$target" in
    "$root_dir/wp-content/themes/$slug"|\
    "$root_dir/docs/themes/$slug"|\
    "$root_dir/dist/zipped-themes/$slug.zip"|\
    "$root_dir/reports/runs/$slug"|\
    "$root_dir/prompts/completed/$slug"__*.txt|\
    "$root_dir/prompts/completed/$slug"__*.md)
      rm -rf -- "$target"
      ;;
    *)
      theme_factory_fail "Refusing to remove unexpected path: $target"
      ;;
  esac
done

if [ -f "$root_dir/docs/index.html" ] && grep -q "$slug" "$root_dir/docs/index.html"; then
  theme_factory_require_cmd node
  node - "$root_dir/docs/index.html" "$slug" <<'NODE'
const fs = require('fs');
const indexPath = process.argv[2];
const slug = process.argv[3];
const input = fs.readFileSync(indexPath, 'utf8');
const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let output = input.replace(new RegExp(`\\s*<article class="theme-card">[\\s\\S]*?<p class="eyebrow">${escaped}<\\/p>[\\s\\S]*?<\\/article>`, 'g'), '');
if (output === input) {
  output = input.replace(new RegExp(`\\s*<article class="theme-card">[\\s\\S]*?themes\\/${escaped}\\/homepage_preview\\.html[\\s\\S]*?<\\/article>`, 'g'), '');
}
fs.writeFileSync(indexPath, output, 'utf8');
NODE
fi

printf 'Removed generated artifacts for %s.\n' "$slug"
