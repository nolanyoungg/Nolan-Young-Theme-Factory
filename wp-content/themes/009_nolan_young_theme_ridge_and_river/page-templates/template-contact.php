<?php
/** Template Name: Trip Inquiry */
get_header(); ?>
<main id="primary" tabindex="-1">
<?php rr_page_intro( 'TRIP INQUIRY / START HERE', 'Tell us about your kind of outside.', 'A gentle wander, a longer ridge or a day learning to read the map. Every good outing begins with a little listening.' ); ?>
<section class="section container contact-layout"><div><?php rr_inquiry_form(); ?></div><aside class="meeting-note"><p class="eyebrow">MEETING INFORMATION</p><h2>At the trailhead.<br>On the same page.</h2><p>For a real outing, the precise meeting point, arrival time, transport options and facilities would be agreed in advance. This fictional brand has no public meeting address.</p><h3>Useful things to share</h3><ul><li>Your group size and preferred season</li><li>A recent walk you enjoyed</li><li>Your pace, access needs and questions</li></ul><p>Please do not enter sensitive or medical information in this demonstration.</p><?php rr_link( '/services/', 'Compare the walk styles ↗', 'text-link' ); ?><hr><p class="small-note">Sample contact: hello@ridgeandriver.example<br>The example address does not receive mail.</p></aside></section>
<?php get_template_part( 'template-parts/content', 'single-service-highlight' ); ?>
</main><?php get_footer(); ?>
