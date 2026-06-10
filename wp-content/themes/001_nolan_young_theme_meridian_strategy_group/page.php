<?php get_header(); ?>
<section class="section"><div class="container"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'page' ); endwhile; else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div></section>
<?php get_footer(); ?>
