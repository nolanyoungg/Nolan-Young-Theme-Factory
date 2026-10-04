<?php
/** Static inquiry rehearsal. No messages are sent or stored. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function ff_contact_form() { ?>
<form class="inquiry-form" data-demo-form aria-describedby="demo-notice">
    <p class="demo-notice" id="demo-notice"><strong>A sample conversation.</strong> This is a fictional practice. Try the form with sample details; nothing is sent or saved.</p>
    <div class="form-pair">
        <label for="inquiry-name">Name <span>(required)</span><input id="inquiry-name" autocomplete="name" required maxlength="100"></label>
        <label for="inquiry-email">Email <span>(required)</span><input id="inquiry-email" type="email" autocomplete="email" required maxlength="200"></label>
    </div>
    <div class="form-pair">
        <label for="inquiry-interest">What are you considering?<select id="inquiry-interest"><option>Residential architecture</option><option>Adaptive reuse</option><option>Interior design</option><option>Still exploring</option></select></label>
        <label for="inquiry-location">Project location <span>(optional)</span><input id="inquiry-location" autocomplete="address-level2" maxlength="160"></label>
    </div>
    <label for="inquiry-message">Tell us a little about the place <span>(required)</span><textarea id="inquiry-message" rows="5" required maxlength="3000" placeholder="The existing space, your hopes for it, and your likely timing."></textarea></label>
    <button class="button" type="button" data-review-inquiry>Review sample inquiry <span aria-hidden="true">↗</span></button>
    <p class="form-feedback" role="status" aria-live="polite" data-form-feedback></p>
    <noscript><p>This form is a static demonstration. Reviewing sample entries needs JavaScript; submission is unavailable.</p></noscript>
    <p class="small">Read our <a href="<?php echo ff_url( '/privacy-policy/' ); ?>">sample-site privacy note</a>.</p>
</form>
<?php }
