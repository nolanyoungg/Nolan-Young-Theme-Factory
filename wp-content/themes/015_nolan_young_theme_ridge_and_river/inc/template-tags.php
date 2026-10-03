<?php
/** Small navigation helper for editorial content. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function ridge_river_back_home() {
	printf( '<a class="back-link" href="%s">↖ Back to base</a>', esc_url( home_url( '/' ) ) );
}

