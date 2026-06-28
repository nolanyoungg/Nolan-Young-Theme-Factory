export function initializeAccordions() {
	document
		.querySelectorAll( '[data-nytt01-accordion-button]' )
		.forEach( ( button ) => {
			const panelId = button.getAttribute( 'aria-controls' );
			const panel = panelId ? document.getElementById( panelId ) : null;
			if ( ! panel ) {
				return;
			}

			button.addEventListener( 'click', () => {
				const expanded =
					button.getAttribute( 'aria-expanded' ) === 'true';
				button.setAttribute( 'aria-expanded', String( ! expanded ) );
				panel.hidden = expanded;
			} );
		} );
}
