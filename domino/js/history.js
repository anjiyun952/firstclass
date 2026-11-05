/* The PNG contains 31 uneven boxes. The first pass uses 15 normalized anchors.
   After visual inspection, set pixel-accurate percentage centers in ANCHORS below. */
const ANCHORS = [3.3333,10,16.6667,23.3333,30,36.6667,43.3333,50,56.6667,63.3333,70,76.6667,83.3333,90,96.6667];
document.addEventListener('DOMContentLoaded',()=>{
 const stage=document.querySelector('.history-stage'),tower=document.querySelector('.history-boxes'),events=[...document.querySelectorAll('.history-event')];
 const layout=()=>{if(!tower.naturalWidth)return;const h=tower.getBoundingClientRect().height;stage.style.height=h+'px';events.forEach((el,i)=>el.style.top=ANCHORS[i]+'%')};
 tower.addEventListener('load',layout);window.addEventListener('resize',layout);if(tower.complete)layout();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 events.forEach((event,i)=>{
   const holder=event.querySelector('.flour-particles');
   if(!reduced){const count=event.classList.contains('is-featured')?30:20;for(let j=0;j<count;j++){const dot=document.createElement('i');dot.className='flour-particle';const seed=(j*37+i*19)%101;dot.style.setProperty('--x',(seed%90+5)+'%');dot.style.setProperty('--y',((j*23+i*11)%90+5)+'%');dot.style.setProperty('--size',(1+(j%4))+'px');dot.style.setProperty('--blur',(j%5===0?1:0)+'px');holder.append(dot)}}
 });
 if(!reduced&&window.gsap&&window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  events.forEach(event=>{
    const copy=event.querySelector('.history-copy'),art=event.querySelector('.history-art'),dots=[...event.querySelectorAll('.flour-particle')];
    gsap.set(copy,{autoAlpha:0,y:18});
    if(art)gsap.set(art,{scale:1.07,transformOrigin:'center center'});
    const tl=gsap.timeline({paused:true}).to(copy,{autoAlpha:1,y:0,duration:.85,ease:'power2.out'},.15);
    dots.forEach((dot,j)=>{const angle=(j*2.39996),distance=20+(j%8)*8;tl.fromTo(dot,{x:0,y:0,opacity:0},{keyframes:[{opacity:.6,duration:.2},{x:Math.cos(angle)*distance,y:Math.sin(angle)*distance,opacity:0,duration:.65}],ease:'power1.out'},(j%7)*.025)});
    if(art)tl.to(art,{scale:1,duration:.65,ease:'power2.out'},.4);
    ScrollTrigger.create({trigger:event,start:'top 78%',once:true,onEnter:()=>tl.play()});
  });
 }else if(!reduced){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.1});events.forEach(e=>observer.observe(e));
 }
});
