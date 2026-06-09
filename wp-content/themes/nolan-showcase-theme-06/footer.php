<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
</main>
<footer class="site-footer">
	<?php get_template_part( 'template-parts/content', 'footer-widgets' ); ?>
	<div class="container footer-bottom">
		<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php echo esc_html( nolan_get_studio_brand()['name'] ); ?>.</p>
		<p><?php esc_html_e( 'Local-first WordPress builds with practical assets and a calm, polished workflow.', 'nolan-showcase-theme-06' ); ?></p>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>


