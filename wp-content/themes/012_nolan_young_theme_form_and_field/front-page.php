<?php /** Form & Field: six connected editorial sections. */ get_header(); ?>
<main id="primary" class="site-main" tabindex="-1">
<?php
get_template_part( 'template-parts/content', 'hero' );
get_template_part( 'template-parts/content', 'brand-statement' );
get_template_part( 'template-parts/content', 'featured-work' );
get_template_part( 'template-parts/content', 'all-services' );
get_template_part( 'template-parts/content', 'process' );
get_template_part( 'template-parts/content', 'cta-banner' );
?>
</main>
<?php get_footer(); ?>

