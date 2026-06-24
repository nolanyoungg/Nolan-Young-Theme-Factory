<?php
defined( 'ABSPATH' ) || exit;
add_action( 'wp_enqueue_scripts', function () { wp_enqueue_style( 'nolan-bundle', get_theme_file_uri( '/assets/css/bundle.css' ), array(), filemtime( get_theme_file_path( '/assets/css/bundle.css' ) ) ); wp_enqueue_script( 'nolan-bundle', get_theme_file_uri( '/assets/js/bundle.js' ), array(), filemtime( get_theme_file_path( '/assets/js/bundle.js' ) ), true ); } );
