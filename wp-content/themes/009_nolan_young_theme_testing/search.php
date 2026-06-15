<?php
/**
 * Search template.
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

get_header();
?>
<main id="primary" class="site-main interior-page">
	<section class="page-hero section-shell">
		<div class="container narrow-flow">
			<p class="section-kicker"><?php esc_html_e( 'Search', '009_nolan_young_theme_testing' ); ?></p>
			<h1><?php printf( esc_html__( 'Results for "%s"', '009_nolan_young_theme_testing' ), esc_html( get_search_query() ) ); ?></h1>
		</div>
	</section>
	<section class="section-shell">
		<div class="container card-grid">
			<?php if ( have_posts() ) : ?>
				<?php while ( have_posts() ) : the_post(); ?>
					<article <?php post_class( 'info-card info-card--post' ); ?>>
						<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
						<p><?php echo esc_html( get_the_excerpt() ); ?></p>
						<a class="text-link" href="<?php the_permalink(); ?>"><?php esc_html_e( 'Open result', '009_nolan_young_theme_testing' ); ?></a>
					</article>
				<?php endwhile; ?>
			<?php else : ?>
				<?php get_template_part( 'template-parts/content', 'none' ); ?>
			<?php endif; ?>
		</div>
	</section>
</main>
<?php get_footer(); ?>
