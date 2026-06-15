<?php
/**
 * Header template.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ny_contact_url = function_exists( 'nolan_young_theme_get_contact_url' ) ? nolan_young_theme_get_contact_url() : home_url( '/#contact' );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', '009_nolan_young_theme_testing' ); ?></a>

	<header id="masthead" class="site-header">
		<div class="container site-header__inner">
			<div class="site-branding">
				<a class="site-branding__link" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
					<span class="site-branding__mark" aria-hidden="true">N</span>
					<span class="site-branding__text">
						<span class="site-branding__title"><?php bloginfo( 'name' ); ?></span>
						<span class="site-branding__tagline">Northstar Codeworks</span>
					</span>
				</a>
			</div>

			<button
				class="menu-toggle"
				type="button"
				aria-expanded="false"
				aria-controls="primary-menu"
				aria-label="<?php esc_attr_e( 'Toggle navigation', '009_nolan_young_theme_testing' ); ?>"
			>
				<span></span>
				<span></span>
				<span></span>
			</button>

			<nav id="site-navigation" class="main-navigation" aria-label="<?php esc_attr_e( 'Primary menu', '009_nolan_young_theme_testing' ); ?>">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'container'      => false,
						'menu_id'        => 'primary-menu',
						'menu_class'     => 'menu',
						'fallback_cb'    => 'nolan_young_template_fallback_menu',
					)
				);
				?>
			</nav>

			<a class="button button--primary site-header__cta" href="<?php echo esc_url( $ny_contact_url ); ?>">
				<?php esc_html_e( 'Book a Consultation', '009_nolan_young_theme_testing' ); ?>
			</a>
		</div>
	</header>
