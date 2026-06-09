<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="screen-reader-text" for="search-field"><?php esc_html_e( 'Search for:', 'nolan-showcase-theme-06' ); ?></label>
	<input id="search-field" type="search" class="search-field" placeholder="<?php echo esc_attr_x( 'Search the journal', 'placeholder', 'nolan-showcase-theme-06' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s">
	<button type="submit" class="button button--primary"><?php esc_html_e( 'Search', 'nolan-showcase-theme-06' ); ?></button>
</form>

