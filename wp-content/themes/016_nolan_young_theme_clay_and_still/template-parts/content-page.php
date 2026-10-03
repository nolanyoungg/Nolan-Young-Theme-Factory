<?php /** Standard WordPress page content. */ ?>
<article id="post-<?php the_ID(); ?>" class="wrap reading-width section-space">
	<a class="back-link" href="<?php echo clay_still_url(); ?>">Clay &amp; Still / Home</a>
	<h1><?php the_title(); ?></h1>
	<div class="entry-content"><?php the_content(); wp_link_pages(); ?></div>
	<a class="text-link" href="<?php echo clay_still_url( '/work/' ); ?>">Explore the collection ↗</a>
</article>
