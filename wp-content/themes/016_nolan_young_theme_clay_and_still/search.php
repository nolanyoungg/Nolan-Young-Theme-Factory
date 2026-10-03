<?php /** Search the published studio content. */
get_header(); ?>
<main id="primary" class="wrap reading-width section-space">
	<a class="back-link" href="<?php echo clay_still_url(); ?>">Clay &amp; Still / Home</a>
	<p class="eyebrow">Around the studio</p><h1>Search results</h1><p>Looking for: <?php echo esc_html( get_search_query() ); ?></p>
	<?php get_search_form(); ?>
	<div class="post-list"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_navigation(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div>
</main>
<?php get_footer(); ?>

