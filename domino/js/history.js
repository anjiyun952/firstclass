document.addEventListener('DOMContentLoaded',()=>{
 const events=[...document.querySelectorAll('.history-event')];
 const brandBar=document.querySelector('.history-intro .brand-tabs');
 if(brandBar){const active=brandBar.querySelector('.brand-tab.is-active'),indicator=brandBar.querySelector('.menu-tab-indicator');const place=()=>{if(active&&indicator){indicator.style.width=active.offsetWidth+'px';indicator.style.transform='translateX('+active.offsetLeft+'px)'}};place();window.addEventListener('resize',place);if(document.fonts)document.fonts.ready.then(place);}

 // Reveal the uploaded sauce graphic progressively as the user scrolls.
 const sauce=document.querySelector('.history-sauce');
 const stage=document.querySelector('.history-stage');
 if(sauce&&stage){
   const show=progress=>{sauce.style.clipPath=`inset(0 0 ${(1-progress)*100}% 0)`};
   if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&window.gsap&&window.ScrollTrigger){
     gsap.registerPlugin(ScrollTrigger);
     ScrollTrigger.create({trigger:stage,start:'top 75%',end:'bottom 70%',scrub:true,onUpdate:self=>show(self.progress)});
   }else{show(1)}
 }
 // Read the actual transparent PNG silhouette to place milestones beside the sauce.
 // The image is stretched to the stage, so sample its alpha at the same relative Y.
 if(sauce&&stage&&events.length){
   let imageData=null;
   const measure=()=>{
     if(!imageData)return;
     const stageRect=stage.getBoundingClientRect();
     const stageWidth=stage.clientWidth,stageHeight=stage.scrollHeight;
     const iw=imageData.width,ih=imageData.height,pixels=imageData.data;
     const gap=window.innerWidth<=480?16:40;
     events.forEach(event=>{
       const rect=event.getBoundingClientRect();
       const y=Math.max(0,Math.min(ih-1,Math.round((rect.top-stageRect.top+rect.height*.5)/stageHeight*(ih-1))));
       // Sample a small vertical band to avoid gaps in the distressed ink.
       let left=iw,right=-1;
       for(let yy=Math.max(0,y-3);yy<=Math.min(ih-1,y+3);yy++){
         for(let x=0;x<iw;x+=2){
           if(pixels[(yy*iw+x)*4+3]>90){left=Math.min(left,x);right=Math.max(right,x)}
         }
       }
       if(right<0){left=right=iw*.5}
       const sauceLeft=left/iw*stageWidth,sauceRight=right/iw*stageWidth;
       const itemWidth=event.offsetWidth;
       const leftRoom=sauceLeft-gap,rightRoom=stageWidth-sauceRight-gap;
       const placeLeft=leftRoom>=rightRoom;
       let x=placeLeft?sauceLeft-gap-itemWidth:sauceRight+gap;
       x=Math.max(0,Math.min(stageWidth-itemWidth,x));
       event.style.setProperty('--event-x',x+'px');
       event.style.setProperty('--event-align',placeLeft?'right':'left');
     });
   };
   const loadShape=()=>{
     const source=new Image();
     source.onload=()=>{
       const canvas=document.createElement('canvas');
       canvas.width=source.naturalWidth;canvas.height=source.naturalHeight;
       const context=canvas.getContext('2d',{willReadFrequently:true});
       if(!context)return;
       context.drawImage(source,0,0);
       try{imageData=context.getImageData(0,0,canvas.width,canvas.height)}catch(e){return}
       measure();
     };
     source.src=sauce.currentSrc||sauce.src;
   };
   loadShape();
   window.addEventListener('resize',measure);
   window.addEventListener('load',measure);
   if(document.fonts)document.fonts.ready.then(measure);
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
