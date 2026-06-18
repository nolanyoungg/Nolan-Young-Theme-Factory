<?php
/**
 * Template Name: Blog
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<section class="section hero hero--page" aria-labelledby="blog-title">
		<div class="container hero__grid">
			<div class="hero__content">
				<p class="eyebrow"><?php esc_html_e( 'Blog', 'nolan-young-template' ); ?></p>
				<h1 id="blog-title"><?php esc_html_e( 'Practical notes for planning and maintaining a service website.', 'nolan-young-template' ); ?></h1>
				<p><?php esc_html_e( 'Use the blog to surface useful guidance, project planning ideas, and answers to common questions before a sales conversation begins.', 'nolan-young-template' ); ?></p>
			</div>
			<div class="hero__visual"><?php nolan_young_template_card_image( 'assets/images/portfolio/article-launch.svg', __( 'Blog illustration', 'nolan-young-template' ) ); ?></div>
		</div>
	</section>
	<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php
get_footer();
