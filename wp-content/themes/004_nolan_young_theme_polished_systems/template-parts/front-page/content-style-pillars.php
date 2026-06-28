<?php
/**
 * Style and engineering pillars.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

$nytt01_pillars = array(
	array(
		'label' => esc_html__( '01', 'nolan-young-theme-template-01' ),
		'title' => esc_html__( 'Accessible by design', 'nolan-young-theme-template-01' ),
		'text'  => esc_html__( 'Semantic structure, keyboard operation, visible focus, and reduced-motion support are built into the baseline.', 'nolan-young-theme-template-01' ),
	),
	array(
		'label' => esc_html__( '02', 'nolan-young-theme-template-01' ),
		'title' => esc_html__( 'Portable content', 'nolan-young-theme-template-01' ),
		'text'  => esc_html__( 'Content models and processing remain in the plugin so a future theme change does not hide business data.', 'nolan-young-theme-template-01' ),
	),
	array(
		'label' => esc_html__( '03', 'nolan-young-theme-template-01' ),
		'title' => esc_html__( 'Controlled releases', 'nolan-young-theme-template-01' ),
		'text'  => esc_html__( 'Source, generated assets, tests, previews, and production packages are separated and validated before installation.', 'nolan-young-theme-template-01' ),
	),
);
?>
<section class="nytt01-section">
	<div class="nytt01-container">
		<header class="nytt01-section-header">
			<div>
				<p class="nytt01-eyebrow"><?php esc_html_e( 'Standards', 'nolan-young-theme-template-01' ); ?></p>
				<h2><?php esc_html_e( 'The rules that protect quality', 'nolan-young-theme-template-01' ); ?></h2>
			</div>
		</header>
		<div class="nytt01-pillar-grid">
			<?php foreach ( $nytt01_pillars as $nytt01_pillar ) : ?>
				<article>
					<span><?php echo esc_html( $nytt01_pillar['label'] ); ?></span>
					<h3><?php echo esc_html( $nytt01_pillar['title'] ); ?></h3>
					<p><?php echo esc_html( $nytt01_pillar['text'] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
