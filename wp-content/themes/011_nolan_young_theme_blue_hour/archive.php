<?php get_header(); ?>
<main id="primary"><header class="page-intro container"><p class="eyebrow">Blue Hour / Collected notes</p><?php the_archive_title( '<h1>', '</h1>' ); ?><?php the_archive_description(); ?></header><div class="container"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_navigation(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div></main>
<?php get_footer(); ?>
