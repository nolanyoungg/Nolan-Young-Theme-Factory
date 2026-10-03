<?php
/** Demo-only form: no submission endpoint, persistence, or email delivery. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function clay_still_contact_form( $workshop = false ) {
	?>
	<form class="studio-form" data-demo-form aria-describedby="demo-notice" onsubmit="return false">
		<p class="demo-notice" id="demo-notice"><strong>A note before you write.</strong> This is a fictional studio and a demonstration form. Nothing is sent or stored. Please use sample details only.</p>
		<div class="form-pair">
			<label for="inquiry-name">Your name <span>(required)</span><input id="inquiry-name" name="name" autocomplete="off" required></label>
			<label for="inquiry-email">Email <span>(required)</span><input id="inquiry-email" name="email" type="email" autocomplete="off" required></label>
		</div>
		<label for="inquiry-interest">What brings you here?
			<select id="inquiry-interest" name="interest">
				<option<?php echo $workshop ? ' selected' : ''; ?>>Introductory handbuilding</option>
				<option<?php echo $workshop ? '' : ' selected'; ?>>A studio conversation</option>
				<option>A personal commission</option><option>A studio session</option>
			</select>
		</label>
		<label for="inquiry-message">A few words <span>(required)</span><textarea id="inquiry-message" name="message" rows="5" required placeholder="Tell us about the form, the occasion, or what you would like to learn."></textarea></label>
		<button class="button" type="button" data-demo-button>Review demo inquiry <span aria-hidden="true">↗</span></button>
		<p class="form-status" role="status" aria-live="polite"></p>
		<noscript><p>This sample form does not submit. Browse the workshop details or collection to keep exploring.</p></noscript>
	</form>
	<?php
}

