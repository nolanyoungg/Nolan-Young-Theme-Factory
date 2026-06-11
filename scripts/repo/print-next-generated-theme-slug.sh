#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/../repo/theme-factory-shared-functions.sh"
theme_factory_get_next_slug "${1:-generated_theme}"
