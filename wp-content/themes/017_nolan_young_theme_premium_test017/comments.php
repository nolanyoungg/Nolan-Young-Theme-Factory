<?php
// comments.php

if (!comments_open() || get_comments_number() == 0) {
    return;
}

comments_template();
?>
