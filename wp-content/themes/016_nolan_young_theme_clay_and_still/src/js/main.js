import '../scss/main.scss';

// Disclosure navigation remains ordinary same-frame links.
const toggle = document.querySelector('[data-menu-toggle]');
const drawer = document.getElementById('mobile-drawer');
const desktopMenu = document.querySelector('.studio-menu');
const closeDrawer = (restoreFocus = false) => {
	if (!toggle || !drawer) return;
	drawer.hidden = true;
	toggle.setAttribute('aria-expanded', 'false');
	toggle.setAttribute('aria-label', 'Open navigation');
	if (restoreFocus) toggle.focus();
};
if (toggle && drawer) {
	toggle.addEventListener('click', () => {
		const opening = drawer.hidden;
		drawer.hidden = !opening;
		toggle.setAttribute('aria-expanded', String(opening));
		toggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
		if (opening) drawer.querySelector('a')?.focus();
	});
	drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeDrawer()));
	document.addEventListener('click', event => {
		if (!drawer.hidden && !drawer.contains(event.target) && !toggle.contains(event.target)) closeDrawer();
	});
	document.addEventListener('focusin', event => {
		if (!drawer.hidden && !drawer.contains(event.target) && !toggle.contains(event.target)) closeDrawer();
	});
	window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
		if (event.matches) closeDrawer();
	});
}
document.addEventListener('keydown', event => {
	if (event.key !== 'Escape') return;
	if (drawer && !drawer.hidden) closeDrawer(true);
	if (desktopMenu?.open) {
		desktopMenu.open = false;
		desktopMenu.querySelector('summary').focus();
	}
});
if (desktopMenu) {
	document.addEventListener('click', event => {
		if (!desktopMenu.contains(event.target)) desktopMenu.open = false;
	});
	document.addEventListener('focusin', event => {
		if (!desktopMenu.contains(event.target)) desktopMenu.open = false;
	});
}
document.querySelectorAll('[data-demo-form]').forEach(form => {
	const review = () => {
		if (!form.reportValidity()) return;
		form.querySelector('[role="status"]').textContent = 'Your sample inquiry is ready to review. This is a demo: nothing has been sent, stored, or booked.';
	};
	form.addEventListener('submit', event => { event.preventDefault(); review(); });
	form.querySelector('[data-demo-button]')?.addEventListener('click', review);
});
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motionPreference.matches) {
	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add('is-seen');
			observer.unobserve(entry.target);
		});
	}, { threshold: 0.12 });
	document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
