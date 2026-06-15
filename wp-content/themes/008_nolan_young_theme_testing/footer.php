<?php
/**
 * Footer.
 *
 * @package Nolan_Young_Template
 */
?>
<footer class="site-footer">
	<div class="site-footer__inner">
		<?php get_template_part( 'template-parts/content', 'footer-widgets' ); ?>
		<p>&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?></p>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
