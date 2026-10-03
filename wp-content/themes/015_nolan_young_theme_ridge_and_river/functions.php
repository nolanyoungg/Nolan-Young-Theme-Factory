<?php
/** Ridge & River theme bootstrap. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
foreach ( array( 'setup', 'enqueue', 'helpers', 'forms', 'template-tags' ) as $ridge_river_module ) {
	require_once get_template_directory() . '/inc/' . $ridge_river_module . '.php';
}

