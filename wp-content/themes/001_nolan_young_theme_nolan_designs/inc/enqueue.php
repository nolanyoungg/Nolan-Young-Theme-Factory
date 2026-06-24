<?php
/**
 * Enqueue assets.
 *
 * @package Nolan_Young_Template
 */

defined( 'ABSPATH' ) || exit;

function nolan_young_template_enqueue_assets() {
	$css_path = get_theme_file_path( 'assets/css/bundle.css' );
	$js_path  = get_theme_file_path( 'assets/js/bundle.js' );

	wp_enqueue_style( 'nolan-young-template-bundle', get_theme_file_uri( 'assets/css/bundle.css' ), array(), file_exists( $css_path ) ? filemtime( $css_path ) : null );
	wp_enqueue_script( 'nolan-young-template-bundle', get_theme_file_uri( 'assets/js/bundle.js' ), array(), file_exists( $js_path ) ? filemtime( $js_path ) : null, true );
}
add_action( 'wp_enqueue_scripts', 'nolan_young_template_enqueue_assets' );
