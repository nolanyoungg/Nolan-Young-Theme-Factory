<?php
function aster_grove_register_work_type() {
  register_post_type( 'aster_work', array(
    'public' => true,
    'label' => esc_html__( 'Landscape Work', '000_nolan_young_theme_premium_landscape_design_company' ),
    'supports' => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
    'show_in_rest' => true,
  ) );
}
add_action( 'init', 'aster_grove_register_work_type' );
