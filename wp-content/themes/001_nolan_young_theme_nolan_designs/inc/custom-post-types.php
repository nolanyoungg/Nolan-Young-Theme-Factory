<?php
/**
 * Custom post types.
 *
 * @package Nolan_Young_Template
 */

defined( 'ABSPATH' ) || exit;

function nolan_young_template_register_cpts() {
	register_post_type(
		'project',
		array(
			'label'        => __( 'Work', '001_nolan_young_theme_nolan_designs' ),
			'public'       => true,
			'show_in_rest'  => true,
			'has_archive'   => true,
			'supports'      => array( 'title', 'editor', 'excerpt', 'thumbnail' ),
			'rewrite'       => array( 'slug' => 'work' ),
			'menu_icon'     => 'dashicons-portfolio',
		)
	);

	register_post_type(
		'site_service',
		array(
			'label'        => __( 'Services', '001_nolan_young_theme_nolan_designs' ),
			'public'       => true,
			'show_in_rest'  => true,
			'has_archive'   => true,
			'supports'      => array( 'title', 'editor', 'excerpt', 'thumbnail' ),
			'rewrite'       => array( 'slug' => 'services' ),
			'menu_icon'     => 'dashicons-admin-tools',
		)
	);

	register_post_type(
		'nolan_submission',
		array(
			'label'              => __( 'Forms', '001_nolan_young_theme_nolan_designs' ),
			'public'             => false,
			'show_ui'            => false,
			'show_in_rest'       => false,
			'supports'           => array( 'title' ),
			'capability_type'    => 'post',
			'map_meta_cap'       => true,
			'exclude_from_search'=> true,
		)
	);

	register_post_type(
		'nolan_subscriber',
		array(
			'label'              => __( 'Newsletter', '001_nolan_young_theme_nolan_designs' ),
			'public'             => false,
			'show_ui'            => false,
			'show_in_rest'       => false,
			'supports'           => array( 'title' ),
			'capability_type'    => 'post',
			'map_meta_cap'       => true,
			'exclude_from_search'=> true,
		)
	);
}
add_action( 'init', 'nolan_young_template_register_cpts' );
