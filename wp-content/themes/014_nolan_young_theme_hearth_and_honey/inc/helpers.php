<?php
/** Shared bakery content; all prices and visit details are fictional samples. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function hearth_honey_link( $path, $label, $class = '' ) {
    printf( '<a class="%s" href="%s">%s</a>', esc_attr( $class ), esc_url( home_url( $path ) ), esc_html( $label ) );
}
function hearth_honey_photo( $kind = 'hero', $class = '', $eager = false ) {
    $photos = array(
        'hero' => array( 'assets/images/hero/editorial-hero.jpg', 'Several loaves of artisan bread on a rack' ),
        'detail' => array( 'assets/images/portfolio/editorial-detail.jpg', 'A bunch of loaves of bread in a basket' ),
    );
    $photo = $photos[ $kind ];
    printf( '<img class="%s" src="%s" alt="%s" loading="%s" decoding="async"%s>', esc_attr( $class ), esc_url( get_theme_file_uri( $photo[0] ) ), esc_attr( $photo[1] ), $eager ? 'eager' : 'lazy', $eager ? ' fetchpriority="high"' : '' );
}
function hearth_honey_nav() {
    foreach ( array( '/' => 'Home', '/about/' => 'Our story', '/services/' => 'Bake menu', '/work/' => 'Seasonal bakes', '/blog/' => 'Journal', '/contact/' => 'Visit us' ) as $path => $label ) {
        hearth_honey_link( $path, $label );
    }
}
function hearth_honey_menu() {
    return array(
        array( 'House sourdough', 'A crackly crust, an open crumb, a little tang.', '$8', 'Wheat' ),
        array( 'Seeded country loaf', 'Toasted sesame, sunflower and flax.', '$9', 'Wheat, sesame' ),
        array( 'Rosemary focaccia', 'Olive oil, flaky salt, soft golden edges.', '$6', 'Wheat' ),
        array( 'Honey butter bun', 'Soft, swirled and brushed with honey.', '$4.50', 'Wheat, milk, egg' ),
    );
}
function hearth_honey_intro( $kicker, $title, $copy ) {
    echo '<header class="page-intro container"><p class="eyebrow">' . esc_html( $kicker ) . '</p><h1>' . esc_html( $title ) . '</h1><p class="lede">' . esc_html( $copy ) . '</p></header>';
}
