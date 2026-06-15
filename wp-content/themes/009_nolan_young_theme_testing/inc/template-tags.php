<?php
/**
 * Template helpers.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_young_theme_get_page_url_by_template( $template_name, $fallback ) {
	$page = get_posts(
		array(
			'post_type'      => 'page',
			'posts_per_page' => 1,
			'meta_key'       => '_wp_page_template',
			'meta_value'     => $template_name,
		)
	);

	if ( ! empty( $page ) ) {
		return get_permalink( $page[0] );
	}

	return $fallback;
}

function nolan_young_theme_get_contact_url() {
	return nolan_young_theme_get_page_url_by_template( 'page-templates/template-contact.php', home_url( '/#contact' ) );
}

function nolan_young_theme_get_resources_url() {
	return nolan_young_theme_get_page_url_by_template( 'page-templates/template-blog.php', home_url( '/#resources' ) );
}

function nolan_young_template_fallback_menu() {
	$menu_items = array(
		array(
			'label' => __( 'Home', '009_nolan_young_theme_testing' ),
			'url'   => home_url( '/' ),
		),
		array(
			'label' => __( 'Services', '009_nolan_young_theme_testing' ),
			'url'   => home_url( '/#services' ),
		),
		array(
			'label' => __( 'Work', '009_nolan_young_theme_testing' ),
			'url'   => home_url( '/#work' ),
		),
		array(
			'label' => __( 'Process', '009_nolan_young_theme_testing' ),
			'url'   => home_url( '/#process' ),
		),
		array(
			'label' => __( 'Resources', '009_nolan_young_theme_testing' ),
			'url'   => nolan_young_theme_get_resources_url(),
		),
		array(
			'label' => __( 'About', '009_nolan_young_theme_testing' ),
			'url'   => home_url( '/#about' ),
		),
		array(
			'label' => __( 'Contact', '009_nolan_young_theme_testing' ),
			'url'   => nolan_young_theme_get_contact_url(),
		),
	);

	echo '<ul id="primary-menu" class="menu">';

	foreach ( $menu_items as $menu_item ) {
		echo '<li><a href="' . esc_url( $menu_item['url'] ) . '">' . esc_html( $menu_item['label'] ) . '</a></li>';
	}

	echo '</ul>';
}
