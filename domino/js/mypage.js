(()=>{'use strict';
const key='domino_demo_logged_in';
let loggedIn=false;try{loggedIn=sessionStorage.getItem(key)==='true'}catch(e){}
if(!loggedIn){location.replace('login.html');return}
const notice=document.getElementById('mypage-notice');
function message(value){notice.textContent=value;notice.scrollIntoView({block:'nearest',behavior:'smooth'})}
document.getElementById('mypage-logout').addEventListener('click',()=>{try{sessionStorage.removeItem(key)}catch(e){}location.href='login.html'});
document.querySelectorAll('[data-unavailable]').forEach(el=>el.addEventListener('click',()=>message(el.dataset.unavailable+' 기능은 현재 체험용 사이트에서 제공되지 않습니다.')));
document.getElementById('mypage-coupon').addEventListener('click',()=>message('실제 쿠폰 발급은 지원되지 않습니다. 안내된 혜택은 공식 사이트에서 확인해 주세요.'));
})();