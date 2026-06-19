<?php

function nolan_yong_customize_register($wp_customize) {
    $wp_customize->add_section('nolan_young_brand_section', array(
        'title'    => __('Brand Settings', '013_nolan_young_theme_master_template_prompt_filler_template_1'),
        'priority' => 30,
    ));

    $wp_customize->add_setting('nolan_young_business_slogan', array(
        'default'           => __('Websites that help businesses grow.', '013_nolan_young_theme_master_template_prompt_filler_template_1'),
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('nolan_young_business_slogan', array(
        'label'    => __('Business Slogan', '013_nolan_young_theme_master_template_prompt_filler_template_1'),
        'section'  => 'nolan_young_brand_section',
        'settings' => 'nolan_young_business_slogan',
        'type'     => 'text',
    ));

    $wp_customize->add_setting('nolan_young_logo_url', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ));

    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'nolan_young_logo_url', array(
        'label'    => __('Logo Upload', '013_nolan_young_theme_master_template_prompt_filler_template_1'),
        'section'  => 'nolan_young_brand_section',
        'settings' => 'nolan_young_logo_url',
    )));
}

add_action('customize_register', 'nolan_yong_customize_register');
