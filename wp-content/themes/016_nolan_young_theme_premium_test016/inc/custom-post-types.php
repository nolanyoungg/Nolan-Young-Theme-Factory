<?php
// Register custom post types

function nolan_young_theme_register_custom_post_types() {
    // Register Form Submissions CPT
    register_post_type('form_submission', array(
        'labels' => array(
            'name' => __('Form Submissions'),
            'singular_name' => __('Form Submission'),
        ),
        'public' => false,
        'show_ui' => true,
        'supports' => array('title', 'editor'),
    ));

    // Register Newsletter Subscribers CPT
    register_post_type('newsletter_subscriber', array(
        'labels' => array(
            'name' => __('Newsletter Subscribers'),
            'singular_name' => __('Newsletter Subscriber'),
        ),
        'public' => false,
        'show_ui' => true,
        'supports' => array('title', 'editor'),
    ));
}
add_action('init', 'nolan_young_theme_register_custom_post_types');
?>
