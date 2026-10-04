<?php
/** Template Name: Workshops and Commissions */
get_header();
?>
<main id="primary">
	<?php clay_page_intro( 'Workshops & commissions', 'A little time. Something made by you.', 'Learn a new gesture, develop an idea, or imagine a piece for a particular place. There is more than one way to begin with clay.' ); ?>
	<div class="container wide-photo"><?php clay_image( 'hero', '', true ); ?><p class="small">Ceramic forms for inspiration. Illustrative photography.</p></div>
	<?php get_template_part( 'template-parts/content', 'all-services' ); ?>
	<section class="section faq-section container"><div><p class="eyebrow">Before you begin</p><h2>A few good<br><em>questions.</em></h2></div><div class="faq-list">
		<details><summary>Do I need to have worked with clay before?</summary><p>No. The introductory handbuilding workshop is designed for first-time makers. Studio sessions are better suited to people who have tried a little clay work already.</p></details>
		<details><summary>Can I discuss a commission?</summary><p>Yes, you can try the sample inquiry form. A real commission would need an agreed brief, clay and glaze tests, a price and a realistic making schedule before work began. This demonstration accepts no orders or payments.</p></details>
		<details><summary>Are dates available to book?</summary><p>This is a fictional studio with no live calendar. The workshop page describes the sample experience; its inquiry form makes no reservation.</p></details>
		<details><summary>What about access needs?</summary><p>A real studio should discuss table height, seating, step-free access and individual support before a visit. Use the sample note field to explore that conversation; no venue or access provision is being claimed here.</p></details>
	</div></section>
</main>
<?php get_footer(); ?>
