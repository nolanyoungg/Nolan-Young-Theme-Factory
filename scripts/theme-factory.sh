#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

usage() {
  cat <<'USAGE'
Usage:
  bash scripts/theme-factory.sh list-templates
  bash scripts/theme-factory.sh prepare <prompt-file> [template-name]
  bash scripts/theme-factory.sh brief <theme-slug> <prompt-file> [mode]
  bash scripts/theme-factory.sh validate <theme-slug> [template-name]
  bash scripts/theme-factory.sh quality <theme-slug>
  bash scripts/theme-factory.sh check <theme-slug> [template-name]
  bash scripts/theme-factory.sh ollama-pass <theme-slug> <prompt-file> [model]
  bash scripts/theme-factory.sh ollama-only <prompt-file> [template-name] [model]
  bash scripts/theme-factory.sh preview <theme-slug>
  bash scripts/theme-factory.sh preview-index
  bash scripts/theme-factory.sh package <theme-slug>
USAGE
}

cmd="${1:-}"
[ -n "$cmd" ] || { usage; exit 1; }
shift || true

case "$cmd" in
  list-templates)
    find wordpress-themplate-themes -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort
    ;;
  prepare)
    bash scripts/prepare-theme-from-template.sh "$@"
    ;;
  brief)
    node scripts/create-theme-generation-brief.js "$@"
    ;;
  validate)
    bash scripts/validate-theme-from-template.sh "$@"
    ;;
  quality)
    bash scripts/theme-quality-check.sh "$@"
    ;;
  check)
    slug="${1:-}"
    template="${2:-}"
    [ -n "$slug" ] || { usage; exit 1; }
    if [ -n "$template" ]; then
      bash scripts/validate-theme-from-template.sh "$slug" "$template"
    else
      bash scripts/validate-theme-from-template.sh "$slug"
    fi
    bash scripts/theme-quality-check.sh "$slug"
    ;;
  ollama-pass)
    bash scripts/run-ollama-theme-pass.sh "$@"
    ;;
  ollama-only)
    prompt_file="${1:-}"
    template_name="${2:-NOLAN-YOUNG-theme-000}"
    model="${3:-qwen2.5-coder:14b}"
    [ -n "$prompt_file" ] || { usage; exit 1; }
    prepare_output="$(bash scripts/prepare-theme-from-template.sh "$prompt_file" "$template_name")"
    printf '%s\n' "$prepare_output"
    slug="$(printf '%s\n' "$prepare_output" | sed -n 's|^Prepared theme folder: wp-content/themes/||p' | head -n 1)"
    [ -n "$slug" ] || {
      printf 'Could not determine prepared theme slug.\n' >&2
      exit 1
    }
    bash scripts/run-ollama-theme-pass.sh "$slug" "$prompt_file" "$model"
    bash scripts/validate-theme-from-template.sh "$slug" "$template_name"
    if ! bash scripts/theme-quality-check.sh "$slug"; then
      printf 'Running Ollama quality repair pass for %s\n' "$slug"
      bash scripts/run-ollama-quality-repair-pass.sh "$slug" "$prompt_file" "$model"
      bash scripts/theme-quality-check.sh "$slug"
    fi
    node scripts/generate-static-preview.js "$slug"
    bash scripts/package-theme.sh "$slug"
    node scripts/rebuild-preview-gallery.js
    node scripts/validate-preview-gallery.js
    ;;
  preview)
    node scripts/generate-static-preview.js "$@"
    node scripts/rebuild-preview-gallery.js
    node scripts/validate-preview-gallery.js
    ;;
  preview-index)
    node scripts/rebuild-preview-gallery.js
    node scripts/validate-preview-gallery.js
    ;;
  package)
    bash scripts/package-theme.sh "$@"
    ;;
  help|-h|--help)
    usage
    ;;
  *)
    printf 'Unknown command: %s\n\n' "$cmd" >&2
    usage >&2
    exit 1
    ;;
esac
