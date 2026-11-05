document.addEventListener('DOMContentLoaded',()=>{
 const events=[...document.querySelectorAll('.history-event')];
 const brandBar=document.querySelector('.history-intro .brand-tabs');
 if(brandBar){const active=brandBar.querySelector('.brand-tab.is-active'),indicator=brandBar.querySelector('.menu-tab-indicator');const place=()=>{if(active&&indicator){indicator.style.width=active.offsetWidth+'px';indicator.style.transform='translateX('+active.offsetLeft+'px)'}};place();window.addEventListener('resize',place);if(document.fonts)document.fonts.ready.then(place);}

 // Keep the retouched transparent PNG at its natural aspect ratio.
 const sauce=document.querySelector('.history-sauce');
 const stage=document.querySelector('.history-stage');
 let sauceTrigger;
 const eventAnimations=[];
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
   const w=stage.clientWidth;
   const minGap=w<520?42:72;
   const paddingY=w<520?36:72;
   const totalCards=events.reduce((sum,event)=>sum+event.offsetHeight,0);
   const targetHeight=totalCards+Math.max(0,events.length-1)*minGap+paddingY;
   const h=Math.max(targetHeight,stage.clientHeight);
   stage.style.height=h+'px';
   const iw=sauce.naturalWidth,ih=sauce.naturalHeight;
   // Match the image's actual rendered box and object-fit:contain dimensions.
   const stageRect=stage.getBoundingClientRect();
   const imageRect=sauce.getBoundingClientRect();
   const scale=Math.min(imageRect.width/iw,imageRect.height/ih);
   const paintedWidth=iw*scale,paintedHeight=ih*scale;
   const offsetX=imageRect.left-stageRect.left+(imageRect.width-paintedWidth)/2;
   const offsetY=imageRect.top-stageRect.top+(imageRect.height-paintedHeight)/2;
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
 }
 if(stage&&sauce){
   const show=progress=>{sauce.style.clipPath=`inset(0 0 ${(1-progress)*100}% 0)`};
   if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&window.gsap&&window.ScrollTrigger){
     gsap.registerPlugin(ScrollTrigger);
     sauceTrigger=ScrollTrigger.create({trigger:stage,start:'top 75%',end:'bottom 70%',scrub:true,onUpdate:self=>{show(self.progress);syncEvents(self.progress)}});
   }else show(1);
   const relayout=()=>{layoutSauce();if(sauceTrigger){sauceTrigger.refresh();syncEvents(sauceTrigger.progress)}};
   if(sauce.complete&&sauce.naturalWidth)layoutSauce();
   else sauce.addEventListener('load',relayout,{once:true});
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
    eventAnimations.push({event,tl});
  });
  if(sauceTrigger)syncEvents(sauceTrigger.progress);
 }
});
