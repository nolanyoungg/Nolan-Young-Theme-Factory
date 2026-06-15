<?php
// File: inc/policy-routing.php
// This file sets up custom routing for policy pages.

function nolan_young_theme_add_policy_page() {
    add_rewrite_rule('^privacy-policy/?$', 'index.php?pagename=privacy-policy', 'top');
    add_rewrite_rule('^terms-of-service/?$', 'index.php?pagename=terms-of-service', 'top');
}
add_action('init', 'nolan_young_theme_add_policy_page');
