#!/usr/bin/env bash

theme_factory_repo_root() {
  local script_dir
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  cd "$script_dir/.." && pwd
}

theme_factory_fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

theme_factory_is_interactive() {
  [ -t 0 ] && [ -z "${CI:-}" ]
}

theme_factory_require_cmd() {
  local cmd_name="$1"
  command -v "$cmd_name" >/dev/null 2>&1 || theme_factory_fail "Required command not found: $cmd_name"
}

theme_factory_choose_from_menu() {
  local title="$1"
  local default_index="$2"
  shift 2

  local options=("$@")
  local choice index

  printf '\n%s\n' "$title" >&2
  for index in "${!options[@]}"; do
    if [ "$((index + 1))" -eq "$default_index" ]; then
      printf '  %s. %s (default)\n' "$((index + 1))" "${options[$index]}" >&2
    else
      printf '  %s. %s\n' "$((index + 1))" "${options[$index]}" >&2
    fi
  done

  while true; do
    read -r -p "Choose 1-${#options[@]} [$default_index]: " choice
    choice="${choice:-$default_index}"
    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#options[@]}" ]; then
      printf '%s\n' "${options[$((choice - 1))]}"
      return 0
    fi
    printf 'Please choose a valid number.\n' >&2
  done
}

theme_factory_normalize_mode() {
  local raw="${1:-}"
  raw="${raw,,}"
  case "$raw" in
    1|hybrid|hybrid-mode|"")
      printf 'hybrid\n'
      ;;
    2|codex|codex-only|"codex only")
      printf 'codex-only\n'
      ;;
    3|ollama|ollama-only|"ollama only")
      printf 'ollama-only\n'
      ;;
    *)
      theme_factory_fail "Invalid THEME_FACTORY_MODE value: $1"
      ;;
  esac
}

theme_factory_prompt_yes_no() {
  local prompt="$1"
  local default_answer="${2:-n}"
  local answer

  while true; do
    read -r -p "$prompt [y/N]: " answer
    answer="${answer:-$default_answer}"
    case "${answer,,}" in
      y|yes)
        return 0
        ;;
      n|no)
        return 1
        ;;
    esac
    printf 'Please answer y or n.\n' >&2
  done
}

theme_factory_resolve_prompt_file() {
  local input="$1"
  local root_dir
  root_dir="$(theme_factory_repo_root)"
  local resolved=""

  [ -n "$input" ] || theme_factory_fail "A prompt file is required."

  if [ -f "$input" ]; then
    case "$input" in
      /*) resolved="$input" ;;
      *) resolved="$root_dir/$input" ;;
    esac
  elif [ -f "$root_dir/$input" ]; then
    resolved="$root_dir/$input"
  else
    theme_factory_fail "Prompt file not found: $input"
  fi

  case "$resolved" in
    "$root_dir/prompts/pending/"*)
      printf '%s\n' "$resolved"
      ;;
    *)
      theme_factory_fail "Prompt file must live in prompts/pending/: $resolved"
      ;;
  esac
}

theme_factory_select_prompt_file() {
  local root_dir
  root_dir="$(theme_factory_repo_root)"

  if [ -n "${THEME_PROMPT_FILE:-}" ]; then
    theme_factory_resolve_prompt_file "$THEME_PROMPT_FILE"
    return 0
  fi

  theme_factory_is_interactive || theme_factory_fail "THEME_PROMPT_FILE is required for noninteractive runs."

  local prompt_files=()
  local prompt_path
  while IFS= read -r prompt_path; do
    prompt_files+=("$prompt_path")
  done < <(find "$root_dir/prompts/pending" -maxdepth 1 -type f \( -name '*.txt' -o -name '*.md' \) | sort)

  [ "${#prompt_files[@]}" -gt 0 ] || theme_factory_fail "No prompt files found in prompts/pending/."
  theme_factory_choose_from_menu "Choose prompt file:" 1 "${prompt_files[@]}"
}

theme_factory_check_prompt_file() {
  local prompt_file="$1"
  if grep -I -n -E 'OPENAI_API_KEY|sk-[A-Za-z0-9_-]{20,}|BEGIN [A-Z ]*PRIVATE KEY|ghp_[A-Za-z0-9]{20,}|password[[:space:]]*[:=][[:space:]]*|token[[:space:]]*[:=][[:space:]]*|AWS_SECRET_ACCESS_KEY' "$prompt_file" >/dev/null 2>&1; then
    theme_factory_fail "Prompt file appears to contain secrets or credentials: $prompt_file"
  fi
}

theme_factory_slug_pattern() {
  printf '^([0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]|nolan-showcase-theme-[0-9]{2})$'
}

theme_factory_validate_slug() {
  local slug="$1"
  local pattern
  pattern="$(theme_factory_slug_pattern)"
  [[ "$slug" =~ $pattern ]] || theme_factory_fail "Invalid theme slug: $slug"
}

theme_factory_slug_description() {
  local source="${1:-generated_theme}"
  local base
  base="$(basename "$source")"
  base="${base%.*}"
  base="$(printf '%s' "$base" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/_/g; s/^_+//; s/_+$//; s/_+/_/g')"
  [ -n "$base" ] || base="generated_theme"
  printf '%s\n' "$base"
}

theme_factory_get_next_slug() {
  local root_dir
  root_dir="$(theme_factory_repo_root)"

  local max=0
  local scan_paths=(
    "$root_dir/wp-content/themes"
    "$root_dir/docs/themes"
    "$root_dir/dist/zipped-themes"
    "$root_dir/reports/runs"
  )

  local scan_path name number
  for scan_path in "${scan_paths[@]}"; do
    [ -d "$scan_path" ] || continue
    while IFS= read -r name; do
      if [[ "$name" =~ ^([0-9][0-9][0-9])_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9](\.zip)?$ ]]; then
        number="${BASH_REMATCH[1]}"
        number="$((10#$number))"
        if [ "$number" -gt "$max" ]; then
          max="$number"
        fi
      elif [[ "$name" =~ ^nolan-showcase-theme-([0-9][0-9])(\.zip)?$ ]]; then
        number="${BASH_REMATCH[1]}"
        number="$((10#$number))"
        if [ "$number" -gt "$max" ]; then
          max="$number"
        fi
      fi
    done < <(find "$scan_path" -mindepth 1 -maxdepth 1 -printf '%f\n' 2>/dev/null || find "$scan_path" -mindepth 1 -maxdepth 1 -exec basename {} \;)
  done

  printf '%03d_nolan_young_theme_description\n' "$((max + 1))"
}

theme_factory_list_ollama_models() {
  theme_factory_require_cmd ollama
  ollama list 2>/dev/null | awk 'NR > 1 && $1 != "" { print $1 }'
}

theme_factory_select_ollama_model() {
  local selected="${OLLAMA_MODEL:-}"
  local models=()
  local model

  while IFS= read -r model; do
    [ -n "$model" ] && models+=("$model")
  done < <(theme_factory_list_ollama_models)

  [ "${#models[@]}" -gt 0 ] || theme_factory_fail "No Ollama models are installed. Run 'ollama list' after installing a model."

  if [ -n "$selected" ]; then
    for model in "${models[@]}"; do
      if [ "$model" = "$selected" ]; then
        printf '%s\n' "$selected"
        return 0
      fi
    done
    theme_factory_fail "OLLAMA_MODEL is not installed: $selected"
  fi

  theme_factory_is_interactive || theme_factory_fail "OLLAMA_MODEL is required for noninteractive runs."
  theme_factory_choose_from_menu "Choose installed Ollama model:" 1 "${models[@]}"
}

theme_factory_theme_name_from_style() {
  local style_file="$1"
  local theme_name
  theme_name="$(sed -n 's/^Theme Name:[[:space:]]*//p' "$style_file" | head -n 1)"
  if [ -n "$theme_name" ]; then
    printf '%s\n' "$theme_name"
  else
    printf '%s\n' "$(basename "$(dirname "$style_file")")"
  fi
}

theme_factory_apply_file_blocks() {
  local source_file="$1"
  local target_root="$2"
  theme_factory_require_cmd node

  node - "$source_file" "$target_root" <<'NODE'
const fs = require('fs');
const path = require('path');

const sourceFile = process.argv[2];
const targetRoot = process.argv[3];
const input = fs.readFileSync(sourceFile, 'utf8');
const cleanInput = input.replace(/\u001B\[[0-9;?]*[ -\/]*[@-~]/g, '');
const blockPattern = /^---FILE: ([^\r\n]+)---\r?\n([\s\S]*?)\r?\n---END FILE---$/gm;
let match;
let count = 0;
let wroteAny = false;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function writeBlock(relativePath, content) {
  let cleanedPath = String(relativePath || '').trim();
  if (!cleanedPath) fail('Encountered an empty file block path.');

  if (/^\/+(wp-content|docs|dist|reports|agents|instructions|contracts|codex|templates|scripts|prompts)\//.test(cleanedPath)) {
    cleanedPath = cleanedPath.replace(/^\/+/, '');
  }

  if (path.isAbsolute(cleanedPath) || cleanedPath.includes('..')) {
    fail(`Rejected unsafe file block path: ${cleanedPath}`);
  }

  const targetPath = path.resolve(targetRoot, cleanedPath);
  const targetRootResolved = path.resolve(targetRoot);
  if (!targetPath.startsWith(targetRootResolved + path.sep) && targetPath !== targetRootResolved) {
    fail(`Rejected file block path outside target root: ${cleanedPath}`);
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, 'utf8');
  count += 1;
  wroteAny = true;
}

while ((match = blockPattern.exec(cleanInput)) !== null) {
  writeBlock(match[1], match[2]);
}

if (count === 0) {
  const jsonMatch = cleanInput.match(/```json\s*([\s\S]*?)\s*```/i) || cleanInput.match(/({[\s\S]*"file_blocks"[\s\S]*})/i);
  if (jsonMatch) {
    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } catch (err) {
      fail(`Failed to parse JSON file_blocks payload: ${err.message}`);
    }

    if (!parsed || !Array.isArray(parsed.file_blocks)) {
      fail('JSON payload did not contain a file_blocks array.');
    }

    for (const entry of parsed.file_blocks) {
      if (!entry || typeof entry !== 'object') continue;
      if (entry.type === 'directory') {
        let cleanedPath = String(entry.path || '').trim();
        if (!cleanedPath) fail('Encountered an empty directory path in JSON file_blocks.');
        if (/^\/+(wp-content|docs|dist|reports|agents|instructions|contracts|codex|templates|scripts|prompts)\//.test(cleanedPath)) {
          cleanedPath = cleanedPath.replace(/^\/+/, '');
        }
        if (path.isAbsolute(cleanedPath) || cleanedPath.includes('..')) {
          fail(`Rejected unsafe directory path: ${cleanedPath}`);
        }
        const targetPath = path.resolve(targetRoot, cleanedPath);
        const targetRootResolved = path.resolve(targetRoot);
        if (!targetPath.startsWith(targetRootResolved + path.sep) && targetPath !== targetRootResolved) {
          fail(`Rejected directory path outside target root: ${cleanedPath}`);
        }
        fs.mkdirSync(targetPath, { recursive: true });
        count += 1;
        wroteAny = true;
      } else if (entry.type === 'file') {
        writeBlock(entry.path, entry.content ?? '');
      }
    }
  }
}

if (!wroteAny) fail('Expected file blocks or JSON file_blocks but none were found.');
console.log(count);
NODE
}

theme_factory_update_gallery_index() {
  local slug="$1"
  local theme_name="$2"
  local root_dir
  root_dir="$(theme_factory_repo_root)"
  theme_factory_require_cmd node

  node - "$root_dir/docs/index.html" "$slug" "$theme_name" <<'NODE'
const fs = require('fs');
const path = require('path');

const indexPath = process.argv[2];
const slug = process.argv[3];
const themeName = process.argv[4];
  const href = `themes/${slug}/homepage_preview.html`;
const file = fs.readFileSync(indexPath, 'utf8');

if (file.includes(href)) {
  process.exit(0);
}

const escaped = themeName
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const card = [
  '        <article class="theme-card">',
  `          <p class="eyebrow">${slug}</p>`,
  `          <h3>${escaped}</h3>`,
  '          <p>Generated classic WordPress theme with a matching static preview.</p>',
  `          <p><a href="${href}">Open preview</a></p>`,
  '        </article>'
].join('\n') + '\n';

let updated = file;
if (updated.includes('data-empty-state')) {
  updated = updated.replace(/\s*<article class="empty-state" data-empty-state>/, `\n${card}        <article class="empty-state" data-empty-state>`);
} else {
  updated = updated.replace(/\s*<\/section>\s*<\/main>/, `\n${card}      </section>\n    </main>`);
}

fs.writeFileSync(indexPath, updated, 'utf8');
NODE
}

theme_factory_write_run_metadata() {
  local run_dir="$1"
  local mode="$2"
  local slug="$3"
  local prompt_file="$4"
  local codex_command="${5:-}"
  local ollama_model="${6:-}"

  mkdir -p "$run_dir"
  {
    printf '# Run Metadata\n\n'
    printf '%s\n' "- Mode: $mode"
    printf '%s\n' "- Theme slug: $slug"
    printf '%s\n' "- Prompt file: $prompt_file"
    if [ -n "$codex_command" ]; then
      printf '%s\n' "- Codex command: $codex_command"
    fi
    if [ -n "$ollama_model" ]; then
      printf '%s\n' "- Ollama model: $ollama_model"
    fi
    printf '%s\n' "- Started: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
  } > "$run_dir/run-metadata.md"
}
