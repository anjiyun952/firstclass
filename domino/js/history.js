document.addEventListener('DOMContentLoaded',()=>{
 const events=[...document.querySelectorAll('.history-event')];
 const brandBar=document.querySelector('.history-intro .brand-tabs');
 if(brandBar){const active=brandBar.querySelector('.brand-tab.is-active'),indicator=brandBar.querySelector('.menu-tab-indicator');const place=()=>{if(active&&indicator){indicator.style.width=active.offsetWidth+'px';indicator.style.transform='translateX('+active.offsetLeft+'px)'}};place();window.addEventListener('resize',place);if(document.fonts)document.fonts.ready.then(place);}

 // Keep the retouched transparent PNG at its natural aspect ratio.
 const sauce=document.querySelector('.history-sauce');
 const stage=document.querySelector('.history-stage');
 let sauceTrigger;
 function layoutSauce(){
   if(!stage||!sauce||!sauce.naturalWidth||!sauce.naturalHeight)return;
   const w=stage.clientWidth,h=stage.scrollHeight;
   const iw=sauce.naturalWidth,ih=sauce.naturalHeight;
   // Match the image's actual rendered box and object-fit:contain dimensions.
   const stageRect=stage.getBoundingClientRect();
   const imageRect=sauce.getBoundingClientRect();
   const scale=Math.min(imageRect.width/iw,imageRect.height/ih);
   const paintedWidth=iw*scale,paintedHeight=ih*scale;
   const offsetX=imageRect.left-stageRect.left+(imageRect.width-paintedWidth)/2;
   const offsetY=imageRect.top-stageRect.top+(imageRect.height-paintedHeight)/2;
   const preferredGap=w<520?28:80;
   const canvas=document.createElement('canvas');
   canvas.width=iw;canvas.height=ih;
   const ctx=canvas.getContext('2d',{willReadFrequently:true});
   if(!ctx)return;
   ctx.drawImage(sauce,0,0);
   let pixels;
   try{pixels=ctx.getImageData(0,0,iw,ih).data}catch(e){return}
   events.forEach(event=>{
     const rect=event.getBoundingClientRect();
     const cy=rect.top-stageRect.top+rect.height*.5;
     const imageY=Math.round((cy-offsetY)/scale);
     if(imageY<0||imageY>=ih)return;
     let left=iw,right=-1;
     // Use a broad band to include irregular, distressed edges.
     for(let yy=Math.max(0,imageY-5);yy<=Math.min(ih-1,imageY+5);yy++){
       for(let x=0;x<iw;x+=2){
         if(pixels[(yy*iw+x)*4+3]>45){left=Math.min(left,x);right=Math.max(right,x)}
       }
     }
     if(right<0){left=right=iw/2}
     const sauceLeft=offsetX+left*scale,sauceRight=offsetX+right*scale;
     const itemWidth=event.offsetWidth;
     const availableLeft=sauceLeft-itemWidth,availableRight=w-sauceRight-itemWidth;
     const placeLeft=availableLeft>=availableRight;
     const available=placeLeft?availableLeft:availableRight;
     // Prefer the full gap; if space is limited, never overlap the sauce.
     const gap=Math.max(0,Math.min(preferredGap,available));
     const x=placeLeft?sauceLeft-gap-itemWidth:sauceRight+gap;
     event.style.setProperty('--event-x',Math.max(0,Math.min(w-itemWidth,x))+'px');
     event.style.setProperty('--event-align',placeLeft?'right':'left');
   });
 }
 if(stage&&sauce){
   const show=progress=>{sauce.style.clipPath=`inset(0 0 ${(1-progress)*100}% 0)`};
   if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&window.gsap&&window.ScrollTrigger){
     gsap.registerPlugin(ScrollTrigger);
     sauceTrigger=ScrollTrigger.create({trigger:stage,start:'top 75%',end:'bottom 70%',scrub:true,onUpdate:self=>show(self.progress)});
   }else show(1);
   const relayout=()=>{layoutSauce();if(sauceTrigger)sauceTrigger.refresh()};
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
    ScrollTrigger.create({trigger:event,start:'top 78%',once:true,onEnter:()=>tl.play()});
  });
 }
});
