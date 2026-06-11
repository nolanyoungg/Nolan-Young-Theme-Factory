#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/../repo/theme-factory-shared-functions.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

usage() {
  cat <<'EOF'
Usage:
  bash scripts/repo/remove-generated-theme-and-artifacts.sh <theme-number-or-slug> [--yes]
  bash scripts/repo/remove-generated-theme-and-artifacts.sh <theme-number-or-slug> --dry-run

Examples:
  bash scripts/repo/remove-generated-theme-and-artifacts.sh 005 --dry-run
  bash scripts/repo/remove-generated-theme-and-artifacts.sh <full-theme-slug> --yes

Removes generated artifacts for one generated theme:
- wp-content/themes/<slug>/
- docs/themes/<slug>/
- dist/zipped-themes/<slug>.zip
- reports/runs/<slug>/
- prompts/completed/<slug>__*.txt
- prompts/completed/<slug>__*.md
- the matching card in docs/index.html

After removal, the script scans the repo for lingering exact slug references and fails if any remain.
EOF
}

theme_selector="${1:-}"
[ -n "$theme_selector" ] || { usage; theme_factory_fail "Theme number or slug is required."; }
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

collect_known_slugs() {
  {
    find "$root_dir/wp-content/themes" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' 2>/dev/null || true
    find "$root_dir/docs/themes" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' 2>/dev/null || true
    find "$root_dir/dist/zipped-themes" -mindepth 1 -maxdepth 1 -type f -name '*.zip' -printf '%f\n' 2>/dev/null | sed -E 's/\.zip$//' || true
    find "$root_dir/reports/runs" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' 2>/dev/null || true
    find "$root_dir/prompts/completed" -mindepth 1 -maxdepth 1 -type f \( -name '*__*.txt' -o -name '*__*.md' \) -printf '%f\n' 2>/dev/null | sed -E 's/__.*$//' || true
    if [ -f "$root_dir/docs/index.html" ]; then
      grep -Eo '[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]' "$root_dir/docs/index.html" 2>/dev/null || true
    fi
  } | grep -E "$(theme_factory_slug_pattern)" | sort -u || true
}

resolve_theme_slug() {
  local selector="$1"
  local slug_pattern
  slug_pattern="$(theme_factory_slug_pattern)"

  if [[ "$selector" =~ $slug_pattern ]]; then
    printf '%s\n' "$selector"
    return 0
  fi

  if [[ "$selector" =~ ^[0-9]{1,3}$ ]]; then
    local number_prefix
    number_prefix="$(printf '%03d' "$((10#$selector))")"
    local matches=()
    local known_slug
    while IFS= read -r known_slug; do
      [ -n "$known_slug" ] || continue
      case "$known_slug" in
        "${number_prefix}_nolan_young_theme_"*)
          matches+=("$known_slug")
          ;;
      esac
    done < <(collect_known_slugs)

    if [ "${#matches[@]}" -eq 0 ]; then
      theme_factory_fail "No generated theme found for number: $number_prefix"
    fi
    if [ "${#matches[@]}" -gt 1 ]; then
      printf 'Multiple generated themes match number %s:\n' "$number_prefix" >&2
      printf '  - %s\n' "${matches[@]}" >&2
      theme_factory_fail "Pass the full theme slug to remove the intended theme."
    fi

    printf '%s\n' "${matches[0]}"
    return 0
  fi

  theme_factory_fail "Expected a three-digit theme number or full generated theme slug: $selector"
}

find_lingering_references() {
  local slug="$1"
  if command -v rg >/dev/null 2>&1; then
    rg -n --fixed-strings "$slug" "$root_dir" -g '!.git' 2>/dev/null || true
  else
    grep -R -n -F --exclude-dir='.git' "$slug" "$root_dir" 2>/dev/null || true
  fi
}

remove_lingering_text_references() {
  local slug="$1"
  local files=()
  local reference_file

  if command -v rg >/dev/null 2>&1; then
    while IFS= read -r reference_file; do
      [ -n "$reference_file" ] && files+=("$reference_file")
    done < <(rg -l --fixed-strings "$slug" "$root_dir" -g '!.git' 2>/dev/null || true)
  else
    while IFS= read -r reference_file; do
      [ -n "$reference_file" ] && files+=("$reference_file")
    done < <(grep -R -l -F --exclude-dir='.git' "$slug" "$root_dir" 2>/dev/null || true)
  fi

  [ "${#files[@]}" -gt 0 ] || return 0

  theme_factory_require_cmd node
  node - "$slug" "${files[@]}" <<'NODE'
const fs = require('fs');
const slug = process.argv[2];
const files = process.argv.slice(3);

for (const file of files) {
  let input;
  try {
    input = fs.readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  if (input.includes('\u0000') || !input.includes(slug)) {
    continue;
  }
  const trailingNewline = /\r?\n$/.test(input);
  const normalized = input.replace(/\r?\n$/, '');
  const lines = normalized === '' ? [] : normalized.split(/\r?\n/);
  const filtered = lines.filter((line) => !line.includes(slug));
  const output = filtered.join('\n');
  fs.writeFileSync(file, trailingNewline && output !== '' ? `${output}\n` : output, 'utf8');
}
NODE
}

slug="$(resolve_theme_slug "$theme_selector")"
theme_factory_validate_slug "$slug"

if [ "$theme_selector" != "$slug" ]; then
  printf 'Resolved %s to %s.\n' "$theme_selector" "$slug"
fi

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
  printf 'A real removal will scan for lingering exact references to %s after deleting known artifacts.\n' "$slug"
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
const output = input.replace(/\s*<article class="theme-card">[\s\S]*?<\/article>/g, (block) => {
  return block.includes(slug) ? '' : block;
});
fs.writeFileSync(indexPath, output, 'utf8');
NODE
fi

remove_lingering_text_references "$slug"

lingering_references="$(find_lingering_references "$slug")"
if [ -n "$lingering_references" ]; then
  printf 'Removed known generated artifacts for %s, but lingering references remain:\n' "$slug" >&2
  printf '%s\n' "$lingering_references" >&2
  theme_factory_fail "Clean the remaining references above before considering theme removal complete."
fi

printf 'Removed generated artifacts and lingering references for %s.\n' "$slug"
