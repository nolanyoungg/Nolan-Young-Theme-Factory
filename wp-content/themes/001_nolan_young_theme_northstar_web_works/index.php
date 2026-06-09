<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section class="section section--archive">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<?php nolan_section_header( __( 'Journal', '001_nolan_young_theme_northstar_web_works' ), __( 'Recent stories and updates', '001_nolan_young_theme_northstar_web_works' ), __( 'Field notes, planning insights, and client-facing guidance from Northstar.', '001_nolan_young_theme_northstar_web_works' ) ); ?>
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



