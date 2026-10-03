<?php
/** Shared editorial headings. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function form_field_page_heading( $number, $label, $title, $intro ) {
	?>
	<header class="page-heading container">
		<p class="eyebrow"><?php echo esc_html( $number . ' / ' . $label ); ?></p>
		<div class="page-heading__grid"><h1><?php echo esc_html( $title ); ?></h1><p class="lede"><?php echo esc_html( $intro ); ?></p></div>
	</header>
	<?php
}
