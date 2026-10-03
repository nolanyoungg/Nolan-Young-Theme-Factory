<?php
/** Browser-only inquiry demonstration. No storage, email or submission endpoint. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function form_field_contact_form() {
	?>
	<form class="inquiry-form" data-demo-form aria-describedby="demo-notice" onsubmit="return false;">
		<p id="demo-notice" class="demo-notice"><strong>A note before you begin.</strong> This is a fictional studio website. You can try the form, but nothing is sent or stored. Please use sample details.</p>
		<div class="form-grid">
			<label for="inquiry-name">Your name <span>(required)</span><input id="inquiry-name" type="text" autocomplete="name" required maxlength="100"></label>
			<label for="inquiry-email">Email address <span>(required)</span><input id="inquiry-email" type="email" autocomplete="email" required maxlength="180"></label>
			<label for="inquiry-interest">What are you considering?<select id="inquiry-interest"><option>Residential architecture</option><option>Adaptive reuse</option><option>Interior design</option><option>Still exploring</option></select></label>
			<label for="inquiry-location">Project location <span>(optional)</span><input id="inquiry-location" type="text" placeholder="Town or region" maxlength="150"></label>
		</div>
		<label for="inquiry-message">Tell us about the space <span>(required)</span><textarea id="inquiry-message" rows="5" required minlength="10" maxlength="3000" placeholder="What exists, what you imagine, and what matters most."></textarea></label>
		<label for="inquiry-timing">Ideal timing <span>(optional)</span><input id="inquiry-timing" type="text" placeholder="Exploring / this year / flexible" maxlength="100"></label>
		<button type="button" class="button" data-demo-submit disabled>Check sample inquiry <span aria-hidden="true">↗</span></button>
		<noscript><p>This demo needs JavaScript to check the fields. The form does not send messages.</p></noscript>
		<p class="form-status" role="status" aria-live="polite" data-form-status></p>
		<p class="fine-print">No submission service is connected. <a href="<?php echo form_field_url( 'privacy-policy' ); ?>">Read the privacy note.</a></p>
	</form>
	<?php
}
