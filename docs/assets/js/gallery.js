(function () {
  const grid = document.querySelector('[data-theme-grid]');
  if (!grid) return;

  const cards = grid.querySelectorAll('.theme-card');
  const emptyState = grid.querySelector('[data-empty-state]');

  if (cards.length > 0 && emptyState) {
    emptyState.hidden = true;
  }

  cards.forEach((card) => {
    const frame = card.querySelector('iframe');
    if (!frame) return;
    frame.addEventListener('load', () => {
      card.dataset.previewLoaded = 'true';
    });
  });
})();
