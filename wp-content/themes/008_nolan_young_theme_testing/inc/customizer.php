<?php
// inc/customizer.php - Add customizer options for the Northstar Codeworks theme

function nolan_young_theme_customize_register($wp_customize) {

    // Add a setting for the primary brand color
    $wp_customize->add_setting('primary_brand_color', array('default' => '#2563eb'));

    // Add a control for the primary brand color
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'primary_brand_color_control', array('label' => __('Primary Brand Color', 'nolan_young_theme'), 'section' => 'colors', 'settings' => 'primary_brand_color')));

    // Add a setting for the secondary brand color
    $wp_customize->add_setting('secondary_brand_color', array('default' => '#14b8a6'));

    // Add a control for the secondary brand color
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'secondary_brand_color_control', array('label' => __('Secondary Brand Color', 'nolan_young_theme'), 'section' => 'colors', 'settings' => 'secondary_brand_color')));

    // Add a setting for the accent color
    $wp_customize->add_setting('accent_color', array('default' => '#f97316'));

    // Add a control for the accent color
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'accent_color_control', array('label' => __('Accent Color', 'nolan_young_theme'), 'section' => 'colors', 'settings' => 'accent_color')));

}

add_action('customize_register', 'nolan_young_theme_customize_register');
