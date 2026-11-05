document.addEventListener('DOMContentLoaded',()=>{
 const events=[...document.querySelectorAll('.history-event')];
 const brandBar=document.querySelector('.history-intro .brand-tabs');
 if(brandBar){const active=brandBar.querySelector('.brand-tab.is-active'),indicator=brandBar.querySelector('.menu-tab-indicator');const place=()=>{if(active&&indicator){indicator.style.width=active.offsetWidth+'px';indicator.style.transform='translateX('+active.offsetLeft+'px)'}};place();window.addEventListener('resize',place);if(document.fonts)document.fonts.ready.then(place);}

 // SVG ribbon: scalable silhouette, naturally varying width and unscaled repeating ink.
 const sauce=document.querySelector('.history-sauce');
 const stage=document.querySelector('.history-stage');
 const ribbon=sauce?.querySelector('.history-sauce-ribbon');
 let sauceTrigger;
 function layoutSauce(){
   if(!stage||!sauce||!ribbon)return;
   const w=stage.clientWidth,h=stage.scrollHeight;
   sauce.setAttribute('viewBox',`0 0 ${w} ${h}`);
   const mobile=w<520;
   const swing=mobile?w*.26:Math.min(w*.29,370);
   const anchors=[[0,.5],[.17,.5-swing/w*.9],[.39,.5+swing/w],[.65,.5-swing/w*.76],[.87,.5+swing/w*.86],[1,.5]].map(([t,x])=>({x:x*w,y:t*h}));
   const centerAt=t=>{
     let k=0;
     while(k<anchors.length-2&&t>anchors[k+1].y/h)k++;
     const p0=anchors[Math.max(0,k-1)],p1=anchors[k],p2=anchors[k+1],p3=anchors[Math.min(anchors.length-1,k+2)];
     const u=(t*h-p1.y)/(p2.y-p1.y);
     const hermite=(a,b,c,d)=>.5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u*u+(-a+3*b-3*c+d)*u*u*u);
     return {x:hermite(p0.x,p1.x,p2.x,p3.x),y:t*h};
   };
   const samples=[];
   for(let i=0;i<=360;i++){
     const t=i/360,p=centerAt(t),prev=centerAt(Math.max(0,t-.002)),next=centerAt(Math.min(1,t+.002));
     const dx=next.x-prev.x,dy=next.y-prev.y,len=Math.hypot(dx,dy)||1;
     const taper=Math.min(1,t/.035,(1-t)/.045);
     const width=(mobile?9:16)+(mobile?4:8)*Math.sin(5*Math.PI*t+.4)+(mobile?2:5)*Math.sin(13*Math.PI*t);
     const radius=Math.max(0,width*taper);
     samples.push({x:p.x,y:p.y,nx:dy/len,ny:-dx/len,radius});
   }
   const edge=side=>samples.map(p=>`${(p.x+side*p.nx*p.radius).toFixed(2)},${(p.y+side*p.ny*p.radius).toFixed(2)}`);
   const outline=edge(1).concat(edge(-1).reverse());
   ribbon.setAttribute('d','M '+outline.join(' L ')+' Z');
   const gap=mobile?16:40;
   const stageRect=stage.getBoundingClientRect();
   events.forEach(event=>{
     const rect=event.getBoundingClientRect();
     const t=Math.max(0,Math.min(1,(rect.top-stageRect.top+rect.height*.5)/h));
     const point=samples[Math.round(t*360)];
     const leftEdge=point.x-point.radius,rightEdge=point.x+point.radius;
     const itemWidth=event.offsetWidth;
     const leftRoom=leftEdge-gap,rightRoom=w-rightEdge-gap;
     const placeLeft=leftRoom>=rightRoom;
     let x=placeLeft?leftEdge-gap-itemWidth:rightEdge+gap;
     x=Math.max(0,Math.min(w-itemWidth,x));
     event.style.setProperty('--event-x',x+'px');
     event.style.setProperty('--event-align',placeLeft?'right':'left');
   });
 }
 if(stage&&sauce&&ribbon){
   layoutSauce();
   const show=progress=>{sauce.style.clipPath=`inset(0 0 ${(1-progress)*100}% 0)`};
   if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&window.gsap&&window.ScrollTrigger){
     gsap.registerPlugin(ScrollTrigger);
     sauceTrigger=ScrollTrigger.create({trigger:stage,start:'top 75%',end:'bottom 70%',scrub:true,onUpdate:self=>show(self.progress)});
   }else show(1);
   const relayout=()=>{layoutSauce();if(sauceTrigger)sauceTrigger.refresh()};
   window.addEventListener('resize',relayout);
   window.addEventListener('load',relayout);
   if(document.fonts)document.fonts.ready.then(relayout);
 }
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
