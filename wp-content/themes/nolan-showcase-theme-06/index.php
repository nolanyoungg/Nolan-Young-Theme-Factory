<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section class="section section--archive">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<?php nolan_section_header( __( 'Journal', 'nolan-showcase-theme-06' ), __( 'Recent stories and updates', 'nolan-showcase-theme-06' ), __( 'Field notes, planning insights, and client-facing guidance from Northstar.', 'nolan-showcase-theme-06' ) ); ?>
			<div class="card-grid card-grid--posts">
				<?php
				while ( have_posts() ) :
					the_post();
					get_template_part( 'template-parts/content', 'single' );
				endwhile;
				?>
			</div>
			<?php the_posts_navigation(); ?>
		<?php else : ?>
			<?php get_template_part( 'template-parts/content', 'none' ); ?>
		<?php endif; ?>
	</div>
</section>
<?php
get_footer();


