// 도미노피자 공식 공개 매장 목록에서 확인한 정적 샘플 데이터 (전국 17개 시·도, 60개).
// 전체 매장 목록이 아니며 자동 연동하지 않습니다. 최신 주소/전화번호는 공식 매장찾기에서 확인하세요.
// 출처: https://web.dominos.co.kr/branch.html
const rawStores="오금점|서울특별시 송파구 중대로 314-1|02-449-3030\n잠원점|서울특별시 서초구 나루터로 61|02-533-7878\n여의도점|서울특별시 영등포구 국제금융로 78|02-780-2020\n강서구청점|서울특별시 강서구 까치산로 189-1|02-2606-3082\n방화점|서울특별시 강서구 금낭화로 69|02-2666-9127\n발산점|서울특별시 강서구 강서로 337|02-2661-3083\n목동점|서울특별시 양천구 목동중앙로 85|02-2642-0354\n잠실본점|서울특별시 송파구 백제고분로 184|02-415-3607\n마포점|서울특별시 마포구 백범로 123|02-717-3082\n부평점|인천광역시 부평구 부평대로 114|032-519-2307\n연수점|인천광역시 연수구 용담로 93|032-818-0030\n계양점|인천광역시 계양구 주부토로 463|032-549-3030\n과천점|경기도 과천시 새술막길 14|02-504-1302\n서현점|경기도 성남시 분당구 서현로 377|031-702-3005\n평촌점|경기도 안양시 동안구 귀인로 198|031-382-7474\n광교점|경기도 수원시 영통구 센트럴타운로 92|031-217-3083\n김포구래점|경기도 김포시 김포한강9로12번길 97-10|031-996-3025\n동탄점|경기도 화성시 동탄지성로 84|031-8003-3324\n원주점|강원특별자치도 원주시 천사로 155-1|033-744-3030\n춘천후평점|강원특별자치도 춘천시 춘천로 247|033-241-3082\n속초점|강원특별자치도 속초시 온천로 287|033-637-3088\n강릉점|강원특별자치도 강릉시 성덕포남로 169|033-643-3082\n천안쌍용점|충청남도 천안시 서북구 불당5길 19|041-578-3084\n아산온양점|충청남도 아산시 온천대로 1385|041-541-3082\n공주점|충청남도 공주시 신관로 31|041-853-3081\n청주충북대점|충청북도 청주시 서원구 1순환로 684|043-262-3082\n충주점|충청북도 충주시 갱고개로 175-1|043-854-3082\n제천점|충청북도 제천시 용두천로 140|043-652-3082\n대전월평점|대전광역시 서구 월평로 69|042-482-3033\n둔산점|대전광역시 서구 문정로 170|042-487-3082\n유성점|대전광역시 유성구 어은로 44|042-861-3083\n진주교대점|경상남도 진주시 진양호로 392|055-746-3042\n창원상남점|경상남도 창원시 성산구 마디미동로 58|055-284-3082\n김해어방점|경상남도 김해시 인제로 146|055-329-3042\n포항우창점|경상북도 포항시 북구 새천년대로 1063|054-254-3082\n안동점|경상북도 안동시 경동로 638|054-854-3082\n경주성건점|경상북도 경주시 금성로395번길 3|054-748-3082\n대구대봉점|대구광역시 중구 동덕로 86|053-423-3082\n대구화원점|대구광역시 달성군 화원읍 명천로 255|053-644-3082\n순천조례점|전라남도 순천시 이수로 284|061-721-3084\n목포하당점|전라남도 목포시 원형로 44-1|061-283-3082\n여수문수점|전라남도 여수시 문수로 76|061-654-1188\n전주금암점|전북특별자치도 전주시 덕진구 백제대로 658|063-273-3083\n군산점|전북특별자치도 군산시 백토로 142|063-471-3330\n익산영등점|전북특별자치도 익산시 고봉로 18길 1|063-854-3082\n광주금호점|광주광역시 서구 운천로 94-1|062-383-3082\n광주동구점|광주광역시 동구 중앙로 214|062-233-3082\n광주첨단점|광주광역시 광산구 월계로 217|062-974-3082\n울산달동점|울산광역시 남구 번영로 98|052-261-3084\n울산병영점|울산광역시 중구 평산1길 2|052-286-3082\n울산무거점|울산광역시 남구 삼호로 3|052-223-3082\n대연점|부산광역시 남구 수영로 256|051-625-3082\n해운대점|부산광역시 해운대구 해운대로 793|051-703-3082\n서면점|부산광역시 부산진구 전포대로 195|051-818-3082\n동래점|부산광역시 동래구 아시아드대로 203|051-506-3082\n제주시청점|제주특별자치도 제주시 동광로 9|064-751-3082\n제주노형점|제주특별자치도 제주시 연북로 18|064-742-3082\n제주서귀포점|제주특별자치도 서귀포시 신서귀로 118|064-739-3083\n조치원점|세종특별자치시 조치원읍 문화길 39|044-865-3082\n세종아름점|세종특별자치시 보듬3로 91|044-864-3082";
const stores=rawStores.split('\n').map(line=>{const [name,address,phone]=line.split('|');const parts=address.split(' ');return {name,province:parts[0],district:parts[1],address,phone,hours:'',delivery:true,pickup:true,dineIn:['롯데월드점','명동점'].includes(name)}});
const keyword=document.getElementById('store-keyword');
const province=document.getElementById('store-province');
const district=document.getElementById('store-district');
const results=document.getElementById('store-results');
const status=document.getElementById('store-status');
const map=document.getElementById('store-map-frame');
const mapLink=document.getElementById('store-map-link');
const icon=file=>'images/'+file+'_icon.svg';
const storeMap=typeof L!=='undefined'?L.map('store-map-frame',{zoomControl:true}).setView([37.55,126.95],12):null;
if(storeMap)L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors',maxZoom:19}).addTo(storeMap);
let activeMarker=null;
const storeMarkers=new Map();
const coordinateCache=new Map();
let selectedStoreName=null;
const markerSVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104 128" width="104" height="128" aria-hidden="true">
<g transform="translate(52 49) rotate(45)">
<rect x="-22" y="-47" width="44" height="44" rx="5" fill="#ff0000"/>
<rect x="-22" y="1" width="44" height="44" rx="5" fill="#00a4e8"/>
<circle cx="0" cy="-25" r="7.5" fill="white"/><circle cx="-10" cy="23" r="7.5" fill="white"/><circle cx="10" cy="23" r="7.5" fill="white"/>
</g><path d="M52 93V113" stroke="#0078c8" stroke-width="3" stroke-linecap="round"/>
<circle cx="52" cy="118" r="5" fill="#0078c8" stroke="white" stroke-width="2"/></svg>`;
const customIcon=typeof L!=='undefined'?L.divIcon({className:'domino-map-marker',html:markerSVG,iconSize:[104,128],iconAnchor:[52,118]}):null;
function addOption(el,value){el.add(new Option(value,value))}
const provinces=[...new Set(stores.map(s=>s.province))].sort((a,b)=>a.localeCompare(b,'ko'));
provinces.forEach(p=>addOption(province,p));
function refreshDistrict(){district.replaceChildren(new Option('구/군 선택',''));[...new Set(stores.filter(s=>!province.value||s.province===province.value).map(s=>s.district))].sort((a,b)=>a.localeCompare(b,'ko')).forEach(v=>addOption(district,v))}
function line(iconName,value){const el=document.createElement('span');el.className='store-info-line';const img=document.createElement('img');img.src=icon(iconName);img.alt='';el.append(img,document.createTextNode(value));return el}
let requestId=0;
async function lookupCoordinates(store){
 if(coordinateCache.has(store.address))return coordinateCache.get(store.address);
 const query=encodeURIComponent(store.address);
 const response=await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=kr&q='+query);
 if(!response.ok)throw Error('location');
 const data=await response.json();
 // 전체 도로명 주소 검색이 실패하면 건물번호를 제외한 주소로 한 번 더 조회합니다.
 let match=data[0];
 if(!match){
  const shortened=store.address.replace(/\\s+\\d+(?:-\\d+)?(?:\\s+.*)?$/,'').trim();
  if(shortened&&shortened!==store.address){
   const fallback=await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=kr&q='+encodeURIComponent(shortened));
   if(fallback.ok){const fallbackData=await fallback.json();match=fallbackData[0]}
  }
 }
 if(!match)return null;
 const coords=[Number(match.lat),Number(match.lon)];
 if(!coords.every(Number.isFinite))return null;
 coordinateCache.set(store.address,coords);
 return coords;
}
function buildStorePopup(store){
 const card=document.createElement('div');card.className='store-map-popup-card';
 const head=document.createElement('div');head.className='store-map-popup-head';
 const name=document.createElement('strong');name.className='store-map-popup-name';name.textContent=store.name;
 const services=document.createElement('span');services.className='store-services';
 [['delivery','delivery_scooter','배달 가능'],['pickup','food_pakage','포장 가능'],['dineIn','tableware','매장 내 식사 가능']].forEach(([key,file,label])=>{
  if(store[key]){const img=document.createElement('img');img.src=icon(file);img.alt=label;img.title=label;services.append(img)}
 });
 head.append(name,services);
 const info=document.createElement('div');info.className='store-info';
 info.append(line('map_marker',store.address),line('call',store.phone),line('clock','영업시간: 공식 매장찾기에서 확인'));
 card.append(head,info);return card;
}
function addStoreMarker(store,coords){
 if(!storeMap)return null;
 if(storeMarkers.has(store.address))return storeMarkers.get(store.address);
 const marker=L.marker(coords,{icon:customIcon,title:store.name}).addTo(storeMap);
 marker.bindPopup(buildStorePopup(store),{maxWidth:350,minWidth:250,autoPan:true,offset:[0,-90],className:'domino-store-popup'});
 storeMarkers.set(store.address,marker);
 return marker;
}
async function selectStore(store,button){
 results.querySelectorAll('.store-item').forEach(el=>{el.classList.remove('is-selected');el.setAttribute('aria-pressed','false')});
 button.classList.add('is-selected');button.setAttribute('aria-pressed','true');
 const id=++requestId;
 selectedStoreName=store.name;
 const query=encodeURIComponent(store.address);
 mapLink.href='https://www.openstreetmap.org/search?query='+query;
 mapLink.textContent=store.name+' 지도에서 찾기 ↗';
 map.title=store.name+' 주변 지도';
 try{
  const coords=await lookupCoordinates(store);
  if(id!==requestId)return;
  if(!coords){status.textContent=store.name+'의 지도 좌표를 찾지 못했습니다. 매장 주소를 확인해 주세요.';return;}
  const [lat,lon]=coords;
  activeMarker=addStoreMarker(store,coords);
  activeMarker?.openPopup();
  storeMap?.setView(coords,16,{animate:true});
  mapLink.href='https://www.openstreetmap.org/?mlat='+lat+'&mlon='+lon+'#map=16/'+lat+'/'+lon;
 }catch(error){if(id===requestId)status.textContent=store.name+'의 지도 위치를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';}
}
// 공개 지오코딩 서비스에 과도한 요청을 보내지 않도록 초기에는 서울 매장 일부만 순차 표시합니다.
async function showInitialStoreMarkers(){
 const initialStores=stores.filter(s=>s.province==='서울특별시').slice(0,5);
 for(const store of initialStores){
  try{
   const coords=await lookupCoordinates(store);
   if(coords)addStoreMarker(store,coords);
  }catch(error){/* 일부 매장 좌표를 찾지 못해도 다른 마커는 계속 표시 */}
  await new Promise(resolve=>setTimeout(resolve,1200));
 }
}
showInitialStoreMarkers();
function render(){
 const term=keyword.value.trim().toLocaleLowerCase('ko');
 const filtered=stores.filter(s=>(!province.value||s.province===province.value)&&(!district.value||s.district===district.value)&&(!term||[s.name,s.address].some(v=>v.toLocaleLowerCase('ko').includes(term))));
 results.replaceChildren();
 status.textContent=filtered.length+'개 매장 검색 결과 · 전국 일부 매장 데이터';
 if(!filtered.length){const p=document.createElement('p');p.className='store-empty';p.textContent='등록된 매장이 없습니다. 전체 매장 확인은 공식 매장찾기를 이용해 주세요.';results.append(p);return}
 filtered.forEach(s=>{
  const btn=document.createElement('button');btn.type='button';btn.className='store-item';btn.setAttribute('aria-pressed','false');
  const top=document.createElement('span');top.className='store-item-top';
  const name=document.createElement('strong');name.className='store-name';name.textContent=s.name;
  const services=document.createElement('span');services.className='store-services';
  [['delivery','delivery_scooter','배달 가능'],['pickup','food_pakage','포장 가능'],['dineIn','tableware','매장 내 식사 가능']].forEach(([key,file,label])=>{if(s[key]){const img=document.createElement('img');img.src=icon(file);img.alt=label;img.title=label;services.append(img)}});
  top.append(name,services);
  const info=document.createElement('span');info.className='store-info';
  info.append(line('map_marker',s.address),line('call',s.phone),line('clock','영업시간: 공식 매장찾기에서 확인'));
  btn.append(top,info);btn.addEventListener('click',()=>selectStore(s,btn));results.append(btn)
 })
}
document.getElementById('store-search-form').addEventListener('submit',e=>{e.preventDefault();render()});
keyword.addEventListener('input',render);
province.addEventListener('change',()=>{refreshDistrict();render()});
district.addEventListener('change',render);
refreshDistrict();render();

/* 커스텀 지역 선택 메뉴: 실제 열림 상태와 화살표 방향을 일치시킵니다. */
const regionDropdowns=[];
function closeRegionDropdowns(except=null){
 regionDropdowns.forEach(({wrapper,button,menu})=>{
  if(wrapper===except)return;
  wrapper.classList.remove('is-open');button.setAttribute('aria-expanded','false');menu.hidden=true;
 });
}
function setupRegionDropdown(select){
 const wrapper=select.closest('.store-select');
 const button=document.createElement('button');button.type='button';button.className='store-dropdown-trigger';
 button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');
 button.setAttribute('aria-label',select.id==='store-province'?'시/도 선택':'구/군 선택');
 const menu=document.createElement('div');menu.className='store-dropdown-menu';menu.setAttribute('role','listbox');menu.hidden=true;
 wrapper.append(button,menu);
 const instance={wrapper,button,menu,select};regionDropdowns.push(instance);
 function update(){
  button.textContent=select.selectedOptions[0]?.textContent||'선택';
  menu.replaceChildren();
  [...select.options].forEach(option=>{
   const item=document.createElement('button');item.type='button';item.className='store-dropdown-option';
   item.setAttribute('role','option');item.setAttribute('aria-selected',String(option.value===select.value));
   item.textContent=option.textContent;
   item.addEventListener('click',()=>{
    select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));
    closeRegionDropdowns();button.focus();
   });
   menu.append(item);
  });
 }
 button.addEventListener('click',()=>{
  // 같은 선택창을 다시 누르면 닫고, 다른 선택창을 누르면 기존 창을 닫은 뒤 엽니다.
  const wasOpen=!menu.hidden;
  closeRegionDropdowns();
  if(!wasOpen){
   update();
   menu.hidden=false;
   wrapper.classList.add('is-open');
   button.setAttribute('aria-expanded','true');
  }
 });
 button.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'||e.key==='Enter'||e.key===' '){if(menu.hidden){e.preventDefault();button.click()}}
 });
 menu.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeRegionDropdowns();button.focus()}
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const items=[...menu.querySelectorAll('button')];const index=items.indexOf(document.activeElement);items[(index+(e.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus()}
 });
 select.addEventListener('change',update);update();
 return instance;
}
setupRegionDropdown(province);setupRegionDropdown(district);
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.store-select'))closeRegionDropdowns()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeRegionDropdowns()});
