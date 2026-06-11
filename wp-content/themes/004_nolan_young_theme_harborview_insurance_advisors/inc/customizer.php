<?php
function nytf_004_customize_register( $wp_customize ) {
  $wp_customize->add_section( 'nytf_004_brand', array(
    'title' => esc_html__( 'Brand Settings', '004_nolan_young_theme_harborview_insurance_advisors' ),
    'priority' => 30,
  ) );
}
add_action( 'customize_register', 'nytf_004_customize_register' );

