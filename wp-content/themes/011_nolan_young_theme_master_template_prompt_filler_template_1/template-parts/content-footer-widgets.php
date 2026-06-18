<?php
/**
 * Footer columns.
 *
 * @package Nolan_Young_Template
 */

$services = nolan_young_template_services();
$articles = nolan_young_template_articles();
?>
<div class="footer-widgets">
	<div class="footer-brand">
		<p class="eyebrow"><?php esc_html_e( 'Northstar Websites', 'nolan-young-template' ); ?></p>
		<h2><?php esc_html_e( 'Websites that help businesses grow.', 'nolan-young-template' ); ?></h2>
		<p><?php esc_html_e( 'A modern WordPress theme for presenting services, process, proof, resources, and inquiry paths with clarity.', 'nolan-young-template' ); ?></p>
		<?php echo nolan_young_template_render_newsletter_form(); ?>
	</div>
	<nav class="footer-column" aria-label="<?php esc_attr_e( 'Footer services', 'nolan-young-template' ); ?>">
		<h3><?php esc_html_e( 'Services', 'nolan-young-template' ); ?></h3>
		<?php foreach ( $services as $service ) : ?>
			<a href="<?php echo esc_url( $service['url'] ); ?>"><?php echo esc_html( $service['title'] ); ?></a>
		<?php endforeach; ?>
	</nav>
	<nav class="footer-column" aria-label="<?php esc_attr_e( 'Footer company', 'nolan-young-template' ); ?>">
		<h3><?php esc_html_e( 'Company', 'nolan-young-template' ); ?></h3>
		<a href="<?php echo nolan_young_template_page_url( 'about/' ); ?>"><?php esc_html_e( 'About', 'nolan-young-template' ); ?></a>
		<a href="<?php echo nolan_young_template_page_url( 'work/' ); ?>"><?php esc_html_e( 'Work', 'nolan-young-template' ); ?></a>
		<a href="<?php echo nolan_young_template_page_url( 'blog/' ); ?>"><?php esc_html_e( 'Blog', 'nolan-young-template' ); ?></a>
		<a href="<?php echo nolan_young_template_page_url( 'contact/' ); ?>"><?php esc_html_e( 'Contact', 'nolan-young-template' ); ?></a>
	</nav>
	<nav class="footer-column" aria-label="<?php esc_attr_e( 'Footer blog', 'nolan-young-template' ); ?>">
		<h3><?php esc_html_e( 'Blog', 'nolan-young-template' ); ?></h3>
		<a href="<?php echo nolan_young_template_page_url( 'blog/' ); ?>"><?php esc_html_e( 'All articles', 'nolan-young-template' ); ?></a>
		<?php foreach ( array_slice( $articles, 0, 3 ) as $article ) : ?>
			<a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a>
		<?php endforeach; ?>
	</nav>
	<div class="footer-column footer-contact">
		<h3><?php esc_html_e( 'Contact', 'nolan-young-template' ); ?></h3>
		<p><?php esc_html_e( 'Share goals, pages, support needs, and any existing site context. Northstar Websites will use those details to frame the next conversation.', 'nolan-young-template' ); ?></p>
		<a href="<?php echo nolan_young_template_page_url( 'contact/' ); ?>"><?php esc_html_e( 'Start an inquiry', 'nolan-young-template' ); ?></a>
	</div>
</div>
