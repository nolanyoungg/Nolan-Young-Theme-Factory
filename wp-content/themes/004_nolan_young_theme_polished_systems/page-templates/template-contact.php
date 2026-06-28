<?php
/**
 * Template Name: Contact
 * Template Post Type: page
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main id="primary" class="nytt01-site-main nytt01-page-contact">
	<?php
	while ( have_posts() ) {
		the_post();
		get_template_part( 'template-parts/content/content', 'page' );
	}
	if ( shortcode_exists( 'nolan_young_contact_form' ) ) {
		echo do_shortcode( '[nolan_young_contact_form]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Trusted shortcode output.
	} elseif ( current_user_can( 'activate_plugins' ) ) {
		printf(
			'<p class="nytt01-notice">%s</p>',
			esc_html__( 'Activate the Nolan Young Core plugin to display the contact form.', 'nolan-young-theme-template-01' )
		);
	}
	?>
</main>
<?php
get_footer();
