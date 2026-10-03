<?php
/** Journal fallback for the native posts index. */
get_header();
?>
<main id="primary" class="site-main">
	<?php form_field_page_heading( '04', 'Journal', 'From the studio.', 'Observations on architecture, interiors and the places we make our own.' ); ?>
	<div class="container section"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_pagination(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div>
</main>
<?php get_footer(); ?>
