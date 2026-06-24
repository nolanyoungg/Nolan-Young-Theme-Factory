<?php
/**
 * Footer template.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;
?>
	<footer id="colophon" class="footer">
		<div class="site-wrap">
			<?php get_template_part( 'template-parts/footer/footer', 'widgets' ); ?>
			<div class="legal-row">
				<p>&copy; <?php echo esc_html( wp_date( 'Y' ) ); ?> <?php echo esc_html( get_bloginfo( 'name' ) ); ?></p>
				<nav aria-label="<?php esc_attr_e( 'Footer legal navigation', 'nolan-young-theme-template-01' ); ?>">
					<ul class="inline-links">
						<li><a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>"><?php esc_html_e( 'Privacy Policy', 'nolan-young-theme-template-01' ); ?></a></li>
					</ul>
				</nav>
			</div>
		</div>
	</footer>
</div>
<?php wp_footer(); ?>
</body>
</html>
