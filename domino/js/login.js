(()=>{'use strict';
const form=document.getElementById('demo-login-form');if(!form)return;
const id=document.getElementById('login-id'),password=document.getElementById('login-password'),feedback=document.getElementById('login-feedback');
const remember=document.getElementById('remember-id'),tabs=[document.getElementById('member-login-tab'),document.getElementById('guest-login-tab')],panels=[document.getElementById('member-login-panel'),document.getElementById('guest-login-panel')];
const key='domino_demo_logged_in',rememberKey='domino_demo_remembered_id';
// Logged-in visitors arriving from any page should go straight to My Page.
if(sessionStorage.getItem(key)==='true'){location.replace('mypage.html');return;}

try{const saved=localStorage.getItem(rememberKey);if(saved){id.value=saved;remember.checked=true}}catch(e){}
const tabBar=document.querySelector('.login-tabs'),indicator=tabBar.querySelector('.login-tab-indicator');
function positionIndicator(){const active=tabs.find(tab=>tab.classList.contains('is-active'));if(!active||!indicator)return;indicator.style.width=active.offsetWidth+'px';indicator.style.transform='translateX('+active.offsetLeft+'px)'}
function setTab(index){tabs.forEach((tab,i)=>{tab.classList.toggle('is-active',i===index);tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index});positionIndicator()}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>setTab(i));tab.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=1-i;setTab(next);tabs[next].focus()}})});
document.getElementById('back-to-member').addEventListener('click',()=>setTab(0));
form.addEventListener('submit',event=>{event.preventDefault();if(id.value.trim()==='demo'&&password.value==='1234'){try{if(remember.checked)localStorage.setItem(rememberKey,id.value.trim());else localStorage.removeItem(rememberKey)}catch(e){}sessionStorage.setItem(key,'true');feedback.textContent='';password.value='';location.href='mypage.html'}else{feedback.textContent='아이디 또는 비밀번호가 올바르지 않습니다.'}});
document.querySelectorAll('[data-demo-info]').forEach(button=>button.addEventListener('click',()=>{feedback.textContent=button.dataset.demoInfo+' 기능은 체험용 사이트에서 제공되지 않습니다.'}));
setTab(0);
window.addEventListener('resize',positionIndicator);
})();