<?php
/**
 * Template Name: Our Studio
 */
get_header();
?>
<main id="primary">
	<?php clay_still_page_intro( 'Our studio', 'A little earth. A little intention.', 'Clay & Still is an imagined independent ceramics studio built around a simple belief: the objects we live with can invite us to slow down.' ); ?>
	<section class="wrap editorial-split section-space">
		<figure class="editorial-photo reveal"><?php clay_still_image( 'white', '', true ); ?><figcaption>Material inspiration. Illustrative photography by Tom Crew.</figcaption></figure>
		<div class="editorial-copy"><p class="eyebrow">The studio philosophy</p><h2>Useful things.<br><em>Quiet company.</em></h2><p>We imagine pieces that become part of ordinary rituals: moving a branch into the light, setting a table for one, clearing a favourite corner at the end of the day.</p><p>Our forms begin with proportion and touch. A rim should feel considered. A base should sit comfortably. The small variations of making by hand are part of the object, not something to erase.</p><p>Small collections leave room to look closely, adjust a curve, and learn from the last firing. Slow production is a practical choice as much as a creative one.</p></div>
	</section>
	<?php get_template_part( 'template-parts/content', 'style-pillars' ); ?>
	<section class="wrap reading-width section-space"><p class="eyebrow">An open table</p><h2>The pleasure is<br><em>in the making.</em></h2><p>Workshops make room for curiosity, not perfect results. We imagine a calm table, shared tools, and enough time to ask the small questions. You do not need to call yourself creative to begin.</p><a class="button" href="<?php echo clay_still_url( '/services/' ); ?>">Find your way into clay ↗</a></section>
</main>
<?php get_footer(); ?>
