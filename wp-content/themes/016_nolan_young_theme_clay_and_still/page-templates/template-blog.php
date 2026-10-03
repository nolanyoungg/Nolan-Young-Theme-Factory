<?php
/**
 * Template Name: Studio Journal
 */
get_header();
?>
<main id="primary">
	<?php clay_still_page_intro( 'Studio journal', 'Things noticed along the way.', 'Notes on clay, care, and making space. A small studio notebook for the curious, with no perfect answers required.' ); ?>
	<div class="wrap journal-layout section-space">
		<aside class="journal-aside"><figure><?php clay_still_image( 'red', '', true ); ?><figcaption>Illustrative glaze and form inspiration.</figcaption></figure><nav aria-label="Journal notes"><?php foreach ( clay_still_notes() as $note ) : ?><a href="#<?php echo esc_attr( $note['id'] ); ?>"><?php echo esc_html( $note['category'] ); ?> ↓</a><?php endforeach; ?></nav><p class="small-note">From the fictional Clay &amp; Still notebook.</p></aside>
		<div class="journal-articles"><?php foreach ( clay_still_notes() as $note ) : ?><article id="<?php echo esc_attr( $note['id'] ); ?>"><p class="eyebrow"><?php echo esc_html( $note['category'] ); ?> / Studio note</p><h2><?php echo esc_html( $note['title'] ); ?></h2><p class="journal-deck"><?php echo esc_html( $note['excerpt'] ); ?></p><p><?php echo esc_html( $note['body'] ); ?></p><a class="text-link" href="<?php echo clay_still_url( '/services/featured/' ); ?>">Explore these ideas with clay ↗</a></article><?php endforeach; ?></div>
	</div>
	<section class="wrap journal-next"><h2>Keep a little curiosity.</h2><a class="button" href="<?php echo clay_still_url( '/work/' ); ?>">Return to the collection ↗</a></section>
</main>
<?php get_footer(); ?>
