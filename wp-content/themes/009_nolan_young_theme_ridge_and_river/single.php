<?php get_header(); ?>
<main id="primary" tabindex="-1">
<?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'single' ); endwhile; ?>
<?php rr_next_step(); ?>
</main><?php get_footer(); ?>
