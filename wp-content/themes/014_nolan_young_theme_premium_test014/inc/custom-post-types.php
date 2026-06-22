<?php
/**
 * Register custom post types used in the theme.
 */

// Register form submission post type
function nolan_young_register_form_submission_post_type() {
    register_post_type('form_submission', array(
        'labels' => array(
            'name' => __('Form Submissions', 'nolan-young-theme'),
            'singular_name' => __('Form Submission', 'nolan-young-theme')
        ),
        'public' => false,
        'show_ui' => true,
        'supports' => array('title', 'editor'),
        'has_archive' => false,
    ));
}
add_action('init', 'nolan_young_register_form_submission_post_type');

// Register newsletter subscriber post type
function nolan_young_register_newsletter_subscriber_post_type() {
    register_post_type('newsletter_subscriber', array(
        'labels' => array(
            'name' => __('Newsletter Subscribers', 'nolan-young-theme'),
            'singular_name' => __('Newsletter Subscriber', 'nolan-young-theme')
        ),
        'public' => false,
        'show_ui' => true,
        'supports' => array('title', 'editor'),
        'has_archive' => false,
    ));
}
add_action('init', 'nolan_young_register_newsletter_subscriber_post_type');
?>
