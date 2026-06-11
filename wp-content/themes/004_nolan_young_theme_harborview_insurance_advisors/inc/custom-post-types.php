<?php
function nytf_004_register_work_type() {
  register_post_type( 'nytf_work', array(
    'public' => true,
    'label' => esc_html__( 'Work', '004_nolan_young_theme_harborview_insurance_advisors' ),
    'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
    'show_in_rest' => true,
  ) );
}
add_action( 'init', 'nytf_004_register_work_type' );

