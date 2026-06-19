<?php
// Custom Search Form Template

echo '<form role="search" method="get" class="search-form" action="' . esc_url(home_url('/')) . '">';
echo '<label>';
echo '<span class="screen-reader-text">' . _x('Search for:', 'label', 'nolan-yong') . '</span>';
echo '<input type="search" class="search-field" placeholder="' . esc_attr_x('Search ', 'placeholder', 'nolan-yong') . '" value="' . get_search_query() . '" name="s" />';
echo '</label>';
echo '<button type="submit" class="search-submit"><span class="screen-reader-text">' . _x('Search', 'submit button', 'nolan-yong') . '</span></button>';
echo '</form>';
?>