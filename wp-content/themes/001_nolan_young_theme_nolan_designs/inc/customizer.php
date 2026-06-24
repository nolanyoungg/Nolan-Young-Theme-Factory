<?php
/** Front-page presentation Customizer. */
defined( 'ABSPATH' ) || exit;
function nytt01_customize_register( $c ) { $c->add_section( 'nytt01_front_page', array( 'title' => __( 'Front Page Presentation', 'nolan-young-theme-template-01' ), 'priority' => 35 ) ); foreach ( array( 'hero_eyebrow' => __( 'Strategy, design, and engineering', 'nolan-young-theme-template-01' ), 'hero_heading' => __( 'Web experiences built to perform.', 'nolan-young-theme-template-01' ), 'hero_text' => __( 'A production-ready foundation for service businesses that need a fast, accessible WordPress presence.', 'nolan-young-theme-template-01' ) ) as $id => $default ) { $c->add_setting( 'nytt01_' . $id, array( 'default' => $default, 'sanitize_callback' => 'sanitize_text_field' ) ); $c->add_control( 'nytt01_' . $id, array( 'section' => 'nytt01_front_page', 'label' => ucfirst( str_replace( '_', ' ', $id ) ), 'type' => 'text' ) ); } }
add_action( 'customize_register', 'nytt01_customize_register' );
