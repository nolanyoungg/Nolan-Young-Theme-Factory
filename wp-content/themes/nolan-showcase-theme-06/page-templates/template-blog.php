<?php
/**
 * Template Name: Blog
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section class="section">
	<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>
</section>
<?php if ( have_posts() ) : ?>
<section class="section">
	<div class="container content-shell">
		<?php while ( have_posts() ) : the_post(); ?>
			<article class="content-article">
				<header class="entry-header">
					<h1 class="entry-title"><?php the_title(); ?></h1>
				</header>
				<div class="entry-content"><?php the_content(); ?></div>
			</article>
		<?php endwhile; ?>
	</div>
</section>
<?php endif; ?>
<?php
get_footer();

