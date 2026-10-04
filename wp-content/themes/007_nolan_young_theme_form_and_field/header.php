<?php
/**
 * Site header with Northstar menu panels.
 *
 * @package Nolan_Young_Template
 */

$services = nolan_young_template_services();
$articles = nolan_young_template_articles();
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'nolan-young-template' ); ?></a>
<div class="menu-backdrop" data-menu-backdrop hidden></div>
<header class="site-header" data-site-header>
	<div class="site-header__inner">
		<a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php nolan_young_template_render_logo(); ?></a>
		<nav class="primary-navigation" aria-label="<?php esc_attr_e( 'Primary navigation', 'nolan-young-template' ); ?>">
			<button class="nav-trigger" type="button" data-menu-item="services" aria-controls="services-menu" aria-expanded="false"><?php esc_html_e( 'Services', 'nolan-young-template' ); ?></button>
			<button class="nav-trigger" type="button" data-menu-item="about" aria-controls="about-menu" aria-expanded="false"><?php esc_html_e( 'About', 'nolan-young-template' ); ?></button>
			<a class="nav-link" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', 'nolan-young-template' ); ?></a>
			<button class="nav-trigger" type="button" data-menu-item="blog" aria-controls="blog-menu" aria-expanded="false"><?php esc_html_e( 'Blog', 'nolan-young-template' ); ?></button>
		</nav>
		<a class="btn btn-header-cta" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-template' ); ?></a>
		<button class="mobile-menu-toggle" type="button" data-mobile-menu-open aria-controls="mobile-drawer" aria-expanded="false"><span></span><span></span><span></span><span class="screen-reader-text"><?php esc_html_e( 'Open menu', 'nolan-young-template' ); ?></span></button>
	</div>
	<div class="nolan-menu" id="services-menu" data-menu-dropdown="services" hidden>
		<div class="nolan-menu__inner">
			<div class="nolan-menu__rail" role="list">
				<?php foreach ( $services as $key => $service ) : ?>
					<button type="button" data-rail-item="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $service['title'] ); ?></button>
				<?php endforeach; ?>
			</div>
			<div class="nolan-menu__content">
				<?php foreach ( $services as $key => $service ) : ?>
					<section data-rail-content="<?php echo esc_attr( $key ); ?>">
						<?php nolan_young_template_render_image( $service['image'], $service['title'] ); ?>
						<div><p class="eyebrow"><?php esc_html_e( 'Service', 'nolan-young-template' ); ?></p><h2><?php echo esc_html( $service['title'] ); ?></h2><p><?php echo esc_html( $service['excerpt'] ); ?></p><ul><?php foreach ( $service['bullets'] as $bullet ) : ?><li><?php echo esc_html( $bullet ); ?></li><?php endforeach; ?></ul><a class="btn btn-text" href="<?php echo esc_url( $service['url'] ); ?>"><?php esc_html_e( 'Explore service', 'nolan-young-template' ); ?></a></div>
					</section>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
	<div class="nolan-menu" id="about-menu" data-menu-dropdown="about" hidden>
		<div class="nolan-menu__inner">
			<div class="nolan-menu__rail" role="list">
				<button type="button" data-rail-item="approach"><?php esc_html_e( 'Approach', 'nolan-young-template' ); ?></button>
				<button type="button" data-rail-item="values"><?php esc_html_e( 'Values', 'nolan-young-template' ); ?></button>
				<button type="button" data-rail-item="collaboration"><?php esc_html_e( 'Collaboration', 'nolan-young-template' ); ?></button>
			</div>
			<div class="nolan-menu__content">
				<section data-rail-content="approach"><?php nolan_young_template_render_image( 'assets/images/hero/about-approach.svg', __( 'Planning board for a website project', 'nolan-young-template' ) ); ?><div><h2><?php esc_html_e( 'Built around clarity before production.', 'nolan-young-template' ); ?></h2><ul><li><?php esc_html_e( 'Discovery leads the design direction.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Content structure is planned early.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Launch work stays practical and documented.', 'nolan-young-template' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'Meet Northstar', 'nolan-young-template' ); ?></a></div></section>
				<section data-rail-content="values"><?php nolan_young_template_render_image( 'assets/images/hero/about-values.svg', __( 'Website quality values', 'nolan-young-template' ) ); ?><div><h2><?php esc_html_e( 'Useful design, responsible code, direct communication.', 'nolan-young-template' ); ?></h2><ul><li><?php esc_html_e( 'Accessible interactions.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Portable local assets.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Plain-language handoff notes.', 'nolan-young-template' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'Read values', 'nolan-young-template' ); ?></a></div></section>
				<section data-rail-content="collaboration"><?php nolan_young_template_render_image( 'assets/images/hero/about-collaboration.svg', __( 'Collaborative website review', 'nolan-young-template' ) ); ?><div><h2><?php esc_html_e( 'A calm process for busy teams.', 'nolan-young-template' ); ?></h2><ul><li><?php esc_html_e( 'Focused checkpoints.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Clear revision windows.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Support options after launch.', 'nolan-young-template' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a conversation', 'nolan-young-template' ); ?></a></div></section>
			</div>
		</div>
	</div>
	<div class="nolan-menu nolan-menu--blog" id="blog-menu" data-menu-dropdown="blog" hidden>
		<div class="nolan-menu__blog-grid">
			<?php foreach ( $articles as $article ) : ?>
				<article class="blog-card"><?php nolan_young_template_render_image( $article['image'], $article['title'] ); ?><p class="eyebrow"><?php echo esc_html( $article['tag'] ); ?></p><h3><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a></h3><p><?php echo esc_html( $article['excerpt'] ); ?></p></article>
			<?php endforeach; ?>
		</div>
	</div>
</header>
<aside class="mobile-drawer" id="mobile-drawer" data-mobile-drawer hidden>
	<div class="mobile-drawer__top"><a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php nolan_young_template_render_logo(); ?></a><button type="button" class="mobile-drawer__close" data-mobile-menu-close><?php esc_html_e( 'Close', 'nolan-young-template' ); ?></button></div>
	<nav aria-label="<?php esc_attr_e( 'Mobile navigation', 'nolan-young-template' ); ?>">
		<?php foreach ( array( 'Services' => $services ) as $label => $items ) : ?>
			<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php echo esc_html( $label ); ?></button><div hidden><?php foreach ( $items as $item ) : ?><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo esc_html( $item['title'] ); ?></a><?php endforeach; ?></div></section>
		<?php endforeach; ?>
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'About Us', 'nolan-young-template' ); ?></button><div hidden><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'Company approach', 'nolan-young-template' ); ?></a><a href="<?php echo esc_url( home_url( '/about/#values' ) ); ?>"><?php esc_html_e( 'Values', 'nolan-young-template' ); ?></a><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Northstar', 'nolan-young-template' ); ?></a></div></section>
		<a href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', 'nolan-young-template' ); ?></a>
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'Blog', 'nolan-young-template' ); ?></button><div hidden><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php esc_html_e( 'All articles', 'nolan-young-template' ); ?></a><?php foreach ( $articles as $article ) : ?><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a><?php endforeach; ?></div></section>
		<a class="btn btn-primary btn-full" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-template' ); ?></a>
	</nav>
</aside>

