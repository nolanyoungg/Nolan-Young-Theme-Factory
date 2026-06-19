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
generation_dir="reports/runs/$theme_slug/ollama-generation"
mkdir -p "$generation_dir"

run_batch() {
  local batch_name="$1"
  local files="$2"
  local focus="$3"
  local run_prompt="$generation_dir/ollama-${batch_name}-prompt.md"
  local raw_output="$generation_dir/ollama-${batch_name}-raw.md"

  cat > "$run_prompt" <<EOF
You are editing a prepared WordPress theme folder.

Target folder:
wp-content/themes/$theme_slug/

You must generate only files inside that folder. Paths in your response must be relative to that folder.

Creative brief:
$(cat "$brief_path")

Batch focus:
$focus

Return only file blocks in this exact format:

---FILE: relative/path.php---
line 1
line 2
---END FILE---

Required files for this batch:
$files

Rules:
- Write complete file contents, not patches.
- Keep paths relative to wp-content/themes/$theme_slug/.
- Do not write style.css; WordPress theme metadata is prepared before this AI pass.
- Do not use absolute paths.
- Do not use ..
- Do not use CDN URLs, remote scripts, Google Fonts, remote images, or external links.
- Do not write http:// or https:// URLs anywhere. Use # for social links or inactive external labels.
- Use local assets, inline SVG, CSS-generated interface graphics, and theme files.
- Do not include secrets, tokens, passwords, or API keys.
- Replace Lorem ipsum in files you write.
- Do not write TODO comments, placeholder comments, "Add ... here" comments, empty cards, empty sections, or instructions for a future editor.
- Every section you create must include finished copy and visible content appropriate to the selected creative prompt.
- header.php and footer.php must not include a standalone ?> line after an inline PHP comment.
- header.php must use lowercase <!doctype html> and a valid full document wrapper.
- Preserve WordPress PHP syntax.
- For PHP template files with HTML, use this valid structure:
  1. Start with <?php and any template comments.
  2. Call get_header(); while inside PHP.
  3. Close PHP with ?> before writing HTML.
  4. Reopen <?php only for WordPress function calls.
  5. Reopen PHP at the end and call get_footer();.
- Never write raw HTML while a PHP block is still open.
- Never write stray words, labels, or partial JSON fragments into PHP files.
- Do not wrap the file blocks in markdown fences or JSON.
EOF

  printf 'Running Ollama batch: %s\n' "$batch_name"
  OLLAMA_NOHISTORY=1 ollama run "$model" --nowordwrap < "$run_prompt" > "$raw_output"
  node scripts/apply-theme-file-blocks.js "$raw_output" "wp-content/themes/$theme_slug"
}

printf 'Running Ollama model: %s\n' "$model"

run_batch "shell" \
"- README.md
- header.php
- footer.php
- front-page.php" \
"Create the brand shell described by the creative prompt. Build the responsive header, footer, README content, and homepage structure exactly around the requested business identity, navigation, dropdown behavior, page goals, sections, and calls to action; do not leave comments that ask someone to add those pieces later."

run_batch "template-parts" \
"- template-parts/content-hero.php
- template-parts/content-brand-statement.php
- template-parts/content-featured-work.php
- template-parts/content-all-services.php
- template-parts/content-single-service-highlight.php
- template-parts/content-process.php
- template-parts/content-style-pillars.php
- template-parts/content-testimonials.php
- template-parts/content-blog-preview.php
- template-parts/content-cta-banner.php
- template-parts/content-footer-widgets.php" \
"Create reusable homepage and site sections that match the selected creative prompt, including the requested copy, services or offerings, proof, process, work examples, testimonials, FAQ-style content where appropriate, and CTAs."

run_batch "pages" \
"- page-templates/template-about-us.php
- page-templates/template-services.php
- page-templates/template-single-service.php
- page-templates/template-work.php
- page-templates/template-blog.php
- page-templates/template-contact.php
- page-templates/template-policy.php
- page.php
- single.php
- archive.php
- search.php
- 404.php
- 403.php" \
"Create page templates and standard WordPress templates with unique page intent for about, services, individual services, work/case studies, resources, contact, policy, search, archive, and error states."

run_batch "assets" \
"- assets/css/bundle.css
- assets/js/bundle.js
- src/js/main.js
- src/scss/main.scss
- assets/icons/icon1.svg" \
"Create the visual system, responsive layout, header interaction JavaScript, scroll animation hooks, local SVG logo/icon, and source mirrors requested by the creative prompt. Avoid starter CSS; write a complete responsive visual system that styles the actual generated sections."

run_batch "forms-helpers" \
"- inc/forms.php
- inc/newsletter.php
- inc/helpers.php
- inc/custom-post-types.php
- inc/customizer.php
- inc/policy-routing.php
- comments.php
- searchform.php" \
"Create practical WordPress helper code, form handling/admin menu scaffolding, newsletter helper, custom post type setup, policy routing, comments, and search form code without external dependencies. Do not use Lorem ipsum in comments.php or searchform.php."

printf 'Ollama theme pass complete for %s\n' "$theme_slug"
