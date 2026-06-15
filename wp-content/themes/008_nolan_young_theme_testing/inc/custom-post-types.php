<?php
// inc/custom-post-types.php - Register custom post types for the theme

function nolan_young_theme_register_custom_post_types() {
    // Register Case Study CPT
    register_post_type('case_study', array(
        'labels' => array(
            'name'               => __('Case Studies', 'nolan-young-theme'),
            'singular_name'      => __('Case Study', 'nolan-young-theme'),
            'add_new'            => __('Add New', 'nolan-young-theme'),
            'new_item'           => __('New Case Study', 'nolan-young-theme'),
            'edit_item'          => __('Edit Case Study', 'nolan-young-theme'),
            'view_item'          => __('View Case Study', 'nolan-young-theme'),
            'all_items'          => __('All Case Studies', 'nolan-young-theme'),
            'search_items'       => __('Search Case Studies', 'nolan-young-theme'),
            'parent_item_colon'  => __('Parent Case Studies:', 'nolan-young-theme'),
            'not_found'          => __('No case studies found.', 'nolan-young-theme'),
            'not_found_in_trash' => __('No case studies found in Trash.', 'nolan-young-theme')
        ),
        'public'             => true,
        'has_archive'        => true,
        'rewrite'            => array('slug' => 'case-studies'),
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt'),
    ));
}

add_action('init', 'nolan_young_theme_register_custom_post_types');
