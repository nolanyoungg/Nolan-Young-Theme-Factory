<?php
/** Template Name: About Us Template Post Type: page */
defined( 'ABSPATH' ) || exit; get_header(); ?>
<main id="primary" class="nytt01-site-main">
	<section class="nytt01-section">
		<div class="nytt01-container">
			<?php get_template_part( 'template-parts/global/content', 'hero' ); get_template_part( 'template-parts/global/content', 'brand-statement' ); ?>
			<div class="nytt01-feature-grid">
				<section class="nytt01-feature-card" id="approach"><h2><?php esc_html_e( 'Our approach', 'nolan-young-theme-template-01' ); ?></h2><p><?php esc_html_e( 'We keep discovery, design, and build decisions connected so the site stays coherent from first draft through launch.', 'nolan-young-theme-template-01' ); ?></p></section>
				<section class="nytt01-feature-card" id="values"><h2><?php esc_html_e( 'What we value', 'nolan-young-theme-template-01' ); ?></h2><p><?php esc_html_e( 'Clarity, maintainability, accessibility, and long-term support are built into every engagement.', 'nolan-young-theme-template-01' ); ?></p></section>
				<section class="nytt01-feature-card" id="work"><h2><?php esc_html_e( 'How we work', 'nolan-young-theme-template-01' ); ?></h2><p><?php esc_html_e( 'We use short checkpoints, plain-language updates, and defined deliverables to keep momentum visible.', 'nolan-young-theme-template-01' ); ?></p></section>
			</div>
			<?php get_template_part( 'template-parts/global/content', 'cta-banner' ); ?>
		</div>
	</section>
</main><?php get_footer();
