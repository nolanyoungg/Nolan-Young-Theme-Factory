<?php
/**
 * Contact form template.
 *
 * Available variables: $title, $status, $redirect_url.
 *
 * @package NolanYoungCore
 */

defined( 'ABSPATH' ) || exit;

$wrapper_classes = apply_filters( 'ny_core_form_classes', array( 'ny-core-form-section' ) );
$wrapper_class   = implode( ' ', array_map( 'sanitize_html_class', (array) $wrapper_classes ) );

$messages = array(
	'received'         => array( 'success', esc_html__( 'Thank you. Your message has been received.', 'nolan-young-core' ) ),
	'validation_error' => array( 'error', esc_html__( 'Complete all required fields and provide a valid email address.', 'nolan-young-core' ) ),
	'invalid_request'  => array( 'error', esc_html__( 'The form session expired. Refresh the page and try again.', 'nolan-young-core' ) ),
	'storage_error'    => array( 'error', esc_html__( 'The message could not be stored. Please try again.', 'nolan-young-core' ) ),
);
?>
<section id="ny-core-contact-form" class="<?php echo esc_attr( $wrapper_class ); ?>" aria-labelledby="ny-core-contact-title">
	<h2 id="ny-core-contact-title"><?php echo esc_html( $title ); ?></h2>
	<?php if ( isset( $messages[ $status ] ) ) : ?>
		<p class="ny-core-message ny-core-message--<?php echo esc_attr( $messages[ $status ][0] ); ?>" role="<?php echo esc_attr( 'error' === $messages[ $status ][0] ? 'alert' : 'status' ); ?>">
			<?php echo esc_html( $messages[ $status ][1] ); ?>
		</p>
	<?php endif; ?>
	<form class="ny-core-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
		<input type="hidden" name="action" value="ny_core_contact_submit">
		<input type="hidden" name="ny_core_redirect_to" value="<?php echo esc_url( $redirect_url ); ?>">
		<?php wp_nonce_field( 'ny_core_contact_submit', 'ny_core_contact_nonce' ); ?>
		<div class="ny-core-honeypot" aria-hidden="true">
			<label for="ny-core-company-website"><?php esc_html_e( 'Company website', 'nolan-young-core' ); ?></label>
			<input id="ny-core-company-website" name="ny_core_company_website" type="text" tabindex="-1" autocomplete="off">
		</div>
		<div class="ny-core-form__row ny-core-form__row--two">
			<p><label for="ny-core-name"><?php esc_html_e( 'Name', 'nolan-young-core' ); ?> <span aria-hidden="true">*</span></label><input id="ny-core-name" name="ny_core_name" type="text" autocomplete="name" required></p>
			<p><label for="ny-core-email"><?php esc_html_e( 'Email', 'nolan-young-core' ); ?> <span aria-hidden="true">*</span></label><input id="ny-core-email" name="ny_core_email" type="email" autocomplete="email" required></p>
		</div>
		<div class="ny-core-form__row ny-core-form__row--two">
			<p><label for="ny-core-phone"><?php esc_html_e( 'Phone', 'nolan-young-core' ); ?></label><input id="ny-core-phone" name="ny_core_phone" type="tel" autocomplete="tel"></p>
			<p><label for="ny-core-subject"><?php esc_html_e( 'Subject', 'nolan-young-core' ); ?></label><input id="ny-core-subject" name="ny_core_subject" type="text"></p>
		</div>
		<p><label for="ny-core-message"><?php esc_html_e( 'Message', 'nolan-young-core' ); ?> <span aria-hidden="true">*</span></label><textarea id="ny-core-message" name="ny_core_message" required></textarea></p>
		<p class="ny-core-consent"><label><input name="ny_core_consent" type="checkbox" value="1" required> <?php esc_html_e( 'I consent to this site storing and processing the information submitted here.', 'nolan-young-core' ); ?></label></p>
		<p><button type="submit"><?php esc_html_e( 'Send message', 'nolan-young-core' ); ?></button></p>
	</form>
</section>
