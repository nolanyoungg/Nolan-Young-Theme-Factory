<?php get_header(); ?>

?>
<main id="primary" class="site-main">
    <header class="page-header">
        <?php
        the_archive_title( '<h1 class="page-title">', '</h1>' );
        the_archive_description( '<div class="archive-description">', '</div>' );
        ?>
    </header>

    <?php if ( have_posts() ) : ?>
        <div class="archive-content">
            <?php while ( have_posts() ) : the_post(); ?>
                <?php get_template_part( 'template-parts/content', get_post_format() ); ?>
            <?php endwhile; ?>

            <?php the_posts_navigation(); ?>
        </div>
    <?php else : ?>
        <?php get_template_part( 'template-parts/content', 'none' ); ?>
    <?php endif; ?>
</main>

<?php get_footer(); ?>