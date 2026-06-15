<?php
function nolan_young_theme_register_case_study_type() {
  register_post_type( 'case_study', array(
    'label' => __( 'Case Studies', '007_nolan_young_theme_testing' ),
    'public' => true,
    'show_in_rest' => true,
    'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
  ) );
}
add_action( 'init', 'nolan_young_theme_register_case_study_type' );
