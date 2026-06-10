<?php
function nolan_showcase_theme_01_setup() {
  add_theme_support( 'title-tag' );
  add_theme_support( 'post-thumbnails' );
  add_theme_support( 'html5', array( 'search-form', 'comment-form', 'gallery', 'caption', 'style', 'script' ) );
  register_nav_menus( array( 'primary' => esc_html__( 'Primary Menu', '002_nolan_young_theme_marlow_finch_studio' ) ) );
}
add_action( 'after_setup_theme', 'nolan_showcase_theme_01_setup' );
