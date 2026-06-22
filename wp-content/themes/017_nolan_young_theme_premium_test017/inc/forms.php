<?php
// inc/forms.php

function northstar_register_contact_form() {
    register_post_type('contact_form_submission', array(
        'labels' => array(
            'name' => __('Contact Form Submissions'),
            'singular_name' => __('Contact Form Submission')
        ),
        'public' => false,
        'show_ui' => true,
        'supports' => array('title', 'editor', 'author', 'date'),
    ));
}
add_action('init', 'northstar_register_contact_form');

function northstar_register_service_form() {
    register_post_type('service_form_submission', array(
        'labels' => array(
            'name' => __('Service Form Submissions'),
            'singular_name' => __('Service Form Submission')
        ),
        'public' => false,
        'show_ui' => true,
        'supports' => array('title', 'editor', 'author', 'date'),
    ));
}
add_action('init', 'northstar_register_service_form');

function northstar_contact_form_handler() {
    if (isset($_POST['contact_form_nonce']) && wp_verify_nonce($_POST['contact_form_nonce'], 'submit_contact_form')) {
        $name = sanitize_text_field($_POST['name']);
        $email = sanitize_email($_POST['email']);
        $phone = isset($_POST['phone']) ? sanitize_text_field($_POST['phone']) : '';
        $message = sanitize_textarea_field($_POST['message']);

        if (!empty($name) && !is_email($email) || empty($message)) {
            wp_die('Please fill out all required fields.');
        }

        $post_data = array(
            'post_title' => sprintf('%s - %s', __('Contact Form Submission'), date('Y-m-d H:i:s')),
            'post_content' => '',
            'post_status' => 'publish',
            'post_type' => 'contact_form_submission',
        );

        $submission_id = wp_insert_post($post_data);

        if ($submission_id) {
            update_post_meta($submission_id, '_name', $name);
            update_post_meta($submission_id, '_email', $email);
            update_post_meta($submission_id, '_phone', $phone);
            update_post_meta($submission_id, '_message', $message);

            wp_mail(get_option('admin_email'), 'New Contact Form Submission', $message);
        }
    }
}
add_action('init', 'northstar_contact_form_handler');

function northstar_service_form_handler() {
    if (isset($_POST['service_form_nonce']) && wp_verify_nonce($_POST['service_form_nonce'], 'submit_service_form')) {
        $name = sanitize_text_field($_POST['name']);
        $email = sanitize_email($_POST['email']);
        $phone = isset($_POST['phone']) ? sanitize_text_field($_POST['phone']) : '';
        $message = sanitize_textarea_field($_POST['message']);
        $service = sanitize_text_field($_POST['service']);

        if (!empty($name) && !is_email($email) || empty($message)) {
            wp_die('Please fill out all required fields.');
        }

        $post_data = array(
            'post_title' => sprintf('%s - %s', __('Service Form Submission'), date('Y-m-d H:i:s')),
            'post_content' => '',
            'post_status' => 'publish',
            'post_type' => 'service_form_submission',
        );

        $submission_id = wp_insert_post($post_data);

        if ($submission_id) {
            update_post_meta($submission_id, '_name', $name);
            update_post_meta($submission_id, '_email', $email);
            update_post_meta($submission_id, '_phone', $phone);
            update_post_meta($submission_id, '_message', $message);
            update_post_meta($submission_id, '_service', $service);

            wp_mail(get_option('admin_email'), 'New Service Form Submission for ' . $service, $message);
        }
    }
}
add_action('init', 'northstar_service_form_handler');
