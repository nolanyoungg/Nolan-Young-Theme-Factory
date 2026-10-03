<?php
/** Blue Hour uses WordPress pages and posts. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function blue_hour_setup() {
	load_theme_textdomain( '011-nolan-young-theme-blue-hour', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/bundle.css' );
	register_nav_menus( array( 'primary' => __( 'Blue Hour navigation', '011-nolan-young-theme-blue-hour' ) ) );
}
add_action( 'after_setup_theme', 'blue_hour_setup' );
