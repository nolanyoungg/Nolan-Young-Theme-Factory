<?php

// Register custom post types for form submissions and newsletter subscribers
function ns_register_custom_post_types() {
    // Form Submissions CPT
    register_post_type('form_submission', array(
        'labels' => array(
            'name' => __('Form Submissions', 'textdomain'),
            'singular_name' => __('Form Submission', 'textdomain'),
        ),
        'public' => false,
        'show_ui' => true,
        'supports' => array('title', 'editor', 'custom-fields'),
    ));

    // Newsletter Subscribers CPT
    register_post_type('newsletter_subscriber', array(
        'labels' => array(
            'name' => __('Newsletter Subscribers', 'textdomain'),
            'singular_name' => __('Newsletter Subscriber', 'textdomain'),
        ),
        'public' => false,
        'show_ui' => true,
        'supports' => array('title', 'custom-fields'),
    ));
}
add_action('init', 'ns_register_custom_post_types');
?>
