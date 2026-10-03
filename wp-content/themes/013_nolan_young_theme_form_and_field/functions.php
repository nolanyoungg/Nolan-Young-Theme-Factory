<?php
/** Form & Field theme bootstrap. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
foreach ( array( 'setup', 'enqueue', 'helpers', 'template-tags', 'forms' ) as $form_field_module ) {
	require_once get_template_directory() . '/inc/' . $form_field_module . '.php';
}
