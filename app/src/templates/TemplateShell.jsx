import React, {useEffect, useRef, useState} from 'react';

const cases=[['Content Hub','content-hub-case-study.html'],['VR · Traces of Kuldhara','vr-case-study.html'],['ShotGun','shotgun-case-study.html']];

// Shared behavior for source-designed controls. No scroll hijacking or autoplay.
export default function TemplateShell({slug,title,width,height,background,chapters,children}){
 const root=useRef(null),dialog=useRef(null),missing=useRef(null),lightbox=useRef(null),trigger=useRef(null);
 const [active,setActive]=useState(0);
 const [preview,setPreview]=useState(null);
 const scrollToChapter=(item)=>{
  const target=root.current.querySelector(`[data-node-id="${item.id}"]`);
  const canvas=root.current.querySelector('.source-canvas');
  const top=target?target.getBoundingClientRect().top+window.scrollY:canvas.getBoundingClientRect().top+window.scrollY+item.y*(canvas.getBoundingClientRect().width/width);
  window.scrollTo({top:Math.max(0,top-20),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  history.replaceState(null,'',`#${item.id.replace(':','-')}`);
 };
 useEffect(()=>{
  const page=root.current;let frame=0;
  const update=()=>{
   frame=0;
   const scale=page.querySelector('.source-canvas').getBoundingClientRect().width/width;
   const y=window.scrollY/scale;
   let current=0;chapters.forEach((c,i)=>{if(c.y<=y+100/scale)current=i;});
   setActive(current);
   page.style.setProperty('--reading-progress',`${Math.min(100,100*window.scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))}%`);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const onClick=(event)=>{
   const button=event.target.closest('[data-template-index]');
   if(button){trigger.current=button;dialog.current.showModal();return;}
   const link=event.target.closest('[data-source-action]');
   if(!link)return;
   if(link.dataset.sourceAction==='top'){window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
   if(link.dataset.sourceAction==='missing'){trigger.current=link;missing.current.showModal();}
   if(link.dataset.sourceAction==='preview'){
    const img=link.parentElement.querySelector('img');
    if(img){trigger.current=link;setPreview({src:img.currentSrc||img.src,label:link.getAttribute('aria-label')});lightbox.current.showModal();}
   }
  };
  page.addEventListener('click',onClick);addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);update();
  if(location.hash){const c=chapters.find(c=>`#${c.id.replace(':','-')}`===location.hash);if(c)requestAnimationFrame(()=>scrollToChapter(c));}
  return()=>{page.removeEventListener('click',onClick);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);cancelAnimationFrame(frame);};
 },[chapters,width]);
 const close=()=>{dialog.current.close();trigger.current?.focus({preventScroll:true});};
 return <div ref={root} className={`figma-template template-${slug}`} style={{'--canvas-width':`${width}px`,'--canvas-height':`${height}px`,'--page-background':background}}>
  <a className="template-skip" href="#case-story">Skip to case study</a>
  <main id="case-story" className="source-canvas" aria-label={`${title} case study`}>
   <h1 className="visually-hidden">{title}</h1>{children}
  </main>
  <dialog ref={dialog} className="template-dialog" aria-labelledby="chapters-title">
   <div className="dialog-heading"><h2 id="chapters-title">In this case study</h2><button type="button" onClick={close} aria-label="Close chapters">×</button></div>
   <nav aria-label="Case study chapters">{chapters.map((c,i)=><button type="button" key={c.id} aria-current={active===i?'location':undefined} onClick={()=>{close();scrollToChapter(c);}}><span>{String(i+1).padStart(2,'0')}</span>{c.label}</button>)}</nav>
   <div className="template-other"><p>More case studies</p>{cases.map(([name,file])=><a key={file} href={`./${file}`}>{name}<span aria-hidden="true">↗</span></a>)}</div>
   <a className="template-home" href="./index.html#projects">Back to portfolio</a>
  </dialog>
  <dialog ref={missing} className="template-dialog" aria-labelledby="missing-link-title">
   <div className="dialog-heading"><h2 id="missing-link-title">Source link</h2><button type="button" onClick={()=>{missing.current.close();trigger.current?.focus({preventScroll:true});}} aria-label="Close">×</button></div>
   <p className="missing-copy">The Figma frame includes this action, but no destination URL. The link is awaiting the project information.</p>
  </dialog>
  <dialog ref={lightbox} className="template-dialog template-lightbox" aria-labelledby="preview-title">
   <div className="dialog-heading"><h2 id="preview-title">{preview?.label||'Project image'}</h2><button type="button" onClick={()=>{lightbox.current.close();trigger.current?.focus({preventScroll:true});}} aria-label="Close image">×</button></div>
   {preview&&<img src={preview.src} alt={preview.label}/>}
  </dialog>
 </div>;
}
