<?php
/**
 * Theme bootstrap.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ny_theme_includes = array(
	'/inc/setup.php',
	'/inc/enqueue.php',
	'/inc/helpers.php',
	'/inc/custom-post-types.php',
	'/inc/forms.php',
	'/inc/newsletter.php',
	'/inc/template-tags.php',
	'/inc/customizer.php',
	'/inc/policy-routing.php',
);

foreach ( $ny_theme_includes as $ny_theme_include ) {
	$ny_theme_include_path = get_template_directory() . $ny_theme_include;

	if ( file_exists( $ny_theme_include_path ) ) {
		require_once $ny_theme_include_path;
	}
}
