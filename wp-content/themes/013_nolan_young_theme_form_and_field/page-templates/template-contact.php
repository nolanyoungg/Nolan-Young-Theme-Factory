<?php
/** Template Name: Project Inquiry */
get_header();
?>
<main id="primary" class="site-main">
	<?php form_field_page_heading( '05', 'A conversation', 'Every space starts with a possibility.', 'A building you have found. A home you have outgrown. A room that could work a little better. Start with what you know; the questions can come next.' ); ?>
	<section class="container contact-layout section">
		<aside class="consultation"><p class="eyebrow">The first conversation</p><h2>Bring your ideas.<br>And your questions.</h2><p>A first consultation would be a chance to understand your ambitions and discuss whether the practice is a good fit.</p><ol><li>Tell us about the site, the people and the way you hope to use the space.</li><li>Talk through likely scope, budget priorities and timing.</li><li>Agree what needs to be understood before a proposal can be prepared.</li></ol><p>No drawings or polished brief are needed to begin. A few photographs and a short list of priorities would be helpful.</p><p class="fine-print">Demonstration only: consultations cannot be booked through this sample website.</p><a class="text-link" href="<?php echo form_field_url( 'services' ); ?>">Explore our capabilities ↗</a></aside>
		<div class="contact-form-panel"><h2>Project inquiry</h2><?php form_field_contact_form(); ?></div>
	</section>
	<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
</main>
<?php get_footer(); ?>
