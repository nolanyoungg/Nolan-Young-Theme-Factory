<?php
/**
 * Theme setup.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_young_template_setup() {
	load_theme_textdomain( '009_nolan_young_theme_testing', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	register_nav_menus(
		array(
			'primary' => esc_html__( 'Primary', '009_nolan_young_theme_testing' ),
			'footer'  => esc_html__( 'Footer', '009_nolan_young_theme_testing' ),
		)
	);
}
add_action( 'after_setup_theme', 'nolan_young_template_setup' );
