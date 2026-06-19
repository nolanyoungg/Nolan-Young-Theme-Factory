<?php
// WordPress Helper Functions

function nolan_yong_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form', 'comment-list', 'comment-form', 'gallery', 'caption'));
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');
    add_theme_support('editor-styles');
    add_editor_style(get_stylesheet_uri());
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'nolan-yong'),
        'footer' => __('Footer Menu', 'nolan-yong')
    ));
}
add_action('after_setup_theme', 'nolan_yong_theme_setup');

function nolan_yong_enqueue_scripts() {
    wp_enqueue_style('bundle-css', get_theme_file_uri('/assets/css/bundle.css'), array(), null);
    wp_enqueue_script('bundle-js', get_theme_file_uri('/assets/js/bundle.js'), array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'nolan_yong_enqueue_scripts');
?>