<?php
/* Template Name: Our bakery story */
get_header(); ?>
<main id="primary">
<?php hearth_honey_intro( 'OUR STORY', 'Good bread takes good time.', 'A neighborhood sourdough bakery and coffee counter, built around the small rituals that make a day feel good.' ); ?>
<section class="container split inner-section"><figure><?php hearth_honey_photo( 'detail', 'arch-photo', true ); ?><figcaption>Illustrative bread photograph by Eric Prouzet.</figcaption></figure><div><p class="eyebrow">PATIENT BY NATURE</p><h2>Yesterday’s dough.<br>Today’s happiness.</h2><p>At Hearth &amp; Honey, a loaf begins with a living starter, flour, water and salt. We mix gently, fold by hand and give the dough a long, cool rest. That slow fermentation builds the flavor and texture we love: a deeply golden crust and a soft, springy middle.</p><p>We imagine our counter as a meeting place. A quick espresso before the train. The loaf you bring to supper. A warm bun split with someone you like.</p><p>This fictional bakery’s ingredient philosophy is simple: seasonal produce, locally milled flour when available, and honest conversations about what goes into every bake.</p></div></section>
<?php get_template_part( 'template-parts/content', 'process' ); get_template_part( 'template-parts/content', 'style-pillars' ); get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main><?php get_footer(); ?>
