<?php
/** Full editor replacement keeps the original full-width layout available. */
defined( 'ABSPATH' ) || exit;
?>
<div class="entry-content cground-designed-content">
<?php
the_content();
wp_link_pages( array( 'before' => '<nav class="wrap pagination" aria-label="Content pages">', 'after' => '</nav>' ) );
?>
</div>
