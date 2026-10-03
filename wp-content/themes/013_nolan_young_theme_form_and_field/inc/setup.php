<?php
/** Form & Field: native WordPress theme features. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function form_field_setup() {
	load_theme_textdomain( '013-nolan-young-theme-form-and-field', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/bundle.css' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	register_nav_menus( array( 'primary' => __( 'Studio navigation', '013-nolan-young-theme-form-and-field' ) ) );
}
add_action( 'after_setup_theme', 'form_field_setup' );
