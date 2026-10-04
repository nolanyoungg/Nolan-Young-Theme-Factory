<?php
/** Form & Field theme bootstrap. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
foreach ( array( 'setup', 'enqueue', 'helpers', 'template-tags', 'forms', 'policy-routing' ) as $ff_module ) {
    require_once get_template_directory() . '/inc/' . $ff_module . '.php';
}
