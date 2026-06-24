<?php
defined( 'ABSPATH' ) || exit;
add_action( 'init', function () { register_block_style( 'core/button', array( 'name' => 'primary', 'label' => __( 'Primary', 'nolan-young-theme-template-01' ) ) ); } );
