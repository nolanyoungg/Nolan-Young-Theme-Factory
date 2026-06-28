<?php
/**
 * Policy-page content.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'nytt01-entry nytt01-policy' ); ?>>
	<header class="nytt01-entry-header">
		<p class="nytt01-eyebrow"><?php esc_html_e( 'Policy', 'nolan-young-theme-template-01' ); ?></p>
		<?php the_title( '<h1 class="nytt01-entry-title">', '</h1>' ); ?>
		<p class="nytt01-policy__updated">
			<?php
			printf(
				/* translators: %s: Last modified date. */
				esc_html__( 'Last updated: %s', 'nolan-young-theme-template-01' ),
				esc_html( get_the_modified_date() )
			);
			?>
		</p>
	</header>
	<div class="nytt01-entry-content"><?php the_content(); ?></div>
</article>
