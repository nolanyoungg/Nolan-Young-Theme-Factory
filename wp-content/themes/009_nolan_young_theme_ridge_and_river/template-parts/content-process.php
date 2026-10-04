<section class="packing section container" aria-labelledby="packing-title">
    <div><p class="eyebrow">04 / BEFORE YOU LACE UP</p><h2 id="packing-title">Pack light.<br>Come prepared.</h2><p>A few dependable essentials make room for a better day. The final kit depends on the route and forecast.</p><?php rr_link( '/blog/#packing', 'Open the packing notes ↗', 'text-link' ); ?></div>
    <div class="checklist">
        <?php foreach ( array( 'Worn-in walking boots' => 'Grip you trust, with socks that fit.', 'Waterproofs & a warm layer' => 'For changeable weather and breezy stops.', 'Water, lunch & a little extra' => 'Enough for the whole day, plus a reserve.', 'A small pack & personal essentials' => 'Sun protection, personal medication and a charged phone.' ) as $title => $text ) : ?>
        <div><span aria-hidden="true">✓</span><p><strong><?php echo esc_html( $title ); ?></strong><small><?php echo esc_html( $text ); ?></small></p></div>
        <?php endforeach; ?>
    </div>
</section>
