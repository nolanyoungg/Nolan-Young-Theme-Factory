<?php

// Helper function to sanitize subscriber data
function ns_sanitize_subscriber_data($data) {
    return array_map('sanitize_text_field', $data);
}

// Handle newsletter signup form submission
function ns_handle_newsletter_signup() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['newsletter_nonce']) && wp_verify_nonce($_POST['newsletter_nonce'], 'newsletter_form')) {
        $subscriber_data = ns_sanitize_subscriber_data($_POST);
        $required_fields = ['email'];

        if (ns_validate_form_data($subscriber_data, $required_fields)) {
            // Process the form data
            $email = sanitize_email($subscriber_data['email']);
            $name = !empty($subscriber_data['name']) ? sanitize_text_field($subscriber_data['name']) : '';

            // Save subscriber data to custom post type or database table
        } else {
            // Handle validation errors
        }
    }
}
add_action('init', 'ns_handle_newsletter_signup');
?>
