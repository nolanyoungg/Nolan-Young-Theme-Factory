<?php
/**
 * Site header with ForgeCart Studio menu panels.
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
						<?php nolan_young_template_render_image( $service['image'], $service['alt'], 'menu-photo' ); ?>
						<div><p class="eyebrow"><?php esc_html_e( 'Service', 'nolan-young-template' ); ?></p><h2><?php echo esc_html( $service['title'] ); ?></h2><p><?php echo esc_html( $service['excerpt'] ); ?></p><ul><?php foreach ( $service['bullets'] as $bullet ) : ?><li><?php echo esc_html( $bullet ); ?></li><?php endforeach; ?></ul><a class="btn btn-text" href="<?php echo esc_url( $service['url'] ); ?>"><?php esc_html_e( 'Explore service', 'nolan-young-template' ); ?></a></div>
					</section>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
	<div class="nolan-menu" id="about-menu" data-menu-dropdown="about" hidden>
		<div class="nolan-menu__inner">
			<div class="nolan-menu__rail" role="list">
				<button type="button" data-rail-item="approach"><?php esc_html_e( 'Studio Approach', 'nolan-young-template' ); ?></button>
				<button type="button" data-rail-item="process"><?php esc_html_e( 'Launch Process', 'nolan-young-template' ); ?></button>
				<button type="button" data-rail-item="support"><?php esc_html_e( 'Support Model', 'nolan-young-template' ); ?></button>
			</div>
			<div class="nolan-menu__content">
				<section data-rail-content="approach"><?php nolan_young_template_render_image( 'assets/images/portfolio/team-collaboration.jpg', __( 'ForgeCart Studio team collaboration around a digital project', 'nolan-young-template' ), 'menu-photo' ); ?><div><h2><?php esc_html_e( 'One studio for content, commerce, and launch operations.', 'nolan-young-template' ); ?></h2><ul><li><?php esc_html_e( 'WordPress when publishing depth matters.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Shopify when catalog and checkout flow lead.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Practical guidance when a business needs both.', 'nolan-young-template' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'Meet ForgeCart Studio', 'nolan-young-template' ); ?></a></div></section>
				<section data-rail-content="process"><?php nolan_young_template_render_image( 'assets/images/hero/agency-workspace.jpg', __( 'ForgeCart Studio strategy workspace with laptops and planning material', 'nolan-young-template' ), 'menu-photo' ); ?><div><h2><?php esc_html_e( 'Discovery, structure, build, launch, and handoff stay connected.', 'nolan-young-template' ); ?></h2><ul><li><?php esc_html_e( 'Scope and content are shaped before production.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Review checkpoints keep decisions visible.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Launch notes cover analytics, forms, and editing workflows.', 'nolan-young-template' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/about/#process' ) ); ?>"><?php esc_html_e( 'See the process', 'nolan-young-template' ); ?></a></div></section>
				<section data-rail-content="support"><?php nolan_young_template_render_image( 'assets/images/portfolio/performance-review.jpg', __( 'ForgeCart Studio performance review and analytics dashboard', 'nolan-young-template' ), 'menu-photo' ); ?><div><h2><?php esc_html_e( 'Support is planned as operating care, not vague maintenance.', 'nolan-young-template' ); ?></h2><ul><li><?php esc_html_e( 'Updates, backups, and issue triage.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Small content edits and campaign pages.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Performance and checkout-readiness review.', 'nolan-young-template' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a conversation', 'nolan-young-template' ); ?></a></div></section>
			</div>
		</div>
	</div>
	<div class="nolan-menu nolan-menu--blog" id="blog-menu" data-menu-dropdown="blog" hidden>
		<div class="nolan-menu__blog-grid">
			<?php foreach ( $articles as $article ) : ?>
				<article class="blog-card"><?php nolan_young_template_render_image( $article['image'], $article['alt'] ); ?><p class="eyebrow"><?php echo esc_html( $article['tag'] ); ?></p><h3><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a></h3><p><?php echo esc_html( $article['excerpt'] ); ?></p></article>
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
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'About Us', 'nolan-young-template' ); ?></button><div hidden><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'Studio approach', 'nolan-young-template' ); ?></a><a href="<?php echo esc_url( home_url( '/about/#process' ) ); ?>"><?php esc_html_e( 'Launch process', 'nolan-young-template' ); ?></a><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact ForgeCart Studio', 'nolan-young-template' ); ?></a></div></section>
		<a href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', 'nolan-young-template' ); ?></a>
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'Blog', 'nolan-young-template' ); ?></button><div hidden><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php esc_html_e( 'All articles', 'nolan-young-template' ); ?></a><?php foreach ( $articles as $article ) : ?><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a><?php endforeach; ?></div></section>
		<a class="btn btn-primary btn-full" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-template' ); ?></a>
	</nav>
</aside>

