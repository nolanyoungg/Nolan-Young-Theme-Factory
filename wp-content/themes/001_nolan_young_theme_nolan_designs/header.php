<?php
defined( 'ABSPATH' ) || exit;
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'nolan-young-theme-template-01' ); ?></a>
<div id="page" class="site">
<header class="site-header" role="banner">
	<div class="site-wrap site-header__inner">
		<?php get_template_part( 'template-parts/header/site', 'branding' ); ?>
		<?php get_template_part( 'template-parts/header/primary', 'navigation' ); ?>
		<div class="header-cta"><a class="btn btn-header-cta" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-theme-template-01' ); ?></a></div>
		<button class="mobile-toggle btn btn-secondary btn-small" type="button" data-mobile-toggle aria-controls="mobile-drawer" aria-expanded="false"><?php esc_html_e( 'Menu', 'nolan-young-theme-template-01' ); ?></button>
	</div>
	<div class="backdrop" data-backdrop></div>
	<?php get_template_part( 'template-parts/header/mobile', 'navigation' ); ?>
	<?php get_template_part( 'template-parts/header/mega-menu', 'featured' ); ?>
	<?php get_template_part( 'template-parts/header/mega-menu', 'blog' ); ?>
</header>
