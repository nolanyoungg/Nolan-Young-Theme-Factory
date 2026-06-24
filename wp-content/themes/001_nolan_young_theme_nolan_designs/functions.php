<?php
/**
 * Theme bootstrap.
 *
 * @package Nolan_Young_Template
 */

defined( 'ABSPATH' ) || exit;

foreach ( array(
	'inc/setup.php',
	'inc/helpers.php',
	'inc/template-tags.php',
	'inc/enqueue.php',
	'inc/custom-post-types.php',
	'inc/forms.php',
	'inc/newsletter.php',
	'inc/policy-routing.php',
) as $nolan_young_template_include ) {
	$path = get_template_directory() . '/' . $nolan_young_template_include;
	if ( file_exists( $path ) ) {
		require_once $path;
	}
}
