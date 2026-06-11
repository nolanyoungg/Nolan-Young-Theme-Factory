<?php
function nytf_005_contact_note() {
  return esc_html__( 'Consultation requests are reviewed before scheduling.', '005_nolan_young_theme_flowledger_crm_platform' );
}

function nytf_005_register_form_entries() {
  register_post_type( 'nytf_005_form_entry', array(
    'labels' => array(
      'name' => esc_html__( 'Forms', '005_nolan_young_theme_flowledger_crm_platform' ),
      'singular_name' => esc_html__( 'Form Entry', '005_nolan_young_theme_flowledger_crm_platform' ),
    ),
    'public' => false,
    'show_ui' => false,
    'show_in_menu' => false,
    'supports' => array( 'title', 'editor', 'custom-fields' ),
  ) );
}
add_action( 'init', 'nytf_005_register_form_entries' );

function nytf_005_sanitize_form_field( $key, $type = 'text' ) {
  $value = isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : '';
  if ( 'email' === $type ) {
    return sanitize_email( $value );
  }
  if ( 'textarea' === $type ) {
    return sanitize_textarea_field( $value );
  }
  if ( 'key' === $type ) {
    return sanitize_key( $value );
  }
  return sanitize_text_field( $value );
}

function nytf_005_handle_form_submission() {
  if ( ! isset( $_POST['nytf_005_form_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nytf_005_form_nonce'] ) ), 'nytf_005_form_submit' ) ) {
    wp_die( esc_html__( 'The form could not be verified.', '005_nolan_young_theme_flowledger_crm_platform' ) );
  }

  $fields = array(
    'form_name' => nytf_005_sanitize_form_field( 'form_name', 'key' ),
    'entry_name' => nytf_005_sanitize_form_field( 'entry_name' ),
    'email' => nytf_005_sanitize_form_field( 'email', 'email' ),
    'phone' => nytf_005_sanitize_form_field( 'phone' ),
    'company' => nytf_005_sanitize_form_field( 'company' ),
    'service_interest' => nytf_005_sanitize_form_field( 'service_interest' ),
    'timeline' => nytf_005_sanitize_form_field( 'timeline' ),
    'budget' => nytf_005_sanitize_form_field( 'budget' ),
    'message' => nytf_005_sanitize_form_field( 'message', 'textarea' ),
  );

  $title_parts = array_filter( array( $fields['form_name'], $fields['entry_name'], $fields['email'] ) );
  $entry_id = wp_insert_post( array(
    'post_type' => 'nytf_005_form_entry',
    'post_status' => 'private',
    'post_title' => $title_parts ? implode( ' - ', $title_parts ) : current_time( 'mysql' ),
    'post_content' => $fields['message'],
  ) );

  if ( $entry_id && ! is_wp_error( $entry_id ) ) {
    foreach ( $fields as $key => $value ) {
      update_post_meta( $entry_id, $key, $value );
    }
  }

  $redirect = wp_get_referer() ? wp_get_referer() : home_url( '/contact/' );
  wp_safe_redirect( add_query_arg( 'form_status', 'sent', $redirect ) );
  exit;
}
add_action( 'admin_post_nytf_005_submit_form', 'nytf_005_handle_form_submission' );
add_action( 'admin_post_nopriv_nytf_005_submit_form', 'nytf_005_handle_form_submission' );

function nytf_005_forms_admin_menu() {
  add_menu_page(
    esc_html__( 'Forms', '005_nolan_young_theme_flowledger_crm_platform' ),
    esc_html__( 'Forms', '005_nolan_young_theme_flowledger_crm_platform' ),
    'manage_options',
    'nytf_005_forms',
    'nytf_005_render_forms_admin',
    'dashicons-feedback',
    26
  );
}
add_action( 'admin_menu', 'nytf_005_forms_admin_menu' );

function nytf_005_form_entries_query( $ids = array() ) {
  $args = array(
    'post_type' => 'nytf_005_form_entry',
    'post_status' => 'private',
    'numberposts' => 200,
    'orderby' => 'date',
    'order' => 'DESC',
  );
  if ( $ids ) {
    $args['post__in'] = array_map( 'absint', $ids );
    $args['orderby'] = 'post__in';
  }
  return get_posts( $args );
}

function nytf_005_render_forms_admin() {
  if ( ! current_user_can( 'manage_options' ) ) {
    return;
  }

  $entries = nytf_005_form_entries_query();
  echo '<div class="wrap"><h1>' . esc_html__( 'Forms', '005_nolan_young_theme_flowledger_crm_platform' ) . '</h1>';
  echo '<p>' . esc_html__( 'Review captured website form submissions and export all entries or selected entries as CSV.', '005_nolan_young_theme_flowledger_crm_platform' ) . '</p>';
  echo '<p><a class="button button-primary" href="' . esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=nytf_005_export_forms' ), 'nytf_005_export_forms' ) ) . '">' . esc_html__( 'Export all entries', '005_nolan_young_theme_flowledger_crm_platform' ) . '</a></p>';
  echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
  echo '<input type="hidden" name="action" value="nytf_005_export_forms">';
  wp_nonce_field( 'nytf_005_export_forms', 'nytf_005_export_nonce' );
  echo '<table class="widefat striped"><thead><tr><td class="manage-column column-cb check-column"></td><th>' . esc_html__( 'Date', '005_nolan_young_theme_flowledger_crm_platform' ) . '</th><th>' . esc_html__( 'Form', '005_nolan_young_theme_flowledger_crm_platform' ) . '</th><th>' . esc_html__( 'Name', '005_nolan_young_theme_flowledger_crm_platform' ) . '</th><th>' . esc_html__( 'Email', '005_nolan_young_theme_flowledger_crm_platform' ) . '</th><th>' . esc_html__( 'Interest', '005_nolan_young_theme_flowledger_crm_platform' ) . '</th></tr></thead><tbody>';

  if ( $entries ) {
    foreach ( $entries as $entry ) {
      echo '<tr>';
      echo '<th scope="row" class="check-column"><input type="checkbox" name="entry_ids[]" value="' . esc_attr( $entry->ID ) . '"></th>';
      echo '<td>' . esc_html( get_the_date( '', $entry ) ) . '</td>';
      echo '<td>' . esc_html( get_post_meta( $entry->ID, 'form_name', true ) ) . '</td>';
      echo '<td>' . esc_html( get_post_meta( $entry->ID, 'entry_name', true ) ) . '</td>';
      echo '<td>' . esc_html( get_post_meta( $entry->ID, 'email', true ) ) . '</td>';
      echo '<td>' . esc_html( get_post_meta( $entry->ID, 'service_interest', true ) ) . '</td>';
      echo '</tr>';
    }
  } else {
    echo '<tr><td colspan="6">' . esc_html__( 'No form submissions have been captured yet.', '005_nolan_young_theme_flowledger_crm_platform' ) . '</td></tr>';
  }

  echo '</tbody></table>';
  submit_button( esc_html__( 'Export selected entries', '005_nolan_young_theme_flowledger_crm_platform' ) );
  echo '</form></div>';
}

function nytf_005_export_forms() {
  if ( ! current_user_can( 'manage_options' ) ) {
    wp_die( esc_html__( 'You do not have permission to export form entries.', '005_nolan_young_theme_flowledger_crm_platform' ) );
  }

  $nonce = isset( $_REQUEST['nytf_005_export_nonce'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['nytf_005_export_nonce'] ) ) : '';
  if ( ! $nonce && isset( $_REQUEST['_wpnonce'] ) ) {
    $nonce = sanitize_text_field( wp_unslash( $_REQUEST['_wpnonce'] ) );
  }
  if ( ! wp_verify_nonce( $nonce, 'nytf_005_export_forms' ) ) {
    wp_die( esc_html__( 'The export request could not be verified.', '005_nolan_young_theme_flowledger_crm_platform' ) );
  }

  $ids = isset( $_REQUEST['entry_ids'] ) ? array_map( 'absint', (array) wp_unslash( $_REQUEST['entry_ids'] ) ) : array();
  $entries = nytf_005_form_entries_query( array_filter( $ids ) );

  nocache_headers();
  header( 'Content-Type: text/csv; charset=utf-8' );
  header( 'Content-Disposition: attachment; filename=005_nolan_young_theme_flowledger_crm_platform-form-entries.csv' );
  $output = fopen( 'php://output', 'w' );
  fputcsv( $output, array( 'Date', 'Form', 'Name', 'Email', 'Phone', 'Company', 'Interest', 'Timeline', 'Budget', 'Message' ) );
  foreach ( $entries as $entry ) {
    fputcsv( $output, array(
      get_the_date( 'c', $entry ),
      get_post_meta( $entry->ID, 'form_name', true ),
      get_post_meta( $entry->ID, 'entry_name', true ),
      get_post_meta( $entry->ID, 'email', true ),
      get_post_meta( $entry->ID, 'phone', true ),
      get_post_meta( $entry->ID, 'company', true ),
      get_post_meta( $entry->ID, 'service_interest', true ),
      get_post_meta( $entry->ID, 'timeline', true ),
      get_post_meta( $entry->ID, 'budget', true ),
      get_post_meta( $entry->ID, 'message', true ),
    ) );
  }
  fclose( $output );
  exit;
}
add_action( 'admin_post_nytf_005_export_forms', 'nytf_005_export_forms' );

