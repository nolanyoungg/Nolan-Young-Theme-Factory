<?php
/** Template Name: Walk With Us */
get_header(); ?>
<main id="primary">
<?php ridge_river_intro( 'Walk with us / Four ways outside', 'Choose your kind of day.', 'A gentle path beside the water, a longer line along the ridge or a day made just for you. These are illustrative guiding formats, not bookable departures.' ); ?>
<div class="container service-landscape"><?php ridge_river_photo(); ?><p class="image-note">A landscape to inspire the idea, not a confirmed destination.</p></div>
<section class="section container service-list">
<?php get_template_part( 'template-parts/content', 'all-services' ); ?>
</section>
<?php get_template_part( 'template-parts/content', 'style-pillars' ); ?>
<?php get_template_part( 'template-parts/content', 'single-service-highlight' ); ?>
</main><?php get_footer(); ?>
