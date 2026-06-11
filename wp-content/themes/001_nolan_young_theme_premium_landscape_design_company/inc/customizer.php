<?php
function nytf_001_customize_register( $wp_customize ) {
  $wp_customize->add_section( 'nytf_001_brand', array(
    'title' => esc_html__( 'Brand Settings', '001_nolan_young_theme_premium_landscape_design_company' ),
    'priority' => 30,
  ) );
}
add_action( 'customize_register', 'nytf_001_customize_register' );

