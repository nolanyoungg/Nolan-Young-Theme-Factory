<?php
/** Shared field-guide content and local imagery. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function rr_link( $path, $label, $class = '' ) {
    printf( '<a class="%s" href="%s">%s</a>', esc_attr( $class ), esc_url( home_url( $path ) ), esc_html( $label ) );
}
function rr_photo( $class = '', $eager = false ) {
    printf( '<img class="%s" src="%s" alt="Landscape photography of a mountain range, with a winding path along the foreground ridge" width="1600" height="1057" loading="%s" decoding="async"%s>', esc_attr( $class ), esc_url( get_theme_file_uri( 'assets/images/hero/editorial-hero.jpg' ) ), $eager ? 'eager' : 'lazy', $eager ? ' fetchpriority="high"' : '' );
}
function rr_mark( $number = 1 ) {
    printf( '<img class="field-mark" src="%s" width="48" height="48" alt="" aria-hidden="true">', esc_url( get_theme_file_uri( 'assets/icons/mark-' . absint( $number ) . '.svg' ) ) );
}
function rr_navigation() {
    return array( '/' => 'Home', '/about/' => 'Our story', '/services/' => 'Walk with us', '/work/' => 'Field notes', '/blog/' => 'Journal', '/contact/' => 'Plan a walk' );
}
function rr_walks() {
    return array(
        array( '01', 'River & woodland loop', 'Easy', '6 km', '3 hours', 'A gentle morning of riverside paths, leaf shade and time to stop.', '/work/#river' ),
        array( '02', 'The long ridge', 'Challenging', '14 km', '7 hours', 'A full day following the skyline, with steady climbs and wide horizons.', '/services/featured/' ),
        array( '03', 'Find your bearings', 'Moderate', '8 km', '4 hours', 'An unhurried introduction to maps, landmarks and choosing your line.', '/services/#navigation' ),
    );
}
function rr_page_intro( $eyebrow, $title, $text ) {
    echo '<section class="page-intro container"><p class="eyebrow">' . esc_html( $eyebrow ) . '</p><h1>' . esc_html( $title ) . '</h1><p class="lead">' . esc_html( $text ) . '</p></section>';
}
