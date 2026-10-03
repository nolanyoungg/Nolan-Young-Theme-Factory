<?php get_header(); ?>
<main id="primary"><?php blue_hour_intro( 'Notes', 'From the room.', 'Listening notes, observations, and small discoveries.' ); ?><div class="container"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_navigation(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div></main>
<?php get_footer(); ?>
