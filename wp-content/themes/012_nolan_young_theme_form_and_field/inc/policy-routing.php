<?php
/** Browseable sample routes; no database content is created on activation. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function ff_sample_route() {
    global $wp;
    if ( is_admin() || is_search() || is_feed() || is_trackback() ) { return ''; }
    $routes = array( 'about' => 'about-us', 'services' => 'services', 'work' => 'work', 'blog' => 'blog', 'contact' => 'contact', 'privacy-policy' => 'policy', 'services/featured' => 'single-service' );
    $request = isset( $wp->request ) ? trim( $wp->request, '/' ) : '';
    return isset( $routes[ $request ] ) ? 'page-templates/template-' . $routes[ $request ] . '.php' : '';
}
function ff_sample_template( $template ) {
    $route = ff_sample_route();
    return $route ? get_theme_file_path( $route ) : $template;
}
add_filter( 'template_include', 'ff_sample_template' );
function ff_sample_status( $preempt, $query ) {
    if ( ff_sample_route() ) {
        $query->is_404 = false;
        status_header( 200 );
        return true;
    }
    return $preempt;
}
add_filter( 'pre_handle_404', 'ff_sample_status', 10, 2 );
function ff_sample_canonical( $redirect ) { return ff_sample_route() ? false : $redirect; }
add_filter( 'redirect_canonical', 'ff_sample_canonical' );
function ff_document_title( $title ) {
    $route = ff_sample_route();
    if ( $route ) {
        $labels = array( 'about-us' => 'Studio', 'services' => 'Services', 'work' => 'Concept studies', 'blog' => 'Journal', 'contact' => 'Contact', 'policy' => 'Privacy', 'single-service' => 'Residential architecture' );
        $key = str_replace( array( 'page-templates/template-', '.php' ), '', $route );
        return $labels[ $key ] . ' — Form & Field';
    }
    return is_front_page() ? 'Form & Field — Architecture & Interiors' : $title;
}
add_filter( 'pre_get_document_title', 'ff_document_title' );
