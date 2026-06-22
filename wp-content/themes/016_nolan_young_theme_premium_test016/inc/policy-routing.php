<?php
// Handle policy routing

function nolan_young_theme_policy_routing() {
    if (is_page('privacy-policy')) {
        // Load custom privacy policy content
        include get_template_directory() . '/template-parts/content-privacy-policy.php';
        exit;
    }
}
add_action('template_redirect', 'nolan_young_theme_policy_routing');
?>
