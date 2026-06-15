<?php
// inc/policy-routing.php - Handle policy routing for the theme

function nolan_young_theme_add_policy_routes() {
    // Register a custom route for privacy policy
    add_rewrite_rule('^privacy-policy/?$', 'index.php?policy_page=privacy', 'top');

    // Register a custom route for terms of service
    add_rewrite_rule('^terms-of-service/?$', 'index.php?policy_page=terms', 'top');
}

add_action('init', 'nolan_young_theme_add_policy_routes');

function nolan_young_theme_query_vars($query_vars) {
    $query_vars[] = 'policy_page';
    return $query_vars;
}

add_filter('query_vars', 'nolan_young_theme_query_vars');

function nolan_young_theme_template_redirect() {
    if (get_query_var('policy_page') === 'privacy') {
        include(get_template_directory() . '/templates/privacy-policy.php');
        exit;
    }

    if (get_query_var('policy_page') === 'terms') {
        include(get_template_directory() . '/templates/terms-of-service.php');
        exit;
    }
}

add_action('template_redirect', 'nolan_young_theme_template_redirect');
