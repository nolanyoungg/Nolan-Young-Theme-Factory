<?php get_header(); ?>
<main id="primary" class="container narrow section"><a class="back-link" href="<?php echo clay_url(); ?>">← Home</a><p class="eyebrow">The studio archive</p><?php the_archive_title( '<h1>', '</h1>' ); ?><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_navigation(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?></main>
<?php get_footer(); ?>
