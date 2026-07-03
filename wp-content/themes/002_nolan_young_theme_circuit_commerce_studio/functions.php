<?php
/**
 * Theme bootstrap.
 *
 * @package Nolan_Young_Theme
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
}
