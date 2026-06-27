<?php
/**
 * Search form.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

$nytt01_search_id = wp_unique_id( 'nytt01-search-field-' );
?>
<form role="search" method="get" class="nytt01-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label for="<?php echo esc_attr( $nytt01_search_id ); ?>">
		<span class="screen-reader-text"><?php echo esc_html_x( 'Search for:', 'label', 'nolan-young-theme-template-01' ); ?></span>
	</label>
	<input id="<?php echo esc_attr( $nytt01_search_id ); ?>" type="search" class="nytt01-search-form__field" placeholder="<?php echo esc_attr_x( 'Search…', 'placeholder', 'nolan-young-theme-template-01' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s">
	<button type="submit" class="nytt01-button"><?php echo esc_html_x( 'Search', 'submit button', 'nolan-young-theme-template-01' ); ?></button>
</form>
