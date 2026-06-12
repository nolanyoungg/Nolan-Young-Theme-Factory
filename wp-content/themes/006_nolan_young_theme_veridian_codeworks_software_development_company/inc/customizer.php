<?php
function nytf_006_customize_register( $wp_customize ) {
  $wp_customize->add_section( 'nytf_006_brand', array(
    'title' => esc_html__( 'Brand Settings', '006_nolan_young_theme_veridian_codeworks_software_development_company' ),
    'priority' => 30,
  ) );
}
add_action( 'customize_register', 'nytf_006_customize_register' );

