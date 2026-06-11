<?php
function nytf_002_customize_register( $wp_customize ) {
  $wp_customize->add_section( 'nytf_002_brand', array(
    'title' => esc_html__( 'Brand Settings', '002_nolan_young_theme_astragrid_systems' ),
    'priority' => 30,
  ) );
}
add_action( 'customize_register', 'nytf_002_customize_register' );

