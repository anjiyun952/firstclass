// 도미노피자 공식 공개 매장 목록에서 확인한 정적 샘플 데이터 (전국 17개 시·도, 60개).
// 전체 매장 목록이 아니며 자동 연동하지 않습니다. 최신 주소/전화번호는 공식 매장찾기에서 확인하세요.
// 출처: https://web.dominos.co.kr/branch.html
const rawStores="오금점|서울특별시 송파구 중대로 314-1|02-449-3030\n잠원점|서울특별시 서초구 나루터로 61|02-533-7878\n여의도점|서울특별시 영등포구 국제금융로 78|02-780-2020\n강서구청점|서울특별시 강서구 까치산로 189-1|02-2606-3082\n방화점|서울특별시 강서구 금낭화로 69|02-2666-9127\n발산점|서울특별시 강서구 강서로 337|02-2661-3083\n목동점|서울특별시 양천구 목동중앙로 85|02-2642-0354\n잠실본점|서울특별시 송파구 백제고분로 184|02-415-3607\n마포점|서울특별시 마포구 백범로 123|02-717-3082\n부평점|인천광역시 부평구 부평대로 114|032-519-2307\n연수점|인천광역시 연수구 용담로 93|032-818-0030\n계양점|인천광역시 계양구 주부토로 463|032-549-3030\n과천점|경기도 과천시 새술막길 14|02-504-1302\n서현점|경기도 성남시 분당구 서현로 377|031-702-3005\n평촌점|경기도 안양시 동안구 귀인로 198|031-382-7474\n광교점|경기도 수원시 영통구 센트럴타운로 92|031-217-3083\n김포구래점|경기도 김포시 김포한강9로12번길 97-10|031-996-3025\n동탄점|경기도 화성시 동탄지성로 84|031-8003-3324\n원주점|강원특별자치도 원주시 천사로 155-1|033-744-3030\n춘천후평점|강원특별자치도 춘천시 춘천로 247|033-241-3082\n속초점|강원특별자치도 속초시 온천로 287|033-637-3088\n강릉점|강원특별자치도 강릉시 성덕포남로 169|033-643-3082\n천안쌍용점|충청남도 천안시 서북구 불당5길 19|041-578-3084\n아산온양점|충청남도 아산시 온천대로 1385|041-541-3082\n공주점|충청남도 공주시 신관로 31|041-853-3081\n청주충북대점|충청북도 청주시 서원구 1순환로 684|043-262-3082\n충주점|충청북도 충주시 갱고개로 175-1|043-854-3082\n제천점|충청북도 제천시 용두천로 140|043-652-3082\n대전월평점|대전광역시 서구 월평로 69|042-482-3033\n둔산점|대전광역시 서구 문정로 170|042-487-3082\n유성점|대전광역시 유성구 어은로 44|042-861-3083\n진주교대점|경상남도 진주시 진양호로 392|055-746-3042\n창원상남점|경상남도 창원시 성산구 마디미동로 58|055-284-3082\n김해어방점|경상남도 김해시 인제로 146|055-329-3042\n포항우창점|경상북도 포항시 북구 새천년대로 1063|054-254-3082\n안동점|경상북도 안동시 경동로 638|054-854-3082\n경주성건점|경상북도 경주시 금성로395번길 3|054-748-3082\n대구대봉점|대구광역시 중구 동덕로 86|053-423-3082\n대구화원점|대구광역시 달성군 화원읍 명천로 255|053-644-3082\n순천조례점|전라남도 순천시 이수로 284|061-721-3084\n목포하당점|전라남도 목포시 원형로 44-1|061-283-3082\n여수문수점|전라남도 여수시 문수로 76|061-654-1188\n전주금암점|전북특별자치도 전주시 덕진구 백제대로 658|063-273-3083\n군산점|전북특별자치도 군산시 백토로 142|063-471-3330\n익산영등점|전북특별자치도 익산시 고봉로 18길 1|063-854-3082\n광주금호점|광주광역시 서구 운천로 94-1|062-383-3082\n광주동구점|광주광역시 동구 중앙로 214|062-233-3082\n광주첨단점|광주광역시 광산구 월계로 217|062-974-3082\n울산달동점|울산광역시 남구 번영로 98|052-261-3084\n울산병영점|울산광역시 중구 평산1길 2|052-286-3082\n울산무거점|울산광역시 남구 삼호로 3|052-223-3082\n대연점|부산광역시 남구 수영로 256|051-625-3082\n해운대점|부산광역시 해운대구 해운대로 793|051-703-3082\n서면점|부산광역시 부산진구 전포대로 195|051-818-3082\n동래점|부산광역시 동래구 아시아드대로 203|051-506-3082\n제주시청점|제주특별자치도 제주시 동광로 9|064-751-3082\n제주노형점|제주특별자치도 제주시 연북로 18|064-742-3082\n제주서귀포점|제주특별자치도 서귀포시 신서귀로 118|064-739-3083\n조치원점|세종특별자치시 조치원읍 문화길 39|044-865-3082\n세종아름점|세종특별자치시 보듬3로 91|044-864-3082";
const stores=rawStores.split('\n').map(line=>{const [name,address,phone]=line.split('|');const parts=address.split(' ');return {name,province:parts[0],district:parts[1],address,phone,hours:'',delivery:null,pickup:null,dineIn:null}});
const keyword=document.getElementById('store-keyword');
const province=document.getElementById('store-province');
const district=document.getElementById('store-district');
const results=document.getElementById('store-results');
const status=document.getElementById('store-status');
const map=document.getElementById('store-map-frame');
const mapLink=document.getElementById('store-map-link');
const icon=file=>'images/'+file+'_icon.svg';
function addOption(el,value){el.add(new Option(value,value))}
const provinces=[...new Set(stores.map(s=>s.province))].sort((a,b)=>a.localeCompare(b,'ko'));
provinces.forEach(p=>addOption(province,p));
function refreshDistrict(){district.replaceChildren(new Option('구/군 선택',''));[...new Set(stores.filter(s=>!province.value||s.province===province.value).map(s=>s.district))].sort((a,b)=>a.localeCompare(b,'ko')).forEach(v=>addOption(district,v))}
function line(iconName,value){const el=document.createElement('span');el.className='store-info-line';const img=document.createElement('img');img.src=icon(iconName);img.alt='';el.append(img,document.createTextNode(value));return el}
let requestId=0;
async function selectStore(store,button){
 results.querySelectorAll('.store-item').forEach(el=>{el.classList.remove('is-selected');el.setAttribute('aria-pressed','false')});
 button.classList.add('is-selected');button.setAttribute('aria-pressed','true');
 const id=++requestId;
 const query=encodeURIComponent(store.address);
 mapLink.href='https://www.openstreetmap.org/search?query='+query;
 mapLink.textContent=store.name+' 지도에서 찾기 ↗';
 map.title=store.name+' 주변 지도';
 try{
  const response=await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=kr&q='+query);
  if(!response.ok)throw Error('location');
  const data=await response.json();
  if(id!==requestId||!data.length)return;
  const lat=Number(data[0].lat),lon=Number(data[0].lon),d=.009;
  map.src='https://www.openstreetmap.org/export/embed.html?bbox='+[lon-d,lat-d,lon+d,lat+d].join('%2C')+'&layer=mapnik&marker='+lat+'%2C'+lon;
  mapLink.href='https://www.openstreetmap.org/?mlat='+lat+'&mlon='+lon+'#map=16/'+lat+'/'+lon;
 }catch(error){/* 지도 조회 실패 시 공식 주소 검색 링크는 유지 */}
}
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
  top.append(name);
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
