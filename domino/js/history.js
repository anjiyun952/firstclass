document.addEventListener('DOMContentLoaded',()=>{
 const events=[...document.querySelectorAll('.history-event')];
 const brandBar=document.querySelector('.history-intro .brand-tabs');
 if(brandBar){
   const tabs=[...brandBar.querySelectorAll('[role="tab"]')];
   const indicator=brandBar.querySelector('.menu-tab-indicator');
   const place=()=>{
     const active=brandBar.querySelector('.brand-tab.is-active');
     if(active&&indicator){indicator.style.width=active.offsetWidth+'px';indicator.style.transform='translateX('+active.offsetLeft+'px)'}
   };
   const activate=tab=>{
     tabs.forEach(t=>{
       const selected=t===tab;
       t.classList.toggle('is-active',selected);
       t.setAttribute('aria-selected',String(selected));
       t.tabIndex=selected?0:-1;
       document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;
     });
     requestAnimationFrame(()=>{
       place();
       if(window.ScrollTrigger)window.ScrollTrigger.refresh();
     });
   };
   tabs.forEach((tab,i)=>{
     tab.addEventListener('click',()=>activate(tab));
     tab.addEventListener('keydown',e=>{
       let next=i;
       if(e.key==='ArrowRight')next=(i+1)%tabs.length;
       else if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;
       else if(e.key==='Home')next=0;
       else if(e.key==='End')next=tabs.length-1;
       else return;
       e.preventDefault();tabs[next].focus();activate(tabs[next]);
     });
   });
   const requested=new URLSearchParams(location.search).get('category');
   const target=tabs.find(t=>t.textContent.trim()===requested);
   if(target)activate(target);
   place();window.addEventListener('resize',place);
   if(document.fonts)document.fonts.ready.then(place);
 }

 // Keep the retouched transparent PNG at its natural aspect ratio.
 const sauce=document.querySelector('.history-sauce');
 const stage=document.querySelector('.history-stage');
 let sauceTrigger;
 const eventAnimations=[];
 // On mobile, preserve a desktop-sized timeline and scale it as a single layout.
 const desktopTimelineWidth=1100;
 const setTimelineScale=()=>{
   if(!stage)return;
   const mobile=window.innerWidth<=767;
   stage.style.zoom=mobile?String(Math.min(1,Math.max(0.1,(stage.parentElement.clientWidth)/desktopTimelineWidth))):'';
 };
 setTimelineScale();
 const syncEvents=progress=>{
   if(!stage)return;
   const revealY=progress*stage.clientHeight;
   eventAnimations.forEach(({event,tl})=>{
     const eventY=event.offsetTop+Math.min(event.offsetHeight*.35,65);
     if(revealY>=eventY && !tl.isActive() && tl.progress()===0)tl.play();
   });
 };
 function layoutSauce(){
   if(!stage||!sauce||!sauce.naturalWidth||!sauce.naturalHeight)return;
   setTimelineScale();
   const w=stage.clientWidth;
   const layoutZoom=parseFloat(stage.style.zoom)||1;
   const minGap=w<520?42:72;
   const paddingY=w<520?36:72;
   const totalCards=events.reduce((sum,event)=>sum+event.offsetHeight,0);
   const targetHeight=totalCards+Math.max(0,events.length-1)*minGap+paddingY;
   // Recalculate from content rather than preserving a stale inline height.
   const h=targetHeight;
   stage.style.height=h+'px';
   const iw=sauce.naturalWidth,ih=sauce.naturalHeight;
   // Match the image's actual rendered box and object-fit:contain dimensions.
   const stageRect=stage.getBoundingClientRect();
   const imageRect=sauce.getBoundingClientRect();
   const scale=Math.min(imageRect.width/layoutZoom/iw,imageRect.height/layoutZoom/ih);
   const paintedWidth=iw*scale,paintedHeight=ih*scale;
   const offsetX=(imageRect.left-stageRect.left)/layoutZoom+(imageRect.width/layoutZoom-paintedWidth)/2;
   const offsetY=(imageRect.top-stageRect.top)/layoutZoom+(imageRect.height/layoutZoom-paintedHeight)/2;
   const preferredGap=w<520?18:80;
   const canvas=document.createElement('canvas');
   canvas.width=iw;canvas.height=ih;
   const ctx=canvas.getContext('2d',{willReadFrequently:true});
   if(!ctx)return;
   ctx.drawImage(sauce,0,0);
   let pixels;
   try{pixels=ctx.getImageData(0,0,iw,ih).data}catch(e){return}
   const boundsAt=y=>{
     const iy=Math.round((y-offsetY)/scale);
     if(iy<0||iy>=ih)return null;
     let left=iw,right=-1;
     for(let yy=Math.max(0,iy-4);yy<=Math.min(ih-1,iy+4);yy++){
       for(let x=0;x<iw;x+=2){
         if(pixels[(yy*iw+x)*4+3]>35){left=Math.min(left,x);right=Math.max(right,x)}
       }
     }
     return right<0?null:[offsetX+left*scale,offsetX+right*scale];
   };
   // Use the original event order and natural heights to build a non-overlapping
   // vertical timeline; then place each card beside the full sauce silhouette.
   const minVerticalGap=w<520?42:72;
   const topInset=w<520?18:36;
   const bottomInset=w<520?18:36;
   const totalHeight=events.reduce((sum,event)=>sum+event.offsetHeight,0)
     +minVerticalGap*(events.length-1)+topInset+bottomInset;
   const naturalHeights=events.map(event=>event.offsetHeight);
   const availableExtra=Math.max(0,h-totalHeight);
   const extraGap=events.length>1?availableExtra/(events.length-1):0;
   let y=topInset;
   events.forEach((event,i)=>{
     const cardHeight=naturalHeights[i];
     const leftCandidates=[],rightCandidates=[];
     for(let py=y;py<=y+cardHeight;py+=Math.max(5,cardHeight/24)){
       const bounds=boundsAt(py);
       if(bounds){leftCandidates.push(bounds[0]);rightCandidates.push(bounds[1]);}
     }
     const left=leftCandidates.length?Math.min(...leftCandidates):w/2;
     const right=rightCandidates.length?Math.max(...rightCandidates):w/2;
     const leftSpace=Math.max(0,left),rightSpace=Math.max(0,w-right);
     const placeLeft=leftSpace>=rightSpace;
     const space=placeLeft?leftSpace:rightSpace;
     const idealWidth=Math.min(w<520?w*.38:w*.30,360);
     const gap=Math.min(preferredGap,Math.max(12,space*.2));
     const cardWidth=Math.max(0,Math.min(idealWidth,space-gap));
     const x=placeLeft?left-gap-cardWidth:right+gap;
     event.style.setProperty('--event-y',y+'px');
     event.style.setProperty('--event-width',cardWidth+'px');
     event.style.setProperty('--event-x',Math.max(0,Math.min(w-cardWidth,x))+'px');
     event.style.setProperty('--event-align',placeLeft?'right':'left');
     y+=cardHeight+minVerticalGap+extraGap;
   });
   // Mobile-only art direction for three featured milestones.
   // Keep these corrections after automatic positioning so relayouts retain them.
   if(window.innerWidth<=767){
     const move=(index,dx,dy)=>{
       const event=events[index];
       if(!event)return;
       const x=parseFloat(event.style.getPropertyValue('--event-x'))||0;
       const top=parseFloat(event.style.getPropertyValue('--event-y'))||0;
       const width=parseFloat(event.style.getPropertyValue('--event-width'))||0;
       event.style.setProperty('--event-x',Math.max(0,Math.min(w-width,x+dx))+'px');
       event.style.setProperty('--event-y',Math.max(0,top+dy)+'px');
     };
     move(1,-28,28); // 1990: slightly left and down
     move(4,28,0);  // 1999: slightly right
     // 2026: position below and to the left of the sauce path.
     const milestone2026=events[14];
     if(milestone2026){
       const cardWidth=parseFloat(milestone2026.style.getPropertyValue('--event-width'))||0;
       const currentY=parseFloat(milestone2026.style.getPropertyValue('--event-y'))||0;
       milestone2026.style.setProperty('--event-x',Math.max(0,w*.12-cardWidth*.5)+'px');
       milestone2026.style.setProperty('--event-y',(currentY+55)+'px');
       milestone2026.style.setProperty('--event-align','left');
     }
     const milestone2017=events[11],milestone2023=events[12];
     if(milestone2017&&milestone2023){
       const x2023=parseFloat(milestone2023.style.getPropertyValue('--event-x'))||0;
       const w2023=parseFloat(milestone2023.style.getPropertyValue('--event-width'))||0;
       const w2017=parseFloat(milestone2017.style.getPropertyValue('--event-width'))||0;
       const y2023=parseFloat(milestone2023.style.getPropertyValue('--event-y'))||0;
       const rightX=x2023+w2023+20;
       milestone2017.style.setProperty('--event-x',Math.min(w-w2017,rightX)+'px');
       milestone2017.style.setProperty('--event-y',y2023+'px');
       milestone2017.style.setProperty('--event-align','left');
     }
   }
 }
 if(stage&&sauce){
   const show=progress=>{sauce.style.clipPath=`inset(0 0 ${(1-progress)*100}% 0)`};
   if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&window.gsap&&window.ScrollTrigger){
     gsap.registerPlugin(ScrollTrigger);
     sauceTrigger=ScrollTrigger.create({trigger:stage,start:'top 75%',end:'bottom 70%',scrub:true,onUpdate:self=>{show(self.progress);syncEvents(self.progress)}});
   }else show(1);
   let relayoutFrame=0;
   const relayout=()=>{
     cancelAnimationFrame(relayoutFrame);
     relayoutFrame=requestAnimationFrame(()=>{
       layoutSauce();
       if(sauceTrigger){sauceTrigger.refresh();syncEvents(sauceTrigger.progress)}
     });
   };
   if(sauce.complete&&sauce.naturalWidth)relayout();
   else sauce.addEventListener('load',relayout,{once:true});
   // Featured illustrations change card heights when their image data arrives.
   stage.querySelectorAll('.history-art').forEach(img=>{
     if(!img.complete)img.addEventListener('load',relayout,{once:true});
   });
   window.addEventListener('resize',relayout);
   window.addEventListener('load',relayout);
   if(document.fonts){
     document.fonts.ready.then(relayout);
     document.fonts.addEventListener?.('loadingdone',relayout);
   }
 }
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduced&&window.gsap&&window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  events.forEach(event=>{
    const copy=event.querySelector('.history-copy'),art=event.querySelector('.history-art'),dots=[...event.querySelectorAll('.flour-particle')];
    gsap.set(copy,{autoAlpha:0,y:18});
    if(art)gsap.set(art,{scale:1.07,transformOrigin:'center center'});
    const tl=gsap.timeline({paused:true}).to(copy,{autoAlpha:1,y:0,duration:.85,ease:'power2.out'},.15);
    dots.forEach((dot,j)=>{const angle=(j*2.39996),distance=20+(j%8)*8;tl.fromTo(dot,{x:0,y:0,opacity:0},{keyframes:[{opacity:.6,duration:.2},{x:Math.cos(angle)*distance,y:Math.sin(angle)*distance,opacity:0,duration:.65}],ease:'power1.out'},(j%7)*.025)});
    if(art)tl.to(art,{scale:1,duration:.65,ease:'power2.out'},.4);
    eventAnimations.push({event,tl});
  });
  if(sauceTrigger)syncEvents(sauceTrigger.progress);
 }
});
