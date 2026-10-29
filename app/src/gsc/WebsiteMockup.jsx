import React,{useState,useRef,useEffect} from 'react';
import surfaces from './source-surfaces.json';
import {screenshotSurfaces} from './screenshot-surfaces.js';
import './mockups.css';
import './source-surfaces.css';
import './source-presentation.css';

export function Screen({name}){
 const capture=screenshotSurfaces[name];
 if(capture)return <div className="gsc-device-screen gsc-device-screen--capture" data-screen={name} style={{aspectRatio:`${capture.width}/${capture.height}`}}>
  <img className="gsc-screen-capture" src={capture.src} alt={capture.alt} width={capture.width} height={capture.height} loading="lazy" decoding="async"/>
 </div>;
 return <SourceScreen name={name}/>;
}
function SourceScreen({name}){
 const surface=surfaces[name];
 const screen=useRef(null);
 useEffect(()=>{const node=screen.current;const resize=()=>node.style.setProperty('--screen-scale',node.clientWidth/surface.width);resize();const observer=new ResizeObserver(resize);observer.observe(node);return()=>observer.disconnect();},[surface.width]);
 return <div ref={screen} className="gsc-device-screen" role="img" aria-label={`Growth Supercharge ${surface.label} website design`} style={{aspectRatio:`${surface.width}/${surface.height}`}}>
  <div className={`gsc-source-surface gsc-source-${name}`} aria-hidden="true" inert="" style={{width:surface.width,height:surface.height,'--source-width':`${surface.width}px`}} dangerouslySetInnerHTML={{__html:surface.html}}/>
 </div>;
}
export function Browser({name,className='',label='growthsupercharged.com'}){
 return <div className={`gsc-browser ${className}`}>
  <div className="gsc-browser-chrome" aria-hidden="true"><span className="gsc-window-dots"><i/><i/><i/></span><span>{label}</span><span>↗</span></div>
  <Screen name={name}/>
 </div>;
}
export function Phone({name='services-mobile',className=''}){
 const isCapture=Boolean(screenshotSurfaces[name]);
 return <div className={`gsc-device-phone ${isCapture?'gsc-device-phone--capture':''} ${className}`}>
  {!isCapture&&<div className="gsc-phone-top" aria-hidden="true"><span>9:41</span><i/><span>▰</span></div>}
  <Screen name={name}/><span className="gsc-phone-home" aria-hidden="true"/>
 </div>;
}
function SiteMap(){return <div className="gsc-map"><div className="gsc-map-root">Growth Supercharge<span>Consultancy website</span></div><div className="gsc-map-branches">{[['Home','Positioning','Service overview','Next step'],['Services','Eight disciplines','Deliverables','Consultation'],['About Us','Philosophy','Principles','Approach'],['Contact','Contact information','Inquiry form']].map(([title,...items])=><div className="gsc-map-page" key={title}><strong>{title}</strong>{items.map(t=><span key={t}>{t}</span>)}</div>)}</div><p>Structure of the implemented website</p></div>;}
const pages=[['home-desktop','Homepage'],['services-desktop','Services'],['about-desktop','About Us']];
export default function WebsiteMockup({variant='hero',expanded=false}){
 const [page,setPage]=useState('home-desktop');
 if(variant==='map')return <SiteMap/>;
 const layout=variant==='hero'?'hero':variant==='responsive'?'responsive':variant==='navigation'?'navigation':variant==='detail'?'detail':variant==='final'?'final':'services';
 return <div className={`gsc-mockup gsc-mockup--${layout} ${expanded?'gsc-mockup--expanded':''}`}>
  {variant==='final'&&<div className="gsc-preview-pages" role="group" aria-label="Website pages">{pages.map(([key,label])=><button type="button" key={key} aria-pressed={page===key} onClick={()=>setPage(key)}>{label}</button>)}</div>}
  <div className="gsc-mockup-scene">
   {layout==='hero'&&<><Browser name="home-desktop" className="gsc-desktop-hero"/><Phone className="gsc-phone-hero"/><span className="gsc-scene-label">ONE IDENTITY. EVERY SCREEN.</span></>}
   {layout==='services'&&<><Browser name="services-desktop"/><span className="gsc-scene-label">FROM STRATEGY TO THE NEXT STEP.</span></>}
   {layout==='navigation'&&<><Browser name="navigation-desktop"/><div className="gsc-nav-path" aria-hidden="true"><span>Home</span><i>→</i><span>Services</span><i>→</i><span>Consultation</span></div></>}
   {layout==='detail'&&<><Browser name="detail-desktop"/><span className="gsc-scene-label">THE OFFER. THE DELIVERABLES. THE ACTION.</span></>}
   {layout==='final'&&<Browser name={page}/>}
   {layout==='responsive'&&<><Phone name="home-mobile"/><Phone name="services-mobile"/><span className="gsc-scene-label">THE SAME STORY, AT A DIFFERENT SCALE.</span></>}
  </div>
 </div>;
}
