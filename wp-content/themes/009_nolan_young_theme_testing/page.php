<?php
/**
 * Default page template.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

get_header();
?>
<main id="primary" class="site-main interior-page">
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<section class="page-hero section-shell">
			<div class="container narrow-flow">
				<p class="section-kicker"><?php esc_html_e( 'Page', '009_nolan_young_theme_testing' ); ?></p>
				<?php the_title( '<h1>', '</h1>' ); ?>
			</div>
		</section>
		<section class="section-shell">
			<div class="container narrow-flow entry-content">
				<?php the_content(); ?>
			</div>
		</section>
	<?php endwhile; ?>
</main>
<?php get_footer(); ?>
