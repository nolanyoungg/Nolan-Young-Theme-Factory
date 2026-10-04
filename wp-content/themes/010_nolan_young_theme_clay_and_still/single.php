<?php get_header(); ?>
<main id="primary" class="container narrow section"><a class="back-link" href="<?php echo clay_url( '/blog/' ); ?>">← Studio journal</a><?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'single' ); endwhile; ?><p><a class="text-link" href="<?php echo clay_url(); ?>">Return home ↗</a></p></main>
<?php get_footer(); ?>
