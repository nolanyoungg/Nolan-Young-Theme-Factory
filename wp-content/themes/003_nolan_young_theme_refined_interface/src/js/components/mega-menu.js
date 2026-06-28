const OPEN_CLASS = 'is-open';
const SELECTED_CLASS = 'is-selected';
const FEATURE_TRANSITION_CLASS = 'is-changing';
const CLOSE_DELAY_MS = 220;
const FEATURE_DELAY_MS = 110;

export function initializeMegaMenus() {
	const navigation = document.querySelector( '[data-nytt01-navigation]' );
	if ( ! navigation ) {
		return;
	}

	const megaItems = Array.from(
		navigation.querySelectorAll( '[data-nytt01-mega-item]' )
	);
	if ( ! megaItems.length ) {
		return;
	}

	const closeTimers = new WeakMap();
	const featureTimers = new WeakMap();
	const reduceMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	);
	let activeItem = null;

	const getParts = ( item ) => ( {
		trigger: item.querySelector( '[data-nytt01-mega-trigger]' ),
		panel: item.querySelector( '[data-nytt01-mega-panel]' ),
	} );

	const finalizeClose = ( item, panel ) => {
		if ( ! item.classList.contains( OPEN_CLASS ) ) {
			panel.hidden = true;
		}
		closeTimers.delete( item );
	};

	const closeItem = ( item, restoreFocus = false ) => {
		if ( ! item ) {
			return;
		}
		const { trigger, panel } = getParts( item );
		if ( ! trigger || ! panel ) {
			return;
		}

		const existingTimer = closeTimers.get( item );
		if ( existingTimer ) {
			window.clearTimeout( existingTimer );
		}

		item.classList.remove( OPEN_CLASS );
		panel.classList.remove( OPEN_CLASS );
		trigger.setAttribute( 'aria-expanded', 'false' );

		const delay = reduceMotion.matches ? 0 : CLOSE_DELAY_MS;
		closeTimers.set(
			item,
			window.setTimeout( () => finalizeClose( item, panel ), delay )
		);

		if ( restoreFocus ) {
			trigger.focus();
		}
		if ( activeItem === item ) {
			activeItem = null;
		}
	};

	const closeAll = ( exceptItem = null, restoreFocus = false ) => {
		megaItems.forEach( ( item ) => {
			if (
				item !== exceptItem &&
				item.classList.contains( OPEN_CLASS )
			) {
				closeItem( item, restoreFocus && item === activeItem );
			}
		} );
	};

	const openItem = ( item, focusPanel = false ) => {
		const { trigger, panel } = getParts( item );
		if ( ! trigger || ! panel ) {
			return;
		}

		closeAll( item );

		const existingTimer = closeTimers.get( item );
		if ( existingTimer ) {
			window.clearTimeout( existingTimer );
			closeTimers.delete( item );
		}

		panel.hidden = false;
		// Force the browser to commit the visible starting state before animation.
		panel.getBoundingClientRect();
		item.classList.add( OPEN_CLASS );
		panel.classList.add( OPEN_CLASS );
		trigger.setAttribute( 'aria-expanded', 'true' );
		activeItem = item;

		if ( focusPanel ) {
			const firstInteractive = panel.querySelector(
				'[data-nytt01-mega-option], a[href], button:not([disabled])'
			);
			if ( firstInteractive ) {
				firstInteractive.focus();
			}
		}
	};

	const applyFeatureContent = ( panel, option ) => {
		const feature = panel.querySelector( '[data-nytt01-mega-feature]' );
		const image = panel.querySelector( '[data-nytt01-mega-feature-image]' );
		const title = panel.querySelector( '[data-nytt01-mega-feature-title]' );
		const description = panel.querySelector(
			'[data-nytt01-mega-feature-description]'
		);
		const link = panel.querySelector( '[data-nytt01-mega-feature-link]' );
		const subitems = panel.querySelector(
			'[data-nytt01-mega-feature-subitems]'
		);
		if (
			! feature ||
			! image ||
			! title ||
			! description ||
			! link ||
			! subitems
		) {
			return;
		}

		image.src = option.dataset.featureImage || image.src;
		title.textContent = option.dataset.featureTitle || '';
		description.textContent = option.dataset.featureDescription || '';
		link.href = option.dataset.featureUrl || '#';
		link.textContent =
			option.dataset.featureLinkLabel ||
			option.dataset.featureTitle ||
			'';

		let relatedItems = [];
		try {
			relatedItems = JSON.parse( option.dataset.featureSubitems || '[]' );
		} catch {
			relatedItems = [];
		}

		subitems.replaceChildren();
		relatedItems.forEach( ( relatedItem ) => {
			if ( ! relatedItem || ! relatedItem.url || ! relatedItem.label ) {
				return;
			}

			const listItem = document.createElement( 'li' );
			const anchor = document.createElement( 'a' );
			anchor.className = 'nytt01-mega-feature__subitem-link';
			anchor.href = relatedItem.url;
			anchor.textContent = relatedItem.label;
			listItem.append( anchor );
			subitems.append( listItem );
		} );
		subitems.hidden = relatedItems.length === 0;
		subitems.setAttribute(
			'aria-label',
			option.dataset.featureSubitemsLabel ||
				`${ option.dataset.featureTitle || '' } related links`
		);

		panel
			.querySelectorAll( '[data-nytt01-mega-option]' )
			.forEach( ( candidate ) => {
				const isSelected = candidate === option;
				candidate.setAttribute( 'aria-pressed', String( isSelected ) );
				const wrapper = candidate.closest(
					'[data-nytt01-mega-option-wrapper]'
				);
				if ( wrapper ) {
					wrapper.classList.toggle( SELECTED_CLASS, isSelected );
				}
			} );

		feature.classList.remove( FEATURE_TRANSITION_CLASS );
		featureTimers.delete( feature );
	};

	const selectFeatureOption = ( panel, option, immediate = false ) => {
		const feature = panel.querySelector( '[data-nytt01-mega-feature]' );
		if ( ! feature ) {
			return;
		}

		const existingTimer = featureTimers.get( feature );
		if ( existingTimer ) {
			window.clearTimeout( existingTimer );
		}

		if ( immediate || reduceMotion.matches ) {
			applyFeatureContent( panel, option );
			return;
		}

		feature.classList.add( FEATURE_TRANSITION_CLASS );
		featureTimers.set(
			feature,
			window.setTimeout(
				() => applyFeatureContent( panel, option ),
				FEATURE_DELAY_MS
			)
		);
	};

	megaItems.forEach( ( item ) => {
		const { trigger, panel } = getParts( item );
		if ( ! trigger || ! panel ) {
			return;
		}

		trigger.addEventListener( 'click', () => {
			if ( item.classList.contains( OPEN_CLASS ) ) {
				closeItem( item );
			} else {
				openItem( item );
			}
		} );

		trigger.addEventListener( 'keydown', ( event ) => {
			if ( event.key === 'ArrowDown' ) {
				event.preventDefault();
				openItem( item, true );
			}

			if (
				event.key === 'Escape' &&
				item.classList.contains( OPEN_CLASS )
			) {
				event.preventDefault();
				closeItem( item, true );
			}
		} );

		const options = Array.from(
			panel.querySelectorAll( '[data-nytt01-mega-option]' )
		);
		options.forEach( ( option, optionIndex ) => {
			const imageSource = option.dataset.featureImage;
			if ( imageSource ) {
				const preloadedImage = new window.Image();
				preloadedImage.src = imageSource;
			}

			option.addEventListener( 'mouseenter', () =>
				selectFeatureOption( panel, option )
			);
			option.addEventListener( 'focus', () =>
				selectFeatureOption( panel, option )
			);
			option.addEventListener( 'click', () =>
				selectFeatureOption( panel, option )
			);

			option.addEventListener( 'keydown', ( event ) => {
				let nextIndex = null;

				if ( event.key === 'ArrowDown' || event.key === 'ArrowRight' ) {
					nextIndex = ( optionIndex + 1 ) % options.length;
				}
				if ( event.key === 'ArrowUp' || event.key === 'ArrowLeft' ) {
					nextIndex =
						( optionIndex - 1 + options.length ) % options.length;
				}
				if ( event.key === 'Home' ) {
					nextIndex = 0;
				}
				if ( event.key === 'End' ) {
					nextIndex = options.length - 1;
				}

				if ( nextIndex !== null ) {
					event.preventDefault();
					options[ nextIndex ].focus();
					selectFeatureOption( panel, options[ nextIndex ] );
				}

				if ( event.key === 'Escape' ) {
					event.preventDefault();
					closeItem( item, true );
				}
			} );
		} );
	} );

	navigation.addEventListener( 'click', ( event ) => {
		if ( event.target.closest( 'a[href]' ) ) {
			closeAll();
		}
	} );

	document.addEventListener( 'click', ( event ) => {
		if ( activeItem && ! activeItem.contains( event.target ) ) {
			closeItem( activeItem );
		}
	} );

	document.addEventListener( 'focusin', ( event ) => {
		if ( activeItem && ! activeItem.contains( event.target ) ) {
			closeItem( activeItem );
		}
	} );

	document.addEventListener( 'keydown', ( event ) => {
		if ( event.key === 'Escape' && activeItem ) {
			event.preventDefault();
			closeItem( activeItem, true );
		}
	} );

	document.addEventListener( 'nytt01:navigation-close', () => closeAll() );

	window.addEventListener( 'resize', () => {
		if ( activeItem ) {
			closeItem( activeItem );
		}
	} );
}
