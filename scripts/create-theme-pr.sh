#!/usr/bin/env bash
set -Eeuo pipefail

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

valid_slug() {
  [[ "$1" =~ ^([0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]|nolan-showcase-theme-[0-9]{2})$ ]]
}

usage() {
  printf 'Usage: bash scripts/create-theme-pr.sh <theme-slug>\n' >&2
}

slug="${1:-}"
[ -n "$slug" ] || {
  usage
  exit 1
}

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root_dir="$(cd "$script_dir/.." && pwd)"
cd "$root_dir"

valid_slug "$slug" || fail "Invalid theme slug: $slug"

theme_dir="wp-content/themes/$slug"
preview_dir="docs/themes/$slug"
zip_path="dist/zipped-themes/$slug.zip"
branch="${THEME_PR_BRANCH:-theme/$slug}"
base="${THEME_PR_BASE:-main}"
remote="${THEME_PR_REMOTE:-origin}"

[ -d "$theme_dir" ] || fail "Theme directory missing: $theme_dir"
[ -d "$preview_dir" ] || fail "Preview directory missing: $preview_dir"
[ -f "$zip_path" ] || fail "ZIP missing: $zip_path"
[ -f "docs/index.html" ] || fail "Gallery missing: docs/index.html"

command -v git >/dev/null 2>&1 || fail "git is required."
command -v gh >/dev/null 2>&1 || fail "GitHub CLI is required to create PRs. Install gh or run manually."

bash scripts/validate-all.sh "$slug"

if [ "$(git rev-parse --abbrev-ref HEAD)" != "$branch" ]; then
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    git switch "$branch"
  else
    git switch -c "$branch"
  fi
fi

git add "$theme_dir" "$preview_dir" "$zip_path" "docs/index.html"

if git diff --cached --quiet; then
  printf 'No generated theme changes to commit for %s.\n' "$slug"
else
  git commit -m "Add $slug"
fi

git push -u "$remote" "$branch"

repo="$(gh repo view --json nameWithOwner -q .nameWithOwner)" || fail "Unable to detect GitHub repository with gh."

if gh pr view "$branch" --repo "$repo" >/dev/null 2>&1; then
  printf 'Pull request already exists for branch %s.\n' "$branch"
else
  gh pr create \
    --base "$base" \
    --head "$branch" \
    --title "Add $slug" \
    --body "Adds generated WordPress theme \`$slug\`, its matching GitHub Pages preview, gallery link, and ZIP package.\n\nValidated with:\n\n\`\`\`bash\nbash scripts/validate-all.sh $slug\n\`\`\`"
fi
