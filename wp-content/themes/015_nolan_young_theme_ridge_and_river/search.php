<?php get_header(); ?>
<main id="primary" class="container section"><?php ridge_river_back_home(); ?><p class="eyebrow">SEARCH THE FIELD GUIDE</p><h1>Follow a new lead.</h1><p>Results for “<?php echo esc_html( get_search_query() ); ?>”</p><?php get_search_form(); ?>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_navigation(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?>
</main><?php get_footer(); ?>

