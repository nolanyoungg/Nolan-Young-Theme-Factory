<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
function hearth_honey_setup() {
    load_theme_textdomain( '014-nolan-young-theme-hearth-and-honey', get_template_directory() . '/languages' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
    add_theme_support( 'editor-styles' );
    add_editor_style( 'assets/css/bundle.css' );
}
add_action( 'after_setup_theme', 'hearth_honey_setup' );
