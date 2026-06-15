<?php
// inc/helpers.php - Utility functions for the theme

function nolan_young_theme_enqueue_scripts() {
    wp_enqueue_style('nolan-young-theme-style', get_stylesheet_uri());
}

add_action('wp_enqueue_scripts', 'nolan_young_theme_enqueue_scripts');
