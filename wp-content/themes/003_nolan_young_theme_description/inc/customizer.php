<?php
function nolan_showcase_theme_01_customize_register( $wp_customize ) {
  $wp_customize->add_section( 'meridian_brand', array( 'title' => esc_html__( 'Aster & Field Brand', '003_nolan_young_theme_description' ) ) );
}
add_action( 'customize_register', 'nolan_showcase_theme_01_customize_register' );
