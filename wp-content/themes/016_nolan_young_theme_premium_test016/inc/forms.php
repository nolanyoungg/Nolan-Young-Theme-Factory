<?php
// Enqueue scripts and styles for forms
function nolan_young_theme_enqueue_forms_scripts() {
    wp_enqueue_script('nolan-young-theme-forms-js', get_theme_file_uri('assets/js/bundle.js'), array(), filemtime(get_theme_file_path('assets/js/bundle.js')), true);
    wp_enqueue_style('nolan-young-theme-forms-css', get_theme_file_uri('assets/css/bundle.css'), array(), filemtime(get_theme_file_path('assets/css/bundle.css')));
}
add_action('wp_enqueue_scripts', 'nolan_young_theme_enqueue_forms_scripts');

// Handle form submissions
function nolan_young_theme_process_contact_form() {
    if (isset($_POST['contact-form-nonce']) && wp_verify_nonce($_POST['contact-form-nonce'], 'contact_form_nonce') && isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message'])) {
        $name = sanitize_text_field($_POST['name']);
        $email = sanitize_email($_POST['email']);
        $phone = isset($_POST['phone']) ? sanitize_text_field($_POST['phone']) : '';
        $message = wp_kses_post($_POST['message']);

        if (empty($name) || empty($email) || empty($message)) {
            wp_die('Please fill out all required fields.');
        }

        // Send email to admin
        $to = get_option('admin_email');
        $subject = 'New Contact Form Submission';
        $body = "Name: $name\nEmail: $email\nPhone: $phone\nMessage: $message";
        wp_mail($to, $subject, $body);

        // Display success message
        echo '<div class="success-message">Thank you for your submission!</div>';
    }
}
add_action('init', 'nolan_young_theme_process_contact_form');

// Handle single service form submissions
function nolan_young_theme_process_single_service_form() {
    if (isset($_POST['single-service-form-nonce']) && wp_verify_nonce($_POST['single-service-form-nonce'], 'single_service_form_nonce') && isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message'])) {
        $name = sanitize_text_field($_POST['name']);
        $email = sanitize_email($_POST['email']);
        $phone = isset($_POST['phone']) ? sanitize_text_field($_POST['phone']) : '';
        $message = wp_kses_post($_POST['message']);
        $service_id = isset($_POST['service_id']) ? absint($_POST['service_id']) : 0;

        if (empty($name) || empty($email) || empty($message)) {
            wp_die('Please fill out all required fields.');
        }

        // Send email to admin
        $to = get_option('admin_email');
        $subject = 'New Single Service Form Submission';
        $body = "Name: $name\nEmail: $email\nPhone: $phone\nMessage: $message\nService ID: $service_id";
        wp_mail($to, $subject, $body);

        // Display success message
        echo '<div class="success-message">Thank you for your submission!</div>';
    }
}
add_action('init', 'nolan_young_theme_process_single_service_form');
?>
