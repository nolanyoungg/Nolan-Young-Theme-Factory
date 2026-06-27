<?php
/**
 * Customizer settings for presentation-only front-page content.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register front-page Customizer controls.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 * @return void
 */
function nytt01_customize_register( $wp_customize ) {
	$wp_customize->add_section(
		'nytt01_front_page',
		array(
			'title'       => esc_html__( 'Front Page Presentation', 'nolan-young-theme-template-01' ),
			'description' => esc_html__( 'Controls presentation text only. Persistent business content belongs in WordPress content or the companion plugin.', 'nolan-young-theme-template-01' ),
			'priority'    => 35,
		)
	);

	$settings = array(
		'hero_eyebrow' => array(
			'default' => esc_html__( 'Strategy, design, and engineering', 'nolan-young-theme-template-01' ),
			'label'   => esc_html__( 'Hero eyebrow', 'nolan-young-theme-template-01' ),
		),
		'hero_heading' => array(
			'default' => esc_html__( 'Web experiences built to perform.', 'nolan-young-theme-template-01' ),
			'label'   => esc_html__( 'Hero heading', 'nolan-young-theme-template-01' ),
		),
		'hero_text' => array(
			'default' => esc_html__( 'A production-ready foundation for service businesses, agencies, and product teams that need a fast, accessible WordPress presence.', 'nolan-young-theme-template-01' ),
			'label'   => esc_html__( 'Hero description', 'nolan-young-theme-template-01' ),
		),
	);

	foreach ( $settings as $setting_id => $setting ) {
		$wp_customize->add_setting(
			'nytt01_' . $setting_id,
			array(
				'default'           => $setting['default'],
				'sanitize_callback' => 'sanitize_text_field',
				'transport'         => 'refresh',
			)
		);

		$wp_customize->add_control(
			'nytt01_' . $setting_id,
			array(
				'label'   => $setting['label'],
				'section' => 'nytt01_front_page',
				'type'    => 'text',
			)
		);
	}
}
add_action( 'customize_register', 'nytt01_customize_register' );
