<?php
/** Blue Hour theme bootstrap. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
foreach ( array( 'setup', 'enqueue', 'helpers', 'template-tags' ) as $blue_hour_include ) {
	require_once get_template_directory() . '/inc/' . $blue_hour_include . '.php';
}
