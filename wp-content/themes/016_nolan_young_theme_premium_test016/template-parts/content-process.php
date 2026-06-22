<section class="process">
    <h2 class="section-title">Our Process</h2>
    <ol class="process-steps">
        <?php $steps = ['Discovery', 'Design', 'Development', 'Launch']; ?>
        <?php foreach ($steps as $step): ?>
            <li class="process-step">
                <h3 class="step-title"><?php echo esc_html($step); ?></h3>
                <p class="step-description">A brief description of what happens in this step of our process.</p>
            </li>
        <?php endforeach; ?>
    </ol>
</section>
