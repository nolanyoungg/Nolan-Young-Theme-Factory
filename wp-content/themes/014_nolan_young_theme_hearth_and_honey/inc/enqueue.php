<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
function hearth_honey_enqueue() {
    foreach ( array( 'css', 'js' ) as $type ) {
        $file = 'assets/' . $type . '/bundle.' . $type;
        $version = (string) filemtime( get_theme_file_path( $file ) );
        if ( 'css' === $type ) {
            wp_enqueue_style( 'hearth-honey', get_theme_file_uri( $file ), array(), $version );
        } else {
            wp_enqueue_script( 'hearth-honey', get_theme_file_uri( $file ), array(), $version, true );
        }
    }
}
add_action( 'wp_enqueue_scripts', 'hearth_honey_enqueue' );
