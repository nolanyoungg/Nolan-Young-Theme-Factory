<?php get_header(); ?>
<main id="primary" class="site-main container section"><p class="eyebrow">Form &amp; Field / Archive</p><h1><?php the_archive_title(); ?></h1><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_pagination(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?></main>
<?php get_footer(); ?>
