<?php
/**
 * Theme setup.
 *
 * @package Nolan_Young_Template
 */

defined( 'ABSPATH' ) || exit;

function nolan_young_template_setup() {
	load_theme_textdomain( '001_nolan_young_theme_nolan_designs', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo', array( 'height' => 120, 'width' => 360, 'flex-height' => true, 'flex-width' => true ) );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/bundle.css' );

	register_nav_menus(
		array(
			'primary' => __( 'Primary Navigation', '001_nolan_young_theme_nolan_designs' ),
			'footer'  => __( 'Footer Navigation', '001_nolan_young_theme_nolan_designs' ),
		)
	);
}
add_action( 'after_setup_theme', 'nolan_young_template_setup' );
