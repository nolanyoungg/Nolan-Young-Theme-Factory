<?php
// Handle form submissions and validations

function nolan_young_process_contact_form() {
    if ( ! wp_verify_nonce( $_POST['contact_nonce'], 'contact_form_nonce' ) ) {
        return;
    }

    $name = sanitize_text_field( $_POST['name'] );
    $email = sanitize_email( $_POST['email'] );
    $phone = isset( $_POST['phone'] ) ? sanitize_text_field( $_POST['phone'] ) : '';
    $message = wp_kses_post( $_POST['message'] );

    if ( empty( $name ) || empty( $email ) || empty( $message ) ) {
        return;
    }

    $to = get_option( 'admin_email' );
    $subject = __( 'New Contact Form Submission', '013_nolan_young_theme_master_template_prompt_filler_template_1' );
    $body = sprintf(
        __( 'Name: %s\nEmail: %s\nPhone: %s\nMessage: %s', '013_nolan_young_theme_master_template_prompt_filler_template_1' ),
        $name,
        $email,
        $phone,
        $message
    );

    wp_mail( $to, $subject, $body );
}

add_action( 'wp_ajax_nolan_young_contact_form', 'nolan_young_process_contact_form' );
add_action( 'wp_ajax_nopriv_nolan_young_contact_form', 'nolan_young_process_contact_form' );
