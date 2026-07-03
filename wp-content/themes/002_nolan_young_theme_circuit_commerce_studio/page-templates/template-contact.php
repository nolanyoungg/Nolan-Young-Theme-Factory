<?php
/**
 * Template Name: Contact
 *
 * @package Nolan_Young_Template
 */
get_header();
?>
<main id="primary" class="site-main page-contact">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Contact', 'nolan-young-theme-circuit-commerce-studio' ); ?></p><h1><?php esc_html_e( 'Tell Circuit Commerce Studio what the website needs to support.', 'nolan-young-theme-circuit-commerce-studio' ); ?></h1><p><?php esc_html_e( 'Share the business goal, current site situation, service interest, and any timeline considerations. Circuit Commerce Studio will use that context to understand the best next conversation.', 'nolan-young-theme-circuit-commerce-studio' ); ?></p></div><div class="contact-panel"><h2><?php esc_html_e( 'Inquiry form', 'nolan-young-theme-circuit-commerce-studio' ); ?></h2><?php nolan_young_template_render_contact_form(); ?></div></div></section>
</main>
<?php get_footer(); ?>
