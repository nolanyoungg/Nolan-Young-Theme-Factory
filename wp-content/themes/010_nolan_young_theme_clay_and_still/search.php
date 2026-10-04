<?php get_header(); ?>
<main id="primary" class="container narrow section"><a class="back-link" href="<?php echo clay_url(); ?>">← Home</a><p class="eyebrow">Looking around the studio</p><h1>Search: <?php echo esc_html( get_search_query() ); ?></h1><?php get_search_form(); ?><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_navigation(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?></main>
<?php get_footer(); ?>
