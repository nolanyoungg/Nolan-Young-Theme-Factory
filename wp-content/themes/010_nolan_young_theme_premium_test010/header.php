<?php
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
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'nolan-young-template' ); ?></a>
	<div class="site-header__inner">
		<a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
			<span class="site-branding__name"><?php bloginfo( 'name' ); ?></span>
			<span class="site-branding__tagline"><?php esc_html_e( 'Websites that help businesses grow.', 'nolan-young-template' ); ?></span>
		</a>
		<button class="menu-toggle" type="button" data-nolan-menu-toggle aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e( 'Menu', 'nolan-young-template' ); ?></button>
		<nav class="primary-navigation" id="primary-menu" data-nolan-menu-panel aria-label="<?php esc_attr_e( 'Primary menu', 'nolan-young-template' ); ?>">
			<?php wp_nav_menu( array( 'theme_location' => 'primary', 'fallback_cb' => 'nolan_young_template_fallback_menu' ) ); ?>
		</nav>
	</div>
</header>
