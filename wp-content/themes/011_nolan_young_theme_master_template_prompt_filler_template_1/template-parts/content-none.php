<section class="section empty-state" aria-labelledby="empty-state-title">
	<div class="container empty-state__inner">
		<p class="eyebrow"><?php esc_html_e( 'No results', 'nolan-young-template' ); ?></p>
		<h1 id="empty-state-title"><?php esc_html_e( 'Nothing matched that request.', 'nolan-young-template' ); ?></h1>
		<p><?php esc_html_e( 'Try a different search term or use the primary navigation to reach services, work, resources, or contact options.', 'nolan-young-template' ); ?></p>
		<?php get_search_form(); ?>
	</div>
</section>
