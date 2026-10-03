<?php
/**
 * Template Name: The Collection
 */
get_header();
?>
<main id="primary">
	<?php clay_still_page_intro( 'The collection', 'Forms to live alongside.', 'Two illustrative vessel studies, gathered around surface, silhouette, and the quiet usefulness of an object. A small collection of ideas, not a shop.' ); ?>
	<section class="wrap collection-stories">
		<?php foreach ( clay_still_forms() as $form ) : ?>
		<article class="collection-story" id="study-<?php echo esc_attr( $form['number'] ); ?>">
			<figure class="study-image--<?php echo esc_attr( $form['image'] ); ?> reveal"><?php clay_still_image( $form['image'] ); ?><figcaption>Illustrative stock photograph; not a Clay &amp; Still product.</figcaption></figure>
			<div><p class="eyebrow">Vessel study / <?php echo esc_html( $form['number'] ); ?></p><h2><?php echo esc_html( $form['name'] ); ?></h2><p><?php echo esc_html( $form['description'] ); ?></p><dl class="material-list"><dt>Imagined material</dt><dd><?php echo esc_html( $form['material'] ); ?></dd><dt>Intended character</dt><dd>Decorative vessel, for a shelf or a considered corner.</dd><dt>Care</dt><dd>Clean gently with a soft cloth. Use an inner container for water. Food and appliance safety are not asserted for these photographic studies.</dd></dl><a class="text-link" href="<?php echo clay_still_url( '/contact/' ); ?>">Talk about a form of your own ↗</a></div>
		</article>
		<?php endforeach; ?>
	</section>
	<section class="material-note wrap section-space"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/mark-1.svg' ) ); ?>" width="38" height="38" alt=""><h2>A note on these studies.</h2><p>The material descriptions are creative concepts. The approved photographs show work by other makers and do not establish actual dimensions, glaze composition, availability, or safety certifications. There is no checkout.</p><a class="text-link" href="<?php echo clay_still_url( '/blog/#vessel-care' ); ?>">Read our care notes ↗</a></section>
</main>
<?php get_footer(); ?>
