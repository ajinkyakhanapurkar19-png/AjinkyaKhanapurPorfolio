import React,{useEffect,useRef,useState} from 'react';
import {Browser,Phone} from './WebsiteMockup.jsx';
import Brand from './Brand.jsx';
import {StudioScene} from './Showcase.jsx';
import HeroTablet from './HeroTablet.jsx';
import {screenshotSurfaces} from './screenshot-surfaces.js';
import {project,references} from './content.js';
import './presentation.css';
import './hero-tablet.css';
import {PortfolioBackLink, NextProject, LiveWebsiteLink} from '../reference-case/ProjectNavigation.jsx';
import '../reference-case/case-mobile.css';
import './mobile.css';

const chapters=[['overview','Overview'],['project','About the project'],['identity','Brand identity'],['visual-system','Type & colour'],['website','Desktop experience'],['mobile','Mobile experience']];
const pages=[['home-desktop','Homepage'],['services-desktop','Services'],['about-desktop','About Us'],['detail-desktop','Product Analytics']];
const capturedPages=Object.entries(screenshotSurfaces).map(([name,{label}])=>[name,label]);
const desktopCaptures=capturedPages.filter(([name])=>name.endsWith('desktop'));
const viewLabels=[...pages,...capturedPages];
const swatches=[['#257F4C','GSC green'],['#111111','Ink'],['#40B970','Active green'],['#EDF3EF','Soft green'],['#FFFFFF','White'],['#5F5F5F','Secondary text']];
function SectionTitle({eyebrow,children,description}){return <header className="gs-section-head"><div><p className="gs-eyebrow">{eyebrow}</p><h2>{children}</h2></div>{description&&<p className="gs-section-description">{description}</p>}</header>;}
export default function Page(){
 const progress=useRef(null),menu=useRef(null),viewer=useRef(null),trigger=useRef(null);
 const [active,setActive]=useState('overview'),[preview,setPreview]=useState('home-desktop'),[selected,setSelected]=useState('growth-solutions-desktop');
 useEffect(()=>{
  let frame=0;
  const update=()=>{frame=0;const max=document.documentElement.scrollHeight-innerHeight;progress.current.style.transform=`scaleX(${Math.min(1,scrollY/Math.max(1,max))})`;let id='overview';chapters.forEach(([key])=>{if(document.getElementById(key)?.getBoundingClientRect().top<180)id=key;});setActive(old=>old===id?old:id);};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const observer=new ResizeObserver(schedule);observer.observe(document.querySelector('.gs-page'));addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);update();
  return()=>{observer.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',schedule);cancelAnimationFrame(frame);document.documentElement.classList.remove('gs-modal-open');};
 },[]);
 const jump=(event,id)=>{event.preventDefault();const target=document.getElementById(id);if(!target)return;if(menu.current?.open){trigger.current=target;menu.current.close();}window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+scrollY-88),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});history.replaceState(null,'',`#${id}`);target.focus({preventScroll:true});};
 const open=(name,button)=>{trigger.current=button;setPreview(name);viewer.current.showModal();document.documentElement.classList.add('gs-modal-open');};
 const close=()=>{document.documentElement.classList.remove('gs-modal-open');trigger.current?.focus({preventScroll:true});};
 return <div className="gs-page">
  <a className="gs-skip" href="#project">Skip to project story</a>
  <div className="gs-progress" aria-hidden="true"><span ref={progress}/></div>
  <nav className="gs-nav" aria-label="Case study navigation">
   <PortfolioBackLink/>
   <div className="gs-nav-links">{[['project','Project'],['identity','Identity'],['website','Website'],['mobile','Mobile']].map(([id,label])=><a key={id} href={`#${id}`} onClick={e=>jump(e,id)} aria-current={active===id?'location':undefined}>{label}</a>)}</div>
   <button className="gs-menu-button" type="button" aria-label="Open case study chapters" aria-haspopup="dialog" onClick={e=>{trigger.current=e.currentTarget;menu.current.showModal();document.documentElement.classList.add('gs-modal-open');}}>Chapters <span aria-hidden="true">☰</span></button>
  </nav>
  <main>
   <section className="gs-panel gs-cover" id="overview" data-od-id="overview" tabIndex={-1}>
    <div className="gs-cover-top"><Brand light/><p>CONSULTANCY WEBSITE<br/>STRATEGY · UX/UI · RESPONSIVE DESIGN</p></div>
    <div className="gs-cover-heading"><h1>Growth<br/>Supercharge<span className="gs-title-dot">.</span></h1><div><p>A clearer way<br/>to see growth.</p><div className="case-project-actions"><LiveWebsiteLink href={project.liveUrl} name={project.name} target="gsc-website-live"/><a href="#website" onClick={e=>jump(e,'website')}>Explore the website <span aria-hidden="true">↘</span></a></div></div></div>
    <HeroTablet onInspect={open}/>
    <div className="gs-cover-bottom"><span>Growth Supercharge / Website design</span><span>Clarity. Structure. Character.</span></div>
   </section>

   <section className="gs-panel gs-project" id="project" data-od-id="project" tabIndex={-1}>
    <div className="gs-about-grid"><h2>About<br/>the project:</h2><p>Growth Supercharge brings strategy, data, marketing and technology together to help businesses approach growth. The website needed to make that breadth feel coherent, with a clear starting point for visitors.</p><p>The design connects a confident first impression with a structured service experience. A shared visual language carries the story from the homepage to Services, About Us and Contact, across desktop and mobile.</p></div>
    <div className="gs-brief-grid"><div><h2>The<br/>design brief:</h2><p className="gs-eyebrow">CLARITY BEFORE COMPLEXITY</p></div><div><p className="gs-brief-statement">How can a broad consultancy offering become a website that feels clear, credible and easy to explore?</p><p className="gs-brief-note">A design question guiding the presentation and hierarchy of the site.</p></div></div>
    <div className="gs-metadata"><h3>Project</h3><dl><div><dt>Brand /</dt><dd>Growth Supercharge</dd></div><div><dt>Category /</dt><dd>Growth consultancy</dd></div><div><dt>Scope /</dt><dd>Strategy · Information architecture · UI design</dd></div><div><dt>Website /</dt><dd>Home · Services · About Us · Contact</dd></div><div><dt>Role /</dt><dd>{project.role}</dd></div><div><dt>Duration /</dt><dd>{project.duration}</dd></div></dl></div>
    <details className="gs-process"><summary><span>Research & structure</span><span className="gs-plus" aria-hidden="true">+</span></summary><div className="gs-process-content"><div><h3>Looking at the consultancy landscape</h3><p>The brief names The Growth Consultancy, Kanvic and xto10x as references for positioning, service hierarchy and navigation. The original research board remains to be supplied; these references are not presented as user-tested findings.</p><div className="gs-reference-links">{references.filter(r=>r.url).map(r=><a key={r.name} href={r.url} target="_blank" rel="noreferrer">{r.name} ↗</a>)}</div></div><div><h3>A clear route through the offering</h3><p>The implemented website moves from an opening proposition to eight service disciplines, with supporting About Us and Contact pages. Each service groups its explanation, deliverables and next action.</p><div className="gs-site-route"><span>Home</span><span>Services</span><span>About Us</span><span>Contact</span></div></div></div></details>
   </section>

   <section className="gs-panel gs-identity" id="identity" data-od-id="identity" tabIndex={-1}>
    <SectionTitle eyebrow="THE VISUAL SIGNATURE" description="One identity, from the first impression to the smallest detail.">Brand<br/>identity:</SectionTitle>
    <div className="gs-logo-stage"><div className="gs-logo-grid" aria-hidden="true"/><Brand/><span className="gs-logo-label">GROWTH SUPERCHARGE / PRIMARY LOCKUP</span></div>
    <div className="gs-brand-values"><span>Clarity</span><span>Structure</span><span>Momentum</span></div>
    <div className="gs-brand-applications"><div className="gs-symbol-panel"><span className="gs-eyebrow">THE MARK</span><Brand markOnly/><p>A recognisable signature<br/>at every scale.</p></div><div className="gs-identity-application"><div><span className="gs-eyebrow">IN CONTEXT</span><p>Made to belong<br/>on every page.</p></div><div className="gs-browser-detail"><div className="gs-browser-tab"><Brand markOnly/><span>Growth Supercharge</span><span aria-hidden="true">×</span></div><div className="gs-address-bar"><span aria-hidden="true">⌕</span> growthsupercharged.com</div><div className="gs-header-lockup"><Brand/><span aria-hidden="true">☰</span></div></div><span className="gs-application-caption">Browser tab & website identity</span></div></div>
   </section>

   <section className="gs-panel gs-system" id="visual-system" data-od-id="visual-system" tabIndex={-1}>
    <div className="gs-type-layout"><div className="gs-type-intro"><h2>Typography<br/>& colours:</h2><p>Clean letterforms, generous scale and deliberate weight changes give the website a confident voice. Headlines establish the proposition; quieter body text makes the offer easy to understand.</p><p>The GSC palette pairs green with white and near-black. Colour connects key actions and brand moments, while neutral surfaces keep the content in focus.</p></div><div className="gs-type-specimen" style={{'--specimen-weight':400}}><span>01 / REGULAR</span><h3>Inter</h3><span className="gs-specimen-letter" aria-hidden="true">Aa</span><p>Clear, open<br/>and direct.</p></div><div className="gs-type-specimen" style={{'--specimen-weight':500}}><span>02 / MEDIUM</span><h3>Inter</h3><span className="gs-specimen-letter" aria-hidden="true">Aa</span><p>Hierarchy<br/>with restraint.</p></div><div className="gs-type-specimen" style={{'--specimen-weight':700}}><span>03 / BOLD</span><h3>Inter</h3><span className="gs-specimen-letter" aria-hidden="true">Aa</span><p>A confident<br/>first impression.</p></div></div>
    <div className="gs-colour-grid">{swatches.map(([hex,name])=><div key={hex} className="gs-swatch" style={{backgroundColor:hex,color:['#257F4C','#111111','#5F5F5F'].includes(hex)?'#fff':'#10291e'}}><span>{name}</span><span>{hex}</span></div>)}</div>
    <p className="gs-small-note">Typeface and colour values drawn from the GSC website source.</p>
   </section>

   <section className="gs-panel gs-website" id="website" data-od-id="website" tabIndex={-1}>
    <SectionTitle eyebrow="THE WEBSITE IN CONTEXT" description="The opening, the offer, the story. A connected visual language across the consultancy website.">Mockup<br/>views:</SectionTitle>
    <div className="gs-studio-grid">
     <StudioScene name="growth-systems-desktop" scene="front" label="01 / Growth systems" onInspect={open}/>
     <StudioScene name="pricing-intelligence-desktop" scene="angle" label="02 / Pricing Intelligence" onInspect={open}/>
     <StudioScene name={selected} scene="wide" label={`03 / ${screenshotSurfaces[selected].label}`} onInspect={open}/>
    </div>
    <div className="gs-page-picker" role="group" aria-label="Choose a website view">{desktopCaptures.map(([name,label])=><button type="button" key={name} aria-pressed={name===selected} onClick={()=>setSelected(name)}>{label}</button>)}</div>
    <div className="gs-studio-grid gs-studio-grid--lower"><StudioScene name="about-desktop" scene="shadow" label="04 / The story behind the consultancy" onInspect={open}/><StudioScene name="detail-desktop" scene="laptop" label="05 / From the offer to the details" onInspect={open}/></div>
    <div className="gs-website-caption"><h3>A system that<br/>holds together.</h3><p>Large statements introduce the business. Structured service pages explain the offer. Consistent navigation and calls to action connect them, without making each page feel identical.</p></div>
   </section>

   <section className="gs-panel gs-mobile" id="mobile" data-od-id="mobile" tabIndex={-1}>
    <SectionTitle eyebrow="THE RESPONSIVE EXPERIENCE" description="The same identity and content, composed for a smaller screen.">Mobile<br/>website:</SectionTitle>
    <div className="gs-mobile-grid">
     <article className="gs-mobile-story"><p className="gs-eyebrow">THE STORY BEHIND GSC</p><h3>Growth,<br/>by design.</h3><p className="gs-mobile-copy">The About Us introduction connects strategy, intelligence, technology and execution.</p><Phone name="about-mobile"/><button className="gs-mobile-inspect" type="button" onClick={e=>open('about-mobile',e.currentTarget)}>Inspect About Us ↗</button></article>
     <div className="gs-mobile-center"><Phone name="product-analytics-mobile"/><div className="gs-mobile-center-caption"><Brand/><span>Product Analytics.<br/>From insight to action.</span></div><button className="gs-mobile-inspect" type="button" onClick={e=>open('product-analytics-mobile',e.currentTarget)}>Inspect Product Analytics ↗</button></div>
     <article className="gs-mobile-story gs-mobile-story--services"><p className="gs-eyebrow">THE PEOPLE BEHIND THE WORK</p><h3>Experience,<br/>in perspective.</h3><Phone name="team-mobile"/><p className="gs-mobile-copy">A cinematic city view frames the consultancy’s team and network.</p><button className="gs-mobile-inspect" type="button" onClick={e=>open('team-mobile',e.currentTarget)}>Inspect team section ↗</button></article>
    </div>
   </section>
  </main>
  <footer className="gs-footer"><div><p className="gs-eyebrow">GROWTH SUPERCHARGE / WEBSITE CASE STUDY</p><p>Clarity is<br/>the starting point.</p></div><div><p>Bringing a broad consultancy offering into a coherent digital experience, through structure, hierarchy and a consistent visual identity.</p><div className="case-project-actions"><LiveWebsiteLink href={project.liveUrl} name={project.name} target="gsc-website-live"/></div></div><div className="gs-footer-base"><span>Ajinkya Khanapurkar</span><a href="#overview" onClick={e=>jump(e,'overview')}>Back to top ↑</a></div></footer>
  <NextProject current="gsc"/>
  <dialog ref={menu} className="gs-dialog gs-chapters" onClose={close} aria-labelledby="gs-menu-title"><div className="gs-dialog-top"><h2 id="gs-menu-title">The case study</h2><button autoFocus type="button" onClick={()=>menu.current.close()} aria-label="Close chapters">×</button></div><nav aria-label="Chapter index">{chapters.map(([id,label],i)=><a key={id} href={`#${id}`} aria-current={active===id?'location':undefined} onClick={e=>jump(e,id)}><span>{String(i+1).padStart(2,'0')}</span>{label}<span aria-hidden="true">↗</span></a>)}</nav></dialog>
  <dialog ref={viewer} className={`gs-dialog gs-viewer ${preview.endsWith('mobile')?'gs-viewer--phone':''}`} onClose={close} aria-labelledby="gs-viewer-title"><div className="gs-dialog-top"><div><p className="gs-eyebrow">GROWTH SUPERCHARGE</p><h2 id="gs-viewer-title">{viewLabels.find(([key])=>key===preview)?.[1]||(preview==='home-mobile'?'Mobile homepage':'Mobile services')}</h2></div><button autoFocus type="button" onClick={()=>viewer.current.close()} aria-label="Close design view">×</button></div><div className="gs-viewer-content">{preview.endsWith('mobile')?<Phone name={preview}/>:<Browser name={preview}/>}</div><p className="gs-viewer-note">{screenshotSurfaces[preview]?'Original GSC website screenshot. Shown in full, without cropping.':'Website design from the GSC project. Controls within the preview are presentation only.'}</p></dialog>
 </div>;
}
