<?php
/** Clay & Still uses standard WordPress pages and posts. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function clay_still_setup() {
	load_theme_textdomain( '010-nolan-young-theme-clay-and-still', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/bundle.css' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	register_nav_menus( array( 'primary' => 'Studio navigation', 'footer' => 'Studio footer' ) );
}
add_action( 'after_setup_theme', 'clay_still_setup' );
