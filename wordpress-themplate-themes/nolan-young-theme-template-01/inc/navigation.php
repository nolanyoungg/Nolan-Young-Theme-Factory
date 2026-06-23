<?php
/**
 * Primary navigation and mega-menu presentation helpers.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

/**
 * Determine whether a primary menu item owns a supported mega menu.
 *
 * Administrators can keep the association stable after renaming a menu item by
 * assigning one of these CSS classes in Appearance > Menus:
 *
 * - nytt01-mega-services
 * - nytt01-mega-about
 * - nytt01-mega-blog
 *
 * @param WP_Post $menu_item Navigation menu item.
 * @return string
 */
function nytt01_get_mega_menu_key( $menu_item ) {
	$classes = array_filter( array_map( 'sanitize_html_class', (array) $menu_item->classes ) );
	$map     = array(
		'nytt01-mega-services' => 'services',
		'nytt01-mega-about'    => 'about',
		'nytt01-mega-blog'     => 'blog',
	);

	foreach ( $map as $class_name => $mega_key ) {
		if ( in_array( $class_name, $classes, true ) ) {
			return $mega_key;
		}
	}

	$candidates = array(
		sanitize_title( wp_strip_all_tags( (string) $menu_item->title ) ),
	);

	if ( ! empty( $menu_item->object ) && 'page' === $menu_item->object && ! empty( $menu_item->object_id ) ) {
		$candidates[] = sanitize_title( (string) get_post_field( 'post_name', (int) $menu_item->object_id ) );
	}

	if ( ! empty( $menu_item->url ) ) {
		$path = (string) wp_parse_url( $menu_item->url, PHP_URL_PATH );
		$path = trim( $path, '/' );

		if ( '' !== $path ) {
			$parts        = explode( '/', $path );
			$candidates[] = sanitize_title( (string) end( $parts ) );
		}
	}

	foreach ( array_unique( $candidates ) as $candidate ) {
		if ( in_array( $candidate, array( 'services', 'service' ), true ) ) {
			return 'services';
		}

		if ( in_array( $candidate, array( 'about', 'about-us' ), true ) ) {
			return 'about';
		}

		if ( in_array( $candidate, array( 'blog', 'news', 'insights' ), true ) ) {
			return 'blog';
		}
	}

	return '';
}

/**
 * Return a theme image URI for navigation artwork.
 *
 * @param string $filename Image filename.
 * @return string
 */
function nytt01_get_navigation_image_uri( $filename ) {
	return get_theme_file_uri( '/assets/images/navigation/' . ltrim( sanitize_file_name( $filename ), '/' ) );
}

/**
 * Return default Services mega-menu content.
 *
 * @return array<int, array<string, mixed>>
 */
function nytt01_get_services_mega_menu_items() {
	$items = array(
		array(
			'title'       => esc_html__( 'Service 1', 'nolan-young-theme-template-01' ),
			'description' => esc_html__( 'A focused service package designed to turn a defined business need into a clear, measurable implementation plan.', 'nolan-young-theme-template-01' ),
			'image'       => nytt01_get_navigation_image_uri( 'service-1.svg' ),
			'url'         => home_url( '/services/service-1/' ),
			'subitems'    => array(
				array( 'label' => esc_html__( 'Overview', 'nolan-young-theme-template-01' ), 'url' => home_url( '/services/service-1/' ) ),
				array( 'label' => esc_html__( 'Capabilities', 'nolan-young-theme-template-01' ), 'url' => home_url( '/services/service-1/#capabilities' ) ),
				array( 'label' => esc_html__( 'Process', 'nolan-young-theme-template-01' ), 'url' => home_url( '/services/service-1/#process' ) ),
			),
		),
		array(
			'title'       => esc_html__( 'Service 2', 'nolan-young-theme-template-01' ),
			'description' => esc_html__( 'A collaborative engagement for improving the structure, usability, and accessibility of an existing digital experience.', 'nolan-young-theme-template-01' ),
			'image'       => nytt01_get_navigation_image_uri( 'service-2.svg' ),
			'url'         => home_url( '/services/service-2/' ),
			'subitems'    => array(
				array( 'label' => esc_html__( 'Experience review', 'nolan-young-theme-template-01' ), 'url' => home_url( '/services/service-2/#review' ) ),
				array( 'label' => esc_html__( 'Accessibility', 'nolan-young-theme-template-01' ), 'url' => home_url( '/services/service-2/#accessibility' ) ),
				array( 'label' => esc_html__( 'Optimization', 'nolan-young-theme-template-01' ), 'url' => home_url( '/services/service-2/#optimization' ) ),
			),
		),
		array(
			'title'       => esc_html__( 'Service 3', 'nolan-young-theme-template-01' ),
			'description' => esc_html__( 'Production engineering for maintainable WordPress systems, custom integrations, and dependable release workflows.', 'nolan-young-theme-template-01' ),
			'image'       => nytt01_get_navigation_image_uri( 'service-3.svg' ),
			'url'         => home_url( '/services/service-3/' ),
			'subitems'    => array(
				array( 'label' => esc_html__( 'WordPress development', 'nolan-young-theme-template-01' ), 'url' => home_url( '/services/service-3/#wordpress' ) ),
				array( 'label' => esc_html__( 'Integrations', 'nolan-young-theme-template-01' ), 'url' => home_url( '/services/service-3/#integrations' ) ),
				array( 'label' => esc_html__( 'Release systems', 'nolan-young-theme-template-01' ), 'url' => home_url( '/services/service-3/#releases' ) ),
			),
		),
		array(
			'title'       => esc_html__( 'Service 4', 'nolan-young-theme-template-01' ),
			'description' => esc_html__( 'Ongoing technical stewardship focused on performance, stability, security, and controlled continuous improvement.', 'nolan-young-theme-template-01' ),
			'image'       => nytt01_get_navigation_image_uri( 'service-4.svg' ),
			'url'         => home_url( '/services/service-4/' ),
			'subitems'    => array(
				array( 'label' => esc_html__( 'Maintenance', 'nolan-young-theme-template-01' ), 'url' => home_url( '/services/service-4/#maintenance' ) ),
				array( 'label' => esc_html__( 'Performance', 'nolan-young-theme-template-01' ), 'url' => home_url( '/services/service-4/#performance' ) ),
				array( 'label' => esc_html__( 'Technical support', 'nolan-young-theme-template-01' ), 'url' => home_url( '/services/service-4/#support' ) ),
			),
		),
	);

	/**
	 * Filter the Services mega-menu data.
	 *
	 * @param array<int, array<string, mixed>> $items Service menu items.
	 */
	return apply_filters( 'nytt01_services_mega_menu_items', $items );
}

/**
 * Return default About mega-menu content.
 *
 * @return array<int, array<string, mixed>>
 */
function nytt01_get_about_mega_menu_items() {
	$items = array(
		array(
			'title'       => esc_html__( 'About Us', 'nolan-young-theme-template-01' ),
			'description' => esc_html__( 'Learn how the team approaches strategy, design, engineering, and long-term product stewardship.', 'nolan-young-theme-template-01' ),
			'image'       => nytt01_get_navigation_image_uri( 'about-us.svg' ),
			'url'         => home_url( '/about/' ),
			'subitems'    => array(
				array( 'label' => esc_html__( 'Our story', 'nolan-young-theme-template-01' ), 'url' => home_url( '/about/#story' ) ),
				array( 'label' => esc_html__( 'Values', 'nolan-young-theme-template-01' ), 'url' => home_url( '/about/#values' ) ),
				array( 'label' => esc_html__( 'Approach', 'nolan-young-theme-template-01' ), 'url' => home_url( '/about/#approach' ) ),
			),
		),
		array(
			'title'       => esc_html__( 'Meet the Team', 'nolan-young-theme-template-01' ),
			'description' => esc_html__( 'Meet the people responsible for planning, designing, building, testing, and supporting each engagement.', 'nolan-young-theme-template-01' ),
			'image'       => nytt01_get_navigation_image_uri( 'meet-the-team.svg' ),
			'url'         => home_url( '/about/team/' ),
			'subitems'    => array(
				array( 'label' => esc_html__( 'Leadership', 'nolan-young-theme-template-01' ), 'url' => home_url( '/about/team/#leadership' ) ),
				array( 'label' => esc_html__( 'Design', 'nolan-young-theme-template-01' ), 'url' => home_url( '/about/team/#design' ) ),
				array( 'label' => esc_html__( 'Engineering', 'nolan-young-theme-template-01' ), 'url' => home_url( '/about/team/#engineering' ) ),
			),
		),
		array(
			'title'       => esc_html__( 'Careers', 'nolan-young-theme-template-01' ),
			'description' => esc_html__( 'Explore opportunities to contribute to thoughtful, standards-based work in a collaborative environment.', 'nolan-young-theme-template-01' ),
			'image'       => nytt01_get_navigation_image_uri( 'careers.svg' ),
			'url'         => home_url( '/about/careers/' ),
			'subitems'    => array(
				array( 'label' => esc_html__( 'Open roles', 'nolan-young-theme-template-01' ), 'url' => home_url( '/about/careers/#open-roles' ) ),
				array( 'label' => esc_html__( 'Culture', 'nolan-young-theme-template-01' ), 'url' => home_url( '/about/careers/#culture' ) ),
				array( 'label' => esc_html__( 'Benefits', 'nolan-young-theme-template-01' ), 'url' => home_url( '/about/careers/#benefits' ) ),
			),
		),
		array(
			'title'       => esc_html__( 'Future Work', 'nolan-young-theme-template-01' ),
			'description' => esc_html__( 'See the research, experiments, and emerging capabilities shaping the team’s future direction.', 'nolan-young-theme-template-01' ),
			'image'       => nytt01_get_navigation_image_uri( 'future-work.svg' ),
			'url'         => home_url( '/about/future-work/' ),
			'subitems'    => array(
				array( 'label' => esc_html__( 'Research', 'nolan-young-theme-template-01' ), 'url' => home_url( '/about/future-work/#research' ) ),
				array( 'label' => esc_html__( 'Experiments', 'nolan-young-theme-template-01' ), 'url' => home_url( '/about/future-work/#experiments' ) ),
				array( 'label' => esc_html__( 'Roadmap', 'nolan-young-theme-template-01' ), 'url' => home_url( '/about/future-work/#roadmap' ) ),
			),
		),
	);

	/**
	 * Filter the About mega-menu data.
	 *
	 * @param array<int, array<string, mixed>> $items About menu items.
	 */
	return apply_filters( 'nytt01_about_mega_menu_items', $items );
}

/**
 * Build mega-menu markup for a supported navigation item.
 *
 * @param string  $mega_key   Mega-menu key.
 * @param string  $panel_id   Unique panel ID.
 * @param string  $trigger_id Unique trigger ID.
 * @param WP_Post $menu_item  Navigation menu item.
 * @return string
 */
function nytt01_get_mega_menu_markup( $mega_key, $panel_id, $trigger_id, $menu_item ) {
	$template_name = 'blog' === $mega_key ? 'mega-menu-blog' : 'mega-menu-featured';
	$template_args = array(
		'mega_key'     => $mega_key,
		'panel_id'     => $panel_id,
		'trigger_id'   => $trigger_id,
		'overview_url' => ! empty( $menu_item->url ) ? $menu_item->url : home_url( '/' ),
	);

	if ( 'services' === $mega_key ) {
		$template_args['eyebrow']      = esc_html__( 'Services', 'nolan-young-theme-template-01' );
		$template_args['menu_heading'] = esc_html__( 'Explore services', 'nolan-young-theme-template-01' );
		$template_args['items']        = nytt01_get_services_mega_menu_items();
	} elseif ( 'about' === $mega_key ) {
		$template_args['eyebrow']      = esc_html__( 'About', 'nolan-young-theme-template-01' );
		$template_args['menu_heading'] = esc_html__( 'Learn more about us', 'nolan-young-theme-template-01' );
		$template_args['items']        = nytt01_get_about_mega_menu_items();
	}

	ob_start();
	get_template_part( 'template-parts/header/' . $template_name, null, $template_args );
	return (string) ob_get_clean();
}

/**
 * Custom primary navigation walker with accessible click-controlled mega menus.
 */
class NYTT01_Primary_Nav_Walker extends Walker_Nav_Menu {
	/**
	 * Start a navigation menu item.
	 *
	 * @param string   $output Used to append additional content.
	 * @param WP_Post  $menu_item Menu item data object.
	 * @param int      $depth Depth of menu item.
	 * @param stdClass $args Menu arguments.
	 * @param int      $id Current item ID.
	 * @return void
	 */
	public function start_el( &$output, $menu_item, $depth = 0, $args = null, $id = 0 ) {
		$mega_key = 0 === $depth ? nytt01_get_mega_menu_key( $menu_item ) : '';

		if ( '' === $mega_key ) {
			parent::start_el( $output, $menu_item, $depth, $args, $id );
			return;
		}

		$classes      = array_filter( (array) $menu_item->classes );
		$classes[]    = 'menu-item-' . (int) $menu_item->ID;
		$classes[]    = 'nytt01-menu-item--mega';
		$classes[]    = 'nytt01-menu-item--' . $mega_key;
		$class_names  = implode( ' ', array_map( 'sanitize_html_class', array_unique( $classes ) ) );
		$panel_id     = 'nytt01-mega-panel-' . $mega_key . '-' . (int) $menu_item->ID;
		$trigger_id   = 'nytt01-mega-trigger-' . $mega_key . '-' . (int) $menu_item->ID;
		$is_current   = ! empty( $menu_item->current ) || ! empty( $menu_item->current_item_ancestor ) || in_array( 'current-menu-item', $classes, true ) || in_array( 'current_page_item', $classes, true ) || in_array( 'current-menu-ancestor', $classes, true ) || in_array( 'current_page_ancestor', $classes, true );
		$filtered     = apply_filters( 'the_title', $menu_item->title, $menu_item->ID );
		$filtered     = apply_filters( 'nav_menu_item_title', $filtered, $menu_item, $args, $depth );
		$button_label = wp_strip_all_tags( (string) $filtered );

		$output .= '<li id="menu-item-' . esc_attr( (string) $menu_item->ID ) . '" class="' . esc_attr( $class_names ) . '" data-nytt01-mega-item="' . esc_attr( $mega_key ) . '">';
		$output .= '<button id="' . esc_attr( $trigger_id ) . '" class="nytt01-menu__trigger" type="button" aria-expanded="false" aria-controls="' . esc_attr( $panel_id ) . '" data-nytt01-mega-trigger>';
		$output .= '<span class="nytt01-menu__trigger-label">' . esc_html( $button_label ) . '</span>';
		$output .= '<span class="nytt01-menu__trigger-icon" aria-hidden="true"></span>';

		if ( $is_current ) {
			$output .= '<span class="screen-reader-text">' . esc_html__( '(current section)', 'nolan-young-theme-template-01' ) . '</span>';
		}

		$output .= '</button>';
		$output .= nytt01_get_mega_menu_markup( $mega_key, $panel_id, $trigger_id, $menu_item );
	}
}
