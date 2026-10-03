<?php
/** Local assets only. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function form_field_enqueue() {
	$css = 'assets/css/bundle.css';
	$js = 'assets/js/bundle.js';
	wp_enqueue_style( 'form-field', get_theme_file_uri( $css ), array(), (string) filemtime( get_theme_file_path( $css ) ) );
	wp_enqueue_script( 'form-field', get_theme_file_uri( $js ), array(), (string) filemtime( get_theme_file_path( $js ) ), true );
}
add_action( 'wp_enqueue_scripts', 'form_field_enqueue' );
