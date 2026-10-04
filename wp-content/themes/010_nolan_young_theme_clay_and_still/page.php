<?php
/** Standard page fallback for Clay & Still. */
get_header();
?>
<main id="primary" class="container narrow section">
	<a class="back-link" href="<?php echo clay_url(); ?>">← Home</a>
	<?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'page' ); endwhile; ?>
	<p><a class="text-link" href="<?php echo clay_url( '/contact/' ); ?>">Continue the conversation ↗</a></p>
</main>
<?php get_footer(); ?>
