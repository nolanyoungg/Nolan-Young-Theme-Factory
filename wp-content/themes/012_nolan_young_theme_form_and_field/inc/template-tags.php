<?php
/** Fixed editorial navigation for the sample pages. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function ff_navigation() {
    foreach ( array( '/' => 'Home', '/about/' => 'Studio', '/services/' => 'Services', '/work/' => 'Work', '/blog/' => 'Journal', '/contact/' => 'Contact' ) as $path => $label ) {
        printf( '<a href="%s">%s</a>', ff_url( $path ), esc_html( $label ) );
    }
}
