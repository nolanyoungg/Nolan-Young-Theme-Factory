#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { root } = require('./lib/repo-root');
const { parseArgs, arg, flag } = require('./lib/args');
const { runCommand } = require('./lib/command-runner');
const { PREVIEW_RUNTIME_WARNING_PATTERN } = require('./lib/constants');
const { assertThemeSlug } = require('./lib/theme-utils');

const args = parseArgs(process.argv.slice(2));
const themeSlug = arg(args, 'theme-slug', args._[0] || '');
const rebuildIndex = flag(args, 'rebuild-index');

function fail(message) {
  throw new Error(message);
}

function escapeHtml(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function readStyle(themeDir, field) {
  const stylePath = path.join(themeDir, 'style.css');
  if (!fs.existsSync(stylePath)) return '';
  const match = fs.readFileSync(stylePath, 'utf8').match(new RegExp(`^${field}:\\s*(.+)$`, 'mi'));
  return match ? match[1].trim() : '';
}

function titleFromSlug(slug) {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function previewDescription(themeDir) {
  const description = readStyle(themeDir, 'Description');
  if (!description) return '';
  if (/^Generated WordPress theme prepared from\b/i.test(description)) return '';
  return description;
}

function copyIfExists(source, target) {
  if (!fs.existsSync(source)) return false;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
  return true;
}

function sleepSync(milliseconds) {
  const shared = new SharedArrayBuffer(4);
  const array = new Int32Array(shared);
  Atomics.wait(array, 0, 0, milliseconds);
}

function retryPreviewFs(label, fn) {
  const retryCodes = new Set(['EPERM', 'EBUSY', 'ENOTEMPTY']);
  let lastError = null;
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    try {
      return fn();
    } catch (error) {
      lastError = error;
      if (!retryCodes.has(error.code) || attempt === 8) break;
      sleepSync(75 * attempt);
    }
  }
  throw new Error(`${label} failed after retries: ${lastError.message}`);
}

function renamePreviewPath(source, target) {
  return retryPreviewFs(`Rename ${path.basename(source)} to ${path.basename(target)}`, () => fs.renameSync(source, target));
}

function removePreviewPath(target) {
  if (!fs.existsSync(target)) return;
  retryPreviewFs(`Remove ${path.basename(target)}`, () => fs.rmSync(target, { recursive: true, force: true }));
}

function copyTemplateBundle(sourceDir, targetDir) {
  fs.cpSync(sourceDir, targetDir, { recursive: true });
}

function rewriteBundleStrings(dir, replacements) {
  const files = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else files.push(full);
    }
  }
  for (const file of files) {
    let text = fs.readFileSync(file, 'utf8');
    for (const [from, to] of replacements) text = text.split(from).join(to);
    fs.writeFileSync(file, text, 'utf8');
  }
}

function phpHarness() {
  return `<?php
$themeDir = $argv[1];
$sourceRelative = $argv[2];
$fixtureTitle = $argv[3] ?? 'Preview';
$siteName = $argv[4] ?? 'Preview Site';
$siteDescription = $argv[5] ?? 'Generated theme preview';
if (!defined('ABSPATH')) define('ABSPATH', $themeDir . DIRECTORY_SEPARATOR);
$GLOBALS['preview_theme_dir'] = $themeDir;
function esc_html($v){return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');}
function esc_attr($v){return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');}
function esc_url($v){return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');}
function esc_html__($t){return esc_html($t);} function esc_attr__($t){return esc_attr($t);} function esc_html_x($t){return esc_html($t);} function esc_attr_x($t){return esc_attr($t);}
function esc_html_e($t){echo esc_html($t);} function esc_attr_e($t){echo esc_attr($t);}
function __($t){return $t;} function _e($t){echo $t;}
function wp_kses_post($v){return (string)$v;} function wp_json_encode($v){return json_encode($v);}
function wpautop($v){return '<p>'.str_replace("\\n\\n", '</p><p>', trim((string)$v)).'</p>';}
function wp_strip_all_tags($v){return trim(strip_tags((string)$v));}
function wp_date($format){return date((string)$format);}
function sanitize_html_class($v){return preg_replace('/[^A-Za-z0-9_-]/', '', (string)$v);}
function sanitize_file_name($v){return preg_replace('/[^A-Za-z0-9._-]/', '', (string)$v);}
function sanitize_title($v){return trim(preg_replace('/[^a-z0-9]+/', '-', strtolower(wp_strip_all_tags((string)$v))), '-');}
function sanitize_text_field($v){return trim(strip_tags((string)$v));}
function sanitize_email($v){return trim((string)$v);} function sanitize_textarea_field($v){return trim(strip_tags((string)$v));}
function sanitize_key($v){return strtolower(preg_replace('/[^a-z0-9_\\-]/','',(string)$v));}
function sanitize_title_with_dashes($v){return trim(preg_replace('/[^a-z0-9]+/','-',strtolower((string)$v)),'-');}
function wp_unslash($v){return $v;} function absint($v){return abs((int)$v);}
function wp_unique_id($prefix=''){static $id_counter=0; return (string)$prefix . ++$id_counter;}
function home_url($p=''){return route_preview($p);} function site_url($p=''){return route_preview($p);}
function admin_url($p=''){return ltrim((string)$p,'/');}
function route_preview($p=''){ $r=ltrim((string)$p,'/'); if(str_starts_with($r,'services'))return 'services_preview.html'; if(str_starts_with($r,'about'))return 'about-us_preview.html'; if(str_starts_with($r,'contact'))return 'contact_preview.html'; if(str_starts_with($r,'work'))return 'work_preview.html'; if(str_starts_with($r,'blog'))return 'blog_preview.html'; return 'homepage_preview.html';}
function preview_fixture_posts($postType='post'){
  $fixtures = array(
    'post' => array(
      (object) array('ID' => 201, 'post_type' => 'post', 'title' => 'Shipping a dependable WordPress foundation', 'excerpt' => 'How structure, naming, and repeatable release discipline improve site quality.', 'permalink' => 'blog_preview.html', 'categories' => array('Engineering', 'WordPress')),
      (object) array('ID' => 202, 'post_type' => 'post', 'title' => 'Design systems for service businesses', 'excerpt' => 'A practical approach to reusable sections, clean hierarchy, and faster editing.', 'permalink' => 'blog_preview.html', 'categories' => array('Design Systems')),
      (object) array('ID' => 203, 'post_type' => 'post', 'title' => 'Accessibility as a product decision', 'excerpt' => 'Why keyboard support, semantics, and clear language have to be handled up front.', 'permalink' => 'blog_preview.html', 'categories' => array('Accessibility')),
      (object) array('ID' => 204, 'post_type' => 'post', 'title' => 'Keeping WordPress sites maintainable', 'excerpt' => 'Patterns that reduce template sprawl and make future changes less risky.', 'permalink' => 'blog_preview.html', 'categories' => array('Maintenance')),
    ),
    'ny_service' => array(
      (object) array('ID' => 301, 'post_type' => 'ny_service', 'title' => 'WordPress strategy', 'excerpt' => 'Audit messaging, content structure, and conversion paths before design starts.', 'permalink' => 'single_services_preview.html'),
      (object) array('ID' => 302, 'post_type' => 'ny_service', 'title' => 'Experience design', 'excerpt' => 'Turn business goals into page systems that are clear, calm, and easy to use.', 'permalink' => 'single_services_preview.html'),
      (object) array('ID' => 303, 'post_type' => 'ny_service', 'title' => 'Theme engineering', 'excerpt' => 'Build maintainable templates, components, and front-end behavior for WordPress.', 'permalink' => 'single_services_preview.html'),
      (object) array('ID' => 304, 'post_type' => 'ny_service', 'title' => 'Performance optimization', 'excerpt' => 'Improve loading speed, asset strategy, and interaction smoothness.', 'permalink' => 'single_services_preview.html'),
      (object) array('ID' => 305, 'post_type' => 'ny_service', 'title' => 'Accessibility remediation', 'excerpt' => 'Resolve navigation, focus, labeling, and semantic issues with practical fixes.', 'permalink' => 'single_services_preview.html'),
      (object) array('ID' => 306, 'post_type' => 'ny_service', 'title' => 'Ongoing maintenance', 'excerpt' => 'Keep releases controlled with updates, QA checks, monitoring, and support.', 'permalink' => 'single_services_preview.html'),
    ),
  );
  return $fixtures[$postType] ?? array();
}
function preview_resolve_post($post=null){
  if (is_object($post)) return $post;
  if (is_numeric($post)) {
    foreach (array_merge(preview_fixture_posts('post'), preview_fixture_posts('ny_service')) as $item) {
      if ((int) $item->ID === (int) $post) return $item;
    }
  }
  return $GLOBALS['preview_current_post'] ?? null;
}
function get_template_directory(){return $GLOBALS['preview_theme_dir'];} function get_stylesheet_directory(){return $GLOBALS['preview_theme_dir'];}
function get_template_directory_uri(){return '.';} function get_stylesheet_directory_uri(){return '.';}
function get_theme_file_uri($p=''){return ltrim((string)$p,'/');} function get_theme_file_path($p=''){return $GLOBALS['preview_theme_dir'].DIRECTORY_SEPARATOR.ltrim(str_replace('/',DIRECTORY_SEPARATOR,(string)$p),DIRECTORY_SEPARATOR);}
function is_front_page(){return true;} function is_home(){return true;} function is_page(){return false;} function is_single(){return false;} function is_singular(){return true;} function is_archive(){return false;} function is_search(){return false;} function is_post_type_archive(){return false;}
function bloginfo($s=''){echo get_bloginfo($s);} function get_bloginfo($s=''){global $siteName,$siteDescription; return ['charset'=>'UTF-8','name'=>$siteName,'description'=>$siteDescription,'stylesheet_url'=>'assets/css/bundle.css'][$s] ?? $siteName;}
function language_attributes(){echo 'lang="en"';} function body_class(){echo 'class="preview"';}
function wp_head(){echo '<link rel="stylesheet" href="assets/css/bundle.css">';} function wp_footer(){echo '<script src="assets/js/bundle.js"></script>';}
function wp_body_open(){} function wp_enqueue_script(){} function wp_enqueue_style(){} function wp_register_script(){} function wp_register_style(){}
function add_action(){} function add_filter(){} function add_theme_support(){} function register_nav_menus(){} function register_post_type(){} function apply_filters($tag,$value){return $value;}
function wp_nav_menu($args=array()){
  $args = is_array($args) ? $args : array();
  $menuId = isset($args['menu_id']) ? $args['menu_id'] : 'primary-menu';
  $menuClass = isset($args['menu_class']) ? $args['menu_class'] : 'menu';
  $walker = isset($args['walker']) ? $args['walker'] : new Walker_Nav_Menu();
  $items = array(
    (object) array('ID' => 101, 'title' => 'Services', 'url' => 'services_preview.html', 'classes' => array('menu-item', 'nytt01-mega-services')),
    (object) array('ID' => 102, 'title' => 'About', 'url' => 'about-us_preview.html', 'classes' => array('menu-item', 'nytt01-mega-about')),
    (object) array('ID' => 103, 'title' => 'Work', 'url' => 'work_preview.html', 'classes' => array('menu-item')),
    (object) array('ID' => 104, 'title' => 'Blog', 'url' => 'blog_preview.html', 'classes' => array('menu-item', 'nytt01-mega-blog')),
  );
  $output = '<ul id="' . esc_attr($menuId) . '" class="' . esc_attr($menuClass) . '">';
  foreach ($items as $item) {
    if (is_object($walker) && method_exists($walker, 'start_el')) {
      $walker->start_el($output, $item, 0, (object) $args, 0);
    }
  }
  $output .= '</ul>';
  echo $output;
}
function the_custom_logo(){} function has_custom_logo(){return false;}
function get_search_form(){include $GLOBALS['preview_theme_dir'].DIRECTORY_SEPARATOR.'searchform.php';}
function get_header(){include $GLOBALS['preview_theme_dir'].DIRECTORY_SEPARATOR.'header.php';}
function get_footer(){include $GLOBALS['preview_theme_dir'].DIRECTORY_SEPARATOR.'footer.php';}
function get_template_part($slug,$name='',$args=array()){ $base=$GLOBALS['preview_theme_dir'].DIRECTORY_SEPARATOR.$slug; foreach(($name!==''?[$base.'-'.$name.'.php',$base.'.php']:[$base.'.php']) as $f){ if(file_exists($f)){ $args = is_array($args) ? $args : array(); include $f; return;}}}
function locate_template($templates=[]){foreach((array)$templates as $t){$f=$GLOBALS['preview_theme_dir'].DIRECTORY_SEPARATOR.ltrim($t,'/'); if(file_exists($f)) return $f;} return '';}
function have_posts(){static $done=false; if($done) return false; $done=true; return true;} function the_post(){}
function the_title($before='',$after=''){echo $before . esc_html(get_the_title()) . $after;}
function preview_fixture_content(){
  global $fixtureTitle;
  $map = array(
    'About Us' => 'Nolan Young Design Systems combines strategy, interface design, and WordPress engineering for service teams that need a site they can keep improving after launch.',
    'Services' => 'Explore focused services for planning, designing, building, validating, and maintaining a production-ready WordPress presence.',
    'Work' => 'Review selected thinking and project notes that show how structure, accessibility, and release discipline improve the final site.',
    'Blog' => 'Read practical notes on WordPress delivery, design systems, accessibility, performance, and maintainable content operations.',
    'Contact' => 'Share your project goals, constraints, timeline, and current site context so the next step can be scoped clearly.',
    'Privacy Policy' => 'This preview policy page demonstrates the theme typography, spacing, and long-form content treatment for trust and compliance pages.',
    'Service' => 'This service preview shows how individual capabilities can be presented with clear outcomes, delivery details, and next-step calls to action.',
  );
  return $map[$fixtureTitle] ?? 'A focused preview page with real layout content for evaluating hierarchy, spacing, and template behavior.';
}
function get_the_title($post=null){ $resolved = preview_resolve_post($post); global $fixtureTitle; return $resolved && !empty($resolved->title) ? $resolved->title : $fixtureTitle; } function the_content(){echo wpautop(get_the_content());}
function get_the_content(){return preview_fixture_content();} function get_the_excerpt($post=null){ $resolved = preview_resolve_post($post); return $resolved && !empty($resolved->excerpt) ? $resolved->excerpt : 'Preview fixture excerpt.'; } function the_excerpt(){echo esc_html(get_the_excerpt());}
function wp_trim_words($t,$n=55){return implode(' ', array_slice(preg_split('/\\s+/', trim((string)$t)),0,$n));}
function the_permalink(){echo esc_url(get_permalink());} function get_permalink($post=null){ $resolved = preview_resolve_post($post); return $resolved && !empty($resolved->permalink) ? $resolved->permalink : 'homepage_preview.html';}
function post_class($c=''){echo 'class="'.esc_attr($c).'"';} function get_the_date($format='Y-m-d'){return date((string)$format);} function get_the_modified_date($format='Y-m-d'){return date((string)$format);}
function wp_link_pages($args=[]){}
function date_i18n($format){return date($format);} function current_time($type='mysql'){return date('Y-m-d H:i:s');} function get_the_time($format='U'){return $format === 'U' ? time() : date((string)$format);} function get_the_modified_time($format='U'){return $format === 'U' ? time() : date((string)$format);}
function get_the_archive_title(){global $fixtureTitle; return $fixtureTitle;}
function post_type_archive_title($prefix='',$display=true){global $fixtureTitle; $value = $prefix . $fixtureTitle; if($display) echo esc_html($value); return $value;}
function the_archive_title($before='',$after=''){global $fixtureTitle; echo $before.esc_html($fixtureTitle).$after;}
function get_the_archive_description(){return 'Preview archive description.';}
function comments_open(){return false;} function have_comments(){return false;} function get_comments_number(){return 0;} function post_password_required(){return false;} function wp_list_comments(){} function comment_form(){echo '<form class="comment-form"></form>';}
function comments_template(){echo '<section class="comments-area"></section>';} function the_post_navigation(){echo '<nav class="post-navigation"></nav>';}
function do_shortcode(){return '<form class="contact-form-preview"></form>';} function shortcode_exists(){return true;} function wp_nonce_field(){} function wp_verify_nonce(){return true;} function wp_mail(){return true;}
function get_option($n,$d=false){return $d;} function current_user_can(){return true;} function wp_safe_redirect(){} function is_email($v){return true;}
function get_theme_mod($n,$d=false){return $d;} function selected($s,$c=true,$e=true){$r=((string)$s===(string)$c)?' selected="selected"':''; if($e)echo $r; return $r;}
function checked($s,$c=true,$e=true){$r=((string)$s===(string)$c)?' checked="checked"':''; if($e)echo $r; return $r;}
function get_posts($a=[]){ $postType = isset($a['post_type']) ? (string) $a['post_type'] : 'post'; $posts = preview_fixture_posts($postType); if (isset($a['posts_per_page']) && is_numeric($a['posts_per_page']) && (int) $a['posts_per_page'] > -1) $posts = array_slice($posts, 0, (int) $a['posts_per_page']); return $posts; } function wp_get_recent_posts($a=[],$output='ARRAY_A'){ $posts = get_posts(['post_type' => $a['post_type'] ?? 'post', 'posts_per_page' => $a['numberposts'] ?? $a['posts_per_page'] ?? 5]); return array_map(function($post){ return ['ID' => $post->ID ?? 0, 'post_title' => $post->title ?? '', 'post_excerpt' => $post->excerpt ?? '', 'post_type' => $post->post_type ?? 'post']; }, $posts); } function get_post_type($post=null){ $resolved = preview_resolve_post($post); return $resolved && !empty($resolved->post_type) ? $resolved->post_type : 'post'; } function post_type_exists($type){ return in_array((string) $type, array('post', 'ny_service'), true); } function get_post_type_object($type){return (object) ['labels' => (object) ['singular_name' => ucfirst(str_replace('_', ' ', (string) $type))]];} function post_type_supports($type,$feature){return false;} function pings_open(){return false;}
class WP_Query{public $posts = []; public $post_count = 0; private $index = -1; public function __construct($a=[]){$this->posts = get_posts($a); $this->post_count = count($this->posts);} public function have_posts(){return ($this->index + 1) < $this->post_count;} public function the_post(){ $this->index++; if(isset($this->posts[$this->index])) $GLOBALS['preview_current_post'] = $this->posts[$this->index]; }}
class Walker_Nav_Menu { public function start_el(&$output, $menu_item, $depth = 0, $args = null, $id = 0) { $classes = array_filter((array) ($menu_item->classes ?? array())); $output .= '<li' . ($classes ? ' class="' . esc_attr(implode(' ', $classes)) . '"' : '') . '><a href="' . esc_url($menu_item->url ?? '#') . '">' . esc_html($menu_item->title ?? '') . '</a></li>'; } }
function setup_postdata($post=null){ if($post) $GLOBALS['preview_current_post'] = $post; } function wp_reset_postdata(){ $GLOBALS['preview_current_post'] = null; }
function wp_get_attachment_image(){return '';} function has_post_thumbnail($post=null){return false;} function the_post_thumbnail($size='post-thumbnail'){echo '';} function get_the_post_thumbnail_url($post=null,$size='post-thumbnail'){return '';} function get_the_ID(){ $post = preview_resolve_post(); return $post && isset($post->ID) ? (int) $post->ID : 0; } function the_ID(){ echo (int) get_the_ID(); } function get_post_meta($id,$k='',$single=false){return $single?'':[];}
function register_sidebar(){} function dynamic_sidebar(){return false;} function is_active_sidebar(){return false;} function paginate_links(){return '';}
function get_search_query(){return '';} function the_posts_pagination(){} function add_menu_page(){} function add_submenu_page(){}
function get_post_field($field,$id){return '';} function wp_parse_url($url,$component=-1){return parse_url((string)$url,$component);}
function get_the_category_list($sep=', '){ $post = preview_resolve_post(); return $post && !empty($post->categories) ? implode($sep, $post->categories) : 'Category'; } function get_the_tag_list($before='',$sep=', ',$after=''){ return ''; } function get_author_posts_url($id){ return 'blog_preview.html'; } function get_the_author_meta($field){ return $field === 'ID' ? 1 : 'Preview Author'; } function get_the_author(){ return 'Preview Author'; } function the_category($sep=', '){ echo esc_html(get_the_category_list($sep)); } function comments_popup_link($zero='',$one='',$more='',$css='',$none=false){return $zero ?: 'Leave a comment';} function edit_post_link($text='',$before='',$after=''){} function has_nav_menu($location){return true;} function get_nav_menu_locations(){return ['primary' => 1];} function wp_get_nav_menu_items($menu){return [];} function get_queried_object(){return (object) ['name' => 'Preview'];} function get_post_type_archive_link($type){return 'services_preview.html';}
require $themeDir . DIRECTORY_SEPARATOR . 'functions.php';
ob_start();
include $themeDir . DIRECTORY_SEPARATOR . $sourceRelative;
echo ob_get_clean();
?>`;
}

function renderWithPhp(themeDir, sourceRelative, title) {
  if (!fs.existsSync(path.join(themeDir, sourceRelative))) fail(`Preview source missing: ${sourceRelative}`);
  const harnessPath = path.join(os.tmpdir(), `theme-preview-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.php`);
  fs.writeFileSync(harnessPath, phpHarness(), 'utf8');
  const siteName = 'Nolan Young Designs';
  const siteDescription = previewDescription(themeDir) || 'Independent WordPress design engineering.';
  const result = runCommand('php', [harnessPath, themeDir, sourceRelative, title, siteName, siteDescription], { cwd: root, echo: false });
  fs.rmSync(harnessPath, { force: true });
  if (result.status !== 0) fail(`PHP preview render failed for ${sourceRelative}: ${result.stderr || result.stdout || result.error}`);
  if (PREVIEW_RUNTIME_WARNING_PATTERN.test(result.stdout)) fail(`PHP preview render produced warning output for ${sourceRelative}: ${result.stdout}`);
  return result.stdout;
}

function renderPreviewPage(themeDir, sourceRelative, title) {
  if (runCommand('php', ['-v'], { echo: false }).status !== 0) {
    fail('php command is required for preview rendering.');
  }
  return renderWithPhp(themeDir, sourceRelative, title);
}

function copyThemeAssets(themeDir, previewDir) {
  const assetsDir = path.join(themeDir, 'assets');
  if (!fs.existsSync(assetsDir)) fail('Theme assets folder missing; build must run before preview generation.');
  fs.cpSync(assetsDir, path.join(previewDir, 'assets'), { recursive: true });
}

function writePreviewFile(previewDir, filename, html) {
  fs.mkdirSync(previewDir, { recursive: true });
  fs.writeFileSync(path.join(previewDir, filename), html, 'utf8');
}

function generateRenderedPreview(themeDir, previewDir) {
  copyThemeAssets(themeDir, previewDir);

  const firstExisting = (...candidates) => candidates.find((relative) => fs.existsSync(path.join(themeDir, relative)));
  const renderedPages = [
    { output: 'index.html', source: 'front-page.php', title: 'Home' },
    { output: 'homepage_preview.html', source: 'front-page.php', title: 'Home' },
    { output: 'about-us_preview.html', source: firstExisting('page-templates/template-about-us.php', 'page.php'), title: 'About Us' },
    { output: 'work_preview.html', source: firstExisting('page-templates/template-work.php', 'page.php'), title: 'Work' },
    { output: 'blog_preview.html', source: firstExisting('page-templates/template-blog.php', 'page-templates/template-blog-landing.php', 'home.php', 'page.php'), title: 'Blog' },
    { output: 'contact_preview.html', source: firstExisting('page-templates/template-contact.php', 'page.php'), title: 'Contact' },
    { output: 'services_preview.html', source: firstExisting('page-templates/template-services.php', 'archive-ny_service.php', 'page.php'), title: 'Services' },
    { output: 'policy_preview.html', source: firstExisting('page-templates/template-policy.php', 'privacy-policy.php', 'page.php'), title: 'Privacy Policy' },
    { output: 'single_services_preview.html', source: firstExisting('page-templates/template-service-detail.php', 'page-templates/template-single-service.php', 'single-ny_service.php', 'single.php'), title: 'Service' }
  ];

  for (const page of renderedPages) {
    writePreviewFile(previewDir, page.output, renderPreviewPage(themeDir, page.source, page.title));
  }

  const previewName = readStyle(themeDir, 'Theme Name') || titleFromSlug(path.basename(themeDir));
  const readme = `# ${previewName}

Rendered preview for ${path.basename(themeDir)} generated from the current theme source.
`;
  fs.writeFileSync(path.join(previewDir, 'README.md'), readme, 'utf8');
}

function generatePreview(options = {}) {
  const slug = assertThemeSlug(options.themeSlug || themeSlug);
  const themeDir = path.join(root, 'wp-content', 'themes', slug);
  const previewDir = path.join(root, 'docs', 'Preview-Themes-Github', slug);
  const candidateDir = path.join(root, 'docs', 'Preview-Themes-Github', `.${slug}.candidate-${process.pid}-${Date.now()}`);
  const backupDir = path.join(root, 'docs', 'Preview-Themes-Github', `.${slug}.backup-${process.pid}-${Date.now()}`);
  if (!fs.existsSync(themeDir)) fail(`Theme folder missing: wp-content/themes/${slug}`);
  removePreviewPath(candidateDir);
  fs.mkdirSync(candidateDir, { recursive: true });
  generateRenderedPreview(themeDir, candidateDir);
  if (fs.existsSync(previewDir)) renamePreviewPath(previewDir, backupDir);
  try {
    renamePreviewPath(candidateDir, previewDir);
  } catch (error) {
    removePreviewPath(previewDir);
    if (fs.existsSync(backupDir)) renamePreviewPath(backupDir, previewDir);
    throw error;
  }
  removePreviewPath(backupDir);
  console.log(`Generated docs/Preview-Themes-Github/${slug}`);
  return { passed: true, status: 0, preview_dir: previewDir, transactional: true };
}

function listSlugs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).filter((name) => /^[0-9]{3}_nolan_young_theme_[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(name));
}

function rebuildPreviewGallery() {
  const docsDir = path.join(root, 'docs');
  const previewRoot = path.join(docsDir, 'Preview-Themes-Github');
  const themesRoot = path.join(root, 'wp-content', 'themes');
  const zipRoot = path.join(root, 'dist', 'zipped-themes');
  fs.mkdirSync(previewRoot, { recursive: true });
  const slugs = listSlugs(previewRoot).filter((slug) => fs.existsSync(path.join(previewRoot, slug, 'index.html'))).sort();
  const cards = slugs.map((slug) => {
    const themeDir = path.join(themesRoot, slug);
    const title = readStyle(themeDir, 'Theme Name') || titleFromSlug(slug);
    const description = previewDescription(themeDir) || 'Generated WordPress theme preview.';
    const zip = fs.existsSync(path.join(zipRoot, `${slug}.zip`)) ? 'ZIP ready' : 'ZIP missing';
    return `<article class="theme-card"><div class="theme-card__preview"><iframe title="${escapeHtml(title)} preview" src="Preview-Themes-Github/${escapeHtml(slug)}/index.html" loading="lazy"></iframe></div><div class="theme-card__body"><p class="eyebrow">${escapeHtml(slug)}</p><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p><div class="tag-row"><span>${escapeHtml(zip)}</span></div><div class="status-row"><span class="status-pill is-ok">Published preview</span></div><a class="open-preview" href="Preview-Themes-Github/${escapeHtml(slug)}/homepage_preview.html">Open Preview</a></div></article>`;
  }).join('\n');
  const emptyState = '<section class="empty-state" data-empty-state><div class="theme-card__body"><p class="eyebrow">Gallery empty</p><h3>No previews available</h3><p>Generate a theme to populate this gallery.</p></div></section>';
  fs.writeFileSync(path.join(docsDir, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Nolan Young Theme Preview Gallery</title><link rel="stylesheet" href="assets/css/gallery.css"></head>
<body><header class="site-header"><p class="eyebrow">Generated outputs</p><h1>Preview Themes</h1><p class="lede">Generated WordPress theme previews.</p></header><main class="theme-grid" data-theme-grid>${cards || emptyState}</main><footer class="site-footer"><p>Preview gallery rebuilt from the current repository inventory.</p></footer><script src="assets/js/gallery.js" defer></script></body></html>
`, 'utf8');
  console.log(`Rebuilt docs/index.html with ${slugs.length} preview(s).`);
  return { passed: true, status: 0, count: slugs.length };
}

async function previewTheme(options = {}) {
  let preview = null;
  if (options.themeSlug || themeSlug) preview = generatePreview({ themeSlug: options.themeSlug || themeSlug });
  let index = null;
  if (options.rebuildIndex || rebuildIndex) index = rebuildPreviewGallery();
  return { passed: true, status: 0, preview, index };
}

if (require.main === module) {
  if (!themeSlug && !rebuildIndex) {
    console.error('Usage: node scripts/preview-theme.js --theme-slug <slug> [--rebuild-index]');
    process.exit(1);
  }
  previewTheme().catch((error) => {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { generatePreview, rebuildPreviewGallery, previewTheme };
