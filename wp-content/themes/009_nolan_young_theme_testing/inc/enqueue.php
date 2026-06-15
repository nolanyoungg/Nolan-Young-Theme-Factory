<?php
/**
 * Asset loading.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_young_template_enqueue_assets() {
	$css_path = get_template_directory() . '/assets/css/bundle.css';
	$js_path  = get_template_directory() . '/assets/js/bundle.js';

	wp_enqueue_style(
		'nolan-young-template-style',
		get_template_directory_uri() . '/assets/css/bundle.css',
		array(),
		file_exists( $css_path ) ? filemtime( $css_path ) : '1.0.0'
	);

	wp_enqueue_script(
		'nolan-young-template-script',
		get_template_directory_uri() . '/assets/js/bundle.js',
		array(),
		file_exists( $js_path ) ? filemtime( $js_path ) : '1.0.0',
		true
	);
}
add_action( 'wp_enqueue_scripts', 'nolan_young_template_enqueue_assets' );
