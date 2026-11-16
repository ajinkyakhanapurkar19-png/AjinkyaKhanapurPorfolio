import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import DocumentEvidence from './DocumentEvidence.jsx';
import './case-base.css';
import './reference-case.css';
import {PortfolioBackLink} from './ProjectNavigation.jsx';
import './case-mobile.css';

const Viewer = createContext(null);
// Reuse the existing lightbox from controls placed outside screenshot frames.
export function EvidenceAction({image, className = 'reference-image-open', children = 'View full image ↗'}) {
 const show = useContext(Viewer);
 if (!image?.src && !image?.render) return null;
 return <button type="button" className={className} aria-label={`Enlarge ${image.label}`} onClick={event=>show(image,event.currentTarget)}>{children}</button>;
}
export function Evidence({name, images, ratio, cover = false, enlarge = true, className = ''}) {
 const image = images[name];
 const [failed, setFailed] = useState(false);
 useEffect(()=>setFailed(false),[image?.src]);
 const show = useContext(Viewer);
 if (!image) throw new Error(`Unknown evidence slot: ${name}`);
 const available = Boolean(image.render || image.src) && !failed;
 return <div className={`reference-slot ${cover ? 'reference-cover' : ''} ${className}`} data-image-slot={name} style={{aspectRatio:ratio || `${image.width}/${image.height}`,'--image-position':image.position || '50% 50%'}}>
  {available ? <>{image.render ? image.render({expanded:false}) : image.kind==='document' ? <DocumentEvidence image={image}/> : <img src={image.src} alt={image.label} width={image.width} height={image.height} loading={image.loading || (cover ? 'eager' : 'lazy')} decoding="async" onError={()=>setFailed(true)}/>} {enlarge&&<button type="button" className="reference-image-open" aria-label={`Enlarge ${image.label}`} onClick={event=>show(image,event.currentTarget)}>{image.render?'Inspect design':image.kind==='document'?'Enlarge view':'Enlarge image'} ↗</button>}{image.experienceUrl&&<a className="reference-image-open reference-experience-open" href={image.experienceUrl} target="_blank" rel="noreferrer">Explore current gallery ↗</a>}</> : <div className="reference-slot-label"><span>{image.label}</span><code>{name}</code><small>{failed ? 'Image unavailable — check the image path.' : image.note}</small></div>}
 </div>;
}

export function ReferenceCase({slug,title,width,chapters,children}) {
 const root=useRef(null),menu=useRef(null),viewer=useRef(null),trigger=useRef(null),progress=useRef(null);
 const [active,setActive]=useState(0),[preview,setPreview]=useState(null);
 const jump=(event,id)=>{
  event.preventDefault(); menu.current.close();
  const target=document.getElementById(id);if(!target)return;
  window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+window.scrollY-(matchMedia('(max-width:999px)').matches?88:24)),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  trigger.current=target;target.focus({preventScroll:true});history.replaceState(null,'',`#${id}`);
 };
 useEffect(()=>{
  let frame=0;
  const update=()=>{frame=0;let next=0;chapters.forEach(([id],i)=>{if(document.getElementById(id)?.getBoundingClientRect().top<180)next=i;});setActive(v=>v===next?v:next);progress.current.style.transform=`scaleX(${Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))})`;};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const observer=new ResizeObserver(schedule);observer.observe(root.current);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);update();
  let hash='';try{hash=decodeURIComponent(location.hash.slice(1));}catch{}
  const target=document.getElementById(hash);
  if(target)requestAnimationFrame(()=>window.scrollTo({top:target.getBoundingClientRect().top+scrollY-(matchMedia('(max-width:999px)').matches?88:24)}));
  return()=>{observer.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',schedule);cancelAnimationFrame(frame);};
 },[chapters]);
 useEffect(()=>{
  const dialogs=[menu.current,viewer.current];const sync=()=>document.documentElement.classList.toggle('reference-modal-open',dialogs.some(d=>d.open));const observer=new MutationObserver(sync);dialogs.forEach(d=>observer.observe(d,{attributes:true,attributeFilter:['open']}));return()=>{observer.disconnect();document.documentElement.classList.remove('reference-modal-open');};
 },[]);
 const show=(image,button)=>{trigger.current=button;setPreview(image);viewer.current.showModal();};
 return <Viewer.Provider value={show}><div ref={root} className={`figma-template reference-case reference-${slug}`} style={{'--canvas-width':`${width}px`}}>
  <a className="template-skip" href="#case-story">Skip to case study</a>
  <div className="reference-progress" aria-hidden="true"><span ref={progress}/></div>
  <a className="reference-back" href="./index.html#projects">← &nbsp; Back to portfolio</a>
  <button type="button" className="reference-index" aria-label="Open case study chapters" aria-haspopup="dialog" onClick={event=>{trigger.current=event.currentTarget;menu.current.showModal();}}>☰</button>
  {["pf-met","exhibition"].includes(slug)&&<nav className="case-mobile-nav" aria-label="Case study navigation"><PortfolioBackLink/><button type="button" aria-haspopup="dialog" onClick={event=>{trigger.current=event.currentTarget;menu.current.showModal();}}>Chapters <span aria-hidden="true">☰</span></button></nav>}
  <main tabIndex={-1} id="case-story" className="reference-canvas" aria-label={`${title} case study`}><h1 className="visually-hidden">{title}</h1>{children}</main>
  <dialog ref={menu} className="template-dialog" aria-labelledby="reference-chapters" onClose={()=>trigger.current?.focus({preventScroll:true})}>
   <div className="dialog-heading"><h2 id="reference-chapters">{title}</h2><button type="button" aria-label="Close chapters" onClick={()=>menu.current.close()}>×</button></div>
   <nav aria-label="Case study chapters">{chapters.map(([id,label],i)=><a key={id} href={`#${id}`} aria-current={active===i?'location':undefined} onClick={e=>jump(e,id)}><span>{String(i+1).padStart(2,'0')}</span>{label}</a>)}</nav>
   <a className="template-home" href="./index.html#projects">Back to portfolio</a>
  </dialog>
  <dialog ref={viewer} className="template-dialog template-lightbox" aria-labelledby="reference-image-title" onClose={()=>trigger.current?.focus({preventScroll:true})}>
   <div className="dialog-heading"><h2 id="reference-image-title">{preview?.label||'Project image'}</h2><button type="button" aria-label="Close image" onClick={()=>viewer.current.close()}>×</button></div>{preview&&(preview.render?preview.render({expanded:true}):preview.kind==='document'?<iframe className="reference-document-expanded" src={preview.src} title={preview.label} sandbox="allow-same-origin" referrerPolicy="no-referrer"/>:<img src={preview.src} alt={preview.label}/>)}{preview?.caption&&<p className="reference-evidence-caption">{preview.caption}</p>}{preview?.kind==='document'&&!preview.render&&<a className="reference-full-view" href={preview.src} target="_blank" rel="noreferrer">Open full-size view ↗</a>}
  </dialog>
 </div></Viewer.Provider>;
}

export function Chapter({id,source,label,children,className='',style={}}) {
 return <section id={id} tabIndex={-1} className={`reference-chapter ${className}`} data-od-id={id} data-template-source={source} aria-label={label} style={style}>{children}</section>;
}
