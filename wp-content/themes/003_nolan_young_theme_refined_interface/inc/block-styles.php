<?php
/**
 * Theme-owned block style variations.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register block style variations.
 *
 * @return void
 */
function nytt01_register_block_styles() {
	register_block_style(
		'core/group',
		array(
			'name'  => 'nytt01-card',
			'label' => esc_html__( 'Nolan Young Card', 'nolan-young-theme-template-01' ),
		)
	);

	register_block_style(
		'core/button',
		array(
			'name'  => 'nytt01-outline',
			'label' => esc_html__( 'Nolan Young Outline', 'nolan-young-theme-template-01' ),
		)
	);
}
add_action( 'init', 'nytt01_register_block_styles' );


/**
 * Register project-specific pattern categories.
 *
 * @return void
 */
function nytt01_register_pattern_categories() {
	$categories = array(
		'portfolio'    => esc_html__( 'Portfolio', 'nolan-young-theme-template-01' ),
		'services'     => esc_html__( 'Services', 'nolan-young-theme-template-01' ),
		'testimonials' => esc_html__( 'Testimonials', 'nolan-young-theme-template-01' ),
	);

	foreach ( $categories as $slug => $label ) {
		register_block_pattern_category( $slug, array( 'label' => $label ) );
	}
}
add_action( 'init', 'nytt01_register_pattern_categories' );
