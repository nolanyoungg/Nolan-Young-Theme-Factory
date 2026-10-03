<?php
/** Demo controls intentionally have no submission endpoint or storage. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function hearth_honey_inquiry() { ?>
<div class="inquiry" id="inquiry" data-demo-inquiry>
    <p class="eyebrow">A little something for everyone</p><h2>Tell us about your table.</h2>
    <p id="demo-note">Static demo: these fields are for trying the layout. Nothing is sent, saved or reserved. Please use sample information.</p>
    <div class="field-grid">
        <label>Your name<input type="text" autocomplete="off" placeholder="Sam Baker"></label>
        <label>Email address<input type="email" autocomplete="off" placeholder="sam@example.com"></label>
        <label>What sounds good?<select><option>Weekend bread box</option><option>Catering for a gathering</option><option>A question about the bakery</option></select></label>
        <label>Approximate guests<input type="number" min="1" max="200" placeholder="12"></label>
    </div>
    <label>Your plans<textarea rows="4" placeholder="A date, a headcount, and anything we should know about dietary needs."></textarea></label>
    <button class="button" type="button" data-demo-button aria-describedby="demo-note">Try the inquiry demo <span aria-hidden="true">&#8594;</span></button>
    <p class="form-feedback" role="status" aria-live="polite"></p>
    <noscript><p>This is a sample inquiry layout. No submission is available.</p></noscript>
</div>
<?php }
