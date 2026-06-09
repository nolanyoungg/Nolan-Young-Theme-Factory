<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_theme_setup() {
	load_theme_textdomain( '001_nolan_young_theme_northstar_web_works', get_theme_file_path( 'languages' ) );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo', array( 'height' => 160, 'width' => 160, 'flex-height' => true, 'flex-width' => true ) );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );

	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', '001_nolan_young_theme_northstar_web_works' ),
			'footer'  => __( 'Footer Menu', '001_nolan_young_theme_northstar_web_works' ),
		)
	);

	add_image_size( 'nolan-portrait', 980, 1225, true );
	add_image_size( 'nolan-landscape', 1400, 1000, true );
}
add_action( 'after_setup_theme', 'nolan_theme_setup' );

function nolan_theme_content_width() {
	$GLOBALS['content_width'] = 1120;
}
add_action( 'after_setup_theme', 'nolan_theme_content_width', 0 );

function nolan_body_classes( $classes ) {
	$classes[] = 'nolan-showcase';
	if ( is_front_page() ) {
		$classes[] = 'is-home';
	}
	return $classes;
}
add_filter( 'body_class', 'nolan_body_classes' );



