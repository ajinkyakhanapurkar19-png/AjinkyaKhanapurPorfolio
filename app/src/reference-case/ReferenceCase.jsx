import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import metrics from './metrics.json';
import DocumentEvidence from './DocumentEvidence.jsx';
import '../templates/templates.css';
import '../templates/source-0.css';
import '../templates/source-1.css';
import '../templates/source-2.css';
import '../templates/source-3.css';
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

// Original Figma components remain the only layout and typography source.
// Nodes are reused by ID; unassigned source content never leaks into a project.
export function adaptSource(Source, {text = {}, media = {}, keep = [], omit = [], styles = {}, images, select, band, tint = false, reflow = false} = {}) {
 const retained = new Set(keep), excluded = new Set(omit);
 const source = typeof Source === 'function' ? Source() : Source;
 function locate(node, id) {
  if (!React.isValidElement(node)) return null;
  if (node.props['data-node-id'] === id) return node;
  for (const child of React.Children.toArray(node.props.children)) {const found=locate(child,id);if(found)return found;}
  return null;
 }
 function visit(node, preserveMedia = false) {
  if (!React.isValidElement(node)) return null;
  const id = node.props['data-node-id'];
  if (excluded.has(id)) return null;
  if (['img','svg','path'].includes(node.type)) return preserveMedia ? {element:node,meaningful:true} : null;
  const measure = metrics[id] || {};
  const props = {...node.props, key:id || node.key, 'data-reference-node':id, 'data-ref-layout':measure.display === 'flex' ? (measure['flex-direction'] || 'row') : measure.display, 'data-ref-absolute':measure.position === 'absolute' ? '' : undefined};
  delete props['data-source-action']; delete props['aria-label'];
  if (id) props['data-name'] = text[id] ? 'Project content' : 'Reference layout';
  props.style={...node.props.style,...styles[id]};
  if(tint)for(const key of ['color','background-color','border-color']){
   const color=measure[key];if(!color)continue;
   const rgb=color.startsWith('#')?color.slice(1).match(/../g)?.map(x=>parseInt(x,16)):color.match(/[\d.]+/g)?.map(Number);
   if(rgb?.length>=3&&rgb[2]>rgb[0]+25&&rgb[2]>rgb[1]+10)props.style[key.replace(/-([a-z])/g,(_,l)=>l.toUpperCase())]=key==='color'?'#468a61':'#245d43';
  }
  if(measure.position==='absolute')props.style['--reference-mobile-order']=Math.round((parseFloat(measure.top)||0)*2000+(parseFloat(measure.left)||0));
  if (measure['font-size']) props.style['--reference-font-size']=measure['font-size'];
  if (Object.hasOwn(text,id)) {
   props['data-ref-text']='';
   if(reflow)Object.assign(props.style,{display:'block',position:'relative',inset:'auto',transform:'none',translate:'none',minWidth:0,maxWidth:'100%',height:'auto',maxHeight:'none',whiteSpace:'normal',overflow:'visible',overflowWrap:'anywhere',lineHeight:parseFloat(measure['font-size'])>=32?1.1:1.5});
   const value = text[id];
   const first = React.Children.toArray(node.props.children).find(c=>React.isValidElement(c)&&['p','span'].includes(c.type));
   const lines=Array.isArray(value)?value:[value];
   const children = first ? lines.map((line,i)=>React.cloneElement(first,{key:i,...(reflow?{style:{...first.props.style,whiteSpace:'normal',lineHeight:'inherit',maxWidth:'100%',width:'auto',height:'auto'}}:{})},line)) : value;
   // Source text boxes may have fixed heights for their old text. Keep width,
   // tracking, line height and type; let new copy determine its vertical measure.
   props.style.height='auto';
   return {element:React.cloneElement(node,props,children),meaningful:true};
  }
  if (Object.hasOwn(media,id)) {
   const config=typeof media[id]==='string'?{name:media[id]}:media[id];
   props.className=`${props.className||''} reference-media-host`;
   const fixed = measure.position==='absolute' && measure.height?.endsWith('px');
   props.style={...props.style,display:'block',height:fixed?measure.height:'auto',...config.style};
   if(fixed)props.className+=' reference-fixed-media';
   const content=config.pair ? <div className={`reference-pair ${config.equal?'reference-pair-equal':''} ${config.pair.every(name=>images[name].height>images[name].width)?'reference-pair-phones':''}`}>{config.pair.map(name=><Evidence key={name} name={name} images={images}/>)}</div> : <Evidence {...config} images={images}/>;
   return {element:React.cloneElement(node,props,content),meaningful:true};
  }
  const children=React.Children.toArray(node.props.children).map(child=>visit(child,preserveMedia||retained.has(id))).filter(Boolean);
  const meaningful=retained.has(id)||children.some(c=>c.meaningful);
  const decorative=/Divider/.test(node.props['data-name']||'');
  if(!meaningful&&!decorative)return null;
  if(reflow&&meaningful){
   // Keep the source tree and columns, but let replacement copy set their height.
   // Small numbered badges retain their square geometry; structural rules do not.
   const badge=parseFloat(measure.width)<=100&&measure.width===measure.height;
   props['data-ref-flow']='';
   Object.assign(props.style,{minWidth:0,maxWidth:'100%',maxHeight:'none',overflow:'visible',...(!badge?{height:'auto',minHeight:0}:{}),...(measure.position==='absolute'?{position:'relative',inset:'auto',transform:'none',translate:'none'}:{}),...(measure.display==='grid'?{gridTemplateRows:'none',gridAutoRows:'auto'}:{})});
  }
  return {element:React.cloneElement(node,props,children.map(c=>c.element)),meaningful};
 }
 let selected=select?locate(source,select):source;
 if(band)selected=React.cloneElement(source,{},React.Children.toArray(source.props.children).filter(child=>{
  const top=parseFloat(metrics[child.props?.['data-node-id']]?.top);return top>=band[0] && top<band[1];
 }));
 if(!selected)throw new Error(`Source node not found: ${select}`);
 return visit(selected)?.element || null;
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

export function mappedBlock(config,prefix,images,project={}){
 const fields={'[MY ROLE]':project.role,'[PROJECT DURATION]':project.duration,'[MY REFLECTION]':project.reflection||project.learning,'[FUTURE IMPROVEMENTS]':project.improvements,'[DOCUMENTED RESULTS, IF AVAILABLE]':project.outcomes,'[DOCUMENTED EVIDENCE, IF AVAILABLE]':project.outcomes,'[CONFIRM ACTUAL DELIVERABLES]':project.deliverables,'[ACTUAL LIMITATIONS]':project.limitations,'[MY NEXT STEPS]':project.nextSteps,'[CONFIRM FINAL CAMERA CONTROLS AND BEHAVIOR]':project.actualBehavior};
 const resolve=value=>Array.isArray(value)?value.map(resolve):Object.entries(fields).reduce((text,[marker,replacement])=>replacement?text.replaceAll(marker,replacement):text,String(value));
 config={...config,text:Object.fromEntries(Object.entries(config.text||{}).map(([id,value])=>[id,resolve(value)]))};
 const keys=object=>Object.fromEntries(Object.entries(object||{}).map(([id,value])=>[prefix+id,value]));
 return {...config,text:keys(config.text),media:keys(config.media),styles:keys(config.styles),omit:(config.omit||[]).map(id=>prefix+id),keep:(config.keep||[]).map(id=>prefix+id),images};
}
