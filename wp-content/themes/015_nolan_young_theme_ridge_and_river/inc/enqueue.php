<?php
/** Local runtime assets for Ridge & River. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function ridge_river_asset_version( $path ) {
	$file = get_theme_file_path( $path );
	return file_exists( $file ) ? (string) filemtime( $file ) : '1.0.0';
}
function ridge_river_enqueue_assets() {
	wp_enqueue_style( 'ridge-river', get_theme_file_uri( 'assets/css/bundle.css' ), array(), ridge_river_asset_version( 'assets/css/bundle.css' ) );
	wp_enqueue_script( 'ridge-river', get_theme_file_uri( 'assets/js/bundle.js' ), array(), ridge_river_asset_version( 'assets/js/bundle.js' ), true );
}
add_action( 'wp_enqueue_scripts', 'ridge_river_enqueue_assets' );

