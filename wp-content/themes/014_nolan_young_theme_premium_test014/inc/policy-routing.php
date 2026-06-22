<?php
/**
 * Handle policy-related routing and template loading.
 */

function nolan_young_policy_template_redirect() {
    if (is_page('privacy-policy')) {
        include get_template_directory() . '/template-parts/content-privacy-policy.php';
        exit;
    }
}
add_action('template_redirect', 'nolan_young_policy_template_redirect');
?>
