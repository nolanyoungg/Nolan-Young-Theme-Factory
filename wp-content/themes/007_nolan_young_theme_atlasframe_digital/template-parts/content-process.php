<?php $steps = nolan_young_template_process_steps(); ?>
<section class="section process section-dark" id="process">
	<div class="container split process__intro">
		<div>
			<p class="eyebrow"><?php esc_html_e( 'Process', '007-nolan-young-theme-atlasframe-digital' ); ?></p>
			<h2><?php esc_html_e( 'A measured path from diagnosis to support.', '007-nolan-young-theme-atlasframe-digital' ); ?></h2>
			<p><?php esc_html_e( 'Every phase makes the next decision clearer: what the site needs to say, how it should be structured, what should be built, and how it stays useful after launch.', '007-nolan-young-theme-atlasframe-digital' ); ?></p>
		</div>
		<?php nolan_young_template_render_image( 'assets/images/portfolio/team-collaboration.jpg', __( 'Atlasframe Digital team collaboration around a digital project', '007-nolan-young-theme-atlasframe-digital' ), 'media-frame' ); ?>
	</div>
	<div class="container">
		<ol class="process-list">
			<?php foreach ( $steps as $step ) : ?>
				<li><span><?php echo esc_html( $step['title'] ); ?></span><p><?php echo esc_html( $step['text'] ); ?></p></li>
			<?php endforeach; ?>
		</ol>
	</div>
</section>
