<?php
/**
 * Policy routing.
 *
 * @package Nolan_Young_Template
 */

defined( 'ABSPATH' ) || exit;

function nolan_young_template_policy_template( $template ) {
	if ( is_page_template( 'page-templates/template-policy.php' ) ) {
		return get_theme_file_path( 'page-templates/template-policy.php' );
	}
	return $template;
}
add_filter( 'template_include', 'nolan_young_template_policy_template' );
