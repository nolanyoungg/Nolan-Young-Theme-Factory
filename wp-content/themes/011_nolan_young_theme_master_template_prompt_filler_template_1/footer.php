<?php
/**
 * Footer.
 *
 * @package Nolan_Young_Template
 */
?>
<footer class="site-footer">
	<div class="footer-cta">
		<div class="container footer-cta__inner">
			<div>
				<p class="eyebrow"><?php esc_html_e( 'Ready for a clearer website?', 'nolan-young-template' ); ?></p>
				<h2><?php esc_html_e( 'Plan a WordPress site that is easier to explain, easier to use, and easier to maintain.', 'nolan-young-template' ); ?></h2>
			</div>
			<a class="btn btn-primary" href="<?php echo nolan_young_template_page_url( 'contact/' ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-template' ); ?></a>
		</div>
	</div>
	<div class="container site-footer__inner">
		<?php get_template_part( 'template-parts/content', 'footer-widgets' ); ?>
		<div class="site-footer__bottom">
			<p>&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?> <?php esc_html_e( 'Northstar Websites. All rights reserved.', 'nolan-young-template' ); ?></p>
			<nav aria-label="<?php esc_attr_e( 'Legal links', 'nolan-young-template' ); ?>">
				<a href="<?php echo nolan_young_template_page_url( 'privacy-policy/' ); ?>"><?php esc_html_e( 'Privacy Policy', 'nolan-young-template' ); ?></a>
				<a href="<?php echo nolan_young_template_page_url( 'terms/' ); ?>"><?php esc_html_e( 'Terms', 'nolan-young-template' ); ?></a>
			</nav>
		</div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
