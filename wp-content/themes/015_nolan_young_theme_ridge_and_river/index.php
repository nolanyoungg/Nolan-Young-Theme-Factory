<?php get_header(); ?>
<main id="primary" class="container section">
<?php ridge_river_back_home(); ?><p class="eyebrow">RIDGE & RIVER / THE JOURNAL</p><h1>Notes from outside.</h1>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_navigation(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?>
<p><a class="text-link" href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Read the walking journal ↗</a></p>
</main><?php get_footer(); ?>

