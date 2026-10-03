<?php
/** Template Name: Studio Journal */
get_header();
?>
<main id="primary" class="site-main">
	<?php form_field_page_heading( '04', 'Journal', 'Notes on noticing.', 'Small observations that can change the way we think about a room. A reading collection on light, scale and making use of what is already here.' ); ?>
	<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>
	<div class="container journal-body">
	<?php foreach ( form_field_notes() as $note ) : ?>
	<article class="journal-note section" id="<?php echo esc_attr( $note['id'] ); ?>"><p class="eyebrow"><?php echo esc_html( $note['label'] ); ?></p><div class="prose"><h2><?php echo esc_html( $note['title'] ); ?></h2><p class="lede"><?php echo esc_html( $note['intro'] ); ?></p><p><?php echo esc_html( $note['text'] ); ?></p><p><?php echo esc_html( $note['ending'] ); ?></p><a class="text-link" href="<?php echo form_field_url( 'contact' ); ?>">Bring a question to the conversation ↗</a></div></article>
	<?php endforeach; ?>
	</div>
</main>
<?php get_footer(); ?>
