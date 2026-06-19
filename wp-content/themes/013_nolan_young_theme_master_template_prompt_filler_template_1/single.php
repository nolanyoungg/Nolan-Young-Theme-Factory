<?php get_header(); ?>

?>
<main id="primary" class="site-main">
    <?php while ( have_posts() ) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <header class="entry-header">
                <?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
            </header>

            <div class="entry-content">
                <?php the_content(); ?>
                <?php
                wp_link_pages(
                    array(
                        'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'textdomain' ),
                        'after'  => '</div>',
                    )
                );
                ?>
            </div>

            <footer class="entry-footer">
                <?php edit_post_link( esc_html__( 'Edit', 'textdomain' ), '<span class="edit-link">', '</span>' ); ?>
            </footer>
        </article><!-- #post-<?php the_ID(); ?> -->
    <?php endwhile; // End of the loop. ?>
</main>

<?php get_footer(); ?>