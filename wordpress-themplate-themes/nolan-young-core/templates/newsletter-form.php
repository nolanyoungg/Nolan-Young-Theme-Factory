<?php
/** Newsletter form template. @package NolanYoungCore */

defined( 'ABSPATH' ) || exit;
$wrapper_classes = apply_filters( 'ny_core_form_classes', array( 'ny-core-newsletter' ) );
$wrapper_class   = implode( ' ', array_map( 'sanitize_html_class', (array) $wrapper_classes ) );

$messages = array(
	'subscribed'       => array( 'success', esc_html__( 'Your subscription has been recorded.', 'nolan-young-core' ) ),
	'validation_error' => array( 'error', esc_html__( 'Enter a valid email address and confirm consent.', 'nolan-young-core' ) ),
	'invalid_request'  => array( 'error', esc_html__( 'The form session expired. Refresh the page and try again.', 'nolan-young-core' ) ),
	'storage_error'    => array( 'error', esc_html__( 'The subscription could not be stored. Please try again.', 'nolan-young-core' ) ),
);
?>
<section id="ny-core-newsletter-form" class="<?php echo esc_attr( $wrapper_class ); ?>" aria-labelledby="ny-core-newsletter-title">
	<h2 id="ny-core-newsletter-title"><?php echo esc_html( $title ); ?></h2>
	<?php if ( isset( $messages[ $status ] ) ) : ?>
		<p class="ny-core-message ny-core-message--<?php echo esc_attr( $messages[ $status ][0] ); ?>" role="<?php echo esc_attr( 'error' === $messages[ $status ][0] ? 'alert' : 'status' ); ?>"><?php echo esc_html( $messages[ $status ][1] ); ?></p>
	<?php endif; ?>
	<form class="ny-core-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
		<input type="hidden" name="action" value="ny_core_newsletter_submit">
		<input type="hidden" name="ny_core_redirect_to" value="<?php echo esc_url( $redirect_url ); ?>">
		<?php wp_nonce_field( 'ny_core_newsletter_submit', 'ny_core_newsletter_nonce' ); ?>
		<p class="ny-core-honeypot" aria-hidden="true"><label for="ny-core-fax-number"><?php esc_html_e( 'Fax number', 'nolan-young-core' ); ?></label><input id="ny-core-fax-number" name="ny_core_fax_number" type="text" tabindex="-1" autocomplete="off"></p>
		<p><label for="ny-core-newsletter-email"><?php esc_html_e( 'Email address', 'nolan-young-core' ); ?></label><input id="ny-core-newsletter-email" name="ny_core_newsletter_email" type="email" autocomplete="email" required></p>
		<p class="ny-core-consent"><label><input name="ny_core_newsletter_consent" type="checkbox" value="1" required> <?php esc_html_e( 'I consent to receiving email updates and understand I can unsubscribe.', 'nolan-young-core' ); ?></label></p>
		<p><button type="submit"><?php esc_html_e( 'Subscribe', 'nolan-young-core' ); ?></button></p>
	</form>
</section>
