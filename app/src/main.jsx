import React, { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile, projects } from './content';
import { rollPhotos } from './roll-photos.js';
import ProjectStack, { selectedWork } from './project-stack.jsx';
import { createProjectReveal } from './project-stack-motion.js';
import { createAboutReveal } from './about-reveal.js';
import './seed.css';
import './portfolio.css';

gsap.registerPlugin(ScrollTrigger);
const Scene = lazy(() => import('./scene.jsx'));
const pad = n => String(n).padStart(2, '0');
const chapters = [['camera','The camera'],['focus','Focus'],['screen','Into the screen'],['work','The roll'],['projects','Selected projects'],['about','Behind the lens'],['contact','Contact']];
const disciplines = ['Website design','UI & UX design','Interaction design','Service design','Design systems','3D generation & AI'];
// Supplied by Ajinkya for this chapter. No unverified case-study URLs.
const images = import.meta.glob('../../assets/*.{jpg,png}',{eager:true,query:'?url',import:'default'});
const asset = name => images[`../../assets/${name}`];
function Icon({kind='arrow',...props}) {
 return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" {...props}>{kind==='arrow'?<path d="M5 19 19 5M5 5h14v14"/>:kind==='next'?<path d="m9 5 7 7-7 7"/>:kind==='prev'?<path d="m15 5-7 7 7 7"/>:kind==='close'?<path d="m5 5 14 14M5 19 19 5"/>:<><circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/></>}</svg>;
}
function Picture({name,alt,...props}) {
 const [broken,setBroken]=useState(false);
 return broken?<div className="ph-img" role="img" aria-label={`${alt} — image unavailable`}>Image unavailable</div>:<img src={asset(name)} alt={alt} onError={()=>setBroken(true)} {...props}/>;
}
class SceneBoundary extends React.Component {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(error){console.error('[portfolio] Camera scene failed:',error);this.props.onError();}
 render(){return this.state.failed?null:this.props.children;}
}
function ClosingFilm(){
 const strip=useRef();
 const [paused,setPaused]=useState(false);
 useEffect(()=>{
  const element=strip.current;
  let visible=false;
  const update=()=>{element.dataset.running=String(visible&&!document.hidden);};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update();});
  observer.observe(element);
  document.addEventListener('visibilitychange',update);
  return ()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);};
 },[]);
 return <div className="closing-film" ref={strip} data-paused={paused}>
  <div className="closing-film-track" aria-hidden="true">
   {[0,1].map(copy=><div className="closing-film-group" key={copy}>
    {rollPhotos.map(photo=><div className="closing-film-frame" key={photo.label}>
     <img src={photo.src} alt="" loading="lazy" decoding="async" width="494" height="234"/>
     <span className="closing-film-number">{photo.label} ▷</span>
    </div>)}
   </div>)}
  </div>
  <button className="closing-film-control" type="button" aria-label={paused?'Play film strip':'Pause film strip'} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>
   <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">{paused?<path d="M4 2 13 8 4 14Z"/>:<><path d="M3 2h3v12H3Z"/><path d="M10 2h3v12h-3Z"/></>}</svg>
  </button>
 </div>;
}
function App(){
 const root=useRef();
 const modelState=useRef({progress:0,waypoints:[],invalidate:()=>{},reduced:false,mobile:false,heroProgress:0});
 const allDialog=useRef();
 const previousFocus=useRef();
 const [sceneAllowed,setSceneAllowed]=useState(false); const [sceneStatus,setSceneStatus]=useState('loading');
 const [copyStatus,setCopyStatus]=useState('Copy email');
 const [filter,setFilter]=useState('All work');
 const reduced=useRef(matchMedia('(prefers-reduced-motion: reduce)').matches);
 const filtered=projects.filter(p=>filter==='All work'||(filter==='Design'? !['tudoom','still-stillness'].includes(p.id):['tudoom','still-stillness'].includes(p.id)));
 function jump(id){
  const el=document.getElementById(id);if(!el)return;
  let y=el.getBoundingClientRect().top+window.scrollY-(id==='screen'?0:76);
  // Direct navigation lands on the readable About spread, after its arrival.
  if(id==='about'){
   const arrival=el.querySelector('.about-arrival');
   if(arrival?.dataset.animated==='true')y+=arrival.offsetHeight-arrival.querySelector('.about-stage').offsetHeight+76;
  }
  window.scrollTo({top:Math.max(0,y),behavior:reduced.current?'instant':'smooth'});
 }
 function revealProjects(event){
  const section=document.getElementById('projects');
  const top=section.getBoundingClientRect().top+window.scrollY;
  const travel=section.offsetHeight-section.querySelector('.project-stack-stage').offsetHeight;
  const complete=event.currentTarget.dataset.complete==='true';
  window.scrollTo({top:top+(complete?0:travel*.97),behavior:reduced.current?'instant':'smooth'});
 }
 function openIndex(){previousFocus.current=document.activeElement;allDialog.current.showModal();}
 function closeIndex(){allDialog.current.close();previousFocus.current?.focus();}
 async function copyEmail(){
  try{await navigator.clipboard.writeText(profile.email);setCopyStatus('Email copied');}
  catch{setCopyStatus('Select the email below to copy');}
 }
 useEffect(()=>{
  const start=()=>{
   const canvas=document.createElement('canvas');let gl;
   try{gl=canvas.getContext('webgl2',{failIfMajorPerformanceCaveat:true})||canvas.getContext('webgl');}catch{}
   if(!gl){setSceneStatus('fallback');return;}
   gl.getExtension('WEBGL_lose_context')?.loseContext();setSceneAllowed(true);
  };
  const id='requestIdleCallback'in window?requestIdleCallback(start,{timeout:650}):setTimeout(start,80);
  return()=>{'cancelIdleCallback'in window?cancelIdleCallback(id):clearTimeout(id);};
 },[]);
 useLayoutEffect(()=>{
  const mm=gsap.matchMedia();
  mm.add({all:'(min-width: 0px)',desktop:'(min-width: 1000px)',compact:'(max-width: 699px)',short:'(max-height: 640px), (max-width: 699px) and (max-height: 740px)',reduce:'(prefers-reduced-motion: reduce)'},ctx=>{
   const {desktop,reduce,short}=ctx.conditions;
   modelState.current.progress=0;
   reduced.current=reduce;modelState.current.reduced=reduce;modelState.current.mobile=!desktop;
   document.documentElement.dataset.motion=reduce?'reduced':'full';
   let maxScroll=1; let layout={focus:0,screen:0,work:0,about:0,contact:0,hero:1,turn:0,entry:1};
   const filmVisual=document.querySelector('.roll-visual');
   const rollStage=document.querySelector('.roll-stage');
   const projectReveal=createProjectReveal(root.current,{staticLayout:reduce||short});
   const aboutReveal=createAboutReveal(root.current,{reduced:reduce,sticky:desktop&&!short});
   const top=id=>document.getElementById(id).getBoundingClientRect().top+window.scrollY;
   const measure=()=>{
    maxScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const screen=document.getElementById('screen'),h=innerHeight;
    layout={focus:top('focus'),screen:top('screen'),work:top('work'),projects:top('projects'),about:top('about'),contact:top('contact'),hero:document.getElementById('camera').offsetHeight};
    // Start turning during Focus, at its close-up, instead of holding the
    // front view until the following section. Keep all stops scroll-derived.
    layout.turn=layout.focus+h*.12;
    const travel=Math.max(0,screen.offsetHeight-h);
    layout.entry=layout.screen+travel*.86;
    const rect=filmVisual.getBoundingClientRect(),stageRect=rollStage.getBoundingClientRect();
    layout.film={x:rect.left,y:rect.top-stageRect.top,width:rect.width,height:rect.height};
    layout.stageHeight=rollStage.offsetHeight;
    layout.rollDistance=Math.max(h*.5,layout.projects-layout.work-layout.stageHeight);
    const projectSection=document.getElementById('projects');
    layout.projectDistance=Math.max(1,projectSection.offsetHeight-projectSection.querySelector('.project-stack-stage').offsetHeight);
    projectReveal.measure();
    aboutReveal.measure();
    const arrival=document.querySelector('.about-arrival');
    layout.aboutStart=layout.about-(desktop&&!short?0:h*.45);
    layout.aboutDistance=desktop&&!short?Math.max(1,arrival.offsetHeight-arrival.querySelector('.about-stage').offsetHeight):h*.55;
    const contactRect=document.querySelector('.contact-camera-stage').getBoundingClientRect();
    layout.contactFrame={x:contactRect.left,y:contactRect.top+window.scrollY,width:contactRect.width,height:contactRect.height};
    layout.contactStart=layout.about+h*.12;
    layout.contactRest=Math.max(layout.contactStart+1,layout.contact-h*.15);
    const stops=[
     ['opening',0],['front',Math.max(h*.3,layout.focus-h*.5)],
     ['closeup',layout.turn],['rear',layout.turn+h*.5],['screen',layout.turn+h*.65],
     ['inside',layout.entry],['inside',layout.about],['about',layout.contactStart],['contact',layout.contactRest]
    ];
    modelState.current.waypoints=stops.map(([name,s])=>({name,at:Math.min(1,Math.max(0,s/maxScroll))}));
   };
   const paint=()=>{
    const s=modelState.current.progress*maxScroll;
    const screenProgress=gsap.utils.clamp(0,1,(s-layout.turn)/Math.max(1,layout.entry-layout.turn));
    modelState.current.screenProgress=screenProgress;
    modelState.current.screenActive=s>=layout.screen-innerHeight*.4&&s<layout.work;
    // The LCD fills the viewport before the roll begins. Reverse scroll uses
    // the same timeline, without timers or per-frame React state updates.
    const workStart=reduce?layout.work-innerHeight*.65:Math.min(layout.entry,layout.work);
    const workActive=s>=workStart&&s<layout.projects;
    const stageY=desktop&&!reduce?Math.max(layout.work-s,Math.min(0,layout.projects-layout.stageHeight-s)):layout.work-s;
    modelState.current.rollActive=workActive;
    modelState.current.rollProgress=reduce?0:gsap.utils.clamp(0,1,(s-layout.work)/layout.rollDistance);
    modelState.current.rollReveal=reduce?1:gsap.utils.clamp(0,1,(s-workStart)/(innerHeight*.2));
    modelState.current.filmRect={...layout.film,y:layout.film.y+stageY};
    gsap.set('.roll-stage',{opacity:reduce?1:modelState.current.rollReveal});
    projectReveal.paint((s-layout.projects)/layout.projectDistance);
    aboutReveal.paint((s-layout.aboutStart)/layout.aboutDistance);
    const contactProgress=gsap.utils.clamp(0,1,(s-layout.contactStart)/(layout.contactRest-layout.contactStart));
    modelState.current.contactBlend=reduce?Number(s>=layout.contactRest):contactProgress*contactProgress*(3-2*contactProgress);
    // Track native document position, independently of scrub smoothing, so
    // the resting camera stays immediately above its links during scrolling.
    modelState.current.contactFrame={...layout.contactFrame,y:layout.contactFrame.y-window.scrollY};
    const heroProgress=reduce?0:gsap.utils.clamp(0,1,s/(layout.hero*0.86));
    modelState.current.heroProgress=heroProgress;
    gsap.set('.hero-copy',{opacity:1-heroProgress,y:-heroProgress*44});
    gsap.set('.hero-details',{opacity:1-heroProgress});
    const idx=s<layout.focus-innerHeight*.4?0:s<layout.screen-innerHeight*.35?1:s<layout.work-innerHeight*.15?2:s<layout.projects-innerHeight*.2?3:s<layout.about-innerHeight*.4?4:s<layout.contact-innerHeight*.4?5:6;
    document.querySelectorAll('[data-chapter]').forEach(el=>{
     const yes=Number(el.dataset.chapter)===idx;el.dataset.active=String(yes);
     if(yes)el.setAttribute('aria-current','location');else el.removeAttribute('aria-current');
    });
    const chapterName=document.getElementById('current-chapter');if(chapterName){chapterName.textContent=`${pad(idx+1)} / ${chapters[idx][1]}`;chapterName.hidden=idx===6;}
    const progress=document.querySelector('.reading-progress');if(progress)progress.style.transform=`scaleX(${modelState.current.progress})`;
    const wasVisible=modelState.current.visible;
    modelState.current.visible=workActive||idx<4||idx===6;
    if(modelState.current.visible||wasVisible!==modelState.current.visible)modelState.current.invalidate();
   };
   measure();
   const timeline=gsap.timeline({scrollTrigger:{trigger:'#content',start:'top top',end:'bottom bottom',scrub:reduce?true:0.65,invalidateOnRefresh:true,onRefresh:measure}});
   timeline.fromTo(modelState.current,{progress:0},{progress:1,ease:'none',duration:1,onUpdate:paint});
   const onRefresh=()=>{measure();paint();};ScrollTrigger.addEventListener('refresh',onRefresh);
   document.querySelectorAll('.portrait img').forEach(img=>{if(!img.complete)img.addEventListener('load',onRefresh,{once:true});});
   document.fonts.ready.then(()=>{if(!ctx.isReverted)ScrollTrigger.refresh();});
   // ResizeObserver observes width only to avoid pin-spacer feedback loops.
   let previousWidth=innerWidth,previousHeight=innerHeight;
   const onResize=()=>{if(innerWidth!==previousWidth||innerHeight!==previousHeight){previousWidth=innerWidth;previousHeight=innerHeight;ScrollTrigger.refresh();}};
   window.addEventListener('resize',onResize);
   const refreshFrame=requestAnimationFrame(()=>ScrollTrigger.refresh());
   return()=>{cancelAnimationFrame(refreshFrame);timeline.scrollTrigger?.kill();timeline.kill();projectReveal.dispose();aboutReveal.dispose();ScrollTrigger.removeEventListener('refresh',onRefresh);window.removeEventListener('resize',onResize);document.querySelectorAll('.portrait img').forEach(img=>img.removeEventListener('load',onRefresh));gsap.set('.hero-copy,.hero-details,.roll-stage',{clearProps:'opacity,transform'});};
  },root);
  return()=>mm.revert();
 },[]);
 useEffect(()=>{ScrollTrigger.refresh();},[sceneStatus]);
 useEffect(()=>{if(copyStatus==='Copy email')return;const t=setTimeout(()=>setCopyStatus('Copy email'),3000);return()=>clearTimeout(t);},[copyStatus]);
 return <div ref={root} data-scene={sceneStatus}>
  <a className="skip-link" href="#work" onClick={e=>{e.preventDefault();jump('work');}}>Skip to work</a>
  <div className="reading-progress" aria-hidden="true"/>
  <header className="topnav" data-od-id="topnav">
   <div className="container topnav-inner">
    <a className="wordmark hero-wordmark" href="#camera" onClick={e=>{e.preventDefault();jump('camera');}} aria-label="Ajinkya Khanapurkar, back to the camera">AK <span>/ PORTFOLIO</span></a>
    <nav aria-label="Main navigation"><a className="nav-work" href="#work" onClick={e=>{e.preventDefault();jump('work');}}>Work</a>{[['about','About'],['contact','Contact']].map(([id,label])=><a key={id} href={`#${id}`} onClick={e=>{e.preventDefault();jump(id);}}>{label}</a>)}</nav>
    <span className="hero-record"><i aria-hidden="true"/> THROUGH THE 35MM LENS</span>
   </div>
  </header>
  <div className={`scene-layer ${sceneStatus==='ready'?'is-ready':''}`} aria-hidden="true">
   {sceneAllowed&&<SceneBoundary onError={()=>setSceneStatus('fallback')}><Suspense fallback={null}><Scene journey={modelState} onReady={()=>{setSceneStatus('ready');ScrollTrigger.refresh();}} onFailure={()=>setSceneStatus('fallback')}/></Suspense></SceneBoundary>}
  </div>
  <main id="content">
   {/* Layout 1 / centered title, with the supplied 3D camera in the foreground. */}
   <section id="camera" className="section hero camera-hero" data-od-id="camera" data-screen-label="01 The camera">
    <div className="hero-copy hero-center">
     <h1 className="hero-name"><span>AJINKYA</span>{' '}<span>KHANAPURKAR</span></h1>
    </div>
    <div className="hero-viewfinder hero-details" aria-hidden="true"><span className="frame-corner tl"/><span className="frame-corner tr"/><span className="frame-corner bl"/><span className="frame-corner br"/></div>
    <div className="hero-intro hero-details">
     <p className="hero-role">{profile.role}</p>
     <p className="lead">I craft meaningful digital experiences, with a storyteller’s eye.</p>
     <a href="#screen" className="hero-work-link" onClick={e=>{e.preventDefault();jump('screen');}}>Enter the camera <Icon/></a>
    </div>
    {sceneStatus!=='ready'&&<div className={`hero-model-status ${sceneStatus==='fallback'?'fallback':''}`} role="status">{sceneStatus==='fallback'?'The camera view is unavailable. Use Work to explore the portfolio.':'Bringing the camera into focus…'}</div>}
    <a href="#focus" className="hero-focus-scale hero-details" onClick={e=>{e.preventDefault();jump('focus');}}>
     <span className="scale-label">SCROLL TO EXPLORE <span>↓</span></span>
     <span className="focus-ticks" aria-hidden="true"/>
    </a>
    <span className="hero-side-note hero-details" aria-hidden="true">OBSERVE. FRAME. CREATE.</span>
   </section>
   {/* Layout 2 / split detail. */}
   <section id="focus" className="section focus-section" data-od-id="focus" data-screen-label="02 Focus">
    <div className="container hero-split focus-grid">
     <div className="focus-visual" aria-hidden="true"><span className="focus-reticle"/><span className="focus-caption meta">LESS NOISE. MORE INTENTION.</span></div>
     <div className="focus-copy"><p className="eyebrow chapter-label">02 / FOCUS</p><h2>Good design starts<br/>with a closer <em>look.</em></h2><p className="lead">I believe in combining creativity with functionality, ensuring that every design not only looks great but works flawlessly.</p><div className="focus-notes"><span>Research</span><span>Interaction</span><span>Experience</span></div></div>
    </div>
   </section>
   {/* The actual GLB LCD becomes the viewport. This is scroll space, not
       a project gallery or a page-wide overlay; the film chapter follows. */}
   <section id="screen" className="section screen-entry" data-od-id="screen" data-screen-label="03 Into the screen" aria-label="Camera rear-screen transition">
    <h2 className="sr-only">Into the screen</h2>
    {sceneStatus==='fallback'&&<p className="screen-fallback">The 3D camera is unavailable. <a href="#work" onClick={e=>{e.preventDefault();jump('work');}}>Continue to Work ↓</a></p>}
   </section>
   {/* Layout 2 split + Layout 7 ruled list, adapted around a live film spiral. */}
   <section id="work" className="section roll-section" data-od-id="work" data-screen-label="04 The roll" aria-labelledby="roll-title">
    <div className="roll-stage">
     <div className="roll-corners" aria-hidden="true"><span className="frame-corner tl"/><span className="frame-corner tr"/><span className="frame-corner bl"/><span className="frame-corner br"/></div>
     <div className="roll-layout">
      <div className="roll-intro">
       <p className="meta roll-kicker">04 / THE ROLL</p>
       <h2 id="roll-title">My work,<br/>in focus.</h2>
       <p className="roll-body">I design websites, interfaces and experiences — connecting how something looks with how it works.</p>
       <p className="meta roll-label">ACROSS MY PRACTICE</p>
       <ul className="roll-disciplines">{disciplines.map(d=><li key={d}>{d}</li>)}</ul>
      </div>
      <div className="roll-visual" aria-hidden="true">
       <div className="roll-fallback"><div className="fallback-negative">{rollPhotos.map(photo=><img key={photo.label} src={photo.src} alt="" loading="lazy"/>)}</div></div>
      </div>
      <div className="roll-projects">
       <p className="roll-body roll-context">From the Pristine Forests redesign to GSC’s website system, spatial 3D experiences and websites for office tools.</p>
       <div className="roll-project-heading"><h3>Selected projects</h3><span className="meta">01—04</span></div>
       <ol className="roll-project-list">{selectedWork.map((title,i)=><li className="log-row" key={title}><span className="num">{pad(i+1)}.</span><span>{title}</span></li>)}</ol>
       <button className="roll-archive" onClick={openIndex}>Explore earlier work <Icon/></button>
      </div>
     </div>
     <a className="roll-next meta" href="#projects" onClick={e=>{e.preventDefault();jump('projects');}}>SELECTED PROJECTS <span>↓</span></a>
    </div>
   </section>
   <ProjectStack onReveal={revealProjects} onContinue={e=>{e.preventDefault();jump('about');}}/>
   {/* Editorial portrait and biography, followed by a centered creative statement. */}
   <section id="about" className="section about-section" data-od-id="about" data-screen-label="06 Behind the lens">
    <div className="about-arrival">
     <div className="about-stage container">
      <div className="about-grid">
       <div className="portrait">
        <div className="portrait-media"><Picture name="portrait.png" alt="Ajinkya Khanapurkar" loading="lazy" width="590" height="1024"/></div>
        <div className="portrait-caption" data-about-reveal><span>AJINKYA KHANAPURKAR</span><span>IN FOCUS, ALWAYS.</span></div>
       </div>
       <div className="about-copy">
        <div className="about-heading" data-about-reveal><p className="eyebrow chapter-label">06 / BEHIND THE LENS</p><h2>About.</h2></div>
        <h3 className="about-statement" data-about-reveal>The person behind<br/>the perspective.</h3>
        <div className="about-columns" data-about-reveal><p className="lead">{profile.biography}</p><p className="about-approach">{profile.approach}</p></div>
        <a className="text-link resume-link" data-about-reveal href={profile.resume||`mailto:${profile.email}?subject=Portfolio%20resume%20request`}>{profile.resume?'View resume':'Resume · available on request'} <Icon/></a>
       </div>
      </div>
     </div>
    </div>
    <div className="container about-details">
     <div className="off-screen">
      <span className="meta">WHEN I’M NOT DESIGNING</span>
      <h3 className="off-screen-title">Chasing <em>light.</em> Collecting <em>stories.</em><br/>Finding the <em>extraordinary</em> in the everyday.</h3>
     </div>
    </div>
   </section>
   {/* Layout 6 / closing CTA, with a calmer final camera composition. */}
   <section id="contact" className="section contact-section" data-od-id="contact" data-screen-label="Contact">
    <div className="container contact-layout">
     <div className="contact-copy">
      <h2>Something worth<br/><em>making together?</em></h2>
      <a className="contact-cta" href={`mailto:${profile.email}`}>Let’s talk <Icon/></a>
      <p className="lead">Let’s bring a new perspective to your next project.</p>
      <div className="email-row"><a href={`mailto:${profile.email}`}>{profile.email}</a><button aria-label="Copy email address" className="copy-email" onClick={copyEmail}>{copyStatus}</button></div>
     </div>
     <div className="contact-camera-stage" aria-hidden="true"/>
     <div className="contact-bottom">
      <div className="social-links">{Object.entries(profile.links).map(([label,url])=><a key={label} href={url} target="_blank" rel="noreferrer">{label==='linkedin'?'LinkedIn':label==='behance'?'Behance':'Instagram'} <span>↗</span></a>)}</div>
      <a className="text-link" href="#camera" onClick={e=>{e.preventDefault();jump('camera');}}>Back to the camera <span>↑</span></a>
     </div>
    </div>
    <ClosingFilm/>
   </section>
  </main>
  <footer className="pagefoot" data-od-id="footer"><div className="container row-between"><span>© {new Date().getFullYear()} AJINKYA KHANAPURKAR</span><span className="meta">MADE WITH INTENTION. SEEN THROUGH A DIFFERENT LENS.</span><a href="#camera" onClick={e=>{e.preventDefault();jump('camera');}}>BACK TO TOP ↑</a></div></footer>
  <nav className="chapter-rail" aria-label="Portfolio chapters">{chapters.map(([id,label],i)=><a href={`#${id}`} key={id} data-chapter={i} data-active={i===0} aria-label={`${pad(i+1)} ${label}`} onClick={e=>{e.preventDefault();jump(id);}}><span className="chapter-dot"/><span className="chapter-tooltip">{label}</span></a>)}</nav>
  <div className="chapter-status meta" id="current-chapter" aria-hidden="true">01 / The camera</div>
  <dialog className="work-index" ref={allDialog} onCancel={()=>{previousFocus.current?.focus();}} onClick={e=>{if(e.target===allDialog.current)closeIndex();}} aria-label="Complete project index"><div className="index-content"><div className="row-between"><div><p className="eyebrow chapter-label">THE CONTACT SHEET</p><h2>All <em>work.</em></h2></div><button className="close-index" aria-label="Close project index" onClick={closeIndex}><Icon kind="close"/></button></div><div className="index-filters" aria-label="Filter projects">{['All work','Design','Film & photography'].map(f=><button key={f} className={filter===f?'active':''} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</button>)}</div><div className="index-list">{filtered.map(p=><article className="index-project" key={p.id}><Picture name={p.image} alt={p.title} width="110" height="80" loading="lazy"/><div><span className="meta">{p.category||'Project archive'}</span><h3>{p.title}</h3><p>{p.description||p.note}</p></div>{p.url?<a href={p.url} target="_blank" rel="noreferrer" aria-label={`Open ${p.title}`}><Icon/></a>:<span className="missing-link">Link unavailable</span>}</article>)}</div><p className="index-foot meta">Original projects. Different perspectives.</p></div></dialog>
  <div className="sr-only" role="status" aria-live="polite">{copyStatus==='Copy email'?'':copyStatus}</div>
 </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
