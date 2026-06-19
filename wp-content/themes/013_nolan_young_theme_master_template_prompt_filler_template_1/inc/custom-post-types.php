<?php
// Register custom post types for services and work

function nolan_young_register_custom_post_types() {
    // Services CPT
    register_post_type( 'service', array(
        'labels' => array(
            'name' => __( 'Services', '013_nolan_young_theme_master_template_prompt_filler_template_1' ),
            'singular_name' => __( 'Service', '013_nolan_young_theme_master_template_prompt_filler_template_1' ),
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array( 'title', 'editor', 'thumbnail' ),
    ));

    // Work CPT
    register_post_type( 'work', array(
        'labels' => array(
            'name' => __( 'Work', '013_nolan_young_theme_master_template_prompt_filler_template_1' ),
            'singular_name' => __( 'Work', '013_nolan_young_theme_master_template_prompt_filler_template_1' ),
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array( 'title', 'editor', 'thumbnail' ),
    ));
}

add_action( 'init', 'nolan_young_register_custom_post_types' );
