<?php
// Helper functions

// Sanitize and validate email
function nolan_young_theme_sanitize_email($email) {
    $sanitized = sanitize_email($email);
    if (is_email($sanitized)) {
        return $sanitized;
    }
    return '';
}

// Sanitize text field
function nolan_young_theme_sanitize_text_field($text) {
    return sanitize_text_field($text);
}

// Check and display success or error messages
function nolan_young_theme_display_message($type, $message) {
    if ($type === 'success') {
        echo '<div class="success-message">' . esc_html($message) . '</div>';
    } elseif ($type === 'error') {
        echo '<div class="error-message">' . esc_html($message) . '</div>';
    }
}
?>
