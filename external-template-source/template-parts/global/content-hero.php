<?php
/**
 * Front-page hero.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

$nytt01_hero_eyebrow = get_theme_mod( 'nytt01_hero_eyebrow', esc_html__( 'Strategy, design, and engineering', 'nolan-young-theme-template-01' ) );
$nytt01_hero_heading = get_theme_mod( 'nytt01_hero_heading', esc_html__( 'Web experiences built to perform.', 'nolan-young-theme-template-01' ) );
$nytt01_hero_text    = get_theme_mod( 'nytt01_hero_text', esc_html__( 'A production-ready foundation for service businesses, agencies, and product teams that need a fast, accessible WordPress presence.', 'nolan-young-theme-template-01' ) );
?>
<section class="nytt01-hero">
	<div class="nytt01-container nytt01-hero__grid">
		<div class="nytt01-hero__content">
			<p class="nytt01-eyebrow"><?php echo esc_html( $nytt01_hero_eyebrow ); ?></p>
			<h1><?php echo esc_html( $nytt01_hero_heading ); ?></h1>
			<p class="nytt01-hero__lede"><?php echo esc_html( $nytt01_hero_text ); ?></p>
			<div class="nytt01-button-group">
				<a class="nytt01-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a project', 'nolan-young-theme-template-01' ); ?></a>
				<a class="nytt01-button nytt01-button--secondary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'View our work', 'nolan-young-theme-template-01' ); ?></a>
			</div>
		</div>
		<div class="nytt01-hero__visual" aria-hidden="true">
			<div class="nytt01-hero__panel nytt01-hero__panel--large"></div>
			<div class="nytt01-hero__panel nytt01-hero__panel--small"></div>
		</div>
	</div>
</section>
