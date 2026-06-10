<?php
function nolan_showcase_theme_01_enqueue_assets() {
  $css = get_template_directory() . '/assets/css/bundle.css';
  $js = get_template_directory() . '/assets/js/bundle.js';
  wp_enqueue_style( '001_nolan_young_theme_meridian_strategy_group', get_template_directory_uri() . '/assets/css/bundle.css', array(), file_exists( $css ) ? filemtime( $css ) : '1.0.0' );
  wp_enqueue_script( '001_nolan_young_theme_meridian_strategy_group', get_template_directory_uri() . '/assets/js/bundle.js', array(), file_exists( $js ) ? filemtime( $js ) : '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'nolan_showcase_theme_01_enqueue_assets' );
