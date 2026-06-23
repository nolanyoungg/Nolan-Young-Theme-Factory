<?php
/**
 * Shared featured-content mega menu for Services and About.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

$mega_key     = isset( $args['mega_key'] ) ? sanitize_key( $args['mega_key'] ) : '';
$panel_id     = isset( $args['panel_id'] ) ? sanitize_html_class( $args['panel_id'] ) : '';
$trigger_id   = isset( $args['trigger_id'] ) ? sanitize_html_class( $args['trigger_id'] ) : '';
$eyebrow      = isset( $args['eyebrow'] ) ? (string) $args['eyebrow'] : '';
$menu_heading = isset( $args['menu_heading'] ) ? (string) $args['menu_heading'] : '';
$overview_url = isset( $args['overview_url'] ) ? (string) $args['overview_url'] : home_url( '/' );
$items        = isset( $args['items'] ) && is_array( $args['items'] ) ? array_values( $args['items'] ) : array();
$first_item   = ! empty( $items ) ? $items[0] : array();

if ( empty( $panel_id ) || empty( $trigger_id ) || empty( $items ) ) {
	return;
}

$first_subitems       = ! empty( $first_item['subitems'] ) && is_array( $first_item['subitems'] ) ? array_values( $first_item['subitems'] ) : array();
$first_subitems_label = sprintf(
	/* translators: %s: Selected mega-menu item title. */
	esc_html__( '%s related links', 'nolan-young-theme-template-01' ),
	$first_item['title']
);
?>
<div
	id="<?php echo esc_attr( $panel_id ); ?>"
	class="nytt01-mega-menu nytt01-mega-menu--featured"
	aria-labelledby="<?php echo esc_attr( $trigger_id ); ?>"
	data-nytt01-mega-panel
	data-nytt01-mega-type="<?php echo esc_attr( $mega_key ); ?>"
	hidden
>
	<div class="nytt01-mega-menu__inner">
		<section class="nytt01-mega-menu__choices" aria-labelledby="<?php echo esc_attr( $panel_id ); ?>-heading">
			<div class="nytt01-mega-menu__choices-heading">
				<h2 id="<?php echo esc_attr( $panel_id ); ?>-heading"><?php echo esc_html( $menu_heading ); ?></h2>
				<a href="<?php echo esc_url( $overview_url ); ?>"><?php esc_html_e( 'View overview', 'nolan-young-theme-template-01' ); ?></a>
			</div>
			<div class="nytt01-mega-menu__option-list">
				<?php foreach ( $items as $index => $item ) : ?>
					<?php
					$item_id        = $panel_id . '-option-' . (int) $index;
					$is_active      = 0 === $index;
					$item_subitems  = ! empty( $item['subitems'] ) && is_array( $item['subitems'] ) ? array_values( $item['subitems'] ) : array();
					$cta_label      = sprintf(
						/* translators: %s: Mega-menu item title. */
						esc_html__( 'Explore %s', 'nolan-young-theme-template-01' ),
						$item['title']
					);
					$subitems_label = sprintf(
						/* translators: %s: Mega-menu item title. */
						esc_html__( '%s related links', 'nolan-young-theme-template-01' ),
						$item['title']
					);
					?>
					<article class="nytt01-mega-option<?php echo $is_active ? ' is-selected' : ''; ?>" data-nytt01-mega-option-wrapper>
						<button
							id="<?php echo esc_attr( $item_id ); ?>"
							class="nytt01-mega-option__button"
							type="button"
							aria-pressed="<?php echo $is_active ? 'true' : 'false'; ?>"
							data-nytt01-mega-option
							data-feature-image="<?php echo esc_url( $item['image'] ); ?>"
							data-feature-title="<?php echo esc_attr( $item['title'] ); ?>"
							data-feature-description="<?php echo esc_attr( $item['description'] ); ?>"
							data-feature-url="<?php echo esc_url( $item['url'] ); ?>"
							data-feature-link-label="<?php echo esc_attr( $cta_label ); ?>"
							data-feature-subitems="<?php echo esc_attr( wp_json_encode( $item_subitems ) ); ?>"
							data-feature-subitems-label="<?php echo esc_attr( $subitems_label ); ?>"
						>
							<span><?php echo esc_html( $item['title'] ); ?></span>
							<span class="nytt01-mega-option__arrow" aria-hidden="true">→</span>
						</button>
					</article>
				<?php endforeach; ?>
			</div>
		</section>

		<section class="nytt01-mega-feature" aria-live="polite" aria-atomic="true" data-nytt01-mega-feature>
			<div class="nytt01-mega-feature__media">
				<img
					class="nytt01-mega-feature__image"
					src="<?php echo esc_url( $first_item['image'] ); ?>"
					alt=""
					width="720"
					height="450"
					decoding="async"
					data-nytt01-mega-feature-image
				>
			</div>
			<div class="nytt01-mega-feature__content">
				<p class="nytt01-mega-menu__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
				<h2 class="nytt01-mega-feature__title" data-nytt01-mega-feature-title><?php echo esc_html( $first_item['title'] ); ?></h2>
				<p class="nytt01-mega-feature__description" data-nytt01-mega-feature-description><?php echo esc_html( $first_item['description'] ); ?></p>
				<ul
					class="nytt01-mega-option__subitems"
					aria-label="<?php echo esc_attr( $first_subitems_label ); ?>"
					data-nytt01-mega-feature-subitems
					<?php echo empty( $first_subitems ) ? ' hidden' : ''; ?>
				>
					<?php foreach ( $first_subitems as $subitem ) : ?>
						<li><a class="nytt01-mega-feature__subitem-link" href="<?php echo esc_url( $subitem['url'] ); ?>"><?php echo esc_html( $subitem['label'] ); ?></a></li>
					<?php endforeach; ?>
				</ul>
				<a class="nytt01-text-link nytt01-mega-feature__link" href="<?php echo esc_url( $first_item['url'] ); ?>" data-nytt01-mega-feature-link>
					<?php
					printf(
						/* translators: %s: Selected mega-menu item title. */
						esc_html__( 'Explore %s', 'nolan-young-theme-template-01' ),
						esc_html( $first_item['title'] )
					);
					?>
				</a>
			</div>
		</section>
	</div>
</div>
