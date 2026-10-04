<?php
/** Shared Clay & Still editorial content. Photography is illustrative stock. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function clay_url( $path = '/' ) { return esc_url( home_url( $path ) ); }
function clay_image( $key = 'hero', $class = '', $eager = false ) {
	$photos = array(
		'hero' => array( 'assets/images/hero/editorial-hero.jpg', 'A group of white ceramic vessels with softly irregular rims', 1600, 1200 ),
		'detail' => array( 'assets/images/portfolio/editorial-detail.jpg', 'A slender red ceramic vase on a pale surface', 1600, 870 ),
	);
	$photo = $photos[ $key ];
	printf( '<img src="%s" alt="%s" class="%s" width="%d" height="%d" loading="%s" decoding="async"%s>',
		esc_url( get_theme_file_uri( $photo[0] ) ), esc_attr( $photo[1] ), esc_attr( $class ), $photo[2], $photo[3],
		$eager ? 'eager' : 'lazy', $eager ? ' fetchpriority="high"' : '' );
}
function clay_mark( $number = 1 ) {
	$file = 2 === $number ? 'assets/icons/mark-2.svg' : 'assets/icons/mark-1.svg';
	printf( '<img class="studio-mark" src="%s" alt="" width="48" height="48" aria-hidden="true">', esc_url( get_theme_file_uri( $file ) ) );
}
function clay_nav() {
	$links = array( '/' => 'Home', '/about/' => 'Our studio', '/work/' => 'The collection', '/services/' => 'Workshops & more', '/blog/' => 'Journal', '/contact/' => 'Visit & inquire' );
	foreach ( $links as $url => $label ) {
		printf( '<a href="%s">%s</a>', clay_url( $url ), esc_html( $label ) );
	}
}
function clay_articles() {
	return array(
		array( 'id' => 'glaze-notes', 'tag' => '01 / Material notes', 'title' => 'The quiet life of a glaze', 'intro' => 'A surface is never just a colour. Light, thickness and the heat of the kiln all leave their trace.', 'body' => 'We begin with a small test tile and look at it in morning light, then again at dusk. A glaze that feels flat on a tile can gather beautifully at the foot of a vessel. Keeping a written record of each test lets us return to a feeling without expecting two firings to be identical. Variation belongs to the material; it is part of what makes a small collection feel alive.' ),
		array( 'id' => 'care', 'tag' => '02 / Everyday rituals', 'title' => 'A little care, a longer life', 'intro' => 'Make room for a gentle routine: warm water, a soft cloth and somewhere safe to dry.', 'body' => 'Hand wash delicate ceramics with mild soap and dry them fully before putting them away. Avoid sudden changes between hot and cold, and protect an unglazed base from prolonged moisture. Use a coaster beneath a vase on timber furniture. Food, dishwasher and microwave suitability must be confirmed for each actual piece; the vessels pictured here are illustrative and carry no such claims.' ),
		array( 'id' => 'handbuilding', 'tag' => '03 / At the clay table', 'title' => 'Start with the palm of your hand', 'intro' => 'A pinch pot is a small lesson in attention. Turn the clay, feel the wall, and begin again.', 'body' => 'Start with a soft ball of clay and press a thumb into its centre, leaving a generous base. Work slowly around the wall with small, even pinches. Let the form rest when the clay becomes too soft to support itself. A slightly uneven rim can be a beautiful record of the hand. Our introductory workshop makes room for this kind of patient, unhurried learning.' ),
	);
}
function clay_page_intro( $label, $title, $copy ) {
	?>
	<section class="page-intro container"><a class="back-link" href="<?php echo clay_url(); ?>">Home / <?php echo esc_html( $label ); ?></a><p class="eyebrow"><?php echo esc_html( $label ); ?></p><h1><?php echo esc_html( $title ); ?></h1><p class="intro-copy"><?php echo esc_html( $copy ); ?></p></section>
	<?php
}
