<?php
/** Template Name: Studio Services */
get_header();
?>
<main id="primary" class="site-main">
	<?php form_field_page_heading( '02', 'Capabilities', 'A considered approach, at every scale.', 'From a new home to an existing room, we connect architecture and interiors through one clear idea: make the space work beautifully for the people who use it.' ); ?>
	<div class="container service-editorials">
	<?php foreach ( form_field_services() as $index => $service ) : $ids = array( 'residential', 'reuse', 'interiors' ); ?>
	<section class="service-editorial section" id="<?php echo esc_attr( $ids[ $index ] ); ?>"><div><p class="eyebrow"><?php echo esc_html( '0' . ( $index + 1 ) . ' / Capability' ); ?></p><h2><?php echo esc_html( $service['title'] ); ?></h2><p class="lede"><?php echo esc_html( $service['text'] ); ?></p><p class="service-note"><?php echo esc_html( $service['note'] ); ?></p>
	<?php if ( 0 === $index ) : ?><p>We explore site response, room relationships and the balance between openness and retreat. The engagement moves from a shared brief to a resolved design, with further stages agreed around the project’s needs.</p><a class="text-link" href="<?php echo form_field_url( 'services/featured' ); ?>">Explore the engagement ↗</a>
	<?php elseif ( 1 === $index ) : ?><p>Every existing building asks different questions. A measured survey and early specialist advice help establish what can stay, where new use is possible and how old and new can meet honestly.</p><a class="text-link" href="<?php echo form_field_url( 'contact' ); ?>">Discuss an existing building ↗</a>
	<?php else : ?><p>Interior work can stand alone or develop alongside an architectural scheme. We consider circulation, storage, lighting, joinery and finishes as a connected whole.</p><a class="text-link" href="<?php echo form_field_url( 'contact' ); ?>">Discuss an interior ↗</a><?php endif; ?></div><figure><?php form_field_image( 0 === $index ? 'hero' : 'detail' ); ?><figcaption>Illustrative stock / <?php echo esc_html( $service['title'] ); ?> material reference</figcaption></figure></section>
	<?php endforeach; ?>
	</div>
	<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
</main>
<?php get_footer(); ?>
