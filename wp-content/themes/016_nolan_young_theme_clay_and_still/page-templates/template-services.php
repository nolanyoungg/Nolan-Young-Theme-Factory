<?php
/**
 * Template Name: Workshops and Studio Sessions
 */
get_header();
?>
<main id="primary">
	<?php clay_still_page_intro( 'At the table', 'Make room for making.', 'A first pinch pot, a form made for a particular place, or time to follow your own idea. There is more than one way into clay.' ); ?>
	<section class="wrap service-intro"><figure><?php clay_still_image( 'red', '', true ); ?><figcaption>A study in silhouette, used as illustrative inspiration.</figcaption></figure><div><p class="eyebrow">Curiosity is enough</p><h2>Start small.<br><em>See what takes shape.</em></h2><p>Our sample studio programme brings patient guidance and tactile exploration together. Each offering starts with a conversation about what you want to make and how you like to learn.</p><p class="small-note">All offerings are illustrative. There are no live dates, prices, or booking availability.</p></div></section>
	<?php get_template_part( 'template-parts/content', 'all-services' ); ?>
	<section class="wrap reading-width section-space"><p class="eyebrow">Before you begin</p><h2>A few useful details.</h2>
		<details class="faq"><summary>Do I need any experience?</summary><p>Not for introductory handbuilding. The sample session begins with handling clay and building one simple form, with time for individual questions.</p></details>
		<details class="faq"><summary>Can we talk about a commission?</summary><p>Yes, through the demo inquiry. Describe the intended use, approximate dimensions, surface colours, and any timing considerations. This demonstration does not provide a quote or accept an order.</p></details>
		<details class="faq"><summary>What about access and comfort?</summary><p>The sample programme is designed around seated table work. Before a real booking, a studio should confirm step-free access, table heights, facilities, support needs, and any material sensitivities directly with you.</p></details>
		<a class="text-link" href="<?php echo clay_still_url( '/contact/' ); ?>">Start with a question ↗</a>
	</section>
</main>
<?php get_footer(); ?>
