<?php
defined( 'ABSPATH' ) || exit;
?>
<footer class="site-footer">
	<div class="site-footer__cta">
		<h2><?php esc_html_e( 'Ready to build a clearer site?', '001_nolan_young_theme_nolan_designs' ); ?></h2>
		<a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '001_nolan_young_theme_nolan_designs' ); ?></a>
	</div>
	<div class="site-footer__grid">
		<div><?php get_template_part( 'template-parts/content', 'footer-widgets' ); ?></div>
	</div>
	<div class="site-footer__legal">
		<p>&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?></p>
		<a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>"><?php esc_html_e( 'Privacy Policy', '001_nolan_young_theme_nolan_designs' ); ?></a>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
