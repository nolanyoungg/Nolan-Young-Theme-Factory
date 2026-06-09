<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_section_header( $eyebrow, $title, $lede = '', $alignment = '' ) {
	$classes = 'section-header';
	if ( $alignment ) {
		$classes .= ' section-header--' . sanitize_html_class( $alignment );
	}
	?>
	<header class="<?php echo esc_attr( $classes ); ?>">
		<?php if ( $eyebrow ) : ?>
			<p class="section-eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
		<?php endif; ?>
		<h2 class="section-title"><?php echo esc_html( $title ); ?></h2>
		<?php if ( $lede ) : ?>
			<p class="section-lede"><?php echo wp_kses_post( $lede ); ?></p>
		<?php endif; ?>
	</header>
	<?php
}

function nolan_button( $label, $url, $variant = 'primary' ) {
	$classes = 'button button--' . sanitize_html_class( $variant );
	?>
	<a class="<?php echo esc_attr( $classes ); ?>" href="<?php echo esc_url( $url ); ?>">
		<?php echo esc_html( $label ); ?>
	</a>
	<?php
}

function nolan_inline_kicker( $label ) {
	?>
	<p class="kicker"><?php echo esc_html( $label ); ?></p>
	<?php
}

function nolan_primary_menu_fallback() {
	$items = array(
		array(
			'label'    => __( 'Home', '001_nolan_young_theme_northstar_web_works' ),
			'url'      => home_url( '/#home' ),
			'children' => array(),
		),
		array(
			'label'    => __( 'Explore', '001_nolan_young_theme_northstar_web_works' ),
			'url'      => home_url( '/#work' ),
			'children' => array(
				array( 'label' => __( 'Featured Work', '001_nolan_young_theme_northstar_web_works' ), 'url' => home_url( '/#work' ) ),
				array( 'label' => __( 'Services', '001_nolan_young_theme_northstar_web_works' ), 'url' => home_url( '/#services' ) ),
				array( 'label' => __( 'Journal', '001_nolan_young_theme_northstar_web_works' ), 'url' => home_url( '/#blog' ) ),
				array( 'label' => __( 'Contact', '001_nolan_young_theme_northstar_web_works' ), 'url' => home_url( '/#contact' ) ),
			),
		),
		array( 'label' => __( 'Contact', '001_nolan_young_theme_northstar_web_works' ), 'url' => home_url( '/#contact' ) ),
	);
	echo '<ul class="nav-list">';
	foreach ( $items as $item ) {
		$has_children = ! empty( $item['children'] );
		printf( '<li class="%s">', $has_children ? 'menu-item menu-item-has-children' : 'menu-item' );
		printf(
			'<a href="%1$s">%2$s</a>',
			esc_url( $item['url'] ),
			esc_html( $item['label'] )
		);
		if ( $has_children ) {
			echo '<ul class="sub-menu">';
			foreach ( $item['children'] as $child ) {
				printf(
					'<li class="menu-item"><a href="%1$s">%2$s</a></li>',
					esc_url( $child['url'] ),
					esc_html( $child['label'] )
				);
			}
			echo '</ul>';
		}
		echo '</li>';
	}
	echo '</ul>';
}


