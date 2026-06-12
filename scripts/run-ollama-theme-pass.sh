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

[ -n "$theme_slug" ] && [ -n "$prompt_file" ] || fail "Usage: bash scripts/run-ollama-theme-pass.sh <theme-slug> <prompt-file> [model]"
[[ "$theme_slug" =~ ^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$ ]] || fail "Invalid theme slug: $theme_slug"
[ -d "wp-content/themes/$theme_slug" ] || fail "Theme folder missing: wp-content/themes/$theme_slug"
[ -f "$prompt_file" ] || fail "Prompt file missing: $prompt_file"
command -v ollama >/dev/null 2>&1 || fail "ollama command not found"

if ! ollama list | awk 'NR > 1 { print $1 }' | grep -Fx "$model" >/dev/null; then
  fail "Ollama model is not installed: $model"
fi

brief_path="$(node scripts/create-theme-generation-brief.js "$theme_slug" "$prompt_file" ollama-only)"
generation_dir="wp-content/themes/$theme_slug/.generation"
raw_output="$generation_dir/ollama-theme-pass-raw.md"
run_prompt="$generation_dir/ollama-theme-pass-prompt.md"

cat > "$run_prompt" <<EOF
You are generating a WordPress theme inside an already prepared folder.

Read this brief:

$(cat "$brief_path")

Output only file blocks using this exact format:

---FILE: relative/path/inside/theme.php---
file contents
---END FILE---

Rules:
- Paths must be relative to wp-content/themes/$theme_slug/.
- Do not output absolute paths.
- Do not use ..
- Do not edit anything outside the theme folder.
- Preserve every template file unless replacing its content intentionally.
- Add extra files only inside the theme folder.
- Use local assets only.
- Do not use CDN dependencies.
- Do not include secrets or credentials.
- Replace Lorem ipsum with complete prompt-specific content.
- Build a polished software-quality WordPress theme, not a starter shell.
EOF

printf 'Running Ollama model: %s\n' "$model"
ollama run "$model" < "$run_prompt" > "$raw_output"
node scripts/apply-theme-file-blocks.js "$raw_output" "wp-content/themes/$theme_slug"
printf 'Ollama theme pass complete for %s\n' "$theme_slug"
