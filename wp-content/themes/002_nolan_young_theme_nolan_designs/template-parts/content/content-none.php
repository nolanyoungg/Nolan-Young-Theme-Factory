<?php
/**
 * Empty-results presentation.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;
?>
<section class="nytt01-no-results">
	<header><h1><?php esc_html_e( 'Nothing found', 'nolan-young-theme-template-01' ); ?></h1></header>
	<?php if ( is_search() ) : ?>
		<p><?php esc_html_e( 'No results matched your search. Try different keywords.', 'nolan-young-theme-template-01' ); ?></p>
		<?php get_search_form(); ?>
	<?php else : ?>
		<p><?php esc_html_e( 'There is no content to display yet.', 'nolan-young-theme-template-01' ); ?></p>
	<?php endif; ?>
</section>
