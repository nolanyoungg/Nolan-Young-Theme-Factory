<?php
/** Template Name: Visit and Inquire */
get_header();
?>
<main id="primary">
	<?php clay_page_intro( 'Visit & inquire', 'Every good thing begins with a hello.', 'A workshop question, a shape you cannot stop thinking about, or a wish to spend more time making. There is room for it here.' ); ?>
	<section class="section container contact-layout"><aside><p class="eyebrow">A note to the studio</p><h2>Tell us what<br><em>you have in mind.</em></h2><p>For a commission, describe the intended use, approximate size and colours you are drawn to. For a workshop, share your experience and any questions about taking part.</p><div class="studio-note"><h3>Planning a visit</h3><p>This sample brand has no physical address or opening hours. In a working studio, visits would be arranged ahead of time so the clay table is ready for you.</p></div><?php clay_image( 'detail', 'contact-photo' ); ?></aside><div><?php clay_inquiry_form(); ?></div></section>
</main>
<?php get_footer(); ?>
