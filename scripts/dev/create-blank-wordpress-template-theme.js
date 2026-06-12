#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const slug = 'NOLAN-YOUNG-theme-000';
const dir = path.join(root, 'wordpress-themplate-themes', slug);
const td = 'nolan-young-template';

function write(file, content = '') {
  const target = path.join(dir, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${String(content).replace(/\r\n/g, '\n').trimStart()}\n`, 'utf8');
}

function writeRaw(file, buffer) {
  const target = path.join(dir, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, buffer);
}

function section(title) {
  return `<?php
/**
 * ${title}.
 *
 * @package Nolan_Young_Template
 */
?>
<section class="template-section">
	<div class="template-container">
		<p class="eyebrow"><?php esc_html_e( 'Lorem ipsum', '${td}' ); ?></p>
		<h2><?php esc_html_e( '${title}', '${td}' ); ?></h2>
		<p><?php esc_html_e( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus non velit gravida fermentum.', '${td}' ); ?></p>
	</div>
</section>`;
}

function pageTemplate(title) {
  return `<?php
/**
 * Template Name: ${title}
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<section class="template-section">
		<div class="template-container">
			<p class="eyebrow"><?php esc_html_e( 'Lorem ipsum', '${td}' ); ?></p>
			<h1><?php esc_html_e( '${title}', '${td}' ); ?></h1>
			<p><?php esc_html_e( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer luctus, erat at dignissim tincidunt, lorem nibh consequat velit, et finibus neque ipsum sed arcu.', '${td}' ); ?></p>
		</div>
	</section>
</main>
<?php
get_footer();`;
}

if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });

const files = {
  'style.css': `/*
Theme Name: NOLAN YOUNG Theme 000
Author: Nolan Young
Description: Blank Nolan Young WordPress theme template with Lorem ipsum placeholder content.
Version: 1.0.0
License: GPL-2.0-or-later
Text Domain: ${td}
*/`,
  'functions.php': `<?php
/**
 * Theme bootstrap.
 *
 * @package Nolan_Young_Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

foreach ( array(
	'inc/setup.php',
	'inc/enqueue.php',
	'inc/template-tags.php',
	'inc/helpers.php',
	'inc/custom-post-types.php',
	'inc/customizer.php',
	'inc/forms.php',
	'inc/newsletter.php',
	'inc/policy-routing.php',
) as $nolan_young_template_include ) {
	$nolan_young_template_path = get_template_directory() . '/' . $nolan_young_template_include;
	if ( file_exists( $nolan_young_template_path ) ) {
		require_once $nolan_young_template_path;
	}
}`,
  'theme.json': JSON.stringify({
    $schema: 'https://schemas.wp.org/trunk/theme.json',
    version: 3,
    settings: {
      color: {
        palette: [
          { slug: 'ink', color: '#111827', name: 'Ink' },
          { slug: 'paper', color: '#f8fafc', name: 'Paper' },
          { slug: 'accent', color: '#2563eb', name: 'Accent' }
        ]
      },
      layout: { contentSize: '760px', wideSize: '1180px' }
    }
  }, null, 2),
  'README.md': '# NOLAN YOUNG Theme 000\n\nBlank template with Lorem ipsum content for generated WordPress themes.',
  '.editorconfig': 'root = true\n\n[*]\ncharset = utf-8\nend_of_line = lf\ninsert_final_newline = true\nindent_style = tab\nindent_size = 4\n\n[*.{css,scss,js,json,md}]\nindent_style = space\nindent_size = 2',
  '.gitignore': 'node_modules/\n*.log\n*.map',
  'header.php': `<?php
/**
 * Header.
 *
 * @package Nolan_Young_Template
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="site-header" data-nolan-menu="root">
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', '${td}' ); ?></a>
	<div class="site-header__inner">
		<a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
			<span class="site-branding__name"><?php bloginfo( 'name' ); ?></span>
			<span class="site-branding__tagline"><?php esc_html_e( 'Lorem ipsum dolor', '${td}' ); ?></span>
		</a>
		<button class="menu-toggle" type="button" data-nolan-menu-toggle aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e( 'Menu', '${td}' ); ?></button>
		<nav class="primary-navigation" id="primary-menu" data-nolan-menu-panel aria-label="<?php esc_attr_e( 'Primary menu', '${td}' ); ?>">
			<?php wp_nav_menu( array( 'theme_location' => 'primary', 'fallback_cb' => 'nolan_young_template_fallback_menu' ) ); ?>
		</nav>
	</div>
</header>`,
  'footer.php': `<?php
/**
 * Footer.
 *
 * @package Nolan_Young_Template
 */
?>
<footer class="site-footer">
	<div class="site-footer__inner">
		<?php get_template_part( 'template-parts/content', 'footer-widgets' ); ?>
		<p>&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?></p>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>`,
  'front-page.php': `<?php
/**
 * Front page.
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<?php
	get_template_part( 'template-parts/content', 'hero' );
	get_template_part( 'template-parts/content', 'brand-statement' );
	get_template_part( 'template-parts/content', 'featured-work' );
	get_template_part( 'template-parts/content', 'all-services' );
	get_template_part( 'template-parts/content', 'single-service-highlight' );
	get_template_part( 'template-parts/content', 'process' );
	get_template_part( 'template-parts/content', 'style-pillars' );
	get_template_part( 'template-parts/content', 'testimonials' );
	get_template_part( 'template-parts/content', 'blog-preview' );
	get_template_part( 'template-parts/content', 'cta-banner' );
	?>
</main>
<?php
get_footer();`,
  'index.php': `<?php
/**
 * Index.
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', get_post_type() ); endwhile; the_posts_navigation(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?>
</main>
<?php get_footer();`,
  'page.php': `<?php get_header(); ?><main id="primary" class="site-main"><?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'page' ); endwhile; ?></main><?php get_footer(); ?>`,
  'single.php': `<?php get_header(); ?><main id="primary" class="site-main"><?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'single' ); endwhile; ?></main><?php get_footer(); ?>`,
  'archive.php': `<?php get_header(); ?><main id="primary" class="site-main"><header class="page-header"><?php the_archive_title( '<h1>', '</h1>' ); ?></header><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; else : get_template_part( 'template-parts/content', 'none' ); endif; ?></main><?php get_footer(); ?>`,
  'search.php': `<?php get_header(); ?><main id="primary" class="site-main"><header class="page-header"><h1><?php printf( esc_html__( 'Search results for: %s', '${td}' ), '<span>' . esc_html( get_search_query() ) . '</span>' ); ?></h1></header><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; else : get_template_part( 'template-parts/content', 'none' ); endif; ?></main><?php get_footer(); ?>`,
  'searchform.php': `<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>"><label><span class="screen-reader-text"><?php esc_html_e( 'Search for:', '${td}' ); ?></span><input type="search" class="search-field" placeholder="<?php esc_attr_e( 'Search lorem ipsum', '${td}' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s"></label><button type="submit" class="search-submit"><?php esc_html_e( 'Search', '${td}' ); ?></button></form>`,
  '404.php': `<?php get_header(); ?><main id="primary" class="site-main"><section class="template-section"><h1><?php esc_html_e( 'Lorem ipsum page not found', '${td}' ); ?></h1><p><?php esc_html_e( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '${td}' ); ?></p><?php get_search_form(); ?></section></main><?php get_footer(); ?>`,
  '403.php': `<?php get_header(); ?><main id="primary" class="site-main"><section class="template-section"><h1><?php esc_html_e( 'Lorem ipsum access restricted', '${td}' ); ?></h1><p><?php esc_html_e( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '${td}' ); ?></p></section></main><?php get_footer(); ?>`,
  'comments.php': `<?php if ( post_password_required() ) { return; } ?><section id="comments" class="comments-area"><?php if ( have_comments() ) : ?><h2><?php esc_html_e( 'Lorem ipsum comments', '${td}' ); ?></h2><ol class="comment-list"><?php wp_list_comments(); ?></ol><?php endif; ?><?php comment_form(); ?></section>`,
  'package.json': JSON.stringify({ name: 'nolan-young-theme-000', version: '1.0.0', private: true, scripts: { build: 'webpack --config build/webpack.config.js' }, devDependencies: { 'css-loader': '^7.1.2', 'mini-css-extract-plugin': '^2.9.2', sass: '^1.77.8', 'sass-loader': '^16.0.1', webpack: '^5.93.0', 'webpack-cli': '^5.1.4' } }, null, 2),
  'package-lock.json': JSON.stringify({ name: 'nolan-young-theme-000', version: '1.0.0', lockfileVersion: 3, requires: true, packages: { '': { name: 'nolan-young-theme-000', version: '1.0.0' } } }, null, 2),
  'LICENSE.txt': 'GPL-2.0-or-later\n\nLorem ipsum placeholder license text.',
  'CHANGELOG.md': '# Changelog\n\n## 1.0.0\n\n- Lorem ipsum blank template scaffold.',
  'inc/setup.php': `<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
function nolan_young_template_setup() {
	load_theme_textdomain( '${td}', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	register_nav_menus( array( 'primary' => esc_html__( 'Primary', '${td}' ), 'footer' => esc_html__( 'Footer', '${td}' ) ) );
}
add_action( 'after_setup_theme', 'nolan_young_template_setup' );`,
  'inc/enqueue.php': `<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
function nolan_young_template_enqueue_assets() {
	$css_path = get_template_directory() . '/assets/css/bundle.css';
	$js_path = get_template_directory() . '/assets/js/bundle.js';
	wp_enqueue_style( 'nolan-young-template-style', get_template_directory_uri() . '/assets/css/bundle.css', array(), file_exists( $css_path ) ? filemtime( $css_path ) : '1.0.0' );
	wp_enqueue_script( 'nolan-young-template-script', get_template_directory_uri() . '/assets/js/bundle.js', array(), file_exists( $js_path ) ? filemtime( $js_path ) : '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'nolan_young_template_enqueue_assets' );`,
  'inc/template-tags.php': `<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
function nolan_young_template_fallback_menu() {
	echo '<ul class="menu"><li><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Lorem ipsum', '${td}' ) . '</a></li></ul>';
}`,
  'inc/helpers.php': `<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
function nolan_young_template_lorem() {
	return esc_html__( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '${td}' );
}`,
  'inc/custom-post-types.php': `<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }`,
  'inc/customizer.php': `<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }`,
  'inc/forms.php': `<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }`,
  'inc/newsletter.php': `<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }`,
  'inc/policy-routing.php': `<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }`,
  'assets/css/bundle.css': ':root{--color-ink:#111827;--color-paper:#f8fafc;--color-accent:#2563eb}body{margin:0;color:var(--color-ink);background:var(--color-paper);font-family:system-ui,sans-serif}.site-header,.site-footer,.template-section{padding:32px}.template-container{width:min(100%,1180px);margin:0 auto}.template-section{border-top:1px solid rgba(17,24,39,.12)}',
  'assets/js/bundle.js': `(() => {
  const toggle = document.querySelector('[data-nolan-menu-toggle]');
  const panel = document.querySelector('[data-nolan-menu-panel]');
  if (!toggle || !panel) return;
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    panel.toggleAttribute('data-open', !expanded);
  });
})();`,
  'assets/icons/icon1.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Lorem ipsum icon"><rect width="64" height="64" rx="12" fill="#2563eb"/><path d="M18 42h28M18 32h28M18 22h28" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>',
  'assets/icons/README.md': '# Icons\n\nLorem ipsum placeholder icon assets.',
  'assets/images/hero/.gitkeep': '',
  'assets/images/portfolio/.gitkeep': '',
  'assets/images/texture/.gitkeep': '',
  'src/js/main.js': "import '../scss/main.scss';\ndocument.documentElement.classList.add('has-template-js');",
  'src/scss/main.scss': '@use "abstracts/variables";\n@use "abstracts/mixins";\n@use "abstracts/functions";\n@use "base/reset";\n@use "base/typography";\n@use "base/accessibility";\n@use "base/forms";\n@use "base/newsletter";\n@use "components/buttons";\n@use "components/cards";\n@use "components/forms";\n@use "components/badges";\n@use "components/accordion";\n@use "components/carousel";\n@use "components/portfolio-filter";\n@use "components/before-after";\n@use "layout/container";\n@use "layout/header";\n@use "layout/footer";\n@use "layout/grid";\n@use "layout/sections";\n@use "pages/homepage";\n@use "pages/contact";\n@use "pages/about-us";\n@use "pages/services";\n@use "pages/work";\n@use "pages/blog";\n@use "pages/policy";',
  'src/scss/abstracts/_variables.scss': '$color-ink: #111827;\n$color-paper: #f8fafc;\n$color-accent: #2563eb;',
  'src/scss/abstracts/_mixins.scss': '@mixin container { width: min(100%, 1180px); margin-inline: auto; }',
  'src/scss/abstracts/_functions.scss': '@function template-rem($px) { @return calc($px / 16) * 1rem; }',
  'src/scss/base/_reset.scss': '* { box-sizing: border-box; }',
  'src/scss/base/_typography.scss': 'body { font-family: system-ui, sans-serif; }',
  'src/scss/base/_accessibility.scss': '.screen-reader-text { position: absolute; width: 1px; height: 1px; overflow: hidden; }',
  'src/scss/base/_forms.scss': 'input, textarea, select, button { font: inherit; }',
  'src/scss/base/_newsletter.scss': '.newsletter-form { display: grid; gap: 12px; }',
  'src/scss/components/_buttons.scss': '.button, button { border-radius: 6px; cursor: pointer; }',
  'src/scss/components/_cards.scss': '.template-card { border: 1px solid rgba(17,24,39,.12); border-radius: 8px; padding: 20px; }',
  'src/scss/components/_forms.scss': '.form-row { display: grid; gap: 8px; }',
  'src/scss/components/_badges.scss': '.eyebrow { font-size: .75rem; text-transform: uppercase; }',
  'src/scss/components/_accordion.scss': '.accordion { border-top: 1px solid currentColor; }',
  'src/scss/components/_carousel.scss': '.carousel { overflow: hidden; }',
  'src/scss/components/_portfolio-filter.scss': '.portfolio-filter { display: flex; flex-wrap: wrap; gap: 8px; }',
  'src/scss/components/_before-after.scss': '.before-after { display: grid; grid-template-columns: 1fr 1fr; }',
  'src/scss/layout/_container.scss': '.template-container { width: min(100%, 1180px); margin-inline: auto; }',
  'src/scss/layout/_header.scss': '.site-header__inner { display: flex; align-items: center; justify-content: space-between; }',
  'src/scss/layout/_footer.scss': '.site-footer { border-top: 1px solid rgba(17,24,39,.12); }',
  'src/scss/layout/_grid.scss': '.template-card-grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); }',
  'src/scss/layout/_sections.scss': '.template-section { padding-block: 64px; }',
  'src/scss/pages/_homepage.scss': '.home .template-section:first-child { padding-top: 80px; }',
  'src/scss/pages/_contact.scss': '.contact-form { max-width: 720px; }',
  'src/scss/pages/_about-us.scss': '.about-intro { max-width: 760px; }',
  'src/scss/pages/_services.scss': '.services-grid { display: grid; gap: 20px; }',
  'src/scss/pages/_work.scss': '.work-grid { display: grid; gap: 20px; }',
  'src/scss/pages/_blog.scss': '.blog-grid { display: grid; gap: 20px; }',
  'src/scss/pages/_policy.scss': '.policy-content { max-width: 760px; }',
  'blocks/README.md': '# Blocks\n\nLorem ipsum placeholder.',
  'build/webpack.config.js': "const path = require('path');\nconst MiniCssExtractPlugin = require('mini-css-extract-plugin');\nmodule.exports = { mode: 'production', entry: path.resolve(__dirname, '../src/js/main.js'), output: { path: path.resolve(__dirname, '../assets/js'), filename: 'bundle.js', clean: false }, module: { rules: [{ test: /\\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] }] }, plugins: [new MiniCssExtractPlugin({ filename: '../css/bundle.css' })] };",
  'docs/getting-started.md': '# Getting Started\n\nLorem ipsum dolor sit amet.',
  'docs/customization.md': '# Customization\n\nLorem ipsum dolor sit amet.',
  'accessibility/README.md': '# Accessibility\n\nLorem ipsum dolor sit amet.'
};

[
  ['template-parts/content-page.php', 'Page Content'],
  ['template-parts/content-single.php', 'Single Content'],
  ['template-parts/content-none.php', 'No Content'],
  ['template-parts/content-policy.php', 'Policy Content'],
  ['template-parts/content-search.php', 'Search Content'],
  ['template-parts/content-hero.php', 'Hero Content'],
  ['template-parts/content-brand-statement.php', 'Brand Statement'],
  ['template-parts/content-featured-work.php', 'Featured Work'],
  ['template-parts/content-all-services.php', 'All Services'],
  ['template-parts/content-single-service-highlight.php', 'Single Service Highlight'],
  ['template-parts/content-process.php', 'Process'],
  ['template-parts/content-style-pillars.php', 'Style Pillars'],
  ['template-parts/content-testimonials.php', 'Testimonials'],
  ['template-parts/content-blog-preview.php', 'Blog Preview'],
  ['template-parts/content-cta-banner.php', 'CTA Banner'],
  ['template-parts/content-footer-widgets.php', 'Footer Widgets']
].forEach(([file, title]) => { files[file] = section(title); });

[
  ['page-templates/template-about-us.php', 'About Us'],
  ['page-templates/template-services.php', 'Services'],
  ['page-templates/template-single-service.php', 'Single Service'],
  ['page-templates/template-work.php', 'Work'],
  ['page-templates/template-blog.php', 'Blog'],
  ['page-templates/template-contact.php', 'Contact'],
  ['page-templates/template-policy.php', 'Policy']
].forEach(([file, title]) => { files[file] = pageTemplate(title); });

Object.entries(files).forEach(([file, content]) => write(file, content));

writeRaw('screenshot.png', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=', 'base64'));

console.log(`Created ${path.relative(root, dir)}`);
