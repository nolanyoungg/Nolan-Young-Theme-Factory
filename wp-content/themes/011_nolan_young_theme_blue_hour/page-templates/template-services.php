<?php
/** Template Name: Blue Hour — The Sessions */
get_header(); ?>
<main id="primary">
<?php blue_hour_intro( 'The sessions', 'Three ways to lose track of time.', 'Live music, a record side, a room full of your favorite people. Different evenings, the same attention to sound. Every program below is an illustrative concept.' ); ?>
<?php get_template_part( 'template-parts/content', 'all-services' ); ?>
<section class="section container narrow"><p class="eyebrow">A few listening notes</p><h2>Before you settle in.</h2><details><summary>Is this a real program I can book?</summary><p>No. Blue Hour is a fictional sample brand. Event names, dates, set times, and arrangements are demonstrations, with no tickets or reservations available.</p></details><details><summary>How is a listening night different from a live set?</summary><p>Our concept listening nights focus on recorded music, played in complete sides with short introductions. Live sessions imagine musicians sharing two focused sets with a pause between them.</p></details><details><summary>Do I need to know jazz?</summary><p>Not at all. Follow an instrument, notice a change in the rhythm, or just enjoy the mood. Listening is enough.</p></details><?php blue_hour_link( '/contact/', 'Visit notes & sample inquiry ↗', 'text-link' ); ?></section>
</main><?php get_footer(); ?>
