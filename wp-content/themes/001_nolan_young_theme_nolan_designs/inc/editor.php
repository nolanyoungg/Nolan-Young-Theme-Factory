<?php
defined( 'ABSPATH' ) || exit;
add_action( 'enqueue_block_editor_assets', function () { wp_enqueue_style( 'nolan-editor', get_theme_file_uri( '/assets/css/editor.css' ), array(), file_exists( get_theme_file_path( '/assets/css/editor.css' ) ) ? filemtime( get_theme_file_path( '/assets/css/editor.css' ) ) : null ); } );
