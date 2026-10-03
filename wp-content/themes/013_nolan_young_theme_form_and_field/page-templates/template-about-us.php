<?php
/** Template Name: About the Practice */
get_header();
?>
<main id="primary" class="site-main">
	<?php form_field_page_heading( '01', 'The practice', 'Attention is our starting point.', 'Form & Field is an independent architecture and interiors practice. We imagine places that feel grounded in their surroundings and generous in everyday use.' ); ?>
	<section class="container editorial-split section"><figure><?php form_field_image( 'detail', 'portrait-photo', true ); ?><figcaption>Surface, shadow, proportion. An illustrative material reference.</figcaption></figure><div class="editorial-copy"><p class="eyebrow">Our philosophy</p><h2>A little less.<br>A little better.</h2><p>We are interested in the lasting qualities of a place: the way a room holds the afternoon sun, the ease of moving through a home, the texture of a material after years of use.</p><p>Our work begins with observation. Before proposing an addition, we ask what the existing building can offer. Before choosing a finish, we ask how it will be touched, repaired and lived with.</p><p>Clarity is not an absence of character. It is the result of careful decisions, made together.</p></div></section>
	<?php get_template_part( 'template-parts/content', 'style-pillars' ); ?>
	<section class="section container editorial-split"><div><p class="eyebrow">Working together</p><h2>A shared table,<br>an open conversation.</h2></div><div class="prose"><p>Your knowledge of how you live is central to the brief. We bring spatial thinking, a curiosity about materials and a habit of testing assumptions.</p><p>At each stage, we would make the options, responsibilities and decisions clear. Consultants and craftspeople join the conversation where their expertise is needed; the project becomes stronger through that exchange.</p><p class="fine-print">This is a fictional practice presented as a complete sample website. No professional registration, built portfolio or client history is claimed.</p><a class="text-link" href="<?php echo form_field_url( 'contact' ); ?>">Talk through your idea ↗</a></div></section>
</main>
<?php get_footer(); ?>
