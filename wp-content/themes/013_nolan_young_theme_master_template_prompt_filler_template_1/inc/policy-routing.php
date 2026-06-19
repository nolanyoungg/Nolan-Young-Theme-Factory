<?php
// Policy Page Routing

function nolan_yong_template_redirect() {
    if (is_front_page()) {
        $front_page_id = get_option('page_on_front');
        $policy_post = get_page_by_path('privacy-policy', 'OBJECT');

        if ($policy_post && $policy_post->ID !== $front_page_id) {
            wp_redirect(get_permalink($policy_post));
            exit;
        }
    }
}
add_action('template_redirect', 'nolan_yong_template_redirect');
?>