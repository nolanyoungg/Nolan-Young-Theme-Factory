<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
  <label>
    <span class="screen-reader-text"><?php esc_html_e( 'Search for:', '008_nolan_young_theme_testing' ); ?></span>
    <input type="search" class="search-field" placeholder="<?php esc_attr_e( 'Search resources', '008_nolan_young_theme_testing' ); ?>" value="<?php echo get_search_query(); ?>" name="s">
  </label>
  <button type="submit" class="btn btn-secondary"><?php esc_html_e( 'Search', '008_nolan_young_theme_testing' ); ?></button>
</form>
