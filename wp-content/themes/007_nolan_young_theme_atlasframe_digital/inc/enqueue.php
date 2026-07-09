<?php
/**
 * Asset enqueueing.
 *
 * @package Nolan_Young_Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_young_template_asset_version( $relative_path ) {
	$path = get_theme_file_path( $relative_path );
	return file_exists( $path ) ? (string) filemtime( $path ) : '1.0.0';
}

function nolan_young_template_enqueue_assets() {
	wp_enqueue_style(
		'007-nolan-young-theme-atlasframe-digital-style',
		get_theme_file_uri( 'assets/css/bundle.css' ),
		array(),
		nolan_young_template_asset_version( 'assets/css/bundle.css' )
	);
	wp_enqueue_script(
		'007-nolan-young-theme-atlasframe-digital-script',
		get_theme_file_uri( 'assets/js/bundle.js' ),
		array(),
		nolan_young_template_asset_version( 'assets/js/bundle.js' ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'nolan_young_template_enqueue_assets' );

