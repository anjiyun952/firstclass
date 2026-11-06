(() => {
    const primary = [...document.querySelectorAll('.menu-primary button')];
    const sections = {
        '피자': { wrap: document.querySelector('.menu-secondary-scroll:not(#side-tabs-wrap)'), panel: document.getElementById('pizza-products') },
        '사이드': { wrap: document.getElementById('side-tabs-wrap'), panel: document.getElementById('side-products') }
    };
    // Categories without product data still need their own empty panel.
    for (const name of ['세트', '음료·기타']) {
        const panel = document.createElement('div');
        panel.className = 'menu-product-grid';
        panel.hidden = true;
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-label', name);
        panel.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:80px 16px;">상품을 준비 중입니다.</p>';
        document.getElementById('pizza-products').insertAdjacentElement('afterend', panel);
        sections[name] = { wrap: null, panel };
    }
    let activePrimary = '피자';

    function position(section) {
        if (!section?.wrap || section.wrap.hidden) return;
        const track = section.wrap.querySelector('.menu-secondary');
        const tab = track.querySelector('[role="tab"].is-active');
        const indicator = track.querySelector('.menu-tab-indicator');
        if (!tab || !indicator) return;
        indicator.style.width = tab.offsetWidth + 'px';
        indicator.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
    }

    function activate(section, tab) {
        const tabs = [...section.wrap.querySelectorAll('[role="tab"]')];
        tabs.forEach(t => {
            const selected = t === tab;
            t.classList.toggle('is-active', selected);
            t.setAttribute('aria-selected', String(selected));
            t.tabIndex = selected ? 0 : -1;
        });
        section.panel.setAttribute('aria-labelledby', tab.id);
        if (section === sections['피자']) {
            section.panel.querySelectorAll('.best-menu-card').forEach(card => {
                card.hidden = tab.dataset.category !== '전체' &&
                    !(tab.dataset.category === 'NEW' ? card.dataset.new === 'true' : card.dataset.category === tab.dataset.category);
            });
        } else {
            section.panel.querySelectorAll('.best-menu-card').forEach(card => {
                card.hidden = tab.dataset.category !== '전체' && card.dataset.category !== tab.dataset.category;
            });
        }
        position(section);
    }

    Object.values(sections).forEach(section => {
        if (!section.wrap) return;
        const tabs = [...section.wrap.querySelectorAll('[role="tab"]')];
        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => activate(section, tab));
            tab.addEventListener('keydown', e => {
                let next = i;
                if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
                else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
                else if (e.key === 'Home') next = 0;
                else if (e.key === 'End') next = tabs.length - 1;
                else return;
                e.preventDefault();
                tabs[next].focus();
                activate(section, tabs[next]);
            });
        });
    });

    primary.forEach(btn => btn.addEventListener('click', () => {
        activePrimary = btn.textContent.trim();
        primary.forEach(p => {
            p.classList.toggle('is-active', p === btn);
            if (p === btn) p.setAttribute('aria-current', 'true');
            else p.removeAttribute('aria-current');
        });
        Object.entries(sections).forEach(([name, section]) => {
            if (section.wrap) section.wrap.hidden = name !== activePrimary;
            section.panel.hidden = name !== activePrimary;
        });
        requestAnimationFrame(() => position(sections[activePrimary]));
    }));

    const requested = new URLSearchParams(location.search).get('category');
    if (requested) {
        const target = primary.find(button => button.textContent.trim() === requested);
        if (target) target.click();
    }
    requestAnimationFrame(() => position(sections[activePrimary]));
    window.addEventListener('resize', () => position(sections[activePrimary]));
})();
