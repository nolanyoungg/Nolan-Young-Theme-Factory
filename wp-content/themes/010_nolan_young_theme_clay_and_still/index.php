<?php
/** Standard post index for Clay & Still. */
get_header();
?>
<main id="primary" class="container narrow section">
	<a class="back-link" href="<?php echo clay_url(); ?>">← Home</a>
	<p class="eyebrow">Clay &amp; Still / Journal</p><h1>From the studio.</h1>
	<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_navigation(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?>
</main>
<?php get_footer(); ?>
