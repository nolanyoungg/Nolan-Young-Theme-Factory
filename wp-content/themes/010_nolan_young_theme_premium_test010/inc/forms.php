<?php

// Helper function to sanitize form data
function ns_sanitize_form_data($data) {
    return array_map('sanitize_text_field', $data);
}

// Helper function to validate form data
function ns_validate_form_data($data, $required_fields) {
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            return false;
        }
    }
    return true;
}

// Handle contact form submission
function ns_handle_contact_form() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['contact_nonce']) && wp_verify_nonce($_POST['contact_nonce'], 'contact_form')) {
        $form_data = ns_sanitize_form_data($_POST);
        $required_fields = ['name', 'email', 'message'];

        if (ns_validate_form_data($form_data, $required_fields)) {
            // Process the form data
            $to = get_option('admin_email');
            $subject = 'New Contact Form Submission';
            $body = 'Name: ' . esc_html($form_data['name']) . "\n";
            $body .= 'Email: ' . esc_html($form_data['email']) . "\n";
            if (!empty($form_data['phone'])) {
                $body .= 'Phone: ' . esc_html($form_data['phone']) . "\n";
            }
            $body .= 'Message: ' . esc_html($form_data['message']);

            wp_mail($to, $subject, $body);
        } else {
            // Handle validation errors
        }
    }
}
add_action('init', 'ns_handle_contact_form');

// Handle single service form submission
function ns_handle_single_service_form() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['single_service_nonce']) && wp_verify_nonce($_POST['single_service_nonce'], 'single_service_form')) {
        $form_data = ns_sanitize_form_data($_POST);
        $required_fields = ['name', 'email', 'message'];

        if (ns_validate_form_data($form_data, $required_fields)) {
            // Process the form data
            $to = get_option('admin_email');
            $subject = 'New Single Service Form Submission';
            $body = 'Name: ' . esc_html($form_data['name']) . "\n";
            $body .= 'Email: ' . esc_html($form_data['email']) . "\n";
            if (!empty($form_data['phone'])) {
                $body .= 'Phone: ' . esc_html($form_data['phone']) . "\n";
            }
            $body .= 'Service: ' . esc_html($_POST['service']) . "\n";
            $body .= 'Message: ' . esc_html($form_data['message']);

            wp_mail($to, $subject, $body);
        } else {
            // Handle validation errors
        }
    }
}
add_action('init', 'ns_handle_single_service_form');
?>
