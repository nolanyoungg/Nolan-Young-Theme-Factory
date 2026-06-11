<?php
function nytf_005_setup() {
  add_theme_support( 'title-tag' );
  add_theme_support( 'post-thumbnails' );
  add_theme_support( 'html5', array( 'search-form', 'comment-form', 'gallery', 'caption', 'style', 'script' ) );
  register_nav_menus( array( 'primary' => esc_html__( 'Primary Menu', '005_nolan_young_theme_flowledger_crm_platform' ) ) );
}
add_action( 'after_setup_theme', 'nytf_005_setup' );

