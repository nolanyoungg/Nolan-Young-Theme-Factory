document.addEventListener('DOMContentLoaded', function() {
    // Add functionality for the navigation dropdowns
    const menuItems = document.querySelectorAll('[data-menu-item]');
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');

    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('aria-controls');
            const targetMenu = document.getElementById(targetId);

            if (targetMenu.style.display === 'block') {
                targetMenu.style.display = 'none';
                backdrop.remove();
            } else {
                menuItems.forEach(i => {
                    i.setAttribute('aria-expanded', 'false');
                    const menuToClose = document.getElementById(i.getAttribute('aria-controls'));
                    if (menuToClose) menuToClose.style.display = 'none';
                });

                this.setAttribute('aria-expanded', 'true');
                targetMenu.style.display = 'block';
                document.body.appendChild(backdrop);
            }
        });
    });

    backdrop.addEventListener('click', function() {
        menuItems.forEach(item => {
            item.setAttribute('aria-expanded', 'false');
            const targetId = item.getAttribute('aria-controls');
            const targetMenu = document.getElementById(targetId);
            if (targetMenu) targetMenu.style.display = 'none';
        });
        backdrop.remove();
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            menuItems.forEach(item => {
                item.setAttribute('aria-expanded', 'false');
                const targetId = item.getAttribute('aria-controls');
                const targetMenu = document.getElementById(targetId);
                if (targetMenu) targetMenu.style.display = 'none';
            });
            backdrop.remove();
        }
    });

    // Add functionality for the featured work filter
    const filterButtons = document.querySelectorAll('.filter-button');
    const workCards = document.querySelectorAll('.work-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            workCards.forEach(card => {
                if (category === 'all' || card.classList.contains(category)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
