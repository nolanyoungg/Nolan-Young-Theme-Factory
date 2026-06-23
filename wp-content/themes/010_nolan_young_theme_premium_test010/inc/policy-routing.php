<?php

// Handle policy routing
function ns_handle_policy_routing() {
    if (is_page('privacy-policy')) {
        get_template_part('template-parts/content-privacy-policy');
    }
}
add_action('wp', 'ns_handle_policy_routing');
?>
