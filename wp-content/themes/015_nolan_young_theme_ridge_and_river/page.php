<?php get_header(); ?>
<main id="primary" class="container section prose"><?php ridge_river_back_home(); ?>
<?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'page' ); endwhile; ?>
<p><a class="text-link" href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Find a day outside ↗</a></p>
</main><?php get_footer(); ?>

