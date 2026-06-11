<?php
function aster_grove_setup() {
  add_theme_support( 'title-tag' );
  add_theme_support( 'post-thumbnails' );
  add_theme_support( 'html5', array( 'search-form', 'comment-form', 'gallery', 'caption', 'style', 'script' ) );
  register_nav_menus( array( 'primary' => esc_html__( 'Primary Menu', '000_nolan_young_theme_premium_landscape_design_company' ) ) );
}
add_action( 'after_setup_theme', 'aster_grove_setup' );
