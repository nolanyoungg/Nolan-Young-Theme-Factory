#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/../repo/theme-factory-shared-functions.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

found=0
while IFS= read -r prompt_file; do
  found=1
  theme_factory_check_prompt_file "$prompt_file"
done < <(
  {
    find "$root_dir/prompts/pending" -maxdepth 1 -type f \( -name '*.txt' -o -name '*.md' \) ! -name 'README.md'
    if [ -d "$root_dir/prompts/template prompts" ]; then
      find "$root_dir/prompts/template prompts" -maxdepth 1 -type f \( -name '*.txt' -o -name '*.md' \) ! -name 'README.md'
    fi
  } | sort
)

if [ "$found" -eq 0 ]; then
  printf 'No pending or template prompt files found.\n'
else
  printf 'Prompt file validation passed.\n'
fi
