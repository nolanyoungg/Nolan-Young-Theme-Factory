<?php
/** Shared field-guide content and presentation. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function ridge_river_photo( $class = '', $eager = false ) {
	?><img class="<?php echo esc_attr( $class ); ?>" src="<?php echo esc_url( get_theme_file_uri( 'assets/images/hero/editorial-hero.jpg' ) ); ?>" alt="Sunlit mountain ridge and a layered range of snow-dusted peaks" width="1600" height="1057" loading="<?php echo $eager ? 'eager' : 'lazy'; ?>" decoding="async"><?php
}
function ridge_river_mark( $number = 1 ) {
	$marks = array( 1 => 'assets/icons/mark-1.svg', 2 => 'assets/icons/mark-2.svg', 3 => 'assets/icons/mark-3.svg' );
	?><img class="field-mark" src="<?php echo esc_url( get_theme_file_uri( $marks[ $number ] ) ); ?>" width="40" height="40" alt="" aria-hidden="true"><?php
}
function ridge_river_nav() {
	$links = array( '/' => 'Home', '/about/' => 'Our story', '/services/' => 'Walk with us', '/work/' => 'Field notes', '/blog/' => 'Journal', '/contact/' => 'Plan a walk' );
	foreach ( $links as $path => $label ) {
		printf( '<a href="%s">%s</a>', esc_url( home_url( $path ) ), esc_html( $label ) );
	}
}
function ridge_river_walks() {
	return array(
		array( 'name' => 'Along the river', 'season' => 'A gentle morning', 'distance' => '6 km', 'time' => '3 hours', 'grade' => 'Easy', 'text' => 'Follow the water through open meadows, with time to notice the smaller things.', 'url' => '/services/#day-walks' ),
		array( 'name' => 'The long ridge', 'season' => 'A full day outside', 'distance' => '14 km', 'time' => '7 hours', 'grade' => 'Challenging', 'text' => 'A steady climb, a broad skyline and a well-earned lunch with a view.', 'url' => '/services/featured/' ),
		array( 'name' => 'Find your bearings', 'season' => 'Learn at walking pace', 'distance' => '5 km', 'time' => '4 hours', 'grade' => 'Moderate', 'text' => 'Bring a little curiosity. Get familiar with contours, bearings and the ground beneath you.', 'url' => '/services/#navigation' ),
	);
}
function ridge_river_intro( $label, $title, $text ) {
	?><section class="page-intro container"><a class="back-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">↖ Back to base</a><p class="eyebrow"><?php echo esc_html( $label ); ?></p><h1><?php echo esc_html( $title ); ?></h1><p class="lead"><?php echo esc_html( $text ); ?></p></section><?php
}

