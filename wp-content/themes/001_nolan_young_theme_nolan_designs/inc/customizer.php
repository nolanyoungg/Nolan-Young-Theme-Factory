<?php
defined( 'ABSPATH' ) || exit;
add_action( 'customize_register', function ( $customizer ) { $customizer->add_setting( 'nolan_phone', array( 'sanitize_callback' => 'sanitize_text_field' ) ); $customizer->add_control( 'nolan_phone', array( 'label' => __( 'Phone', 'nolan-young-theme-template-01' ), 'section' => 'title_tagline', 'type' => 'text' ) ); } );
