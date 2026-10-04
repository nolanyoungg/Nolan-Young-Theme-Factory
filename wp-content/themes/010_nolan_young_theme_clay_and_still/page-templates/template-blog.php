<?php
/** Template Name: Studio Journal */
get_header();
?>
<main id="primary">
	<?php clay_page_intro( 'Studio journal', 'Things noticed along the way.', 'A small notebook on clay, care and learning to work a little more slowly. Sample editorial notes from our imagined studio.' ); ?>
	<nav class="journal-index container" aria-label="In this journal"><?php foreach ( clay_articles() as $article ) : ?><a href="#<?php echo esc_attr( $article['id'] ); ?>"><?php echo esc_html( $article['title'] ); ?> ↓</a><?php endforeach; ?></nav>
	<div class="container journal-articles"><?php foreach ( clay_articles() as $index => $article ) : ?>
		<article id="<?php echo esc_attr( $article['id'] ); ?>" class="journal-article"><div class="journal-article-side"><p class="eyebrow"><?php echo esc_html( $article['tag'] ); ?></p><?php if ( 2 !== $index ) { clay_image( 0 === $index ? 'detail' : 'hero' ); } else { clay_mark(); } ?></div><div><h2><?php echo esc_html( $article['title'] ); ?></h2><p class="lede"><?php echo esc_html( $article['intro'] ); ?></p><p><?php echo esc_html( $article['body'] ); ?></p><a class="text-link" href="<?php echo clay_url( 2 === $index ? '/services/featured/' : '/work/' ); ?>"><?php echo 2 === $index ? 'Explore the handbuilding workshop' : 'Return to the collection'; ?> ↗</a></div></article>
	<?php endforeach; ?></div>
</main>
<?php get_footer(); ?>
