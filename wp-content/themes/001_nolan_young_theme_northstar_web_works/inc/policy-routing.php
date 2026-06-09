<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_policy_template_include( $template ) {
	if ( is_page() ) {
		$slug = get_post_field( 'post_name', get_queried_object_id() );
		if ( array_key_exists( $slug, nolan_policy_pages() ) ) {
			$policy_template = get_theme_file_path( 'page-templates/template-policy.php' );
			if ( file_exists( $policy_template ) ) {
				return $policy_template;
			}
		}
	}
	return $template;
}
add_filter( 'template_include', 'nolan_policy_template_include' );

