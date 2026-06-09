#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-common.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

slug="${1:-}"
[ -n "$slug" ] || theme_factory_fail "Usage: bash scripts/validate-security.sh <theme-slug>"

theme_dir="$root_dir/wp-content/themes/$slug"
preview_dir="$root_dir/docs/themes/$slug"
failures=0

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  failures=$((failures + 1))
}

scan_for() {
  local label="$1"
  local pattern="$2"
  local path="$3"
  if grep -R -I -n -E \
    --exclude='*.svg' \
    --exclude='*.png' \
    --exclude='*.jpg' \
    --exclude='*.jpeg' \
    --exclude='*.webp' \
    --exclude='*.gif' \
    "$pattern" "$path" 2>/dev/null | grep -v 'https://www.w3.org' >/dev/null; then
    printf '%s\n' "$label" >&2
    grep -R -I -n -E \
      --exclude='*.svg' \
      --exclude='*.png' \
      --exclude='*.jpg' \
      --exclude='*.jpeg' \
      --exclude='*.webp' \
      --exclude='*.gif' \
      "$pattern" "$path" 2>/dev/null | grep -v 'https://www.w3.org' >&2
    fail "$label"
  fi
}

if [ -d "$theme_dir" ]; then
  scan_for "Blocked secret or unsafe pattern found in theme" "OPENAI_API_KEY|sk-[A-Za-z0-9_-]{20,}|BEGIN [A-Z ]*PRIVATE KEY|eval[[:space:]]*\\(|shell_exec[[:space:]]*\\(|passthru[[:space:]]*\\(|system[[:space:]]*\\(|base64_decode[[:space:]]*\\(|ghp_[A-Za-z0-9]{20,}|password[[:space:]]*[:=][[:space:]]*" "$theme_dir"
  scan_for "Remote script, CDN, or tracking dependency found in theme" "<(script|link|img|source|video|audio)[^>]+(src|href)=[\"'][^\"']*https?://|@import[[:space:]]+url\\([\"']?https?://|url\\([\"']?https?://|//cdn\\.|cdnjs|jsdelivr|unpkg|googletagmanager|gtag\\(|fbq\\(" "$theme_dir"
fi

if [ -d "$preview_dir" ]; then
  scan_for "Blocked secret or unsafe pattern found in preview" "OPENAI_API_KEY|sk-[A-Za-z0-9_-]{20,}|BEGIN [A-Z ]*PRIVATE KEY|eval[[:space:]]*\\(|shell_exec[[:space:]]*\\(|passthru[[:space:]]*\\(|system[[:space:]]*\\(|base64_decode[[:space:]]*\\(" "$preview_dir"
  scan_for "Remote script, CDN, or tracking dependency found in preview" "<(script|link|img|source|video|audio)[^>]+(src|href)=[\"'][^\"']*https?://|@import[[:space:]]+url\\([\"']?https?://|url\\([\"']?https?://|//cdn\\.|cdnjs|jsdelivr|unpkg|googletagmanager|gtag\\(|fbq\\(" "$preview_dir"
fi

if [ -f "$root_dir/docs/index.html" ]; then
  scan_for "Remote script, CDN, or tracking dependency found in gallery" "<(script|link|img|source|video|audio)[^>]+(src|href)=[\"'][^\"']*https?://|@import[[:space:]]+url\\([\"']?https?://|url\\([\"']?https?://|//cdn\\.|cdnjs|jsdelivr|unpkg|googletagmanager|gtag\\(|fbq\\(" "$root_dir/docs/index.html"
fi

if find "$root_dir" -type f \( -name '.env' -o -name '.env.*' \) 2>/dev/null | grep -q .; then
  while IFS= read -r env_file; do
    if grep -q '[^#[:space:]]' "$env_file"; then
      printf 'Blocked env file with values: %s\n' "${env_file#$root_dir/}" >&2
      fail "Environment files with values are not allowed"
    fi
  done < <(find "$root_dir" -type f \( -name '.env' -o -name '.env.*' \) 2>/dev/null | sort)
fi

if [ "$failures" -gt 0 ]; then
  printf 'Security validation failed for %s with %s issue(s).\n' "$slug" "$failures" >&2
  exit 1
fi

printf 'Security validation passed for %s.\n' "$slug"
