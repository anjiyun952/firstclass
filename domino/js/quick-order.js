(()=>{'use strict';const KEY='domino-pizza-cart-v1',ORDER='domino-cart-order-v1',$=s=>document.querySelector(s),won=n=>n.toLocaleString('ko-KR')+'원';const make=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el};const demoStores=[
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


let order,product,size,dough,qty,tab,step,trigger,selectionDirty=false,restoreSelection=null;const modalConfirm={hidden:false};const saveOrder=()=>{};const root=make('div','quick-overlay');root.hidden=true;root.innerHTML='<div class="quick-shade"></div><section class="quick-sheet" role="dialog" aria-modal="true" aria-labelledby="quick-title" tabindex="-1"><div class="quick-grip"></div><header class="quick-head"><button type="button" class="quick-back" aria-label="뒤로">←</button><h2 id="quick-title">QUICK ORDER</h2><button type="button" class="quick-close" aria-label="닫기">×</button></header><div class="quick-body"></div><footer class="quick-foot" hidden></footer></section>';document.body.append(root);const body=root.querySelector('.quick-body'),foot=root.querySelector('.quick-foot'),sheet=root.querySelector('.quick-sheet'),back=root.querySelector('.quick-back');const btn=(label,fn,cls='quick-button')=>{const b=text('button',label,cls);b.type='button';b.onclick=fn;return b};const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch(e){return fallback}};function open(e){e.preventDefault();trigger=e.currentTarget;order={mode:'delivery',delivery:null,deliveryStore:null,pickup:null,...read(ORDER,{})};window.DominoAddresses?.defaultTo(order);product=null;tab='popular';root.hidden=false;document.body.style.overflow='hidden';renderList();sheet.focus()}function close(){root.classList.add('is-closing');setTimeout(()=>{root.hidden=true;root.classList.remove('is-closing');document.body.style.removeProperty('overflow');trigger?.focus()},300)}root.querySelector('.quick-close').onclick=close;root.querySelector('.quick-shade').onclick=close;document.querySelectorAll('.hero-cta-quick').forEach(a=>a.addEventListener('click',open));document.addEventListener('keydown',e=>{if(root.hidden)return;if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='Tab'){const a=[...sheet.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select')].filter(x=>x.getClientRects().length);if(e.shiftKey&&(document.activeElement===a[0]||document.activeElement===sheet)){e.preventDefault();a.at(-1)?.focus()}else if(!e.shiftKey&&document.activeElement===a.at(-1)){e.preventDefault();a[0]?.focus()}}});function screen(s){step=s;body.replaceChildren();foot.replaceChildren();foot.hidden=true;back.hidden=s==='list';back.onclick=()=>s==='options'?renderList():s==='info'?renderOptions():renderInfo();body.scrollTop=0}function renderList(){screen('list');body.append(text('p','좋아하는 피자를 더 빠르고 간편하게.','quick-muted'));const tabs=make('div','quick-tabs');for(const [v,l] of [['recent','최근 주문'],['popular','인기 메뉴']]){const b=btn(l,()=>{tab=v;renderList()},tab===v?'is-active':'');b.setAttribute('aria-pressed',String(tab===v));tabs.append(b)}body.append(tabs);if(tab==='recent'){const logged=sessionStorage.getItem('domino_demo_logged_in')==='true';const empty=make('div','quick-empty');empty.append(text('h3',logged?'최근 주문 내역이 없습니다.':'로그인 후 최근 주문을 확인해 보세요.'),text('p',logged?'인기 메뉴에서 간편하게 주문해 보세요.':'이전 주문 내역은 회원에게 제공됩니다.','quick-muted'));if(!logged){const a=text('a','로그인하기','quick-primary');a.href='login.html';empty.append(a)}empty.append(btn('인기 메뉴로 주문하기',()=>{tab='popular';renderList()}));body.append(empty);return}const grid=make('div','quick-products');for(const id of ['pizza-11','pizza-6','pizza-7']){const p=window.DOMINO_PIZZA_CATALOG.find(x=>x.id===id);if(!p)continue;const card=make('article','quick-card'),img=make('img');img.src=p.image;img.alt=p.name;card.append(img,text('h3',p.name),text('p','L '+won(p.L),'quick-muted'),btn('선택하기',()=>{product=p;size='L';dough='오리지널';qty=1;renderOptions()}));grid.append(card)}body.append(grid)}function productCard(){const c=make('div','quick-product-summary'),img=make('img');img.src=product.image;img.alt=product.name;c.append(img,text('h3',product.name),text('p',size+' · '+dough+' 도우 · '+qty+'개','quick-muted'));return c}function footer(label,fn,disabled=false){foot.hidden=false;const total=make('div');total.append(text('small','총 주문 금액'),text('strong',won(product[size]*qty)));const b=btn(label,fn,'quick-primary');b.disabled=disabled;foot.append(total,b)}function progress(n){body.append(text('p',n===1?'01 옵션 선택  ─  02 주문 정보':'01 옵션 선택 완료  ─  02 주문 정보','quick-progress'))}function choices(values,current,fn){const g=make('div','quick-choices');for(const v of values){const b=btn(v,()=>fn(v),v===current?'is-active':'');b.setAttribute('aria-pressed',String(v===current));g.append(b)}return g}function renderOptions(){screen('options');progress(1);const g=make('div','quick-columns'),r=make('div','quick-fields');r.append(text('h3','사이즈 선택'),choices(['M','L'],size,v=>{size=v;renderOptions()}),text('h3','도우 선택'),choices(['오리지널','나폴리','씬'],dough,v=>{dough=v;renderOptions()}));const q=make('div','quick-quantity');q.append(text('strong','수량'),btn('−',()=>{qty=Math.max(1,qty-1);renderOptions()}),text('span',String(qty)),btn('+',()=>{qty=Math.min(99,qty+1);renderOptions()}));r.append(q);g.append(productCard(),r);body.append(g);footer('다음 단계 →',renderInfo)}function renderInfo(){screen('info');progress(2);const g=make('div','quick-columns'),r=make('div','quick-fields'),d=order.mode==='delivery';r.append(text('h3','주문 방식'),choices(['배달','포장'],d?'배달':'포장',v=>{order.mode=v==='배달'?'delivery':'pickup';renderInfo()}));if(d){const a=make('div','quick-card');a.append(text('h3','배달 주소'),text('p',order.delivery?.road?[order.delivery.road,order.delivery.detail].filter(Boolean).join(' '):'배달받을 주소를 선택해 주세요.'),btn(order.delivery?.road?'주소 변경':'주소 검색',()=>addressPicker()));r.append(a)}const s=d?order.deliveryStore:order.pickup,c=make('div','quick-card'),b=btn(s?'매장 변경':'매장 검색',()=>storePicker());b.disabled=d&&!order.delivery?.road;c.append(text('h3',d?'배달 매장':'포장 매장'),text('p',s?s.name+' · '+s.address:'주문할 매장을 선택해 주세요.'),b);r.append(c,text('small','시연용 매장 선택이며 실제 배달 가능 여부를 확인하지 않습니다.','quick-muted'));g.append(productCard(),r);body.append(g);footer('장바구니 이동',checkout,!(s?.name&&(!d||order.delivery?.road)))}function checkout(){const items=read(KEY,[]),key=JSON.stringify([product.id,size,dough,'오리지널',[]]),old=items.find(x=>x.key===key);if(old)old.quantity=Math.min(99,old.quantity+qty);else items.push({key,name:product.name,image:product.image,description:'사이즈: '+size+' · 도우: '+dough+' · 엣지: 오리지널',price:product[size],quantity:qty,options:[],size,dough,edge:'오리지널'});localStorage.setItem(KEY,JSON.stringify(items));localStorage.setItem(ORDER,JSON.stringify(order));location.href='cart.html'}function showSelection(title,content,label,callback){screen('picker');body.append(text('h3',title),content);if(!/검색/.test(title))content.append(btn(label,callback,'quick-primary'))}function finishSelection(){renderInfo()}function addressPicker(initialKeyword='',initialPage=1){
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
  if(order.delivery?.road!==address.road)order.deliveryStore=null;order.delivery={road:address.road,jibun:address.jibun,zip:address.zip,detail:checkbox.checked?'':input.value.trim()};
  saveOrder();finishSelection();return false;
 });
 
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
 
 modalConfirm.hidden=false;restoreSelection=()=>storeDetail(store,filters);
}



})();