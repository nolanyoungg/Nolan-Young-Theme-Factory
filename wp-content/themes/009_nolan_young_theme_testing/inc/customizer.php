<?php
function nolan_young_theme_customize_register( $wp_customize ) {
  $wp_customize->add_section( 'nolan_theme_brand', array( 'title' => __( 'Brand Settings', '009_nolan_young_theme_testing' ) ) );
}
add_action( 'customize_register', 'nolan_young_theme_customize_register' );
