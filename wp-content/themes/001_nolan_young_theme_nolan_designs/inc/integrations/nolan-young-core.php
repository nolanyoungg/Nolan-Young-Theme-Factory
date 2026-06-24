<?php
defined( 'ABSPATH' ) || exit;
function nytt01_service_link( $slug ) { return home_url( '/services/' . trailingslashit( sanitize_title( $slug ) ) ); }
