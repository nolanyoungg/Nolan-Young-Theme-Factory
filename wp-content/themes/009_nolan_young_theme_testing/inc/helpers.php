<?php
// File: inc/helpers.php
// This file contains helper functions for various theme tasks.

function nolan_young_theme_get_case_studies() {
    $args = array(
        'post_type' => 'case_study',
        'posts_per_page' => -1,
    );
    return new WP_Query($args);
}

function nolan_young_theme_get_services() {
    $args = array(
        'post_type' => 'service',
        'posts_per_page' => -1,
    );
    return new WP_Query($args);
}

function nolan_young_theme_get_testimonials() {
    $args = array(
        'post_type' => 'testimonial',
        'posts_per_page' => -1,
    );
    return new WP_Query($args);
}
