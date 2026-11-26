(()=>{'use strict';
const key='domino_demo_logged_in';
let loggedIn=false;try{loggedIn=sessionStorage.getItem(key)==='true'}catch(e){}
if(!loggedIn){location.replace('login.html');return}
const notice=document.getElementById('mypage-notice');
function message(value){notice.textContent=value;notice.scrollIntoView({block:'nearest',behavior:'smooth'})}
document.getElementById('mypage-logout').addEventListener('click',()=>{try{sessionStorage.removeItem(key)}catch(e){}location.href='login.html'});
document.querySelectorAll('[data-unavailable]').forEach(el=>el.addEventListener('click',()=>message(el.dataset.unavailable+' 기능은 현재 체험용 사이트에서 제공되지 않습니다.')));
const coupon=document.getElementById('mypage-coupon'),C=window.DominoCoupons;function couponState(){if(C.read().some(c=>c.id==='member20')){coupon.textContent='쿠폰함 확인 ↗';coupon.onclick=()=>location.href='mycoupon.html'}else coupon.onclick=()=>{if(C.issue('member20'))message('시연용 쿠폰이 발급되었습니다. 쿠폰함에서 확인해 주세요.');couponState()}}couponState();
})();