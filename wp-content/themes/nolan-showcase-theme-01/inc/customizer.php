<?php
function nolan_showcase_theme_01_customize_register( $wp_customize ) {
  $wp_customize->add_section( 'meridian_brand', array( 'title' => esc_html__( 'Meridian Brand', 'nolan-showcase-theme-01' ) ) );
}
add_action( 'customize_register', 'nolan_showcase_theme_01_customize_register' );
