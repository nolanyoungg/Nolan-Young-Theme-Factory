<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#content"><?php esc_html_e( 'Skip to content', 'nolan-showcase-theme-06' ); ?></a>
<header class="site-header">
	<div class="container header-bar">
		<div class="brand-mark">
			<a class="brand-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<span class="brand-icon" aria-hidden="true">
					<img src="<?php echo esc_url( nolan_asset_uri( 'assets/icons/icon1.svg' ) ); ?>" alt="" width="40" height="40">
				</span>
				<span class="brand-copy">
					<strong><?php echo esc_html( nolan_get_studio_brand()['name'] ); ?></strong>
					<span><?php esc_html_e( 'Web design and development', 'nolan-showcase-theme-06' ); ?></span>
				</span>
			</a>
		</div>

		<div class="header-actions">
			<a class="button button--ghost header-cta" href="<?php echo esc_url( home_url( '/#contact' ) ); ?>">
				<?php esc_html_e( 'Start a project', 'nolan-showcase-theme-06' ); ?>
			</a>
			<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="<?php esc_attr_e( 'Toggle navigation', 'nolan-showcase-theme-06' ); ?>">
				<span class="nav-toggle__bar"></span>
				<span class="nav-toggle__bar"></span>
				<span class="nav-toggle__bar"></span>
			</button>
		</div>

		<nav class="site-nav" id="primary-navigation" aria-label="<?php esc_attr_e( 'Primary', 'nolan-showcase-theme-06' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'fallback_cb'    => 'nolan_primary_menu_fallback',
					'menu_class'     => 'nav-list',
					'depth'          => 2,
				)
			);
			?>
		</nav>
	</div>
</header>
<main id="content" class="site-content">

