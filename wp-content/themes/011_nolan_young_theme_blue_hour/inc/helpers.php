<?php
/** Small shared presentation helpers for Blue Hour. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function blue_hour_link( $path, $label, $class = '' ) {
	printf( '<a class="%s" href="%s">%s</a>', esc_attr( $class ), esc_url( home_url( $path ) ), esc_html( $label ) );
}
function blue_hour_photo( $kind = 'detail', $class = '', $eager = false ) {
	$path = 'hero' === $kind ? 'assets/images/hero/editorial-hero.jpg' : 'assets/images/portfolio/editorial-detail.jpg';
	printf( '<img class="%s" src="%s" alt="Piano keys — illustrative stock photograph" loading="%s" decoding="async"%s>', esc_attr( $class ), esc_url( get_theme_file_uri( $path ) ), $eager ? 'eager' : 'lazy', $eager ? ' fetchpriority="high"' : '' );
}
function blue_hour_nav() {
	return array( '/' => 'Home', '/about/' => 'The room', '/services/' => 'The sessions', '/work/' => 'Past notes', '/blog/' => 'Journal', '/contact/' => 'Visit & inquire' );
}
function blue_hour_intro( $number, $title, $text ) {
	?>
	<section class="page-intro container">
		<p class="eyebrow"><?php echo esc_html( 'Blue Hour / ' . $number ); ?></p>
		<h1><?php echo esc_html( $title ); ?></h1>
		<p class="lead"><?php echo esc_html( $text ); ?></p>
	</section>
	<?php
}
function blue_hour_bill() {
	return array(
		array( 'THU', '12', 'Soft edges, sharp keys.', 'After-dark piano trio', '19:30 / 21:00', 'A lyrical piano lead, a steady bass pulse, and brushes that leave room for the melody.' ),
		array( 'FRI', '13', 'The velvet interval.', 'Voice & upright bass', '20:00 / 21:30', 'A voice and a bass trade lines in a spare, close-up conversation. Familiar song forms take an unexpected turn.' ),
		array( 'SAT', '14', 'Between the grooves.', 'Deep-listening vinyl night', '19:00 / 22:00', 'Side-long selections, unhurried transitions, and a host who shares just enough context before the needle drops.' ),
	);
}
function blue_hour_form() {
	?>
	<form class="inquiry-form" data-demo-form aria-describedby="demo-note" onsubmit="return false;">
		<p class="eyebrow">Booking notebook</p>
		<h2>Tell us your idea.</h2>
		<p id="demo-note">This is a static demo. Nothing is sent, stored, or booked. Please use sample details only.</p>
		<label for="inquiry-name">Your name<input id="inquiry-name" name="name" autocomplete="off" required></label>
		<label for="inquiry-email">Email address<input id="inquiry-email" name="email" type="email" autocomplete="off" required></label>
		<label for="inquiry-kind">What brings you here?<select id="inquiry-kind" name="interest"><option>Private listening event</option><option>A question about visiting</option><option>Programming conversation</option></select></label>
		<label for="inquiry-message">A few details<textarea id="inquiry-message" name="message" rows="4" required placeholder="An occasion, a preferred month, a little about your group…"></textarea></label>
		<button class="button" type="button" data-demo-submit>Preview inquiry <span aria-hidden="true">↗</span></button>
		<p role="status" data-form-status></p>
		<noscript><p>This sample form does not submit. JavaScript enables a local completeness check only.</p></noscript>
	</form>
	<?php
}
