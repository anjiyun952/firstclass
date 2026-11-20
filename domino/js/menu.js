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

/* Shared cart for configured pizza detail orders. */
(()=>{
 const basket=document.getElementById('menu-basket');if(!basket)return;
 const KEY='domino-pizza-cart-v1';
 const toggle=basket.querySelector('.menu-basket-toggle'),list=basket.querySelector('.menu-basket-list'),total=basket.querySelector('#menu-basket-total'),status=basket.querySelector('.menu-basket-status');
 const won=n=>Number(n).toLocaleString('ko-KR')+'원';
 let items=[];
 try{const stored=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(stored))items=stored.filter(x=>x&&typeof x.name==='string'&&Number.isFinite(x.price)&&Number.isInteger(x.quantity)&&x.quantity>0)}catch(e){items=[]}
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(items))}catch(e){status.textContent='장바구니를 저장하지 못했습니다.'}};
 function render(){
   list.replaceChildren();let sum=0;
   for(const item of items){
     sum+=item.price*item.quantity;
     const row=document.createElement('article');row.className='menu-basket-item';
     const top=document.createElement('div');top.className='menu-basket-item-top';
     const image=document.createElement('img');image.className='menu-basket-item-image';image.src=item.image||'';image.alt='';
     const info=document.createElement('div');info.className='menu-basket-item-info';
     const heading=document.createElement('div');heading.className='menu-basket-item-title';
     const title=document.createElement('strong');title.textContent=item.name;
     const remove=document.createElement('button');remove.className='menu-basket-remove';remove.type='button';remove.setAttribute('aria-label',item.name+' 삭제');
     const icon=document.createElement('img');icon.src='images/shoppingbasket_close_icon.svg';icon.alt='';remove.append(icon);
     remove.addEventListener('click',()=>{items=items.filter(x=>x.key!==item.key);save();render()});
     heading.append(title,remove);
     const desc=document.createElement('p');desc.className='menu-basket-item-desc';desc.textContent=item.description||'';
     info.append(heading,desc);top.append(image,info);
     const bottom=document.createElement('div');bottom.className='menu-basket-item-bottom';
     const price=document.createElement('strong');price.className='menu-basket-item-price';price.textContent=won(item.price*item.quantity);
     const stepper=document.createElement('div');stepper.className='menu-basket-stepper';
     const minus=document.createElement('button'),plus=document.createElement('button'),quantity=document.createElement('output');
     minus.type=plus.type='button';minus.textContent='−';plus.textContent='+';minus.setAttribute('aria-label',item.name+' 수량 줄이기');plus.setAttribute('aria-label',item.name+' 수량 늘리기');quantity.textContent=item.quantity;
     minus.addEventListener('click',()=>{if(item.quantity>1){item.quantity--;save();render()}});
     plus.addEventListener('click',()=>{item.quantity=Math.min(99,item.quantity+1);save();render()});
     stepper.append(minus,quantity,plus);bottom.append(price,stepper);row.append(top,bottom);list.append(row);
   }
   if(!items.length){const empty=document.createElement('p');empty.className='menu-basket-empty';empty.textContent='장바구니가 비어 있습니다. 메뉴에서 상품을 담아 주세요.';list.append(empty)}
   total.textContent=won(sum);
 }
 const open=()=>{basket.dataset.open='true';toggle.setAttribute('aria-expanded','true')};
 toggle.addEventListener('click',()=>{const next=basket.dataset.open!=='true';basket.dataset.open=String(next);toggle.setAttribute('aria-expanded',String(next))});
 basket.querySelector('.menu-basket-order').addEventListener('click',()=>{status.textContent=items.length?'포트폴리오 체험 화면입니다. 실제 주문 및 결제는 진행되지 않습니다.':'먼저 메뉴를 담아 주세요.'});
 render();
 if(new URLSearchParams(location.search).get('cart')==='open'){open();history.replaceState(null,'',location.pathname+location.hash)}
})();
