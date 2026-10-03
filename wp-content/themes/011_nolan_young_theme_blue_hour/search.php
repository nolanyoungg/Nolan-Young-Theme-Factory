<?php get_header(); ?>
<main id="primary"><section class="container page-intro"><p class="eyebrow">Blue Hour / Search</p><h1>Find a note.</h1><?php get_search_form(); ?></section><div class="container"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_navigation(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div></main>
<?php get_footer(); ?>
