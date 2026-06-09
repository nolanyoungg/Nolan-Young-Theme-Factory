<?php
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
			get_template_part( 'template-parts/content', 'page' );
		endwhile;
		?>
	</div>
</section>
<?php
get_footer();

