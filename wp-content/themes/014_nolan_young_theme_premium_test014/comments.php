<?php
/**
 * Comments template.
 */

if (!comments_open() || !get_comments_number()) {
    return;
}

comment_form(array(
    'title_reply' => __('Leave a Comment', 'nolan-young-theme'),
    'label_submit' => __('Submit Comment', 'nolan-young-theme'),
));

wp_list_comments(array(
    'style' => 'div',
    'short_ping' => true,
));
?>
