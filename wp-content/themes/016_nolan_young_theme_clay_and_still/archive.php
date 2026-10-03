<?php /** Published studio notes. */
get_header(); ?>
<main id="primary" class="wrap reading-width section-space">
	<a class="back-link" href="<?php echo clay_still_url(); ?>">Clay &amp; Still / Home</a>
	<?php the_archive_title( '<h1>', '</h1>' ); ?>
	<div class="post-list"><?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_navigation(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?></div>
</main>
<?php get_footer(); ?>

