<?php
/**
 * Theme setup.
 *
 * @package Nolan_Young_Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_young_template_setup() {
	load_theme_textdomain( '007-nolan-young-theme-atlasframe-digital', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo', array( 'height' => 96, 'width' => 320, 'flex-height' => true, 'flex-width' => true ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/bundle.css' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
	register_nav_menus(
		array(
			'primary' => esc_html__( 'Primary Navigation', '007-nolan-young-theme-atlasframe-digital' ),
			'footer'  => esc_html__( 'Footer Navigation', '007-nolan-young-theme-atlasframe-digital' ),
		)
	);
}
add_action( 'after_setup_theme', 'nolan_young_template_setup' );

function nolan_young_template_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'nolan_young_template_content_width', 1120 );
}
add_action( 'after_setup_theme', 'nolan_young_template_content_width', 0 );

