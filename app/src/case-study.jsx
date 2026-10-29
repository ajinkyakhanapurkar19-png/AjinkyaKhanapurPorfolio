import React, { useEffect, useRef, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { profile } from './content.js';
import ShotGun from './shotgun/ShotGun.jsx';
import Title from './shotgun/Title.jsx';
import Summary from './shotgun/AConceptAppThatTakesAWeekendGameFromAnyoneFreeToABookedTurfWithEveryonesSharePaid.jsx';
import Meta from './shotgun/Meta.jsx';
import Glimpse from './shotgun/GlimpseWholeFlow.jsx';
import NavGlass from './shotgun/NavGlass.jsx';
import Footer from './shotgun/FooterStandard.jsx';
import NextProject from './shotgun/NextProject.jsx';
import ChapterHowItStarted from './shotgun/ChapterHowItStarted.jsx';
import ChapterWhoItsFor from './shotgun/ChapterWhoItsFor.jsx';
import ChapterResearch from './shotgun/ChapterResearch.jsx';
import ChapterNumbers from './shotgun/ChapterNumbers.jsx';
import ChapterMarket from './shotgun/ChapterMarket.jsx';
import ChapterWorthSolving from './shotgun/ChapterWorthSolving.jsx';
import ChapterReframe from './shotgun/ChapterReframe.jsx';
import ChapterFirstTry from './shotgun/ChapterFirstTry.jsx';
import ChapterWhatChanged from './shotgun/ChapterWhatChanged.jsx';
import ChapterDetails from './shotgun/ChapterDetails.jsx';
import ChapterBrand from './shotgun/ChapterBrand.jsx';
import ChapterBusiness from './shotgun/ChapterBusiness.jsx';
import ChapterFinePrint from './shotgun/ChapterFinePrint.jsx';
import ChapterWalkthrough from './shotgun/ChapterWalkthrough.jsx';
import ChapterMeasuring from './shotgun/ChapterMeasuring.jsx';
import ChapterNext from './shotgun/ChapterNext.jsx';
import bolt from '../../assets/case-study/03a90be5-d38ac.svg';
import book from '../../assets/case-study/03a90be5-deaba.svg';
import './shotgun/reference.css';
import './case-study.css';

// Original ShotGun copy is retained as reference/template content, not an authorship claim.
const chapters = [
 ['started','How it started',ChapterHowItStarted,279],
 ['audience','Who it’s for',ChapterWhoItsFor,491],
 ['research','What I heard',ChapterResearch,705],
 ['evidence','How often',ChapterNumbers,431,true],
 ['market','Who else tried',ChapterMarket,1218,true],
 ['opportunity','Is it worth it?',ChapterWorthSolving,513,true],
 ['reframe','The reframe',ChapterReframe,506],
 ['first-try','First try',ChapterFirstTry,1375,true],
 ['changed','What changed',ChapterWhatChanged,963],
 ['details','The details',ChapterDetails,750],
 ['brand','Brand',ChapterBrand,1688,true],
 ['business','Business',ChapterBusiness,1024,true],
 ['constraints','Fine print',ChapterFinePrint,616,true],
 ['walkthrough','Walkthrough',ChapterWalkthrough,888],
 ['measuring','Measuring it',ChapterMeasuring,555],
 ['next','What’s next',ChapterNext,850],
];
const slideTimes=[0,.10744,.21488,.32231,.42975,.53719,.64463,.75207,.8595];

function useSourceInteractions(root,mode){
 useEffect(()=>{
  const page=root.current,cleanups=[];
  const makeAction=(node,action,label,role='button')=>{
   if(!node)return;
   node.setAttribute('role',role);node.tabIndex=0;
   if(label)node.setAttribute('aria-label',label);
   const click=event=>{event.preventDefault();action();};
   const key=event=>{if(event.key==='Enter'||(event.key===' '&&role==='button')){event.preventDefault();action();}};
   node.addEventListener('click',click);node.addEventListener('keydown',key);
   cleanups.push(()=>{node.removeEventListener('click',click);node.removeEventListener('keydown',key);});
  };
  const links={'Brand':'./index.html','Link · Home':'./index.html','Link · Projects':'./index.html#projects','Link · About':'./index.html#about','Link · Résumé':'./index.html#contact','Let’s connect':`mailto:${profile.email}`};
  for(const [name,url] of Object.entries(links)){
   const node=page.querySelector(`header [data-name="${name}"]`);
   if(node?.tagName==='A')node.href=url;else makeAction(node,()=>{window.location.href=url;},null,'link');
  }
  const footerLinks={...links,'Link · Email':`mailto:${profile.email}`,'Link · LinkedIn':profile.links.linkedin};
  for(const [name,url] of Object.entries(footerLinks)){
   const node=page.querySelector(`footer [data-name="${name}"]`);
   if(node?.tagName==='A')node.href=url;else makeAction(node,()=>{window.location.href=url;},null,'link');
  }
  makeAction(page.querySelector('footer [data-name="Back to top"]'),()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}),'Back to top');
  const walk=page.querySelector('#walkthrough');
  if(walk){
   const preference=matchMedia('(prefers-reduced-motion: reduce)'),animations=walk.getAnimations({subtree:true});
   let visible=false,manualPause=false;
   const sync=()=>animations.forEach(a=>visible&&!manualPause&&!document.hidden&&!preference.matches?a.play():a.pause());
   animations.forEach(a=>{a.pause();a.currentTime=0;});
   const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.12});observer.observe(walk);
   const player=walk.querySelector('[data-name="Bezel"]');
   makeAction(player,()=>{manualPause=!manualPause;sync();player.setAttribute('aria-label',manualPause?'Play product walkthrough':'Pause product walkthrough');},'Pause product walkthrough');
   walk.querySelectorAll('[data-name^="Step ·"]').forEach((node,i)=>makeAction(node,()=>{manualPause=true;animations.forEach(a=>{a.pause();a.currentTime=slideTimes[i]*24200;});player?.setAttribute('aria-label','Play product walkthrough');},`Show ${node.textContent.trim()}`));
   document.addEventListener('visibilitychange',sync);preference.addEventListener('change',sync);
   cleanups.push(()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);preference.removeEventListener('change',sync);animations.forEach(a=>a.pause());});
  }
  return()=>cleanups.forEach(cleanup=>cleanup());
 },[root,mode]);
}

export default function CaseStudy(){
 const root=useRef();
 const [mode,setMode]=useState('full'),[active,setActive]=useState('overview'),[indexOpen,setIndexOpen]=useState(false);
 const visibleChapters=chapters.filter(c=>mode==='full'||!c[4]);
 useSourceInteractions(root,mode);
 useEffect(()=>{
  let request;
  const update=()=>{request=null;let id='overview';root.current.querySelectorAll('[data-case-chapter]').forEach(n=>{if(n.getBoundingClientRect().top<innerHeight*.3)id=n.id;});setActive(id);};
  const schedule=()=>{if(!request)request=requestAnimationFrame(update);};
  update();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  return()=>{removeEventListener('scroll',schedule);removeEventListener('resize',schedule);cancelAnimationFrame(request);};
 },[mode]);
 return <div className="shotgun-page" ref={root} data-reading-mode={mode}>
  <a className="sg-skip" href="#overview">Skip to case study</a>
  <header className="sg-nav" aria-label="Main navigation"><NavGlass/></header>
  <div className="sg-shell">
   <aside className={`sg-index ${indexOpen?'is-open':''}`}>
    <button className="sg-index-toggle" aria-expanded={indexOpen} aria-controls="story-index" onClick={()=>setIndexOpen(v=>!v)}>In this story <span>{indexOpen?'−':'+'}</span></button>
    <nav id="story-index" aria-label="Case study chapters">{[['overview','Overview'],...visibleChapters].map(([id,label])=><a key={id} href={`#${id}`} aria-current={id===active?'location':undefined} onClick={()=>setIndexOpen(false)}>{label}</a>)}</nav>
   </aside>
   <main className="sg-content">
    <section id="overview" className="sg-overview" data-case-chapter data-od-id="case-overview" aria-label="ShotGun overview">
     <a className="sg-back" href="./index.html#projects"><span aria-hidden="true">‹</span> Projects</a>
     <div className="sg-project-name"><ShotGun/></div>
     <div className="sg-project-title"><Title/></div>
     <div className="sg-summary"><Summary/></div>
     <div className="sg-meta"><Meta/></div>
     <div className="sg-overview-visual"><Glimpse/></div>
     <p className="sg-caption">The whole hi-fi flow in one strip: find a slot, form the squad, confirm and pay.</p>
    </section>
    <div className="sg-reading" role="group" aria-label="Reading depth">
     <button aria-pressed={mode==='skim'} onClick={()=>setMode('skim')}><span className="sg-reading-icon"><img src={bolt} alt="" width="20" height="20"/></span><span><strong>Skim it</strong><small>The highlights · 3 min</small></span></button>
     <button aria-pressed={mode==='full'} onClick={()=>setMode('full')}><span className="sg-reading-icon sg-book"><img src={book} alt="" width="20" height="20"/></span><span><strong>Read it all</strong><small>Research to rollout · 9 min</small></span></button>
    </div>
    {visibleChapters.map(([id,label,Component,height])=><section className="sg-chapter" id={id} key={id} style={{'--source-height':`${height}px`}} data-case-chapter data-od-id={`case-${id}`} aria-label={label}><Component/></section>)}
    <a className="sg-next-project" href="./index.html#projects" aria-label="Explore more projects"><NextProject/></a>
   </main>
  </div>
  <footer className="sg-footer"><Footer/></footer>
 </div>;
}
if(typeof document!=='undefined'){
 const root=document.getElementById('root');
 // Match Vite's absolute production asset URLs before hydrating prerendered HTML.
 root.querySelectorAll('img[src]').forEach(img=>{const src=img.getAttribute('src');if(!src.startsWith('data:'))img.setAttribute('src',new URL(src,document.baseURI).href);});
 if(root.hasChildNodes())hydrateRoot(root,<CaseStudy/>);else createRoot(root).render(<CaseStudy/>);
}
