<?php
/** Template Name: Privacy Note */
get_header();
?>
<main id="primary" class="site-main">
	<?php form_field_page_heading( '06', 'Privacy', 'A clear note on privacy.', 'How this Form & Field demonstration handles the information you enter.' ); ?>
	<?php get_template_part( 'template-parts/content', 'policy' ); ?>
</main>
<?php get_footer(); ?>
