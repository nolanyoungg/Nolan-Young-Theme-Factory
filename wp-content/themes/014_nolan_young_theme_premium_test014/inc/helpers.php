<?php
/**
 * Various helper functions for the theme.
 */

// Sanitize and validate email address
function nolan_young_sanitize_email($email) {
    $sanitized_email = sanitize_email($email);
    if (is_email($sanitized_email)) {
        return $sanitized_email;
    }
    return '';
}

// Generate a unique token for unsubscribe actions
function nolan_young_generate_unsubscribe_token($subscriber_id) {
    return hash_hmac('sha256', $subscriber_id, wp_salt());
}
?>
