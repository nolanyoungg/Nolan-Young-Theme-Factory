<?php
/**
 * Template Name: Contact
 *
 * @package Nolan_Young_Template
 */
get_header();
?>
<main id="primary" class="site-main page-contact">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Contact', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p><h1><?php esc_html_e( 'Tell Brightlane what the website needs to support.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h1><p><?php esc_html_e( 'Share the business goal, current site situation, service interest, and any timeline considerations. Brightlane will use that context to understand the best next conversation.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p></div><div class="contact-panel"><h2><?php esc_html_e( 'Inquiry form', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2><?php nolan_young_template_render_contact_form(); ?></div></div></section>
</main>
<?php get_footer(); ?>
