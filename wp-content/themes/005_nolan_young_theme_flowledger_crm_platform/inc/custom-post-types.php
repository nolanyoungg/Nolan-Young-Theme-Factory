<?php
function nytf_005_register_work_type() {
  register_post_type( 'nytf_work', array(
    'public' => true,
    'label' => esc_html__( 'Work', '005_nolan_young_theme_flowledger_crm_platform' ),
    'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
    'show_in_rest' => true,
  ) );
}
add_action( 'init', 'nytf_005_register_work_type' );

