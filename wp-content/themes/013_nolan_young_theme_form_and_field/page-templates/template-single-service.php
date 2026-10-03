<?php
/** Template Name: Residential Architecture */
get_header();
?>
<main id="primary" class="site-main">
	<?php form_field_page_heading( '02.1', 'Residential architecture', 'A home, in your own terms.', 'An engagement shaped around the site and the life you want to make there. New homes, thoughtful extensions and careful transformations of existing places.' ); ?>
	<figure class="container service-hero"><?php form_field_image( 'hero', '', true ); ?><figcaption>Light and proportion / Illustrative stock, not a completed commission.</figcaption></figure>
	<section class="section container editorial-split"><div><p class="eyebrow">The engagement</p><h2>From daily rituals<br>to a clear direction.</h2></div><div class="prose"><p>We begin with what matters to you: somewhere to gather, a quiet place to work, an easier relationship with the garden. Those ordinary needs give the design its purpose.</p><p>Early work considers the site, existing fabric, planning context and budget priorities. We then test a small number of spatial approaches before developing one together.</p><p>Later technical design, consultant coordination and construction-stage services would be set out in an agreed written scope. Fees and timing depend on the project; there is no fixed package or implied approval.</p><a class="text-link" href="<?php echo form_field_url( 'contact' ); ?>">Discuss a residential project ↗</a></div></section>
	<section class="section stone-band"><div class="container"><p class="eyebrow">What takes shape</p><div class="deliverables"><article><span>01</span><h3>A shared brief</h3><p>Priorities, room relationships, project constraints and a clear record of the decisions ahead.</p></article><article><span>02</span><h3>A spatial proposal</h3><p>Plans and studies that explain the idea, its response to the site and the experience of moving through it.</p></article><article><span>03</span><h3>A material direction</h3><p>A considered palette and key details, with practical questions of care and longevity built in.</p></article></div></div></section>
	<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
	<?php get_template_part( 'template-parts/content', 'cta-banner' ); ?>
</main>
<?php get_footer(); ?>
