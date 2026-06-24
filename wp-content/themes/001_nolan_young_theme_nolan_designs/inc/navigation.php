<?php
defined( 'ABSPATH' ) || exit;
add_action( 'after_setup_theme', function () { class NYTT01_Primary_Nav_Walker extends Walker_Nav_Menu {} } );
