<div class="footer-grid">
	<div class="footer-identity"><a class="wordmark" href="<?php echo form_field_url(); ?>">form<span>&amp;</span>field<span class="wordmark__dot">.</span></a><p>Architecture &amp; interiors.<br>Considered in every dimension.</p><img class="interface-mark" src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/mark-2.svg' ) ); ?>" alt="" width="24" height="24"></div>
	<div><p class="eyebrow">Explore</p><nav class="footer-nav" aria-label="Footer navigation"><?php foreach ( form_field_navigation() as $path => $label ) : ?><a href="<?php echo form_field_url( $path ); ?>"><?php echo esc_html( $label ); ?></a><?php endforeach; ?></nav></div>
	<div class="footer-contact"><p class="eyebrow">A place to begin</p><p>A site, a space, a possibility.<br>Tell us what you have in mind.</p><a class="text-link" href="<?php echo form_field_url( 'contact' ); ?>">Start a conversation ↗</a><p class="fine-print">Sample studio · Inquiries are a local demo.</p></div>
</div>
