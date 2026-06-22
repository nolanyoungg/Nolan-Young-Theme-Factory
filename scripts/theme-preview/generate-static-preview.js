#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { root } = require('../shared/repo-root');
const { parseArgs, arg } = require('../shared/args');
const { runCommand } = require('../shared/command-runner');
const { assertThemeSlug } = require('../shared/theme-utils');
const { PREVIEW_RUNTIME_WARNING_PATTERN } = require('../shared/constants');

const args = parseArgs(process.argv.slice(2));
const [positionalSlug] = args._;
const slug = arg(args, 'theme-slug', positionalSlug || '');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!slug) fail('Usage: node scripts/theme-preview/generate-static-preview.js --theme-slug <theme-slug>');
assertThemeSlug(slug);

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
function preview_sample_posts() {
  return array(
    (object) array(
      'ID' => 21,
      'post_title' => 'Planning a Higher-Converting Homepage',
      'post_content' => '<p>A clear page structure, useful service proof, and focused calls to action help visitors understand the next step.</p>',
      'post_excerpt' => 'A clear structure and focused copy can make a homepage do more work.',
      'post_name' => 'planning-a-higher-converting-homepage',
      'post_type' => 'post'
    ),
    (object) array(
      'ID' => 22,
      'post_title' => 'Why Local Theme Assets Matter',
      'post_content' => '<p>Keeping images, scripts, and styles bundled with the theme makes previews and deployments predictable.</p>',
      'post_excerpt' => 'Keeping assets bundled with the theme makes previews and deployments predictable.',
      'post_name' => 'why-local-theme-assets-matter',
      'post_type' => 'post'
    ),
    (object) array(
      'ID' => 23,
      'post_title' => 'Keeping WordPress Builds Maintainable',
      'post_content' => '<p>Reusable templates, source SCSS, and small JavaScript modules make a WordPress site easier to improve over time.</p>',
      'post_excerpt' => 'Practical guidance for teams that need maintainable themes and faster delivery.',
      'post_name' => 'keeping-wordpress-builds-maintainable',
      'post_type' => 'post'
    )
  );
}
function preview_post_array($post) {
  return array(
    'ID' => $post->ID ?? 1,
    'post_title' => $post->post_title ?? '',
    'post_content' => $post->post_content ?? '',
    'post_excerpt' => $post->post_excerpt ?? '',
    'post_name' => $post->post_name ?? sanitize_title_with_dashes($post->post_title ?? ''),
    'post_type' => $post->post_type ?? 'post'
  );
}
function preview_escape_attr($value) { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); }
function esc_html($value) { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); }
function esc_attr($value) { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); }
function esc_url($value) { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); }
function wp_kses_post($value) { return (string) $value; }
function wpautop($value) {
  $text = trim((string) $value);
  if ($text === '') return '';
  if (preg_match('/<p[\\s>]|<div[\\s>]|<section[\\s>]/i', $text)) return $text;
  $paragraphs = preg_split('/\\n\\s*\\n/', $text);
  return '<p>' . implode('</p><p>', array_map('trim', $paragraphs)) . '</p>';
}
function __($text) { return $text; }
function _e($text) { echo $text; }
function _x($text) { return $text; }
function esc_html__($text) { return esc_html($text); }
function esc_html_x($text) { return esc_html($text); }
function esc_attr__($text) { return esc_attr($text); }
function esc_attr_x($text) { return esc_attr($text); }
function esc_html_e($text) { echo esc_html($text); }
function esc_attr_e($text) { echo esc_attr($text); }
function selected($actual, $expected) { if ((string) $actual === (string) $expected) echo ' selected="selected"'; }
function checked($actual, $expected) { if ((string) $actual === (string) $expected) echo ' checked="checked"'; }
function sanitize_key($value) { return strtolower(preg_replace('/[^a-z0-9_\\-]/', '', (string) $value)); }
function sanitize_title_with_dashes($value) { return trim(preg_replace('/[^a-z0-9]+/', '-', strtolower((string) $value)), '-'); }
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
function get_post_meta($post_id = 0, $key = '', $single = false) { return $single ? '' : array(); }
function get_posts($args = array()) { return array_map('preview_post_array', preview_sample_posts()); }
function wp_get_attachment_image($attachment_id = 0, $size = 'thumbnail', $icon = false, $attr = array()) { return '<img src="assets/images/placeholder.svg" alt="Preview image">'; }
function get_the_date($format = '', $post = null) { return date('Y-m-d'); }
function date_i18n($format) { return date($format); }
function current_time($type = 'mysql') { return date('Y-m-d H:i:s'); }
function wp_trim_words($text, $num_words = 55) { return implode(' ', array_slice(preg_split('/\\s+/', trim((string) $text)), 0, $num_words)); }
function get_theme_file_uri($path = '') { return ltrim(str_replace('\\\\', '/', (string) $path), '/'); }
function get_theme_file_path($path = '') { return $GLOBALS['preview_theme_dir'] . DIRECTORY_SEPARATOR . ltrim(str_replace('/', DIRECTORY_SEPARATOR, (string) $path), DIRECTORY_SEPARATOR); }
function get_template_directory() { return $GLOBALS['preview_theme_dir']; }
function get_stylesheet_directory() { return $GLOBALS['preview_theme_dir']; }
function get_template_directory_uri() { return '.'; }
function get_stylesheet_directory_uri() { return '.'; }
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
function get_bloginfo($show = '', $filter = 'raw') {
  $values = array(
    'charset' => 'UTF-8',
    'description' => 'Premium websites and digital systems for growing brands.',
    'name' => 'Northstar Websites',
    'template_url' => '',
    'stylesheet_url' => 'assets/css/bundle.css',
    'url' => 'homepage_preview.html',
    'wpurl' => 'homepage_preview.html',
  );
  return $values[$show] ?? ($show === '' ? $values['name'] : '');
}
function bloginfo($show = '') { echo get_bloginfo($show); }
function the_custom_logo() { echo '<span class="custom-logo-link"><img src="assets/icons/icon1.svg" alt="Northstar Websites logo"></span>'; }
function language_attributes() { echo 'lang="en"'; }
function body_class() { $classes = $GLOBALS['preview_fixture']['body_class'] ?? 'preview'; echo 'class="' . esc_attr($classes) . '"'; }
function wp_body_open() {}
function wp_head() { echo '<link rel="stylesheet" href="assets/css/bundle.css">'; }
function wp_footer() { echo '<script src="assets/js/bundle.js"></script>'; }
function wp_enqueue_script() {}
function wp_enqueue_style() {}
function wp_register_script() {}
function wp_register_style() {}
function wp_add_inline_script() {}
function wp_add_inline_style() {}
function wp_localize_script() {}
function wp_get_theme() {
  return new class {
    public function get($field = '') { return '1.0.0'; }
  };
}
function add_action() {}
function add_filter() {}
function register_post_type() {}
function register_nav_menus() {}
function add_theme_support() {}
function load_theme_textdomain() {}
function add_editor_style() {}
function add_menu_page() {}
class WP_Query {
  public $posts = array();
  public $current_post = -1;
  public $post = null;

  public function __construct($args = array()) {
    $sample_posts = preview_sample_posts();
    $this->posts = isset($GLOBALS['preview_fixture']['loop']) && is_array($GLOBALS['preview_fixture']['loop']) && count($GLOBALS['preview_fixture']['loop']) > 0
      ? array_values($GLOBALS['preview_fixture']['loop'])
      : $sample_posts;
  }

  public function have_posts() {
    return ($this->current_post + 1) < count($this->posts);
  }

  public function the_post() {
    $this->current_post += 1;
    $this->post = $this->posts[$this->current_post];
    $GLOBALS['post'] = $this->post;
  }
}
function wp_reset_query() { $GLOBALS['post'] = null; }
function wp_reset_postdata() { $GLOBALS['post'] = null; }
function has_post_thumbnail() { return false; }
function the_post_thumbnail($size = 'thumbnail') { echo '<img src="assets/images/placeholder.svg" alt="Preview thumbnail">'; }
function get_categories() {
  return array(
    (object) array('term_id' => 1, 'name' => 'Insights'),
    (object) array('term_id' => 2, 'name' => 'Strategy'),
    (object) array('term_id' => 3, 'name' => 'Development'),
  );
}
function get_pages($args = array()) {
  return array(
    (object) array('ID' => 11, 'post_title' => 'Website Strategy'),
    (object) array('ID' => 12, 'post_title' => 'Custom Theme Development'),
    (object) array('ID' => 13, 'post_title' => 'Care and Optimization'),
  );
}
function wp_get_recent_posts($args = array()) {
  return array_map('preview_post_array', preview_sample_posts());
}
function get_category_link($term_id = 0) { return home_url('/category/' . absint($term_id) . '/'); }
function the_posts_pagination() { echo '<nav class="pagination"><a href="#">1</a><a href="#">2</a><a href="#">Next</a></nav>'; }
function the_posts_navigation() { echo '<nav class="posts-navigation"><a href="#">Older posts</a><a href="#">Newer posts</a></nav>'; }
function wp_nav_menu($args = array()) {
  echo '<ul id="primary-menu" class="menu"><li><a href="services_preview.html">Services</a></li><li><a href="about-us_preview.html">About</a></li><li><a href="work_preview.html">Work</a></li><li><a href="blog_preview.html">Blog</a></li></ul>';
}
function dynamic_sidebar($index = 1) {
  echo '<div class="preview-widget preview-widget-' . esc_attr($index) . '"><h3>Widget Area ' . esc_html($index) . '</h3><p>Preview widget content rendered by the static preview harness.</p></div>';
  return true;
}
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
function get_permalink($post = null) {
  if (is_array($post) && isset($post['post_name'])) return home_url('/blog/' . $post['post_name'] . '/');
  if (is_object($post) && isset($post->post_name)) return home_url('/blog/' . $post->post_name . '/');
  if (isset($GLOBALS['post']) && is_object($GLOBALS['post']) && isset($GLOBALS['post']->post_name)) return home_url('/blog/' . $GLOBALS['post']->post_name . '/');
  return home_url('/');
}
function get_the_permalink($post = null) { return get_permalink($post); }
function the_permalink() { echo esc_url(get_permalink()); }
function get_the_post_thumbnail_url($post = null, $size = 'post-thumbnail') { return 'assets/images/placeholder.svg'; }
function get_search_query() { return ''; }
function post_password_required() { return false; }
function have_comments() { return false; }
function wp_list_comments() {}
function comment_form() { echo '<form class="comment-form"><p class="comment-form-comment"><label>Comment<textarea rows="4"></textarea></label></p><p><button type="submit">Post Comment</button></p></form>'; }
function do_shortcode($shortcode = '') { return '<form class="contact-form-preview"><label>Name<input type="text"></label><label>Email<input type="email"></label><label>Message<textarea rows="4"></textarea></label><button type="submit">Send</button></form>'; }
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
  const harnessPath = path.join(os.tmpdir(), `theme-preview-harness-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.php`);
  fs.writeFileSync(harnessPath, phpHarness(themeDir, sourceRelative, JSON.stringify(fixture)));
  const result = runCommand('php', [harnessPath, themeDir, sourceRelative, JSON.stringify(fixture)], { cwd: root, echo: false });
  fs.rmSync(harnessPath, { force: true });
  if (result.status !== 0) {
    fail(`PHP preview render failed for ${sourceRelative}:\n${result.stderr || result.stdout || 'unknown error'}`);
  }
  if (PREVIEW_RUNTIME_WARNING_PATTERN.test(result.stdout)) {
    fail(`PHP preview render produced warning output for ${sourceRelative}. Run validation for details.`);
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
