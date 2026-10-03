<?php get_header(); ?>
<main id="primary" class="site-main container section"><p class="eyebrow">Form &amp; Field / Search</p><h1>Looking a little closer.</h1><p>Results for: <?php echo esc_html( get_search_query() ); ?></p><?php get_search_form(); ?><div class="search-results-list"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_pagination(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div></main>
<?php get_footer(); ?>
