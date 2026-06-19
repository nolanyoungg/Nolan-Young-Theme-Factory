<?php
// Custom Post Types for Newsletter Subscribers

function nolan_yong_create_custom_post_types() {
    register_post_type('newsletter_subscriber', array(
        'labels' => array(
            'name' => __('Newsletter Subscribers', 'nolan-yong'),
            'singular_name' => __('Subscriber', 'nolan-yong')
        ),
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'supports' => array('title'),
        'has_archive' => false,
        'rewrite' => array('slug' => 'subscribers'),
        'capabilities' => array(
            'edit_post' => 'manage_options',
            'read_post' => 'manage_options',
            'delete_post' => 'manage_options',
            'edit_posts' => 'manage_options',
            'delete_posts' => 'manage_options',
            'publish_posts' => 'manage_options'
        )
    ));
}
add_action('init', 'nolan_yong_create_custom_post_types');
?>