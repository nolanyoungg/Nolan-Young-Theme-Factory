<section class="section container walks" aria-labelledby="walks-title">
    <div class="section-heading"><div><p class="eyebrow">01 / ON THE HORIZON</p><h2 id="walks-title">A day worth<br>taking slowly.</h2></div><p>Our upcoming-walks sample board.<br>Ideas to explore, not scheduled departures.</p></div>
    <div class="trail-list">
    <?php foreach ( rr_walks() as $walk ) : ?>
        <a class="trail-row" href="<?php echo esc_url( home_url( $walk[6] ) ); ?>">
            <span class="trail-number"><?php echo esc_html( $walk[0] ); ?></span>
            <div><h3><?php echo esc_html( $walk[1] ); ?></h3><p><?php echo esc_html( $walk[5] ); ?></p></div>
            <span class="trail-grade"><?php echo esc_html( $walk[2] ); ?></span>
            <span class="trail-stats"><?php echo esc_html( $walk[3] . ' / ' . $walk[4] ); ?></span><span class="trail-arrow" aria-hidden="true">↗</span>
        </a>
    <?php endforeach; ?>
    </div>
    <p class="small-note">All distances and timings are illustrative. No live availability or bookings.</p>
</section>
