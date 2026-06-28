<?php
/**
 * Site footer.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;
?>
	<footer id="colophon" class="nytt01-site-footer">
		<div class="nytt01-container">
			<?php get_template_part( 'template-parts/footer/footer', 'widgets' ); ?>
			<div class="nytt01-site-footer__legal">
				<p>
					<?php
					printf(
						/* translators: 1: Current year. 2: Site title. */
						esc_html__( '© %1$s %2$s. All rights reserved.', 'nolan-young-theme-template-01' ),
						esc_html( wp_date( 'Y' ) ),
						esc_html( get_bloginfo( 'name' ) )
					);
					?>
				</p>
				<?php
				wp_nav_menu(
					array(
						'theme_location'  => 'footer',
						'container'       => 'nav',
						'container_class' => 'nytt01-footer-navigation',
						'menu_class'      => 'nytt01-footer-menu',
						'fallback_cb'     => false,
						'depth'           => 1,
					)
				);
				?>
			</div>
		</div>
	</footer>
</div>
<?php wp_footer(); ?>
</body>
</html>
