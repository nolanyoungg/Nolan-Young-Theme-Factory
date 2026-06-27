<?php
/**
 * Site branding.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;
?>
<div class="nytt01-site-branding">
	<?php if ( has_custom_logo() ) : ?>
		<?php the_custom_logo(); ?>
	<?php endif; ?>
	<div class="nytt01-site-branding__text">
		<?php if ( is_front_page() && is_home() ) : ?>
			<h1 class="nytt01-site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
		<?php else : ?>
			<p class="nytt01-site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
		<?php endif; ?>
		<?php if ( get_bloginfo( 'description', 'display' ) ) : ?>
			<p class="nytt01-site-description"><?php bloginfo( 'description' ); ?></p>
		<?php endif; ?>
	</div>
</div>
