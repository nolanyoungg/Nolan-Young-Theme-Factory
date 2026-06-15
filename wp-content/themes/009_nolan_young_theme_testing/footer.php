<?php
/**
 * Footer template.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ny_contact_url = function_exists( 'nolan_young_theme_get_contact_url' ) ? nolan_young_theme_get_contact_url() : home_url( '/#contact' );
$ny_resources_url = function_exists( 'nolan_young_theme_get_resources_url' ) ? nolan_young_theme_get_resources_url() : home_url( '/#resources' );
?>
	<footer id="colophon" class="site-footer">
		<div class="container site-footer__grid">
			<div class="site-footer__brand">
				<p class="site-footer__eyebrow"><?php esc_html_e( 'Northstar Codeworks', '009_nolan_young_theme_testing' ); ?></p>
				<h2><?php esc_html_e( 'Custom software for service businesses that have outgrown duct-tape operations.', '009_nolan_young_theme_testing' ); ?></h2>
				<p><?php esc_html_e( 'We build internal tools, client portals, integrations, and automation systems that reduce manual work and make operations easier to scale.', '009_nolan_young_theme_testing' ); ?></p>
				<a class="button button--primary" href="<?php echo esc_url( $ny_contact_url ); ?>"><?php esc_html_e( 'Discuss Your Project', '009_nolan_young_theme_testing' ); ?></a>
			</div>

			<div>
				<h3><?php esc_html_e( 'Explore', '009_nolan_young_theme_testing' ); ?></h3>
				<ul class="footer-links">
					<li><a href="<?php echo esc_url( home_url( '/#services' ) ); ?>"><?php esc_html_e( 'Services', '009_nolan_young_theme_testing' ); ?></a></li>
					<li><a href="<?php echo esc_url( home_url( '/#process' ) ); ?>"><?php esc_html_e( 'Process', '009_nolan_young_theme_testing' ); ?></a></li>
					<li><a href="<?php echo esc_url( home_url( '/#work' ) ); ?>"><?php esc_html_e( 'Case Studies', '009_nolan_young_theme_testing' ); ?></a></li>
					<li><a href="<?php echo esc_url( $ny_resources_url ); ?>"><?php esc_html_e( 'Resources', '009_nolan_young_theme_testing' ); ?></a></li>
				</ul>
			</div>

			<div>
				<h3><?php esc_html_e( 'Services', '009_nolan_young_theme_testing' ); ?></h3>
				<ul class="footer-links">
					<li><a href="<?php echo esc_url( home_url( '/#service-web-applications' ) ); ?>"><?php esc_html_e( 'Custom Web Applications', '009_nolan_young_theme_testing' ); ?></a></li>
					<li><a href="<?php echo esc_url( home_url( '/#service-internal-tools' ) ); ?>"><?php esc_html_e( 'Internal Tools', '009_nolan_young_theme_testing' ); ?></a></li>
					<li><a href="<?php echo esc_url( home_url( '/#service-api-integrations' ) ); ?>"><?php esc_html_e( 'API Integrations', '009_nolan_young_theme_testing' ); ?></a></li>
					<li><a href="<?php echo esc_url( home_url( '/#service-automation-systems' ) ); ?>"><?php esc_html_e( 'Automation Systems', '009_nolan_young_theme_testing' ); ?></a></li>
				</ul>
			</div>

			<div>
				<h3><?php esc_html_e( 'Contact', '009_nolan_young_theme_testing' ); ?></h3>
				<ul class="footer-links footer-links--stacked">
					<li><span><?php esc_html_e( 'Email', '009_nolan_young_theme_testing' ); ?>:</span> <a href="mailto:hello@northstarcodeworks.com">hello@northstarcodeworks.com</a></li>
					<li><span><?php esc_html_e( 'Response Time', '009_nolan_young_theme_testing' ); ?>:</span> <?php esc_html_e( 'Within 1 business day', '009_nolan_young_theme_testing' ); ?></li>
					<li><span><?php esc_html_e( 'Focus', '009_nolan_young_theme_testing' ); ?>:</span> <?php esc_html_e( 'B2B web apps, operations platforms, integrations, automation', '009_nolan_young_theme_testing' ); ?></li>
				</ul>

				<form class="footer-newsletter" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
					<input type="hidden" name="action" value="nolan_young_theme_submit_newsletter">
					<?php wp_nonce_field( 'nolan_young_theme_submit_newsletter', 'newsletter_nonce' ); ?>
					<label class="screen-reader-text" for="footer-newsletter-email"><?php esc_html_e( 'Email address', '009_nolan_young_theme_testing' ); ?></label>
					<input id="footer-newsletter-email" type="email" name="email" required>
					<button class="button button--secondary" type="submit"><?php esc_html_e( 'Join Newsletter', '009_nolan_young_theme_testing' ); ?></button>
				</form>
			</div>
		</div>

		<div class="container site-footer__bottom">
			<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php esc_html_e( 'Northstar Codeworks. Built for maintainable growth.', '009_nolan_young_theme_testing' ); ?></p>
			<div class="site-footer__legal">
				<a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>"><?php esc_html_e( 'Privacy', '009_nolan_young_theme_testing' ); ?></a>
				<a href="<?php echo esc_url( home_url( '/terms/' ) ); ?>"><?php esc_html_e( 'Terms', '009_nolan_young_theme_testing' ); ?></a>
			</div>
		</div>
	</footer>
</div>
<?php wp_footer(); ?>
</body>
</html>
