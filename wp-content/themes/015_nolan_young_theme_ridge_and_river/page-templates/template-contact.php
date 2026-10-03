<?php
/** Template Name: Trip Inquiry */
get_header(); ?>
<main id="primary">
<?php ridge_river_intro( 'Trip inquiry / Say hello', 'Your kind of outside.', 'A slow morning or a bigger day? Start with the pace you enjoy, the people coming along and the things you would love to notice.' ); ?>
<section class="container contact-layout section">
<div><?php ridge_river_inquiry(); ?></div><aside class="meeting-note"><?php ridge_river_mark( 2 ); ?><p class="eyebrow">MEETING AT THE TRAILHEAD</p><h2>A clear start<br>to the day.</h2><p>A real trip confirmation would include a precise meeting point, arrival time, travel notes and the final kit list.</p><p>Ridge & River is fictional, so there is no public office, meeting address or confirmed departure. Please don’t travel based on this sample website.</p><hr><h3>Useful things to share</h3><ul class="plain-list"><li>Your recent walking experience</li><li>A preferred season and group size</li><li>Access needs and preferred pace</li></ul><a class="text-link" href="<?php echo esc_url( home_url( '/services/' ) ); ?>">Compare the walks ↗</a></aside>
</section>
<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main><?php get_footer(); ?>
