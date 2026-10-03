<?php
/** Hearth & Honey theme bootstrap. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
foreach ( array( 'setup', 'enqueue', 'helpers', 'forms', 'template-tags' ) as $hearth_module ) {
    require_once get_template_directory() . '/inc/' . $hearth_module . '.php';
}
