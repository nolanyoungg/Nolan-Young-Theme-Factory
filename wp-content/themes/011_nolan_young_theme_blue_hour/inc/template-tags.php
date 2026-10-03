<?php
/** Blue Hour shared navigation. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function blue_hour_footer_links() {
	foreach ( blue_hour_nav() as $path => $label ) { blue_hour_link( $path, $label ); }
}
