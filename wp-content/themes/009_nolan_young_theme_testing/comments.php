<?php
// File: comments.php
// This file contains the HTML structure for displaying comments and comment forms.

if (!comments_open() && get_comments_number()) :
    echo '<p>' . __('Comments are closed.', 'nolan-young-theme') . '</p>';
else :
    if (post_password_required()) :
        echo '<p>' . __('This post is password protected. Enter the password to view any comments.', 'nolan-young-theme') . '</p>';
    else :
        comments_template();
    endif;
endif;
