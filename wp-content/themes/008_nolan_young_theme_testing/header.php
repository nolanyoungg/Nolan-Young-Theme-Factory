<?php
// This is the Header template for displaying all of the Head section and beginning of the Body tag.
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php wp_title( '|', true, 'right' ); ?></title>
<link rel="profile" href="#">
<?php if ( is_singular() && pings_open( get_queried_object_id() ) ) : ?>
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<?php endif; ?>
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<div id="page" class="site">
<header id="masthead" class="site-header">
	<div class="header-container">
		<div class="logo">
			<a href="<?php echo esc_url( home_url() ); ?>"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/northstar-logo.svg" alt="Northstar Codeworks Logo"></a>
		</div>
		<nav id="site-navigation" class="main-navigation">
			<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><span class="screen-reader-text">Toggle navigation</span></button>
			<?php
			wp_nav_menu( array(
				'theme_location' => 'main-menu',
				'menu_id'        => 'primary-menu',
			) );
			?>
		</nav>
		<div class="header-cta">
			<a href="#contact-section" class="btn-primary">Book a Consultation</a>
		</div>
	</div>
</header>
