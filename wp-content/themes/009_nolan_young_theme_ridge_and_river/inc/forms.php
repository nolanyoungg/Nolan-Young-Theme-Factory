<?php
/** Local demonstration only: no storage, email, or submission endpoint. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function rr_inquiry_form() {
    ?>
    <form class="inquiry-form" data-demo-form aria-describedby="demo-notice" onsubmit="return false;">
        <p id="demo-notice" class="demo-notice">A little trail-day dreaming. This is a static demo: nothing is sent, saved or booked. Please use sample details.</p>
        <div class="form-pair">
            <label>Your name <input type="text" autocomplete="off" placeholder="Sam Walker" required></label>
            <label>Email <input type="email" autocomplete="off" placeholder="sam@example.com" required></label>
        </div>
        <label>Your kind of day <select><option>A gentle day walk</option><option>A full-day ridge walk</option><option>Private guiding</option><option>Introductory navigation</option></select></label>
        <label>A few details <textarea rows="4" placeholder="Your preferred season, group size, walking experience and access needs…" required></textarea></label>
        <button class="button" type="button" data-demo-submit>Try the inquiry form <span aria-hidden="true">↗</span></button>
        <p class="form-status" role="status" aria-live="polite"></p>
        <noscript><p>This sample form does not submit. JavaScript enables a local demonstration only.</p></noscript>
    </form>
    <?php
}
