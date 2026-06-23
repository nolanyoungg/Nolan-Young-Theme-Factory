<?php
/**
 * Footer.
 *
 * @package Nolan_Young_Template
 */
?>
<footer class="site-footer">
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
	<div class="site-footer__inner">
		<?php get_template_part( 'template-parts/content', 'footer-widgets' ); ?>
		<div class="site-footer__legal">
			<p>&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?> <?php esc_html_e( 'Northstar Websites. All rights reserved.', 'nolan-young-template' ); ?></p>
			<nav aria-label="<?php esc_attr_e( 'Legal links', 'nolan-young-template' ); ?>">
				<a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>"><?php esc_html_e( 'Privacy policy', 'nolan-young-template' ); ?></a>
				<a href="<?php echo esc_url( home_url( '/terms/' ) ); ?>"><?php esc_html_e( 'Terms', 'nolan-young-template' ); ?></a>
			</nav>
		</div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>

