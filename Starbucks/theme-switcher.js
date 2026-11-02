/* 20 selectable styles + Original. Keep each page's base stylesheet intact. */
(() => {
 const themes = {
  original:{file:"",className:""},
  minimalism:{file:"theme-collection.css",className:"theme-minimalism"},
  editorial:{file:"theme-collection.css",className:"theme-editorial"},
  swiss:{file:"theme-collection.css",className:"theme-swiss"},
  bento:{file:"theme-collection.css",className:"theme-bento"},
  glass:{file:"glassmorphism.css",className:"glassmorphism"},
  clay:{file:"theme-collection.css",className:"theme-clay"},
  neo:{file:"neo-brutalism.css",className:"neo-brutalism"},
  maximalism:{file:"theme-collection.css",className:"theme-maximalism"},
  kinetic:{file:"theme-collection.css",className:"theme-kinetic"},
  grainy:{file:"theme-collection.css",className:"theme-grainy"},
  y2k:{file:"theme-collection.css",className:"theme-y2k"},
  pixel:{file:"theme-collection.css",className:"theme-pixel"},
  memphis:{file:"theme-collection.css",className:"theme-memphis"},
  bauhaus:{file:"theme-collection.css",className:"theme-bauhaus"},
  popart:{file:"theme-collection.css",className:"theme-popart"},
  collage:{file:"collage.css",className:"collage-style"},
  risograph:{file:"theme-collection.css",className:"theme-risograph"},
  artdeco:{file:"theme-collection.css",className:"theme-artdeco"},
  cyberpunk:{file:"theme-collection.css",className:"theme-cyberpunk"},
  isometric:{file:"theme-collection.css",className:"theme-isometric"}
 };
 const select=document.getElementById("design-theme");
 const stylesheet=document.getElementById("active-theme-css");
 if(!select||!stylesheet)return;
 const classes=Object.values(themes).map(t=>t.className).filter(Boolean);
 const storageKey="starbucks-design-theme";
 function apply(key){
   const theme=themes[key]||themes.original;
   document.body.classList.remove(...classes);
   if(theme.className)document.body.classList.add(theme.className);
   if(theme.file){stylesheet.href=theme.file;stylesheet.disabled=false;}
   else{stylesheet.disabled=true;stylesheet.removeAttribute("href");}
   select.value=themes[key]?key:"original";
 }
 let initial="collage";
 try{initial=localStorage.getItem(storageKey)||initial;}catch(_){}
 apply(initial);
 select.addEventListener("change",()=>{
  apply(select.value);
  try{localStorage.setItem(storageKey,select.value);}catch(_){}
 });
})();
