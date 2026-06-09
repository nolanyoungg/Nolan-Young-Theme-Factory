<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_theme_enqueue_assets() {
	$theme_uri = get_theme_file_uri();
	$css_file  = get_theme_file_path( 'assets/css/bundle.css' );
	$js_file   = get_theme_file_path( 'assets/js/bundle.js' );

	wp_enqueue_style(
		'nolan-theme-bundle',
		$theme_uri . '/assets/css/bundle.css',
		array(),
		file_exists( $css_file ) ? filemtime( $css_file ) : '1.0.0'
	);

	wp_enqueue_script(
		'nolan-theme-bundle',
		$theme_uri . '/assets/js/bundle.js',
		array(),
		file_exists( $js_file ) ? filemtime( $js_file ) : '1.0.0',
		true
	);
}
add_action( 'wp_enqueue_scripts', 'nolan_theme_enqueue_assets' );

function nolan_theme_defer_script( $tag, $handle, $src ) {
	if ( 'nolan-theme-bundle' === $handle ) {
		return sprintf( '<script src="%s" defer></script>', esc_url( $src ) );
	}
	return $tag;
}
add_filter( 'script_loader_tag', 'nolan_theme_defer_script', 10, 3 );

