<?php /** Single published studio note. */
get_header(); ?>
<main id="primary"><?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'single' ); endwhile; ?></main>
<?php get_footer(); ?>

