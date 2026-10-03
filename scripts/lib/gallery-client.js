(() => {
  const cards = [...document.querySelectorAll('.card')];
  const search = document.querySelector('#theme-search');
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => { card.hidden = !card.dataset.search.includes(query); if (!card.hidden) visible++; });
    document.querySelector('#results').textContent = `${visible} ${visible === 1 ? 'theme' : 'themes'} · Browse each website right here`;
    document.querySelector('#empty-state').hidden = visible !== 0;
  });
  cards.forEach((card) => {
    const frame = card.querySelector('iframe');
    const links = [...card.querySelectorAll('.page-nav a')];
    const sync = (url) => {
      const current = links.find((link) => new URL(link.href).pathname === url.pathname);
      links.forEach((link) => { if (link === current) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
      card.querySelector('[data-current-page]').textContent = current ? current.textContent : 'Website';
      // Keep the full-size link on the page being explored, including in-site navigation.
      if (current) card.querySelector('[data-open-preview]').href = current.href;
    };
    links.forEach((link) => link.addEventListener('click', () => sync(new URL(link.href))));
    frame.addEventListener('load', () => {
      try { sync(new URL(frame.contentWindow.location.href)); } catch (_) { /* External destinations cannot be inspected. */ }
    });
    card.querySelectorAll('[data-width]').forEach((button) => button.addEventListener('click', () => {
      card.dataset.viewport = button.dataset.width;
      card.querySelectorAll('[data-width]').forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    }));
  });
})();
