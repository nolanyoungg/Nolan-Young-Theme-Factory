<?php
/** Small shared Clay & Still template helpers. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function clay_still_page_intro( $label, $title, $copy ) {
	?>
	<header class="page-intro wrap">
		<a class="back-link" href="<?php echo clay_still_url(); ?>">Home <span aria-hidden="true">/</span> <?php echo esc_html( $label ); ?></a>
		<p class="eyebrow"><?php echo esc_html( $label ); ?></p>
		<h1><?php echo esc_html( $title ); ?></h1>
		<p class="intro-copy"><?php echo esc_html( $copy ); ?></p>
	</header>
	<?php
}

