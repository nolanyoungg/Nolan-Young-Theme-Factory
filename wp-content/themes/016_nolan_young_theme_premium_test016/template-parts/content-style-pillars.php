<section class="style-pillars">
    <h2 class="section-title">Our Pillars</h2>
    <div class="pillar-grid">
        <?php $pillars = ['Innovation', 'Quality', 'Excellence']; ?>
        <?php foreach ($pillars as $pillar): ?>
            <div class="pillar-card">
                <h3 class="pillar-title"><?php echo esc_html($pillar); ?></h3>
                <p class="pillar-description">A description of how this pillar contributes to our approach and services.</p>
            </div>
        <?php endforeach; ?>
    </div>
</section>
