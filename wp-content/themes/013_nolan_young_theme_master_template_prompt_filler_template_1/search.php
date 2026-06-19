<?php get_header(); ?>

?>
<main id="primary" class="site-main">
    <header class="page-header">
        <h1><?php printf( esc_html__( 'Search Results for: %s', 'textdomain' ), '<span>' . get_search_query() . '</span>' ); ?></h1>
    </header>

    <?php if ( have_posts() ) : ?>
        <div class="search-content">
            <?php while ( have_posts() ) : the_post(); ?>
                <?php get_template_part( 'template-parts/content', 'search' ); ?>
            <?php endwhile; ?>

            <?php the_posts_navigation(); ?>
        </div>
    <?php else : ?>
        <?php get_template_part( 'template-parts/content', 'none' ); ?>
    <?php endif; ?>
</main>

<?php get_footer(); ?>