<?php
/**
 * Template Name: Contact
 * Template Post Type: page
 *
 * @package Nolan_Young_Template
 */
get_header();
?>
<main id="primary" class="site-main page-contact">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Contact', '007-nolan-young-theme-atlasframe-digital' ); ?></p><h1><?php esc_html_e( 'Share the WordPress problem the site needs to solve.', '007-nolan-young-theme-atlasframe-digital' ); ?></h1><p><?php esc_html_e( 'Include the current site, goals, timeline context, must-have functionality, and support needs. Do not send sensitive credentials through this form.', '007-nolan-young-theme-atlasframe-digital' ); ?></p><p><a href="mailto:hello@atlasframe.digital">hello@atlasframe.digital</a></p></div><div class="contact-panel"><h2><?php esc_html_e( 'Project inquiry', '007-nolan-young-theme-atlasframe-digital' ); ?></h2><?php nolan_young_template_render_contact_form(); ?></div></div></section>
</main>
<?php get_footer(); ?>
