<?php /** Standard page fallback for Clay & Still. */
get_header(); ?>
<main id="primary"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'page' ); endwhile; else : ?><div class="wrap section-space"><?php get_template_part( 'template-parts/content', 'none' ); ?></div><?php endif; ?></main>
<?php get_footer(); ?>

