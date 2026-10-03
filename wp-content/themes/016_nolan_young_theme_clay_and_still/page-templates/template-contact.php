<?php
/**
 * Template Name: Studio Inquiry
 */
get_header();
?>
<main id="primary">
	<?php clay_still_page_intro( 'Say hello', 'Every form starts somewhere.', 'Tell us about the thing you would like to make, the skill you would like to try, or the space you are making room for.' ); ?>
	<section class="wrap contact-layout section-space">
		<div class="contact-aside"><p class="eyebrow">A studio conversation</p><h2>A few words<br><em>are enough.</em></h2><p>For a commission, think about scale, colour, intended use, and the story behind it. For a workshop, tell us what draws you to clay and any support you would like.</p><figure><?php clay_still_image( 'red' ); ?><figcaption>A little inspiration for the conversation.</figcaption></figure><h3>Thinking of a visit?</h3><p>This fictional studio has no public address or opening hours. The form lets you explore a studio inquiry without creating a booking.</p><a class="text-link" href="<?php echo clay_still_url( '/services/' ); ?>">Read about studio offerings ↗</a></div>
		<?php clay_still_contact_form(); ?>
	</section>
</main>
<?php get_footer(); ?>
