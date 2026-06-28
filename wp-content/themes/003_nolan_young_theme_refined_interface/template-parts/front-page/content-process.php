<?php
/**
 * Process section.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

$nytt01_steps = array(
	array( '01', esc_html__( 'Discover', 'nolan-young-theme-template-01' ), esc_html__( 'Define users, outcomes, constraints, and measurable success before design starts.', 'nolan-young-theme-template-01' ) ),
	array( '02', esc_html__( 'Shape', 'nolan-young-theme-template-01' ), esc_html__( 'Turn the brief into a sitemap, content hierarchy, and reusable section system.', 'nolan-young-theme-template-01' ) ),
	array( '03', esc_html__( 'Build', 'nolan-young-theme-template-01' ), esc_html__( 'Implement maintainable WordPress components with explicit boundaries and asset wiring.', 'nolan-young-theme-template-01' ) ),
	array( '04', esc_html__( 'Validate', 'nolan-young-theme-template-01' ), esc_html__( 'Test functionality, accessibility, performance, preview output, and release packaging.', 'nolan-young-theme-template-01' ) ),
);
?>
<section class="nytt01-section nytt01-section--dark">
	<div class="nytt01-container">
		<header class="nytt01-section-header">
			<div>
				<p class="nytt01-eyebrow"><?php esc_html_e( 'Process', 'nolan-young-theme-template-01' ); ?></p>
				<h2><?php esc_html_e( 'A controlled path from idea to production', 'nolan-young-theme-template-01' ); ?></h2>
				<p><?php esc_html_e( 'Each phase produces something reviewable, so decisions are visible before they become expensive.', 'nolan-young-theme-template-01' ); ?></p>
			</div>
		</header>
		<div class="nytt01-process-layout">
			<ol class="nytt01-process-list">
				<?php foreach ( $nytt01_steps as $nytt01_step ) : ?>
					<li>
						<span><?php echo esc_html( $nytt01_step[0] ); ?></span>
						<h3><?php echo esc_html( $nytt01_step[1] ); ?></h3>
						<p><?php echo esc_html( $nytt01_step[2] ); ?></p>
					</li>
				<?php endforeach; ?>
			</ol>
			<aside class="nytt01-process-card">
				<p class="nytt01-eyebrow"><?php esc_html_e( 'Every build includes', 'nolan-young-theme-template-01' ); ?></p>
				<ul>
					<li><?php esc_html_e( 'Page-by-page preview review', 'nolan-young-theme-template-01' ); ?></li>
					<li><?php esc_html_e( 'Navigation and footer integrity checks', 'nolan-young-theme-template-01' ); ?></li>
					<li><?php esc_html_e( 'Accessible interaction states', 'nolan-young-theme-template-01' ); ?></li>
					<li><?php esc_html_e( 'Packaged WordPress install artifact', 'nolan-young-theme-template-01' ); ?></li>
				</ul>
			</aside>
		</div>
	</div>
</section>
