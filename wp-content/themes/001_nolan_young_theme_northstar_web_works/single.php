<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section class="section">
	<div class="container content-shell content-shell--single">
		<?php
		while ( have_posts() ) :
			the_post();
			get_template_part( 'template-parts/content', 'single' );
			the_post_navigation(
				array(
					'prev_text' => '&larr; %title',
					'next_text' => '%title &rarr;',
				)
			);
			if ( comments_open() || get_comments_number() ) {
				comments_template();
			}
		endwhile;
		?>
	</div>
</section>
<?php
get_footer();

