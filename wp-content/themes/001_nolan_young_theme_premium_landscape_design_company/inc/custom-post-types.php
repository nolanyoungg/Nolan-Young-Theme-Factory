<?php
function nytf_001_register_work_type() {
  register_post_type( 'nytf_work', array(
    'public' => true,
    'label' => esc_html__( 'Work', '001_nolan_young_theme_premium_landscape_design_company' ),
    'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
    'show_in_rest' => true,
  ) );
}
add_action( 'init', 'nytf_001_register_work_type' );

