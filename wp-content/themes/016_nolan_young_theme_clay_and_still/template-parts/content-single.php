<?php /** A published studio journal entry. */ ?>
<article id="post-<?php the_ID(); ?>" class="wrap reading-width section-space">
	<a class="back-link" href="<?php echo clay_still_url( '/blog/' ); ?>">Studio journal / All notes</a>
	<p class="eyebrow">Clay &amp; Still notebook</p><h1><?php the_title(); ?></h1>
	<div class="entry-content"><?php the_content(); wp_link_pages(); ?></div>
	<a class="text-link" href="<?php echo clay_still_url(); ?>">Return to the studio ↗</a>
</article>
