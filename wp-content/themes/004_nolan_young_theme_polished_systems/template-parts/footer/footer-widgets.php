<?php
/**
 * Footer widget and brand area.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

$nytt01_footer_columns = array(
	array(
		'title' => esc_html__( 'Design systems', 'nolan-young-theme-template-01' ),
		'items' => array(
			esc_html__( 'Accessible interface patterns', 'nolan-young-theme-template-01' ),
			esc_html__( 'Reusable page sections', 'nolan-young-theme-template-01' ),
			esc_html__( 'Brand-consistent content flow', 'nolan-young-theme-template-01' ),
		),
	),
	array(
		'title' => esc_html__( 'WordPress delivery', 'nolan-young-theme-template-01' ),
		'items' => array(
			esc_html__( 'Theme architecture', 'nolan-young-theme-template-01' ),
			esc_html__( 'Performance-aware assets', 'nolan-young-theme-template-01' ),
			esc_html__( 'Release-ready packaging', 'nolan-young-theme-template-01' ),
		),
	),
	array(
		'title' => esc_html__( 'Project rhythm', 'nolan-young-theme-template-01' ),
		'items' => array(
			esc_html__( 'Discovery and sitemap clarity', 'nolan-young-theme-template-01' ),
			esc_html__( 'Weekly review checkpoints', 'nolan-young-theme-template-01' ),
			esc_html__( 'Post-launch support paths', 'nolan-young-theme-template-01' ),
		),
	),
);
?>
<div class="nytt01-site-footer__main">
	<div class="nytt01-site-footer__brand">
		<p class="nytt01-site-footer__title"><?php bloginfo( 'name' ); ?></p>
		<p><?php esc_html_e( 'A disciplined WordPress foundation built for accessible service sites, durable content systems, and reliable production delivery.', 'nolan-young-theme-template-01' ); ?></p>
		<a class="nytt01-button nytt01-button--light" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">
			<?php esc_html_e( 'Start with a focused brief', 'nolan-young-theme-template-01' ); ?>
		</a>
	</div>
	<?php if ( is_active_sidebar( 'footer-widgets' ) ) : ?>
		<div class="nytt01-footer-widgets">
			<?php dynamic_sidebar( 'footer-widgets' ); ?>
		</div>
	<?php else : ?>
		<div class="nytt01-footer-widgets nytt01-footer-widgets--fallback">
			<?php foreach ( $nytt01_footer_columns as $nytt01_column ) : ?>
				<section class="nytt01-footer-column">
					<h2><?php echo esc_html( $nytt01_column['title'] ); ?></h2>
					<ul>
						<?php foreach ( $nytt01_column['items'] as $nytt01_item ) : ?>
							<li><?php echo esc_html( $nytt01_item ); ?></li>
						<?php endforeach; ?>
					</ul>
				</section>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</div>
