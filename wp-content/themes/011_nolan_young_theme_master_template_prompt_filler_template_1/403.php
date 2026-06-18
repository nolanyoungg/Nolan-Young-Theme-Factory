<?php
get_header();
?>
<main id="primary" class="site-main">
	<section class="section content-page">
		<div class="container content-card">
			<p class="eyebrow"><?php esc_html_e( 'Access restricted', 'nolan-young-template' ); ?></p>
			<h1><?php esc_html_e( 'You do not have permission to view this page.', 'nolan-young-template' ); ?></h1>
			<p><?php esc_html_e( 'If you think this is an error, return to the homepage or contact the site owner for help.', 'nolan-young-template' ); ?></p>
			<p><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Go home', 'nolan-young-template' ); ?></a></p>
		</div>
	</section>
</main>
<?php
get_footer();
