(()=>{'use strict';const KEY='domino-pizza-cart-v1',ORDER='domino-cart-order-v1';const $=s=>document.querySelector(s);const won=n=>Number(n).toLocaleString('ko-KR')+'원';let items=[];let order={mode:'delivery',delivery:null,deliveryStore:null,pickup:null};try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(a))items=a.filter(x=>x&&typeof x.name==='string'&&Number.isFinite(x.price)&&Number.isInteger(x.quantity)&&x.quantity>0);const b=JSON.parse(localStorage.getItem(ORDER)||'null');if(b&&typeof b==='object')order={...order,...b,mode:b.mode==='pickup'?'pickup':'delivery'}}catch(e){}window.DominoAddresses?.defaultTo(order);const save=()=>{localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new Event('domino-cart-change'))};const saveOrder=()=>localStorage.setItem(ORDER,JSON.stringify(order));const make=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el};let modalAction=null,lastFocus=null;function closeModal(){const m=$('#cart-modal');m.hidden=true;document.body.style.removeProperty('overflow');lastFocus?.focus()}function showModal(title,body,onConfirm){$('#cart-modal-confirm').hidden=false;$('#cart-modal-cancel').hidden=false;lastFocus=document.activeElement;$('#cart-modal-title').textContent=title;const holder=$('#cart-modal-body');holder.replaceChildren();if(typeof body==='string')holder.append(make('p','',body));else holder.append(body);modalAction=onConfirm;$('#cart-modal').hidden=false;document.body.style.overflow='hidden';$('.cart-modal-dialog').focus()}document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',closeModal));$('#cart-modal-cancel').addEventListener('click',closeModal);$('#cart-modal-confirm').addEventListener('click',()=>{if(modalAction?.()!==false)closeModal()});document.addEventListener('keydown',e=>{if($('#cart-modal').hidden)return;if(e.key==='Escape')closeModal();if(e.key==='Tab'){const a=[...$('.cart-modal-dialog').querySelectorAll('button,input')];const i=a.indexOf(document.activeElement);if(e.shiftKey&&i===0){e.preventDefault();a[a.length-1].focus()}else if(!e.shiftKey&&i===a.length-1){e.preventDefault();a[0].focus()}}});
const demoStores=[
 ['오금점','서울특별시 송파구 중대로 314-1','02-449-3030'],
 ['잠원점','서울특별시 서초구 나루터로 61','02-533-7878'],
 ['여의도점','서울특별시 영등포구 국제금융로 78','02-780-2020'],
 ['강서구청점','서울특별시 강서구 까치산로 189-1','02-2606-3082'],
 ['방화점','서울특별시 강서구 금낭화로 69','02-2666-9127'],
 ['발산점','서울특별시 강서구 강서로 337','02-2661-3083'],
 ['목동점','서울특별시 양천구 목동중앙로 85','02-2642-0354'],
 ['잠실본점','서울특별시 송파구 백제고분로 184','02-415-3607'],
 ['마포점','서울특별시 마포구 백범로 123','02-717-3082'],
 ['부평점','인천광역시 부평구 부평대로 114','032-519-2307'],
 ['연수점','인천광역시 연수구 용담로 93','032-818-0030'],
 ['계양점','인천광역시 계양구 주부토로 463','032-549-3030'],
 ['과천점','경기도 과천시 새술막길 14','02-504-1302'],
 ['서현점','경기도 성남시 분당구 서현로 377','031-702-3005'],
 ['평촌점','경기도 안양시 동안구 귀인로 198','031-382-7474'],
 ['광교점','경기도 수원시 영통구 센트럴타운로 92','031-217-3083'],
 ['김포구래점','경기도 김포시 김포한강9로12번길 97-10','031-996-3025'],
 ['동탄점','경기도 화성시 동탄지성로 84','031-8003-3324'],
 ['대전월평점','대전광역시 서구 월평로 69','042-482-3033'],
 ['둔산점','대전광역시 서구 문정로 170','042-487-3082'],
 ['유성점','대전광역시 유성구 어은로 44','042-861-3083'],
 ['대연점','부산광역시 남구 수영로 256','051-625-3082'],
 ['해운대점','부산광역시 해운대구 해운대로 793','051-703-3082'],
 ['서면점','부산광역시 부산진구 전포대로 195','051-818-3082']
].map(([name,address,phone])=>({name,address,phone,province:address.split(' ')[0],district:address.split(' ')[1],hours:'공식 매장찾기에서 확인'}));
const text=(tag,value,cls)=>make(tag,cls||'',value);
const append=(parent,...children)=>{parent.append(...children);return parent};
const modalConfirm=$('#cart-modal-confirm'),modalCancel=$('#cart-modal-cancel');
let selectionDirty=false,selectionModal=false,restoreSelection=null;
function showSelection(title,body,confirmText,callback){
 selectionModal=true;showModal(title,body,callback);
 modalConfirm.textContent=confirmText;modalCancel.hidden=true;
 $('.cart-modal-dialog').classList.remove('cart-store-dialog','cart-address-detail-dialog');
 $('.cart-modal-dialog').classList.add('cart-selection-dialog');
}
function finishSelection(){
 selectionDirty=false;selectionModal=false;modalCancel.hidden=false;modalConfirm.hidden=false;
 modalConfirm.textContent='확인';$('.cart-modal-dialog').classList.remove('cart-selection-dialog','cart-store-dialog','cart-address-detail-dialog');
 closeModal();orderRender();
}
function attemptSelectionClose(){
 if(selectionModal&&['상세 주소 입력','배달 매장 확인','포장 매장 확인'].includes($('#cart-modal-title').textContent)){finishSelection();return}
 if(!selectionModal){closeModal();return}
 if(!selectionDirty){finishSelection();return}
 const resume=restoreSelection;
 selectionModal=false;
 showModal('변경 취소','변경을 취소하시겠습니까?',()=>{selectionDirty=false;finishSelection()});
 modalCancel.hidden=false;modalConfirm.textContent='변경 취소';
 modalCancel.onclick=()=>{modalCancel.onclick=null;closeModal();resume?.()};
}
document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',e=>{if(selectionModal){e.stopImmediatePropagation();attemptSelectionClose()}},true));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&selectionModal){e.stopImmediatePropagation();attemptSelectionClose()}},true);
function orderRender(){
 document.querySelectorAll('[data-mode]').forEach(btn=>{const on=btn.dataset.mode===order.mode;btn.classList.toggle('is-active',on);btn.setAttribute('aria-pressed',String(on))});
 const delivery=order.mode==='delivery',chosen=delivery?order.delivery:order.pickup;
 $('#cart-address-title').lastChild.textContent=delivery?'배달 정보':'포장 정보';
 const area=$('#cart-address-text');area.replaceChildren();
 if(chosen&&typeof chosen==='object'){
  area.append(text('strong',delivery?chosen.road:chosen.name,'cart-location-main'));
  if(delivery){
   if(chosen.detail)area.append(text('span',chosen.detail,'cart-location-sub'));
  }else{
   area.append(text('span',chosen.address,'cart-location-sub'));
   area.append(text('span',chosen.phone+' · 영업시간: '+chosen.hours,'cart-linked-store'));
  }
 }else if(typeof chosen==='string'&&chosen){area.textContent=chosen}
 else area.textContent=delivery?'배달 주소를 선택해 주세요.':'포장 매장을 선택해 주세요.';
 $('#cart-edit').lastChild.textContent=chosen?'변경':'선택';
 const storeRow=$('#cart-delivery-store');if(storeRow){storeRow.hidden=!delivery;$('#cart-delivery-store-name').textContent=order.deliveryStore?order.deliveryStore.name+' · '+order.deliveryStore.address:'배달 매장을 선택해 주세요.';$('#cart-delivery-store-edit').lastChild.textContent=order.deliveryStore?'변경':'선택';}
}
document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>{order.mode=btn.dataset.mode;saveOrder();orderRender();render()}));
function addressPicker(initialKeyword='',initialPage=1){
 const body=make('div','cart-picker');const form=make('form','cart-picker-search');
 const input=make('input');input.type='search';input.placeholder='도로명 또는 건물명을 검색해 주세요';input.value=initialKeyword;input.maxLength=100;
 const submit=make('button');submit.type='submit';submit.setAttribute('aria-label','검색');const searchIcon=make('img');searchIcon.src='images/magnifying_glass_icon.svg';searchIcon.alt='';submit.append(searchIcon);append(form,input,submit);
 const status=make('p','cart-picker-status');status.setAttribute('aria-live','polite');
 const results=make('div','cart-picker-results');const pages=make('div','cart-picker-pages');
 append(body,form,status,results,pages);
 window.DominoAddresses?.picker(body,order,()=>{saveOrder();finishSelection()});
 showSelection('배달 주소 검색',body,'주소 선택',()=>false);
 modalConfirm.hidden=true;
 let lastQuery=initialKeyword,request=0;
 async function search(page){
  const keyword=input.value.trim();if(!keyword){status.textContent='검색어를 입력해 주세요.';return}
  lastQuery=keyword;const id=++request;status.textContent='주소를 검색하고 있습니다…';results.replaceChildren();pages.replaceChildren();
  try{
   const response=await fetch('/api/address?keyword='+encodeURIComponent(keyword)+'&page='+page);
   if(!response.ok)throw Error('HTTP '+response.status);
   const data=await response.json();if(id!==request)return;
   const list=data.addresses||[];status.textContent=list.length?data.total+'개 검색 결과':'검색 결과가 없습니다. 검색어를 다시 확인해 주세요.';
   list.forEach(a=>{
    const b=make('button','cart-picker-result');b.type='button';
    append(b,text('strong',a.road),text('span','지번: '+a.jibun),text('small','우편번호 '+a.zip));
    b.addEventListener('click',()=>{selectionDirty=true;addressDetail(a,keyword,page)});
    results.append(b);
   });
   const count=Math.min(20,Math.ceil((Number(data.total)||0)/5));
   if(count>1){
    const start=Math.floor((page-1)/5)*5+1;
    for(let p=start;p<=Math.min(count,start+4);p++){
     const b=text('button',String(p));b.type='button';b.disabled=p===page;
     b.addEventListener('click',()=>search(p));pages.append(b);
    }
   }
  }catch(error){if(id===request)status.textContent='주소 검색 중 오류가 발생했습니다. 잠시 후 다시 검색해 주세요.'}
 }
 form.addEventListener('submit',e=>{e.preventDefault();search(1)});
 restoreSelection=()=>addressPicker(lastQuery,initialPage);
 if(initialKeyword)search(initialPage);
 input.focus();
}
function addressDetail(address,keyword,page){
 const body=make('div','cart-address-detail');
 const addressRow=make('div','cart-address-selected');
 const addressText=make('div','cart-address-selected-text');
 append(addressText,text('span','선택한 주소','cart-address-caption'),text('strong',address.road,'cart-detail-road'),text('span','우편번호 '+address.zip,'cart-address-zip'));
 const back=text('button','주소 변경','cart-address-change');back.type='button';back.addEventListener('click',()=>addressPicker(keyword,page));
 append(addressRow,addressText,back);
 const field=make('div','cart-address-field');
 const label=text('label','상세 주소');const input=make('input');input.type='text';input.maxLength=150;input.placeholder='동·호수 등 상세 주소를 입력해 주세요';input.id='cart-address-detail-input';label.htmlFor=input.id;
 const checkLabel=make('label','cart-check-label'),checkbox=make('input');checkbox.type='checkbox';
 append(checkLabel,checkbox,document.createTextNode('상세 주소 없음'));
 const error=text('p','','cart-field-error');error.setAttribute('aria-live','polite');
 append(field,label,input,checkLabel,error);
 append(body,addressRow,field);
 showSelection('상세 주소 입력',body,'이 주소로 설정하기',()=>{
  if(!input.value.trim()&&!checkbox.checked){input.classList.add('is-invalid');error.textContent='상세 주소를 입력하거나 상세 주소 없음을 선택해 주세요.';return false}
  order.delivery={road:address.road,jibun:address.jibun,zip:address.zip,detail:checkbox.checked?'':input.value.trim()};
  saveOrder();finishSelection();return false;
 });
 $('.cart-modal-dialog').classList.add('cart-address-detail-dialog');
 modalConfirm.hidden=false;
 checkbox.addEventListener('change',()=>{input.disabled=checkbox.checked;if(checkbox.checked){input.value='';input.classList.remove('is-invalid');error.textContent=''}});
 input.addEventListener('input',()=>{input.classList.remove('is-invalid');error.textContent=''});
 restoreSelection=()=>addressDetail(address,keyword,page);input.focus();
}

function storePicker(filters={keyword:'',province:'',district:''}){
 const body=make('div','cart-picker'),form=make('form','cart-picker-search');
 const input=make('input');input.type='search';input.placeholder='매장명 검색';input.value=filters.keyword;
 const searchButton=make('button');searchButton.type='submit';searchButton.setAttribute('aria-label','검색');const searchIcon=make('img');searchIcon.src='images/magnifying_glass_icon.svg';searchIcon.alt='';searchButton.append(searchIcon);append(form,input,searchButton);
 const region=make('div','cart-picker-region'),province=make('select'),district=make('select');
 const addOptions=(select,values,placeholder)=>{select.replaceChildren(new Option(placeholder,''));values.forEach(v=>select.add(new Option(v,v)))};
 addOptions(province,[...new Set(demoStores.map(s=>s.province))].sort(),'시/도 선택');province.value=filters.province;
 function districts(){addOptions(district,[...new Set(demoStores.filter(s=>!province.value||s.province===province.value).map(s=>s.district))].sort(),'구/군 선택');district.value=filters.district}
 districts();
 // Keep the native selects as the data source and display custom dropdown controls.
 const dropdowns=[];
 function regionDropdown(select,label){
  const wrapper=make('div','cart-picker-select');
  const trigger=make('button','cart-picker-select-trigger');trigger.type='button';
  trigger.setAttribute('aria-label',label);trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');
  const caption=make('span','cart-picker-select-label');
  const arrow=make('img','cart-picker-select-arrow');arrow.src='images/arrow_down_icon.svg';arrow.alt='';arrow.setAttribute('aria-hidden','true');
  append(trigger,caption,arrow);
  const menu=make('div','cart-picker-select-menu');menu.setAttribute('role','listbox');menu.hidden=true;
  select.classList.add('cart-picker-native-select');select.tabIndex=-1;select.setAttribute('aria-hidden','true');
  append(wrapper,select,trigger,menu);
  function close(){
   wrapper.classList.remove('is-open');trigger.setAttribute('aria-expanded','false');menu.hidden=true;
   document.removeEventListener('pointerdown',onOutside);
   document.removeEventListener('keydown',onEscape);
  }
  function onOutside(event){if(!wrapper.contains(event.target))close()}
  function onEscape(event){if(event.key==='Escape'){close();trigger.focus()}}
  function sync(){
   caption.textContent=select.selectedOptions[0]?.textContent||label;
   menu.replaceChildren();
   [...select.options].forEach(option=>{
    const item=make('button','cart-picker-select-option');item.type='button';
    item.setAttribute('role','option');item.setAttribute('aria-selected',String(select.value===option.value));
    item.textContent=option.textContent;
    item.addEventListener('click',()=>{
     select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));
     close();trigger.focus();
    });
    menu.append(item);
   });
  }
  function open(){
   dropdowns.forEach(dropdown=>dropdown.close());
   sync();menu.hidden=false;wrapper.classList.add('is-open');trigger.setAttribute('aria-expanded','true');
   document.addEventListener('pointerdown',onOutside);
   document.addEventListener('keydown',onEscape);
  }
  trigger.addEventListener('click',()=>{if(menu.hidden)open();else close()});
  trigger.addEventListener('keydown',event=>{
   if(event.key==='ArrowDown'){event.preventDefault();if(menu.hidden)open();menu.querySelector('button')?.focus()}
  });
  menu.addEventListener('keydown',event=>{
   if(event.key==='ArrowDown'||event.key==='ArrowUp'){
    event.preventDefault();const items=[...menu.querySelectorAll('button')],index=items.indexOf(document.activeElement);
    items[(index+(event.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus();
   }
  });
  select.addEventListener('change',sync);sync();
  dropdowns.push({close,sync});
  return wrapper;
 }
 append(region,regionDropdown(province,'시/도 선택'),regionDropdown(district,'구/군 선택'));
 const status=make('p','cart-picker-status'),results=make('div','cart-picker-results');
 append(body,form,region,status,results);
 showSelection(order.mode==='delivery'?'배달 매장 검색':'포장 매장 검색',body,'매장 선택',()=>false);modalConfirm.hidden=true;
 function renderStores(){
  const term=input.value.trim().toLocaleLowerCase('ko');
  const list=demoStores.filter(s=>(!term||s.name.toLocaleLowerCase('ko').includes(term))&&(!province.value||s.province===province.value)&&(!district.value||s.district===district.value));
  status.textContent=list.length+'개 시연 매장 검색 결과 · 일부 매장만 제공';results.replaceChildren();
  if(!list.length)results.append(text('p','검색 결과가 없습니다. 검색어를 다시 확인해 주세요.'));
  list.forEach(s=>{const b=make('button','cart-picker-result');b.type='button';append(b,text('strong',s.name),text('span',s.address));b.addEventListener('click',()=>{selectionDirty=true;storeDetail(s,{keyword:input.value,province:province.value,district:district.value})});results.append(b)});
 }
 form.addEventListener('submit',e=>{e.preventDefault();renderStores()});
 province.addEventListener('change',()=>{filters.district='';districts();dropdowns.forEach(dropdown=>dropdown.sync());renderStores()});district.addEventListener('change',renderStores);
 restoreSelection=()=>storePicker({keyword:input.value,province:province.value,district:district.value});renderStores();input.focus();
}
function storeDetail(store,filters){
 const body=make('div','cart-store-detail');
 const heading=make('div','cart-store-heading');
 const nameGroup=make('div','cart-store-name');
 append(nameGroup,text('strong',store.name),text('span','선택한 매장 정보'));
 const back=text('button','매장 변경','cart-store-change');back.type='button';back.addEventListener('click',()=>storePicker(filters));
 append(heading,nameGroup,back);
 const info=make('div','cart-store-info');
 [['map_marker',store.address],['call',store.phone],['clock','영업시간: '+store.hours]].forEach(([icon,value])=>{
  const row=make('div','cart-store-info-row'),symbol=make('img','cart-store-icon');
  symbol.src='images/'+icon+'_icon.svg';symbol.alt='';symbol.setAttribute('aria-hidden','true');
  append(row,symbol,text('span',value));info.append(row);
 });
 append(body,heading,info);
 showSelection(order.mode==='delivery'?'배달 매장 확인':'포장 매장 확인',body,'이 매장으로 설정하기',()=>{const selected={name:store.name,address:store.address,phone:store.phone,hours:store.hours};if(order.mode==='delivery')order.deliveryStore=selected;else order.pickup=selected;saveOrder();finishSelection();return false});
 $('.cart-modal-dialog').classList.add('cart-store-dialog');
 modalConfirm.hidden=false;restoreSelection=()=>storeDetail(store,filters);
}

$('#cart-edit').addEventListener('click',()=>{selectionDirty=false;order.mode==='delivery'?addressPicker():storePicker()});
$('#cart-delivery-store-edit')?.addEventListener('click',()=>{selectionDirty=false;storePicker()});
function renderCoupon(sum){const C=window.DominoCoupons,select=$('#cart-coupon'),eligible=items.filter(x=>x.size).reduce((n,x)=>n+x.price*x.quantity,0),available=C.logged()&&order.mode==='delivery'&&eligible>0?C.read().filter(C.active):[];select.replaceChildren(new Option('사용 안 함',''));for(const c of available)select.add(new Option(c.name+' ('+c.rate+'%)',c.id));const chosen=available.find(c=>c.id===C.selected());select.value=chosen?.id||'';const discount=chosen?Math.floor(eligible*chosen.rate/100):0;$('#cart-coupon-row').hidden=!available.length;$('#cart-discount-row').hidden=!discount;$('#cart-discount').textContent='−'+won(discount);$('#cart-total').textContent=won(sum-discount)}$('#cart-coupon').addEventListener('change',e=>{window.DominoCoupons.select(e.target.value);render()});function render(){const filled=items.length>0;$('#cart-filled').hidden=!filled;$('#cart-empty').hidden=filled;const wrap=$('#cart-items');wrap.replaceChildren();let sum=0;items.forEach(item=>{sum+=item.price*item.quantity;const row=make('article','cart-item');const top=make('div','cart-item-top');const image=make('img','cart-item-image');image.src=item.image||'';image.alt='';const info=make('div','cart-item-details');info.append(make('h3','',item.name),make('p','',item.description||''),make('strong','',won(item.price*item.quantity)));const remove=make('button','cart-remove');remove.type='button';remove.setAttribute('aria-label',item.name+' 삭제');const x=make('img');x.src='images/shoppingbasket_close_icon.svg';x.alt='';remove.append(x);remove.addEventListener('click',()=>{items=items.filter(x=>x!==item);save();render()});top.append(image,info,remove);const bottom=make('div','cart-item-bottom');const link=make('a','cart-option-link',item.size?'옵션 변경':'상품 정보');if(item.size){link.href='pizza-detail.html?id='+encodeURIComponent((()=>{try{return JSON.parse(item.key)[0]}catch(e){return ''}})())+'&edit='+encodeURIComponent(item.key)}else{link.href='menu.html'}const step=make('div','cart-stepper');const minus=make('button','','−'),out=make('output','',String(item.quantity)),plus=make('button','','+');minus.type=plus.type='button';minus.disabled=item.quantity<=1;minus.setAttribute('aria-label','수량 줄이기');plus.setAttribute('aria-label','수량 늘리기');minus.addEventListener('click',()=>{if(item.quantity>1){item.quantity--;save();render()}});plus.addEventListener('click',()=>{if(item.quantity<99){item.quantity++;save();render()}});step.append(minus,out,plus);bottom.append(link,step);row.append(top,bottom);wrap.append(row)});$('#cart-subtotal').textContent=won(sum);renderCoupon(sum)}$('#cart-clear').addEventListener('click',()=>showModal('장바구니 전체 삭제','장바구니에 담긴 상품을 모두 삭제하시겠습니까?',()=>{items=[];save();render()}));const recommendations=[{name:'코카콜라 1.25L',price:2500,image:'images/coca_cola_1250ml_image.png'},{name:'코카콜라 510ml',price:1800,image:'images/coca_cola_510ml_image.png'},{name:'코카콜라 제로 1.25L',price:2500,image:'images/coca_cola_zero_1250ml_image.png'},{name:'콘샐러드 콤보(코카콜라 1.25L)',price:3900,image:'images/corn_salad_combo_image.png'}];const rec=$('#cart-recommendations');recommendations.forEach(p=>{const card=make('article','cart-rec-card'),img=make('img'),info=make('div','cart-rec-info'),add=make('button','','+');img.src=p.image;img.alt='';info.append(make('h3','',p.name),make('p','',won(p.price)));add.type='button';add.setAttribute('aria-label',p.name+' 추가');add.addEventListener('click',()=>{const key=JSON.stringify(['recommend',p.name]);const existing=items.find(x=>x.key===key);if(existing)existing.quantity=Math.min(99,existing.quantity+1);else items.push({key,name:p.name,image:p.image,description:'',price:p.price,quantity:1});save();render()});card.append(img,info,add);rec.append(card)});$('#cart-checkout').addEventListener('click',()=>{
 if(!items.length){showModal('주문 정보 확인','장바구니에 상품을 먼저 담아 주세요.',()=>{});return}
 const delivery=order.mode==='delivery',place=delivery?order.delivery:order.pickup;
 if(!place||typeof place!=='object'){
  showModal('주문 정보 확인',delivery?'배달 주소를 먼저 선택해 주세요.':'포장 매장을 먼저 선택해 주세요.',()=>{$('#cart-edit').click()});return
 }
 if(delivery&&!order.deliveryStore){
  showModal('주문 정보 확인','배달 매장을 먼저 선택해 주세요. 시연용 선택이며 실제 배달 가능 여부를 확인하지 않습니다.',()=>{$('#cart-delivery-store-edit').click()});return
 }
 showModal('주문서 페이지 준비 중','시연용 주문 정보가 저장되어 있습니다. 실제 주문 및 결제는 진행되지 않습니다.',()=>{});
});
window.addEventListener('storage',e=>{if(e.key===KEY){try{const v=JSON.parse(e.newValue||'[]');items=Array.isArray(v)?v:[]}catch(e){items=[]}render()}});orderRender();render()})();