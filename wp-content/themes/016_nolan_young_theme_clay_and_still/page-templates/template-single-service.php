<?php
/**
 * Template Name: Introductory Handbuilding
 */
get_header();
?>
<main id="primary">
	<?php clay_still_page_intro( 'Introductory handbuilding', 'Your hands know where to begin.', 'A gentle introduction to clay: a little guidance, room to experiment, and the satisfying feeling of making a form from almost nothing.' ); ?>
	<section class="wrap workshop-detail section-space">
		<figure><?php clay_still_image( 'white', '', true ); ?><figcaption>Illustrative vessel inspiration, not guaranteed workshop outcomes.</figcaption></figure>
		<div><p class="eyebrow">The sample workshop</p><h2>One small form.<br><em>A whole new feeling.</em></h2><dl class="material-list"><dt>Duration</dt><dd>2 hours 30 minutes</dd><dt>Experience</dt><dd>For beginners; no previous clay experience needed.</dd><dt>Included in the concept</dt><dd>Clay, shared tools, an apron, guided making, and a discussion of glazing and firing.</dd><dt>Booking</dt><dd>Inquiry only. This demo has no scheduled dates, prices, or reservable places.</dd></dl><a class="button" href="#workshop-inquiry">Explore a booking inquiry ↗</a></div>
	</section>
	<section class="wrap workshop-plan section-space"><div><p class="eyebrow">At the table</p><h2>Time to settle in.</h2></div><ol class="process-list"><li><span>30m</span><div><h3>Meet the material</h3><p>Feel the clay, practise a pinch, and look at a few simple shapes.</p></div></li><li><span>90m</span><div><h3>Find your form</h3><p>Build a small vessel with pauses for support, smoothing, and trying again.</p></div></li><li><span>30m</span><div><h3>Finish &amp; reflect</h3><p>Refine your rim and discuss the drying, firing, and care that follow.</p></div></li></ol></section>
	<section class="wrap reading-width section-space"><h2>A little reassurance.</h2><details class="faq"><summary>Will I take a finished piece home?</summary><p>A wet clay form needs to dry and be fired before use. In a real workshop, collection arrangements and firing times should be confirmed before booking. This demo does not promise a finished piece or a collection date.</p></details><details class="faq"><summary>What should I bring?</summary><p>For the sample format, wear comfortable clothes you do not mind marking, tie long hair back, and bring your curiosity. Short nails can make handling clay easier.</p></details><details class="faq"><summary>Can I ask about access or support?</summary><p>Yes. The demo inquiry has space for access questions. A real studio should confirm any required adjustments and facilities before accepting a booking.</p></details></section>
	<section id="workshop-inquiry" class="wrap contact-layout section-space"><div><p class="eyebrow">A gentle first step</p><h2>Imagine your<br><em>place at the table.</em></h2><p>Try the sample inquiry. No place is booked, no payment is requested, and no message is sent.</p><a class="text-link" href="<?php echo clay_still_url( '/services/' ); ?>">See all studio offerings ↗</a></div><?php clay_still_contact_form( true ); ?></section>
</main>
<?php get_footer(); ?>
