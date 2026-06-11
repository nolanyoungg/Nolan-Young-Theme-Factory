<?php
function nytf_003_customize_register( $wp_customize ) {
  $wp_customize->add_section( 'nytf_003_brand', array(
    'title' => esc_html__( 'Brand Settings', '003_nolan_young_theme_ironline_freight_systems' ),
    'priority' => 30,
  ) );
}
add_action( 'customize_register', 'nytf_003_customize_register' );

