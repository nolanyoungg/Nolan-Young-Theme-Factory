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

function copyIfExists(source, target) {
  if (!fs.existsSync(source)) return false;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
  return true;
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
if (!defined('ABSPATH')) define('ABSPATH', $themeDir . DIRECTORY_SEPARATOR);
$GLOBALS['preview_theme_dir'] = $themeDir;
function esc_html($v){return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');}
function esc_attr($v){return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');}
function esc_url($v){return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');}
function esc_html__($t){return esc_html($t);} function esc_attr__($t){return esc_attr($t);}
function esc_html_e($t){echo esc_html($t);} function esc_attr_e($t){echo esc_attr($t);}
function __($t){return $t;} function _e($t){echo $t;}
function wp_kses_post($v){return (string)$v;} function wp_json_encode($v){return json_encode($v);}
function wpautop($v){return '<p>'.str_replace("\\n\\n", '</p><p>', trim((string)$v)).'</p>';}
function sanitize_text_field($v){return trim(strip_tags((string)$v));}
function sanitize_email($v){return trim((string)$v);} function sanitize_textarea_field($v){return trim(strip_tags((string)$v));}
function sanitize_key($v){return strtolower(preg_replace('/[^a-z0-9_\\-]/','',(string)$v));}
function sanitize_title_with_dashes($v){return trim(preg_replace('/[^a-z0-9]+/','-',strtolower((string)$v)),'-');}
function wp_unslash($v){return $v;} function absint($v){return abs((int)$v);}
function home_url($p=''){return route_preview($p);} function site_url($p=''){return route_preview($p);}
function admin_url($p=''){return ltrim((string)$p,'/');}
function route_preview($p=''){ $r=ltrim((string)$p,'/'); if(str_starts_with($r,'services'))return 'services_preview.html'; if(str_starts_with($r,'about'))return 'about-us_preview.html'; if(str_starts_with($r,'contact'))return 'contact_preview.html'; if(str_starts_with($r,'work'))return 'work_preview.html'; if(str_starts_with($r,'blog'))return 'blog_preview.html'; return 'homepage_preview.html';}
function get_template_directory(){return $GLOBALS['preview_theme_dir'];} function get_stylesheet_directory(){return $GLOBALS['preview_theme_dir'];}
function get_template_directory_uri(){return '.';} function get_stylesheet_directory_uri(){return '.';}
function get_theme_file_uri($p=''){return ltrim((string)$p,'/');} function get_theme_file_path($p=''){return $GLOBALS['preview_theme_dir'].DIRECTORY_SEPARATOR.ltrim(str_replace('/',DIRECTORY_SEPARATOR,(string)$p),DIRECTORY_SEPARATOR);}
function bloginfo($s=''){echo get_bloginfo($s);} function get_bloginfo($s=''){return ['charset'=>'UTF-8','name'=>'Preview Site','description'=>'Generated theme preview','stylesheet_url'=>'assets/css/bundle.css'][$s] ?? 'Preview Site';}
function language_attributes(){echo 'lang="en"';} function body_class(){echo 'class="preview"';}
function wp_head(){echo '<link rel="stylesheet" href="assets/css/bundle.css">';} function wp_footer(){echo '<script src="assets/js/bundle.js"></script>';}
function wp_body_open(){} function wp_enqueue_script(){} function wp_enqueue_style(){} function wp_register_script(){} function wp_register_style(){}
function add_action(){} function add_filter(){} function add_theme_support(){} function register_nav_menus(){} function register_post_type(){}
function wp_nav_menu(){echo '<ul class="menu"><li><a href="services_preview.html">Services</a></li><li><a href="about-us_preview.html">About</a></li><li><a href="contact_preview.html">Contact</a></li></ul>';}
function the_custom_logo(){} function has_custom_logo(){return false;}
function get_search_form(){include $GLOBALS['preview_theme_dir'].DIRECTORY_SEPARATOR.'searchform.php';}
function get_header(){include $GLOBALS['preview_theme_dir'].DIRECTORY_SEPARATOR.'header.php';}
function get_footer(){include $GLOBALS['preview_theme_dir'].DIRECTORY_SEPARATOR.'footer.php';}
function get_template_part($slug,$name=''){ $base=$GLOBALS['preview_theme_dir'].DIRECTORY_SEPARATOR.$slug; foreach(($name!==''?[$base.'-'.$name.'.php',$base.'.php']:[$base.'.php']) as $f){ if(file_exists($f)){include $f; return;}}}
function locate_template($templates=[]){foreach((array)$templates as $t){$f=$GLOBALS['preview_theme_dir'].DIRECTORY_SEPARATOR.ltrim($t,'/'); if(file_exists($f)) return $f;} return '';}
function have_posts(){static $done=false; if($done) return false; $done=true; return true;} function the_post(){}
function the_title($before='',$after=''){global $fixtureTitle; echo $before.esc_html($fixtureTitle).$after;}
function get_the_title(){global $fixtureTitle; return $fixtureTitle;} function the_content(){echo '<p>Preview fixture content rendered through the generated template.</p>';}
function get_the_content(){return 'Preview fixture content rendered through the generated template.';} function get_the_excerpt(){return 'Preview fixture excerpt.';}
function wp_trim_words($t,$n=55){return implode(' ', array_slice(preg_split('/\\s+/', trim((string)$t)),0,$n));}
function the_permalink(){echo esc_url(get_permalink());} function get_permalink(){return 'homepage_preview.html';}
function post_class($c=''){echo 'class="'.esc_attr($c).'"';} function get_the_date(){return date('Y-m-d');}
function date_i18n($format){return date($format);} function current_time($type='mysql'){return date('Y-m-d H:i:s');}
function get_the_archive_title(){global $fixtureTitle; return $fixtureTitle;}
function the_archive_title($before='',$after=''){global $fixtureTitle; echo $before.esc_html($fixtureTitle).$after;}
function get_the_archive_description(){return 'Preview archive description.';}
function comments_open(){return false;} function have_comments(){return false;} function wp_list_comments(){} function comment_form(){echo '<form class="comment-form"></form>';}
function do_shortcode(){return '<form class="contact-form-preview"></form>';} function wp_nonce_field(){} function wp_verify_nonce(){return true;} function wp_mail(){return true;}
function get_option($n,$d=false){return $d;} function current_user_can(){return true;} function wp_safe_redirect(){} function is_email($v){return true;}
function get_theme_mod($n,$d=false){return $d;} function selected($s,$c=true,$e=true){$r=((string)$s===(string)$c)?' selected="selected"':''; if($e)echo $r; return $r;}
function checked($s,$c=true,$e=true){$r=((string)$s===(string)$c)?' checked="checked"':''; if($e)echo $r; return $r;}
function get_posts($a=[]){return [];} class WP_Query{public function __construct($a=[]){$this->posts=[];} public function have_posts(){return false;} public function the_post(){}}
function wp_get_attachment_image(){return '';} function get_post_meta($id,$k='',$single=false){return $single?'':[];}
function register_sidebar(){} function dynamic_sidebar(){return false;} function is_active_sidebar(){return false;} function paginate_links(){return '';}
function get_search_query(){return '';} function the_posts_pagination(){} function add_menu_page(){} function add_submenu_page(){}
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
  const result = runCommand('php', [harnessPath, themeDir, sourceRelative, title], { cwd: root, echo: false });
  fs.rmSync(harnessPath, { force: true });
  if (result.status !== 0) fail(`PHP preview render failed for ${sourceRelative}: ${result.stderr || result.stdout || result.error}`);
  if (PREVIEW_RUNTIME_WARNING_PATTERN.test(result.stdout)) fail(`PHP preview render produced warning output for ${sourceRelative}.`);
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

  const renderedPages = [
    { output: 'index.html', source: 'front-page.php', title: 'Home' },
    { output: 'homepage_preview.html', source: 'front-page.php', title: 'Home' },
    { output: 'about-us_preview.html', source: 'page.php', title: 'About Us' },
    { output: 'work_preview.html', source: 'page.php', title: 'Work' },
    { output: 'blog_preview.html', source: 'page.php', title: 'Blog' },
    { output: 'contact_preview.html', source: 'page.php', title: 'Contact' },
    { output: 'services_preview.html', source: 'page.php', title: 'Services' },
    { output: 'policy_preview.html', source: 'page.php', title: 'Privacy Policy' },
    { output: 'single_services_preview.html', source: 'single.php', title: 'Service' }
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
  if (fs.existsSync(candidateDir)) fs.rmSync(candidateDir, { recursive: true, force: true });
  fs.mkdirSync(candidateDir, { recursive: true });
  generateRenderedPreview(themeDir, candidateDir);
  if (fs.existsSync(previewDir)) fs.renameSync(previewDir, backupDir);
  try {
    fs.renameSync(candidateDir, previewDir);
  } catch (error) {
    if (fs.existsSync(previewDir)) fs.rmSync(previewDir, { recursive: true, force: true });
    if (fs.existsSync(backupDir)) fs.renameSync(backupDir, previewDir);
    throw error;
  }
  fs.rmSync(backupDir, { recursive: true, force: true });
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
    const description = readStyle(themeDir, 'Description') || 'Generated WordPress theme preview.';
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
