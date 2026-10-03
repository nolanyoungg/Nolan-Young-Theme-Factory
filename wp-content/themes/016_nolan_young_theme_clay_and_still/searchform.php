<?php /** Native WordPress search, separate from demo inquiries. */ ?>
<form role="search" method="get" class="search-form" action="<?php echo clay_still_url(); ?>"><label for="studio-search">Search published studio pages<input id="studio-search" type="search" value="<?php echo esc_attr( get_search_query() ); ?>" name="s"></label><button type="submit" class="button">Search</button></form>

