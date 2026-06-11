<?php
function nytf_005_customize_register( $wp_customize ) {
  $wp_customize->add_section( 'nytf_005_brand', array(
    'title' => esc_html__( 'Brand Settings', '005_nolan_young_theme_flowledger_crm_platform' ),
    'priority' => 30,
  ) );
}
add_action( 'customize_register', 'nytf_005_customize_register' );

