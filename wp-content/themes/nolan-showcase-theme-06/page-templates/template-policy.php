<?php
/**
 * Template Name: Policy
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section class="section">
	<div class="container content-shell">
		<?php
		while ( have_posts() ) :
			the_post();
			get_template_part( 'template-parts/content', 'policy' );
		endwhile;
		?>
	</div>
</section>
<?php
get_footer();

