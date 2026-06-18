<?php
/**
 * Template Name: Contact
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<section class="section hero hero--page" aria-labelledby="contact-title">
		<div class="container hero__grid">
			<div class="hero__content">
				<p class="eyebrow"><?php esc_html_e( 'Contact', 'nolan-young-template' ); ?></p>
				<h1 id="contact-title"><?php esc_html_e( 'Tell Northstar Websites what the site needs to do next.', 'nolan-young-template' ); ?></h1>
				<p><?php esc_html_e( 'Share the project context, support needs, or page problems you want to solve. The inquiry form keeps the next step focused and manageable.', 'nolan-young-template' ); ?></p>
			</div>
			<div class="hero__visual"><?php nolan_young_template_card_image( 'assets/images/portfolio/work-lead-flow.svg', __( 'Contact illustration', 'nolan-young-template' ) ); ?></div>
		</div>
	</section>
	<section class="section">
		<div class="container content-grid">
			<div class="content-card">
				<h2><?php esc_html_e( 'Project inquiry', 'nolan-young-template' ); ?></h2>
				<?php echo nolan_young_template_render_contact_form( 'contact' ); ?>
			</div>
			<div class="content-card">
				<h2><?php esc_html_e( 'Newsletter', 'nolan-young-template' ); ?></h2>
				<p><?php esc_html_e( 'Use this optional signup if you want a lightweight update channel for planning notes, launch reminders, or resource posts.', 'nolan-young-template' ); ?></p>
				<?php echo nolan_young_template_render_newsletter_form(); ?>
			</div>
		</div>
	</section>
	<?php nolan_young_template_render_faqs( __( 'Contact questions and next-step planning.', 'nolan-young-template' ) ); ?>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php
get_footer();
