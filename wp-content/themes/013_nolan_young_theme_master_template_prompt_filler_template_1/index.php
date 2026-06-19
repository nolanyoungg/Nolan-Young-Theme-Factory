<?php
/**
 * Index.
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', get_post_type() ); endwhile; if ( function_exists( 'the_posts_navigation' ) ) { the_posts_navigation(); } else { echo '<nav class="pagination-nav" aria-label="Posts navigation"><span class="pagination-link is-current">1</span></nav>'; } else : get_template_part( 'template-parts/content', 'none' ); endif; ?>
</main>
<?php get_footer();
