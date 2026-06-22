<?php
// inc/helpers.php

function northstar_is_valid_email($email) {
    return is_email($email);
}

function northstar_send_admin_notification($subject, $message) {
    wp_mail(get_option('admin_email'), $subject, $message);
}
