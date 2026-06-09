#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/theme-factory-common.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

mode_input="${1:-${THEME_FACTORY_MODE:-}}"
if [ -z "$mode_input" ]; then
  if theme_factory_is_interactive; then
    mode_input="$(theme_factory_choose_from_menu "Choose workflow mode:" 1 \
      "1) Hybrid: Ollama draft + Codex final pass" \
      "2) Codex only: Codex handles complete generation" \
      "3) Ollama only: Local Ollama generation only")"
    case "$mode_input" in
      1*) mode_input="hybrid" ;;
      2*) mode_input="codex-only" ;;
      3*) mode_input="ollama-only" ;;
    esac
  else
    theme_factory_fail "THEME_FACTORY_MODE is required for noninteractive runs."
  fi
fi
mode="$(theme_factory_normalize_mode "$mode_input")"
prompt_file="$(theme_factory_select_prompt_file)"
theme_factory_check_prompt_file "$prompt_file"
slug="${THEME_SLUG:-$(theme_factory_get_next_slug "$prompt_file")}"
theme_factory_validate_slug "$slug"
run_dir="$root_dir/reports/runs/$slug"
theme_dir="$root_dir/wp-content/themes/$slug"
preview_dir="$root_dir/docs/themes/$slug"
zip_path="$root_dir/dist/zipped-themes/$slug.zip"

mkdir -p "$run_dir"
theme_factory_write_run_metadata "$run_dir" "$mode" "$slug" "$prompt_file" "${CODEX_COMMAND:-}" "${OLLAMA_MODEL:-}"
case "$prompt_file" in
  *.md) selected_prompt_copy="$run_dir/selected-prompt.md" ;;
  *) selected_prompt_copy="$run_dir/selected-prompt.txt" ;;
esac
cp "$prompt_file" "$selected_prompt_copy"

codex_command=""
ollama_model=""

if [ "$mode" != "codex-only" ]; then
  if ! command -v ollama >/dev/null 2>&1; then
    if [ "$mode" = "hybrid" ] && theme_factory_is_interactive; then
      printf 'Ollama is unavailable on this machine.\n' >&2
      if theme_factory_prompt_yes_no "Switch this run to Codex-only mode?" "y"; then
        mode="codex-only"
      else
        theme_factory_fail "Hybrid mode requires Ollama or an explicit switch to Codex-only mode."
      fi
    else
      theme_factory_fail "Ollama is required for $mode mode."
    fi
  fi
fi

if [ "$mode" != "codex-only" ]; then
  ollama_model="$(theme_factory_select_ollama_model)"
fi

if [ "$mode" != "ollama-only" ]; then
  codex_command="${CODEX_COMMAND:-}"
  if [ -z "$codex_command" ]; then
    if theme_factory_is_interactive; then
      read -r -p "Enter Codex command [codex]: " codex_command
      codex_command="${codex_command:-codex}"
    else
      codex_command="codex"
    fi
  fi
  theme_factory_require_cmd "${codex_command%% *}"
fi

if [ "$mode" = "ollama-only" ] && [ -z "$ollama_model" ]; then
  ollama_model="$(theme_factory_select_ollama_model)"
fi

write_prompt_header() {
  local output="$1"
  local title="$2"
  {
    printf '# %s\n\n' "$title"
    printf 'Theme slug: `%s`\n\n' "$slug"
    printf 'Prompt file: `%s`\n\n' "$prompt_file"
    printf 'Repository root: `%s`\n\n' "$root_dir"
  } > "$output"
}

append_premium_output_standard() {
  local output="$1"
  {
    printf '\n## Non-Negotiable Premium Output Standard\n\n'
    printf '%s\n' 'Follow the selected user prompt as the creative brief. Do not produce a generic agency site unless the prompt asks for one.'
    printf '%s\n' 'Use the required WordPress structure as the scaffold, but make the design, copy, imagery, and page staging fit the prompt.'
    printf '%s\n' 'The final output must look like a polished premium company website, not a file checklist.'
    printf '%s\n' 'Build a complete sticky Nolan-menu header with logo, Services/About/Work/Blog nav, and a right-side Contact Us CTA. Contact must not be a primary desktop nav item.'
    printf '%s\n' 'Use the exact Nolan-menu data attributes and ARIA behavior from contracts/nolan-menu-header.md.'
    printf '%s\n' 'Use local copyright-safe image assets that match the generated business category. Do not hotlink images or use CDNs.'
    printf '%s\n' 'Create matching WordPress templates and static preview pages with the same header, footer, classes, section order, image assets, and visual hierarchy.'
    printf '%s\n' 'Create all seven required static preview pages: homepage_preview.html, services_preview.html, about-us_preview.html, contact_preview.html, single_services_preview.html, blog_preview.html, and work_preview.html.'
    printf '%s\n' 'Do not use lorem ipsum, placeholder copy, gray boxes, sample text, TODOs, or generic filler.'
    printf '\nRead and obey these contracts:\n'
    printf '%s\n' '- contracts/premium-output-standard.md'
    printf '%s\n' '- contracts/nolan-menu-header.md'
    printf '%s\n' '- contracts/local-image-rules.md'
    printf '%s\n' '- contracts/required-preview-structure.md'
    printf '%s\n' '- contracts/required-theme-structure.md'
    printf '%s\n' '- contracts/quality-rules.md'
  } >> "$output"
}

append_repo_context() {
  local output="$1"
  {
    printf '## Repository Instructions\n\n'
    cat "$root_dir/AGENTS.md"
    printf '\n## Selected Prompt\n\n'
    cat "$prompt_file"
  } >> "$output"
}

write_planner_prompt() {
  local output="$1"
  write_prompt_header "$output" "Ollama Planner Stage"
  cat >> "$output" <<EOF
Read these files before planning:
- AGENTS.md
- agents/00-orchestrator.md
- agents/01-planner.md
- instructions/00-global-instructions.md
- instructions/01-planning-instructions.md
- contracts/theme-versioning.md
- contracts/required-theme-structure.md
- contracts/premium-output-standard.md
- contracts/nolan-menu-header.md
- contracts/local-image-rules.md

Task:
- create a concise implementation plan for the next generated theme
- preserve the prompt intent exactly
- identify the page map, content direction, design direction, risks, and execution priorities
- plan the seven required static preview pages and how they mirror WordPress templates
- plan the Nolan-menu header and local image asset set
- do not write theme files
- do not output file blocks

Theme slug: $slug
Selected Ollama model: ${ollama_model:-unknown}

EOF
  append_premium_output_standard "$output"
  cat >> "$output" <<EOF

## User Prompt

EOF
  cat "$prompt_file" >> "$output"
}

write_builder_prompt() {
  local output="$1"
  local plan_file="$2"
  write_prompt_header "$output" "Ollama Builder Stage"
  cat >> "$output" <<EOF
Read these files before building:
- AGENTS.md
- agents/00-orchestrator.md
- agents/02-theme-architect.md
- agents/03-wordpress-builder.md
- agents/04-design-director.md
- agents/05-content-writer.md
- instructions/00-global-instructions.md
- instructions/02-theme-scaffolding-instructions.md
- instructions/03-wordpress-build-instructions.md
- instructions/04-design-style-instructions.md
- instructions/05-content-instructions.md
- contracts/required-theme-structure.md
- contracts/file-block-format.md
- contracts/premium-output-standard.md
- contracts/nolan-menu-header.md
- contracts/local-image-rules.md
- contracts/quality-rules.md

The plan file is:
- $plan_file

Task:
- create the complete classic WordPress theme at wp-content/themes/$slug/
- emit only file blocks using the required protocol
- include all required files, expanded template parts, premium header, local assets, and real prompt-specific content
- create local image assets under wp-content/themes/$slug/assets/images/ and reference them from the templates
- implement Nolan-menu desktop and mobile behavior in local JS
- implement complete CSS for sticky header, Nolan-menu panels, mobile drawer, homepage, services, work, blog, contact, footer, and responsive states
- do not use remote assets, CDN assets, placeholder text, TODOs, or lorem ipsum
- keep the design polished, finished, and installable

Theme slug: $slug
Selected Ollama model: ${ollama_model:-unknown}

EOF
  append_premium_output_standard "$output"
  cat >> "$output" <<EOF

## User Prompt

EOF
  cat "$prompt_file" >> "$output"
  printf '\n## Plan\n\n' >> "$output"
  cat "$plan_file" >> "$output"
}

write_preview_prompt() {
  local output="$1"
  local plan_file="$2"
  local theme_summary="$3"
  write_prompt_header "$output" "Ollama Preview Stage"
  cat >> "$output" <<EOF
Read these files before building the preview:
- AGENTS.md
- agents/00-orchestrator.md
- agents/06-static-preview-builder.md
- instructions/00-global-instructions.md
- instructions/06-static-preview-instructions.md
- contracts/required-preview-structure.md
- contracts/file-block-format.md
- contracts/premium-output-standard.md
- contracts/nolan-menu-header.md
- contracts/local-image-rules.md

The plan file is:
- $plan_file

Theme summary:
- $theme_summary

Task:
- create docs/themes/$slug/
- create index.html plus all seven required preview pages
- make the preview pages visual matches for the WordPress templates, not loose approximations
- reuse the same class names, header, footer, section order, image assets, buttons, and card layouts
- make header links click between all preview pages
- implement Nolan-menu behavior in local preview JS
- use only local assets
- emit only file blocks using the required protocol
- update docs/index.html so it links to the preview

Theme slug: $slug
Selected Ollama model: ${ollama_model:-unknown}

EOF
  append_premium_output_standard "$output"
  cat >> "$output" <<EOF

## User Prompt

EOF
  cat "$prompt_file" >> "$output"
  printf '\n## Plan\n\n' >> "$output"
  cat "$plan_file" >> "$output"
  printf '\n## Theme Summary\n\n%s\n' "$theme_summary" >> "$output"
}

write_review_prompt() {
  local output="$1"
  local validation_file="$2"
  local plan_file="$3"
  local theme_summary="$4"
  write_prompt_header "$output" "Ollama Review and Fix Stage"
  cat >> "$output" <<EOF
Read these files before fixing:
- AGENTS.md
- agents/00-orchestrator.md
- agents/07-security-reviewer.md
- agents/08-quality-reviewer.md
- agents/09-fixer.md
- agents/10-release-manager.md
- instructions/00-global-instructions.md
- instructions/07-security-instructions.md
- instructions/08-review-instructions.md
- instructions/09-fix-instructions.md
- instructions/10-release-instructions.md
- contracts/security-rules.md
- contracts/quality-rules.md
- contracts/release-artifact-rules.md
- contracts/premium-output-standard.md
- contracts/nolan-menu-header.md
- contracts/local-image-rules.md
- contracts/required-preview-structure.md

Validation output:
- $validation_file

Plan file:
- $plan_file

Theme summary:
- $theme_summary

Task:
- inspect the generated theme and preview
- fix issues needed to pass validation and meet the premium output standard
- preserve the prompt direction
- emit file blocks only if files need to change

Theme slug: $slug
Selected Ollama model: ${ollama_model:-unknown}

EOF
  append_premium_output_standard "$output"
  printf '\n## User Prompt\n\n' >> "$output"
  cat "$prompt_file" >> "$output"
}

build_theme_summary() {
  local output="$1"
  {
    printf 'Theme files for %s:\n' "$slug"
    find "$theme_dir" -type f | sed "s|$root_dir/||" | sort
  } > "$output"
}

run_npm_build() {
  theme_factory_require_cmd npm
  [ -f "$theme_dir/package.json" ] || theme_factory_fail "Missing package.json: $theme_dir/package.json"
  (
    cd "$theme_dir"
    npm install
    npm run build
  )
}

package_theme() {
  bash "$script_dir/package-theme.sh" "$slug"
}

validate_theme() {
  bash "$script_dir/validate-all.sh" "$slug" 2>&1 | tee "$run_dir/validation-output.txt"
}

run_ollama_stage() {
  local stage="$1"
  local prompt_path="$2"
  OLLAMA_MODEL="$ollama_model" bash "$script_dir/run-ollama-stage.sh" "$stage" "$slug" "$prompt_path" "$root_dir"
}

run_codex_final_pass() {
  local prompt_path="$1"
  CODEX_COMMAND="$codex_command" bash "$script_dir/run-codex-final-pass.sh" "$slug" "$prompt_path"
}

theme_factory_write_run_metadata "$run_dir" "$mode" "$slug" "$prompt_file" "$codex_command" "$ollama_model"

printf 'Theme factory mode: %s\n' "$mode"
printf 'Prompt file: %s\n' "$prompt_file"
printf 'Theme slug: %s\n' "$slug"
if [ -n "$codex_command" ]; then
  printf 'Codex command: %s\n' "$codex_command"
fi
if [ -n "$ollama_model" ]; then
  printf 'Ollama model: %s\n' "$ollama_model"
fi

if [ "$mode" != "codex-only" ]; then
  planner_prompt="$run_dir/ollama-planner-prompt.md"
  builder_prompt="$run_dir/ollama-builder-prompt.md"
  preview_prompt="$run_dir/ollama-preview-prompt.md"
  review_prompt="$run_dir/ollama-review-fix-prompt.md"
  plan_file="$run_dir/plan.md"
  theme_summary_file="$run_dir/theme-summary.txt"

  write_planner_prompt "$planner_prompt"
  run_ollama_stage planner "$planner_prompt"

  write_builder_prompt "$builder_prompt" "$plan_file"
  run_ollama_stage builder "$builder_prompt"

  run_npm_build

  build_theme_summary "$theme_summary_file"
  write_preview_prompt "$preview_prompt" "$plan_file" "$theme_summary_file"
  run_ollama_stage preview "$preview_prompt"

  package_theme

  if ! validate_theme; then
    if [ "$mode" = "ollama-only" ]; then
      write_review_prompt "$review_prompt" "$run_dir/validation-output.txt" "$plan_file" "$(cat "$theme_summary_file")"
      run_ollama_stage review-fix "$review_prompt"
      run_npm_build
      package_theme
      validate_theme
    else
      write_review_prompt "$review_prompt" "$run_dir/validation-output.txt" "$plan_file" "$(cat "$theme_summary_file")"
      run_ollama_stage review-fix "$review_prompt"
      run_npm_build
      package_theme
      validate_theme || true
    fi
  fi
fi

if [ "$mode" != "ollama-only" ]; then
  codex_prompt="$run_dir/codex-final-prompt.md"
  {
    printf '# Codex Final Pass\n\n'
    printf 'Theme slug: `%s`\n\n' "$slug"
    printf 'Codex command: `%s`\n\n' "$codex_command"
    printf 'Read these files before editing:\n'
    printf '%s\n' '- AGENTS.md'
    printf '%s\n' '- agents/00-orchestrator.md'
    printf '%s\n' '- codex/codex-final-pass.md'
    printf '%s\n' '- instructions/00-global-instructions.md'
    printf '%s\n' '- instructions/10-release-instructions.md'
    printf '%s\n' '- contracts/quality-rules.md'
    printf '%s\n' '- contracts/release-artifact-rules.md'
    printf '%s\n' '- contracts/premium-output-standard.md'
    printf '%s\n' '- contracts/nolan-menu-header.md'
    printf '%s\n' '- contracts/local-image-rules.md'
    printf '%s\n' '- contracts/required-preview-structure.md'
    printf '\nTask:\n'
    printf '%s\n' '- finalize the existing generated theme'
    printf '%s\n' '- preserve the prompt direction and the existing design intent'
    printf '%s\n' '- fix broken PHP, styling, preview mismatch, build issues, accessibility issues, Nolan-menu behavior, local images, and release readiness problems'
    printf '%s\n' '- ensure all seven static preview pages exist and visually match the WordPress templates'
    printf '%s\n' '- ensure the homepage feels premium, complete, and prompt-specific'
    printf '%s\n' '- do not start from scratch unless the output is unrecoverable'
    printf '%s\n' '- do not run a second Codex pass without explicit user confirmation'
  } > "$codex_prompt"
  append_premium_output_standard "$codex_prompt"
  {
    printf '\n## User Prompt\n\n'
    cat "$prompt_file"
  } >> "$codex_prompt"

  run_codex_final_pass "$codex_prompt"
  run_npm_build
  package_theme

  if ! validate_theme; then
    printf '\nValidation failed after Codex pass.\n' >&2
    if theme_factory_is_interactive; then
      printf 'Choose next action:\n' >&2
      printf '1) Run Codex fixer pass\n' >&2
      printf '2) Run Ollama fixer pass if available\n' >&2
      printf '3) Stop and inspect manually\n' >&2
      read -r -p 'Choose 1-3 [3]: ' fix_choice
      fix_choice="${fix_choice:-3}"
      case "$fix_choice" in
        1)
          fixer_prompt="$run_dir/codex-fixer-prompt.md"
          cp "$codex_prompt" "$fixer_prompt"
          printf '\nValidation output:\n\n' >> "$fixer_prompt"
          cat "$run_dir/validation-output.txt" >> "$fixer_prompt" 2>/dev/null || true
          run_codex_final_pass "$fixer_prompt"
          run_npm_build
          package_theme
          validate_theme
          ;;
        2)
          if [ "$mode" = "hybrid" ] || [ "$mode" = "ollama-only" ]; then
            fixer_prompt="$run_dir/ollama-review-fix-prompt.md"
            write_review_prompt "$fixer_prompt" "$run_dir/validation-output.txt" "$run_dir/plan.md" "$(cat "$run_dir/theme-summary.txt" 2>/dev/null || true)"
            run_ollama_stage review-fix "$fixer_prompt"
            run_npm_build
            package_theme
            validate_theme
          else
            theme_factory_fail "Ollama fixer pass is unavailable because Ollama was not selected for this run."
          fi
          ;;
        *)
          theme_factory_fail "Validation failed after Codex pass. Inspect manually."
          ;;
      esac
    else
      theme_factory_fail "Validation failed after Codex pass and the environment is noninteractive."
    fi
  fi
fi

theme_factory_update_gallery_index "$slug" "$(theme_factory_theme_name_from_style "$theme_dir/style.css")"

printf '\nComplete:\n'
printf 'Theme: %s\n' "$theme_dir/"
printf 'Preview: %s\n' "$preview_dir/index.html"
printf 'ZIP: %s\n' "$zip_path"
