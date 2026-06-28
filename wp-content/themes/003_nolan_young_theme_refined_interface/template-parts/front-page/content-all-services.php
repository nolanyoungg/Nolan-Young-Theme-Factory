<?php
/**
 * Services section populated by the companion plugin when available.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

$nytt01_services = post_type_exists( 'ny_service' )
	? get_posts(
		array(
			'post_type'      => 'ny_service',
			'posts_per_page' => 6,
			'post_status'    => 'publish',
			'orderby'        => array(
				'menu_order' => 'ASC',
				'title'      => 'ASC',
			),
		)
	)
	: array();
?>
<section class="nytt01-section nytt01-section--muted">
	<div class="nytt01-container">
		<header class="nytt01-section-header">
			<div>
				<p class="nytt01-eyebrow"><?php esc_html_e( 'Services', 'nolan-young-theme-template-01' ); ?></p>
				<h2><?php esc_html_e( 'Capabilities organized around real outcomes', 'nolan-young-theme-template-01' ); ?></h2>
			</div>
		</header>
		<div class="nytt01-service-grid">
			<?php if ( $nytt01_services ) : ?>
				<?php foreach ( $nytt01_services as $nytt01_service ) : ?>
					<article class="nytt01-service-card">
						<h3><a href="<?php echo esc_url( get_permalink( $nytt01_service ) ); ?>"><?php echo esc_html( get_the_title( $nytt01_service ) ); ?></a></h3>
						<p><?php echo esc_html( wp_trim_words( get_the_excerpt( $nytt01_service ), 24 ) ); ?></p>
					</article>
				<?php endforeach; ?>
			<?php else : ?>
				<?php
				$nytt01_fallback_services = array(
					array( esc_html__( 'WordPress strategy', 'nolan-young-theme-template-01' ), esc_html__( 'Clarify goals, sitemap, content model, and launch constraints before design starts.', 'nolan-young-theme-template-01' ) ),
					array( esc_html__( 'Experience design', 'nolan-young-theme-template-01' ), esc_html__( 'Shape page systems, conversion paths, responsive states, and accessible interaction patterns.', 'nolan-young-theme-template-01' ) ),
					array( esc_html__( 'Theme engineering', 'nolan-young-theme-template-01' ), esc_html__( 'Build durable templates, clean assets, and WordPress-native theme behavior.', 'nolan-young-theme-template-01' ) ),
					array( esc_html__( 'Performance optimization', 'nolan-young-theme-template-01' ), esc_html__( 'Tune asset loading, template weight, and release checks around fast page delivery.', 'nolan-young-theme-template-01' ) ),
					array( esc_html__( 'Accessibility remediation', 'nolan-young-theme-template-01' ), esc_html__( 'Improve structure, focus states, keyboard paths, color contrast, and reduced-motion support.', 'nolan-young-theme-template-01' ) ),
					array( esc_html__( 'Ongoing maintenance', 'nolan-young-theme-template-01' ), esc_html__( 'Keep releases predictable with support windows, checks, documentation, and handoff notes.', 'nolan-young-theme-template-01' ) ),
				);
				foreach ( $nytt01_fallback_services as $nytt01_index => $nytt01_fallback_service ) :
					?>
					<article class="nytt01-service-card">
						<span class="nytt01-service-card__index"><?php echo esc_html( sprintf( '%02d', $nytt01_index + 1 ) ); ?></span>
						<h3><?php echo esc_html( $nytt01_fallback_service[0] ); ?></h3>
						<p><?php echo esc_html( $nytt01_fallback_service[1] ); ?></p>
					</article>
				<?php endforeach; ?>
			<?php endif; ?>
		</div>
	</div>
</section>
