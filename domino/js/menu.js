(() => {
    const primary = document.querySelectorAll('.menu-primary button');
    const tabs = [...document.querySelectorAll('.menu-secondary [role="tab"]')];
    const indicator = document.querySelector('.menu-tab-indicator');
    const track = document.querySelector('.menu-secondary');
    const panel = document.getElementById('pizza-products');
    if (!tabs.length || !indicator || !track) return;
    function position(tab) {
        indicator.style.width = tab.offsetWidth + 'px';
        indicator.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
    }
    function activate(tab) {
        tabs.forEach(t => {
            const selected = t === tab;
            t.classList.toggle('is-active', selected);
            t.setAttribute('aria-selected', String(selected));
            t.tabIndex = selected ? 0 : -1;
        });
        panel.setAttribute('aria-labelledby', tab.id);
        position(tab);
        tab.scrollIntoView({block:'nearest',inline:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
        const selectedCategory = tab.dataset.category;
        panel.querySelectorAll('.best-menu-card').forEach(card => {
            card.hidden = selectedCategory !== '전체' && !(selectedCategory === 'NEW' ? card.dataset.new === 'true' : card.dataset.category === selectedCategory);
        });
        panel.hidden = !primary[0].classList.contains('is-active');
    }
    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => activate(tab));
        tab.addEventListener('keydown', e => {
            let next = i;
            if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
            else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
            else if (e.key === 'Home') next = 0;
            else if (e.key === 'End') next = tabs.length - 1;
            else return;
            e.preventDefault();tabs[next].focus();activate(tabs[next]);
        });
    });
    primary.forEach(btn => btn.addEventListener('click', () => {
        primary.forEach(p => {p.classList.toggle('is-active',p===btn);if(p===btn)p.setAttribute('aria-current','true');else p.removeAttribute('aria-current');});
        // Other primary categories will receive their products in later stages.
        panel.hidden = btn.textContent.trim() !== '피자';
        track.parentElement.hidden = btn.textContent.trim() !== '피자';
    }));
    requestAnimationFrame(() => position(tabs[0]));
    window.addEventListener('resize', () => position(tabs.find(t => t.classList.contains('is-active')) || tabs[0]));
})();
