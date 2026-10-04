<?php
/** Template Name: Walking Journal */
get_header(); ?>
<main id="primary" tabindex="-1">
<?php rr_page_intro( 'THE JOURNAL / NOTES FOR THE WAY', 'A little preparation goes a long way.', 'Practical reading for the night before, the morning of and the moments between walks.' ); ?>
<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>
<?php rr_next_step(); ?>
</main><?php get_footer(); ?>
