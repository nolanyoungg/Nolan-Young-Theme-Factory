<?php
if (!comments_open() || !get_comments_number()) :
    return;
endif;

comments_template();
?>
