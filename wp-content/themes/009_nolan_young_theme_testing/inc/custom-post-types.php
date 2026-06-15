<?php
// File: inc/custom-post-types.php
// This file registers custom post types for the theme.

function nolan_young_theme_register_case_study_post_type() {
    register_post_type('case_study', array(
        'labels' => array(
            'name' => __('Case Studies', 'nolan-young-theme'),
            'singular_name' => __('Case Study', 'nolan-young-theme')
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
    ));
}
add_action('init', 'nolan_young_theme_register_case_study_post_type');

function nolan_young_theme_register_service_post_type() {
    register_post_type('service', array(
        'labels' => array(
            'name' => __('Services', 'nolan-young-theme'),
            'singular_name' => __('Service', 'nolan-young-theme')
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
    ));
}
add_action('init', 'nolan_young_theme_register_service_post_type');

function nolan_young_theme_register_testimonial_post_type() {
    register_post_type('testimonial', array(
        'labels' => array(
            'name' => __('Testimonials', 'nolan-young-theme'),
            'singular_name' => __('Testimonial', 'nolan-young-theme')
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
    ));
}
add_action('init', 'nolan_young_theme_register_testimonial_post_type');
