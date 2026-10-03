<?php
/** Template Name: Our Story */
get_header(); ?>
<main id="primary">
<?php ridge_river_intro( 'Our story / Ridge & River', 'Less to prove. More to discover.', 'A small outdoor guiding and walking outfitter, imagined for people who would rather take their time than race the daylight.' ); ?>
<section class="container story-spread"><figure><?php ridge_river_photo(); ?><figcaption>Illustrative mountain landscape · Alexander Hipp</figcaption></figure><div class="story-note"><p class="eyebrow">A SIMPLE STARTING POINT</p><h2>Outside is<br>for noticing.</h2><p>Ridge & River began as a fictional idea around a familiar feeling: a good walk can change the shape of a whole week. It needn’t be a grand expedition. Sometimes a river path is enough.</p><p>Our sample trips are built around small groups, patient pacing and the pleasure of learning a landscape on foot. We leave space for questions, quiet stretches and a second look.</p></div></section>
<section class="section container"><div class="section-heading"><p class="eyebrow">WHAT WE WOULD BRING TO EVERY DAY</p><h2>Good company.<br>Thoughtful choices.</h2></div><div class="principles"><article><?php ridge_river_mark( 1 ); ?><h3>Small by intention</h3><p>The sample group size is up to six walkers. Small enough to find a shared pace, hear one another and keep the day personal.</p></article><article><?php ridge_river_mark( 2 ); ?><h3>Grounded in place</h3><p>Stay on established paths, respect working land and give wildlife room. Taking care of the outdoors is part of enjoying it.</p></article><article><?php ridge_river_mark( 3 ); ?><h3>Flexible by nature</h3><p>The summit is an option, not an obligation. Conditions and the group’s comfort guide the shape of the day.</p></article></div></section>
<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main><?php get_footer(); ?>
