<?php
/** The fictional outfitter has no submission or storage endpoint. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function ridge_river_inquiry() {
	?>
	<form class="trip-form" data-demo-form aria-describedby="demo-notice">
		<p id="demo-notice" class="form-notice"><strong>A little practice planning.</strong> This is a fictional sample website. Nothing is sent, stored or booked. Please use sample details.</p>
		<div class="form-pair"><label>Your name <input type="text" autocomplete="off" required placeholder="Alex Walker"></label><label>Email <input type="email" autocomplete="off" required placeholder="alex@example.com"></label></div>
		<div class="form-pair"><label>What sounds good? <select><option>A full-day ridge walk</option>A gentle day walk</option>Private guiding</option>Introductory navigation</option>Help me choose</option></select></label><label>Group size <select><option>1–2 walkers</option><option>3–4 walkers</option><option>5–6 walkers</option></select></label></div>
		<label>Your ideal day <textarea rows="4" placeholder="A preferred season, walking experience and anything that would help you feel comfortable."></textarea></label>
		<button type="button" class="button" data-demo-submit>Try the inquiry form <span aria-hidden="true">↗</span></button>
		<p class="form-result" role="status" aria-live="polite"></p>
		<noscript><p>This demonstration does not submit inquiries. Browse the walks to plan a sample day.</p></noscript>
	</form>
	<?php
}

