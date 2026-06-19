<?php
// Handle newsletter subscription and management

function nolan_young_subscribe_newsletter() {
    if ( ! wp_verify_nonce( $_POST['newsletter_nonce'], 'newsletter_form_nonce' ) ) {
        return;
    }

    $email = sanitize_email( $_POST['email'] );
    $name = isset( $_POST['name'] ) ? sanitize_text_field( $_POST['name'] ) : '';

    if ( empty( $email ) ) {
        return;
    }

    // Store the subscription in a custom table or post type here
}

add_action( 'wp_ajax_nolan_young_newsletter_form', 'nolan_young_subscribe_newsletter' );
add_action( 'wp_ajax_nopriv_nolan_young_newsletter_form', 'nolan_young_subscribe_newsletter' );
