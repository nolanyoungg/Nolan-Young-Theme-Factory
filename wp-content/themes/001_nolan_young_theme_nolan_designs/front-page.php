<?php
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main id="primary" class="site-main" data-page-start>
	<?php get_template_part( 'template-parts/global/content', 'hero' ); ?>
	<?php get_template_part( 'template-parts/front-page/content', 'featured-work' ); ?>
	<?php get_template_part( 'template-parts/global/content', 'brand-statement' ); ?>
	<?php get_template_part( 'template-parts/front-page/content', 'all-services' ); ?>
	<?php get_template_part( 'template-parts/front-page/content', 'process' ); ?>
	<?php get_template_part( 'template-parts/front-page/content', 'feature-work' ); ?>
	<?php get_template_part( 'template-parts/front-page/content', 'service-highlight' ); ?>
	<?php get_template_part( 'template-parts/front-page/content', 'single-service-highlight' ); ?>
	<?php get_template_part( 'template-parts/front-page/content', 'style-pillars' ); ?>
	<?php get_template_part( 'template-parts/front-page/content', 'testimonials' ); ?>
	<?php get_template_part( 'template-parts/front-page/content', 'blog-preview' ); ?>
	<section class="section section--dark"><div class="site-wrap"><h2><?php esc_html_e( 'FAQ', 'nolan-young-theme-template-01' ); ?></h2><div class="accordion"><details><summary><?php esc_html_e( 'How do projects start?', 'nolan-young-theme-template-01' ); ?></summary><div class="accordion__panel"><p><?php esc_html_e( 'Start with a contact form and a short discovery review.', 'nolan-young-theme-template-01' ); ?></p></div></details><details><summary><?php esc_html_e( 'What do you need from us?', 'nolan-young-theme-template-01' ); ?></summary><div class="accordion__panel"><p><?php esc_html_e( 'Goals, content priorities, and any existing brand assets.', 'nolan-young-theme-template-01' ); ?></p></div></details><details><summary><?php esc_html_e( 'Do you support launches?', 'nolan-young-theme-template-01' ); ?></summary><div class="accordion__panel"><p><?php esc_html_e( 'Yes. Build, launch support, and handoff are part of the workflow.', 'nolan-young-theme-template-01' ); ?></p></div></details><details><summary><?php esc_html_e( 'Can you redesign an existing site?', 'nolan-young-theme-template-01' ); ?></summary><div class="accordion__panel"><p><?php esc_html_e( 'Yes. Redesign work can preserve what is working and replace what is not.', 'nolan-young-theme-template-01' ); ?></p></div></details><details><summary><?php esc_html_e( 'Do you handle integrations?', 'nolan-young-theme-template-01' ); ?></summary><div class="accordion__panel"><p><?php esc_html_e( 'We support practical integrations such as forms, CRM handoff, and automation.', 'nolan-young-theme-template-01' ); ?></p></div></details><details><summary><?php esc_html_e( 'What about support after launch?', 'nolan-young-theme-template-01' ); ?></summary><div class="accordion__panel"><p><?php esc_html_e( 'Care plans and support retainers are available for updates and maintenance.', 'nolan-young-theme-template-01' ); ?></p></div></details><details><summary><?php esc_html_e( 'How long does a project take?', 'nolan-young-theme-template-01' ); ?></summary><div class="accordion__panel"><p><?php esc_html_e( 'Timelines vary by scope, but we define milestones and keep communication clear.', 'nolan-young-theme-template-01' ); ?></p></div></details></div></div></section>
	<?php get_template_part( 'template-parts/global/content', 'cta-banner' ); ?>
</main>
<?php get_footer();
