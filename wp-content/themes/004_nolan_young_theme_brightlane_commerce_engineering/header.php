<?php
/**
 * Site header with Brightlane Commerce Engineering menu panels.
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
<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a>
<div class="menu-backdrop" data-menu-backdrop hidden></div>
<header class="site-header" data-site-header>
	<div class="site-header__inner">
		<a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php nolan_young_template_render_logo(); ?></a>
		<nav class="primary-navigation" aria-label="<?php esc_attr_e( 'Primary navigation', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?>">
			<button class="nav-trigger" type="button" data-menu-item="services" aria-controls="services-menu" aria-expanded="false"><?php esc_html_e( 'Services', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></button>
			<button class="nav-trigger" type="button" data-menu-item="about" aria-controls="about-menu" aria-expanded="false"><?php esc_html_e( 'About', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></button>
			<a class="nav-link" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a>
			<button class="nav-trigger" type="button" data-menu-item="blog" aria-controls="blog-menu" aria-expanded="false"><?php esc_html_e( 'Blog', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></button>
		</nav>
		<a class="btn btn-header-cta" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a>
		<button class="mobile-menu-toggle" type="button" data-mobile-menu-open aria-controls="mobile-drawer" aria-expanded="false"><span></span><span></span><span></span><span class="screen-reader-text"><?php esc_html_e( 'Open menu', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></span></button>
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
						<div><p class="eyebrow"><?php esc_html_e( 'Service', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p><h2><?php echo esc_html( $service['title'] ); ?></h2><p><?php echo esc_html( $service['excerpt'] ); ?></p><ul><?php foreach ( $service['bullets'] as $bullet ) : ?><li><?php echo esc_html( $bullet ); ?></li><?php endforeach; ?></ul><a class="btn btn-text" href="<?php echo esc_url( $service['url'] ); ?>"><?php esc_html_e( 'Explore service', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a></div>
					</section>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
	<div class="nolan-menu" id="about-menu" data-menu-dropdown="about" hidden>
		<div class="nolan-menu__inner">
			<div class="nolan-menu__rail" role="list">
				<button type="button" data-rail-item="approach"><?php esc_html_e( 'Our Approach', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></button>
				<button type="button" data-rail-item="values"><?php esc_html_e( 'What We Value', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></button>
				<button type="button" data-rail-item="collaboration"><?php esc_html_e( 'How We Work', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></button>
			</div>
			<div class="nolan-menu__content">
				<section data-rail-content="approach"><?php nolan_young_template_render_image( 'assets/images/portfolio/team-collaboration.jpg', __( 'Brightlane Commerce Engineering team collaboration around a digital project', '004-nolan-young-theme-brightlane-commerce-engineering' ) ); ?><div><h2><?php esc_html_e( 'Strategy, implementation, and launch support stay connected.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2><ul><li><?php esc_html_e( 'Discovery maps platform constraints before design decisions harden.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li><li><?php esc_html_e( 'Content, performance, accessibility, and conversion are planned together.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li><li><?php esc_html_e( 'Handoff notes explain what was built and how to keep improving it.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'Meet Brightlane', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a></div></section>
				<section data-rail-content="values"><?php nolan_young_template_render_image( 'assets/images/portfolio/performance-review.jpg', __( 'Brightlane Commerce Engineering performance review and analytics dashboard', '004-nolan-young-theme-brightlane-commerce-engineering' ) ); ?><div><h2><?php esc_html_e( 'Clear architecture, responsible code, and useful evidence.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2><ul><li><?php esc_html_e( 'Senior engineering decisions over decorative complexity.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li><li><?php esc_html_e( 'Accessible interactions and visible quality checks.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li><li><?php esc_html_e( 'Local assets, documented choices, and practical maintenance paths.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'Read values', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a></div></section>
				<section data-rail-content="collaboration"><?php nolan_young_template_render_image( 'assets/images/hero/developer-screens.jpg', __( 'Brightlane Commerce Engineering developer screens and code workspace', '004-nolan-young-theme-brightlane-commerce-engineering' ) ); ?><div><h2><?php esc_html_e( 'A calm build process for teams that need momentum.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2><ul><li><?php esc_html_e( 'Focused checkpoints around scope, content, and technical risk.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li><li><?php esc_html_e( 'Implementation sprints with reviewable outcomes.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li><li><?php esc_html_e( 'Launch support that turns issues into an improvement queue.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a conversation', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a></div></section>
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
	<div class="mobile-drawer__top"><a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php nolan_young_template_render_logo(); ?></a><button type="button" class="mobile-drawer__close" data-mobile-menu-close><?php esc_html_e( 'Close', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></button></div>
	<nav aria-label="<?php esc_attr_e( 'Mobile navigation', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?>">
		<?php foreach ( array( 'Services' => $services ) as $label => $items ) : ?>
			<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php echo esc_html( $label ); ?></button><div hidden><?php foreach ( $items as $item ) : ?><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo esc_html( $item['title'] ); ?></a><?php endforeach; ?></div></section>
		<?php endforeach; ?>
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'About Us', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></button><div hidden><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'Our Approach', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a><a href="<?php echo esc_url( home_url( '/about/#values' ) ); ?>"><?php esc_html_e( 'What We Value', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a><a href="<?php echo esc_url( home_url( '/about/#process' ) ); ?>"><?php esc_html_e( 'How We Work', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a></div></section>
		<a href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a>
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'Blog', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></button><div hidden><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php esc_html_e( 'All articles', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a><?php foreach ( $articles as $article ) : ?><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a><?php endforeach; ?></div></section>
		<a class="btn btn-primary btn-full" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a>
	</nav>
</aside>
