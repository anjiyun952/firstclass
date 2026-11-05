document.addEventListener('DOMContentLoaded',()=>{
 const events=[...document.querySelectorAll('.history-event')];
 const brandBar=document.querySelector('.history-intro .brand-tabs');
 if(brandBar){const active=brandBar.querySelector('.brand-tab.is-active'),indicator=brandBar.querySelector('.menu-tab-indicator');const place=()=>{if(active&&indicator){indicator.style.width=active.offsetWidth+'px';indicator.style.transform='translateX('+active.offsetLeft+'px)'}};place();window.addEventListener('resize',place);if(document.fonts)document.fonts.ready.then(place);}

 // Draw one continuous, curved sauce line in the empty corridor between events.
 const sauce=document.querySelector('.history-sauce');
 const stage=document.querySelector('.history-stage');
 let sauceTrigger;
 function drawSauce(){
   if(!sauce||!stage||events.length<2)return;
   const box=stage.getBoundingClientRect();
   const width=stage.clientWidth,height=stage.scrollHeight;
   sauce.setAttribute('viewBox',`0 0 ${width} ${height}`);
   const narrow=window.matchMedia('(max-width:480px)').matches;
   const points=events.map((event,i)=>{
     const r=event.getBoundingClientRect();
     return {y:r.top-box.top+r.height*.5};
   });
   // Wide, alternating S-turns, with slight variation so the sauce feels hand-pulled.
   const center=width*.5;
   const amplitude=narrow?width*.22:Math.min(width*.32,410);
   const minX=narrow?width*.16:width*.12,maxX=width-minX;
   const xAt=i=>Math.max(minX,Math.min(maxX,center+(i%2===0?-1:1)*amplitude*(i%3===0?.83:1)));
   let d=`M ${center} ${Math.max(0,points[0].y-85)}`;
   for(let i=0;i<points.length;i++){
     const prevY=i===0?Math.max(0,points[0].y-85):points[i-1].y;
     const y=points[i].y,dy=y-prevY;
     const prevX=i===0?center:xAt(i-1),x=xAt(i);
     d+=` C ${prevX} ${prevY+dy*.72}, ${x} ${y-dy*.72}, ${x} ${y}`;
   }
   const last=points[points.length-1];
   d+=` C ${xAt(points.length-1)} ${last.y+45}, ${center} ${Math.min(height,last.y+65)}, ${center} ${Math.min(height,last.y+90)}`;
   sauce.querySelectorAll('path').forEach(path=>path.setAttribute('d',d));
   const ink=sauce.querySelector('.history-sauce-line');
   const shadow=sauce.querySelector('.history-sauce-shadow');
   const grain=sauce.querySelector('.history-sauce-grain');
   const highlight=sauce.querySelector('.history-sauce-highlight');
   const length=ink.getTotalLength();
   [ink,shadow].forEach(path=>{path.style.strokeDasharray=length;path.style.strokeDashoffset=length});
   [grain,highlight].forEach(path=>{path.style.strokeDasharray=length;path.style.strokeDashoffset=length});
   if(sauceTrigger){sauceTrigger.kill();sauceTrigger=null}
   const showProgress=progress=>{
     const offset=length*(1-progress);
     ink.style.strokeDashoffset=offset;
     shadow.style.strokeDashoffset=offset;
     [grain,highlight].forEach(path=>{path.style.strokeDashoffset=offset});
   };
   if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&window.gsap&&window.ScrollTrigger){
     showProgress(0);
     sauceTrigger=ScrollTrigger.create({trigger:stage,start:'top 75%',end:'bottom 70%',scrub:true,onUpdate:self=>showProgress(self.progress)});
   }else{showProgress(1)}
 }
 const redraw=()=>{drawSauce();if(window.ScrollTrigger)ScrollTrigger.refresh()};
 window.addEventListener('load',redraw);
 window.addEventListener('resize',redraw);
 if(document.fonts)document.fonts.ready.then(redraw);
 drawSauce();
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
 }
});
