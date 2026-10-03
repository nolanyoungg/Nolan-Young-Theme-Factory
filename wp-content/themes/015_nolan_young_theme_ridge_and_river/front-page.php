<?php get_header(); ?>
<main id="primary" class="site-main">
<?php
get_template_part( 'template-parts/content', 'hero' );
get_template_part( 'template-parts/content', 'featured-work' );
get_template_part( 'template-parts/content', 'style-pillars' );
get_template_part( 'template-parts/content', 'brand-statement' );
get_template_part( 'template-parts/content', 'process' );
get_template_part( 'template-parts/content', 'cta-banner' );
?>
</main>
<?php get_footer(); ?>

