<?php get_header(); ?>
<main id="primary" class="container section"><?php ridge_river_back_home(); ?><p class="eyebrow">RIDGE & RIVER / JOURNAL ARCHIVE</p><?php the_archive_title( '<h1>', '</h1>' ); ?>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_navigation(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?>
</main><?php get_footer(); ?>

