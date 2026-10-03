<section class="section container capabilities" aria-labelledby="capabilities-title">
	<div class="section-heading"><div><p class="eyebrow">03 / What we do</p><h2 id="capabilities-title">From the whole<br>to the smallest detail.</h2></div><p>One considered approach.<br>Three ways to work together.</p></div>
	<div class="service-list"><?php foreach ( form_field_services() as $index => $service ) : ?><a class="service-row" href="<?php echo esc_url( $service['url'] ); ?>"><span class="row-number"><?php echo esc_html( '0' . ( $index + 1 ) ); ?></span><h3><?php echo esc_html( $service['title'] ); ?></h3><p><?php echo esc_html( $service['text'] ); ?></p><span class="row-arrow" aria-hidden="true">↗</span></a><?php endforeach; ?></div>
</section>
