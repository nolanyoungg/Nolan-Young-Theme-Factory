#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

theme_slug="${1:-}"
prompt_file="${2:-}"
model="${3:-qwen2.5-coder:14b}"

[ -n "$theme_slug" ] && [ -n "$prompt_file" ] || fail "Usage: bash scripts/run-ollama-quality-repair-pass.sh <theme-slug> <prompt-file> [model]"
[[ "$theme_slug" =~ ^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$ ]] || fail "Invalid theme slug: $theme_slug"
[ -d "wp-content/themes/$theme_slug" ] || fail "Theme folder missing: wp-content/themes/$theme_slug"
[ -f "$prompt_file" ] || fail "Prompt file missing: $prompt_file"
command -v ollama >/dev/null 2>&1 || fail "ollama command not found"

if ! ollama list | awk 'NR > 1 { print $1 }' | grep -Fx "$model" >/dev/null; then
  fail "Ollama model is not installed: $model"
fi

brief_path="$(node scripts/create-theme-generation-brief.js "$theme_slug" "$prompt_file" ollama-only)"
repair_dir="reports/runs/$theme_slug/ollama-repair"
mkdir -p "$repair_dir"

find_unfinished_files() {
  rg -l \
    'Lorem ipsum|TODO|FIXME|Add [A-Za-z0-9 _/-]+ here|add [A-Za-z0-9 _/-]+ here|Generation should replace|Static preview generated from|prepared WordPress theme folder' \
    "wp-content/themes/$theme_slug" \
    -g '*.php' -g '*.css' -g '*.js' -g 'README.md' -g '!node_modules/**' -g '!.generation/**' \
    2>/dev/null | sed -E "s#^wp-content[\\\\/]themes[\\\\/]$theme_slug[\\\\/]##; s#\\\\#/#g" | sort
}

repair_file() {
  local relative_path="$1"
  local safe_name
  safe_name="$(printf '%s' "$relative_path" | tr '/\\.' '___')"
  local run_prompt="$repair_dir/repair-${safe_name}-prompt.md"
  local raw_output="$repair_dir/repair-${safe_name}-raw.md"

  cat > "$run_prompt" <<EOF
You are repairing one file inside a generated WordPress theme.

Target folder:
wp-content/themes/$theme_slug/

Target file:
$relative_path

You must return only one file block and write exactly this one file path.

Creative brief:
$(cat "$brief_path")

Current file contents:
$(sed 's/\r$//' "wp-content/themes/$theme_slug/$relative_path")

Format:
---FILE: $relative_path---
line 1
line 2
---END FILE---

Rules:
- Rewrite the complete file, not a patch.
- Keep the path exactly "$relative_path".
- Keep output inside wp-content/themes/$theme_slug/.
- Remove all Lorem ipsum, TODO, FIXME, "Add ... here", and future-editor instructions.
- Use finished copy aligned with the selected creative prompt.
- Preserve the file's technical purpose.
- Preserve valid WordPress PHP syntax for PHP files.
- Do not use http://, https://, CDN scripts, remote images, secrets, tokens, or API keys.
- Do not wrap the file block in markdown fences or JSON.
- header.php must use lowercase <!doctype html> and a valid full document wrapper.
EOF

  printf 'Running Ollama repair for: %s\n' "$relative_path"
  OLLAMA_NOHISTORY=1 ollama run "$model" --nowordwrap < "$run_prompt" > "$raw_output"
  if ! node scripts/apply-theme-file-blocks.js "$raw_output" "wp-content/themes/$theme_slug"; then
    printf 'WARNING: Ollama repair did not produce an applicable file for %s; validation will decide whether another pass is needed.\n' "$relative_path" >&2
  fi
}

for pass in 1 2; do
  mapfile -t unfinished < <(find_unfinished_files)
  [ "${#unfinished[@]}" -gt 0 ] || {
    printf 'Ollama quality repair pass complete for %s\n' "$theme_slug"
    exit 0
  }

  printf 'Ollama quality repair pass %s found %s file(s).\n' "$pass" "${#unfinished[@]}"
  for relative_path in "${unfinished[@]}"; do
    repair_file "$relative_path"
  done
done

mapfile -t remaining < <(find_unfinished_files)
[ "${#remaining[@]}" -eq 0 ] || fail "Ollama repair could not clear unfinished copy from: ${remaining[*]}"

printf 'Ollama quality repair pass complete for %s\n' "$theme_slug"
