<?php
/**
 * Site header for Circuit Commerce Studio.
 *
 * @package Nolan_Young_Theme
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
<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'nolan-young-theme-circuit-commerce-studio' ); ?></a>
<div class="menu-backdrop" data-menu-backdrop hidden></div>
<header class="site-header" data-site-header>
	<div class="site-header__inner">
		<a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php nolan_young_template_render_logo(); ?></a>
		<nav class="primary-navigation" aria-label="<?php esc_attr_e( 'Primary navigation', 'nolan-young-theme-circuit-commerce-studio' ); ?>">
			<button class="nav-trigger" type="button" data-menu-item="services" aria-controls="services-menu" aria-expanded="false"><?php esc_html_e( 'Services', 'nolan-young-theme-circuit-commerce-studio' ); ?></button>
			<button class="nav-trigger" type="button" data-menu-item="about" aria-controls="about-menu" aria-expanded="false"><?php esc_html_e( 'About', 'nolan-young-theme-circuit-commerce-studio' ); ?></button>
			<a class="nav-link" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', 'nolan-young-theme-circuit-commerce-studio' ); ?></a>
			<button class="nav-trigger" type="button" data-menu-item="blog" aria-controls="blog-menu" aria-expanded="false"><?php esc_html_e( 'Blog', 'nolan-young-theme-circuit-commerce-studio' ); ?></button>
		</nav>
		<a class="btn btn-header-cta" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-theme-circuit-commerce-studio' ); ?></a>
		<button class="mobile-menu-toggle" type="button" data-mobile-menu-open aria-controls="mobile-drawer" aria-expanded="false"><span></span><span></span><span></span><span class="screen-reader-text"><?php esc_html_e( 'Open menu', 'nolan-young-theme-circuit-commerce-studio' ); ?></span></button>
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
						<div><p class="eyebrow"><?php esc_html_e( 'Service', 'nolan-young-theme-circuit-commerce-studio' ); ?></p><h2><?php echo esc_html( $service['title'] ); ?></h2><p><?php echo esc_html( $service['excerpt'] ); ?></p><ul><?php foreach ( $service['bullets'] as $bullet ) : ?><li><?php echo esc_html( $bullet ); ?></li><?php endforeach; ?></ul><a class="btn btn-text" href="<?php echo esc_url( $service['url'] ); ?>"><?php esc_html_e( 'Explore service', 'nolan-young-theme-circuit-commerce-studio' ); ?></a></div>
					</section>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
	<div class="nolan-menu" id="about-menu" data-menu-dropdown="about" hidden>
		<div class="nolan-menu__inner">
			<div class="nolan-menu__rail" role="list">
				<button type="button" data-rail-item="approach"><?php esc_html_e( 'Our Approach', 'nolan-young-theme-circuit-commerce-studio' ); ?></button>
				<button type="button" data-rail-item="values"><?php esc_html_e( 'What We Value', 'nolan-young-theme-circuit-commerce-studio' ); ?></button>
				<button type="button" data-rail-item="work"><?php esc_html_e( 'How We Work', 'nolan-young-theme-circuit-commerce-studio' ); ?></button>
			</div>
			<div class="nolan-menu__content">
				<section data-rail-content="approach"><?php nolan_young_template_render_image( 'assets/images/hero/about-approach.svg', __( 'Circuit Commerce Studio planning board illustration', 'nolan-young-theme-circuit-commerce-studio' ) ); ?><div><h2><?php esc_html_e( 'We plan before we polish.', 'nolan-young-theme-circuit-commerce-studio' ); ?></h2><ul><li><?php esc_html_e( 'Discovery anchors the page hierarchy.', 'nolan-young-theme-circuit-commerce-studio' ); ?></li><li><?php esc_html_e( 'Business goals shape the template system.', 'nolan-young-theme-circuit-commerce-studio' ); ?></li><li><?php esc_html_e( 'Launch work stays documented and practical.', 'nolan-young-theme-circuit-commerce-studio' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'About the studio', 'nolan-young-theme-circuit-commerce-studio' ); ?></a></div></section>
				<section data-rail-content="values"><?php nolan_young_template_render_image( 'assets/images/hero/about-values.svg', __( 'Circuit Commerce Studio values illustration', 'nolan-young-theme-circuit-commerce-studio' ) ); ?><div><h2><?php esc_html_e( 'Clear, durable, and easy to operate.', 'nolan-young-theme-circuit-commerce-studio' ); ?></h2><ul><li><?php esc_html_e( 'Direct communication.', 'nolan-young-theme-circuit-commerce-studio' ); ?></li><li><?php esc_html_e( 'Accessible interaction design.', 'nolan-young-theme-circuit-commerce-studio' ); ?></li><li><?php esc_html_e( 'Local assets and stable build outputs.', 'nolan-young-theme-circuit-commerce-studio' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'Read more', 'nolan-young-theme-circuit-commerce-studio' ); ?></a></div></section>
				<section data-rail-content="work"><?php nolan_young_template_render_image( 'assets/images/hero/about-collaboration.svg', __( 'Circuit Commerce Studio collaboration illustration', 'nolan-young-theme-circuit-commerce-studio' ) ); ?><div><h2><?php esc_html_e( 'Focused checkpoints keep projects calm.', 'nolan-young-theme-circuit-commerce-studio' ); ?></h2><ul><li><?php esc_html_e( 'Small review loops.', 'nolan-young-theme-circuit-commerce-studio' ); ?></li><li><?php esc_html_e( 'Clear revision windows.', 'nolan-young-theme-circuit-commerce-studio' ); ?></li><li><?php esc_html_e( 'Support planning after launch.', 'nolan-young-theme-circuit-commerce-studio' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a conversation', 'nolan-young-theme-circuit-commerce-studio' ); ?></a></div></section>
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
	<div class="mobile-drawer__top"><a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php nolan_young_template_render_logo(); ?></a><button type="button" class="mobile-drawer__close" data-mobile-menu-close><?php esc_html_e( 'Close', 'nolan-young-theme-circuit-commerce-studio' ); ?></button></div>
	<nav aria-label="<?php esc_attr_e( 'Mobile navigation', 'nolan-young-theme-circuit-commerce-studio' ); ?>">
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'Services', 'nolan-young-theme-circuit-commerce-studio' ); ?></button><div hidden><?php foreach ( $services as $service ) : ?><a href="<?php echo esc_url( $service['url'] ); ?>"><?php echo esc_html( $service['title'] ); ?></a><?php endforeach; ?></div></section>
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'About Us', 'nolan-young-theme-circuit-commerce-studio' ); ?></button><div hidden><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'Our approach', 'nolan-young-theme-circuit-commerce-studio' ); ?></a><a href="<?php echo esc_url( home_url( '/about/#values' ) ); ?>"><?php esc_html_e( 'What we value', 'nolan-young-theme-circuit-commerce-studio' ); ?></a><a href="<?php echo esc_url( home_url( '/about/#process' ) ); ?>"><?php esc_html_e( 'How we work', 'nolan-young-theme-circuit-commerce-studio' ); ?></a></div></section>
		<a href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', 'nolan-young-theme-circuit-commerce-studio' ); ?></a>
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'Blog', 'nolan-young-theme-circuit-commerce-studio' ); ?></button><div hidden><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php esc_html_e( 'Blog archive', 'nolan-young-theme-circuit-commerce-studio' ); ?></a><?php foreach ( $articles as $article ) : ?><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a><?php endforeach; ?></div></section>
		<a class="btn btn-primary btn-full" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-theme-circuit-commerce-studio' ); ?></a>
	</nav>
</aside>
