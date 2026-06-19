#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const [slug] = process.argv.slice(2);
const root = path.resolve(__dirname, '..');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!slug) fail('Usage: node scripts/generate-static-preview.js <theme-slug>');
if (!/^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(slug)) fail(`Invalid theme slug: ${slug}`);

const themeDir = path.join(root, 'wp-content', 'themes', slug);
const previewDir = path.join(root, 'docs', 'Preview-Themes-Github', slug);
if (!fs.existsSync(themeDir)) fail(`Theme folder missing: wp-content/themes/${slug}`);

function readStyle(field) {
  const file = path.join(themeDir, 'style.css');
  if (!fs.existsSync(file)) return '';
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(new RegExp(`^${field}:\\s*(.+)$`, 'mi'));
  return match ? match[1].trim() : '';
}

function titleFromSlug(value) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function copyExact(sourceRelative, targetRelative) {
  const source = path.join(themeDir, sourceRelative);
  if (!fs.existsSync(source)) return false;
  const target = path.join(previewDir, targetRelative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  return true;
}

function copyTree(sourceRelative, targetRelative) {
  const source = path.join(themeDir, sourceRelative);
  if (!fs.existsSync(source)) return false;
  const target = path.join(previewDir, targetRelative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
  return true;
}

function routeFromPath(input) {
  const value = String(input || '').replace(/^\/+/, '');
  const [pathPart, anchor] = value.split('#');
  let target = 'homepage_preview.html';
  if (pathPart.startsWith('services/')) target = 'services_preview.html';
  else if (pathPart.startsWith('about/')) target = 'about-us_preview.html';
  else if (pathPart.startsWith('contact/')) target = 'contact_preview.html';
  else if (pathPart.startsWith('work/')) target = 'work_preview.html';
  else if (pathPart.startsWith('blog/')) target = 'blog_preview.html';
  else if (pathPart.startsWith('privacy-policy/') || pathPart.startsWith('terms/')) target = 'policy_preview.html';
  return `${target}${anchor ? `#${anchor}` : ''}`;
}

const themeName = readStyle('Theme Name') || titleFromSlug(slug);
const description = readStyle('Description') || 'Generated WordPress theme preview.';

const pageDefs = [
  { file: 'index.html', label: 'Overview', source: 'front-page.php', fixture: { body_class: 'home page-template-front-page' } },
  { file: 'homepage_preview.html', label: 'Homepage', source: 'front-page.php', fixture: { body_class: 'home page-template-front-page' } },
  { file: 'services_preview.html', label: 'Services', source: 'page-templates/template-services.php', fixture: { body_class: 'page page-template-template-services', title: 'Services' } },
  { file: 'about-us_preview.html', label: 'About', source: 'page-templates/template-about-us.php', fixture: { body_class: 'page page-template-template-about-us', title: 'About Us' } },
  { file: 'contact_preview.html', label: 'Contact', source: 'page-templates/template-contact.php', fixture: { body_class: 'page page-template-template-contact', title: 'Contact' } },
  { file: 'single_services_preview.html', label: 'Single Service', source: 'page-templates/template-single-service.php', fixture: { body_class: 'page page-template-template-single-service', title: 'Custom Theme Development', loop: [{ post_title: 'Custom Theme Development', post_content: '<p>Build maintainable WordPress themes with clean templates, local assets, and practical editor support.</p><p>This preview uses the same theme PHP, CSS, and JavaScript as the generated theme; only the content fixture is synthetic.</p>' }] } },
  { file: 'blog_preview.html', label: 'Blog', source: 'page-templates/template-blog.php', fixture: { body_class: 'page page-template-template-blog', title: 'Blog' } },
  { file: 'work_preview.html', label: 'Work', source: 'page-templates/template-work.php', fixture: { body_class: 'page page-template-template-work', title: 'Work' } },
  { file: 'policy_preview.html', label: 'Policy', source: 'page-templates/template-policy.php', fixture: { body_class: 'page page-template-template-policy', title: 'Policy', loop: [{ post_title: 'Policy', post_content: '<p>Use this template for WordPress-managed policy text that the site owner can review and update without changing the theme.</p><p>It is rendered here with the theme’s actual template structure and stylesheet.</p>' }] } },
];

function phpHarness(themePath, sourceRelative, fixtureJson) {
  return `<?php
$themeDir = $argv[1];
$sourceRelative = $argv[2];
$fixture = json_decode($argv[3], true) ?: array();
$GLOBALS['preview_theme_dir'] = $themeDir;
$GLOBALS['preview_fixture'] = $fixture;
$GLOBALS['preview_loop'] = isset($fixture['loop']) ? array_values($fixture['loop']) : array();
$GLOBALS['preview_loop_index'] = 0;
if (!defined('ABSPATH')) define('ABSPATH', $themeDir . DIRECTORY_SEPARATOR);
function preview_escape_attr($value) { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); }
function esc_html($value) { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); }
function esc_attr($value) { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); }
function esc_url($value) { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); }
function wp_kses_post($value) { return (string) $value; }
function __($text) { return $text; }
function esc_html__($text) { return esc_html($text); }
function esc_attr__($text) { return esc_attr($text); }
function esc_html_e($text) { echo esc_html($text); }
function esc_attr_e($text) { echo esc_attr($text); }
function selected($actual, $expected) { if ((string) $actual === (string) $expected) echo ' selected="selected"'; }
function checked($actual, $expected) { if ((string) $actual === (string) $expected) echo ' checked="checked"'; }
function sanitize_key($value) { return strtolower(preg_replace('/[^a-z0-9_\\-]/', '', (string) $value)); }
function sanitize_text_field($value) { return trim(strip_tags((string) $value)); }
function sanitize_email($value) { return trim((string) $value); }
function sanitize_textarea_field($value) { return trim(strip_tags((string) $value)); }
function wp_unslash($value) { return $value; }
function absint($value) { return abs((int) $value); }
function is_email($value) { return (bool) filter_var($value, FILTER_VALIDATE_EMAIL); }
function current_user_can() { return true; }
function wp_verify_nonce() { return true; }
function wp_nonce_field($action = '', $name = '_wpnonce') { echo '<input type="hidden" name="' . esc_attr($name) . '" value="preview-nonce">'; }
function wp_get_referer() { return home_url('/'); }
function wp_safe_redirect() {}
function wp_mail() {}
function wp_json_encode($value) { return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); }
function get_option($name, $default = false) { return $default; }
function get_transient() { return false; }
function set_transient() { return true; }
function delete_post_meta() {}
function update_post_meta() {}
function wp_insert_post($data) { return 1; }
function wp_delete_post() {}
function get_the_date($format = '', $post = null) { return date('Y-m-d'); }
function date_i18n($format) { return date($format); }
function current_time($type = 'mysql') { return date('Y-m-d H:i:s'); }
function wp_trim_words($text, $num_words = 55) { return implode(' ', array_slice(preg_split('/\\s+/', trim((string) $text)), 0, $num_words)); }
function get_theme_file_uri($path = '') { return ltrim(str_replace('\\\\', '/', (string) $path), '/'); }
function get_theme_file_path($path = '') { return $GLOBALS['preview_theme_dir'] . DIRECTORY_SEPARATOR . ltrim(str_replace('/', DIRECTORY_SEPARATOR, (string) $path), DIRECTORY_SEPARATOR); }
function get_template_directory() { return $GLOBALS['preview_theme_dir']; }
function get_stylesheet_directory() { return $GLOBALS['preview_theme_dir']; }
function get_template_directory_uri() { return ''; }
function get_stylesheet_directory_uri() { return ''; }
function home_url($path = '') {
  $input = (string) $path;
  $route = ltrim($input, '/');
  $anchor = '';
  if (strpos($route, '#') !== false) {
    list($route, $anchor) = explode('#', $route, 2);
  }
  $target = 'homepage_preview.html';
  if ($route === '' || $route === '/') $target = 'homepage_preview.html';
  else if (strpos($route, 'services/') === 0) $target = 'services_preview.html';
  else if (strpos($route, 'about/') === 0) $target = 'about-us_preview.html';
  else if (strpos($route, 'contact/') === 0) $target = 'contact_preview.html';
  else if (strpos($route, 'work/') === 0) $target = 'work_preview.html';
  else if (strpos($route, 'blog/') === 0) $target = 'blog_preview.html';
  else if (strpos($route, 'privacy-policy/') === 0 || strpos($route, 'terms/') === 0) $target = 'policy_preview.html';
  return $target . ($anchor !== '' ? '#' . $anchor : '');
}
function admin_url($path = '') { return ltrim((string) $path, '/'); }
function site_url($path = '') { return home_url($path); }
function bloginfo($show = '') { if ('charset' === $show) echo 'UTF-8'; }
function language_attributes() { echo 'lang="en"'; }
function body_class() { $classes = $GLOBALS['preview_fixture']['body_class'] ?? 'preview'; echo 'class="' . esc_attr($classes) . '"'; }
function wp_body_open() {}
function wp_head() { echo '<link rel="stylesheet" href="assets/css/bundle.css">'; }
function wp_footer() { echo '<script src="assets/js/bundle.js"></script>'; }
function add_action() {}
function add_filter() {}
function register_post_type() {}
function register_nav_menus() {}
function add_theme_support() {}
function load_theme_textdomain() {}
function add_editor_style() {}
function add_menu_page() {}
function get_post_type_archive_link($post_type = '') { return home_url('/' . trim((string) $post_type, '/') . '/'); }
function have_posts() { return isset($GLOBALS['preview_loop']) && $GLOBALS['preview_loop_index'] < count($GLOBALS['preview_loop']); }
function the_post() { global $post; $post = (object) $GLOBALS['preview_loop'][$GLOBALS['preview_loop_index']++]; }
function get_the_title($post = null) {
  if (is_object($post) && isset($post->post_title)) return $post->post_title;
  if (isset($GLOBALS['post']) && is_object($GLOBALS['post'])) return $GLOBALS['post']->post_title ?? ($GLOBALS['preview_fixture']['title'] ?? '');
  return $GLOBALS['preview_fixture']['title'] ?? '';
}
function get_the_ID() { return isset($GLOBALS['post']) && is_object($GLOBALS['post']) && isset($GLOBALS['post']->ID) ? $GLOBALS['post']->ID : 1; }
function the_ID() { echo get_the_ID(); }
function post_class($classes = '') {
  $items = array();
  if (is_string($classes) && $classes !== '') $items[] = $classes;
  if (is_array($classes)) $items = array_merge($items, $classes);
  if (isset($GLOBALS['post']) && is_object($GLOBALS['post']) && isset($GLOBALS['post']->post_type)) $items[] = $GLOBALS['post']->post_type;
  if (empty($items)) $items[] = 'post';
  echo 'class="' . esc_attr(implode(' ', array_values(array_unique(array_filter($items))))) . '"';
}
function get_the_excerpt() { return $GLOBALS['preview_fixture']['excerpt'] ?? wp_trim_words(get_the_content(), 24); }
function the_excerpt() { echo esc_html(get_the_excerpt()); }
function wp_link_pages() {}
function the_title($before = '', $after = '') { echo $before . esc_html(get_the_title()) . $after; }
function get_the_content() { return isset($GLOBALS['post']->post_content) ? $GLOBALS['post']->post_content : ''; }
function the_content() { echo get_the_content(); }
function get_permalink() { return home_url('/'); }
function the_permalink() { echo esc_url(get_permalink()); }
function get_search_query() { return ''; }
function post_password_required() { return false; }
function have_comments() { return false; }
function wp_list_comments() {}
function comment_form() { echo '<form class="comment-form"><p class="comment-form-comment"><label>Comment<textarea rows="4"></textarea></label></p><p><button type="submit">Post Comment</button></p></form>'; }
function get_search_form() { include $GLOBALS['preview_theme_dir'] . DIRECTORY_SEPARATOR . 'searchform.php'; }
function get_header() { include $GLOBALS['preview_theme_dir'] . DIRECTORY_SEPARATOR . 'header.php'; }
function get_footer() { include $GLOBALS['preview_theme_dir'] . DIRECTORY_SEPARATOR . 'footer.php'; }
function get_template_part($slug, $name = '') {
  $base = $GLOBALS['preview_theme_dir'] . DIRECTORY_SEPARATOR . $slug;
  $candidates = $name !== '' ? array($base . '-' . $name . '.php', $base . '.php') : array($base . '.php');
  foreach ($candidates as $candidate) {
    if (file_exists($candidate)) {
      include $candidate;
      return;
    }
  }
}
function locate_template($templates = array()) {
  foreach ((array) $templates as $template) {
    $candidate = $GLOBALS['preview_theme_dir'] . DIRECTORY_SEPARATOR . ltrim($template, '/');
    if (file_exists($candidate)) return $candidate;
  }
  return '';
}
require $themeDir . DIRECTORY_SEPARATOR . 'functions.php';
ob_start();
include $themeDir . DIRECTORY_SEPARATOR . $sourceRelative;
echo ob_get_clean();
?>`;
}

function renderWithPhp(sourceRelative, fixture) {
  const harnessPath = path.join(root, '.tmp-preview-harness.php');
  fs.writeFileSync(harnessPath, phpHarness(themeDir, sourceRelative, JSON.stringify(fixture)));
  const result = spawnSync('php', [harnessPath, themeDir, sourceRelative, JSON.stringify(fixture)], { cwd: root, encoding: 'utf8' });
  fs.rmSync(harnessPath, { force: true });
  if (result.status !== 0) {
    fail(`PHP preview render failed for ${sourceRelative}:\n${result.stderr || result.stdout || 'unknown error'}`);
  }
  return result.stdout;
}

fs.rmSync(previewDir, { recursive: true, force: true });
fs.mkdirSync(path.join(previewDir, 'assets', 'css'), { recursive: true });
fs.mkdirSync(path.join(previewDir, 'assets', 'js'), { recursive: true });
fs.mkdirSync(path.join(previewDir, 'assets', 'images'), { recursive: true });
fs.mkdirSync(path.join(previewDir, 'assets', 'icons'), { recursive: true });

copyExact('assets/css/bundle.css', 'assets/css/bundle.css');
copyExact('assets/js/bundle.js', 'assets/js/bundle.js');
copyExact('assets/css/bundle.css', 'assets/css/preview.css');
copyExact('assets/js/bundle.js', 'assets/js/preview.js');
copyTree('assets/images', 'assets/images');
copyTree('assets/icons', 'assets/icons');

fs.writeFileSync(path.join(previewDir, 'README.md'), `# ${themeName}\n\nStatic preview for ${slug}.\n`);
fs.writeFileSync(path.join(previewDir, 'assets', 'images', 'README.md'), '# Preview Images\n\nPreview pages use the theme’s actual local assets.\n');

for (const page of pageDefs) {
  const html = renderWithPhp(page.source, page.fixture);
  fs.writeFileSync(path.join(previewDir, page.file), html, 'utf8');
}

const nav = pageDefs
  .filter((page) => page.file !== 'index.html' && page.file !== 'policy_preview.html')
  .map((page) => `<a href="${page.file}">${page.label}</a>`)
  .join('');
const indexHtml = pageDefs.map((page) => `<li><a href="${page.file}">${page.label}</a></li>`).join('');
fs.writeFileSync(path.join(previewDir, 'index.html'), renderWithPhp('front-page.php', pageDefs[0].fixture), 'utf8');

console.log(`Generated docs/Preview-Themes-Github/${slug}`);
