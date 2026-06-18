<?php
/**
 * Template Name: Policy
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<section class="section content-page" aria-labelledby="policy-title">
		<div class="container content-card">
			<p class="eyebrow"><?php esc_html_e( 'Policy', 'nolan-young-template' ); ?></p>
			<h1 id="policy-title"><?php esc_html_e( 'Managed policy content', 'nolan-young-template' ); ?></h1>
			<p><?php esc_html_e( 'Use this template for WordPress-managed policy text that the site owner can review and update without changing the theme.', 'nolan-young-template' ); ?></p>
			<?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
		</div>
	</section>
</main>
<?php
get_footer();
