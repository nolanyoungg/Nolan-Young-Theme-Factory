<?php
/** Template Name: Our Story */
get_header(); ?>
<main id="primary" tabindex="-1">
<?php rr_page_intro( 'OUR STORY / RIDGE & RIVER', 'Outside, together.', 'A small outdoor guiding idea with a simple belief: a good walk gives you more than a view.' ); ?>
<div class="container panorama"><?php rr_photo( '', true ); ?><p class="mono">OPEN LANDSCAPES / OPEN CONVERSATIONS</p></div>
<section class="section container editorial-split"><div><p class="eyebrow">OUR OUTDOOR ETHOS</p><h2>Make space<br>for the small things.</h2></div><div><p class="lead">Ridge & River is a fictional walking outfitter for curious people, steady steps and days that do not need rushing.</p><p>Our sample trips imagine groups of up to six, with enough time to find a comfortable pace and notice what is around us. We value a clear briefing as much as a beautiful route.</p><p>There is no summit-at-all-costs promise. Weather, the group and the ground underfoot have a say. A shorter route, a sheltered lunch or a thoughtful turn-around can be the best part of the plan.</p></div></section>
<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
<?php get_template_part( 'template-parts/content', 'brand-statement' ); ?>
<?php rr_next_step(); ?>
</main><?php get_footer(); ?>
