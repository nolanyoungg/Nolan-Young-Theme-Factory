<?php
get_header();
?>
<main id="primary" class="site-main">
	<section class="section content-page">
		<div class="container content-card">
			<p class="eyebrow"><?php esc_html_e( 'Not found', 'nolan-young-template' ); ?></p>
			<h1><?php esc_html_e( 'That page does not exist.', 'nolan-young-template' ); ?></h1>
			<p><?php esc_html_e( 'Try the search form below or return to the homepage to continue browsing.', 'nolan-young-template' ); ?></p>
			<?php get_search_form(); ?>
		</div>
	</section>
</main>
<?php
get_footer();
