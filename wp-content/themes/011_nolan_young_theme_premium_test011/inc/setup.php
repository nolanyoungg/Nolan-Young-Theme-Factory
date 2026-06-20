<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
function nolan_young_template_setup() {
	load_theme_textdomain( 'nolan-young-template', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	register_nav_menus( array( 'primary' => esc_html__( 'Primary', 'nolan-young-template' ), 'footer' => esc_html__( 'Footer', 'nolan-young-template' ) ) );
}
add_action( 'after_setup_theme', 'nolan_young_template_setup' );
