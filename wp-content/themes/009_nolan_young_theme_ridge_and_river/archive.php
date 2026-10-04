<?php get_header(); ?>
<main id="primary" tabindex="-1"><section class="section container post-list">
<p class="eyebrow">RIDGE & RIVER / THE NOTEBOOK</p><h1><?php the_archive_title(); ?></h1>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'search' ); endwhile; the_posts_pagination(); else : get_template_part( 'template-parts/content', 'none' ); endif; ?>
</section></main><?php get_footer(); ?>
