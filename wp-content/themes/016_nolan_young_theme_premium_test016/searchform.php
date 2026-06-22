<?php
?>
<form role="search" method="get" class="search-form" action="<?php echo home_url('/'); ?>">
    <label>
        <span class="screen-reader-text"><?php echo _x('Search for:', 'label', 'nolan-young-theme'); ?></span>
        <input type="search" class="search-field" placeholder="<?php echo esc_attr_x('Search ', 'placeholder', 'nolan-young-theme'); ?>" value="<?php echo get_search_query(); ?>" name="s" />
    </label>
    <button type="submit" class="search-submit"><?php echo _x('Search', 'submit button', 'nolan-young-theme'); ?></button>
</form>
