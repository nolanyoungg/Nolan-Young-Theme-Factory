<?php
/** Local compiled assets. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function ff_enqueue() {
    foreach ( array( 'css' => 'assets/css/bundle.css', 'js' => 'assets/js/bundle.js' ) as $type => $file ) {
        $version = (string) filemtime( get_theme_file_path( $file ) );
        if ( 'css' === $type ) {
            wp_enqueue_style( 'form-field', get_theme_file_uri( $file ), array(), $version );
        } else {
            wp_enqueue_script( 'form-field', get_theme_file_uri( $file ), array(), $version, true );
        }
    }
}
add_action( 'wp_enqueue_scripts', 'ff_enqueue' );
