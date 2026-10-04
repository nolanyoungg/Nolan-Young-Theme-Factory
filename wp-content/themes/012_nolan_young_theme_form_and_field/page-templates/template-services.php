<?php /** Template Name: Services */ get_header(); ?>
<main id="primary" tabindex="-1">
<?php ff_intro( 'Capabilities / 01—03', 'From the first sketch to the smallest detail.', 'Three connected disciplines. One considered approach to the places we inhabit.' ); ?>
<figure class="container services-banner"><?php ff_image( 'hero', '', true ); ?><figcaption>Light and proportion as starting points. Illustrative stock photography.</figcaption></figure>
<section class="container service-details section" aria-label="Our capabilities"><?php foreach ( ff_capabilities() as $i => $service ) : ?><article id="<?php echo esc_attr( $service['id'] ); ?>" class="service-detail" data-reveal><span class="drawing-number">0<?php echo esc_html( $i + 1 ); ?></span><h2><?php echo esc_html( $service['title'] ); ?></h2><div><p class="lead"><?php echo esc_html( $service['text'] ); ?></p><p><?php echo esc_html( $service['detail'] ); ?></p><p class="eyebrow"><?php echo esc_html( $service['scope'] ); ?></p><a class="text-link" href="<?php echo 0 === $i ? ff_url( '/services/featured/' ) : ff_url( '/contact/' ); ?>"><?php echo 0 === $i ? 'Explore the engagement' : 'Discuss a possible project'; ?> ↗</a></div></article><?php endforeach; ?></section>
<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main><?php get_footer(); ?>
