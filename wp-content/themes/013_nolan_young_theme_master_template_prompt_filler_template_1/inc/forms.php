<?php
// Form Handling for Contact and Single Service

function nolan_yong_enqueue_form_scripts() {
    wp_enqueue_script('nolan-forms-js', get_theme_file_uri('/assets/js/forms.js'), array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'nolan_yong_enqueue_form_scripts');

// Process Contact Form Submission
function nolan_yong_process_contact_form_submission() {
    if (!isset($_POST['contact_form_nonce']) || !wp_verify_nonce($_POST['contact_form_nonce'], 'contact_form_nonce')) {
        wp_die(__('Security check failed.', 'nolan-yong'));
    }

    $name = sanitize_text_field($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $phone = isset($_POST['phone']) ? sanitize_text_field($_POST['phone']) : '';
    $message = wp_kses_post($_POST['message']);

    if (empty($name) || empty($email) || empty($message)) {
        wp_die(__('Please fill in all required fields.', 'nolan-yong'));
    }

    // Send email notification
    $to = get_option('admin_email');
    $subject = __('New Contact Form Submission', 'nolan-yong');
    $body = "Name: $name\nEmail: $email\nPhone: $phone\nMessage:\n$message";
    $headers = array('Content-Type: text/plain; charset=UTF-8');

    wp_mail($to, $subject, $body, $headers);

    // Redirect to success page or display a success message
    wp_redirect(home_url('/contact/?form=success'));
    exit;
}
add_action('init', 'nolan_yong_process_contact_form_submission');

// Process Single Service Form Submission
function nolan_yong_process_service_form_submission() {
    if (!isset($_POST['service_form_nonce']) || !wp_verify_nonce($_POST['service_form_nonce'], 'service_form_nonce')) {
        wp_die(__('Security check failed.', 'nolan-yong'));
    }

    $name = sanitize_text_field($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $phone = isset($_POST['phone']) ? sanitize_text_field($_POST['phone']) : '';
    $message = wp_kses_post($_POST['message']);
    $service = sanitize_text_field($_POST['service']);

    if (empty($name) || empty($email) || empty($message)) {
        wp_die(__('Please fill in all required fields.', 'nolan-yong'));
    }

    // Send email notification
    $to = get_option('admin_email');
    $subject = __('New Service Form Submission', 'nolan-yong');
    $body = "Name: $name\nEmail: $email\nPhone: $phone\nMessage:\n$message\nService: $service";
    $headers = array('Content-Type: text/plain; charset=UTF-8');

    wp_mail($to, $subject, $body, $headers);

    // Redirect to success page or display a success message
    wp_redirect(home_url('/contact/?form=success'));
    exit;
}
add_action('init', 'nolan_yong_process_service_form_submission');
?>