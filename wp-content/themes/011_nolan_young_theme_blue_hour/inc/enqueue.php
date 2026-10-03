<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
function blue_hour_enqueue() {
	wp_enqueue_style( 'blue-hour', get_theme_file_uri( 'assets/css/bundle.css' ), array(), (string) filemtime( get_theme_file_path( 'assets/css/bundle.css' ) ) );
	wp_enqueue_script( 'blue-hour', get_theme_file_uri( 'assets/js/bundle.js' ), array(), (string) filemtime( get_theme_file_path( 'assets/js/bundle.js' ) ), true );
}
add_action( 'wp_enqueue_scripts', 'blue_hour_enqueue' );
