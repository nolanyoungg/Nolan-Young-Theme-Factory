<?php
/** Shared editorial content for the fictional Clay & Still studio. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function clay_still_url( $path = '/' ) {
	return esc_url( home_url( $path ) );
}
function clay_still_image( $kind = 'white', $class = '', $eager = false ) {
	$images = array(
		'white' => array( 'assets/images/hero/editorial-hero.jpg', 'A group of white ceramic vessels with softly uneven rims — illustrative photograph by Tom Crew', 1600, 1200 ),
		'red' => array( 'assets/images/portfolio/editorial-detail.jpg', 'A slender red ceramic vase on a pale surface — illustrative photograph by 五玄土 ORIENTO', 1600, 870 ),
	);
	$item = isset( $images[ $kind ] ) ? $images[ $kind ] : $images['white'];
	printf( '<img src="%s" alt="%s" class="%s" width="%d" height="%d" loading="%s" decoding="async"%s>', esc_url( get_theme_file_uri( $item[0] ) ), esc_attr( $item[1] ), esc_attr( $class ), $item[2], $item[3], $eager ? 'eager' : 'lazy', $eager ? ' fetchpriority="high"' : '' );
}
function clay_still_navigation() {
	return array( '/' => 'Home', '/about/' => 'Our studio', '/services/' => 'Workshops & more', '/work/' => 'The collection', '/blog/' => 'Journal', '/contact/' => 'Say hello' );
}
function clay_still_forms() {
	return array(
		array( 'number' => '01', 'name' => 'Chalk studies', 'image' => 'white', 'material' => 'Stoneware / soft white glaze', 'description' => 'An imagined family of generous cylinders. Quiet surfaces, an irregular lip, and space for a single branch.' ),
		array( 'number' => '02', 'name' => 'An earthward gesture', 'image' => 'red', 'material' => 'Ceramic / iron-red glaze study', 'description' => 'A slender silhouette exploring the meeting of warm colour and an unhurried curve.' ),
	);
}
function clay_still_notes() {
	return array(
		array( 'id' => 'glaze-notes', 'category' => 'Material notes', 'title' => 'The quiet life of a glaze', 'excerpt' => 'Why a small test tile can hold a whole season of questions.', 'body' => 'A glaze begins as a possibility. On a small test tile, we look for the way it settles into a ridge, thins at an edge, or lets the clay show through. The same mixture can shift with thickness, firing and the clay beneath it. Keeping a notebook beside the kiln turns those differences into something we can return to. For our imagined chalk collection, the aim is a surface with depth rather than a perfect, uniform white.' ),
		array( 'id' => 'vessel-care', 'category' => 'Everyday rituals', 'title' => 'A little care, for a long life', 'excerpt' => 'Gentle habits for the objects you keep close.', 'body' => 'Lift a vessel with both hands and place it on a stable surface. A soft cloth and mild soap are a good starting point for cleaning; dry the base before returning it to a shelf. Avoid sudden temperature changes and abrasive pads. For decorative pieces, use an inner container for water unless the maker confirms that the vessel is watertight. Food, microwave and dishwasher suitability should always come from the maker of the actual object, not its appearance.' ),
		array( 'id' => 'handbuilding', 'category' => 'At the table', 'title' => 'Begin with a pinch of clay', 'excerpt' => 'A first form does not need to be a perfect one.', 'body' => 'Start with a small ball of clay that sits comfortably in your palm. Press a thumb into the centre, then turn the clay slowly as you pinch the walls between finger and thumb. Pause to feel the thickness rather than chasing symmetry. Keep the rim softly rounded and let the form rest when the clay feels too soft. In a workshop, this simple gesture becomes a way to notice pressure, pace and the character of a material.' ),
	);
}

