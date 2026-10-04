<?php
/** Demo controls never transmit, email, or persist an inquiry. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function clay_inquiry_form( $workshop = false ) {
	?>
	<form class="inquiry-form" data-demo-form aria-label="Studio inquiry demonstration">
		<p class="demo-note" id="demo-notice">A little note: this is a fictional studio and a static demonstration. Nothing is sent or saved, and no booking is made. Please use sample details.</p>
		<div class="form-pair">
			<label>Your name <span>(required)</span><input type="text" autocomplete="off" required></label>
			<label>Email <span>(required)</span><input type="email" autocomplete="off" required></label>
		</div>
		<label>What brings you here?<select><option<?php echo $workshop ? ' selected' : ''; ?>>Handbuilding workshop</option><option>Commission a vessel</option><option>Studio session</option><option>Visit the studio</option></select></label>
		<label>Your note <span>(required)</span><textarea rows="5" required placeholder="Tell us about the form, occasion or workshop you have in mind."></textarea></label>
		<button type="button" class="button" data-demo-check aria-describedby="demo-notice">Review demo inquiry <span aria-hidden="true">↗</span></button>
		<p class="form-status" role="status" aria-live="polite"></p>
		<noscript><p>This sample form is inactive. No details will be submitted.</p></noscript>
		<p class="small">Read our <a href="<?php echo clay_url( '/privacy-policy/' ); ?>">privacy note</a>.</p>
	</form>
	<?php
}
