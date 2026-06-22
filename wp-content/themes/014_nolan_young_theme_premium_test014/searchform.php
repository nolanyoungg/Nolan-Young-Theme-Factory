<?php
/**
 * Search form template.
 */

$search_form = '<form role="search" method="get" class="search-form" action="' . esc_url(home_url('/')) . '">
?>
    <label>
        <span class="screen-reader-text">' . _x('Search for:', 'label', 'nolan-young-theme') . '</span>
        <input type="search" class="search-field" placeholder="' . esc_attr_x('Search ', 'placeholder', 'nolan-young-theme') . '" value="' . get_search_query() . '" name="s" />
    </label>
    <input type="submit" class="search-submit" value="' . esc_attr_x('Search', 'submit button', 'nolan-young-theme') . '" />
</form>';

echo apply_filters('get_search_form', $search_form);
?>
