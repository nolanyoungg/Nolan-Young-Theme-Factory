<?php
/** Ridge & River theme bootstrap. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
foreach ( array( 'setup', 'enqueue', 'helpers', 'forms', 'template-tags' ) as $rr_module ) {
    require_once get_template_directory() . '/inc/' . $rr_module . '.php';
}
