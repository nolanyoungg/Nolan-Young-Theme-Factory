<?php
/** Template Name: Walk With Us */
get_header(); ?>
<main id="primary" tabindex="-1">
<?php rr_page_intro( 'WALK WITH US / THE OUTING GUIDE', 'Different paths. Same good feeling.', 'From a first day on the trail to a longer line along the ridge, find a walk that fits your experience and curiosity.' ); ?>
<?php get_template_part( 'template-parts/content', 'all-services' ); ?>
<?php get_template_part( 'template-parts/content', 'style-pillars' ); ?>
<section class="section container faq"><p class="eyebrow">BEFORE WE SET OFF</p><h2>A few good questions.</h2>
<details><summary>Do I need previous walking experience?</summary><p>The gentle day-walk concept is a starting point. Ridge routes call for previous hill experience and confidence on uneven ground. Tell us about a walk you enjoyed recently so the conversation starts in the right place.</p></details>
<details><summary>What if the weather changes?</summary><p>A real trip would need a current forecast, local condition checks and agreed alternatives. This sample itinerary has no fixed departure; a lower route or postponement would take priority over completing a ridge.</p></details>
<details><summary>Can a walk accommodate access needs?</summary><p>Share the surfaces, distances, gradients and facilities that work for you. Access varies by route; suitability would need to be checked together before any commitment.</p></details>
</section>
<?php rr_next_step(); ?>
</main><?php get_footer(); ?>
