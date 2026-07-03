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
			<p>&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?> <?php esc_html_e( 'Brightlane Commerce Engineering.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p>
			<nav aria-label="<?php esc_attr_e( 'Legal links', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?>">
				<a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>"><?php esc_html_e( 'Privacy policy', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a>
			</nav>
		</div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
