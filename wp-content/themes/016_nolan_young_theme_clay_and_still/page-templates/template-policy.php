<?php
/**
 * Template Name: Privacy and This Demo
 */
get_header();
?>
<main id="primary">
	<?php clay_still_page_intro( 'Privacy', 'A clear note on this demo.', 'Clay & Still is a fictional sample brand. The following describes the behaviour built into this theme, rather than a policy for an operating ceramics business.' ); ?>
	<?php get_template_part( 'template-parts/content', 'policy' ); ?>
</main>
<?php get_footer(); ?>
