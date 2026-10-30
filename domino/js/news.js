/* Random news reveal: 0.5s fade in, 3s hold, then crossfade to the next card. */
(() => {
 const section=document.querySelector('.domino-news-sec');
 if(!section)return;
 const cards=Array.from(section.querySelectorAll('.domino-news-card[data-news]'));
 if(!cards.length)return;
 let previous=-1;
 let timer;
 function next(){
  const choices=cards.map((_,index)=>index).filter(index=>index!==previous);
  const index=choices[Math.floor(Math.random()*choices.length)];
  previous=index;
  cards.forEach((card,i)=>card.classList.toggle('is-auto',i===index));
  // When the current image begins fading out, the next begins fading in.
  timer=window.setTimeout(next,3500);
 }
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 next();
 window.addEventListener('pagehide',()=>window.clearTimeout(timer),{once:true});
})();
