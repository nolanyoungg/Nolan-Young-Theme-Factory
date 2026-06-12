#!/usr/bin/env bash
set -Eeuo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/../repo/theme-factory-shared-functions.sh"
root_dir="$(theme_factory_repo_root)"
cd "$root_dir"

slug="${1:-}"
[ -n "$slug" ] || theme_factory_fail "Usage: bash scripts/validation/validate-wordpress-theme-quality-bar.sh <theme-slug>"
theme_factory_validate_slug "$slug"

theme_dir="$root_dir/wp-content/themes/$slug"
preview_dir="$root_dir/docs/themes/$slug"
failures=0

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  failures=$((failures + 1))
}

scan_patterns() {
  local path="$1"
  grep -R -I -n -i -E \
    --exclude='*.svg' \
    --exclude='*.png' \
    --exclude='*.jpg' \
    --exclude='*.jpeg' \
    --exclude='*.webp' \
    --exclude='*.gif' \
    'lorem ipsum|todo|placeholder|sample text|coming soon|sample service|example service|replace this|dummy content|image here|gray box|we are passionate about excellence|your success is our mission|we help businesses grow' \
    "$path" 2>/dev/null || true
}

cross_theme_brand_matches() {
  command -v node >/dev/null 2>&1 || return 0
  node - "$root_dir" "$slug" "$theme_dir" "$preview_dir" <<'NODE'
const fs = require('fs');
const path = require('path');

const [rootDir, currentSlug, themeDir, previewDir] = process.argv.slice(2);
const runsDir = path.join(rootDir, 'reports', 'runs');
const ignoredExts = new Set(['.gif', '.jpg', '.jpeg', '.png', '.webp', '.zip', '.ico', '.pdf']);
const genericFirstWords = new Set(['premium', 'custom', 'nolan', 'young', 'theme', 'the']);

function readBrand(slug) {
  const specPath = path.join(runsDir, slug, 'ollama-normalized-spec.json');
  if (!fs.existsSync(specPath)) return '';
  try {
    const parsed = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    return String(parsed.brandName || '').replace(/\s+/g, ' ').trim();
  } catch (_) {
    return '';
  }
}

function addExpectedBrand(expectedBrands, brand) {
  const clean = String(brand || '').replace(/\s+/g, ' ').trim();
  if (clean) expectedBrands.add(clean.toLowerCase());
}

function readCurrentExpectedBrands() {
  const expectedBrands = new Set();
  addExpectedBrand(expectedBrands, readBrand(currentSlug));

  const stylePath = path.join(themeDir, 'style.css');
  if (fs.existsSync(stylePath)) {
    const style = fs.readFileSync(stylePath, 'utf8');
    const themeName = style.match(/^\s*Theme Name:\s*(.+)$/im);
    if (themeName) {
      const clean = themeName[1].replace(/\s+/g, ' ').trim();
      addExpectedBrand(expectedBrands, clean);
      const suffix = clean.split(/\s+-\s+/).pop();
      addExpectedBrand(expectedBrands, suffix);
    }
  }

  const readmePath = path.join(themeDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    const readme = fs.readFileSync(readmePath, 'utf8');
    const heading = readme.match(/^\s*#\s+(.+)$/m);
    if (heading) addExpectedBrand(expectedBrands, heading[1]);
  }

  return expectedBrands;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(fullPath));
    else if (!ignoredExts.has(path.extname(entry.name).toLowerCase())) out.push(fullPath);
  }
  return out;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function addBrandTerm(terms, brand, expectedBrands) {
  const clean = String(brand || '').replace(/\s+/g, ' ').trim();
  if (!clean || expectedBrands.has(clean.toLowerCase())) return;
  terms.add(clean);
  const first = clean.split(/\s+/)[0] || '';
  if (first.length >= 7 && /^[A-Z][A-Za-z0-9]+$/.test(first) && !genericFirstWords.has(first.toLowerCase())) {
    terms.add(first);
  }
}

const expectedBrands = readCurrentExpectedBrands();
const terms = new Set();
if (fs.existsSync(runsDir)) {
  for (const entry of fs.readdirSync(runsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === currentSlug) continue;
    addBrandTerm(terms, readBrand(entry.name), expectedBrands);
  }
}

const files = [...walk(themeDir), ...walk(previewDir)];
const matches = [];
for (const file of files) {
  let text = '';
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (_) {
    continue;
  }
  if (text.includes('\u0000')) continue;
  const lines = text.split(/\r?\n/);
  for (const term of terms) {
    const pattern = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i');
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        const relative = path.relative(rootDir, file).replace(/\\/g, '/');
        matches.push(`${relative}:${index + 1}: contains cross-theme brand "${term}"`);
      }
    });
  }
}

process.stdout.write(matches.join('\n'));
NODE
}

if [ ! -d "$theme_dir" ]; then
  fail "Missing theme directory: wp-content/themes/$slug"
else
  theme_matches="$(scan_patterns "$theme_dir")"
  if [ -n "$theme_matches" ]; then
    printf '%s\n' "$theme_matches" >&2
    fail "Theme contains placeholder or filler copy"
  fi

  if [ -f "$theme_dir/assets/css/bundle.css" ]; then
    [ "$(wc -c < "$theme_dir/assets/css/bundle.css" | tr -d ' ')" -ge 1000 ] || fail "Compiled CSS is too small to be meaningful"
  else
    fail "Missing compiled CSS"
  fi

  if [ -f "$theme_dir/assets/js/bundle.js" ]; then
    [ "$(wc -c < "$theme_dir/assets/js/bundle.js" | tr -d ' ')" -ge 400 ] || fail "Compiled JS is too small to be meaningful"
  else
    fail "Missing compiled JS"
  fi

  grep -R -I -n -E 'wp_enqueue_style|wp_enqueue_script' "$theme_dir/inc" "$theme_dir/functions.php" >/dev/null 2>&1 || fail "Missing asset enqueue calls"
  grep -R -I -n -E 'wp_enqueue_style' "$theme_dir/inc" "$theme_dir/functions.php" >/dev/null 2>&1 || fail "Missing wp_enqueue_style call"
  grep -R -I -n -E 'wp_enqueue_script' "$theme_dir/inc" "$theme_dir/functions.php" >/dev/null 2>&1 || fail "Missing wp_enqueue_script call"
  grep -R -I -n -E 'content-hero|content-all-services|content-featured-work|content-process|content-testimonials|content-blog-preview|content-cta-banner|hero|services|work|portfolio|process|testimonial|proof|blog|cta' "$theme_dir/front-page.php" "$theme_dir/template-parts" >/dev/null 2>&1 || fail "Homepage content sections are missing or not referenced"
  grep -R -I -n -E '\.(jpg|jpeg|png|webp)' "$theme_dir" >/dev/null 2>&1 || fail "Theme does not reference local raster images"
  [ -f "$theme_dir/README.md" ] || fail "Missing theme README"
  [ -f "$theme_dir/CHANGELOG.md" ] || fail "Missing CHANGELOG"
fi

if [ -d "$preview_dir" ]; then
  preview_matches="$(scan_patterns "$preview_dir")"
  if [ -n "$preview_matches" ]; then
    printf '%s\n' "$preview_matches" >&2
    fail "Preview contains placeholder or filler copy"
  fi
fi

brand_matches="$(cross_theme_brand_matches)"
if [ -n "$brand_matches" ]; then
  printf '%s\n' "$brand_matches" >&2
  fail "Generated output contains another generated theme brand name"
fi

if [ -f "$root_dir/docs/index.html" ]; then
  grep -Eq "themes/$slug/(index|homepage_preview)\\.html" "$root_dir/docs/index.html" || fail "docs/index.html does not link to $slug preview"
else
  fail "Missing docs/index.html"
fi

if [ "$failures" -gt 0 ]; then
  printf 'Quality validation failed for %s with %s issue(s).\n' "$slug" "$failures" >&2
  exit 1
fi

printf 'Quality validation passed for %s.\n' "$slug"
