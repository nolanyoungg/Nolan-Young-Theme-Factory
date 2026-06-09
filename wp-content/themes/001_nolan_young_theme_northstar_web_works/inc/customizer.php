<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_customize_register( $wp_customize ) {
	$wp_customize->add_section(
		'nolan_home',
		array(
			'title'    => __( 'Home Content', '001_nolan_young_theme_northstar_web_works' ),
			'priority' => 30,
		)
	);

	$fields = array(
		'nolan_brand_name' => array(
			'label'   => __( 'Brand name', '001_nolan_young_theme_northstar_web_works' ),
			'default' => nolan_theme_defaults()['brand']['name'],
		),
		'nolan_hero_title' => array(
			'label'   => __( 'Hero title', '001_nolan_young_theme_northstar_web_works' ),
			'default' => nolan_theme_defaults()['brand']['title'],
		),
		'nolan_hero_lede' => array(
			'label'   => __( 'Hero description', '001_nolan_young_theme_northstar_web_works' ),
			'default' => nolan_theme_defaults()['brand']['lede'],
		),
		'nolan_primary_cta_label' => array(
			'label'   => __( 'Primary CTA label', '001_nolan_young_theme_northstar_web_works' ),
			'default' => nolan_theme_defaults()['brand']['primary_cta']['label'],
		),
		'nolan_primary_cta_url' => array(
			'label'   => __( 'Primary CTA URL', '001_nolan_young_theme_northstar_web_works' ),
			'default' => nolan_theme_defaults()['brand']['primary_cta']['url'],
		),
		'nolan_secondary_cta_label' => array(
			'label'   => __( 'Secondary CTA label', '001_nolan_young_theme_northstar_web_works' ),
			'default' => nolan_theme_defaults()['brand']['secondary_cta']['label'],
		),
		'nolan_secondary_cta_url' => array(
			'label'   => __( 'Secondary CTA URL', '001_nolan_young_theme_northstar_web_works' ),
			'default' => nolan_theme_defaults()['brand']['secondary_cta']['url'],
		),
	);

	foreach ( $fields as $setting_id => $field ) {
		$sanitize_callback = 'nolan_sanitize_customizer_value';
		if ( false !== strpos( $setting_id, '_url' ) ) {
			$sanitize_callback = 'esc_url_raw';
		}

		$wp_customize->add_setting(
			$setting_id,
			array(
				'default'           => $field['default'],
				'sanitize_callback' => $sanitize_callback,
				'transport'         => 'refresh',
			)
		);

		$wp_customize->add_control(
			$setting_id,
			array(
				'label'   => $field['label'],
				'section' => 'nolan_home',
				'type'    => 'text',
			)
		);
	}
}
add_action( 'customize_register', 'nolan_customize_register' );

function nolan_sanitize_customizer_value( $value ) {
	return is_string( $value ) ? sanitize_text_field( $value ) : '';
}


