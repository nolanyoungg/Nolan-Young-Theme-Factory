#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-common.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

slug="${1:-}"
[ -n "$slug" ] || theme_factory_fail "Usage: bash scripts/validate-zip-freshness.sh <theme-slug>"

theme_dir="$root_dir/wp-content/themes/$slug"
zip_path="$root_dir/dist/zipped-themes/$slug.zip"
failures=0

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  failures=$((failures + 1))
}

[ -f "$zip_path" ] || fail "Missing ZIP: dist/zipped-themes/$slug.zip"
[ -d "$theme_dir" ] || fail "Missing theme directory: wp-content/themes/$slug"

if [ -f "$zip_path" ]; then
  theme_factory_require_cmd unzip
  mapfile -t zip_entries < <(unzip -Z1 "$zip_path")
  printf '%s\n' "${zip_entries[@]}" | grep -qx "$slug/style.css" || fail "ZIP does not contain $slug/style.css"
  if printf '%s\n' "${zip_entries[@]}" | grep -E '(^|/)node_modules/|(^|/)\.git/' >/dev/null; then
    fail "ZIP contains node_modules or .git"
  fi

  if [ "${GITHUB_ACTIONS:-}" = "true" ] && command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    theme_commit_time="$(git log -1 --format=%ct -- "wp-content/themes/$slug" || true)"
    zip_commit_time="$(git log -1 --format=%ct -- "dist/zipped-themes/$slug.zip" || true)"
    if [ -z "$theme_commit_time" ] || [ -z "$zip_commit_time" ]; then
      fail "Unable to determine committed freshness for theme or ZIP"
    elif [ "$zip_commit_time" -lt "$theme_commit_time" ]; then
      fail "ZIP commit is older than theme commit"
    fi
  else
    theme_factory_require_cmd node
    if ! node - "$theme_dir" "$zip_path" <<'NODE'
const fs = require('fs');
const path = require('path');
const themeDir = process.argv[2];
const zipPath = process.argv[3];

function newestMtime(dir) {
  let max = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      max = Math.max(max, newestMtime(full));
    } else {
      const stat = fs.statSync(full);
      max = Math.max(max, stat.mtimeMs);
    }
  }
  return max;
}

const themeNewest = newestMtime(themeDir);
const zipMtime = fs.statSync(zipPath).mtimeMs;
if (!(zipMtime >= themeNewest)) {
  console.error(`ZIP is older than generated theme files: ${zipPath}`);
  process.exit(1);
}
NODE
    then
      fail "ZIP is older than generated theme files"
    fi
  fi
fi

if [ "$failures" -gt 0 ]; then
  printf 'ZIP freshness validation failed for %s with %s issue(s).\n' "$slug" "$failures" >&2
  exit 1
fi

printf 'ZIP freshness validation passed for %s.\n' "$slug"
