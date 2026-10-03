<?php
/** Template Name: Blue Hour — The Room */
get_header(); ?>
<main id="primary">
<?php blue_hour_intro( 'The room', 'A little room. A deeper listen.', 'Blue Hour is an imagined refuge for the attentive ear: intimate live sets, records played all the way through, and the pleasure of being present.' ); ?>
<section class="container editorial-split section"><div><?php blue_hour_photo( 'hero', 'editorial-photo', true ); ?><p class="caption">Piano study / illustrative stock photography.</p></div><div><p class="eyebrow">Our listening culture</p><h2>Leave a little space for the unexpected.</h2><p>A melody you have never heard can feel like a place you know. That is the feeling behind Blue Hour. Our fictional room is built around the exchange between a musician, an instrument, and the people who came to listen.</p><p>You do not need a record collection or a vocabulary for harmony. You can simply sit down, notice the bass line, and follow whatever catches your ear.</p><p>Between sets, the room opens back up: a conversation, a recommendation, the name of a tune scribbled on a napkin.</p></div></section>
<?php get_template_part( 'template-parts/content', 'style-pillars' ); ?>
<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main><?php get_footer(); ?>
