<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
function rr_enqueue() {
    foreach ( array( 'css', 'js' ) as $type ) {
        $relative = 'assets/' . $type . '/bundle.' . $type;
        $version = (string) filemtime( get_theme_file_path( $relative ) );
        if ( 'css' === $type ) {
            wp_enqueue_style( 'ridge-river', get_theme_file_uri( $relative ), array(), $version );
        } else {
            wp_enqueue_script( 'ridge-river', get_theme_file_uri( $relative ), array(), $version, true );
        }
    }
}
add_action( 'wp_enqueue_scripts', 'rr_enqueue' );
