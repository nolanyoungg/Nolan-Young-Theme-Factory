<?php
/** Local, compiled Clay & Still assets. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function clay_still_assets() {
	$css = 'assets/css/bundle.css';
	$js = 'assets/js/bundle.js';
	wp_enqueue_style( 'clay-still', get_theme_file_uri( $css ), array(), (string) filemtime( get_theme_file_path( $css ) ) );
	wp_enqueue_script( 'clay-still', get_theme_file_uri( $js ), array(), (string) filemtime( get_theme_file_path( $js ) ), true );
}
add_action( 'wp_enqueue_scripts', 'clay_still_assets' );
