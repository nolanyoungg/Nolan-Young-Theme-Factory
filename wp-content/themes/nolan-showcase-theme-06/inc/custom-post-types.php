<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_register_custom_post_types() {
	$types = array(
		'portfolio'   => array( 'singular' => 'Portfolio Item', 'plural' => 'Portfolio', 'slug' => 'work' ),
		'service'     => array( 'singular' => 'Service', 'plural' => 'Services', 'slug' => 'services' ),
		'testimonial'  => array( 'singular' => 'Testimonial', 'plural' => 'Testimonials', 'slug' => 'testimonials' ),
	);

	foreach ( $types as $type => $data ) {
		register_post_type(
			$type,
			array(
				'labels' => array(
					'name'          => $data['plural'],
					'singular_name' => $data['singular'],
				),
				'public'       => true,
				'show_in_rest' => true,
				'has_archive'  => true,
				'rewrite'      => array( 'slug' => $data['slug'] ),
				'menu_icon'    => 'dashicons-format-image',
				'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields' ),
			)
		);
	}
}
add_action( 'init', 'nolan_register_custom_post_types' );

