<?php
/** Template Name: Concept Studies */
get_header();
?>
<main id="primary" class="site-main">
	<?php form_field_page_heading( '03', 'Selected explorations', 'Three possibilities. One point of view.', 'These unbuilt concept studies explore light, material and the relationships between rooms. They are fictional design narratives, illustrated with stock photography rather than project documentation.' ); ?>
	<div class="container project-index"><span class="eyebrow">Jump to a study</span><?php foreach ( form_field_projects() as $project ) : ?><a href="#<?php echo esc_attr( $project['id'] ); ?>"><?php echo esc_html( $project['title'] ); ?> ↓</a><?php endforeach; ?></div>
	<?php foreach ( form_field_projects() as $index => $project ) : ?>
	<article class="project-study container section" id="<?php echo esc_attr( $project['id'] ); ?>">
		<div class="section-heading"><div><p class="eyebrow"><?php echo esc_html( $project['type'] ); ?></p><h2><?php echo esc_html( $project['title'] ); ?></h2></div><span class="study-stamp">Unbuilt / Fictional</span></div>
		<figure class="project-panorama project-panorama--<?php echo esc_attr( (string) $index ); ?>"><?php form_field_image( $project['image'] ); ?><figcaption>Illustrative stock photograph. This image does not depict the concept study.</figcaption></figure>
		<div class="project-notes"><p class="lede"><?php echo esc_html( $project['idea'] ); ?></p><div><h3>Approach</h3><p><?php echo esc_html( $project['approach'] ); ?></p></div><div><h3>Material notes</h3><p><?php echo esc_html( $project['materials'] ); ?></p></div></div>
	</article>
	<?php endforeach; ?>
	<?php get_template_part( 'template-parts/content', 'single-service-highlight' ); ?>
</main>
<?php get_footer(); ?>
