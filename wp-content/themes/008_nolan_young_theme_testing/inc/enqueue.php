<?php
function nolan_young_theme_enqueue_assets() {
  wp_enqueue_style( '008_nolan_young_theme_testing-bundle', get_theme_file_uri( 'assets/css/bundle.css' ), array(), nolan_young_theme_asset_version( 'assets/css/bundle.css' ) );
  wp_enqueue_script( '008_nolan_young_theme_testing-bundle', get_theme_file_uri( 'assets/js/bundle.js' ), array(), nolan_young_theme_asset_version( 'assets/js/bundle.js' ), true );
}
add_action( 'wp_enqueue_scripts', 'nolan_young_theme_enqueue_assets' );
