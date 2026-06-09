<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$brand = nolan_get_studio_brand();
?>
<div class="container footer-widgets">
	<div class="footer-column">
		<p class="kicker"><?php esc_html_e( 'Contact', '001_nolan_young_theme_northstar_web_works' ); ?></p>
		<p><?php esc_html_e( 'hello@northstarwebworks.com', '001_nolan_young_theme_northstar_web_works' ); ?><br><?php esc_html_e( 'Available for remote projects, local launches, and ongoing support in the United States.', '001_nolan_young_theme_northstar_web_works' ); ?></p>
	</div>
	<div class="footer-column">
		<p class="kicker"><?php esc_html_e( 'Newsletter', '001_nolan_young_theme_northstar_web_works' ); ?></p>
		<form class="newsletter-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="nolan_newsletter">
			<?php wp_nonce_field( 'nolan_newsletter', 'nolan_newsletter_nonce' ); ?>
			<label class="screen-reader-text" for="newsletter-email"><?php esc_html_e( 'Email address', '001_nolan_young_theme_northstar_web_works' ); ?></label>
			<input id="newsletter-email" type="email" name="newsletter_email" placeholder="<?php echo esc_attr__( 'Email address', '001_nolan_young_theme_northstar_web_works' ); ?>" required>
			<button class="button button--ghost" type="submit"><?php esc_html_e( 'Join updates', '001_nolan_young_theme_northstar_web_works' ); ?></button>
		</form>
	</div>
	<div class="footer-column">
		<p class="kicker"><?php esc_html_e( 'Policies', '001_nolan_young_theme_northstar_web_works' ); ?></p>
		<ul class="footer-links">
			<?php foreach ( nolan_policy_pages() as $slug => $label ) : ?>
				<li><a href="<?php echo esc_url( home_url( '/' . $slug . '/' ) ); ?>"><?php echo esc_html( $label ); ?></a></li>
			<?php endforeach; ?>
		</ul>
	</div>
</div>


