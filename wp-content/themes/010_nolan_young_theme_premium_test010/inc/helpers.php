<?php

// Helper function to sanitize text
function ns_sanitize_text($text) {
    return sanitize_text_field($text);
}

// Helper function to escape HTML
function ns_escape_html($html) {
    return esc_html($html);
}

// Helper function to validate email
function ns_validate_email($email) {
    return is_email($email);
}
?>
