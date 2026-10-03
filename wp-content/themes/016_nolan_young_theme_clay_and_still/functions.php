<?php
/** Clay & Still theme bootstrap. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
foreach ( array( 'setup', 'enqueue', 'helpers', 'template-tags', 'forms' ) as $clay_still_module ) {
	require_once get_template_directory() . '/inc/' . $clay_still_module . '.php';
}

