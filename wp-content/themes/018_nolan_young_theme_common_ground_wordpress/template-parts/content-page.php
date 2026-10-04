<?php defined( 'ABSPATH' ) || exit; ?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <header class="wrap page-heading"><h1><?php the_title(); ?></h1></header>
    <div class="wrap space-bottom entry-content">
        <?php
        the_content();
        wp_link_pages( array( 'before' => '<nav class="pagination" aria-label="Content pages">', 'after' => '</nav>' ) );
        ?>
    </div>
</article>
