/* Random news reveal: 0.5s in, 3s visible, 0.5s out, 0.5s pause. */
(() => {
 const section=document.querySelector('.domino-news-sec');
 if(!section)return;
 const cards=Array.from(section.querySelectorAll('.domino-news-card[data-news]'));
 if(!cards.length)return;
 let previous=-1;
 let timer;
 let active=-1;
 function next(){
  const choices=cards.map((_,index)=>index).filter(index=>index!==previous);
  const index=choices[Math.floor(Math.random()*choices.length)];
  previous=index;
  active=index;
  cards[index].classList.add('is-auto');
  timer=window.setTimeout(()=>{
   cards[index].classList.remove('is-auto');
   active=-1;
   timer=window.setTimeout(next,1000); // 0.5s fade-out + 0.5s rest
  },3500); // 0.5s fade-in + 3s hold
 }
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 next();
 window.addEventListener('pagehide',()=>window.clearTimeout(timer),{once:true});
})();
