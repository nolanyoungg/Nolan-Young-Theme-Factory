<?php
defined( 'ABSPATH' ) || exit;
?>
<section class="section hero">
	<div class="section__grid">
		<div>
			<p class="eyebrow"><?php esc_html_e( 'Nolan Designs', '001_nolan_young_theme_nolan_designs' ); ?></p>
			<h1><?php esc_html_e( 'WordPress websites that help businesses grow.', '001_nolan_young_theme_nolan_designs' ); ?></h1>
			<p><?php esc_html_e( 'Strategy, design, development, and support for service businesses that need a clear, credible online presence.', '001_nolan_young_theme_nolan_designs' ); ?></p>
			<div class="section__actions">
				<a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '001_nolan_young_theme_nolan_designs' ); ?></a>
				<a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'View Work', '001_nolan_young_theme_nolan_designs' ); ?></a>
			</div>
		</div>
		<div>
			<img src="<?php echo esc_url( nolan_young_template_render_hero_image() ); ?>" alt="<?php esc_attr_e( 'Abstract illustration representing a modern digital studio', '001_nolan_young_theme_nolan_designs' ); ?>">
		</div>
	</div>
</section>
