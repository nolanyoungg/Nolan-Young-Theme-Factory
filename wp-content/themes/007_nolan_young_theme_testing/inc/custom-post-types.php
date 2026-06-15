<?php
// Custom post types for the theme
function nolan_young_register_custom_post_types() {
  // Register a custom post type for case studies
  register_post_type('case_study', array(
    'labels' => array(
      'name' => __('Case Studies', '007_nolan_young_theme_testing'),
      'singular_name' => __('Case Study', '007_nolan_young_theme_testing')
    ),
    'public' => true,
    'has_archive' => true,
    'supports' => array('title', 'editor', 'thumbnail'),
  ));

  // Register a custom post type for forms
  register_post_type('form_submission', array(
    'labels' => array(
      'name' => __('Form Submissions', '007_nolan_young_theme_testing'),
      'singular_name' => __('Form Submission', '007_nolan_young_theme_testing')
    ),
    'public' => false,
    'show_ui' => true,
    'supports' => array('title', 'editor'),
  ));
}

add_action('init', 'nolan_young_register_custom_post_types');
