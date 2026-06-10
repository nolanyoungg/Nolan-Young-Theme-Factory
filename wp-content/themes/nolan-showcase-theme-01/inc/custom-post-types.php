<?php
function nolan_showcase_theme_01_register_work_type() {
  register_post_type( 'meridian_work', array( 'public' => true, 'label' => esc_html__( 'Work', 'nolan-showcase-theme-01' ), 'supports' => array( 'title', 'editor', 'thumbnail' ) ) );
}
add_action( 'init', 'nolan_showcase_theme_01_register_work_type' );
