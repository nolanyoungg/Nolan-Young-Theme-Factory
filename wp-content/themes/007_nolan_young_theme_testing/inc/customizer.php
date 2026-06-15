<?php
// Customizer settings for the theme
function nolan_young_customize_register($wp_customize) {
  // Add a section to the customizer for contact information
  $wp_customize->add_section('nolan_young_contact_info', array(
    'title' => __('Contact Information', '007_nolan_young_theme_testing'),
    'priority' => 30,
  ));

  // Add settings and controls for the contact information
  $wp_customize->add_setting('nolan_young_email', array(
    'default' => 'info@northstarcodeworks.com',
  ));
  $wp_customize->add_control(new WP_Customize_Control($wp_customize, 'nolan_young_email', array(
    'label' => __('Email Address', '007_nolan_young_theme_testing'),
    'section' => 'nolan_young_contact_info',
  )));

  $wp_customize->add_setting('nolan_young_phone', array(
    'default' => '+1234567890',
  ));
  $wp_customize->add_control(new WP_Customize_Control($wp_customize, 'nolan_young_phone', array(
    'label' => __('Phone Number', '007_nolan_young_theme_testing'),
    'section' => 'nolan_young_contact_info',
  )));

  $wp_customize->add_setting('nolan_young_address', array(
    'default' => '123 Business St, Suite 456',
  ));
  $wp_customize->add_control(new WP_Customize_Control($wp_customize, 'nolan_young_address', array(
    'label' => __('Address', '007_nolan_young_theme_testing'),
    'section' => 'nolan_young_contact_info',
  )));
}

add_action('customize_register', 'nolan_young_customize_register');
