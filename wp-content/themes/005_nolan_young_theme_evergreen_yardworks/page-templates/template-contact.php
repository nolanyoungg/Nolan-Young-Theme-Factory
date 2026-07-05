<?php
/**
 * Template Name: Contact
 *
 * @package Nolan_Young_Template
 */
get_header();
?>
<main id="primary" class="site-main page-contact">
	<section class="section page-hero"><div class="container split"><div><p class="eyebrow"><?php esc_html_e( 'Contact Evergreen Yardworks', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h1><?php esc_html_e( 'Request a lawn care or cleanup estimate.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h1><p><?php esc_html_e( 'Share your property type, service area, services needed, timing, and notes about gates, pets, slopes, cleanup, or photos.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><p><strong>(555) 014-7826</strong><br><a href="mailto:hello@evergreenyardworks.example">hello@evergreenyardworks.example</a></p></div><div class="contact-panel"><h2><?php esc_html_e( 'Estimate form', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2><?php nolan_young_template_render_contact_form(); ?></div></div></section>
</main>
<?php get_footer(); ?>

