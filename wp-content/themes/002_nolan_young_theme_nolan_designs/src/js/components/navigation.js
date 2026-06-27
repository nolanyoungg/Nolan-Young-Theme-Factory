export function initializeNavigation() {
	const toggle = document.querySelector( '[data-nytt01-menu-toggle]' );
	const navigation = document.querySelector( '[data-nytt01-navigation]' );
	if ( ! toggle || ! navigation ) {
		return;
	}

	const closeMenu = () => {
		toggle.setAttribute( 'aria-expanded', 'false' );
		navigation.classList.remove( 'is-open' );
		document.dispatchEvent( new CustomEvent( 'nytt01:navigation-close' ) );
	};

	toggle.addEventListener( 'click', () => {
		const isOpen = toggle.getAttribute( 'aria-expanded' ) === 'true';
		toggle.setAttribute( 'aria-expanded', String( ! isOpen ) );
		navigation.classList.toggle( 'is-open', ! isOpen );
		if ( isOpen ) {
			document.dispatchEvent(
				new CustomEvent( 'nytt01:navigation-close' )
			);
		}
	} );

	document.addEventListener( 'keydown', ( event ) => {
		const hasOpenMegaMenu = Boolean(
			navigation.querySelector( '[data-nytt01-mega-item].is-open' )
		);
		if (
			event.key === 'Escape' &&
			navigation.classList.contains( 'is-open' ) &&
			! hasOpenMegaMenu
		) {
			closeMenu();
			toggle.focus();
		}
	} );

	window.addEventListener( 'resize', () => {
		if ( window.matchMedia( '(min-width: 50.01rem)' ).matches ) {
			closeMenu();
		}
	} );
}
