<?php get_header(); ?>
<main id="primary" tabindex="-1">
<?php rr_page_intro( 'RIDGE & RIVER / JOURNAL', 'Notes from the path.', 'Thoughts on walking well, planning thoughtfully and noticing more.' ); ?>
<section class="section container post-list">
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_pagination(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?>
</section>
<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>
</main><?php get_footer(); ?>
