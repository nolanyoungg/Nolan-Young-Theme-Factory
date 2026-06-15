<?php
// Handle form submissions
function nolan_young_handle_contact_form() {
  if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['contact_nonce']) && wp_verify_nonce($_POST['contact_nonce'], 'contact_form')) {
    $name = sanitize_text_field($_POST['contact_name']);
    $email = sanitize_email($_POST['contact_email']);
    $phone = sanitize_text_field($_POST['contact_phone']);
    $company = sanitize_text_field($_POST['contact_company']);
    $message = sanitize_textarea_field($_POST['contact_message']);

    // Save the form data to a custom post type or send an email
    // For now, we'll just log it for demonstration purposes
    error_log('Contact Form Submission: ' . json_encode(array('name' => $name, 'email' => $email, 'phone' => $phone, 'company' => $company, 'message' => $message)));
  }
}

function nolan_young_handle_quote_form() {
  if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['quote_nonce']) && wp_verify_nonce($_POST['quote_nonce'], 'quote_form')) {
    $name = sanitize_text_field($_POST['quote_name']);
    $email = sanitize_email($_POST['quote_email']);
    $phone = sanitize_text_field($_POST['quote_phone']);
    $project_type = sanitize_text_field($_POST['quote_project_type']);
    $business_type = sanitize_text_field($_POST['quote_business_type']);
    $website_url = esc_url_raw($_POST['quote_website_url']);
    $goals = sanitize_textarea_field($_POST['quote_goals']);
    $timeline = sanitize_text_field($_POST['quote_timeline']);
    $budget_range = sanitize_text_field($_POST['quote_budget_range']);

    // Save the form data to a custom post type or send an email
    // For now, we'll just log it for demonstration purposes
    error_log('Quote Form Submission: ' . json_encode(array('name' => $name, 'email' => $email, 'phone' => $phone, 'project_type' => $project_type, 'business_type' => $business_type, 'website_url' => $website_url, 'goals' => $goals, 'timeline' => $timeline, 'budget_range' => $budget_range)));
  }
}

// Add form handling to the appropriate hooks
add_action('template_redirect', 'nolan_young_handle_contact_form');
add_action('template_redirect', 'nolan_young_handle_quote_form');
