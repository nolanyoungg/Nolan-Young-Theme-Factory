<?php
/** Standard WordPress content for Form & Field. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function ff_setup() {
    load_theme_textdomain( '012-nolan-young-theme-form-and-field', get_template_directory() . '/languages' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'align-wide' );
    add_theme_support( 'editor-styles' );
    add_editor_style( 'assets/css/bundle.css' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
    register_nav_menus( array( 'primary' => __( 'Studio navigation', '012-nolan-young-theme-form-and-field' ) ) );
    $GLOBALS['content_width'] = 1200;
}
add_action( 'after_setup_theme', 'ff_setup' );
