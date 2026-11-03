// Figma STORE 프레임에 기재된 매장 정보만 수록. 최신 정보는 방문 전 확인 필요.
const stores=[
{name:"강서구청점",province:"서울특별시",district:"강서구",address:"서울특별시 강서구 까치산로 189-1",phone:"02-2606-3082",hours:"11:00 ~ 21:30",delivery:true,pickup:true,dineIn:false},
{name:"등촌가양점",province:"서울특별시",district:"강서구",address:"서울특별시 강서구 강서로 447",phone:"02-3663-1747",hours:"11:30 ~ 22:30",delivery:true,pickup:true,dineIn:false},
{name:"발산점",province:"서울특별시",district:"강서구",address:"서울특별시 강서구 강서로 211 1층",phone:"02-2661-3085",hours:"11:30 ~ 21:30",delivery:true,pickup:false,dineIn:true},
{name:"방화점",province:"서울특별시",district:"강서구",address:"서울특별시 강서구 금낭화로 69",phone:"02-2666-9127",hours:"11:30 ~ 22:00",delivery:true,pickup:true,dineIn:false},
{name:"염창점",province:"서울특별시",district:"강서구",address:"서울특별시 강서구 양천로 683 1층",phone:"02-2658-3254",hours:"11:00 ~ 21:30",delivery:true,pickup:true,dineIn:true},
{name:"화곡점",province:"서울특별시",district:"강서구",address:"서울특별시 강서구 곰달래로 66",phone:"02-2694-3082",hours:"11:30 ~ 21:00",delivery:true,pickup:true,dineIn:true}
];
const keyword=document.getElementById('store-keyword'),province=document.getElementById('store-province'),district=document.getElementById('store-district'),results=document.getElementById('store-results'),status=document.getElementById('store-status'),map=document.getElementById('store-map-frame'),mapLink=document.getElementById('store-map-link');
const icon=(file)=>'images/'+file+'_icon.svg';
function addOption(select,value){const option=document.createElement('option');option.value=value;option.textContent=value;select.append(option)}
function refreshDistrict(){district.replaceChildren(new Option('구/군 선택',''));[...new Set(stores.filter(s=>!province.value||s.province===province.value).map(s=>s.district))].sort().forEach(v=>addOption(district,v))}
[...new Set(stores.map(s=>s.province))].sort().forEach(v=>addOption(province,v));refreshDistrict();
function line(file,value){const row=document.createElement('span');row.className='store-info-line';const img=document.createElement('img');img.src=icon(file);img.alt='';row.append(img,document.createTextNode(value));return row}
function selectStore(store,button){results.querySelectorAll('.store-item').forEach(el=>{el.classList.remove('is-selected');el.setAttribute('aria-pressed','false')});button.classList.add('is-selected');button.setAttribute('aria-pressed','true');const query=encodeURIComponent(store.address);mapLink.href='https://www.openstreetmap.org/search?query='+query;mapLink.textContent=store.name+' 지도에서 찾기 ↗';map.title=store.name+' 주변 지도';}
function render(){const term=keyword.value.trim().toLocaleLowerCase('ko');const filtered=stores.filter(s=>(!province.value||s.province===province.value)&&(!district.value||s.district===district.value)&&(!term||[s.name,s.address,s.province,s.district].some(v=>v.toLocaleLowerCase('ko').includes(term))));results.replaceChildren();status.textContent=filtered.length+'개 매장 검색 결과';if(!filtered.length){const empty=document.createElement('p');empty.className='store-empty';empty.textContent='검색 조건에 맞는 등록 매장이 없습니다.';results.append(empty);return}
filtered.forEach(s=>{const btn=document.createElement('button');btn.type='button';btn.className='store-item';btn.setAttribute('aria-pressed','false');const top=document.createElement('span');top.className='store-item-top';const name=document.createElement('strong');name.className='store-name';name.textContent=s.name;const services=document.createElement('span');services.className='store-services';[['delivery','delivery_scooter','배달 가능'],['pickup','food_pakage','포장 가능'],['dineIn','tableware','매장 내 식사 가능']].forEach(([key,file,label])=>{if(s[key]){const img=document.createElement('img');img.src=icon(file);img.alt=label;img.title=label;services.append(img)}});top.append(name,services);const info=document.createElement('span');info.className='store-info';info.append(line('map_marker',s.address),line('call',s.phone),line('clock',s.hours));btn.append(top,info);btn.addEventListener('click',()=>locateStore(s,btn));results.append(btn)})}
document.getElementById('store-search-form').addEventListener('submit',e=>{e.preventDefault();render()});keyword.addEventListener('input',render);province.addEventListener('change',()=>{refreshDistrict();render()});district.addEventListener('change',render);render();

/* 선택한 매장의 위치를 실제 지도에 표시. 주소 좌표는 공개 지오코딩 서비스로 확인합니다. */
let locationRequest=0;
async function locateStore(store,button){
 selectStore(store,button);
 const id=++locationRequest;
 try{
  const url='https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=kr&q='+encodeURIComponent(store.address);
  const response=await fetch(url);
  if(!response.ok)throw new Error('geocode');
  const places=await response.json();
  if(id!==locationRequest||!places.length)return;
  const lat=Number(places[0].lat),lon=Number(places[0].lon),d=.008;
  map.src='https://www.openstreetmap.org/export/embed.html?bbox='+[lon-d,lat-d,lon+d,lat+d].join('%2C')+'&layer=mapnik&marker='+lat+'%2C'+lon;
  mapLink.href='https://www.openstreetmap.org/?mlat='+lat+'&mlon='+lon+'#map=16/'+lat+'/'+lon;
 }catch(e){status.textContent='지도 위치 조회가 일시적으로 불가능합니다.'}
}
