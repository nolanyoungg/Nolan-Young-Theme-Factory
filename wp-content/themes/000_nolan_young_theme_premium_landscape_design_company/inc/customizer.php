<?php
function aster_grove_customize_register( $wp_customize ) {
  $wp_customize->add_section( 'aster_grove_brand', array(
    'title' => esc_html__( 'Aster Grove Brand', '000_nolan_young_theme_premium_landscape_design_company' ),
    'priority' => 30,
  ) );
}
add_action( 'customize_register', 'aster_grove_customize_register' );
