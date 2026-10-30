(() => {
 const toggle=document.querySelector('.mobile-menu-toggle');
 const panel=document.querySelector('.mobile-menu');
 const overlay=document.querySelector('.mobile-menu-overlay');
 if(!toggle||!panel||!overlay)return;
 const closeButton=panel.querySelector('.mobile-menu-close');
 const categories=panel.querySelectorAll('.mobile-menu-category');
 let lastFocus=null;
 const close=()=>{
  if(!document.body.classList.contains('mobile-menu-open'))return;
  document.body.classList.remove('mobile-menu-open');
  toggle.setAttribute('aria-expanded','false');
  toggle.setAttribute('aria-label','메뉴 열기');
  panel.setAttribute('aria-hidden','true');
  panel.inert=true;
  overlay.setAttribute('aria-hidden','true');
  if(lastFocus&&window.matchMedia('(max-width:767px)').matches)lastFocus.focus();
 };
 const open=()=>{
  lastFocus=document.activeElement;
  document.body.classList.add('mobile-menu-open');
  toggle.setAttribute('aria-expanded','true');
  toggle.setAttribute('aria-label','메뉴 닫기');
  panel.removeAttribute('aria-hidden');
  panel.inert=false;
  overlay.setAttribute('aria-hidden','false');
  closeButton.focus();
 };
 toggle.addEventListener('click',()=>document.body.classList.contains('mobile-menu-open')?close():open());
 closeButton.addEventListener('click',close);
 overlay.addEventListener('click',close);
 categories.forEach(button=>button.addEventListener('click',()=>{
  const expanded=button.getAttribute('aria-expanded')==='true';
  categories.forEach(other=>{other.setAttribute('aria-expanded','false');other.nextElementSibling.hidden=true;});
  if(!expanded){button.setAttribute('aria-expanded','true');button.nextElementSibling.hidden=false;}
 }));
 panel.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
 document.addEventListener('keydown',event=>{
  if(!document.body.classList.contains('mobile-menu-open'))return;
  if(event.key==='Escape'){close();return;}
  if(event.key==='Tab'){
   const focusable=[...panel.querySelectorAll('button,a[href]')].filter(el=>!el.closest('[hidden]'));
   const first=focusable[0],last=focusable[focusable.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
 });
 window.matchMedia('(min-width:768px)').addEventListener('change',event=>{if(event.matches)close();});
})();