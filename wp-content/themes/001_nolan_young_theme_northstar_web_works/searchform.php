<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="screen-reader-text" for="search-field"><?php esc_html_e( 'Search for:', '001_nolan_young_theme_northstar_web_works' ); ?></label>
	<input id="search-field" type="search" class="search-field" placeholder="<?php echo esc_attr_x( 'Search the journal', 'placeholder', '001_nolan_young_theme_northstar_web_works' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s">
	<button type="submit" class="button button--primary"><?php esc_html_e( 'Search', '001_nolan_young_theme_northstar_web_works' ); ?></button>
</form>


