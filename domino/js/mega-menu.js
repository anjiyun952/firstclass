(() => {
    const header = document.querySelector('.site-header');
    const nav = header?.querySelector('.header-nav');
    if (!header || !nav) return;

    const categories = ['MENU', 'EVENT', 'BRAND', 'STORE', 'COUPON'];
    const submenus = {
        MENU: ['피자', '사이드', '세트', '음료·기타'],
        EVENT: ['이벤트', '할인·제휴 혜택'],
        BRAND: ['도미노피자 소개', '역사', '도미노뉴스', '사회공헌'],
        STORE: [],
        COUPON: ['e-쿠폰', '상품권 구매', '이용 안내']
    };
    const triggers = [...nav.querySelectorAll('a')].filter(a => categories.includes(a.textContent.trim()));
    const menu = document.createElement('div');
    menu.className = 'mega-menu';
    menu.id = 'domino-mega-menu';
    const inner = document.createElement('div');
    inner.className = 'mega-menu-inner';
    const groups = new Map();

    for (const category of categories) {
        if (!submenus[category].length) continue; // STORE has no submenu.
        const group = document.createElement('div');
        group.className = 'mega-menu-group';
        group.setAttribute('aria-label', category + ' 하위 메뉴');
        for (const label of submenus[category]) {
            const link = document.createElement('a');
            link.textContent = label;
            link.href = '#'; // Destinations not yet supplied.
            link.addEventListener('click', event => event.preventDefault());
            group.appendChild(link);
        }
        inner.appendChild(group);
        groups.set(category, group);
    }
    menu.appendChild(inner);
    header.appendChild(menu);
    let open = false;

    const alignGroups = () => {
        const parent = inner.getBoundingClientRect();
        for (const trigger of triggers) {
            const group = groups.get(trigger.textContent.trim());
            if (!group) continue;
            const rect = trigger.getBoundingClientRect();
            group.style.left = (rect.left - parent.left) + 'px';
        }
    };
    const setOpen = value => {
        open = value;
        if (value) alignGroups();
        menu.classList.toggle('is-open', value);
        menu.setAttribute('aria-hidden', String(!value));
        for (const trigger of triggers) trigger.setAttribute('aria-expanded', String(value));
    };

    for (const trigger of triggers) {
        trigger.setAttribute('aria-controls', menu.id);
        trigger.setAttribute('aria-expanded', 'false');
        // Desktop: hovering any main category opens the entire mega menu.
        trigger.addEventListener('mouseenter', () => setOpen(true));
        trigger.addEventListener('focus', () => setOpen(true));
        // Touch and keyboard users can still toggle the menu by tapping.
        trigger.addEventListener('click', event => {
            event.preventDefault();
            if (window.matchMedia('(hover: none)').matches) setOpen(!open);
            else setOpen(true);
        });
    }
    // Moving from the header into its dropdown keeps the menu open.
    header.addEventListener('mouseleave', () => setOpen(false));
    header.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            setOpen(false);
            if (header.contains(document.activeElement)) document.activeElement.blur();
        }
    });
    document.addEventListener('pointerdown', event => {
        if (open && !header.contains(event.target)) setOpen(false);
    });
    window.addEventListener('resize', alignGroups);
    header.querySelector('.header-inner')?.addEventListener('scroll', alignGroups, { passive: true });
    setOpen(false);
})();
