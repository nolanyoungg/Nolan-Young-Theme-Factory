<?php
/** Template Name: Our Studio */
get_header();
?>
<main id="primary">
	<?php clay_page_intro( 'Our studio', 'A practice of paying attention.', 'Clay & Still is an imagined independent ceramics studio, rooted in small collections, useful forms and the simple pleasure of making by hand.' ); ?>
	<section class="section container about-composition"><figure><?php clay_image( 'hero', '', true ); ?><figcaption>Form and surface inspiration. Photograph by Tom Crew.</figcaption></figure><div><p class="eyebrow">A quieter kind of making</p><h2>Let the material<br><em>have a say.</em></h2><p>Our starting point is always a familiar gesture: pouring water, arranging a stem, setting something on a shelf. We work towards objects that sit easily within those moments.</p><p>In this fictional studio, small production runs allow time to notice every edge and curve. A slight shift in a glaze or the trace of a hand is part of the story, rather than something to erase.</p><a class="text-link" href="<?php echo clay_url( '/work/' ); ?>">Explore our illustrative collection ↗</a></div></section>
	<section class="section container"><?php get_template_part( 'template-parts/content', 'style-pillars' ); ?></section>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<section class="section container narrow"><h2>A table with room<br><em>for another pair of hands.</em></h2><p>Making is often solitary; learning need not be. Our workshop concept brings curious beginners together around simple handbuilding techniques, with time to ask questions and find their own pace.</p><a class="button" href="<?php echo clay_url( '/services/' ); ?>">Find your studio experience ↗</a></section>
</main>
<?php get_footer(); ?>
