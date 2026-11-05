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
   // Four broad, uneven bends across the full timeline (not one turn per event).
   // Use a single smooth path so the shape remains continuous on resize.
   const center=width*.5;
   const swing=narrow?width*.29:Math.min(width*.30,385);
   const top=Math.max(0,points[0].y-85);
   const bottom=Math.min(height,points[points.length-1].y+90);
   const span=bottom-top;
   const anchors=[
     [0,center],
     [.17,center-swing*.90],
     [.39,center+swing],
     [.65,center-swing*.76],
     [.87,center+swing*.86],
     [1,center]
   ].map(([t,x])=>({x,y:top+span*t}));
   // Catmull–Rom to cubic Bézier: gently rounded, varied-length sweeping turns.
   let d=`M ${anchors[0].x} ${anchors[0].y}`;
   for(let i=0;i<anchors.length-1;i++){
     const p0=anchors[Math.max(0,i-1)];
     const p1=anchors[i];
     const p2=anchors[i+1];
     const p3=anchors[Math.min(anchors.length-1,i+2)];
     const c1x=p1.x+(p2.x-p0.x)/6;
     const c1y=p1.y+(p2.y-p0.y)/6;
     const c2x=p2.x-(p3.x-p1.x)/6;
     const c2y=p2.y-(p3.y-p1.y)/6;
     d+=` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
   }
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
